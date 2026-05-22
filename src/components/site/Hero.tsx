import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroSalon from "@/assets/hero-salon-parquet.jpg";
import heroHaussmann from "@/assets/hero-haussmann-chevron.jpg";
import heroArtisan from "@/assets/hero-artisan-pose.jpg";

/**
 * Hero cinématique premium — crossfade ultra lent + Ken Burns subtil.
 * Le texte et les CTA restent strictement statiques.
 */
const slides = [
  {
    src: heroSalon,
    alt: "Salon lumineux avec parquet chêne massif lames larges teinte miel",
  },
  {
    src: heroHaussmann,
    alt: "Appartement haussmannien lumineux avec parquet point de Hongrie en chêne",
  },
  {
    src: heroArtisan,
    alt: "Artisan parqueteur posant des lames de chêne massif sur un chantier haussmannien",
  },
];

const SLIDE_DURATION = 9000; // ms — respiration cinéma
const FADE_DURATION = 1.8;   // s — fondu presque imperceptible

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[#f6efe4]"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: FADE_DURATION,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            <motion.img
              src={slides[index].src}
              alt={slides[index].alt}
              className="h-full w-full object-cover will-change-transform"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1.0 }}
              transition={{
                duration: SLIDE_DURATION / 1000 + FADE_DURATION,
                ease: "linear",
              }}
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

        {/* Wash crème pour lisibilité gauche */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#f7efe2]/92 via-[#f7efe2]/55 to-transparent md:from-[#f7efe2]/88 md:via-[#f7efe2]/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7efe2]/70 to-transparent"
        />
      </div>

      {/* Contenu statique */}
      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 items-center px-6 py-20 sm:py-24 md:min-h-[82vh] lg:grid-cols-12 lg:py-32">
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

        {/* Badge stats */}
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

      {/* Indicateurs minimalistes */}
      <div
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
        aria-hidden
      >
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-[2px] rounded-full bg-foreground/30 transition-all duration-700 ${
              i === index ? "w-10 bg-brand-orange/80" : "w-5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
