import { useState } from "react";
import { CheckCircle2, Download, Loader2, Mail, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { downloadGuidePdf } from "@/lib/guide-pdf.functions";
import { sendGuideEmail } from "@/lib/guide-email.functions";

/**
 * Email-gated download. Captures lead + generates PDF server-side, then
 * triggers a browser download. Keeps email in localStorage so we don't re-ask.
 */
export function DownloadGate({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [accepts, setAccepts] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");
  const generate = useServerFn(downloadGuidePdf);
  const sendEmail = useServerFn(sendGuideEmail);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.length > 100) {
      setStatus("err"); setErr("Prénom trop long."); return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus("err"); setErr("Adresse email invalide."); return;
    }
    setStatus("loading"); setErr("");
    try {
      const res = await generate({ data: { email: email.trim(), name: name.trim() || null, optIn: accepts } });
      // Decode base64 → Blob → download
      const bin = atob(res.base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      localStorage.setItem("parqueto-guide-lead", JSON.stringify({ email, name, at: Date.now() }));
      // Fire-and-forget welcome email
      sendEmail({ data: { email: email.trim(), name: name.trim() || null } }).catch((err) =>
        console.error("welcome email failed", err)
      );
      setStatus("ok");
      // Redirige vers la page de remerciement avec upsell
      setTimeout(() => {
        navigate({ to: "/guide/merci" });
      }, 800);
    } catch (e: unknown) {
      console.error(e);
      setStatus("err");
      setErr("Impossible de générer le PDF. Réessayez dans un instant.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-secondary p-2 text-muted-foreground transition hover:bg-accent"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {status !== "ok" ? (
          <form onSubmit={submit} className="p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-deep">
              <Download className="h-3.5 w-3.5" /> PDF gratuit · A4
            </div>
            <h2 className="mt-4 font-display text-2xl text-balance">
              Recevez le Guide Ultime du Parquet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Le guide complet rédigé par Parqueto, généré en PDF haute qualité,
              téléchargé immédiatement.
            </p>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Prénom (optionnel)</span>
                <input
                  type="text"
                  value={name}
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  placeholder="Hicham"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                  Email <span className="text-brand-orange">*</span>
                </span>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    placeholder="vous@email.fr"
                  />
                </div>
              </label>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={accepts}
                  onChange={(e) => setAccepts(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[oklch(0.66_0.17_47)]"
                />
                <span>
                  J'accepte de recevoir occasionnellement des conseils parquet de la part de
                  Parqueto. Désinscription en 1 clic.
                </span>
              </label>
            </div>

            {status === "err" && <p className="mt-3 text-xs text-destructive">{err}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
            >
              {status === "loading" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Génération du PDF…</>
              ) : (
                <><Download className="h-4 w-4" /> Télécharger le PDF</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Aucun spam, jamais. Vos données restent chez Parqueto.
            </p>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-state-success-surface text-state-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-2xl">Merci {name || ""} !</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Le téléchargement a commencé. Si rien ne se passe, vérifiez vos téléchargements ou
              réessayez.
            </p>
            <button
              onClick={onClose}
              className="mt-5 inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium transition hover:bg-accent"
            >
              Continuer la lecture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
