import { createFileRoute } from "@tanstack/react-router";
import { PillarPage, buildPillarHead } from "@/components/site/PillarPage";
import { getPillarBySlug } from "@/lib/pillars";

const pillar = getPillarBySlug("renover-parquet-ancien")!;

export const Route = createFileRoute("/renover-parquet-ancien")({
  head: () => buildPillarHead(pillar),
  component: () => <PillarPage pillar={pillar} />,
});
