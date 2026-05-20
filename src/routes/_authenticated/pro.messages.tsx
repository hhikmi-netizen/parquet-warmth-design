import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ArrowLeft } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";
import { useAuth } from "@/hooks/use-auth";
import { MessagingShell } from "@/components/messaging/MessagingShell";

export const Route = createFileRoute("/_authenticated/pro/messages")({
  component: ProMessagesPage,
  head: () => ({
    meta: [{ title: "Messagerie clients — Parqueto Pro" }],
  }),
});

function ProMessagesPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/pro" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto Pro" className="h-10 w-auto" />
            <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange-deep">
              Pro
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/pro"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Tableau de bord
            </Link>
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium transition hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5">
          <h1 className="font-serif text-2xl sm:text-3xl">Messagerie clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tous vos échanges actifs, regroupés par projet. Répondez vite pour booster votre score.
          </p>
        </div>
        <MessagingShell viewer="artisan" />
      </section>
    </main>
  );
}
