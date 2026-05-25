import { useEffect, useRef } from "react";

/**
 * Widget Trustpilot officiel.
 *
 * Activation :
 * 1. Créer un compte Trustpilot Business (free tier OK).
 * 2. Récupérer le Business Unit ID dans Settings → Integrations.
 * 3. Définir `VITE_TRUSTPILOT_BUSINESS_UNIT_ID` dans les variables d'env.
 *
 * Tant que la variable n'est pas définie, le composant ne rend rien
 * (pas de placeholder → pas de faux avis affichés, conforme DGCCRF).
 *
 * Templates courants :
 *  - Micro Combo            : 5419b6a8b0d04a076446a9ad (hauteur 24)
 *  - Mini Carousel          : 539ad60defb9600b94d7df2c (hauteur 240)
 *  - Review Collector       : 56278e9abfbbba0bdcd568bc (hauteur 52)
 *  - Horizontal             : 5406e65db0d04a09e042d5fc (hauteur 28)
 */
export function TrustpilotWidget({
  templateId = "539ad60defb9600b94d7df2c",
  height = "240px",
  theme = "light",
  stars = "4,5",
  language = "fr",
  locale = "fr-FR",
}: {
  templateId?: string;
  height?: string;
  theme?: "light" | "dark";
  stars?: string;
  language?: string;
  locale?: string;
}) {
  const businessUnitId = import.meta.env.VITE_TRUSTPILOT_BUSINESS_UNIT_ID as string | undefined;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!businessUnitId) return;
    const SRC = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    const existing = document.querySelector(`script[src="${SRC}"]`);
    const init = () => {
      const tp = (window as unknown as { Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void } }).Trustpilot;
      if (tp && ref.current) tp.loadFromElement(ref.current, true);
    };
    if (existing) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    }
  }, [businessUnitId, templateId]);

  if (!businessUnitId) return null;

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height={height}
      data-style-width="100%"
      data-theme={theme}
      data-stars={stars}
      data-review-languages={language}
    >
      <a
        href={`https://fr.trustpilot.com/review/parqueto.fr`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground underline"
      >
        Voir nos avis Trustpilot
      </a>
    </div>
  );
}
