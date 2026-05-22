import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

const articles = BLOG_POSTS.slice(0, 3).map((p) => ({
  slug: p.slug,
  img: p.cover,
  category: p.category,
  date: p.dateLabel,
  readTime: p.readTime,
  title: p.title,
  excerpt: p.excerpt,
}));

export function Blog() {
  return (
    <section id="blog" className="scroll-mt-24 border-y border-border bg-secondary/40 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Journal
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
              Le parquet, expliqué <span className="italic text-brand-orange">sans détour.</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="group hidden items-center gap-2 text-sm font-semibold text-foreground transition hover:text-brand-orange sm:inline-flex"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile: snap carousel · Desktop: grid */}
        <div className="mt-12 md:hidden">
          <div
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {articles.map((a, i) => (
              <article
                key={a.slug}
                className="group flex w-[85%] flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition active:scale-[0.985] active:shadow-warm"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: a.slug }}
                  className="relative block overflow-hidden"
                >
                  <img
                    src={a.img}
                    alt={a.title}
                    className="aspect-[5/3] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-orange backdrop-blur">
                    {a.category}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-foreground/85 px-2.5 py-1 text-[10px] font-semibold text-background backdrop-blur">
                    {i + 1}/{articles.length}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{a.date}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{a.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[22px] leading-tight text-balance">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: a.slug }}
                      className="transition active:text-brand-orange"
                    >
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted-foreground line-clamp-3">
                    {a.excerpt}
                  </p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: a.slug }}
                    className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange transition active:bg-brand-orange active:text-primary-foreground"
                  >
                    Lire l'article
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {articles.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-border first:w-6 first:bg-brand-orange"
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="mt-14 hidden gap-6 md:grid md:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="relative block overflow-hidden"
              >
                <img
                  src={a.img}
                  alt={a.title}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-orange backdrop-blur">
                  {a.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{a.date}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{a.readTime} de lecture</span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-snug text-balance">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: a.slug }}
                    className="transition hover:text-brand-orange"
                  >
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: a.slug }}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
                >
                  Lire l'article
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
