import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, Users, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/confrerie-du-parquet_/candidater/merci")({
  component: MerciPage,
  head: () => ({
    meta: [
      { title: "Candidature reçue — Confrérie du Parquet · Parqueto" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const NEXT_STEPS = [
  {
    icon: Mail,
    title: "Accusé de réception",
    body: "Un mail récapitulatif arrive dans votre boîte sous quelques minutes.",
    delay: "Sous 10 min",
  },
  {
    icon: Users,
    title: "Étude par le comité",
    body: "Trois membres fondateurs examinent votre dossier (décennale, savoir-faire, motivation).",
    delay: "Sous 7 jours ouvrés",
  },
  {
    icon: CheckCircle2,
    title: "Réponse & accueil",
    body: "En cas d'avis favorable, invitation au canal privé + appel d'accueil avec un parrain.",
    delay: "Semaine suivante",
  },
];

function MerciPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-3xl leading-tight sm:text-5xl">
            Candidature reçue.{" "}
            <span className="block italic text-brand-orange">Bienvenue dans le tunnel.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Merci d'avoir pris le temps de candidater. La Confrérie examine chaque dossier
            avec attention — c'est ce qui en fait sa valeur.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Et maintenant ?
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">Les trois prochaines étapes.</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-brand-orange/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                    <s.icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
                  {s.delay}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              to="/artisan-verifie"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Découvrir le badge Artisan Vérifié
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
