import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";

/**
 * Selectors of CTA blocks the floating nav must never cover.
 * When any of these is intersecting the viewport, the nav fades out.
 */
const CTA_SELECTORS = ["#hero", "#estimate"];

export function FloatingNav({ showBack = true }: { showBack?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [ctaInView, setCtaInView] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setCanGoBack(typeof window !== "undefined" && window.history.length > 1);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the nav when a primary CTA section is on screen.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = CTA_SELECTORS.map((s) => document.querySelector(s)).filter(
      (el): el is Element => Boolean(el),
    );
    if (targets.length === 0) {
      setCtaInView(false);
      return;
    }
    const states = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => states.set(e.target, e.isIntersecting));
        setCtaInView(Array.from(states.values()).some(Boolean));
      },
      // Trigger a bit before the CTA actually touches the floating button area.
      { rootMargin: "0px 0px -96px 0px", threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const shown = visible && !ctaInView;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  return (
    <div
      className={`fixed right-5 z-40 flex flex-col gap-2 transition-all duration-300 sm:right-8 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        // iOS safe-area + extra clearance so the floating nav sits above
        // sticky CTAs / browser chrome on Safari iOS.
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      aria-hidden={!shown}
    >
      {showBack && canGoBack && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Retour"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:text-brand-orange"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          Retour
        </button>
      )}
      <button
        type="button"
        onClick={scrollTop}
        aria-label="Revenir en haut"
        className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
      >
        <ArrowUp className="h-5 w-5 transition group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
}
