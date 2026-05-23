import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Download, List, Mail, Phone, X } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DownloadGate } from "@/components/guide/DownloadGate";
import { FloatingGuideCta } from "@/components/guide/FloatingGuideCta";
import { CHAPTERS, GUIDE_COVER, GUIDE_META, getReadingTime, type Block } from "@/lib/guide-content";
import { GUIDE_FAQ } from "@/lib/guide-faq";

export const Route = createFileRoute("/guide")({
  component: GuideLayout,
  head: () => ({
    meta: [
      { title: "Le Guide Ultime du Parquet — Choisir, poser, entretenir · Parqueto" },
      {
        name: "description",
        content:
          "Le guide complet du parquet par Parqueto : choisir, poser, entretenir, rénover. Lexique, normes DTU, comparatifs et solutions concrètes. Libre accès, téléchargeable en PDF.",
      },
      { property: "og:title", content: "Le Guide Ultime du Parquet · Parqueto" },
      {
        property: "og:description",
        content: "Choisir, poser, entretenir, rénover : tout le savoir-faire des artisans du parquet, condensé dans un guide en libre accès.",
      },
      { property: "og:image", content: GUIDE_COVER },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
  }),
});

function GuideLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId !== "/guide" && m.routeId.startsWith("/guide"));
  if (isChild) return <Outlet />;
  return <GuideArticle />;
}

