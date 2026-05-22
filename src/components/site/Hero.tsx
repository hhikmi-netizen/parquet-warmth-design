import heroSalon from "@/assets/hero-salon-parquet.jpg";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-[#f6efe4]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroSalon}
          alt="Salon lumineux avec parquet chêne massif lames larges teinte miel, baie vitrée et canapé beige"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Soft cream wash for legibility on the left */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#f7efe2]/92 via-[#f7efe2]/55 to-transparent md:from-[#f7efe2]/88 md:via-[#f7efe2]/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7efe2]/70 to-transparent"
        />
      </div>

      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 items-center px-6 py-20 sm:py-24 md:min-h-[82vh] lg:grid-cols-12 lg:py-32">
        {/* Text column */}
        <div className="lg:col-span-7 xl:col-span-6">
          <h1 className="font-display text-5xl leading-[1.05] text-balance text-foreground sm:text-6xl lg:text-7xl">
            Votre projet parquet
            <span className="block italic text-brand-orange">en quelques minutes.</span>
          </h1>

          <div
            aria-hidden
            className="mt-6 h-[2px] w-24 rounded-full bg-brand-orange/70"
          />

          <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            Obtenez gratuitement une estimation claire selon votre surface,
            votre type de parquet et votre projet de rénovation.
            Un artisan partenaire vérifié prend ensuite le relais — sans démarchage.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#estimate"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-orange px-7 py-4 text-[15px] font-semibold text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Estimer mon projet gratuitement
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#realisations"
              className="inline-flex items-center rounded-full border border-foreground/15 bg-background/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Voir des réalisations
            </a>
          </div>
        </div>

        {/* Stats badge */}
        <div className="mt-12 lg:col-span-5 lg:mt-0 lg:flex lg:justify-end xl:col-span-6">
          <div className="inline-flex flex-col items-start rounded-2xl border border-border/60 bg-background/85 px-6 py-5 shadow-warm backdrop-blur-md sm:px-7 sm:py-6 lg:items-center lg:text-center">
            <div className="font-display text-4xl font-semibold text-brand-orange sm:text-5xl">
              +2 400
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-[13px]">
              projets estimés en France
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
