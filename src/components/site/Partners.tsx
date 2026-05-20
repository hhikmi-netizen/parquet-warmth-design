import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import antonyLogo from "@/assets/partners/antony-parquet.png";
import blanchonLogo from "@/assets/partners/blanchon.png";
import repexLogo from "@/assets/partners/repex-floor.jpeg";

const PARTNERS = [
  {
    name: "Blanchon",
    href: "https://www.blanchon.com",
    logo: blanchonLogo,
    blurb: "Finitions bois depuis 1832",
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
    blurb: "Parqueteur — Paris",
  },
] as const;

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
            Des marques et partenaires liés au parquet, à la rénovation et au savoir-faire métier.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {PARTNERS.map((p) => (
            <li key={p.name}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} — ouvrir le site officiel (nouvel onglet)`}
                className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-soft transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex h-20 w-full items-center justify-center">
                  <img
                    src={p.logo}
                    alt={`Logo ${p.name}`}
                    loading="lazy"
                    className="max-h-16 w-auto max-w-[160px] object-contain opacity-85 transition group-hover:opacity-100"
                  />
                </div>
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {p.blurb}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* CTA — devenir partenaire */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-8">
          <h3 className="font-display text-xl text-foreground sm:text-2xl">
            Devenir partenaire
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Vous êtes artisan, fabricant, distributeur ou acteur du parquet&nbsp;? Rejoignez un écosystème dédié aux projets parquet qualifiés.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Rejoindre le réseau
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/50 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
