import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardEdit, Sparkles, UserCheck } from "lucide-react";

const teaserSteps = [
  {
    icon: ClipboardEdit,
    title: "Vous décrivez",
    body: "Quelques questions simples sur votre projet parquet — type, surface, état.",
  },
  {
    icon: Sparkles,
    title: "On estime",
    body: "Une fourchette de prix honnête, calée sur les tarifs réels de votre région.",
  },
  {
    icon: UserCheck,
    title: "Un artisan contacte",
    body: "Le bon artisan vérifié vous appelle sous 24 h. Un seul, choisi pour vous.",
  },
];

export function JourneyTeaser() {
  return (
    <section id="parcours-teaser" className="scroll-mt-24 border-t border-border bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Comment ça marche
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
            Trois gestes, <span className="italic text-brand-orange">et votre projet avance.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pas de formulaire interminable, pas de course aux devis. Voici le cœur du parcours Parqueto.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {teaserSteps.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-display text-sm text-brand-orange/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/comment-ca-marche"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
          >
            Voir le parcours complet
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
