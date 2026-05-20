import { ArrowRight, ArrowUpRight } from "lucide-react";
import poncage from "@/assets/artisan.jpg";
import vitrif from "@/assets/vitrification.jpg";
import ancien from "@/assets/parquet-ancien.jpg";

const articles = [
  {
    img: poncage,
    category: "Ponçage",
    date: "Mai 2026",
    readTime: "6 min",
    title: "Poncer son parquet : la méthode des pros, étape par étape",
    excerpt:
      "Grain, machine, sens du fil, dépoussiérage. Tout ce qu'un artisan vérifie avant de lancer le ponçage — et ce que vous devriez exiger d'un devis sérieux.",
  },
  {
    img: vitrif,
    category: "Finitions",
    date: "Avr. 2026",
    readTime: "4 min",
    title: "Vitrification, huile ou cire : quelle finition pour votre parquet ?",
    excerpt:
      "Mate, satinée, brillante, naturelle. On compare tenue dans le temps, entretien, rendu visuel et coût au m² pour vous aider à trancher sans regret.",
  },
  {
    img: ancien,
    category: "Patrimoine",
    date: "Mars 2026",
    readTime: "8 min",
    title: "Rénover un parquet ancien sans le dénaturer",
    excerpt:
      "Point de Hongrie, Versailles, lames anciennes. Les bons réflexes pour restaurer un parquet d'époque tout en respectant son âme et ses assemblages.",
  },
];

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
          <a
            href="#blog"
            className="group hidden items-center gap-2 text-sm font-semibold text-foreground transition hover:text-brand-orange sm:inline-flex"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <a href="#blog" className="relative block overflow-hidden">
                <img
                  src={a.img}
                  alt={a.title}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-orange backdrop-blur">
                  {a.category}
                </span>
              </a>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{a.date}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{a.readTime} de lecture</span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-snug text-balance">
                  <a href="#blog" className="transition hover:text-brand-orange">
                    {a.title}
                  </a>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <a
                  href="#blog"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
                >
                  Lire l'article
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <a
            href="#blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
