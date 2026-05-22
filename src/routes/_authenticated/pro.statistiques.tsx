import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, Coins, Star, Clock, CheckCircle2, Filter, ArrowUpRight, Inbox,
} from "lucide-react";
import { MOCK_LEADS, MOCK_STATS, type LeadStatus } from "@/lib/mock-leads";

export const Route = createFileRoute("/_authenticated/pro/statistiques")({
  head: () => ({ meta: [{ title: "Statistiques & leads — Espace Pro Parqueto" }] }),
  component: ProStatsPage,
});

const STATUS_STYLES: Record<LeadStatus, string> = {
  nouveau: "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
  vu: "bg-muted text-muted-foreground border-border",
  accepté: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  refusé: "bg-muted text-muted-foreground border-border line-through",
  remporté: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
};

function ProStatsPage() {
  const s = MOCK_STATS;
  const max = Math.max(...s.serie.map((p) => p.leads));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Espace Pro</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Statistiques & leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue d'ensemble de votre activité sur les 30 derniers jours.
          </p>
        </div>
        <Link
          to="/pro"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-brand-orange/40 hover:text-brand-orange"
        >
          <Inbox className="h-4 w-4" /> Retour à la boîte
        </Link>
      </div>

      {/* KPI */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Inbox, label: "Leads reçus (30j)", value: s.leadsReçus30j, sub: `${s.leadsAcceptés30j} acceptés` },
          { icon: CheckCircle2, label: "Taux d'acceptation", value: `${s.tauxAcceptation} %`, sub: "objectif 70 %" },
          { icon: Coins, label: "CA estimé (30j)", value: `${s.caEstimé30j.toLocaleString("fr-FR")} €`, sub: "fourchette devis signés" },
          { icon: Clock, label: "Délai de réponse moyen", value: `${s.delaiReponseMoyenH} h`, sub: "objectif < 4 h" },
        ].map((k, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <k.icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-2xl text-foreground">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Mini chart + note */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Leads & acceptations · 8 semaines</h2>
            <TrendingUp className="h-4 w-4 text-brand-orange" />
          </div>
          <div className="mt-6 flex items-end gap-3 h-40">
            {s.serie.map((p) => (
              <div key={p.semaine} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-0.5" style={{ height: "100%" }}>
                  <div
                    title={`${p.leads} leads`}
                    className="w-3 rounded-t bg-brand-orange/30"
                    style={{ height: `${(p.leads / max) * 100}%` }}
                  />
                  <div
                    title={`${p.acceptés} acceptés`}
                    className="w-3 rounded-t bg-brand-orange"
                    style={{ height: `${(p.acceptés / max) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{p.semaine}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-orange/30" /> Reçus</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-orange" /> Acceptés</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-lg text-foreground">Note moyenne</h2>
          </div>
          <p className="mt-4 font-display text-5xl text-foreground">{s.notemoyenne}</p>
          <p className="text-xs text-muted-foreground">sur 247 avis vérifiés</p>
          <p className="mt-6 text-xs text-muted-foreground">
            Votre badge <strong className="text-brand-orange">Artisan Vérifié</strong> est actif.
            Maintenez &gt; 4,5 pour le conserver.
          </p>
        </div>
      </div>

      {/* Table leads */}
      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="font-display text-lg text-foreground">Leads récents</h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <Filter className="h-3.5 w-3.5" /> Filtrer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Client / Ville</th>
                <th className="px-5 py-3">Prestation</th>
                <th className="px-5 py-3">Surface</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_LEADS.map((l) => (
                <tr key={l.id} className="transition hover:bg-secondary/40">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{l.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-foreground">{l.client}</div>
                    <div className="text-xs text-muted-foreground">{l.ville} · {l.cp}</div>
                  </td>
                  <td className="px-5 py-3 text-foreground">{l.prestation}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.surface} m²</td>
                  <td className="px-5 py-3 text-foreground">{l.budget}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border p-4 text-center text-xs text-muted-foreground">
          Données simulées · branchement Supabase à venir
        </div>
      </div>
    </div>
  );
}
