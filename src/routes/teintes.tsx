import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette } from "lucide-react";
import { TeinteSelector } from "@/components/teintes/TeinteSelector";
import logo from "@/assets/parqueto-logo.png";

export const Route = createFileRoute("/teintes")({
  component: TeintesPage,
  head: () => ({
    meta: [
      { title: "Visualiseur de teintes parquet — Parqueto" },
      {
        name: "description",
        content:
          "Comparez 8 teintes de parquet en haute définition : chêne naturel, blanchi, miel, doré, fumé, noyer, wengé, ébène. Trouvez la finition qui s'accorde à votre intérieur.",
      },
      { property: "og:title", content: "Visualiseur de teintes parquet — Parqueto" },
      {
        property: "og:description",
        content: "8 teintes de parquet en haute définition, comparables côte à côte.",
      },
    ],
  }),
});

function TeintesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange-deep">
            <Palette className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-deep">
              Visualiseur de teintes
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Trouvez la teinte parfaite</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              8 finitions photographiées en lumière naturelle. Filtrez par famille de tons,
              comparez deux teintes côte à côte, puis demandez à l'artisan une démonstration
              directement sur votre parquet.
            </p>
          </div>
        </div>

        <TeinteSelector />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Rendu indicatif. Le bois est un matériau vivant — la teinte finale varie selon l'essence
          réelle, la lumière et la finition appliquée.
        </p>
      </section>
    </main>
  );
}
