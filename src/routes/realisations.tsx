import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import hero from "@/assets/hero-parquet.jpg";
import renoDamier from "@/assets/reno-damier.jpg";
import renoHongrie from "@/assets/reno-hongrie.jpg";
import renoMosaique from "@/assets/reno-mosaique.jpg";
import renoDamierLight from "@/assets/reno-damier-light.jpg";
import renoPoseChevron from "@/assets/reno-pose-chevron.jpg";
import parquetAncien from "@/assets/parquet-ancien.jpg";
import renoPhoto1 from "@/assets/reno-photo-1.jpg";
import renoPhoto2 from "@/assets/reno-photo-2.jpg";
import renoPhoto3 from "@/assets/reno-photo-3.jpg";
import renoPhoto4 from "@/assets/reno-photo-4.jpg";
import renoPhoto5 from "@/assets/reno-photo-5.jpg";

export const Route = createFileRoute("/realisations")({
  component: RealisationsPage,
  head: () => ({
    meta: [
      { title: "Rénovation parquet & parquet qui gondole — Avant / Après · Parqueto" },
      {
        name: "description",
        content:
          "Photos de rénovation parquet : ponçage, vitrification, pose. Solutions parquet qui gondole, rénovation parquet ancien et chantiers avant / après par des artisans parqueteurs vérifiés.",
      },
      { property: "og:title", content: "Rénovation parquet & parquet qui gondole — Avant / Après · Parqueto" },
      { property: "og:description", content: "Photos de rénovation parquet et solutions parquet qui gondole. Avant / après par des artisans vérifiés." },
      { property: "og:image", content: hero },
      { property: "og:image:alt", content: "Rénovation parquet et parquet qui gondole — Avant / Après" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/realisations" },
    ],

    links: [{ rel: "canonical", href: "/realisations" }],
  }),
});

const projects = [
  { img: renoPhoto1, title: "Bâtons rompus chêne rénové", city: "Île-de-France", tag: "Ponçage + finition mate" },
  { img: renoPhoto2, title: "Vitrification brillante exotique", city: "Île-de-France", tag: "Application vitrificateur" },
  { img: renoPhoto3, title: "Lames larges chêne huilé", city: "Île-de-France", tag: "Pose collée + huile naturelle" },
  { img: renoPhoto4, title: "Mosaïque chêne avant / après", city: "Île-de-France", tag: "Ponçage en cours" },
  { img: renoPhoto5, title: "Mosaïque huile Blanchon", city: "Île-de-France", tag: "Huile parquet incolore" },
  { img: renoDamierLight, title: "Damier chêne clair", city: "Île-de-France", tag: "Vitrification mate UV" },
  { img: renoDamier, title: "Damier mosaïque haussmannien", city: "Paris", tag: "Rénovation + finition mate" },
  { img: renoHongrie, title: "Point de Hongrie restauré", city: "Île-de-France", tag: "Ponçage + huile dure" },
  { img: renoMosaique, title: "Mosaïque blanche lumineuse", city: "Île-de-France", tag: "Pose collée + vitrification" },
  { img: renoPoseChevron, title: "Chevron rénové sur ancien", city: "Île-de-France", tag: "Dépose + repose collée" },
  { img: parquetAncien, title: "Parquet ancien revitalisé", city: "Île-de-France", tag: "Ponçage + finition naturelle" },
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
