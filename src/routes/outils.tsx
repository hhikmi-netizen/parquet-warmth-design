import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Palette } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Calculators } from "@/components/site/Calculators";

export const Route = createFileRoute("/outils")({
  component: OutilsPage,
  head: () => ({
    meta: [
      { title: "Outils parquet — Calculateurs & simulateurs · Parqueto" },
      {
        name: "description",
        content:
          "Calculateurs gratuits pour préparer votre projet parquet : surface, volume de finition, comparatif essences, simulateur de teintes.",
      },
      { property: "og:title", content: "Outils parquet · Parqueto" },
      { property: "og:description", content: "L'atelier d'outils Parqueto, gratuit et sans inscription." },
    ],
  }),
});

function OutilsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Atelier Parqueto</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Les outils du métier, <span className="italic text-brand-orange">à votre disposition.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Calculateurs, simulateurs et comparatifs pour préparer votre projet sereinement.
            Gratuit, sans inscription, pensé pour donner une vision juste avant de chiffrer.
          </p>
        </div>
      </section>
      <Calculators />
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                <Palette className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl">Simulateur de teintes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Visualisez l'effet d'une teinte sur votre essence avant tout chantier.
                </p>
              </div>
            </div>
            <Link
              to="/teintes"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Ouvrir le simulateur
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
