import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI } from "./ai-gateway.server";

// =============================================================================
// Diagnostic IA gondolage — structured output via tool calling
// =============================================================================

const InputSchema = z.object({
  typeParquet: z.enum(["massif", "flottant", "stratifie"]),
  cause: z.enum(["inondation", "humidite", "chauffage", "pose"]),
  surface: z.enum(["petite", "moyenne", "grande"]),
  duree: z.enum(["moins24", "moins72", "plus72"]),
  chauffageSol: z.boolean(),
  contexte: z.string().max(800).optional(),
  ville: z.string().max(80).optional(),
});

const TOOL_PARAMS = {
  type: "object",
  properties: {
    diagnostic: {
      type: "string",
      description: "Diagnostic en 2-3 phrases, ton clair et rassurant.",
    },
    urgence: {
      type: "string",
      enum: ["faible", "moyenne", "haute", "critique"],
      description: "Niveau d'urgence d'intervention.",
    },
    causes_probables: {
      type: "array",
      items: { type: "string" },
      description: "2 à 4 causes probables, formulées simplement.",
    },
    etapes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          detail: { type: "string" },
        },
        required: ["titre", "detail"],
        additionalProperties: false,
      },
      description: "3 à 5 étapes concrètes à suivre, dans l'ordre.",
    },
    prix_estimatif: {
      type: "string",
      description: "Fourchette de prix réaliste en € (ex: '180 – 800 €').",
    },
    couverture_assurance: {
      type: "string",
      description: "1 phrase sur la couverture MRH probable.",
    },
    cta_recommande: {
      type: "string",
      enum: ["diagnostic", "devis", "urgence_sinistre", "observation"],
      description: "Type d'action à proposer.",
    },
  },
  required: [
    "diagnostic",
    "urgence",
    "causes_probables",
    "etapes",
    "prix_estimatif",
    "couverture_assurance",
    "cta_recommande",
  ],
  additionalProperties: false,
} as const;

export type DiagnosticResult = {
  diagnostic: string;
  urgence: "faible" | "moyenne" | "haute" | "critique";
  causes_probables: string[];
  etapes: { titre: string; detail: string }[];
  prix_estimatif: string;
  couverture_assurance: string;
  cta_recommande: "diagnostic" | "devis" | "urgence_sinistre" | "observation";
};

const SYSTEM_PROMPT = `Tu es un expert parqueteur français avec 20 ans d'expérience en diagnostic de parquets gondolés.
Tu réponds en français, ton concret, sans jargon inutile.
Tu te bases sur les normes DTU 51.2 / 51.11 et les pratiques d'expertise MRH.
Tu donnes des fourchettes de prix réalistes pour la France (artisan vérifié, TVA 10% rénovation).
Tu ne sur-dramatises pas mais tu n'édulcores pas non plus.
IMPORTANT : tu DOIS appeler la fonction generate_diagnostic. Ne réponds jamais en texte libre.`;

function buildUserPrompt(input: z.infer<typeof InputSchema>): string {
  const labels: Record<string, string> = {
    massif: "parquet massif (bois plein)",
    flottant: "parquet flottant / contrecollé clipsé",
    stratifie: "stratifié",
    inondation: "inondation ou fuite ponctuelle",
    humidite: "humidité chronique / remontée capillaire",
    chauffage: "chauffage au sol",
    pose: "pose récente ou malfaçon suspectée",
    petite: "moins de 1 m² (quelques lames)",
    moyenne: "1 à 5 m²",
    grande: "plus de 5 m² ou pièce entière",
    moins24: "moins de 24 h",
    moins72: "1 à 3 jours",
    plus72: "plus de 3 jours",
  };
  return [
    `Situation à diagnostiquer :`,
    `- Type de parquet : ${labels[input.typeParquet]}`,
    `- Cause supposée : ${labels[input.cause]}`,
    `- Surface concernée : ${labels[input.surface]}`,
    `- Ancienneté des symptômes : ${labels[input.duree]}`,
    `- Chauffage au sol : ${input.chauffageSol ? "oui" : "non"}`,
    input.ville ? `- Ville : ${input.ville}` : "",
    input.contexte ? `\nContexte additionnel du client :\n"${input.contexte}"` : "",
    `\nGénère un diagnostic structuré via la fonction generate_diagnostic.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const diagnosticGondolage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<{ result: DiagnosticResult | null; error: string | null }> => {
    try {
      const res = await callAI({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(data) },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_diagnostic",
              description: "Retourne un diagnostic structuré du parquet gondolé.",
              parameters: TOOL_PARAMS as unknown as Record<string, unknown>,
            },
          },
        ],
        toolChoice: { type: "function", function: { name: "generate_diagnostic" } },
        temperature: 0.4,
      });

      if (!res.toolCall) {
        return { result: null, error: "Aucune réponse structurée du modèle." };
      }
      return { result: res.toolCall.arguments as DiagnosticResult, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      if (msg.includes("AI_RATE_LIMITED")) {
        return { result: null, error: "Trop de requêtes, réessayez dans une minute." };
      }
      if (msg.includes("AI_PAYMENT_REQUIRED")) {
        return { result: null, error: "Crédits IA épuisés — contactez l'équipe." };
      }
      console.error("diagnosticGondolage error:", e);
      return { result: null, error: "Le diagnostic IA est temporairement indisponible." };
    }
  });
