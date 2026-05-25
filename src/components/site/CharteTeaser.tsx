import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  FileCheck2,
  Clock,
  HandCoins,
  ArrowRight,
} from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Critères de vérification",
    body: "SIRET actif, assurance décennale et RC Pro à jour, justificatif d'immatriculation (Kbis ou INSEE). Contrôle annuel.",
  },
  {
    icon: Clock,
    title: "Délais tenus",
    body: "Devis sous 24 à 48 h ouvrées. Démarrage à la semaine près. Tout report communiqué sous 48 h avec date ferme.",
  },
  {
    icon: FileCheck2,
    title: "Devis détaillé ligne par ligne",
    body: "Main d'œuvre, matériaux, finition, TVA, dépose, déchets : chaque poste chiffré. Pas de prix d'accroche, pas de supplément surprise.",
  },
  {
    icon: HandCoins,
    title: "Remboursement automatique",
    body: "Client injoignable sous 5 jours ouvrés, projet hors zone ou demande non sérieuse : le lead est remboursé sans démarche.",
  },
];

export function CharteTeaser() {
  return (
    <section
      id="charte-qualite"
      className="scroll-mt-24 border-y border-border bg-brand-cream/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange-deep">
              <ShieldCheck className="h-3.5 w-3.5" />
              Charte qualité
            </span>
            <h2 className="mt-5 font-display text-4xl text-balance sm:text-5xl">
              Dix engagements, <span className="italic text-brand-orange">opposables.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Chaque artisan partenaire signe la charte avant d'intégrer le réseau.
              Vous pouvez la consulter, la citer, et nous tenir pour responsables
              en cas d'écart. Voici les quatre points qui changent le quotidien.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/charte-qualite"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
              >
                Lire la charte complète
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/artisan-verifie"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                Comment on vérifie un artisan
              </Link>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {POINTS.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-border bg-background p-5 shadow-soft"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-deep">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
