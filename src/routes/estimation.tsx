import { createFileRoute } from "@tanstack/react-router";
import { EstimateWizard } from "@/components/wizard/EstimateWizard";

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
    ],
  }),
});

function EstimationPage() {
  return <EstimateWizard />;
}
