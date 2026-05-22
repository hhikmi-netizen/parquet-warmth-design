import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Download, Layers } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DownloadGate } from "@/components/guide/DownloadGate";
import { getChapterStats } from "@/lib/guide-data";

export const Route = createFileRoute("/guide")({
  component: GuideLayout,
  head: () => ({
    meta: [
      { title: "Le guide ultime du parquet — Conseils d'artisans · Parqueto" },
      {
        name: "description",
        content:
          "Le guide complet du parquet par les artisans Parqueto : choisir, poser, entretenir, rénover. 79 pages d'expertise illustrée, en libre accès.",
      },
      { property: "og:title", content: "Le guide ultime du parquet · Parqueto" },
      {
        property: "og:description",
        content: "79 pages d'expertise artisanale en libre accès : choisir, poser, entretenir, rénover.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
  }),
});

function GuideLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId !== "/guide" && m.routeId.startsWith("/guide"));
  if (isChild) return <Outlet />;
  return <GuideHub />;
}

function GuideHub() {
  const chapters = getChapterStats();
  const [dlOpen, setDlOpen] = useState(false);
  const total = chapters.reduce((s, c) => s + c.count, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Le guide ultime du parquet",
    author: { "@type": "Organization", name: "Parqueto" },
    publisher: { "@type": "Organization", name: "Parqueto" },
    inLanguage: "fr-FR",
    numberOfPages: total,
    description:
      "Guide professionnel pour choisir, poser, entretenir et rénover le parquet. Conseils d'artisans, normes DTU, techniques de pose et solutions aux problèmes.",
    hasPart: chapters.map((c) => ({
      "@type": "Chapter",
      name: c.title,
      url: `https://parqueto.fr/guide/${c.slug}`,
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      <section className="border-b border-border bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Le guide ultime
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-6xl">
            Le parquet, <span className="italic text-brand-orange">expliqué de A à Z.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {total} pages d'expertise artisanale en libre accès. Choisir, poser, finir, entretenir,
            rénover : tout ce que les meilleurs poseurs de parquet partagent rarement, condensé dans
            un seul guide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/guide/lecture"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              <BookOpen className="h-4 w-4" /> Lire le guide
            </Link>
            <button
              onClick={() => setDlOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-card px-6 py-3 text-sm font-semibold text-brand-orange-deep transition hover:bg-brand-orange/10"
            >
              <Download className="h-4 w-4" /> Télécharger le PDF
            </button>
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {dlOpen && <DownloadGate onClose={() => setDlOpen(false)} />}

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Sommaire
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                {chapters.length} chapitres, {total} pages
              </h2>
            </div>
            <Layers className="hidden h-10 w-10 text-brand-orange/60 sm:block" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((c, i) => (
              <Link
                key={c.slug}
                to="/guide/$slug"
                params={{ slug: c.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {c.cover && (
                    <img
                      src={c.cover}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                    Chapitre {i + 1} · {c.count} pages
                  </p>
                  <h3 className="mt-2 font-display text-2xl">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
