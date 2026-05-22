import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download } from "lucide-react";
import { GUIDE_COVER, GUIDE_META } from "@/lib/guide-content";

type Props = {
  variant?: "inline" | "wide";
  anchor?: string;
  ctaLabel?: string;
};

/**
 * Bannière contextuelle de promotion du Guide Ultime, intégrée
 * dans les articles de blog et autres surfaces éditoriales.
 * Non-intrusive, design éditorial, deux CTA clairs.
 */
export function GuideBanner({
  variant = "inline",
  anchor,
  ctaLabel = "Lire le chapitre correspondant",
}: Props) {


  if (variant === "wide") {
    return (
      <aside className="my-12 overflow-hidden rounded-3xl border border-brand-orange/20 bg-gradient-warm shadow-soft">
        <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Ressource Parqueto
            </p>
            <h3 className="mt-3 font-display text-2xl text-brand-ink sm:text-3xl">
              Tout est dans <span className="italic text-brand-orange">Le Guide Ultime du Parquet</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-ink/75">
              {GUIDE_META.subtitle}. Libre accès, téléchargeable en PDF, rédigé par {GUIDE_META.author}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/guide"
                hash={anchor}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep"
              >
                <BookOpen className="h-4 w-4" /> {ctaLabel}
              </Link>
              <Link
                to="/guide-parquet"
                className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-card px-5 py-2.5 text-sm font-semibold text-brand-orange-deep transition hover:bg-brand-orange/10"
              >
                <Download className="h-4 w-4" /> Recevoir le PDF
              </Link>
            </div>
          </div>
          <img
            src={GUIDE_COVER}
            alt=""
            loading="lazy"
            className="hidden h-48 w-auto rounded-xl object-cover shadow-warm ring-1 ring-black/5 sm:block"
          />
        </div>
      </aside>
    );
  }

  // inline
  return (
    <aside className="my-10 flex flex-col gap-4 rounded-2xl border-l-4 border-brand-orange bg-secondary/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
          Pour aller plus loin
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-brand-ink">
          Le chapitre complet est dans <span className="italic">Le Guide Ultime du Parquet</span>.
        </p>
      </div>
      <Link
        to="/guide"
        hash={anchor}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep sm:self-auto"
      >

        Lire le chapitre <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
