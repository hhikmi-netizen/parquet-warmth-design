import { Calculator, ClipboardList, LineChart, Smartphone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import artisanImg from "@/assets/experience-artisan.png";

const points = [
  {
    icon: Calculator,
    title: "Devis rapides & précis",
    body: "Chiffrez en quelques clics, sécurisez vos marges, sans paperasse.",
  },
  {
    icon: ClipboardList,
    title: "Organisation chantier",
    body: "Checklists, photos, documents et suivis centralisés au même endroit.",
  },
  {
    icon: LineChart,
    title: "Pilotage d'activité",
    body: "Suivez votre rentabilité, vos chantiers et vos indicateurs en temps réel.",
  },
  {
    icon: Smartphone,
    title: "Mobile & intuitif",
    body: "Une application pensée pour le terrain — simple, rapide, efficace.",
  },
];

/**
 * Section artisan — "Gagnez du temps, gagnez en rentabilité"
 * Mise en page miroir de la section client (image à gauche).
 * Ton sobre, métier — pas de promesse marketing exagérée.
 */
export function ArtisanExperience() {
  return (
    <section className="relative border-y border-border bg-secondary/40 py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <figure className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
            <img
              src={artisanImg}
              alt="Application Parqueto pour artisan parqueteur : devis, chantiers, statistiques et pilotage de l'activité"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Côté artisan
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            Gagnez du temps,
            <span className="block italic text-brand-orange">gagnez en rentabilité.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
            Parqueto centralise vos outils pour chiffrer, organiser et suivre
            vos chantiers — depuis votre mobile ou votre ordinateur.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Rejoindre le réseau
            </Link>
            <Link
              to="/pro"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Voir l'espace artisan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
