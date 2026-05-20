import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, SocialButtons, Divider } from "@/components/auth/AuthShell";
import { authToast } from "@/components/auth/auth-toast";

const schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(1, "Mot de passe requis").max(72),
});

const searchSchema = z.object({ redirect: z.string().optional() });

function safeRedirect(value: string | undefined): string {
  if (!value) return "/historique";
  if (!value.startsWith("/") || value.startsWith("//")) return "/historique";
  return value;
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Connexion — Parqueto" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [social, setSocial] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      authToast.error(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      const lower = error.message.toLowerCase();
      if (lower.includes("not confirmed") || lower.includes("email_not_confirmed")) {
        authToast.info("Confirmez votre email pour continuer.");
        navigate({ to: "/verify-email", search: { email: parsed.data.email, redirect: target } });
        return;
      }
      authToast.error(error.message);
      return;
    }
    authToast.success("Bienvenue !");
    navigate({ to: target });
  };

  const onProvider = async (provider: "google" | "apple") => {
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

  return (
    <AuthShell
      title="Connexion"
      subtitle="Retrouvez vos devis et l'historique de vos projets."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            to="/signup"
            search={redirect ? { redirect } : undefined}
            className="font-medium text-brand-orange hover:underline"
          >
            Créer un compte
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-brand-orange">
              Oublié ?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-orange"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Se connecter
        </button>
      </form>
    </AuthShell>
  );
}
