import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardEdit,
  Sparkles,
  UserCheck,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";

type TeaserStep = {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
  highlight: string;
};

const teaserSteps: TeaserStep[] = [
  {
    n: "01",
    icon: ClipboardEdit,
    title: "Vous décrivez votre projet",
    body: "Quelques questions simples : type de prestation, surface, état du parquet. Aucun jargon.",
    highlight: "5 minutes",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "On estime instantanément",
    body: "Une fourchette de prix honnête, calée sur les tarifs réels des artisans de votre région.",
    highlight: "Gratuit",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Un artisan vérifié vous est dédié",
    body: "Un seul artisan, choisi pour votre projet — spécialité, zone, dispo, notes clients.",
    highlight: "1 artisan, pas 10",
  },
  {
    n: "04",
    icon: PhoneCall,
    title: "Il vous contacte sous 24 h",
    body: "Échange direct, visite si besoin, devis détaillé. Pas de démarchage, pas de mise en concurrence.",
    highlight: "Sous 24 h",
  },
];

/**
 * Teaser parcours en page d'accueil.
 * Mobile : cartes empilées (1 colonne). Tablette : 2 colonnes. Desktop : 4 colonnes alignées.
 * Renvoie vers /comment-ca-marche pour le détail complet.
 */
export function JourneyTeaser() {
  return (
    <section
      id="parcours-teaser"
      className="scroll-mt-24 border-t border-border bg-secondary/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Comment ça marche
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
            Quatre gestes, <span className="italic text-brand-orange">et votre projet avance.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pas de formulaire interminable, pas de course aux devis. Voici le cœur du parcours Parqueto.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Trait conducteur subtil sur desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent lg:block"
          />
          {teaserSteps.map(({ n, icon: Icon, title, body, highlight }, idx) => (
            <li
              key={n}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="flex items-center justify-between">
                <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-primary-foreground shadow-warm">
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="sr-only">Étape {idx + 1} sur {teaserSteps.length}</span>
                </span>
                <span
                  className="font-display text-4xl text-brand-orange/15 transition group-hover:text-brand-orange/30"
                  aria-hidden
                >
                  {n}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg leading-tight text-foreground sm:text-xl">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex w-fit items-center rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-orange-deep">
                {highlight}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <Link
            to="/comment-ca-marche"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
          >
            Voir le parcours complet
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
