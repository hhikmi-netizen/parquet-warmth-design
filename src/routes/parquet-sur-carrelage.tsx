import { createFileRoute } from "@tanstack/react-router";
import { PillarPage, buildPillarHead } from "@/components/site/PillarPage";
import { getPillarBySlug } from "@/lib/pillars";

const pillar = getPillarBySlug("parquet-sur-carrelage")!;

export const Route = createFileRoute("/parquet-sur-carrelage")({
  head: () => buildPillarHead(pillar),
  component: () => <PillarPage pillar={pillar} />,
});
