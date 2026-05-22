import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Sparkles, BookOpen, Wrench } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "L'éclat du parquet — Newsletter mensuelle Parqueto" },
      {
        name: "description",
        content:
          "Une fois par mois : conseils entretien parquet, tendances pose et finitions, offres exclusives artisans. 100 % utile, 0 % spam.",
      },
      { property: "og:title", content: "L'éclat du parquet — Newsletter Parqueto" },
      { property: "og:description", content: "Newsletter mensuelle parquet : conseils, tendances, offres." },
      { property: "og:url", content: "/newsletter" },
    ],
    links: [{ rel: "canonical", href: "/newsletter" }],
  }),
  component: NewsletterPage,
});

// TODO (Claude) : remplacer par fetch des archives depuis Supabase
//   - Table : newsletter_issues (number, slug, title, summary, sent_at, content_html)
const MOCK_ARCHIVES = [
  { n: 7, date: "Mai 2026", title: "Parquet & lumière de printemps", summary: "Choisir une finition mate ou satinée selon l'exposition de votre pièce." },
  { n: 6, date: "Avril 2026", title: "Pose chevron vs point de Hongrie", summary: "Deux classiques, deux personnalités. Le comparatif visuel." },
  { n: 5, date: "Mars 2026", title: "Entretien après vitrification", summary: "Les 5 gestes simples qui prolongent un vitrificateur de 5 ans." },
];

function NewsletterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <section className="bg-gradient-to-b from-brand-orange/8 to-transparent py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
              <Mail className="h-3.5 w-3.5" /> Mensuelle · Gratuite
            </p>
            <h1 className="mt-6 font-display text-5xl tracking-tight text-foreground sm:text-6xl">
              L'éclat <span className="italic text-brand-orange">du parquet.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Une newsletter mensuelle, courte, utile et belle. Conseils d'entretien,
              tendances de pose et finitions, offres exclusives chez nos artisans partenaires.
              <br />
              Pas de spam, pas de pub, désinscription en 1 clic.
            </p>
            <div className="mx-auto mt-10 max-w-xl">
              <NewsletterSignup source="newsletter-page" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center font-display text-3xl text-foreground">Ce que vous y trouverez</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { icon: BookOpen, title: "Guides courts", body: "1 sujet = 3 minutes de lecture. Concret, illustré, sourcé." },
                { icon: Sparkles, title: "Tendances", body: "Essences, teintes, motifs : ce qui se fait chez les architectes en ce moment." },
                { icon: Wrench, title: "Offres artisans", body: "Tarifs négociés, créneaux libérés, opérations spéciales saisonnières." },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-display text-3xl text-foreground">Archives</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Les derniers numéros — accessibles librement.
            </p>
            <ul className="mt-8 space-y-3">
              {MOCK_ARCHIVES.map((a) => (
                <li
                  key={a.n}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 font-display text-lg text-brand-orange">
                    #{a.n}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{a.date}</div>
                    <h3 className="mt-0.5 font-display text-lg text-foreground group-hover:text-brand-orange">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Archives complètes bientôt disponibles · <Link to="/blog" className="underline hover:text-brand-orange">visitez le blog</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
