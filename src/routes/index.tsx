import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Process } from "@/components/site/Process";
import { Pains } from "@/components/site/Pains";
import { Expertise } from "@/components/site/Expertise";
import { Artisan } from "@/components/site/Artisan";
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
          "Estimation parquet en ligne : ponçage, vitrification, pose, rénovation. Artisans vérifiés près de chez vous. Sans engagement.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Process />
      <Pains />
      <Expertise />
      <Artisan />
      <Blog />
      <FinalCTA />
      <Footer />
    </main>
  );
}
