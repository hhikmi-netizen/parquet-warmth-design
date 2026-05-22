import { Star, Quote } from "lucide-react";
import { Link } from "@tanstack/react-router";

const stats = [
  { value: "+2 400", label: "projets estimés" },
  { value: "4,9/5", label: "satisfaction client" },
  { value: "48 h", label: "réponse artisan" },
  { value: "100 %", label: "sans démarchage" },
];

const testimonials = [
  {
    name: "Camille R.",
    city: "Paris 11ᵉ",
    project: "Rénovation chêne",
    quote:
      "Estimation honnête, mise en relation rapide avec un artisan qui connaissait vraiment son métier. Aucune relance commerciale derrière.",
  },
  {
    name: "Thomas L.",
    city: "Lyon 6ᵉ",
    project: "Vitrification mate",
    quote:
      "J'ai enfin compris ce que je payais. Le guide en ligne m'a donné les bonnes questions à poser, et l'artisan a tenu ses délais.",
  },
  {
    name: "Léa M.",
    city: "Bordeaux",
    project: "Pose chevron",
    quote:
      "Trois devis ailleurs, trois prix au hasard. Avec Parqueto, une fourchette claire, un seul interlocuteur, et un chantier nickel.",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Ils nous font confiance
          </p>
          <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
            Des projets cadrés, <span className="italic text-brand-orange">des clients sereins.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            La parole de propriétaires qui ont estimé leur projet sur Parqueto et travaillé avec un{" "}
            <Link to="/artisans" className="font-medium text-brand-orange hover:underline">
              artisan partenaire vérifié
            </Link>
            .
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-soft"
            >
              <p className="font-display text-3xl text-brand-orange">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-brand-orange/30" />
              <div className="flex items-center gap-0.5 text-brand-orange" aria-label="5 sur 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4 text-xs">
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-muted-foreground">
                  {t.city} · {t.project}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
