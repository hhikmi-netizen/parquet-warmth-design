const steps = [
  {
    n: "01",
    title: "Décrivez votre parquet",
    body: "Surface, état, type de bois, vos envies. Quelques questions simples, en français clair — pas de jargon.",
  },
  {
    n: "02",
    title: "Recevez votre estimation",
    body: "Une fourchette de prix honnête, basée sur les vrais tarifs pratiqués par les artisans de votre région.",
  },
  {
    n: "03",
    title: "Échangez avec un artisan",
    body: "Mise en relation avec un professionnel vérifié près de chez vous. Vous gardez la main, à chaque étape.",
  },
];

export function Process() {
  return (
    <section id="process" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Comment ça marche</p>
          <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
            Trois étapes, et votre projet avance vraiment.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pas de devis fantôme. Pas d'attente interminable. Juste une méthode simple, pensée par et pour les artisans du parquet.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="group relative rounded-2xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-warm">
              <div className="font-display text-6xl text-brand-orange/20 transition group-hover:text-brand-orange/40">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
