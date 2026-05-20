import { ShieldCheck, Calculator, Handshake, BellOff } from "lucide-react";

const proofs = [
  {
    icon: Calculator,
    title: "Estimation immédiate et transparente",
    body: "Une fourchette de prix honnête basée sur les vrais tarifs du parquet — pas un devis fantôme à rallonge.",
  },
  {
    icon: Handshake,
    title: "Un seul artisan partenaire",
    body: "Un professionnel vérifié, sélectionné pour votre projet. Pas trois, pas cinq — un interlocuteur de confiance.",
  },
  {
    icon: BellOff,
    title: "Zéro démarchage",
    body: "Votre numéro ne circule pas. Pas d'appels en rafale, pas de relances commerciales. Vous gardez la main.",
  },
];

export function Promise() {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <ShieldCheck className="h-3.5 w-3.5" />
            Notre engagement
          </span>
          <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Zéro guerre de devis.
            <span className="block italic text-brand-orange">Juste un projet bien cadré.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Parqueto n'est pas une plateforme de mise en concurrence. On vous donne une estimation
            claire, puis on vous met en lien avec un seul artisan partenaire, choisi pour la qualité
            de son travail — pas pour avoir crié le plus fort.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {proofs.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
