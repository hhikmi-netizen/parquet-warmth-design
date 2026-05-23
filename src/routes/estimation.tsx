import { createFileRoute } from "@tanstack/react-router";
import { EstimateWizard } from "@/components/wizard/EstimateWizard";
import { Footer } from "@/components/site/Footer";
import { FloatingNav } from "@/components/site/FloatingNav";

export const Route = createFileRoute("/estimation")({
  component: EstimationPage,
  head: () => ({
    meta: [
      { title: "Estimation détaillée — Parqueto" },
      {
        name: "description",
        content:
          "Décrivez votre projet parquet en 4 étapes guidées : projet, logement, localisation, coordonnées. Estimation indicative sous 24 h, sans engagement.",
      },
      { property: "og:url", content: "/estimation" },
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
