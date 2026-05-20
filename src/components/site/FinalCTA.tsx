import { ArrowRight, Check, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";
import detail from "@/assets/detail-wood.jpg";
import { Estimator } from "./Estimator";

const miniSteps = [
  "Décrivez la pièce et l'état du parquet",
  "Recevez une fourchette de prix honnête",
  "Échangez avec un artisan vérifié",
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

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/estimation"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-4 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
              >
                <FileText className="h-4 w-4" />
                Demande détaillée
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#estimate"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-background/25 px-5 py-3.5 text-sm font-semibold text-background transition hover:bg-background/10"
              >
                Mini-simulation
              </a>
              <span className="inline-flex items-center gap-2 text-xs text-background/60">
                <Check className="h-3.5 w-3.5 text-brand-orange" />
                Sans engagement
              </span>
            </div>
          </div>

          <aside id="estimate" className="scroll-mt-24 lg:col-span-5">
            <Estimator />
          </aside>
        </div>
      </div>
    </section>
  );
}
