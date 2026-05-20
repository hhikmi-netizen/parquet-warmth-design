import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Camera } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";
import { useAuth } from "@/hooks/use-auth";
import { ChantierPhotos } from "@/components/pro/ChantierPhotos";

export const Route = createFileRoute("/_authenticated/pro/chantiers")({
  component: ProChantiersPage,
  head: () => ({
    meta: [{ title: "Suivi photo chantier — Parqueto Pro" }],
  }),
});

function ProChantiersPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/pro" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto Pro" className="h-9 w-auto sm:h-10" />
            <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange-deep">
              Pro
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/pro"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Tableau de bord
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 font-medium transition hover:bg-accent"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-deep">
            <Camera className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl">Suivi photo chantier</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Documentez l'état avant, l'avancement et le rendu final. Idéal pour rassurer le client et limiter les litiges.
            </p>
          </div>
        </div>
        <ChantierPhotos />
        <p className="mt-6 text-[11px] text-muted-foreground">
          Astuce : un usage avec accord client permettra plus tard d'alimenter votre fiche artisan avec des cas avant / après.
        </p>
      </section>
    </main>
  );
}
