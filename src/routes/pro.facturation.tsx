import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pro/facturation")({
  head: () => ({
    meta: [
      { title: "Facturation — Parqueto Pro" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: FacturationRedirect,
});

// La facturation a été fusionnée dans /pro/abonnement (abonnement Stripe +
// historique achats leads + factures). Cette route reste pour ne pas casser
// les liens existants et redirige proprement.
function FacturationRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/pro/abonnement", replace: true });
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream/40 p-6">
      <div className="max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-warm">
        <h1 className="font-serif text-2xl text-brand-ink">Facturation</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          La facturation est désormais regroupée avec votre abonnement et vos achats
          de leads.
        </p>
        <Link
          to="/pro/abonnement"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
        >
          Aller à mon abonnement <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
