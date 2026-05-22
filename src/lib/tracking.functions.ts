import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Enregistre un événement de tracking anonyme côté serveur.
 * Pas d'auth requise : les inserts passent par le client admin (service role)
 * pour éviter de laisser une policy permissive sur la table.
 */
const Input = z.object({
  event: z.string().trim().min(1).max(80).regex(/^[a-z0-9_:.\-]+$/i),
  segment: z.enum(["particulier", "pro", "artisan"]).optional().nullable(),
  path: z.string().trim().max(500).optional().nullable(),
  referrer: z.string().trim().max(500).optional().nullable(),
  sessionId: z.string().trim().max(80).optional().nullable(),
  meta: z.record(z.string(), z.any()).optional().nullable(),
});

export const recordEvent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("tracking_events" as never).insert({
        event: data.event,
        segment: data.segment ?? null,
        path: data.path ?? null,
        referrer: data.referrer ?? null,
        session_id: data.sessionId ?? null,
        meta: data.meta ?? null,
      } as never);
      return { ok: true };
    } catch (e) {
      console.error("recordEvent failed", e);
      return { ok: false };
    }
  });
