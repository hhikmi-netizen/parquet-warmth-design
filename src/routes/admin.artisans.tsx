import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, FileWarning, MapPin, Star, Coins, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill } from "@/components/admin/atoms";
import { ARTISANS, ARTISAN_STATUS } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/artisans")({
  head: () => ({ meta: [{ title: "Artisans — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ArtisansPage,
});

function ArtisansPage() {
  return (
    <AdminShell
      title="Gestion des artisans"
      subtitle="Fiches, zones, spécialités, documents et abonnements du réseau."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-brand-orange-deep">
          + Inviter un artisan
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARTISANS.map((a) => {
          const status = ARTISAN_STATUS[a.status];
          return (
            <article key={a.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-warm">
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 font-display text-sm text-brand-orange">
                    {a.nom.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <h3 className="font-display text-base leading-tight text-foreground">{a.nom}</h3>
                    <p className="text-[11px] text-muted-foreground">{a.raison}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.tone}`}>
                  {status.label}
                </span>
              </header>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {a.ville} · {a.zones.join(", ")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" /> {a.score.toFixed(1)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.specialites.map((s) => (
                  <Pill key={s} tone="neutral">{s}</Pill>
                ))}
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border bg-background p-2">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Formule</dt>
                  <dd className="mt-1 font-medium text-foreground">{a.formule}</dd>
                </div>
                <div className="rounded-xl border border-border bg-background p-2">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Leads achetés</dt>
                  <dd className="mt-1 inline-flex items-center gap-1 font-medium text-foreground">
                    <Coins className="h-3 w-3 text-brand-orange" /> {a.credits}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-background p-2">
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Leads 30 j</dt>
                  <dd className="mt-1 font-medium text-foreground">{a.leads30j}</dd>
                </div>
              </dl>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" /> RC Pro
                  </span>
                  <span className={a.rcAlerte ? "font-medium text-rose-600" : "text-foreground"}>
                    {a.rcAlerte ? `Expire ${a.rcExpire}` : `Valide jusqu'au ${a.rcExpire}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <FileWarning className="h-3.5 w-3.5" /> KBIS / SIREN
                  </span>
                  <span className={a.kbis ? "text-foreground" : "font-medium text-amber-700"}>
                    {a.kbis ? "Validé" : "Manquant"}
                  </span>
                </div>
              </div>

              {(a.rcAlerte || !a.kbis) && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-[11px] text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Action requise sur les documents
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <button className="flex-1 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-orange-deep">
                  Ouvrir la fiche
                </button>
                <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
                  Historique
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
