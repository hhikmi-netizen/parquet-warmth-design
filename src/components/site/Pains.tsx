import { Wallet, Clock, AlertTriangle, Users } from "lucide-react";

const pains = [
  { icon: Wallet, title: "Budget flou", body: "Devis vagues, prix qui varient du simple au triple selon l'artisan." },
  { icon: Clock, title: "Trop d'attente", body: "Des semaines pour obtenir une réponse, et un chantier qui n'avance pas." },
  { icon: AlertTriangle, title: "Mauvaises surprises", body: "Suppléments inattendus, finitions bâclées, délais qui dérapent." },
  { icon: Users, title: "Artisans introuvables", body: "Comparer trois professionnels sérieux relève du parcours du combattant." },
];

export function Pains() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Pourquoi Parqueto</p>
            <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
              Rénover un parquet, ça <span className="italic text-brand-orange">ne devrait pas</span> être un cauchemar.
            </h2>
            <p className="mt-6 text-muted-foreground">
              On a écouté des centaines de particuliers et d'artisans. Le constat est toujours le même :
              le marché manque de clarté, de cadre et de confiance. Parqueto met de l'ordre là-dedans.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {pains.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6 transition hover:border-brand-orange/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
