import { createFileRoute } from "@tanstack/react-router";
import { PillarPage, buildPillarHead } from "@/components/site/PillarPage";
import { getPillarBySlug } from "@/lib/pillars";

const pillar = getPillarBySlug("parquet-flottant-ou-massif")!;

export const Route = createFileRoute("/parquet-flottant-ou-massif")({
  head: () => buildPillarHead(pillar),
  component: () => <PillarPage pillar={pillar} />,
});
