// =============================================================================
// Parquet Vision — server function (scaffold V10, branchement Gemini V11)
// -----------------------------------------------------------------------------
// État actuel : retourne un mock structuré conforme au schéma.
// À faire pour V11 (Codex) : remplacer le bloc MOCK par l'appel `callAI`
// multimodal commenté ci-dessous. Le contrat d'entrée/sortie est figé.
// Voir docs/codex-gemini-vision-brief.md pour le détail (prompts, modèle,
// tool calling, garde-fous, coûts, métriques).
// =============================================================================

import { createServerFn } from "@tanstack/react-start";
import {
  AnalysisResultSchema,
  AnalyzeInputSchema,
  type AnalyzeResponse,
  type AnalysisResult,
} from "./parquet-vision.types";
// Décommenter pour brancher Gemini (V11) :
// import { callAI } from "./ai-gateway.server";

// -----------------------------------------------------------------------------
// MOCK V10 — supprimer dans V11
// -----------------------------------------------------------------------------
const MOCK_RESULT: AnalysisResult = {
  flooringType: "Carrelage en grès cérame, format 30×30 cm",
  flooringDescription:
    "Sol existant en bon état, joints fins, surface plane. Compatible avec une pose flottante sans dépose.",
  recommendedParquet: [
    {
      name: "Parquet contrecollé chêne, 14 mm",
      reason:
        "Pose flottante directe sur carrelage avec sous-couche acoustique. Stable, finition élégante.",
      priceRange: "65–95 €/m² fourni",
    },
    {
      name: "Parquet massif chêne 15 mm clipsable",
      reason: "Pour un rendu authentique sur sol parfaitement plan. Pose flottante possible.",
      priceRange: "90–140 €/m² fourni",
    },
    {
      name: "Stratifié haut de gamme AC5",
      reason: "Option économique, rapide à poser, idéal pour pièces à fort passage.",
      priceRange: "30–55 €/m² fourni",
    },
  ],
  compatibleMaterials: [
    "Sous-couche acoustique 3 mm",
    "Plinthes assorties MDF placage chêne",
    "Barre de seuil aluminium discrète",
    "Profil de finition en L pour départ mur",
  ],
  estimatedSurface: { value: 18, unit: "m²", confidence: "Moyenne" },
  observations: [
    "Pièce de vie type séjour, exposition lumineuse correcte",
    "Présence d'un radiateur — prévoir découpe d'habillage",
    "Aucun seuil de porte visible nécessitant adaptation",
  ],
  warnings: [
    "Vérifier la planéité du sol avec une règle de 2 m avant pose flottante.",
    "Estimation de surface à confirmer avec mesures réelles ou plan.",
  ],
};

// -----------------------------------------------------------------------------
// Prompts (figés — Codex doit pouvoir les utiliser tels quels)
// -----------------------------------------------------------------------------
export const PARQUET_VISION_SYSTEM_PROMPT = `Tu es un expert parqueteur français.
À partir d'UNE photo d'un sol ou d'une pièce, tu identifies le revêtement existant,
recommandes 2 à 4 types de parquet adaptés (massif, contrecollé, stratifié),
listes les matériaux compatibles, et estimes la surface visible en m².

Règles strictes :
- Reste factuel, sans sur-promesse. Si la photo est floue, mal cadrée ou
  insuffisante, baisse la confiance et indique-le dans "warnings".
- Fourchettes de prix réalistes France 2026, TVA 10 % rénovation, fourni hors pose.
- Surface estimée : applique une marge de prudence. Confiance "Faible" si
  cadrage partiel, "Moyenne" si pièce visible mais sans repère métrique,
  "Élevée" uniquement si repère clair (porte standard 0,83 m, carreau étalon…).
- Ne JAMAIS halluciner de marque ou de référence commerciale.
- Tu DOIS appeler la fonction "return_parquet_analysis". Pas de texte libre.`;

