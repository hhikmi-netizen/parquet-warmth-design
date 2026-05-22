import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { GUIDE_COVER } from "@/lib/guide-content";

/**
 * Mini CTA flottante non-intrusive avec miniature de couverture.
 * - N'apparaît qu'après un scroll significatif (≈ 600px)
 * - Dismissable avec mémoire par session
 * - Se replie en bulle sur mobile
 * - Cachée à l'impression
 */
export function FloatingGuideCta({
  onOpen,
  hideBelow = 600,
}: {
  onOpen: () => void;
  hideBelow?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasDismissed = sessionStorage.getItem("parqueto-guide-cta-dismissed") === "1";
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      setVisible(window.scrollY > hideBelow);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideBelow]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem("parqueto-guide-cta-dismissed", "1");
    } catch {
      // ignore
    }
  }

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 print:hidden animate-in fade-in slide-in-from-bottom-3 duration-500"
      role="complementary"
      aria-label="Télécharger le guide"
    >
      {expanded ? (
        <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 pr-4 shadow-warm backdrop-blur supports-[backdrop-filter]:bg-card/80 max-w-[320px]">
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="absolute -top-2 -right-2 rounded-full bg-background p-1 text-muted-foreground shadow ring-1 ring-border transition hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
          <button
            onClick={() => setExpanded(false)}
            aria-label="Réduire"
            className="hidden"
          />
          <button
            onClick={onOpen}
            className="flex items-center gap-3 text-left"
            aria-label="Télécharger le Guide Ultime du Parquet en PDF"
          >
            <div className="relative shrink-0 overflow-hidden rounded-md ring-1 ring-border">
              <img
                src={GUIDE_COVER}
                alt=""
                aria-hidden="true"
                className="h-16 w-12 object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-orange-deep">
                Guide offert · PDF
              </p>
              <p className="mt-0.5 font-display text-sm leading-tight text-foreground">
                Le Guide Ultime du Parquet
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Download className="h-3 w-3" /> Télécharger
              </span>
            </div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Télécharger le guide"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
        >
          <Download className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
