import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, FileText, MessageSquare } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/historique")({
  component: HistoriquePage,
  head: () => ({ meta: [{ title: "Mon espace — Parqueto" }] }),
});

function HistoriquePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/messages"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium transition hover:bg-accent"
            >
              <MessageSquare className="h-4 w-4" /> Messagerie
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

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Mon espace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Retrouvez ici l'historique de vos devis et de vos demandes.
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Aucun devis pour l'instant</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Lancez une estimation pour commencer. Vos devis seront sauvegardés ici automatiquement.
          </p>
          <Link
            to="/estimation"
            className="mt-6 inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
          >
            Estimer un projet
          </Link>
        </div>
      </section>
    </main>
  );
}
