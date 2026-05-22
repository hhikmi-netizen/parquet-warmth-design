import { useState, type FormEvent } from "react";
import { Mail, Check } from "lucide-react";

type Variant = "inline" | "card" | "footer";

/**
 * Newsletter "L'éclat du parquet" — capture d'email.
 *
 * UI uniquement. TODO (Claude) :
 *   - Brancher onSubmit → server function `subscribeNewsletter({ email })`
 *   - Table : newsletter_subscribers (email unique, source, consent_at)
 *   - Envoi email de bienvenue + double opt-in (Resend / template)
 */
export function NewsletterSignup({
  variant = "card",
  source = "site",
}: {
  variant?: Variant;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    // TODO Claude : appel server function ici
    await new Promise((r) => setTimeout(r, 600));
    try {
      const key = "parqueto.newsletter.pending";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ email, source, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch { /* ignore */ }
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div
        className={
          variant === "card"
            ? "rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-6 text-center"
            : "flex items-center gap-2 text-sm text-brand-orange"
        }
      >
        <Check className="mx-auto h-6 w-6 text-brand-orange" />
        <p className="mt-2 font-display text-base text-foreground">
          Merci&nbsp;! Vérifiez votre boîte mail pour confirmer votre inscription.
        </p>
      </div>
    );
  }

  const isFooter = variant === "footer";

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "card"
          ? "rounded-2xl border border-border bg-card p-6 shadow-warm"
          : isFooter
            ? ""
            : "flex flex-col gap-3 sm:flex-row"
      }
    >
      {variant === "card" && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">L'éclat du parquet</h3>
              <p className="text-xs text-muted-foreground">
                1 newsletter par mois · conseils, tendances, offres artisans
              </p>
            </div>
          </div>
        </>
      )}
      <div className={variant === "card" ? "flex flex-col gap-2 sm:flex-row" : "flex w-full flex-col gap-2 sm:flex-row"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@email.fr"
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-orange/60"
          aria-label="Votre adresse email"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:opacity-60"
        >
          {loading ? "Inscription…" : "S'inscrire"}
        </button>
      </div>
      <p className={`mt-3 text-[11px] text-muted-foreground ${variant !== "card" ? "sm:mt-2" : ""}`}>
        Pas de spam. Désinscription en 1 clic. Vos données restent confidentielles.
      </p>
    </form>
  );
}
