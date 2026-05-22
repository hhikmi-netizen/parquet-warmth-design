import { VideoPlayer } from "./video/VideoPlayer";
import heroPoster from "@/assets/hero-parquet.jpg";

/**
 * Section "Film" — intégration sobre du spot de marque.
 * Format magazine : titre éditorial à gauche, lecteur 16/9 à droite.
 */
export function BrandFilm() {
  return (
    <section className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Film de marque
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            21 secondes
            <span className="block italic text-brand-orange">pour comprendre.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
            Un parquet bien posé, c'est une matière, un geste, une rigueur.
            Parqueto réunit les trois — sans démarchage, sans détour.
          </p>
        </div>
        <div className="lg:col-span-8">
          <VideoPlayer
            source={{ kind: "mp4", src: "/videos/parqueto-spot.mp4" }}
            poster={heroPoster}
            title="Parqueto — Le parquet, sans détour"
            ratio="16 / 9"
            className="shadow-warm"
          />
        </div>
      </div>
    </section>
  );
}
