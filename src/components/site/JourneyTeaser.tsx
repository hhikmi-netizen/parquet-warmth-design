import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardEdit, Sparkles, UserCheck, PhoneCall } from "lucide-react";
import { JourneyStepper, type JourneyStep } from "@/components/site/JourneyStepper";

const teaserSteps: JourneyStep[] = [
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
 * - Mobile (<md) : accordéon compact (gain de hauteur, un panneau ouvert à la fois)
 * - Desktop (md+) : carrousel compact (lecture séquentielle, contrôles flèches)
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

        <div className="mt-12">
          {/* Mobile : accordéon compact */}
          <div className="md:hidden">
            <JourneyStepper steps={teaserSteps} compact mode="accordion" />
          </div>
          {/* Desktop : carrousel compact */}
          <div className="hidden md:block">
            <JourneyStepper steps={teaserSteps} compact mode="carousel" />
          </div>
        </div>

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
