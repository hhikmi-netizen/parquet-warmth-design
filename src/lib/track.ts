/**
 * Helper client de tracking événementiel.
 * - Génère un session_id stable (sessionStorage)
 * - Lit le segment courant (localStorage) si déclaré par l'utilisateur
 * - Envoie l'événement en fire-and-forget via la server fn
 * - Tolère le SSR (no-op côté serveur)
 */
import { recordEvent } from "@/lib/tracking.functions";

const SESSION_KEY = "pq_session_id";
const SEGMENT_KEY = "pq_segment";

export type Segment = "particulier" | "pro" | "artisan";

function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return null;
  }
}

export function getSegment(): Segment | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(SEGMENT_KEY);
    if (s === "particulier" || s === "pro" || s === "artisan") return s;
  } catch {
    /* ignore */
  }
  return null;
}

export function setSegment(seg: Segment) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEGMENT_KEY, seg);
  } catch {
    /* ignore */
  }
}

export function track(
  event: string,
  meta?: Record<string, unknown>,
  opts?: { segment?: Segment | null }
) {
  if (typeof window === "undefined") return;
  try {
    const segment = opts?.segment ?? getSegment();
    recordEvent({
      data: {
        event,
        segment: segment ?? null,
        path: window.location.pathname + window.location.search,
        referrer: document.referrer || null,
        sessionId: getSessionId(),
        meta: meta ?? null,
      },
    }).catch(() => {
      /* fire-and-forget */
    });
  } catch {
    /* never block UI */
  }
}
