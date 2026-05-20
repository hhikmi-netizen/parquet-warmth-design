import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  Eye,
  FileText,
  Inbox,
  Hammer,
  Coins,
  Banknote,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  CircleAlert,
  Info,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard, Panel, Pill } from "@/components/admin/atoms";
import { ALERTS, TRAFFIC, REVENUS, LEADS, STATUS_LABEL, STATUS_TONE } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Vue 360° — Parqueto Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OverviewPage,
});

const ALERT_ICON = { info: Info, warning: CircleAlert, danger: AlertTriangle };
const ALERT_TONE: Record<string, string> = {
  info: "bg-sky-500/10 text-sky-700 border-sky-500/30",
  warning: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  danger: "bg-rose-500/10 text-rose-700 border-rose-500/30",
};

function OverviewPage() {
  return (
    <AdminShell
      title="Vue d'ensemble 360°"
      subtitle="Tout ce qui compte pour piloter Parqueto, aujourd'hui."
      actions={
        <>
          <span className="hidden text-xs text-muted-foreground sm:inline">Période :</span>
          <select className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
            <option>14 derniers jours</option>
            <option>30 derniers jours</option>
            <option>Mois en cours</option>
            <option>Trimestre</option>
          </select>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Visites du site" value="9 132" trend={{ dir: "up", value: "+12 %" }} icon={Eye} hint="14 derniers jours" />
        <KpiCard label="Demandes d'estimation" value="424" trend={{ dir: "up", value: "+18 %" }} icon={FileText} />
        <KpiCard label="Leads qualifiés" value="187" trend={{ dir: "up", value: "+9 %" }} icon={Inbox} hint="44 % des demandes" />
        <KpiCard label="Artisans actifs" value="63" trend={{ dir: "up", value: "+4" }} icon={Hammer} />
        <KpiCard label="Crédits consommés" value="312" trend={{ dir: "down", value: "−3 %" }} icon={Coins} />
        <KpiCard label="CA estimé" value="9 180 €" trend={{ dir: "up", value: "+9 %" }} icon={Banknote} hint="Décembre" />
        <KpiCard label="Taux de conversion" value="4,6 %" trend={{ dir: "up", value: "+0,4 pt" }} icon={TrendingUp} />
        <KpiCard label="Alertes à traiter" value="5" trend={{ dir: "down", value: "−2" }} icon={ShieldAlert} hint="dont 2 urgentes" />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Trafic & demandes"
          description="Visites du site et estimations reçues sur 14 jours."
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="visites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="demandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  cursor={{ stroke: "var(--brand-orange)", strokeOpacity: 0.2 }}
                />
                <Area type="monotone" dataKey="visites" stroke="var(--brand-orange)" strokeWidth={2} fill="url(#visites)" name="Visites" />
                <Area type="monotone" dataKey="demandes" stroke="var(--foreground)" strokeWidth={1.5} fill="url(#demandes)" name="Demandes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Revenus mensuels" description="Abonnements + recharges crédits.">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUS} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v.toLocaleString("fr-FR")} €`, "Revenu"]}
                />
                <Bar dataKey="revenu" fill="var(--brand-orange)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Action zone */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="À traiter aujourd'hui"
          description="Les leads les plus récents qui attendent une action."
          actions={
            <Link to="/admin/clients" className="inline-flex items-center gap-1 text-xs font-medium text-brand-orange hover:underline">
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {LEADS.slice(0, 5).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{l.ref}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[l.status]}`}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {l.client} · {l.projet} · {l.surface} m² · {l.ville}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{l.date}</span>
                  <button className="rounded-full border border-border bg-background px-3 py-1 font-medium text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange">
                    Ouvrir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Alertes importantes" description="Ce qui mérite votre attention.">
          <ul className="space-y-3">
            {ALERTS.map((a) => {
              const Icon = ALERT_ICON[a.level];
              return (
                <li key={a.id} className="flex gap-3 rounded-xl border border-border bg-background p-3">
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${ALERT_TONE[a.level]}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.meta}</p>
                    {a.cta && (
                      <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-orange hover:underline">
                        {a.cta} <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Quality / capacity gauges */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Panel title="Qualité réseau" description="Score moyen des artisans actifs.">
          <Gauge value={4.7} max={5} label="4,7 / 5" tone="success" />
          <p className="mt-3 text-xs text-muted-foreground">Basé sur 312 retours clients sur 30 jours.</p>
        </Panel>
        <Panel title="Capacité artisans" description="Crédits restants vs leads entrants.">
          <Gauge value={72} max={100} label="72 %" tone="orange" />
          <p className="mt-3 text-xs text-muted-foreground">Marge confortable. Pic possible en Île-de-France.</p>
        </Panel>
        <Panel title="Conformité documents" description="RC Pro et KBIS à jour dans le réseau.">
          <Gauge value={89} max={100} label="89 %" tone="info" />
          <p className="mt-3 text-xs text-muted-foreground">7 artisans à relancer cette semaine.</p>
          <Pill tone="warning" className="mt-2">À relancer</Pill>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Gauge({ value, max, label, tone }: { value: number; max: number; label: string; tone: "success" | "orange" | "info" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const toneClass =
    tone === "success" ? "from-emerald-500 to-emerald-400" : tone === "info" ? "from-sky-500 to-sky-400" : "from-brand-orange to-brand-orange-deep";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-2xl text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">objectif {max}</span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
