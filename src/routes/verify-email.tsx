import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Loader2, MailCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { authToast } from "@/components/auth/auth-toast";

const TARGET_LABELS: Record<string, string> = {
  "/historique": "Mon espace — Historique",
  "/espace-pro": "Espace pro",
  "/devis": "Mes devis",
};

function labelFor(path: string): string {
  if (TARGET_LABELS[path]) return TARGET_LABELS[path];
  // Strip query/hash and prettify the last segment.
  const clean = path.split(/[?#]/)[0];
  const seg = clean.replace(/\/+$/, "").split("/").filter(Boolean).pop() ?? "";
  if (!seg) return "Accueil";
  return seg
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const searchSchema = z.object({
  email: z.string().email().optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Vérification de l'email — Parqueto" }] }),
});

// Only accept same-origin relative paths to prevent open-redirect.
function safeRedirect(value: string | undefined): string {
  if (!value) return "/historique";
  if (!value.startsWith("/") || value.startsWith("//")) return "/historique";
  return value;
}

function VerifyEmailPage() {
  const { email: emailFromUrl, redirect } = Route.useSearch();
  const [email, setEmail] = useState(emailFromUrl ?? "");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const target = useMemo(() => safeRedirect(redirect), [redirect]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user?.email_confirmed_at) {
        window.location.href = target;
      }
    });
    return () => subscription.unsubscribe();
  }, [target]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onResend = async () => {
    const parsed = z.string().trim().email("Email invalide").max(255).safeParse(email);
    if (!parsed.success) {
      authToast.error(parsed.error.issues[0]?.message ?? "Email invalide");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: parsed.data,
      options: { emailRedirectTo: window.location.origin + target },
    });
    setResending(false);
    if (error) {
      authToast.error(error.message);
      return;
    }
    authToast.success("Email renvoyé");
    setCooldown(45);
  };

  return (
    <AuthShell
      title="Vérifiez vos emails"
      subtitle={
        email
          ? `Un lien de confirmation a été envoyé à ${email}. Cliquez dessus pour activer votre compte.`
          : "Un lien de confirmation vous a été envoyé. Cliquez dessus pour activer votre compte."
      }
      footer={
        <>
          Mauvaise adresse ?{" "}
          <Link to="/signup" className="font-medium text-brand-orange hover:underline">
            Recommencer l'inscription
          </Link>
        </>
      }
    >
      <div className="grid gap-6">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <MailCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-orange" />
          <div className="text-foreground/90">
            <p className="font-medium text-foreground">En attente de confirmation</p>
            <p className="mt-1 text-muted-foreground">
              Pensez à vérifier vos spams. Cette page se mettra à jour automatiquement dès la validation.
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-orange"
          />
        </div>

        <button
          onClick={onResend}
          disabled={resending || cooldown > 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
        >
          {resending && <Loader2 className="h-4 w-4 animate-spin" />}
          {cooldown > 0 ? `Renvoyer (${cooldown}s)` : "Renvoyer l'email"}
        </button>

        <Link to="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
          Retour à la connexion
        </Link>
      </div>
    </AuthShell>
  );
}
