import { createFileRoute } from "@tanstack/react-router";
import { EstimateWizard } from "@/components/wizard/EstimateWizard";
import { Footer } from "@/components/site/Footer";
import { FloatingNav } from "@/components/site/FloatingNav";

export const Route = createFileRoute("/estimation")({
  component: EstimationPage,
  head: () => ({
    meta: [
      {
        title:
          "Estimation parquet en ligne gratuite — Pose, ponçage, vitrification, rénovation | Parqueto",
      },
      {
        name: "description",
        content:
          "Estimation parquet en ligne gratuite en 4 étapes : pose, ponçage, vitrification, rénovation. Devis d'un artisan parqueteur vérifié sous 24 h, sans engagement.",
      },
      {
        property: "og:title",
        content:
          "Estimation parquet en ligne gratuite — Pose, ponçage, vitrification, rénovation | Parqueto",
      },
      {
        property: "og:description",
        content:
          "Estimation parquet en ligne gratuite en 4 étapes : pose, ponçage, vitrification, rénovation. Devis d'un artisan parqueteur vérifié sous 24 h.",
      },
      { property: "og:url", content: "/estimation" },
      { property: "og:type", content: "website" },
      {
        property: "twitter:title",
        content:
          "Estimation parquet en ligne gratuite — Pose, ponçage, vitrification, rénovation | Parqueto",
      },
      {
        property: "twitter:description",
        content:
          "Estimation parquet en ligne gratuite en 4 étapes : pose, ponçage, vitrification, rénovation. Devis d'un artisan parqueteur vérifié sous 24 h.",
      },
    ],

    links: [{ rel: "canonical", href: "/estimation" }],
  }),
});

function EstimationPage() {
  return (
    <>
      <EstimateWizard />
      <Footer />
      <FloatingNav />
    </>
  );
}
