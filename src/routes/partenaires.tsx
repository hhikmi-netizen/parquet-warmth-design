import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Handshake } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Partners } from "@/components/site/Partners";

export const Route = createFileRoute("/partenaires")({
  component: PartenairesPage,
  head: () => ({
    meta: [
      { title: "Partenaires — Écosystème Parqueto" },
      {
        name: "description",
        content:
          "Découvrez les partenaires de Parqueto : fournisseurs, marques, acteurs du parquet. Rejoignez notre écosystème.",
      },
      { property: "og:title", content: "Partenaires · Parqueto" },
      { property: "og:description", content: "L'écosystème Parqueto : marques, fournisseurs, partenaires métier." },
    ],
  }),
});

function PartenairesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Écosystème</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Un réseau de partenaires <span className="italic text-brand-orange">sélectionnés.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Marques, fournisseurs, acteurs métier : nous nous entourons de partenaires qui partagent
            notre exigence du travail bien fait.
          </p>
        </div>
      </section>
      <Partners />
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                <Handshake className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl">Devenir partenaire</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Vous êtes marque, fournisseur ou acteur du parquet ? Discutons d'un partenariat utile à nos artisans et clients.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
