import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, SocialButtons, Divider } from "@/components/auth/AuthShell";
import { authToast } from "@/components/auth/auth-toast";

const schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(8, "8 caractères minimum").max(72),
});

const searchSchema = z.object({ redirect: z.string().optional() });

function safeRedirect(value: string | undefined): string {
  if (!value) return "/historique";
  if (!value.startsWith("/") || value.startsWith("//")) return "/historique";
  return value;
}

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Créer un compte — Parqueto" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [social, setSocial] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || social || sent) return;
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      authToast.error(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      ...parsed.data,
      options: { emailRedirectTo: window.location.origin + target },
    });
    setLoading(false);
    if (error) {
      authToast.error(error.message);
      return;
    }
    authToast.dismiss();
    if (data.session) {
      navigate({ to: target });
      return;
    }
    setSent(true);
    navigate({ to: "/verify-email", search: { email: parsed.data.email, redirect: target } });
  };

  const onProvider = async (provider: "google" | "apple") => {
    if (loading || social) return;
    setSocial(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + target,
    });
    if (result.error) {
      setSocial(null);
      authToast.error(result.error.message);
      return;
    }
    if (result.redirected) return;
    navigate({ to: target });
  };

  if (sent) {
    // We navigate to /verify-email above, but render a fallback in case navigation hasn't kicked in.
    return (
      <AuthShell
        title="Vérifiez vos emails"
        subtitle={`Un lien de confirmation a été envoyé à ${email}.`}
      >
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Redirection vers la page de vérification…
        </div>
      </AuthShell>
    );
  }


  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Gardez l'historique de vos devis et accédez à votre espace pro."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-brand-orange hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <SocialButtons onProvider={onProvider} loading={social} />
      <Divider>ou</Divider>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-orange"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
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
          <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer mon compte
        </button>
        <p className="text-center text-xs text-muted-foreground">
          En créant un compte, vous acceptez nos conditions d'utilisation.
        </p>
      </form>
    </AuthShell>
  );
}
