import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  AlertTriangle,
  Hammer,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  getGondolageCase,
  GONDOLAGE_CASES,
  type GondolageCase,
} from "@/lib/gondolage-cases";

export const Route = createFileRoute("/parquet-qui-gondole/$cas")({
  loader: ({ params }) => {
    const cas = getGondolageCase(params.cas);
    if (!cas) throw notFound();
    return { cas };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { cas } = loaderData;
    const url = `/parquet-qui-gondole/${cas.slug}`;
    return {
      meta: [
        { title: `${cas.metaTitle} · Parqueto` },
        { name: "description", content: cas.metaDesc },
        { name: "keywords", content: cas.keywords.join(", ") },
        { property: "og:title", content: cas.metaTitle },
        { property: "og:description", content: cas.metaDesc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "fr_FR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: cas.metaTitle },
        { name: "twitter:description", content: cas.metaDesc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: cas.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Parquet qui gondole",
                item: "/parquet-qui-gondole",
              },
              { "@type": "ListItem", position: 3, name: cas.h1, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CasPage,
});

function CasPage() {
  const data = Route.useLoaderData() as { cas: GondolageCase };
  const cas = data.cas;
  const others = GONDOLAGE_CASES.filter((c) => c.slug !== cas.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/30 px-6 pb-14 pt-28 lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Accueil</Link>
              <span>/</span>
              <Link to="/parquet-qui-gondole" className="hover:text-foreground">
                Parquet qui gondole
              </Link>
              <span>/</span>
              <span className="text-foreground">{cas.h1}</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
              <AlertTriangle className="h-3 w-3" />
              Cas spécifique
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl">
              {cas.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{cas.intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/estimation"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
              >
                <FileText className="h-4 w-4" />
                Demander un devis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/parquet-qui-gondole"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Simulateur de gravité
              </Link>
            </div>
          </div>
        </section>

        {/* Symptômes */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Reconnaître les symptômes
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {cas.symptomes.map((s) => (
                <li key={s} className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                  <span className="text-sm text-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Causes */}
        <section className="bg-secondary/40 px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Causes techniques
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {cas.causes.map((c, i) => (
                <div key={c.title} className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <h3 className="mt-3 font-display text-base text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions + prix */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Solutions & fourchettes de prix
            </h2>
            <div className="mt-6 space-y-3">
              {cas.solutions.map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/30 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <div className="font-display text-lg text-foreground">{s.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                  <div className="flex-shrink-0 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange">
                    {s.prix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-secondary/40 px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Questions fréquentes
            </h2>
            <FaqList items={cas.faq} />
          </div>
        </section>

        {/* Autres cas */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              Autres cas de gondolage
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to="/parquet-qui-gondole/$cas"
                  params={{ cas: o.slug }}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-background p-5 transition hover:border-brand-orange/50"
                >
                  <Hammer className="mt-1 h-4 w-4 flex-shrink-0 text-brand-orange" />
                  <div className="flex-1">
                    <div className="font-display text-sm text-foreground group-hover:text-brand-orange">
                      {o.h1}
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-orange" />
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/parquet-qui-gondole"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline"
              >
                ← Retour au guide principal
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-foreground p-10 text-background">
            <h2 className="font-display text-2xl sm:text-3xl">
              Besoin d'un devis pour votre cas précis ?
            </h2>
            <p className="mt-3 max-w-xl text-background/75">
              Décrivez votre situation, recevez une fourchette de prix honnête,
              et un artisan vérifié vous rappelle sous 24 h.
            </p>
            <Link
              to="/estimation"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-brand-orange-deep"
            >
              <FileText className="h-4 w-4" />
              Demander un devis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-6 space-y-3">
      {items.map((f, i) => (
        <div key={f.q} className="rounded-2xl border border-border bg-background">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-semibold text-foreground">{f.q}</span>
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
