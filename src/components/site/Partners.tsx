import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import antonyLogo from "@/assets/partners/antony-parquet.png";
import blanchonLogo from "@/assets/partners/blanchon.png";
import repexLogo from "@/assets/partners/repex-floor.jpeg";
import danielsLogo from "@/assets/partners/daniels.jpeg";

const PARTNERS = [
  {
    name: "Blanchon",
    href: "https://www.blanchon.com",
    logo: blanchonLogo,
    blurb: "Finitions bois · depuis 1832",
  },
  {
    name: "Repex Floor",
    href: "https://www.repex.fr",
    logo: repexLogo,
    blurb: "Ponceuses professionnelles",
  },
  {
    name: "Antony Parquet",
    href: "https://www.antony-parquet.fr",
    logo: antonyLogo,
    blurb: "Parqueteur · Île-de-France",
  },
  {
    name: "Daniel's",
    href: "#",
    logo: danielsLogo,
    blurb: "Maison du parquet",
  },
] as const;

// Duplicate the list for a seamless marquee loop
const TRACK = [...PARTNERS, ...PARTNERS];

export function Partners() {
  return (
    <section
      aria-labelledby="partners-home-title"
      className="relative border-t border-border/60 bg-gradient-warm/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Écosystème métier
          </span>
          <h2
            id="partners-home-title"
            className="mt-4 font-display text-3xl text-foreground sm:text-4xl"
          >
            Ils accompagnent l'univers{" "}
            <span className="italic text-brand-orange">Parqueto.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Marques, fabricants et artisans de référence qui partagent notre exigence du parquet bien fait.
          </p>
        </div>

        {/* Marquee */}
        <div
          className="group relative mt-14 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          aria-label="Logos des partenaires Parqueto"
        >
          <ul className="animate-marquee pause-on-hover flex w-max items-stretch gap-5">
            {TRACK.map((p, i) => (
              <li key={`${p.name}-${i}`} className="shrink-0">
                <a
                  href={p.href}
                  target={p.href.startsWith("http") ? "_blank" : undefined}
                  rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={`${p.name} — site officiel (nouvel onglet)`}
                  className="flex h-40 w-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-6 text-center shadow-soft transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-warm"
                >
                  <div className="flex h-20 w-full items-center justify-center">
                    <img
                      src={p.logo}
                      alt={`Logo ${p.name}`}
                      loading="lazy"
                      className="max-h-20 w-auto max-w-[200px] object-contain opacity-90 transition hover:opacity-100"
                    />
                  </div>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {p.blurb}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA — devenir partenaire */}
        <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-8">
          <h3 className="font-display text-xl text-foreground sm:text-2xl">
            Devenir partenaire
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Vous êtes artisan, fabricant, distributeur ou acteur du parquet&nbsp;?
            Rejoignez un écosystème dédié aux projets parquet qualifiés.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Rejoindre le réseau
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/50 hover:text-brand-orange"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
