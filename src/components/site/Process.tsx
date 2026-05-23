import { Link } from "@tanstack/react-router";
import { MessagesSquare, Sparkles, HandHeart, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessagesSquare,
    title: "On parle de votre parquet",
    body: "Quelques questions simples, en français clair : la pièce, le bois, ce que vous aimez, ce qui vous gêne. Aucun jargon, aucune case piégeuse.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Vous recevez votre estimation",
    body: "Une fourchette de prix honnête, calée sur les vrais tarifs des artisans de votre région. De quoi enfin visualiser votre projet, sereinement.",
  },
  {
    n: "03",
    icon: HandHeart,
    title: "Un artisan partenaire vous accompagne",
    body: "Un seul professionnel, choisi pour son savoir-faire et pour votre projet. Il prend le temps de vous écouter, cadre les détails — et c'est tout. Pas de démarchage, pas de mise en concurrence.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 border-t border-border bg-secondary/40 pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="grain pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Comment ça se passe
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Trois étapes,
            <span className="block italic text-brand-orange">et votre projet respire.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Ni formulaire interminable, ni course aux devis. Juste une méthode douce et claire,
            pensée avec des artisans qui aiment leur métier — pour que vous repreniez la main sur votre parquet.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-display text-5xl text-brand-orange/15 transition group-hover:text-brand-orange/35">
                  {n}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-muted-foreground">
          Une estimation en quelques minutes. Un interlocuteur de confiance.
          <span className="text-foreground"> Et votre tranquillité, surtout.</span>
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/estimation"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-6 py-3 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-primary-foreground"
          >
            Voir les tarifs détaillés
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
