import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Blog } from "@/components/site/Blog";
import { FAQ } from "@/components/site/FAQ";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog parquet — Conseils, guides & expertises · Parqueto" },
      {
        name: "description",
        content:
          "Guides, conseils et expertises sur le parquet : ponçage, vitrification, choix d'essence, pose, entretien. Le savoir-faire artisan, expliqué simplement.",
      },
      { property: "og:title", content: "Blog Parqueto" },
      { property: "og:description", content: "Le parquet expliqué simplement, sans jargon." },
    ],
  }),
});

function BlogPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Le journal</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Comprendre le parquet, <span className="italic text-brand-orange">sans jargon.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Guides, conseils d'artisans et expertises pour bien préparer votre projet.
          </p>
        </div>
      </section>
      <Blog />
      <FAQ />
      <Footer />
    </main>
  );
}
