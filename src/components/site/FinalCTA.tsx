import { ArrowRight, Clock, ShieldCheck, Sparkles, Check } from "lucide-react";
import detail from "@/assets/detail-wood.jpg";

const miniSteps = [
  "Décrivez la pièce et l'état du parquet",
  "Recevez une fourchette de prix honnête",
  "Échangez avec un artisan vérifié",
];

const proofs = [
  { icon: Clock, label: "≈ 3 minutes", sub: "pour remplir" },
  { icon: ShieldCheck, label: "Sans engagement", sub: "ni carte bancaire" },
  { icon: Sparkles, label: "Artisans vérifiés", sub: "près de chez vous" },
];

export function FinalCTA() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-foreground text-background shadow-warm">
        {/* texture parquet en fond */}
        <img
          src={detail}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--brand-orange)" }}
          aria-hidden
        />

        <div className="relative grid gap-12 px-8 py-16 sm:px-12 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Estimation gratuite
            </span>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] text-balance text-background sm:text-5xl lg:text-6xl">
              Votre projet parquet,
              <span className="block italic text-brand-orange">chiffré ce soir.</span>
            </h2>
            <p className="mt-5 max-w-xl text-background/70">
              Pas de formulaire interminable. Pas de commercial qui rappelle trois fois. Juste trois minutes
              honnêtes pour transformer une envie en projet concret — et un vrai artisan au bout du chemin.
            </p>

            <ol className="mt-8 space-y-3">
              {miniSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-xs font-semibold text-brand-orange">
                    {i + 1}
                  </span>
                  <span className="text-sm text-background/85">{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#estimate"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-4 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
              >
                Estimer mon projet
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <span className="inline-flex items-center gap-2 text-xs text-background/60">
                <Check className="h-3.5 w-3.5 text-brand-orange" />
                Réponse immédiate · 100 % en ligne
              </span>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between border-b border-background/10 pb-4">
                <div>
                  <div className="font-display text-3xl text-background">+2 400</div>
                  <div className="text-xs text-background/60">projets estimés</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-brand-orange">4,8/5</div>
                  <div className="text-xs text-background/60">avis particuliers</div>
                </div>
              </div>

              <ul className="mt-5 space-y-4">
                {proofs.map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                      <p.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-background">{p.label}</div>
                      <div className="text-xs text-background/60">{p.sub}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <figure className="mt-6 rounded-xl border border-background/10 bg-background/5 p-4">
                <blockquote className="font-display text-[15px] leading-snug text-background/90">
                  « Estimation reçue en 4 minutes, artisan sur place la semaine suivante. Bluffant de simplicité. »
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-xs text-background/60">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/20 font-display text-xs text-brand-orange">
                    C
                  </span>
                  Camille R. · Paris 11ᵉ · 38 m² chêne massif
                </figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
