import { useState } from "react";
import { Plus } from "lucide-react";

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
    <section id="process-faq" className="scroll-mt-24 py-20 sm:py-24">
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
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Encore une hésitation ?
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
            Ce que les gens nous demandent
            <span className="block italic text-brand-orange">avant de se lancer.</span>
          </h2>
        </div>

        <ul className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-secondary/40"
                >
                  <span className="font-display text-base leading-snug text-foreground sm:text-lg">
                    {f.q}
                  </span>
                  <Plus
                    className={`mt-1 h-5 w-5 flex-shrink-0 text-brand-orange transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
