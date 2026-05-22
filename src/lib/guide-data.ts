import rawManifest from "@/content/guide.json";

export type GuidePage = {
  chapter: ChapterSlug;
  order: number;
  asset: string;
  title: string;
  text: string;
  summary: string;
  keywords: string[];
  alt: string;
};

export type ChapterSlug =
  | "introduction"
  | "choisir"
  | "poser"
  | "finir"
  | "entretenir"
  | "renover"
  | "problemes"
  | "annexes";

export type ChapterMeta = {
  slug: ChapterSlug;
  title: string;
  short: string;
  description: string;
  hero: string;
  seoTitle: string;
  seoDescription: string;
};

export const CHAPTERS: ChapterMeta[] = [
  {
    slug: "introduction",
    title: "Introduction au parquet",
    short: "Comprendre le bois et ses ambiances",
    description:
      "Vision, lexique, ambiances et 10 choses essentielles à savoir avant de choisir un parquet.",
    hero: "Le bois, ce matériau vivant",
    seoTitle: "Introduction au parquet — Comprendre, lexique, ambiances · Parqueto",
    seoDescription:
      "Tout ce qu'il faut savoir avant de poser un parquet : essences, ambiances, lexique technique, vision artisanale. Le guide ultime du parquet, chapitre 1.",
  },
  {
    slug: "choisir",
    title: "Choisir son parquet",
    short: "Essence, format, classement, budget",
    description:
      "Comparatifs, calculateurs et critères pour choisir l'essence, le format et la finition adaptés à votre pièce.",
    hero: "Choisir son parquet sans se tromper",
    seoTitle: "Choisir son parquet — Essence, pose, budget · Le guide Parqueto",
    seoDescription:
      "Quelle essence ? Quel format ? Quel budget ? Comparatif chêne, châtaignier, frêne, contrecollé, massif. Le guide complet pour choisir son parquet.",
  },
  {
    slug: "poser",
    title: "Poser son parquet",
    short: "Techniques, DTU, schémas et étapes",
    description:
      "Pose collée, clouée, flottante : schémas techniques, normes DTU, mesure d'humidité, étape par étape.",
    hero: "La pose du parquet, étape par étape",
    seoTitle: "Poser son parquet — Techniques pro, DTU, schémas · Parqueto",
    seoDescription:
      "Pose collée, clouée, flottante. Mesure d'humidité du support, normes DTU 51.1 et 51.2, schémas techniques. Le guide de pose du parquet par les artisans Parqueto.",
  },
  {
    slug: "finir",
    title: "Finitions & jonctions",
    short: "Vitrification, huile, plinthes",
    description:
      "Vitrifications mates, satinées, brillantes. Huiles dures, plinthes, quart-de-rond et jonctions soignées.",
    hero: "Les finitions qui font la différence",
    seoTitle: "Finitions parquet — Vitrification, huile, plinthes · Parqueto",
    seoDescription:
      "Vitrification mate, satinée, brillante, huile dure : aspects, échantillons et bonnes pratiques. Pose des plinthes et jonctions parfaites.",
  },
  {
    slug: "entretenir",
    title: "Entretenir son parquet",
    short: "Gestes simples, produits, durée de vie",
    description:
      "Les règles d'or, les erreurs à éviter, les produits recommandés et les bons gestes pour un parquet qui dure.",
    hero: "Un parquet entretenu, un parquet qui dure",
    seoTitle: "Entretien parquet — Guide complet par essence · Parqueto",
    seoDescription:
      "Comment entretenir son parquet vitrifié, huilé ou ciré : nettoyage, produits, taches, animaux, erreurs à éviter. Le guide d'entretien Parqueto.",
  },
  {
    slug: "renover",
    title: "Rénover un parquet",
    short: "Ponçage, vitrification, escaliers",
    description:
      "Diagnostic, ponçage, vitrification, extensions et restauration d'un parquet ancien.",
    hero: "Donner une seconde vie au parquet",
    seoTitle: "Rénover son parquet — Ponçage, vitrification · Parqueto",
    seoDescription:
      "Ponçage, vitrification, extension, restauration : tous les gestes pour rénover un parquet ancien comme un professionnel.",
  },
  {
    slug: "problemes",
    title: "Problèmes & solutions",
    short: "Grincements, taches, déformations",
    description:
      "Diagnostiquer et résoudre les défauts récurrents : grincements, gonflements, taches, problèmes après pose.",
    hero: "Diagnostiquer et résoudre",
    seoTitle: "Problèmes parquet — Solutions expertes · Parqueto",
    seoDescription:
      "Parquet qui grince, qui gonfle, taches, défauts de pose : diagnostics et solutions par les artisans Parqueto.",
  },
  {
    slug: "annexes",
    title: "Annexes",
    short: "Ressources complémentaires",
    description: "Compléments et ressources annexes du guide.",
    hero: "Pour aller plus loin",
    seoTitle: "Annexes — Le guide du parquet · Parqueto",
    seoDescription: "Ressources complémentaires du guide ultime du parquet par Parqueto.",
  },
];

