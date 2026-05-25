// =============================================================================
// Parquet Vision — types partagés client/serveur
// -----------------------------------------------------------------------------
// Contrat de la réponse renvoyée par la server function `analyzeParquetPhoto`.
// Reporté V11 (Gemini Vision). Voir docs/codex-gemini-vision-brief.md
// =============================================================================

import { z } from "zod";

export const ConfidenceSchema = z.enum(["Faible", "Moyenne", "Élevée"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const RecommendedParquetSchema = z.object({
  name: z.string().min(1).max(120),
  reason: z.string().min(1).max(400),
  priceRange: z.string().min(1).max(60),
});

export const AnalysisResultSchema = z.object({
  flooringType: z.string().min(1).max(200),
  flooringDescription: z.string().min(1).max(600),
  recommendedParquet: z.array(RecommendedParquetSchema).min(1).max(4),
  compatibleMaterials: z.array(z.string().min(1).max(120)).min(1).max(8),
  estimatedSurface: z.object({
    value: z.number().min(0).max(500),
    unit: z.literal("m²"),
    confidence: ConfidenceSchema,
  }),
  observations: z.array(z.string().min(1).max(240)).max(6),
  warnings: z.array(z.string().min(1).max(240)).max(6),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Input contract — image envoyée en data URL base64 (jpg/png/webp).
export const AnalyzeInputSchema = z.object({
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|jpg|png|webp);base64,/, "Format d'image invalide")
    .max(20_000_000), // ~15 Mo base64 encodé
  hint: z.string().max(400).optional(), // contexte facultatif saisi par l'utilisateur
});

export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

export type AnalyzeResponse = {
  result: AnalysisResult | null;
  error: string | null;
};
