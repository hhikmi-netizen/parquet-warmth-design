import { createFileRoute } from "@tanstack/react-router";
import { PillarPage, buildPillarHead } from "@/components/site/PillarPage";
import { getPillarBySlug } from "@/lib/pillars";

const pillar = getPillarBySlug("prix-poncage-parquet")!;

export const Route = createFileRoute("/prix-poncage-parquet")({
  head: () => buildPillarHead(pillar),
  component: () => <PillarPage pillar={pillar} />,
});
