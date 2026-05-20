import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { authToast } from "@/components/auth/auth-toast";

const schema = z.object({ email: z.string().trim().email("Email invalide").max(255) });

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Mot de passe oublié — Parqueto" }] }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Email invalide");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle={sent ? undefined : "Indiquez votre email, nous vous enverrons un lien de réinitialisation."}
      footer={
        <Link to="/login" className="font-medium text-brand-orange hover:underline">
          Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Un email a été envoyé à <strong className="text-foreground">{email}</strong>. Cliquez sur le lien pour définir un nouveau mot de passe.
        </div>
      ) : (
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
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-orange text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Envoyer le lien
          </button>
        </form>
      )}
    </AuthShell>
  );
}
