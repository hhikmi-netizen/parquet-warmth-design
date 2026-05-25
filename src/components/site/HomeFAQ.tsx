import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessagesSquare } from "lucide-react";
import { FaqAccordion } from "@/components/site/FaqAccordion";

const homeFaqs = [
  {
    q: "Comment se passe l'estimation en ligne ?",
    a: "Quelques questions simples sur votre projet : surface, type de parquet, prestation souhaitée. Pas de jargon, pas de case piégeuse. En 5 minutes, vous recevez une fourchette de prix calée sur les vrais tarifs des artisans de votre région.",
  },
  {
    q: "L'estimation est-elle vraiment gratuite et sans engagement ?",
    a: "Oui, totalement. Vous n'avez pas besoin de créer un compte pour obtenir votre estimation. C'est un repère de prix honnête, pas un piège commercial. Vous décidez ensuite, à votre rythme, si vous voulez aller plus loin.",
  },
  {
    q: "Comment choisissez-vous l'artisan pour mon projet ?",
    a: "Notre algorithme croise trois critères : la zone d'intervention, la spécialité métier (pose, ponçage, rénovation…) et le niveau de qualification. Un seul artisan vous est proposé — celui qui correspond vraiment à votre chantier.",
  },
  {
    q: "Sous quel délai l'artisan me contacte-t-il ?",
    a: "Dans 95 % des cas, sous 24 heures ouvrées après votre demande. Il prend le temps de vous écouter, propose une visite si nécessaire, et établit un devis détaillé. Pas de démarchage, pas de relance.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait du devis ?",
    a: "Aucun engagement, aucun frais. L'estimation vous appartient. Si le courant ne passe pas avec l'artisan proposé, on en discute et on vous oriente vers une autre solution. On préfère un projet bien cadré qu'un projet forcé.",
  },
];

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq-home" className="scroll-mt-24 border-t border-border bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <MessagesSquare className="h-3.5 w-3.5" />
            Les essentiels
          </span>
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
            Vous avez des questions ?{" "}
            <span className="italic text-brand-orange">On y répond.</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Les 5 questions que se posent le plus souvent après avoir découvert le parcours.
            Pour tout le reste, la page complète vous attend.
          </p>
        </div>

        <div className="mt-10">
          <FaqAccordion items={homeFaqs} open={open} onToggle={setOpen} size="sm" />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Vous voulez voir le parcours en détail, côté client comme côté artisan ?
          </p>
          <Link
            to="/comment-ca-marche"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-5 py-2.5 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-primary-foreground"
          >
            Tout le parcours expliqué
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
