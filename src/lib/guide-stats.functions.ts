import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Statistiques du Guide Ultime du Parquet pour le dashboard admin.
 * Lecture admin via supabaseAdmin (bypass RLS) après vérification has_role('admin').
 */
export const getGuideStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Vérification admin via la RPC has_role (security definer)
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      throw new Error("Forbidden");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    const d7 = new Date(now.getTime() - 7 * 86400_000).toISOString();
    const d30 = new Date(now.getTime() - 30 * 86400_000).toISOString();
    const d24 = new Date(now.getTime() - 24 * 3600_000).toISOString();

    const { data: downloads } = await supabaseAdmin
      .from("guide_downloads" as never)
      .select("id, email, name, segment, source, created_at, j2_sent_at, j7_sent_at, unsubscribed_at")
      .order("created_at", { ascending: false })
      .limit(500);

    const list = (downloads ?? []) as Array<{
      id: string;
      email: string;
      name: string | null;
      segment: string | null;
      source: string | null;
      created_at: string;
      j2_sent_at: string | null;
      j7_sent_at: string | null;
      unsubscribed_at: string | null;
    }>;

    const total = list.length;
    const last24 = list.filter((d) => d.created_at >= d24).length;
    const last7 = list.filter((d) => d.created_at >= d7).length;
    const last30 = list.filter((d) => d.created_at >= d30).length;
    const j2Sent = list.filter((d) => d.j2_sent_at).length;
    const j7Sent = list.filter((d) => d.j7_sent_at).length;
    const unsubscribed = list.filter((d) => d.unsubscribed_at).length;

    const segments: Record<string, number> = { particulier: 0, pro: 0, artisan: 0, inconnu: 0 };
    for (const d of list) segments[d.segment ?? "inconnu"] = (segments[d.segment ?? "inconnu"] ?? 0) + 1;

    // Série 14 jours
    const series: { date: string; n: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 86400_000);
      const key = day.toISOString().slice(0, 10);
      const n = list.filter((d) => d.created_at.slice(0, 10) === key).length;
      series.push({ date: key.slice(5), n });
    }

    // Sources
    const sources: Record<string, number> = {};
    for (const d of list) {
      const k = d.source ?? "inconnu";
      sources[k] = (sources[k] ?? 0) + 1;
    }

    // Tracking events (30j)
    const { data: events } = await supabaseAdmin
      .from("tracking_events" as never)
      .select("event, segment, created_at")
      .gte("created_at", d30)
      .order("created_at", { ascending: false })
      .limit(2000);

    const evList = (events ?? []) as Array<{ event: string; segment: string | null; created_at: string }>;
    const eventCounts: Record<string, number> = {};
    for (const e of evList) eventCounts[e.event] = (eventCounts[e.event] ?? 0) + 1;
    const topEvents = Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));

    const recent = list.slice(0, 20).map((d) => ({
      id: d.id,
      email: d.email,
      name: d.name,
      segment: d.segment,
      created_at: d.created_at,
      unsubscribed: !!d.unsubscribed_at,
      j2: !!d.j2_sent_at,
      j7: !!d.j7_sent_at,
    }));

    return {
      kpis: { total, last24, last7, last30, j2Sent, j7Sent, unsubscribed },
      segments,
      sources,
      series,
      topEvents,
      recent,
    };
  });
