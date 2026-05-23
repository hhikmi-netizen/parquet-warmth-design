import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { Artisan } from "@/components/site/Artisan";

export const Route = createFileRoute("/artisans")({
  component: ArtisansPage,
  head: () => ({
    meta: [
      { title: "Nos artisans parqueteurs — sélectionnés et vérifiés · Parqueto" },
      {
        name: "description",
        content:
          "Découvrez les artisans parqueteurs partenaires de Parqueto : sélectionnés sur dossier, vérifiés, notés par les particuliers.",
      },
      { property: "og:title", content: "Nos artisans · Parqueto" },
      { property: "og:description", content: "Des visages, des mains, un savoir-faire." },
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
      <Artisan />
      <Footer />
    </main>
  );
}
