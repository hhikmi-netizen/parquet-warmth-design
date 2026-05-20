import { Wallet, Clock, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

const pains = [
  {
    icon: Wallet,
    title: "Un budget toujours flou",
    body: "Devis vagues, écarts du simple au triple, lignes obscures. Impossible de savoir si le prix est juste.",
    tag: "Tarification",
  },
  {
    icon: Clock,
    title: "Des semaines d'attente",
    body: "Relances sans réponse, rendez-vous repoussés, planning fantôme. Et votre chantier qui n'avance pas.",
    tag: "Délais",
  },
  {
    icon: AlertTriangle,
    title: "Des surprises au chantier",
    body: "Suppléments découverts en cours de route, finitions bâclées, malfaçons cachées sous la vitrification.",
    tag: "Qualité",
  },
  {
    icon: ShieldCheck,
    title: "Un projet mal cadré",
    body: "Sans estimation claire ni interlocuteur de confiance, on avance à l'aveugle — et on subit le démarchage.",
    tag: "Sérénité",
  },
];

export function Pains() {
  return (
    <section id="pourquoi" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Pourquoi Parqueto
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Rénover un parquet,
              <span className="block italic text-brand-orange">ça ne devrait pas faire peur.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              On a écouté des centaines de particuliers et d'artisans. Le constat revient toujours :
              le marché du parquet manque de clarté, de cadre et de confiance. Parqueto remet de l'ordre.
            </p>
            <a
              href="#process"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-brand-orange"
            >
              Voir comment on s'y prend
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>

          <ul className="lg:col-span-7">
            {pains.map((p, i) => (
              <li
                key={p.title}
                className="group relative border-t border-border py-8 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-soft transition group-hover:-translate-y-0.5 group-hover:shadow-warm">
                      <p.icon className="h-6 w-6 text-brand-orange" />
                      <span className="absolute -right-1 -top-1 font-display text-xs text-brand-orange/60">
                        0{i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl sm:text-3xl">{p.title}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {p.tag}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
