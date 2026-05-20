import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Public submission of an estimation → creates a "qualified" project
 * and triggers exclusive matching with the most relevant artisan.
 */
const submitSchema = z.object({
  client_name: z.string().trim().min(2).max(120),
  client_email: z.string().trim().email().max(160),
  client_phone: z.string().trim().min(8).max(20).optional(),
  ville: z.string().trim().min(2).max(80),
  code_postal: z.string().trim().regex(/^\d{5}$/),
  surface_m2: z.number().positive().max(2000),
  type_pose: z.string().trim().max(80),
  type_bois: z.string().trim().max(80),
  etat_sol: z.string().trim().max(80),
  budget_min: z.number().int().nonnegative(),
  budget_max: z.number().int().nonnegative(),
  delai_souhaite: z.string().trim().max(80).optional(),
  description: z.string().trim().max(800).optional(),
  required_specialites: z.array(z.string()).max(8).default([]),
});

export type SubmittedProjectInput = z.infer<typeof submitSchema>;

export const submitEstimationProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Insert project
    const { data: project, error: insertErr } = await supabaseAdmin
      .from("projects")
      .insert({
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone ?? null,
        ville: data.ville,
        code_postal: data.code_postal,
        surface_m2: data.surface_m2,
        type_pose: data.type_pose,
        type_bois: data.type_bois,
        etat_sol: data.etat_sol,
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        delai_souhaite: data.delai_souhaite ?? null,
        description: data.description ?? null,
        required_specialites: data.required_specialites,
        source: "estimateur",
        status: "qualified",
        credits_cost: 1,
      })
      .select("id, reference")
      .single();

    if (insertErr || !project) {
      console.error("submitEstimationProject insert error", insertErr);
      return { success: false, error: "Impossible d'enregistrer votre projet." };
    }

    // 2. Try matching (best-effort, do not block client on errors)
    try {
      await matchProjectInternal(project.id);
    } catch (e) {
      console.error("matching error", e);
    }

    return {
      success: true as const,
      project_id: project.id,
      reference: project.reference,
    };
  });

/**
 * Internal matching: scores verified artisans by zone (postal-code prefix),
 * specialités overlap, and recent activity. Picks the best fit, creates an
 * exclusive `project_matches` row in status='pending', updates the project
 * to 'matched'.
 */
