import { useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  n: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
  highlight?: string; // small visual chip text (e.g. "Sous 24 h", "100 % gratuit")
};

type Props = {
  steps: JourneyStep[];
  accent?: "orange" | "ink";
  label?: string;
  compact?: boolean;
  mode?: "carousel" | "accordion";
};

/**
 * JourneyStepper — carrousel pédagogique pour expliquer un parcours
 * (client ou artisan) sans saturer la page avec de grosses images.
 * Mock UI léger : un visuel "carte" généré natif + texte + chips.
 *
 * mode compact :
 *   • carousel → carrousel réduit (carte + texte empilés, idéal pour une sidebar ou un encart)
 *   • accordion → accordéon vertical (un seul panneau ouvert à la fois, idéal pour mobile ou FAQ intégrée)
 */
export function JourneyStepper({
  steps,
  accent = "orange",
  label,
  compact = false,
  mode = "carousel",
}: Props) {
  const [i, setI] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const step = steps[i];
  const Icon = step.icon;

  const accentBg = accent === "orange" ? "bg-brand-orange" : "bg-foreground";
  const accentText = accent === "orange" ? "text-brand-orange" : "text-foreground";

  /* ---------- Accordéon compact ---------- */
  if (compact && mode === "accordion") {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {label && (
          <p className="px-5 pt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}
        <div className="divide-y divide-border">
          {steps.map((s, idx) => {
            const isOpen = openIdx === idx;
            const SIcon = s.icon;
            return (
              <div key={s.n}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/30"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-primary-foreground",
                      accentBg
                    )}
                  >
                    {s.n}
                  </span>
                  <SIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 font-display text-sm font-medium text-foreground">
                    {s.title}
                  </span>
                  {s.highlight && (
                    <span className="hidden rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange sm:inline-flex">
                      {s.highlight}
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- Carrousel compact ---------- */
  if (compact && mode === "carousel") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}

        {/* Mini visuel */}
        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-secondary/40 p-4">
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          <div className="relative flex h-full flex-col items-center justify-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground shadow-warm sm:h-16 sm:w-16",
                accentBg
              )}
            >
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <p
              className={cn(
                "mt-4 font-display text-5xl opacity-15 sm:text-6xl",
                accentText
              )}
            >
              {step.n}
            </p>
            <p className="mt-1 text-center font-display text-lg text-foreground sm:text-xl">
              {step.title}
            </p>
            {step.highlight && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-0.5 text-[10px] font-semibold text-brand-orange shadow-soft">
                {step.highlight}
              </span>
            )}
          </div>
        </div>

        {/* Texte & contrôles */}
        <div className="mt-4">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              accentText
            )}
          >
            Étape {i + 1} / {steps.length}
          </p>
          <h3 className="mt-1 font-display text-xl text-balance sm:text-2xl">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.body}
          </p>

          {/* Dots */}
          <div
            className="mt-5 flex items-center gap-2"
            role="tablist"
            aria-label="Étapes du parcours"
          >
            {steps.map((s, idx) => (
              <button
                key={s.n}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Étape ${idx + 1} : ${s.title}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === i
                    ? cn("w-6", accentBg)
                    : "w-3 bg-border hover:bg-foreground/30"
                )}
              />
            ))}
          </div>

          {/* Flèches */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setI((p) => (p - 1 + steps.length) % steps.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-orange/40 hover:text-brand-orange"
              aria-label="Étape précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setI((p) => (p + 1) % steps.length)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-orange/40 hover:text-brand-orange"
              aria-label="Étape suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Carrousel complet (default) ---------- */
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      {/* Visual mockup */}
      <div className="lg:col-span-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-secondary/40 p-6 shadow-soft sm:p-10">
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          <div className="relative flex h-full flex-col items-center justify-center">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-2xl text-primary-foreground shadow-warm sm:h-24 sm:w-24",
                accentBg
              )}
            >
              <Icon className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>
            <p
              className={cn(
                "mt-6 font-display text-6xl sm:text-7xl",
                accentText,
                "opacity-15"
              )}
            >
              {step.n}
            </p>
            <p className="mt-2 text-center font-display text-xl text-foreground sm:text-2xl">
              {step.title}
            </p>
            {step.highlight && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold text-brand-orange shadow-soft">
                {step.highlight}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Text & controls */}
      <div className="lg:col-span-6">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}
        <p
          className={cn(
            "mt-2 text-sm font-semibold uppercase tracking-wider",
            accentText
          )}
        >
          Étape {i + 1} / {steps.length}
        </p>
        <h3 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
          {step.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {step.body}
        </p>

        {/* Progress dots */}
        <div
          className="mt-8 flex items-center gap-2"
          role="tablist"
          aria-label="Étapes du parcours"
        >
          {steps.map((s, idx) => (
            <button
              key={s.n}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={`Étape ${idx + 1} : ${s.title}`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === i
                  ? cn("w-8", accentBg)
                  : "w-4 bg-border hover:bg-foreground/30"
              )}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setI((p) => (p - 1 + steps.length) % steps.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-brand-orange/40 hover:text-brand-orange"
            aria-label="Étape précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setI((p) => (p + 1) % steps.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-brand-orange/40 hover:text-brand-orange"
            aria-label="Étape suivante"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
