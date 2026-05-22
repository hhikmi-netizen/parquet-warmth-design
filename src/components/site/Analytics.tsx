import { useEffect, useState } from "react";

const CONSENT_KEY = "parqueto.cookies.v1";

/**
 * Plausible Analytics — RGPD friendly, sans cookies tiers, anonymisé.
 *
 * Activation conditionnelle : le script n'est injecté que si l'utilisateur
 * a accepté les cookies via <CookieBanner />.
 *
 * TODO (Claude) :
 *   - Remplacer "parqueto.fr" par le domaine final configuré dans Plausible.
 *   - Si Plausible auto-hébergé, mettre à jour data-api + src.
 *   - Optionnel : décommenter le bloc <noscript> pour le fallback pixel.
 */
export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      try {
        const raw = window.localStorage.getItem(CONSENT_KEY);
        if (!raw) return setAllowed(false);
        const v = JSON.parse(raw) as { choice?: string };
        setAllowed(v.choice === "accepted");
      } catch {
        setAllowed(false);
      }
    };
    check();
    window.addEventListener("storage", check);
    // re-check après acceptation dans le même onglet
    const interval = window.setInterval(check, 2000);
    return () => {
      window.removeEventListener("storage", check);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (typeof document === "undefined") return;
    if (document.getElementById("plausible-script")) return;

    const s = document.createElement("script");
    s.id = "plausible-script";
    s.defer = true;
    s.setAttribute("data-domain", "parqueto.fr");
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }, [allowed]);

  return null;
}
