import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";

const faqs = [
  {
    q: "Combien d'artisans vais-je avoir au bout du fil ?",
    a: "Un seul. Parqueto n'est pas une plateforme de mise en concurrence : on cadre votre projet, puis on vous oriente vers un artisan partenaire vérifié, choisi pour son savoir-faire et la nature de votre chantier. Pas trois, pas cinq — un interlocuteur, une relation de confiance.",
  },
  {
    q: "Vais-je être démarché ou recevoir des appels en rafale ?",
    a: "Non. Votre numéro ne circule pas, vos coordonnées ne sont jamais revendues. L'artisan partenaire vous contacte une seule fois, à l'horaire que vous indiquez. Aucune relance commerciale, aucun spam — vous gardez la main, toujours.",
  },
  {
    q: "L'estimation est-elle vraiment gratuite et sans engagement ?",
    a: "Oui, totalement. Vous obtenez une fourchette de prix claire en quelques minutes, sans inscription préalable obligatoire. Vous décidez ensuite, à votre rythme, si vous voulez aller plus loin avec notre artisan partenaire — ou pas.",
  },
  {
    q: "Sur quoi se base l'estimation que vous me donnez ?",
    a: "Sur les tarifs réellement pratiqués par les artisans parqueteurs de votre région, croisés avec les paramètres de votre projet : surface, type de bois, état du sol, prestation souhaitée. C'est une fourchette honnête, pas un chiffre marketing.",
  },
  {
    q: "Et si je veux comparer plusieurs prix quand même ?",
    a: "Vous restez libre, bien sûr. Mais notre rôle n'est pas d'organiser une compétition entre artisans : c'est de vous donner un repère de prix fiable et un artisan sérieux qui prend le temps de comprendre votre parquet. La plupart de nos clients trouvent ça reposant.",
  },
  {
    q: "Que se passe-t-il si le projet ne me convient pas ?",
    a: "Aucun problème : aucun engagement, aucun frais. L'estimation est à vous, et vous pouvez vous arrêter à n'importe quelle étape. On préfère un projet bien cadré qu'un projet forcé.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <ShieldCheck className="h-3.5 w-3.5" />
            On vous répond clairement
          </span>
          <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Vos questions,
            <span className="block italic text-brand-orange">nos réponses honnêtes.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pas de petite étoile, pas d'astérisque caché. Voilà ce qu'on dit, sans détour.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-secondary/40"
                >
                  <span className="font-display text-lg leading-snug text-foreground sm:text-xl">
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