function GuideArticle() {
  const minutes = getReadingTime();
  const [gateOpen, setGateOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(CHAPTERS[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActiveId(vis[0].target.id.replace("chapitre-", ""));
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(`chapitre-${c.id}`);
      if (el) obs.observe(el);
    });

    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: GUIDE_META.title,
    author: { "@type": "Person", name: "Hicham Hikmi" },
    publisher: { "@type": "Organization", name: "Parqueto", url: "https://parqueto.fr" },
    inLanguage: "fr-FR",
    image: GUIDE_COVER,
    numberOfPages: CHAPTERS.length,

    description:
      "Guide professionnel pour choisir, poser, entretenir et rénover le parquet. Conseils d'artisans, normes DTU, comparatifs et diagnostics.",
    hasPart: CHAPTERS.map((c) => ({ "@type": "Chapter", name: c.title })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      {/* Reading progress bar */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-brand-orange/15 print:hidden"
      >
        <div
          className="h-full bg-brand-orange transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="print:hidden">
        <Header />
      </div>

      {/* HERO */}
      <section className="border-b border-border bg-gradient-warm print:hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
              {GUIDE_META.edition} · {minutes} min de lecture
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-balance sm:text-6xl">
              Le Guide Ultime <span className="italic text-brand-orange">du Parquet</span>
            </h1>
            <p className="mt-5 font-display text-xl text-muted-foreground">
              {GUIDE_META.subtitle}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Tout ce qu'un artisan expérimenté met dix ans à apprendre, condensé dans un seul guide.
              Rédigé par {GUIDE_META.author}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#chapitre-introduction"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep"
              >
                <BookOpen className="h-4 w-4" /> Commencer la lecture
              </a>
              <button
                onClick={() => setGateOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-card px-6 py-3 text-sm font-semibold text-brand-orange-deep transition hover:bg-brand-orange/10"
              >
                <Download className="h-4 w-4" /> Télécharger le PDF
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {CHAPTERS.length} chapitres · libre accès · PDF généré à la demande.
            </p>
          </div>

          <figure className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-brand-orange/10 blur-3xl" />
            <img
              src={GUIDE_COVER}
              alt="Couverture du Guide Ultime du Parquet — édition Parqueto"
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

      {/* SOMMAIRE */}
      <section className="border-b border-border print:hidden">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Sommaire</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">{CHAPTERS.length} chapitres</h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a
                  href={`#chapitre-${c.id}`}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-brand-orange/40 hover:bg-brand-orange/5"
                >
                  <span className="font-display text-2xl text-brand-orange">{c.number}</span>
                  <span>
                    <span className="block font-display text-lg leading-tight">{c.title}</span>
                    <span className="text-xs text-muted-foreground">{c.kicker}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PAGE DE GARDE IMPRIMÉE */}
      <section className="hidden print:flex print:min-h-screen print:flex-col print:items-center print:justify-center print:gap-6 print:p-12">
        <img src={GUIDE_COVER} alt="" className="max-h-[70vh] w-auto" />
        <p className="font-display text-2xl">{GUIDE_META.title}</p>
        <p className="text-sm text-muted-foreground">{GUIDE_META.subtitle}</p>
        <p className="text-xs text-muted-foreground">{GUIDE_META.author} — {GUIDE_META.edition}</p>
      </section>

      {/* CHAPITRES */}
      <article className="mx-auto max-w-3xl px-6 py-16 print:max-w-none print:px-0 print:py-0">
        {CHAPTERS.map((c, idx) => (
          <section
            key={c.id}
            id={`chapitre-${c.id}`}
            className="scroll-mt-24 border-b border-border pb-20 pt-20 first:pt-0 last:border-b-0 print:break-before-page print:pt-12"
          >
            <header className="mb-10 flex items-baseline gap-4 border-l-4 border-brand-orange pl-5">
              <span className="font-display text-5xl text-brand-orange/40">{c.number}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  {c.kicker}
                </p>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl">{c.title}</h2>
              </div>
            </header>

            <figure className="mb-10 overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={c.cover}
                alt={`Illustration du chapitre ${c.title}`}
                loading={idx === 0 ? "eager" : "lazy"}
                className="aspect-[16/10] w-full object-cover"
              />
            </figure>

            <p className="mb-12 font-display text-xl leading-relaxed text-brand-ink/85 sm:text-2xl">
              {c.intro}
            </p>

            {c.sections.map((s) => (
              <section key={s.id} className="mb-12 scroll-mt-24" id={`${c.id}-${s.id}`}>
                <h3 className="mb-5 font-display text-2xl text-brand-ink">{s.title}</h3>
                <div className="space-y-5">
                  {s.blocks.map((b, i) => (
                    <RenderBlock key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </section>
        ))}
      </article>

      {/* GUIDES CONNEXES / PROBLÉMATIQUES */}
      <section className="border-t border-border bg-muted/20 py-16 print:hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Problématiques courantes</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Parquet qui gondole</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Le problème le plus fréquent du parquet : diagnostic, causes, simulateur de gravité et devis sous 24 h.
              </p>
            </div>
            <Link
              to="/parquet-qui-gondole"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Voir le guide complet
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { slug: "degat-des-eaux", title: "Parquet gondolé après dégât des eaux", kicker: "Sinistre & assurance", icon: Droplets },
              { slug: "chauffage-au-sol", title: "Parquet gondolé sur chauffage au sol", kicker: "Installation & compatibilité", icon: Thermometer },
              { slug: "humidite", title: "Parquet gondolé à cause de l'humidité", kicker: "Diagnostic hygrométrie", icon: Droplets },
              { slug: "flottant", title: "Parquet flottant qui gondole", kicker: "Réparation & remplacement", icon: Layers },
            ].map((c) => (
              <Link
                key={c.slug}
                to="/parquet-qui-gondole/$cas"
                params={{ cas: c.slug }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-brand-orange/50 hover:bg-brand-orange/[0.03]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <c.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wider text-brand-orange">{c.kicker}</span>
                  <span className="mt-1 block font-display text-base text-foreground group-hover:text-brand-orange">{c.title}</span>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-orange" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-border bg-secondary/40 py-16 print:hidden">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Un projet de parquet ?</h2>
          <p className="mt-4 text-muted-foreground">
            Estimez votre projet en 2 minutes ou contactez nos artisans pour un conseil gratuit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Estimer mon projet <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+33184606061"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              <Phone className="h-4 w-4" /><span>01 84 60 60 61</span>
            </a>
            <a
              href="mailto:contact@parqueto.fr"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              <Mail className="h-4 w-4" /><span>contact@parqueto.fr</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-background py-20 print:hidden">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Questions fréquentes
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Tout ce qu'on nous demande</h2>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
            {GUIDE_FAQ.map((f, i) => (
              <details key={i} className="group p-5 open:bg-secondary/30">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="font-display text-lg text-brand-ink">{f.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-orange transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="print:hidden">
        <Footer />
      </div>

      {/* TOC flottante desktop */}
      <FloatingToc activeId={activeId} />

      {/* TOC mobile */}
      <button
        onClick={() => setTocOpen(true)}
        aria-label="Ouvrir le sommaire"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-card px-4 py-3 text-xs font-semibold text-brand-ink shadow-warm ring-1 ring-border transition hover:bg-accent lg:hidden print:hidden"
      >
        <List className="h-4 w-4" /> Sommaire
      </button>
      {tocOpen && <MobileToc activeId={activeId} onClose={() => setTocOpen(false)} />}

      {/* Mini CTA flottant non-intrusif */}
      <FloatingGuideCta onOpen={() => setGateOpen(true)} />

      {gateOpen && <DownloadGate onClose={() => setGateOpen(false)} />}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: GUIDE_FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </main>
  );
}

function FloatingToc({ activeId }: { activeId: string }) {
  return (
    <nav
      aria-label="Sommaire du guide"
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block print:hidden"
    >
      <ol className="pointer-events-auto max-h-[70vh] space-y-1 overflow-auto rounded-2xl border border-border bg-card/90 p-3 text-xs shadow-soft backdrop-blur">
        {CHAPTERS.map((c) => {
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <a
                href={`#chapitre-${c.id}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-brand-orange/10 text-brand-orange-deep"
                    : "text-muted-foreground hover:bg-accent hover:text-brand-ink"
                }`}
              >
                <span className="font-display text-sm">{c.number}</span>
                <span className="max-w-[160px] truncate">{c.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function MobileToc({ activeId, onClose }: { activeId: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-black/60 lg:hidden"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Sommaire</h3>
          <button onClick={onClose} className="rounded-full bg-secondary p-2" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ol className="mt-3 space-y-1">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a
                href={`#chapitre-${c.id}`}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  c.id === activeId
                    ? "bg-brand-orange/10 text-brand-orange-deep"
                    : "text-brand-ink hover:bg-accent"
                }`}
              >
                <span className="font-display text-base text-brand-orange">{c.number}</span>
                <span>{c.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-base leading-[1.75] text-brand-ink/85">{block.text}</p>;
    case "lead":
      return (
        <p className="border-l-2 border-brand-orange pl-4 font-display text-xl italic text-brand-ink">
          {block.text}
        </p>
      );
    case "h3":
      return <h4 className="mt-6 font-display text-xl text-brand-ink">{block.text}</h4>;
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-brand-ink/85">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="rounded-2xl border border-brand-orange/25 bg-brand-orange/[0.06] p-6 print:break-inside-avoid">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {block.title}
          </p>
          <p className="mt-2 font-display text-lg leading-snug text-brand-ink">{block.text}</p>
        </aside>
      );
    case "tip":
      return (
        <p className="rounded-xl border-l-4 border-brand-orange bg-secondary/50 px-4 py-3 text-sm leading-relaxed text-brand-ink/80">
          <span className="font-semibold text-brand-orange-deep">Astuce — </span>
          {block.text}
        </p>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border print:overflow-visible">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-secondary/60">
              <tr>
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-4 py-3 text-left font-display text-base text-brand-ink"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-secondary/20">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-b border-border/60 px-4 py-3 align-top text-brand-ink/80"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <figure className="overflow-hidden rounded-xl border border-border bg-muted">
          <img src={block.src} alt={block.caption || ""} loading="lazy" className="w-full" />
          {block.caption && (
            <figcaption className="border-t border-border bg-card px-4 py-2 text-xs italic text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}
