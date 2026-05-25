import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Droplets, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Promise } from "@/components/site/Promise";
import { JourneyTeaser } from "@/components/site/JourneyTeaser";
import { Process } from "@/components/site/Process";
import { HomeFAQ } from "@/components/site/HomeFAQ";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { SocialProof } from "@/components/site/SocialProof";
import { Partners } from "@/components/site/Partners";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { AssistantTeaser } from "@/components/site/AssistantTeaser";
import { AtelierVideo } from "@/components/site/AtelierVideo";
import { MotionTechnique } from "@/components/site/MotionTechnique";
import { BrandFilm } from "@/components/site/BrandFilm";
import { ClientExperience } from "@/components/site/ClientExperience";
import { ArtisanExperience } from "@/components/site/ArtisanExperience";
import { TrustStrip } from "@/components/site/TrustStrip";
import { videoObjectSchema } from "@/lib/video-schema";
import beforeAfter from "@/assets/before-after.jpg";
import detail from "@/assets/detail-wood.jpg";
import hero from "@/assets/hero-parquet.jpg";
import { GONDOLAGE_CASES } from "@/lib/gondolage-cases";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Estimation parquet en ligne & artisan parqueteur vérifié — Parqueto" },
      {
        name: "description",
        content:
          "Estimation parquet en ligne gratuite : pose, ponçage, vitrification, rénovation, parquet qui gondole. Devis d'un artisan parqueteur vérifié sous 24 h, sans démarchage.",
      },
      { property: "og:title", content: "Estimation parquet & artisan vérifié — Parqueto" },
      { property: "og:description", content: "Pose, ponçage, vitrification, rénovation, parquet qui gondole : estimation en ligne et devis chiffré par un artisan parqueteur vérifié sous 24 h." },
      { property: "og:url", content: "https://parqueto.fr/" },
      { property: "og:image", content: "https://parqueto.fr/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Parqueto — estimation parquet et artisan parqueteur vérifié" },
      { name: "twitter:image", content: "https://parqueto.fr/og-image.jpg" },
      { name: "twitter:title", content: "Estimation parquet & artisan vérifié — Parqueto" },
      { name: "twitter:description", content: "Estimation parquet en ligne et devis d'un artisan parqueteur vérifié sous 24 h." },
    ],
    links: [{ rel: "canonical", href: "https://parqueto.fr/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Parqueto",
          description:
            "Estimation parquet en ligne et mise en relation avec un artisan parqueteur vérifié pour la pose, le ponçage, la vitrification et la rénovation de parquet.",
          url: "https://parqueto.fr",
          areaServed: { "@type": "Country", name: "France" },
          serviceType: ["Pose de parquet", "Ponçage parquet", "Vitrification parquet", "Rénovation de parquet", "Réparation parquet qui gondole"],
          priceRange: "€€",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Combien coûte une estimation parquet chez Parqueto ?",
              acceptedAnswer: { "@type": "Answer", text: "L'estimation en ligne est 100 % gratuite. Vous obtenez une fourchette de prix selon la surface, le type de parquet et la prestation (pose, ponçage, vitrification, rénovation), puis un devis chiffré par un artisan vérifié sous 24 h." },
            },
            {
              "@type": "Question",
              name: "Que faire si mon parquet gondole ?",
              acceptedAnswer: { "@type": "Answer", text: "Coupez la source d'humidité, ventilez, puis utilisez notre simulateur de gravité (5 questions) pour savoir si un ponçage suffit ou si une dépose partielle est nécessaire. Un artisan vous rappelle sous 24 h avec un devis conforme à votre assurance MRH." },
            },
            {
              "@type": "Question",
              name: "Quel prix au m² pour poncer et vitrifier un parquet ?",
              acceptedAnswer: { "@type": "Answer", text: "Comptez 35 à 60 €/m² TTC pour un ponçage + vitrification standard, et 50 à 90 €/m² pour une rénovation complète (réparation des lames + teinte + finition). Lancez l'estimation pour un chiffrage personnalisé." },
            },
            {
              "@type": "Question",
              name: "Les artisans Parqueto sont-ils vraiment vérifiés ?",
              acceptedAnswer: { "@type": "Answer", text: "Oui : Kbis à jour, assurance décennale en cours de validité, avis clients contrôlés et chartre qualité signée. Aucun démarchage, vous restez maître du contact." },
            },
          ],
        }),
      },
      videoObjectSchema({
        name: "Parqueto — Le parquet, sans détour",
        description:
          "Film de marque Parqueto : estimation parquet en ligne, assistant IA, et réseau d'artisans parqueteurs vérifiés en France.",
        thumbnailUrl: "https://parqueto.fr/og-image.jpg",
        uploadDate: "2026-05-22",
        contentUrl: "https://parqueto.fr/videos/parqueto-spot.mp4",
        duration: "PT21S",
      }),
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

function GondolagePillar() {
  const topCases = GONDOLAGE_CASES.slice(0, 3);
  return (
    <section className="border-t border-border bg-muted/20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              <AlertTriangle className="h-3.5 w-3.5" />
              Problème courant
            </div>
            <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
              Votre parquet <span className="italic text-brand-orange">gondole ?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Inondation, humidité, chauffage au sol mal réglé ou pose non conforme :
              le gondolage est la panne n°1 du parquet. Découvrez les causes,
              évaluez la gravité avec notre simulateur et obtenez un devis sous 24 h.
              Besoin de conseils ? Consultez aussi nos{" "}
              <Link to="/guide" className="font-medium text-brand-orange underline underline-offset-4 hover:text-brand-orange-deep">
                guides parquet
              </Link>.
            </p>
          </div>
          <Link
            to="/parquet-qui-gondole"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
          >
            <Droplets className="h-4 w-4" />
            Guide complet & simulateur
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {topCases.map((c) => (
            <Link
              key={c.slug}
              to="/parquet-qui-gondole/$cas"
              params={{ cas: c.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition hover:border-brand-orange/50 hover:shadow-warm"
            >
              <div className="font-display text-lg text-foreground group-hover:text-brand-orange">
                {c.h1}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.intro}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange">
                Lire le cas
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, label: "Simulateur de gravité", text: "5 questions → diagnostic personnalisé" },
            { icon: CheckCircle2, label: "Devis sous 24 h", text: "Artisan vérifié, conforme assurance" },
            { icon: Droplets, label: "Dégât des eaux", text: "Protocole MRH + expertise incluse" },
            { icon: AlertTriangle, label: "6 cas détaillés", text: "Humidité, chauffage, flottant, pose…" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
            >
              <b.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
              <div>
                <p className="text-sm font-semibold text-foreground">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.text}</p>
              </div>
            </div>
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
      <TrustStrip />
      <Promise />
      <JourneyTeaser />
      <AssistantTeaser />
      <AtelierVideo />
      <Process />
      <HomeFAQ />
      <GondolagePillar />
      <ClientExperience />
      <MotionTechnique />
      <ArtisansShowcase />
      <ArtisanExperience />
      <RealisationsTeaser />
      <BrandFilm />
      <SocialProof />
      <Partners />
      <FinalCTA />
      <Footer />
      <MobileStickyCTA />
    </main>
  );
}
