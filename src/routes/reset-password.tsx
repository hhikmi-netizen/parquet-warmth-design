import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";

const schema = z
  .object({
    password: z.string().min(8, "8 caractères minimum").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Les mots de passe ne correspondent pas", path: ["confirm"] });

type Strength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  checks: { label: string; ok: boolean }[];
};

function evaluate(pw: string): Strength {
  const checks = [
    { label: "8 caractères minimum", ok: pw.length >= 8 },
    { label: "Une majuscule", ok: /[A-Z]/.test(pw) },
    { label: "Un chiffre", ok: /\d/.test(pw) },
    { label: "Un caractère spécial", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const bonus = pw.length >= 12 ? 1 : 0;
  const raw = Math.min(4, passed + bonus - (pw.length === 0 ? passed : 0));
  const score = (pw.length === 0 ? 0 : Math.max(1, raw)) as Strength["score"];
  const labels = ["", "Très faible", "Faible", "Correct", "Fort"];
  const colors = [
    "bg-muted",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
  ];
  return { score, label: labels[score], color: colors[score], checks };
}

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
  head: () => ({ meta: [{ title: "Nouveau mot de passe — Parqueto" }] }),
});

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => evaluate(password), [password]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Mot de passe invalide", {
        id: "reset-password",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast.error(error.message, { id: "reset-password" });
      return;
    }
    toast.dismiss("reset-password");
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthShell
        title="Mot de passe mis à jour"
        subtitle="Vous pouvez désormais accéder à votre espace avec votre nouveau mot de passe."
      >
        <div className="grid gap-6">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div className="text-foreground/90">
              <p className="font-medium text-foreground">Réinitialisation réussie</p>
              <p className="mt-1 text-muted-foreground">
                Pensez à conserver votre nouveau mot de passe dans un endroit sûr.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/historique" })}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
          >
            Accéder à mon espace
          </button>
          <Link to="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
            Retour à la connexion
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle={ready ? "Choisissez un nouveau mot de passe pour votre compte." : "Lien invalide ou expiré. Demandez un nouveau lien."}
    >
      {ready ? (
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">Nouveau mot de passe</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-orange"
            />
            <div className="mt-1 grid gap-2" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= strength.score ? strength.color : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Force du mot de passe</span>
                <span className="font-medium text-foreground">{strength.label || "—"}</span>
              </div>
              <ul className="mt-1 grid grid-cols-2 gap-1.5 text-xs">
                {strength.checks.map((c) => (
                  <li
                    key={c.label}
                    className={`flex items-center gap-1.5 ${c.ok ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {c.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="confirm" className="text-sm font-medium">Confirmer</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-orange"
            />
            {confirm.length > 0 && confirm !== password && (
              <p className="text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || strength.score < 2 || password !== confirm}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Mettre à jour
          </button>
        </form>
      ) : (
        <a
          href="/forgot-password"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
        >
          Demander un nouveau lien
        </a>
      )}
    </AuthShell>
  );
}
