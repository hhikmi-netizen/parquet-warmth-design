import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import beforeAfter from "@/assets/before-after.jpg";
import detail from "@/assets/detail-wood.jpg";
import hero from "@/assets/hero-parquet.jpg";
import a1 from "@/assets/artisan-1.jpg";
import a2 from "@/assets/artisan-2.jpg";
import a3 from "@/assets/artisan-3.jpg";

export const Route = createFileRoute("/realisations")({
  component: RealisationsPage,
  head: () => ({
    meta: [
      { title: "Réalisations parquet — Avant / Après · Parqueto" },
      {
        name: "description",
        content:
          "Découvrez des chantiers parquet réalisés par nos artisans partenaires : rénovation, pose chevron, vitrification, point de Hongrie.",
      },
      { property: "og:title", content: "Réalisations parquet · Parqueto" },
      { property: "og:description", content: "Avant / après, des chantiers qui parlent d'eux-mêmes." },
      { property: "og:image", content: beforeAfter },
    ],
  }),
});

const projects = [
  { img: beforeAfter, title: "Rénovation chêne massif", city: "Paris 11ᵉ", tag: "Ponçage + vitrification" },
  { img: detail, title: "Veinage révélé à l'huile dure", city: "Lyon 6ᵉ", tag: "Finition naturelle" },
  { img: hero, title: "Pose chevron sur ancien", city: "Bordeaux", tag: "Dépose + pose collée" },
  { img: a1, title: "Point de Hongrie haussmannien", city: "Paris 8ᵉ", tag: "Pose traditionnelle" },
  { img: a2, title: "Contrecollé chêne brossé", city: "Lyon 2ᵉ", tag: "Pose flottante" },
  { img: a3, title: "Restauration parquet ancien", city: "Bordeaux", tag: "Rénovation complète" },
];

function RealisationsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Réalisations</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Le bois travaillé, <span className="italic text-brand-orange">en images.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Une sélection de chantiers menés par nos artisans partenaires. Chaque réalisation est le fruit
            d'un cadrage honnête et d'un geste précis.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">{p.tag}</p>
                  <h3 className="mt-2 font-display text-xl">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.city}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Lancer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