async function matchProjectInternal(projectId: string) {
  const { data: project, error: pErr } = await supabaseAdmin
    .from("projects")
    .select("id, code_postal, required_specialites, status")
    .eq("id", projectId)
    .single();

  if (pErr || !project) throw pErr ?? new Error("Projet introuvable");
  if (project.status !== "qualified") return null;

  const dept = project.code_postal.slice(0, 2);

  const { data: artisans } = await supabaseAdmin
    .from("artisans")
    .select("id, code_postal, specialites, rayon_km, capacite_mois, pause_until, credits_balance")
    .eq("status", "verified")
    .gte("credits_balance", 1);

  if (!artisans || artisans.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  const required = (project.required_specialites ?? []) as string[];

  const scored = artisans
    .filter((a) => !a.pause_until || a.pause_until < today)
    .map((a) => {
      let score = 0;
      // Zone (same department prefix)
      if (a.code_postal.slice(0, 2) === dept) score += 50;
      else if (a.code_postal.slice(0, 1) === project.code_postal.slice(0, 1)) score += 15;
      // Specialités overlap
      const aSpec = (a.specialites ?? []) as string[];
      const overlap = required.filter((s) => aSpec.includes(s)).length;
      score += overlap * 20;
      if (required.length === 0) score += 10; // generic project
      // Capacity bonus
      if (a.capacite_mois === "6-10" || a.capacite_mois === "10+") score += 5;
      return { artisan: a, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;

  const best = scored[0];

  const { error: matchErr } = await supabaseAdmin.from("project_matches").insert({
    project_id: projectId,
    artisan_id: best.artisan.id,
    status: "pending",
    match_score: best.score,
  });

  if (matchErr) {
    // duplicate? swallow
    if (!matchErr.message?.includes("duplicate")) throw matchErr;
    return null;
  }

  await supabaseAdmin
    .from("projects")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("id", projectId);

  return best.artisan.id;
}

/**
 * Artisan inbox: pending + accepted + recent matches for the current user.
 */
export const getArtisanInbox = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: artisan } = await supabase
      .from("artisans")
      .select("id, credits_balance, status, raison_sociale, representant, ville, code_postal, rayon_km")
      .eq("user_id", userId)
      .maybeSingle();

    if (!artisan) {
      return { artisan: null, matches: [], stats: null };
    }

    const { data: matches } = await supabase
      .from("project_matches")
      .select(
        `id, status, proposed_at, decided_at, expires_at, match_score,
         project:projects (
           id, reference, client_name, client_email, client_phone,
           ville, code_postal, surface_m2, type_pose, type_bois, etat_sol,
           budget_min, budget_max, delai_souhaite, description, created_at,
           status, credits_cost
         )`,
      )
      .eq("artisan_id", artisan.id)
      .order("proposed_at", { ascending: false })
      .limit(50);

    const list = (matches ?? []).map((m) => {
      // mask client info if not accepted
      const accepted = m.status === "accepted";
      const project = m.project as NonNullable<typeof m.project>;
      return {
        match_id: m.id,
        status: m.status,
        proposed_at: m.proposed_at,
        decided_at: m.decided_at,
        expires_at: m.expires_at,
        match_score: m.match_score,
        project: {
          ...project,
          client_email: accepted ? project.client_email : null,
          client_phone: accepted ? project.client_phone : null,
        },
      };
    });

    const stats = {
      pending: list.filter((m) => m.status === "pending").length,
      accepted: list.filter((m) => m.status === "accepted").length,
      refunded: list.filter((m) => m.status === "refunded").length,
      total: list.length,
    };

    return { artisan, matches: list, stats };
  });

/**
 * Accept a match (atomic: debits 1 credit, reveals client coordinates).
 */
export const acceptMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ match_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: result, error } = await supabase.rpc("accept_project_match", {
      _match_id: data.match_id,
    });
    if (error) {
      return { success: false as const, error: error.message };
    }
    return { success: true as const, result };
  });

/**
 * Decline a pending match (no credits movement).
 */
export const declineMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ match_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("project_matches")
      .update({ status: "declined", decided_at: new Date().toISOString() })
      .eq("id", data.match_id)
      .eq("status", "pending");
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  });

/**
 * Refund a credit (client unreachable / out of zone). Only available
 * within 5 days of acceptance — enforced inside the SQL function.
 */
export const refundMatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        match_id: z.string().uuid(),
        reason: z.enum(["client_injoignable", "hors_zone", "annulation_client"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const reasonLabel = {
      client_injoignable: "Client injoignable sous 5 jours",
      hors_zone: "Projet hors zone d'intervention",
      annulation_client: "Annulation du client",
    }[data.reason];
    const { data: result, error } = await supabase.rpc("refund_project_match", {
      _match_id: data.match_id,
      _reason: reasonLabel,
    });
    if (error) return { success: false as const, error: error.message };
    return { success: true as const, result };
  });

/**
 * Credits transactions ledger (recent).
 */
export const getCreditsHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: artisan } = await supabase
      .from("artisans")
      .select("id, credits_balance")
      .eq("user_id", userId)
      .maybeSingle();
    if (!artisan) return { balance: 0, transactions: [] };

    const { data: tx } = await supabase
      .from("credits_transactions")
      .select("id, amount, type, description, balance_after, created_at, project_id")
      .eq("artisan_id", artisan.id)
      .order("created_at", { ascending: false })
      .limit(30);

    return { balance: artisan.credits_balance, transactions: tx ?? [] };
  });
