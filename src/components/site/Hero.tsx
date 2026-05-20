import heroImg from "@/assets/hero-parquet.jpg";
import detail from "@/assets/detail-wood.jpg";
import beforeAfter from "@/assets/before-after.jpg";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
  return (
    <section id="estimate" className="relative overflow-hidden">
      <div className="grain absolute inset-0 opacity-40" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-6 lg:pt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Parqueto · Le parquet, sans détour
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance text-foreground sm:text-6xl lg:text-7xl">
            Votre parquet,
            <span className="block italic text-brand-orange">estimé en quelques minutes.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Ponçage, pose, vitrification, rénovation de parquet ancien — obtenez une estimation
            claire en quelques minutes et un artisan partenaire référent pour cadrer votre projet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#process" className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep">
              Estimer mon projet
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a href="#realisations" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange">
              Voir des réalisations
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
            {["Estimation instantanée", "Sans démarchage", "Artisan partenaire vérifié"].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-orange" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl shadow-warm">
            <img src={heroImg} alt="Parquet en chevron dans appartement parisien" className="aspect-[5/6] w-full object-cover" width={1200} height={1440} />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden w-44 overflow-hidden rounded-xl border-4 border-background shadow-soft sm:block">
            <img src={detail} alt="Détail veinage chêne" className="aspect-square w-full object-cover" width={300} height={300} loading="lazy" />
          </div>
          <div className="absolute -right-4 top-10 hidden w-48 overflow-hidden rounded-xl border-4 border-background shadow-soft md:block">
            <img src={beforeAfter} alt="Avant / après rénovation parquet" className="aspect-[4/3] w-full object-cover" width={400} height={300} loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/85 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-background">
              Avant · Après
            </div>
          </div>
          <div className="absolute -right-2 -bottom-6 hidden rounded-xl bg-card px-5 py-4 shadow-warm lg:block">
            <div className="text-3xl font-display font-semibold text-brand-orange">+2 400</div>
            <div className="text-xs text-muted-foreground">projets estimés en France</div>
          </div>
        </div>
      </div>
    </section>
  );
}
