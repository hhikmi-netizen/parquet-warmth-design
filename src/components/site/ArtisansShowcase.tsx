import { MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import a1 from "@/assets/artisan-1.jpg";
import a2 from "@/assets/artisan-2.jpg";
import a3 from "@/assets/artisan-3.jpg";

// NOTE — Profils types illustratifs. Aucun artisan réel n'est représenté ici tant que
// le réseau n'est pas constitué publiquement (DGCCRF / loyauté des pratiques commerciales).
const artisans = [
  {
    img: a1,
    label: "Profil type · Parquet ancien",
    area: "Île-de-France",
    experience: "15 ans et +",
    specialties: ["Parquet ancien", "Point de Hongrie", "Vitrification"],
    quote: "Un parquet bien posé, c'est un sol qu'on entend chanter sous les pas.",
  },
  {
    img: a2,
    label: "Profil type · Pose & finition",
    area: "Auvergne-Rhône-Alpes",
    experience: "10 ans et +",
    specialties: ["Pose chevron", "Huile naturelle", "Massif chêne"],
    quote: "Chaque pièce a son grain, sa lumière. Le bois fait le reste.",
  },
  {
    img: a3,
    label: "Profil type · Rénovation",
    area: "Nouvelle-Aquitaine",
    experience: "5 ans et +",
    specialties: ["Rénovation", "Ponçage", "Contrecollé"],
    quote: "On ne rattrape pas un bâclage. Le travail propre, c'est la base.",
  },
];

export function ArtisansShowcase() {
  return (
    <section id="nos-artisans" className="scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Nos artisans
            </p>
            <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
              Des visages, des mains, <span className="italic text-brand-orange">un savoir-faire.</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Voici le type d'artisans avec qui nous travaillons : sélectionnés sur dossier, vérifiés
              et notés par les particuliers. Vous n'avez pas à les démarcher — on cadre votre projet,
              puis on vous oriente vers celui dont le savoir-faire correspond.
            </p>
          </div>
          <Link
            to="/estimation"
            className="group hidden items-center gap-2 text-sm font-semibold text-foreground transition hover:text-brand-orange sm:inline-flex"
          >
            Estimer mon projet
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {artisans.map((a) => (
            <article
              key={a.label}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="relative overflow-hidden">
                <img
                  src={a.img}
                  alt={`${a.label} — illustration d'artisan parqueteur`}
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-5 text-background">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl leading-tight">{a.label}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                      <ShieldCheck className="h-3 w-3 text-brand-orange" />
                      Profil illustratif
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-background/80">
                    <MapPin className="h-3 w-3" />
                    <span>{a.area}</span>
                    <span className="h-1 w-1 rounded-full bg-background/40" />
                    <span>{a.experience}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <blockquote className="font-display text-[15px] italic leading-snug text-foreground/85">
                  « {a.quote} »
                </blockquote>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {a.specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground/75"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>Profil type</span>
                  <Link to="/estimation" className="font-semibold text-brand-orange">
                    Estimer mon projet →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
