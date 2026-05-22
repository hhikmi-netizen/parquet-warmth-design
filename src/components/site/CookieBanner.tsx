import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "parqueto.cookies.v1";

type Consent = "accepted" | "essential";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (!v) {
        // Léger délai pour ne pas concurrencer le premier paint
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const close = (choice: Consent) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 left-1/2 z-[80] w-[min(640px,calc(100%-2rem))] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="rounded-2xl border border-border bg-card p-5 shadow-warm backdrop-blur sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange sm:flex">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 id="cookie-title" className="font-display text-base text-foreground">
              Vos données restent les vôtres.
            </h2>
            <p id="cookie-desc" className="mt-1 text-sm text-muted-foreground">
              Nous utilisons uniquement les cookies essentiels au fonctionnement du site et,
              avec votre accord, des cookies de mesure d'audience anonyme pour améliorer l'expérience.
              Aucun pistage publicitaire. {" "}
              <a href="/charte-qualite" className="underline underline-offset-2 hover:text-brand-orange">
                En savoir plus
              </a>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => close("accepted")}
                className="inline-flex items-center justify-center rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={() => close("essential")}
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                Essentiels uniquement
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => close("essential")}
            aria-label="Fermer"
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