// Eager glob — tree-shaken to URL strings.
const assets = import.meta.glob<{ default: string }>(
  "/src/assets/guide/**/*.webp",
  { eager: true, query: "?url", import: "default" }
) as unknown as Record<string, string>;

function resolveAsset(rel: string): string {
  // rel = "assets/guide/choisir/01.webp"
  const key = "/src/" + rel;
  return (assets[key] as unknown as string) ?? "";
}

const MANIFEST: GuidePage[] = (rawManifest as GuidePage[]).map((p) => ({
  ...p,
  asset: resolveAsset(p.asset),
}));

// Curated reading order overrides for chapters where the OCR'd page order
// doesn't match the editorial sequence. Cover first, then sommaire, vision,
// then content pages. Pages not listed here keep their natural order
// at the end of the chapter.
const CHAPTER_ORDER_OVERRIDES: Partial<Record<ChapterSlug, number[]>> = {
  introduction: [
    11, // COUVERTURE : « Le Guide Ultime du Parquet »
    8, //  Couverture alternative (sommaire visuel)
    10, // Sommaire du guide
    5, //  Sommaire détaillé
    6, //  Notre vision, votre confort
    7, //  Notre mission : vous guider
    2, //  Vision et engagements Parqueto
    9, //  L'histoire du parquet
    4, //  10 choses sur le parquet
    3, //  Lexique parquet
    14, // La composition du parquet
    15, // Les essences de bois
    16, // Bois & écologie
    17, // Outils du parqueteur
    18, // Comprendre son devis
    1, //  Inspiration des ambiances
    12, // Échantillons stratifié
    19, // Résumé / 4e de couverture
    13, // Q décoratif
  ],
};

function sortChapter(slug: ChapterSlug, pages: GuidePage[]): GuidePage[] {
  const override = CHAPTER_ORDER_OVERRIDES[slug];
  if (!override) return [...pages].sort((a, b) => a.order - b.order);
  const rank = new Map<number, number>();
  override.forEach((ord, i) => rank.set(ord, i));
  return [...pages].sort((a, b) => {
    const ra = rank.has(a.order) ? rank.get(a.order)! : 1000 + a.order;
    const rb = rank.has(b.order) ? rank.get(b.order)! : 1000 + b.order;
    return ra - rb;
  });
}

export function getChapter(slug: ChapterSlug): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getPagesByChapter(slug: ChapterSlug): GuidePage[] {
  return sortChapter(slug, MANIFEST.filter((p) => p.chapter === slug));
}

export function getAllPages(): GuidePage[] {
  const order = CHAPTERS.map((c) => c.slug);
  return CHAPTERS.flatMap((c) =>
    sortChapter(c.slug, MANIFEST.filter((p) => p.chapter === c.slug))
  ).sort((a, b) => {
    const ca = order.indexOf(a.chapter);
    const cb = order.indexOf(b.chapter);
    if (ca !== cb) return ca - cb;
    return 0; // preserve sortChapter order within a chapter
  });
}

export function getChapterStats() {
  return CHAPTERS.map((c) => ({
    ...c,
    count: MANIFEST.filter((p) => p.chapter === c.slug).length,
    cover: MANIFEST.find((p) => p.chapter === c.slug)?.asset ?? "",
  })).filter((c) => c.count > 0);
}
