import { useId, useRef, type KeyboardEvent } from "react";
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
 */
export function FaqAccordion({ items, open, onToggle, size = "md" }: Props) {
  const baseId = useId();
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);

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
      className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      role="list"
    >
      {items.map((f, i) => {
        const isOpen = open === i;
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={f.q}>
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
              hidden={!isOpen}
              className={`grid overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
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
