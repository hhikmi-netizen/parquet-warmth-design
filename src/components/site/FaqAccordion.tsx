import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  open: number | null;
  onToggle: (index: number | null) => void;
  /** Bigger title sizing for the main FAQ block. */
  size?: "sm" | "md";
};

/**
 * Accessible single-open accordion used by the FAQ sections.
 *
 * A11y notes:
 * - Each trigger is a real <button> with aria-expanded + aria-controls.
 * - Each panel has role="region" + aria-labelledby pointing back at its trigger.
 * - Arrow Up/Down + Home/End cycle focus between triggers (APG pattern).
 * - Focus is always visible via focus-visible ring on the trigger.
 * - Tap targets are at least 56px tall on mobile for comfortable touch.
 *
 * Layout-stability notes (mobile):
 * - Panels stay in the DOM during the open/close transition (no `hidden`)
 *   so the grid-rows height animation runs both ways without snapping.
 * - When a different item is opened, the just-clicked trigger is scrolled
 *   back into view to compensate for content above that just collapsed —
 *   prevents the "the question I tapped jumped off screen" feeling.
 * - `scroll-margin-top` on each <li> leaves room for the sticky header.
 * - `[contain:layout_paint]` on each row stops the panel's height change
 *   from invalidating layout outside the accordion.
 */
export function FaqAccordion({ items, open, onToggle, size = "md" }: Props) {
  const baseId = useId();
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const previousOpenRef = useRef<number | null>(open);

  // After a toggle, keep the active trigger in view on mobile.
  // We only scroll when switching to a different item (not when simply
  // closing the current one) and only if the trigger is off-screen.
  useEffect(() => {
    const prev = previousOpenRef.current;
    previousOpenRef.current = open;
    if (open === null || open === prev) return;

    const trigger = triggersRef.current[open];
    if (!trigger) return;

    const id = window.requestAnimationFrame(() => {
      const rect = trigger.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const offTop = rect.top < 88; // sticky header allowance
      const offBottom = rect.bottom > vh - 24;
      if (!offTop && !offBottom) return;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      trigger.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(id);
  }, [open]);

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      triggersRef.current[next]?.focus();
    }
  }

  const titleClass =
    size === "md"
      ? "font-display text-lg leading-snug text-foreground sm:text-xl"
      : "font-display text-base leading-snug text-foreground sm:text-lg";

  return (
    <ul
      // overflow-anchor:none on the wrapper avoids the browser jumping
      // to "preserve" position when a sibling above collapses.
      className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft [overflow-anchor:none]"
      role="list"
    >
      {items.map((f, i) => {
        const isOpen = open === i;
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li
            key={f.q}
            className="scroll-mt-24 [contain:layout_paint]"
          >
            <h3 className="m-0">
              <button
                ref={(el) => {
                  triggersRef.current[i] = el;
                }}
                id={triggerId}
                type="button"
                onClick={() => onToggle(isOpen ? null : i)}
                onKeyDown={(e) => onTriggerKeyDown(e, i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex min-h-14 w-full touch-manipulation items-start justify-between gap-6 px-5 py-5 text-left transition hover:bg-secondary/40 focus:outline-none focus-visible:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:px-6"
              >
                <span className={titleClass}>{f.q}</span>
                <Plus
                  aria-hidden="true"
                  className={`mt-1 h-5 w-5 flex-shrink-0 text-brand-orange transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              // `inert` removes the closed panel from tab/AT trees without
              // setting display:none, so the close animation can play.
              {...(!isOpen ? { inert: "" as unknown as boolean } : {})}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <p className="px-5 pb-6 text-[15px] leading-relaxed text-muted-foreground sm:px-6">
                  {f.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
