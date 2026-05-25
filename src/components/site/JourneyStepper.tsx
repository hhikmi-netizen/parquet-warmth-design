import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  n: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
  highlight?: string;
  image?: string;
  imageAlt?: string;
};

type Mode = "carousel" | "accordion" | "auto";

type Props = {
  steps: JourneyStep[];
  accent?: "orange" | "ink";
  label?: string;
  compact?: boolean;
  /**
   * "carousel" : carrousel horizontal avec contrôles flèches
   * "accordion" : accordéon vertical (un seul panneau ouvert)
   * "auto" : accordéon sous 768px, carrousel au-dessus (compact uniquement)
   */
  mode?: Mode;
  /** Breakpoint en px pour mode="auto" (défaut : 768 = Tailwind md). */
  autoBreakpoint?: number;
  /**
   * Index de l'étape ouverte par défaut en mode accordéon compact.
   * Si omis, le premier panneau (index 0) est ouvert.
   * Pour aucun panneau ouvert par défaut, passer `null`.
   */
  defaultOpenIndex?: number | null;
};

/**
 * JourneyStepper — composant pédagogique accessible (carrousel + accordéon).
 *
 * Accessibilité :
 *  - Carrousel : role="tablist" / role="tab" / role="tabpanel" avec navigation
 *    clavier ← → (Home/End pour aller au début/fin), aria-controls/labelledby.
 *  - Accordéon : <button> natifs (Entrée/Espace gérés par le navigateur) avec
 *    aria-expanded + aria-controls reliant chaque panneau.
 *  - aria-live="polite" sur la zone texte du carrousel pour annoncer l'étape
 *    courante aux lecteurs d'écran.
 */
