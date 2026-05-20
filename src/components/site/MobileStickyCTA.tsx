import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Bottom-pinned CTA visible only on mobile (< sm).
 * Appears after the user has scrolled past the hero; tucks above the
 * iOS/Android home indicator via safe-area-inset.
 */
export function MobileStickyCTA({ href = "#estimate", label = "Estimer gratuitement" }: { href?: string; label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
      <a
        href={href}
        className="pointer-events-auto relative flex items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/30 transition active:scale-[0.98]"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
