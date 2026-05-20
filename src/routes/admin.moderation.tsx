import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Flag, RefreshCcw, PhoneOff, Star } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill, KpiCard } from "@/components/admin/atoms";
import { MODERATION, ARTISANS } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({ meta: [{ title: "Modération & qualité — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ModerationPage,
});

function ModerationPage() {
  const top = [...ARTISANS].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <AdminShell
      title="Modération & qualité"
      subtitle="Signalements, contestations et remboursements de crédits."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Signalements ouverts" value="4" trend={{ dir: "down", value: "−2" }} icon={Flag} />
        <KpiCard label="Remboursements demandés" value="3" icon={RefreshCcw} />
        <KpiCard label="Artisans injoignables" value="1" icon={PhoneOff} />
        <KpiCard label="Score qualité moyen" value="4,7 / 5" trend={{ dir: "up", value: "+0,1" }} icon={Star} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="File de modération" description="Trier par urgence et ancienneté.">
          <ul className="divide-y divide-border">
            {MODERATION.map((m) => (
              <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Pill tone={m.type.includes("Litige") || m.type.includes("contesté") ? "danger" : m.type.includes("injoignable") ? "warning" : "info"}>
                      <ShieldAlert className="h-3 w-3" />
                      {m.type}
                    </Pill>
                    <span className="text-[11px] text-muted-foreground">{m.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{m.cible}</p>
                  <p className="text-xs text-muted-foreground">Motif : {m.motif}</p>
                  <p className="text-[11px] text-muted-foreground">Statut interne : {m.action}</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <button className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition hover:border-brand-orange/40 sm:flex-none">
                    Examiner
                  </button>
                  <button className="flex-1 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-brand-orange-deep sm:flex-none">
                    Rembourser le crédit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top qualité artisans" description="Score moyen sur 30 jours.">
          <ul className="space-y-3">
            {top.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-[11px] font-semibold text-brand-orange">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.nom}</p>
                    <p className="text-[11px] text-muted-foreground">{a.ville} · {a.leads30j} leads</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  {a.score.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AdminShell>
  );
}
