import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, Home } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

/**
 * Sections whose primary CTA must never be covered by the floating nav.
 * The observer fires *before* they actually touch the nav's footprint.
 */
const CTA_SELECTORS = ["#hero", "#estimate"];

// Approx. footprint of the floating nav (button stack + safe-area + margin).
// Used as a negative bottom rootMargin so the nav hides just *before* the CTA
// scrolls into the bottom-right corner it would visually overlap.
const NAV_RESERVED_PX = 140;

export function FloatingNav({ showBack = true }: { showBack?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [ctaInView, setCtaInView] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");

  // Scroll-driven visibility, direction, and progress (single rAF loop).
  useEffect(() => {
    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setProgress(Math.min(100, Math.round((y / max) * 100)));
      setVisible(y > 480);
      const dir = y > lastY.current + 4 ? "down" : y < lastY.current - 4 ? "up" : null;
      if (dir) setScrollDir(dir);
      lastY.current = y;
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    setCanGoBack(typeof window !== "undefined" && window.history.length > 1);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Hide the nav *just before* a primary CTA enters its bottom-right zone.
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
      {
        // Negative bottom margin = "shrink" the viewport by the nav footprint,
        // so isIntersecting flips to true a hair before the CTA reaches the
        // floating nav's corner. Small top margin lets it re-show smoothly
        // once the CTA scrolls past.
        rootMargin: `-64px 0px -${NAV_RESERVED_PX}px 0px`,
        // Need only a sliver of the CTA inside the shrunken viewport to hide.
        threshold: [0, 0.01, 0.2],
      },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // UX: hide while scrolling down (out of the user's way), show on scroll-up.
  const shown = visible && !ctaInView && scrollDir === "up";

  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
    });
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  const circumference = 2 * Math.PI * 18; // r=18
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div
      className={`fixed right-5 z-40 flex flex-col items-end gap-2 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:right-8 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      aria-hidden={!shown}
    >
      {showBack && canGoBack && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Retour à la page précédente"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5 motion-reduce:group-hover:translate-x-0" />
          Retour
        </button>
      )}
      <button
        type="button"
        onClick={scrollTop}
        aria-label={`Revenir en haut de page — ${progress}% lu`}
        title="Revenir en haut"
        className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
      >
        {/* Reading progress ring */}
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-150 ease-out motion-reduce:transition-none"
          />
        </svg>
        <ArrowUp className="relative h-5 w-5 transition group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" />
      </button>
    </div>
  );
}