// JSON schema pour le tool calling — aligné sur AnalysisResultSchema (zod).
// Codex : ce schéma est l'unique source de vérité pour la sortie du modèle.
export const PARQUET_VISION_TOOL_PARAMS = {
  type: "object",
  properties: {
    flooringType: { type: "string" },
    flooringDescription: { type: "string" },
    recommendedParquet: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
          priceRange: { type: "string" },
        },
        required: ["name", "reason", "priceRange"],
        additionalProperties: false,
      },
    },
    compatibleMaterials: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "string" },
    },
    estimatedSurface: {
      type: "object",
      properties: {
        value: { type: "number" },
        unit: { type: "string", enum: ["m²"] },
        confidence: { type: "string", enum: ["Faible", "Moyenne", "Élevée"] },
      },
      required: ["value", "unit", "confidence"],
      additionalProperties: false,
    },
    observations: { type: "array", maxItems: 6, items: { type: "string" } },
    warnings: { type: "array", maxItems: 6, items: { type: "string" } },
  },
  required: [
    "flooringType",
    "flooringDescription",
    "recommendedParquet",
    "compatibleMaterials",
    "estimatedSurface",
    "observations",
    "warnings",
  ],
  additionalProperties: false,
} as const;

// -----------------------------------------------------------------------------
// Server function — appelée depuis la page /estimer-mon-parquet
// -----------------------------------------------------------------------------
export const analyzeParquetPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AnalyzeInputSchema.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResponse> => {
    // ─── MOCK V10 ─────────────────────────────────────────────────────────────
    // Supprimer ce bloc et décommenter la version réelle ci-dessous pour V11.
    void data;
    await new Promise((r) => setTimeout(r, 1200));
    return { result: MOCK_RESULT, error: null };

    // ─── V11 RÉEL — Gemini 2.5 Flash via Lovable AI Gateway ───────────────────
    // try {
    //   const userHint = data.hint
    //     ? `Indication du client : "${data.hint}".`
    //     : "Aucune indication du client.";
    //
    //   const res = await callAI({
    //     model: "google/gemini-2.5-flash", // multimodal, ~0,001 € / requête
    //     temperature: 0.3,
    //     messages: [
    //       { role: "system", content: PARQUET_VISION_SYSTEM_PROMPT },
    //       {
    //         role: "user",
    //         content: [
    //           { type: "text", text: `${userHint}\nAnalyse cette photo et appelle return_parquet_analysis.` },
    //           { type: "image_url", image_url: { url: data.imageDataUrl, detail: "high" } },
    //         ],
    //       },
    //     ],
    //     tools: [
    //       {
    //         type: "function",
    //         function: {
    //           name: "return_parquet_analysis",
    //           description: "Retourne l'analyse structurée du sol photographié.",
    //           parameters: PARQUET_VISION_TOOL_PARAMS as unknown as Record<string, unknown>,
    //         },
    //       },
    //     ],
    //     toolChoice: { type: "function", function: { name: "return_parquet_analysis" } },
    //   });
    //
    //   if (!res.toolCall) {
    //     return { result: null, error: "Aucune réponse structurée du modèle." };
    //   }
    //   const parsed = AnalysisResultSchema.safeParse(res.toolCall.arguments);
    //   if (!parsed.success) {
    //     console.error("parquet-vision: schema mismatch", parsed.error.flatten());
    //     return { result: null, error: "Réponse IA invalide. Réessayez." };
    //   }
    //   return { result: parsed.data, error: null };
    // } catch (e) {
    //   const msg = e instanceof Error ? e.message : "Erreur inconnue";
    //   if (msg.includes("AI_RATE_LIMITED")) {
    //     return { result: null, error: "Trop de requêtes, réessayez dans une minute." };
    //   }
    //   if (msg.includes("AI_PAYMENT_REQUIRED")) {
    //     return { result: null, error: "Crédits IA épuisés — contactez l'équipe." };
    //   }
    //   console.error("analyzeParquetPhoto error:", e);
    //   return { result: null, error: "L'analyse IA est temporairement indisponible." };
    // }
  });

// Garde-fou TS : empêche le tree-shaking d'éliminer le schéma (utilisé V11).
void AnalysisResultSchema;
