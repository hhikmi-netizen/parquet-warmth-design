import { useState } from "react";
import { FaqAccordion } from "@/components/site/FaqAccordion";

const items = [
  {
    q: "Combien de temps prend l'estimation ?",
    a: "Comptez 3 à 5 minutes pour répondre aux questions et obtenir votre fourchette de prix. Pas de formulaire interminable, pas de rendez-vous à caler avant de savoir où vous mettez les pieds.",
  },
  {
    q: "À quel point la fourchette de prix est-elle précise ?",
    a: "Elle est calée sur les tarifs réellement pratiqués par les artisans parqueteurs de votre région, croisés avec votre surface, le type de bois et l'état du sol. C'est une estimation honnête, pas un chiffre d'accroche — la plupart des projets atterrissent à l'intérieur.",
  },
  {
    q: "Comment les détails du chantier sont-ils cadrés ensuite ?",
    a: "L'artisan partenaire vous rappelle pour valider les points qui font vraiment varier le prix : sens des lames, état du support, finition, accès. Un seul échange, posé, pour transformer l'estimation en projet clair — puis une visite si c'est nécessaire.",
  },
  {
    q: "Vais-je être démarché après l'estimation ?",
    a: "Non. Votre numéro ne circule pas, vos coordonnées ne sont jamais revendues. Un seul artisan partenaire vous contacte, une seule fois, à l'horaire que vous indiquez. Aucune relance commerciale, aucun spam — vous gardez la main.",
  },
  {
    q: "Suis-je engagé après avoir reçu mon estimation ?",
    a: "Pas du tout. L'estimation est gratuite, sans inscription préalable obligatoire, sans engagement. Vous décidez à votre rythme — ou pas du tout. On préfère un projet bien cadré qu'un projet forcé.",
  },
];

export function ProcessFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="process-faq"
      className="relative scroll-mt-24 border-b border-border bg-secondary/40 pt-4 pb-24 sm:pt-6 sm:pb-28"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Encore une hésitation ?
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Ce que les gens nous demandent
            <span className="block italic text-brand-orange">avant de se lancer.</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <FaqAccordion items={items} open={open} onToggle={setOpen} size="sm" />
        </div>
      </div>
    </section>
  );
}
