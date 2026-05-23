import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone, Euro, BookOpen } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { Pillar } from "@/lib/pillars";

interface Props {
  pillar: Pillar;
}

/**
 * Layout réutilisable pour les piliers SEO longue-traîne.
 * Hero + intro + table comparatif + sections + FAQ visible + maillage + CTA.
 */
export function PillarPage({ pillar }: Props) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-cream/50 via-background to-background">
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-brand-orange">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <Link to="/guide" className="hover:text-brand-orange">
              Guide
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{pillar.h1}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <BookOpen className="h-3.5 w-3.5 text-brand-orange" />
                {pillar.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                {pillar.h1}{" "}
                {pillar.h1Highlight && (
                  <span className="italic text-brand-orange">{pillar.h1Highlight}</span>
                )}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {pillar.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/estimation"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
                >
                  Estimer mon projet <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  <Phone className="h-4 w-4" /> Être rappelé
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft">
                {pillar.stats.map((s) => (
                  <div key={s.label} className="bg-card p-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-display text-lg text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Table */}
      {pillar.table && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              {pillar.table.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">{pillar.table.title}</h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    {pillar.table.headers.map((h) => (
                      <th
                        key={h}
                        className="border-b border-border px-4 py-3 text-left font-display text-xs font-semibold uppercase tracking-wider text-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pillar.table.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="transition hover:bg-secondary/20"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`border-b border-border/60 px-4 py-3 ${
                            ci === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Sections */}
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 space-y-14">
          {pillar.sections.map((s) => (
            <article key={s.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                {s.kicker}
              </p>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl">{s.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {s.intro}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Questions fréquentes
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Tout ce qu'on nous demande sur ce sujet
          </h2>
          <div className="mt-10 space-y-3">
            {pillar.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-card p-5 transition open:shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base text-foreground">
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-brand-orange transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Pour aller plus loin
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Sujets liés</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {pillar.related.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-brand-orange/40 hover:shadow-soft"
                >
                  <span className="font-medium text-foreground">{r.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-brand-orange transition group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-foreground py-16 text-background sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-background sm:text-4xl">
            {pillar.ctaTitle}
          </h2>
          <p className="mt-4 text-background/70">{pillar.ctaText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              <Euro className="h-4 w-4" /> Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-background/25 px-5 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
            >
              <Phone className="h-4 w-4" /> Être rappelé
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/**
 * Construit le head() partagé pour une page pilier : title/meta/og + Article + FAQPage + Breadcrumb.
 */
export function buildPillarHead(pillar: Pillar) {
  const url = `/${pillar.slug}`;
  return {
    meta: [
      { title: pillar.title },
      { name: "description", content: pillar.description },
      { name: "keywords", content: pillar.keywords },
      { property: "og:title", content: pillar.title },
      { property: "og:description", content: pillar.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: pillar.title },
      { name: "twitter:description", content: pillar.description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pillar.h1,
          description: pillar.description,
          inLanguage: "fr-FR",
          author: { "@type": "Organization", name: "Parqueto" },
          publisher: {
            "@type": "Organization",
            name: "Parqueto",
            logo: { "@type": "ImageObject", url: "https://parqueto.fr/logo.png" },
          },
          mainEntityOfPage: `https://parqueto.fr${url}`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pillar.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://parqueto.fr/" },
            { "@type": "ListItem", position: 2, name: "Guide", item: "https://parqueto.fr/guide" },
            { "@type": "ListItem", position: 3, name: pillar.h1, item: `https://parqueto.fr${url}` },
          ],
        }),
      },
    ],
  };
}
