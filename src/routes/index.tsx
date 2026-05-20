import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Promise } from "@/components/site/Promise";
import { Process } from "@/components/site/Process";
import { Pains } from "@/components/site/Pains";
import { Expertise } from "@/components/site/Expertise";
import { Artisan } from "@/components/site/Artisan";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { Calculators } from "@/components/site/Calculators";
import { Blog } from "@/components/site/Blog";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Parqueto — Estimez votre projet parquet en quelques minutes" },
      {
        name: "description",
        content:
          "Estimation parquet en ligne claire et immédiate : ponçage, vitrification, pose, rénovation. Un artisan partenaire vérifié pour cadrer votre projet, sans démarchage.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
        <Hero />
        <Promise />
        <Process />
      <Pains />
      <Expertise />
      <ArtisansShowcase />
      <Calculators />
      <Artisan />
      <Blog />
      <FinalCTA />
      <Footer />
    </main>
  );
}
