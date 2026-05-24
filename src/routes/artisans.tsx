import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, UserPlus, Target, MessagesSquare, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { Artisan } from "@/components/site/Artisan";
import { JourneyStepper, type JourneyStep } from "@/components/site/JourneyStepper";

const artisanJourney: JourneyStep[] = [
  {
    n: "01",
    icon: UserPlus,
    title: "Créez votre compte artisan",
    body: "Spécialités, zone d'intervention, disponibilités et justificatifs (KBIS, RC Pro, décennale). Tout est vérifié manuellement avant validation.",
    highlight: "Essai 14 jours",
  },
  {
    n: "02",
    icon: Target,
    title: "Recevez des missions ciblées",
    body: "Notre algorithme ne vous envoie que les projets qui correspondent à votre métier, votre zone et votre niveau de qualification. Aucun lead générique.",
    highlight: "Leads qualifiés",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Échangez avec le client",
    body: "Contact direct, questions techniques, visite si besoin, devis depuis l'application. Pas d'intermédiaire qui filtre vos messages.",
    highlight: "Direct & sans filtre",
  },
  {
    n: "04",
    icon: CheckCircle2,
    title: "Chantier validé, signature",
    body: "Le client signe votre devis. Vous gérez le planning, les photos chantier et la facturation depuis votre espace pro.",
    highlight: "Chantier livré",
  },
];


export const Route = createFileRoute("/artisans")({
  component: ArtisansPage,
  head: () => ({
    meta: [
      { title: "Artisan parqueteur vérifié près de chez vous — Devis sous 24 h · Parqueto" },
      {
        name: "description",
        content:
          "Artisans parqueteurs vérifiés (décennale, identité, avis clients) : pose, ponçage, vitrification, rénovation. Devis gratuit d'un artisan parqueteur vérifié sous 24 h, sans engagement.",
      },
      { property: "og:title", content: "Artisan parqueteur vérifié — Devis sous 24 h · Parqueto" },
      {
        property: "og:description",
        content:
          "Découvrez les artisans parqueteurs vérifiés Parqueto : pose, ponçage, vitrification, rénovation. Devis gratuit sous 24 h.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/artisans" },
    ],

    links: [{ rel: "canonical", href: "/artisans" }],
  }),
});

function ArtisansPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Nos artisans</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Des artisans sélectionnés, <span className="italic text-brand-orange">pas un annuaire.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Chaque artisan Parqueto est rencontré, vérifié et noté. Vous n'avez pas à le démarcher : on cadre votre projet,
            puis on vous oriente vers le bon profil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Vous êtes artisan ? Rejoignez-nous
            </Link>
          </div>
        </div>
      </section>
      <ArtisansShowcase />

      {/* Parcours artisan — explication pédagogique sous forme de carrousel */}
      <section className="border-y border-border bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Comment ça marche pour vous
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
              Rejoindre Parqueto, <span className="italic text-brand-orange">en 4 étapes.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pas de paperasse interminable, pas de leads génériques. Un parcours pensé pour les artisans qui veulent
              se concentrer sur leur métier.
            </p>
          </div>
          <JourneyStepper steps={artisanJourney} accent="ink" />
          <div className="mt-10 flex justify-center">
            <Link
              to="/comment-ca-marche"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline"
            >
              Voir aussi le parcours côté client
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Artisan />
      <Footer />

    </main>
  );
}
