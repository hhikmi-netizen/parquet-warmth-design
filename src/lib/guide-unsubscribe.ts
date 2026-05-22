/**
 * Génère un token de désinscription stable pour un email donné.
 * HMAC tronqué basé sur GUIDE_CRON_SECRET — pas besoin de stocker un token côté DB.
 * Utilisé côté serveur uniquement.
 */
import { createHmac } from "crypto";

const BASE_URL = "https://parqueto.fr";

function tokenFor(email: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 24);
}

export function buildUnsubscribeUrl(email: string): string {
  const secret = process.env.GUIDE_CRON_SECRET;
  if (!secret) return `${BASE_URL}/contact`;
  const t = tokenFor(email, secret);
  const e = encodeURIComponent(email.trim().toLowerCase());
  return `${BASE_URL}/api/public/guide-unsubscribe?e=${e}&t=${t}`;
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const secret = process.env.GUIDE_CRON_SECRET;
  if (!secret) return false;
  const expected = tokenFor(email, secret);
  if (expected.length !== token.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) ok |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return ok === 0;
}
