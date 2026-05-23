// =============================================================================
// AI Gateway — wrapper d'abstraction
// -----------------------------------------------------------------------------
// Toute la logique d'appel LLM passe par ce fichier. Pour migrer vers un autre
// fournisseur (Anthropic, OpenAI direct, Ollama auto-hébergé, etc.), il suffit
// de réécrire callAI() ci-dessous. Les server functions métier restent inchangées.
// =============================================================================

export type AIMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
};

export type AITool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type AICallOptions = {
  messages: AIMessage[];
  model?: string;
  tools?: AITool[];
  toolChoice?: { type: "function"; function: { name: string } };
  temperature?: number;
};

export type AIResponse = {
  content: string | null;
  toolCall: { name: string; arguments: Record<string, unknown> } | null;
};

const DEFAULT_MODEL = "google/gemini-2.5-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export async function callAI(opts: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const body: Record<string, unknown> = {
    model: opts.model ?? DEFAULT_MODEL,
    messages: opts.messages,
  };
  if (opts.tools) body.tools = opts.tools;
  if (opts.toolChoice) body.tool_choice = opts.toolChoice;
  if (opts.temperature !== undefined) body.temperature = opts.temperature;

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) throw new Error("AI_RATE_LIMITED");
  if (res.status === 402) throw new Error("AI_PAYMENT_REQUIRED");
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI_GATEWAY_ERROR_${res.status}: ${t.slice(0, 200)}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0]?.message;
  const tc = choice?.tool_calls?.[0];

  return {
    content: choice?.content ?? null,
    toolCall: tc
      ? {
          name: tc.function.name,
          arguments: JSON.parse(tc.function.arguments || "{}"),
        }
      : null,
  };
}
