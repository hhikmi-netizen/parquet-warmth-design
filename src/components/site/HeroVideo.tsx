import { ArrowRight } from "lucide-react";
import { VideoPlayer } from "./video/VideoPlayer";
import heroPoster from "@/assets/hero-parquet.jpg";

/**
 * Hero alternatif immersif — vidéo de fond silencieuse + overlay sobre.
 * À utiliser à la place de <Hero /> sur une page d'expérience, ou en
 * section secondaire. Reste minimaliste, premium, mobile-first.
 */
export function HeroVideo() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background video — ambient, muted, lazy */}
      <div className="absolute inset-0 -z-10">
        <VideoPlayer
          source={{ kind: "mp4", src: "/videos/parqueto-spot.mp4" }}
          poster={heroPoster}
          title="Parqueto — l'art du parquet"
          ambient
          ratio="auto"
          className="!h-full !w-full !rounded-none"
        />
        {/* Vignette + lift de lisibilité */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/85"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,transparent_0%,rgba(0,0,0,0.25)_70%)]"
        />
      </div>

      <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:pb-28 sm:pt-44">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          Le parquet, sans détour
        </span>

        <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          La matière, <span className="italic text-brand-orange">la lumière,</span>
          <br /> le geste juste.
        </h2>

        <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
          Parqueto réunit estimation en ligne, assistant IA et artisans vérifiés —
          pour redonner à votre parquet la sobriété et la justesse d'un travail bien fait.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#estimate"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
          >
            Estimer mon projet
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#realisations"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60"
          >
            Voir l'atelier
          </a>
        </div>
      </div>
    </section>
  );
}
