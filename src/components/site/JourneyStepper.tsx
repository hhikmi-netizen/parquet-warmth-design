import { useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
};

/**
 * JourneyStepper — carrousel pédagogique pour expliquer un parcours
 * (client ou artisan) sans saturer la page avec de grosses images.
 * Mock UI léger : un visuel "carte" généré natif + texte + chips.
 */
export function JourneyStepper({ steps, accent = "orange", label }: Props) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const Icon = step.icon;
  const accentBg = accent === "orange" ? "bg-brand-orange" : "bg-foreground";
  const accentText = accent === "orange" ? "text-brand-orange" : "text-foreground";

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      {/* Visual mockup */}
      <div className="lg:col-span-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-secondary/40 p-6 shadow-soft sm:p-10">
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          <div className="relative flex h-full flex-col items-center justify-center">
            <div className={cn("flex h-20 w-20 items-center justify-center rounded-2xl text-primary-foreground shadow-warm sm:h-24 sm:w-24", accentBg)}>
              <Icon className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>
            <p className={cn("mt-6 font-display text-6xl sm:text-7xl", accentText, "opacity-15")}>{step.n}</p>
            <p className="mt-2 text-center font-display text-xl text-foreground sm:text-2xl">{step.title}</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">{label}</p>
        )}
        <p className={cn("mt-2 text-sm font-semibold uppercase tracking-wider", accentText)}>
          Étape {i + 1} / {steps.length}
        </p>
        <h3 className="mt-3 font-display text-3xl text-balance sm:text-4xl">{step.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{step.body}</p>

        {/* Progress dots */}
        <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Étapes du parcours">
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
                idx === i ? cn("w-8", accentBg) : "w-4 bg-border hover:bg-foreground/30",
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
