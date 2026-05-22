import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Promise } from "@/components/site/Promise";
import { Process } from "@/components/site/Process";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { SocialProof } from "@/components/site/SocialProof";
import { Partners } from "@/components/site/Partners";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { AssistantTeaser } from "@/components/site/AssistantTeaser";
import beforeAfter from "@/assets/before-after.jpg";
import detail from "@/assets/detail-wood.jpg";
import hero from "@/assets/hero-parquet.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Parqueto — Estimez votre projet parquet en quelques minutes" },
      {
        name: "description",
        content:
          "Estimation parquet en ligne et Assistant IA Parqueto — première intelligence artificielle française dédiée à l'analyse de parquet en photo. Ponçage, vitrification, pose, rénovation après dégât des eaux. Artisan partenaire vérifié, sans démarchage.",
      },
      { property: "og:title", content: "Parqueto — Estimation & Assistant IA parquet" },
      { property: "og:description", content: "Une photo, une lecture IA : essence, usure, recommandation. Et un devis chiffré par un artisan vérifié." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Parqueto",
          description:
            "Estimation parquet en ligne et mise en relation avec un artisan partenaire vérifié pour la pose, le ponçage, la vitrification et la rénovation de parquet.",
          url: "https://parqueto.fr",
          areaServed: { "@type": "Country", name: "France" },
          serviceType: ["Pose de parquet", "Ponçage", "Vitrification", "Rénovation de parquet"],
          priceRange: "€€",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "247",
            bestRating: "5",
          },
        }),
      },
    ],
  }),
});

function RealisationsTeaser() {
  const shots = [
    { img: beforeAfter, label: "Rénovation chêne · Paris 11ᵉ" },
    { img: detail, label: "Vitrification mate · Lyon 6ᵉ" },
    { img: hero, label: "Pose chevron · Bordeaux" },
  ];
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Réalisations
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
              Quelques chantiers, <span className="italic text-brand-orange">parlent d'eux-mêmes.</span>
            </h2>
          </div>
          <Link
            to="/realisations"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-brand-orange"
          >
            Voir toutes les réalisations
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {shots.map((s) => (
            <figure
              key={s.label}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <img
                src={s.img}
                alt={s.label}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="px-5 py-4 text-sm font-medium text-foreground/85">
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <Hero />
      <Promise />
      <AssistantTeaser />
      <Process />
      <ArtisansShowcase />
      <RealisationsTeaser />
      <SocialProof />
      <Partners />
      <FinalCTA />
      <Footer />
      <MobileStickyCTA />
    </main>
  );
}
