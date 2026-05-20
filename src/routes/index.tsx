import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Promise } from "@/components/site/Promise";
import { Process } from "@/components/site/Process";
import { ProcessFAQ } from "@/components/site/ProcessFAQ";
import { Pains } from "@/components/site/Pains";
import { Expertise } from "@/components/site/Expertise";
import { Artisan } from "@/components/site/Artisan";
import { ArtisansShowcase } from "@/components/site/ArtisansShowcase";
import { Calculators } from "@/components/site/Calculators";
import { Blog } from "@/components/site/Blog";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Partners } from "@/components/site/Partners";
import { Footer } from "@/components/site/Footer";
import { FloatingNav } from "@/components/site/FloatingNav";

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
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />
        <Hero />
        <Promise />
        <Process />
        <ProcessFAQ />
      <Pains />
      <Expertise />
      <ArtisansShowcase />
      <Calculators />
      <Artisan />
        <Blog />
        <FAQ />
        <Partners />
        <FinalCTA />
      <Footer />
      <FloatingNav />
    </main>
  );
}
