import { createFileRoute } from "@tanstack/react-router";
import { buildJ2Email, buildJ7Email, type Segment } from "@/lib/guide-sequence.functions";

/**
 * Endpoint cron pour la séquence email guide.
 *
 * Sécurité : `?key=<GUIDE_CRON_SECRET>` ou header `x-cron-key: <secret>`.
 * À appeler ~1 fois par heure depuis un planificateur externe.
 *
 * Comportement :
 * - Sélectionne les leads `opt_in=true` non désinscrits
 * - J+2 : envoie si created_at < now() - 2 days et j2_sent_at IS NULL
 * - J+7 : envoie si created_at < now() - 7 days et j7_sent_at IS NULL
 * - Limite de 50 par exécution pour éviter les pics
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "Parqueto <guide@parqueto.fr>";
const REPLY_TO = "contact@parqueto.fr";

type Lead = {
  id: string;
  email: string;
  name: string | null;
  segment: Segment | null;
};

async function sendEmail(lead: Lead, payload: { subject: string; html: string }) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return { ok: false, reason: "config" };
  }
  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: FROM,
      to: [lead.email],
      reply_to: REPLY_TO,
      subject: payload.subject,
      html: payload.html,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`[guide-sequence] send failed ${res.status}: ${t}`);
    return { ok: false, reason: "api" };
  }
  return { ok: true };
}

export const Route = createFileRoute("/api/public/guide-sequence")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});

async function handle(request: Request) {
  const secret = process.env.GUIDE_CRON_SECRET;
  if (!secret) {
    return new Response("Cron secret not configured", { status: 503 });
  }
  const url = new URL(request.url);
  const provided = url.searchParams.get("key") ?? request.headers.get("x-cron-key");
  if (provided !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const now = new Date();
  const j2Cutoff = new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString();
  const j7Cutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  const results = { j2: { picked: 0, sent: 0, failed: 0 }, j7: { picked: 0, sent: 0, failed: 0 } };

  // J+2
  {
    const { data, error } = await supabaseAdmin
      .from("guide_downloads" as never)
      .select("id,email,name,segment")
      .is("j2_sent_at", null)
      .is("unsubscribed_at", null)
      .eq("opt_in", true)
      .lte("created_at", j2Cutoff)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) console.error("[guide-sequence] j2 query error", error);
    const leads = (data ?? []) as unknown as Lead[];
    results.j2.picked = leads.length;
    for (const lead of leads) {
      const payload = buildJ2Email(lead.name, lead.segment);
      const r = await sendEmail(lead, payload);
      if (r.ok) {
        results.j2.sent++;
        await supabaseAdmin
          .from("guide_downloads" as never)
          .update({ j2_sent_at: new Date().toISOString() } as never)
          .eq("id", lead.id);
      } else {
        results.j2.failed++;
      }
    }
  }

  // J+7
  {
    const { data, error } = await supabaseAdmin
      .from("guide_downloads" as never)
      .select("id,email,name,segment")
      .is("j7_sent_at", null)
      .is("unsubscribed_at", null)
      .eq("opt_in", true)
      .lte("created_at", j7Cutoff)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) console.error("[guide-sequence] j7 query error", error);
    const leads = (data ?? []) as unknown as Lead[];
    results.j7.picked = leads.length;
    for (const lead of leads) {
      const payload = buildJ7Email(lead.name, lead.segment);
      const r = await sendEmail(lead, payload);
      if (r.ok) {
        results.j7.sent++;
        await supabaseAdmin
          .from("guide_downloads" as never)
          .update({ j7_sent_at: new Date().toISOString() } as never)
          .eq("id", lead.id);
      } else {
        results.j7.failed++;
      }
    }
  }

  return new Response(JSON.stringify({ ok: true, at: new Date().toISOString(), results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
