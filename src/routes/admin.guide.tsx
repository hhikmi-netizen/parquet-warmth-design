import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { BookOpen, Download, Mail, MailX, Users, TrendingUp } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard, Panel, Pill } from "@/components/admin/atoms";
import { getGuideStats } from "@/lib/guide-stats.functions";

export const Route = createFileRoute("/admin/guide")({
  head: () => ({
    meta: [
      { title: "Guide — Parqueto Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: GuideAdminPage,
});

const SEGMENT_LABEL: Record<string, string> = {
  particulier: "Particulier",
  pro: "Pro / MOA",
  artisan: "Artisan",
  inconnu: "Non renseigné",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function GuideAdminPage() {
  const fn = useServerFn(getGuideStats);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "guide-stats"],
    queryFn: () => fn(),
    refetchInterval: 60_000,
  });

  return (
    <AdminShell
      title="Guide Ultime — Performance"
      subtitle="Téléchargements, séquence email, événements de tracking."
    >
      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Chargement des statistiques…
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-700">
          Accès refusé ou erreur de chargement. Cette page est réservée aux admins.
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <KpiCard label="Téléchargements (total)" value={data.kpis.total.toString()} icon={Download} hint={`${data.kpis.last24} dans les dernières 24h`} />
            <KpiCard label="7 derniers jours" value={data.kpis.last7.toString()} icon={TrendingUp} hint={`${data.kpis.last30} sur 30j`} />
            <KpiCard label="Emails J+2 envoyés" value={data.kpis.j2Sent.toString()} icon={Mail} hint={`${data.kpis.j7Sent} J+7 envoyés`} />
            <KpiCard label="Désinscriptions" value={data.kpis.unsubscribed.toString()} icon={MailX} hint={data.kpis.total > 0 ? `${((data.kpis.unsubscribed / data.kpis.total) * 100).toFixed(1)} %` : "—"} />
          </div>

          {/* Série 14j + Segments */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Téléchargements · 14 derniers jours" className="lg:col-span-2">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="n" stroke="var(--chart-1)" fill="url(#g)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Segments" description="Auto-déclarés au téléchargement">
              <ul className="space-y-2.5">
                {Object.entries(data.segments).map(([k, v]) => {
                  const pct = data.kpis.total > 0 ? (v / data.kpis.total) * 100 : 0;
                  return (
                    <li key={k}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          <Users className="h-3 w-3" /> {SEGMENT_LABEL[k] ?? k}
                        </span>
                        <span className="text-muted-foreground">{v} · {pct.toFixed(0)}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-brand-orange" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          {/* Top events */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Top événements (30j)" description="tracking_events agrégé par type">
              {data.topEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucun événement enregistré pour le moment.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topEvents} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                      <YAxis dataKey="event" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={140} />
                      <Tooltip />
                      <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>

            <Panel title="Sources" description="Page d'origine du téléchargement">
              <ul className="space-y-2 text-xs">
                {Object.entries(data.sources).sort((a, b) => b[1] - a[1]).map(([src, n]) => (
                  <li key={src} className="flex items-center justify-between border-b border-border/60 pb-1.5 last:border-0">
                    <span className="font-medium text-foreground">{src}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </li>
                ))}
                {Object.keys(data.sources).length === 0 && (
                  <li className="text-muted-foreground">Aucune source enregistrée.</li>
                )}
              </ul>
            </Panel>
          </div>

          {/* Derniers leads */}
          <Panel title="Derniers téléchargements" description="20 plus récents">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Date</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Nom</th>
                    <th className="py-2 pr-3 font-medium">Segment</th>
                    <th className="py-2 pr-3 font-medium">Séquence</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((r) => (
                    <tr key={r.id} className="border-b border-border/40">
                      <td className="py-2 pr-3 text-muted-foreground">{fmtDate(r.created_at)}</td>
                      <td className="py-2 pr-3 font-medium text-foreground">{r.email}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.name ?? "—"}</td>
                      <td className="py-2 pr-3">
                        {r.segment ? (
                          <Pill tone={r.segment === "pro" ? "info" : r.segment === "artisan" ? "orange" : "neutral"}>
                            {SEGMENT_LABEL[r.segment] ?? r.segment}
                          </Pill>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-1">
                          {r.unsubscribed && <Pill tone="danger">Désinscrit</Pill>}
                          {r.j2 && <Pill tone="success">J+2</Pill>}
                          {r.j7 && <Pill tone="success">J+7</Pill>}
                          {!r.unsubscribed && !r.j2 && !r.j7 && <Pill tone="neutral">En attente</Pill>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.recent.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Aucun téléchargement pour le moment.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-[11px] text-muted-foreground">
            <BookOpen className="mr-1 inline h-3 w-3" />
            Données rafraîchies automatiquement toutes les 60 secondes. Les emails J+2 et J+7 sont envoyés via le cron horaire `guide-sequence-hourly`.
          </div>
        </div>
      )}
    </AdminShell>
  );
}