export function JourneyStepper({
  steps,
  accent = "orange",
  label,
  compact = false,
  mode = "carousel",
  autoBreakpoint = 768,
  defaultOpenIndex = 0,
}: Props) {
  // Mode "auto" : on bascule entre carousel et accordion selon la largeur.
  const resolvedMode = useResolvedMode(mode, autoBreakpoint);

  const [i, setI] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpenIndex ?? 0);
  const baseId = useId();

  const step = steps[i];
  const Icon = step.icon;

  const accentBg = accent === "orange" ? "bg-brand-orange" : "bg-foreground";
  const accentText = accent === "orange" ? "text-brand-orange" : "text-foreground";
  const imageAlt = step.imageAlt ?? `Illustration de l'étape ${i + 1} : ${step.title}`;


  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const goTo = useCallback(
    (next: number, focus = false) => {
      const idx = ((next % steps.length) + steps.length) % steps.length;
      setI(idx);
      if (focus) tabsRef.current[idx]?.focus();
    },
    [steps.length],
  );

  const onCarouselKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          goTo(i + 1, true);
          break;
        case "ArrowLeft":
          e.preventDefault();
          goTo(i - 1, true);
          break;
        case "Home":
          e.preventDefault();
          goTo(0, true);
          break;
        case "End":
          e.preventDefault();
          goTo(steps.length - 1, true);
          break;
      }
    },
    [goTo, i, steps.length],
  );

  /* ---------- Accordéon compact ---------- */
  if (compact && resolvedMode === "accordion") {
    return (
      <div
        className="rounded-2xl border border-border bg-card shadow-soft"
        role="region"
        aria-label={label ?? "Étapes du parcours"}
      >
        {label && (
          <p className="px-5 pt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}
        <div className="divide-y divide-border">
          {steps.map((s, idx) => {
            const isOpen = openIdx === idx;
            const SIcon = s.icon;
            const panelId = `${baseId}-acc-panel-${idx}`;
            const buttonId = `${baseId}-acc-btn-${idx}`;
            return (
              <div key={s.n}>
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-primary-foreground",
                        accentBg,
                      )}
                      aria-hidden
                    >
                      {s.n}
                    </span>
                    <SIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="flex-1 font-display text-sm font-medium text-foreground">
                      <span className="sr-only">Étape {idx + 1} sur {steps.length} : </span>
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
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
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
  if (compact && resolvedMode === "carousel") {
    const panelId = `${baseId}-panel-${i}`;
    const tabId = `${baseId}-tab-${i}`;
    return (
      <section
        className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-roledescription="carrousel"
        aria-label={label ?? "Étapes du parcours"}
        tabIndex={0}
        onKeyDown={onCarouselKeyDown}
      >
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}

        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-secondary/40 p-4">
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          {step.image ? (
            <img
              src={step.image}
              alt={imageAlt}
              className="relative h-full w-full rounded-lg object-cover shadow-soft"
              loading="lazy"
            />
          ) : (
            <div className="relative flex h-full flex-col items-center justify-center">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground shadow-warm sm:h-16 sm:w-16",
                  accentBg,
                )}
                aria-hidden
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <p
                className={cn("mt-4 font-display text-5xl opacity-15 sm:text-6xl", accentText)}
                aria-hidden
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
          )}
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId}
          aria-live="polite"
          className="mt-4"
        >
          <p className={cn("text-xs font-semibold uppercase tracking-wider", accentText)}>
            Étape {i + 1} sur {steps.length}
          </p>
          <h3 className="mt-1 font-display text-xl text-balance sm:text-2xl">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

          <div
            className="mt-5 flex items-center gap-2"
            role="tablist"
            aria-label="Sélection de l'étape"
            aria-orientation="horizontal"
          >
            {steps.map((s, idx) => (
              <button
                key={s.n}
                ref={(el) => {
                  tabsRef.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${idx}`}
                aria-selected={idx === i}
                aria-controls={`${baseId}-panel-${idx}`}
                aria-label={`Aller à l'étape ${idx + 1} sur ${steps.length} : ${s.title}`}
                tabIndex={idx === i ? 0 : -1}
                onClick={() => goTo(idx)}
                onKeyDown={onCarouselKeyDown}
                className={cn(
                  "h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  idx === i ? cn("w-6", accentBg) : "w-3 bg-border hover:bg-foreground/30",
                )}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(i - 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              aria-label="Étape précédente"
              aria-controls={panelId}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(i + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              aria-label="Étape suivante"
              aria-controls={panelId}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Carrousel complet (default) ---------- */
  const panelId = `${baseId}-panel-${i}`;
  const tabId = `${baseId}-tab-${i}`;
  return (
    <section
      className="grid gap-8 focus-visible:outline-none lg:grid-cols-12 lg:items-center lg:gap-12"
      aria-roledescription="carrousel"
      aria-label={label ?? "Étapes du parcours"}
      tabIndex={0}
      onKeyDown={onCarouselKeyDown}
    >
      <div className="lg:col-span-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-secondary/40 p-4 shadow-soft sm:p-6">
          <div className="grain absolute inset-0 opacity-20" aria-hidden />
          {step.image ? (
            <img
              src={step.image}
              alt={imageAlt}
              className="relative h-full w-full rounded-[1.25rem] object-cover shadow-soft"
              loading="lazy"
            />
          ) : (
            <div className="relative flex h-full flex-col items-center justify-center">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-2xl text-primary-foreground shadow-warm sm:h-24 sm:w-24",
                  accentBg,
                )}
                aria-hidden
              >
                <Icon className="h-9 w-9 sm:h-11 sm:w-11" />
              </div>
              <p
                className={cn("mt-6 font-display text-6xl sm:text-7xl", accentText, "opacity-15")}
                aria-hidden
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
          )}
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId} aria-live="polite" className="lg:col-span-6">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {label}
          </p>
        )}
        <p className={cn("mt-2 text-sm font-semibold uppercase tracking-wider", accentText)}>
          Étape {i + 1} sur {steps.length}
        </p>
        <h3 className="mt-3 font-display text-3xl text-balance sm:text-4xl">{step.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{step.body}</p>

        <div
          className="mt-8 flex items-center gap-2"
          role="tablist"
          aria-label="Sélection de l'étape"
          aria-orientation="horizontal"
        >
          {steps.map((s, idx) => (
            <button
              key={s.n}
              ref={(el) => {
                tabsRef.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${idx}`}
              aria-selected={idx === i}
              aria-controls={`${baseId}-panel-${idx}`}
              aria-label={`Aller à l'étape ${idx + 1} sur ${steps.length} : ${s.title}`}
              tabIndex={idx === i ? 0 : -1}
              onClick={() => goTo(idx)}
              onKeyDown={onCarouselKeyDown}
              className={cn(
                "h-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                idx === i ? cn("w-8", accentBg) : "w-4 bg-border hover:bg-foreground/30",
              )}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(i - 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Étape précédente"
            aria-controls={panelId}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(i + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Étape suivante"
            aria-controls={panelId}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Résout le mode effectif. Pour "auto", écoute la media-query et renvoie
 * "accordion" sous le breakpoint, "carousel" au-dessus. SSR-safe : valeur
 * initiale = "carousel" (desktop-first), recalée au montage côté client.
 */
function useResolvedMode(mode: Mode, breakpoint: number): "carousel" | "accordion" {
  const [resolved, setResolved] = useState<"carousel" | "accordion">(
    mode === "accordion" ? "accordion" : "carousel",
  );

  useEffect(() => {
    if (mode !== "auto") {
      setResolved(mode);
      return;
    }
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const apply = () => setResolved(mql.matches ? "accordion" : "carousel");
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mode, breakpoint]);

  return resolved;
}
