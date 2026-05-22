import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { BLOG_POSTS, getPostBySlug, type PostBlock } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article — Parqueto" }] };
    return {
      meta: [
        { title: `${post.title} · Parqueto` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.cover },
        { property: "article:published_time", content: post.date },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.cover },
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-3xl">Article introuvable</h1>
      <Link to="/blog" className="mt-6 inline-block text-brand-orange underline">
        Retour au blog
      </Link>
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-3xl">Une erreur est survenue</h1>
      <Link to="/blog" className="mt-6 inline-block text-brand-orange underline">
        Retour au blog
      </Link>
    </main>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData() as { post: import("@/lib/blog-posts").BlogPost };

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [post.cover],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Parqueto" },
    publisher: {
      "@type": "Organization",
      name: "Parqueto",
      url: "https://parqueto.fr",
    },
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${post.slug}` },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-12 sm:pt-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au journal
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {post.category}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {post.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.readTime} de lecture
            </span>
          </div>
        </header>

        <figure className="my-10 overflow-hidden rounded-2xl border border-border bg-muted">
          <img src={post.cover} alt={post.title} className="aspect-[16/9] w-full object-cover" />
        </figure>

        <div className="space-y-5">
          {post.blocks.map((b, i) => (
            <PostBlockView key={i} block={b} />
          ))}
        </div>

        {/* Bannière contextuelle vers le chapitre du guide */}
        <GuideBanner variant="wide" anchor={post.guideAnchor} ctaLabel={post.guideCtaLabel} />

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-display text-2xl text-brand-ink">Questions fréquentes</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
            {post.faq.map((f, i) => (
              <details key={i} className="group p-5 open:bg-secondary/30">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="font-display text-base text-brand-ink">{f.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-orange transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Articles liés */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-2xl">À lire ensuite</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-brand-orange/40 hover:shadow-soft"
                >
                  <img src={r.cover} alt="" className="aspect-[16/10] w-full object-cover" />
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {r.category}
                    </p>
                    <p className="mt-2 font-display text-lg leading-tight text-brand-ink group-hover:text-brand-orange-deep">
                      {r.title}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange">
                      Lire l'article <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}

function PostBlockView({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-base leading-[1.8] text-brand-ink/85">{block.text}</p>;
    case "h2":
      return <h2 className="mt-10 font-display text-2xl text-brand-ink sm:text-3xl">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-6 font-display text-xl text-brand-ink">{block.text}</h3>;
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-brand-ink/85">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-brand-orange pl-4 font-display text-xl italic text-brand-ink">
          {block.text}
        </blockquote>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-secondary/60">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="border-b border-border px-4 py-3 text-left font-display text-base text-brand-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="even:bg-secondary/20">
                  {row.map((c, ci) => (
                    <td key={ci} className="border-b border-border/60 px-4 py-3 align-top text-brand-ink/80">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
