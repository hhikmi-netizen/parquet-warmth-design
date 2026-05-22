import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { GUIDE_COVER } from "@/lib/guide-content";

/**
 * CTA flottant non-intrusif, déclenché à des moments opportuns.
 *
 * Règles d'apparition (toutes doivent être vraies) :
 *  - L'utilisateur a dépassé `triggerRatio` de la hauteur du document (par défaut 55 %)
 *    OU est resté `dwellMs` sur la page (par défaut 60 s) — signal d'engagement.
 *  - Pas en haut de page, pas en bas (on cache dans les 600 derniers px → footer).
 *  - Non fermé par l'utilisateur dans les 7 derniers jours (localStorage).
 *
 * Comportement :
 *  - Apparition unique en format "carte" pendant ~7 s, puis se replie en bulle discrète.
 *  - Une seule réapparition possible : si l'utilisateur scrolle vers le haut puis revient
 *    sur un nouveau seuil d'engagement, la carte ne réapparaît pas — la bulle reste.
 *  - Fermable définitivement (×) avec mémoire 7 jours.
 *  - Cachée à l'impression.
 */
const DISMISS_KEY = "parqueto-guide-cta-dismissed-until";
const SHOWN_KEY = "parqueto-guide-cta-shown-session";

export function FloatingGuideCta({
  onOpen,
  triggerRatio = 0.55,
  dwellMs = 60_000,
  expandedMs = 7_000,
  footerBufferPx = 600,
}: {
  onOpen: () => void;
  triggerRatio?: number;
  dwellMs?: number;
  expandedMs?: number;
  footerBufferPx?: number;
}) {
  const [mode, setMode] = useState<"hidden" | "card" | "bubble">("hidden");
  const [dismissed, setDismissed] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect 7-day dismissal
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || "0");
      if (until && Date.now() < until) {
        setDismissed(true);
        return;
      }
    } catch {
      // ignore
    }

    const alreadyShownThisSession = sessionStorage.getItem(SHOWN_KEY) === "1";

    const show = () => {
      if (mode !== "hidden") return;
      if (alreadyShownThisSession) {
        // Pas de seconde "carte" dans la même session : bulle discrète d'emblée.
        setMode("bubble");
        return;
      }
      setMode("card");
      sessionStorage.setItem(SHOWN_KEY, "1");
      collapseTimer.current = setTimeout(() => setMode("bubble"), expandedMs);
    };

    const checkScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const total = doc.scrollHeight;
      const ratio = scrolled / total;
      const nearBottom = total - scrolled < footerBufferPx;
      const nearTop = window.scrollY < 300;

      if (nearTop || nearBottom) {
        // Cache pendant qu'on est en haut ou tout en bas, mais ne supprime pas l'état
        if (mode === "card" || mode === "bubble") setMode("hidden");
        return;
      }
      if (ratio >= triggerRatio) show();
    };

    // Engagement par dwell time
    dwellTimer.current = setTimeout(() => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const nearBottom = doc.scrollHeight - scrolled < footerBufferPx;
      if (!nearBottom && window.scrollY > 300) show();
    }, dwellMs);

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScroll);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      if (dwellTimer.current) clearTimeout(dwellTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISS_KEY, String(Date.now() + sevenDays));
    } catch {
      // ignore
    }
  }

  if (dismissed || mode === "hidden") return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 print:hidden animate-in fade-in slide-in-from-bottom-3 duration-500"
      role="complementary"
      aria-label="Télécharger le guide"
    >
      {mode === "card" ? (
        <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 pr-4 shadow-warm backdrop-blur supports-[backdrop-filter]:bg-card/80 max-w-[320px]">
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="absolute -top-2 -right-2 rounded-full bg-background p-1 text-muted-foreground shadow ring-1 ring-border transition hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
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
          onClick={onOpen}
          aria-label="Télécharger le guide"
          title="Télécharger le Guide Ultime du Parquet"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
        >
          <Download className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
