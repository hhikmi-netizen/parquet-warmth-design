import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Download, Sparkles, Star } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DownloadGate } from "@/components/guide/DownloadGate";
import { CHAPTERS, GUIDE_COVER, GUIDE_META, getReadingTime } from "@/lib/guide-content";
import { GUIDE_FAQ } from "@/lib/guide-faq";

export const Route = createFileRoute("/guide-parquet")({
  component: GuideLanding,
  head: () => ({
    meta: [
      {
        title:
          "Guide parquet 2025 (PDF gratuit) — Choisir, poser, entretenir · Parqueto",
      },
      {
        name: "description",
        content:
          "Téléchargez gratuitement Le Guide Ultime du Parquet : choisir l'essence, poser, entretenir, rénover. Conseils d'artisans, normes DTU, comparatifs. PDF 2025.",
      },
      { property: "og:title", content: "Guide parquet 2025 — PDF gratuit · Parqueto" },
      {
        property: "og:description",
        content:
          "Tout ce qu'un artisan met dix ans à apprendre, dans un guide PDF gratuit. Choisir, poser, entretenir, rénover votre parquet en 2025.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: GUIDE_COVER },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: GUIDE_COVER },
    ],
    links: [{ rel: "canonical", href: "/guide-parquet" }],
  }),
});

function GuideLanding() {
  const [open, setOpen] = useState(false);
  const minutes = getReadingTime();

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: GUIDE_META.title,
    author: { "@type": "Person", name: "Hicham Hikmi" },
    publisher: { "@type": "Organization", name: "Parqueto", url: "https://parqueto.fr" },
    inLanguage: "fr-FR",
    image: GUIDE_COVER,
    numberOfPages: CHAPTERS.length,
    bookFormat: "https://schema.org/EBook",
    isAccessibleForFree: true,
    description:
      "Guide professionnel pour choisir, poser, entretenir et rénover le parquet. Conseils d'artisans, normes DTU, comparatifs et diagnostics.",
    hasPart: CHAPTERS.map((c) => ({ "@type": "Chapter", name: c.title })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Réussir son projet de parquet en 6 étapes",
    image: GUIDE_COVER,
    totalTime: `PT${minutes}M`,
    step: CHAPTERS.filter((c) => c.id !== "introduction").map((c, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: c.title,
      text: c.intro,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GUIDE_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const benefits = [
    "10 ans d'expertise artisan condensés en un PDF",
    "Comparatifs massif/contrecollé, essences, finitions",
    "Normes DTU 51.2 et 51.11 expliquées simplement",
    "Diagnostics : tuilage, fentes, taches, grincements",
    "Budgets réels au m² (matériau + pose + finition)",
    "Routines d'entretien validées par les pros",
  ];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* HERO */}
      <section className="border-b border-border bg-gradient-warm">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              <Sparkles className="h-3 w-3" /> PDF gratuit · Édition 2025
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-balance sm:text-6xl">
              Le Guide Ultime <span className="italic text-brand-orange">du Parquet</span>
            </h1>
            <p className="mt-5 font-display text-xl text-muted-foreground">
              Choisir · Poser · Entretenir · Rénover
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Tout ce qu'un artisan expérimenté met dix ans à apprendre, condensé dans un seul guide.
              Rédigé par {GUIDE_META.author}. {CHAPTERS.length} chapitres, {minutes} min de lecture.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep"
              >
                <Download className="h-4 w-4" /> Recevoir le PDF gratuit
              </button>
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-card px-6 py-3 text-sm font-semibold text-brand-orange-deep transition hover:bg-brand-orange/10"
              >
                <BookOpen className="h-4 w-4" /> Lire en ligne
              </Link>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <span>Lu et téléchargé par des centaines de propriétaires</span>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-brand-orange/10 blur-3xl" />
            <img
              src={GUIDE_COVER}
              alt="Couverture du Guide Ultime du Parquet édition 2025"
              width={1024}
              height={1536}
              className="aspect-[2/3] w-full rounded-2xl object-cover shadow-warm ring-1 ring-black/5"
            />
            <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {GUIDE_META.signature}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Ce que vous trouverez
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Concret, vérifié, sans jargon</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <span className="text-sm leading-relaxed text-brand-ink/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CHAPITRES */}
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Sommaire</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">{CHAPTERS.length} chapitres</h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
              >
                <span className="font-display text-2xl text-brand-orange">{c.number}</span>
                <span>
                  <span className="block font-display text-lg leading-tight">{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.kicker}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TEASERS — 3 conseils tirés du guide */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Aperçu du contenu
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Trois conseils qui vous épargnent une erreur à 3&nbsp;000&nbsp;€
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <TeaserTip
              number="01"
              title="Le test du verre d'eau"
              text="Avant toute pose, laissez un verre d'eau renversé 24h sur la dalle. Si la marque mouillée persiste, l'humidité résiduelle est trop élevée — votre parquet va tuiler dans les 6 mois."
            />
            <TeaserTip
              number="02"
              title="Massif ≠ toujours mieux"
              text="Sur un sol chauffant ou en immeuble (chape fine), un contrecollé 14 mm de qualité tient mieux dans la durée qu'un massif 22 mm. Le marketing dit l'inverse — les artisans, non."
            />
            <TeaserTip
              number="03"
              title="L'huile gagne sur la vitrification"
              text="Une huile dure se rénove zone par zone, sans tout reponcer. Une vitrification se refait intégralement tous les 10-15 ans, à 35-50 €/m². Sur 30 ans, l'huile coûte moitié moins."
            />
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Le guide complet contient des dizaines d'autres conseils comme ceux-ci.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Recevez le guide en 30 secondes</h2>
          <p className="mt-4 text-muted-foreground">
            On vous envoie le PDF par email immédiatement. Pas de spam, jamais.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              <Download className="h-4 w-4" /> Recevoir le PDF gratuit
            </button>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold transition hover:bg-accent"
            >
              Lire d'abord en ligne <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Questions fréquentes
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">À propos du guide</h2>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
            {GUIDE_FAQ.slice(0, 5).map((f, i) => (
              <details key={i} className="group p-5 open:bg-secondary/30">
                <summary className="cursor-pointer font-display text-lg text-brand-ink">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {open && <DownloadGate onClose={() => setOpen(false)} />}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}

function TeaserTip({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <span
        aria-hidden
        className="absolute -top-3 left-5 rounded-full bg-brand-orange px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground"
      >
        Conseil {number}
      </span>
      <h3 className="mt-3 font-display text-xl text-brand-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
