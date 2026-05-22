import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GuidePageBlock } from "@/components/guide/GuidePage";
import {
  CHAPTERS,
  getChapter,
  getPagesByChapter,
  type ChapterSlug,
  type GuidePage,
} from "@/lib/guide-data";

export const Route = createFileRoute("/guide/$slug")({
  component: ChapterPage,
  loader: ({ params }) => {
    const chapter = getChapter(params.slug as ChapterSlug);
    if (!chapter) throw notFound();
    const pages = getPagesByChapter(params.slug as ChapterSlug);
    return { chapter, pages };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { chapter, pages } = loaderData;
    return {
      meta: [
        { title: chapter.seoTitle },
        { name: "description", content: chapter.seoDescription },
        { property: "og:title", content: chapter.seoTitle },
        { property: "og:description", content: chapter.seoDescription },
        ...(pages[0]?.asset
          ? [
              { property: "og:image", content: pages[0].asset },
              { name: "twitter:image", content: pages[0].asset },
            ]
          : []),
        { name: "robots", content: "index, follow, max-image-preview:large" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="text-muted-foreground">Chapitre introuvable.</p>
      <Link to="/guide" className="mt-4 inline-block text-brand-orange underline">
        Retour au guide
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Erreur de chargement.</div>
  ),
});

function ChapterPage() {
  const { chapter, pages } = Route.useLoaderData();
  const order = CHAPTERS.filter((c) => getPagesByChapter(c.slug).length > 0);
  const idx = order.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx < order.length - 1 ? order[idx + 1] : null;

  // JSON-LD: Article + HowTo (when text is procedural) + Breadcrumb
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://parqueto.fr/" },
      { "@type": "ListItem", position: 2, name: "Guide du parquet", item: "https://parqueto.fr/guide" },
      { "@type": "ListItem", position: 3, name: chapter.title, item: `https://parqueto.fr/guide/${chapter.slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.title,
    description: chapter.seoDescription,
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Parqueto" },
    publisher: {
      "@type": "Organization",
      name: "Parqueto",
      logo: { "@type": "ImageObject", url: "https://parqueto.fr/logo.png" },
    },
    image: pages.map((p) => p.asset).filter(Boolean).slice(0, 6),
    articleSection: chapter.title,
    keywords: Array.from(new Set(pages.flatMap((p) => p.keywords || []))).join(", "),
  };

  const howTo = ["poser", "entretenir", "renover"].includes(chapter.slug)
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: chapter.title,
        description: chapter.seoDescription,
        inLanguage: "fr-FR",
        step: pages.map((p, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: p.title || `Étape ${i + 1}`,
          text: p.summary || p.text.slice(0, 280),
          image: p.asset,
        })),
      }
    : null;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      <section className="border-b border-border bg-secondary/30 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <nav aria-label="Fil d'Ariane" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-brand-orange">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/guide" className="hover:text-brand-orange">Guide</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{chapter.title}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Chapitre {idx + 1} · {pages.length} pages
          </p>
          <h1 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
            {chapter.hero}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{chapter.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        {pages.map((p, i) => (
          <GuidePageBlock key={`${p.chapter}-${p.order}`} page={p} index={i} />
        ))}
      </section>

      <section className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-4 px-6 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              to="/guide/$slug"
              params={{ slug: prev.slug }}
              className="group flex-1 rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange/40 hover:shadow-soft"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Chapitre précédent
              </p>
              <p className="mt-2 font-display text-xl">{prev.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              to="/guide/$slug"
              params={{ slug: next.slug }}
              className="group flex-1 rounded-2xl border border-border bg-card p-5 text-right transition hover:border-brand-orange/40 hover:shadow-soft"
            >
              <p className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Chapitre suivant <ArrowRight className="h-3 w-3" />
              </p>
              <p className="mt-2 font-display text-xl">{next.title}</p>
            </Link>
          ) : (
            <Link
              to="/guide/lecture"
              className="group flex-1 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5 text-right transition hover:bg-brand-orange/10"
            >
              <p className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-deep">
                Lire en mode flipbook <BookOpen className="h-3 w-3" />
              </p>
              <p className="mt-2 font-display text-xl">Mode lecture interactif</p>
            </Link>
          )}
        </div>
      </section>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {howTo && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      )}
    </main>
  );
}
