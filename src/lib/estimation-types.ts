/**
 * Shape partagée pour le tunnel client → projet.
 * Aligne 1:1 avec le schéma `submitEstimationProject` côté serveur
 * (`src/lib/projects.functions.ts`). Quand le branchement backend
 * sera activé, il suffira de passer ce payload au serverFn.
 */
export type EstimationPayload = {
  client_name: string;
  client_email: string;
  client_phone?: string;
  ville: string;
  code_postal: string;
  surface_m2: number;
  type_pose: string;
  type_bois: string;
  etat_sol: string;
  budget_min: number;
  budget_max: number;
  delai_souhaite?: string;
  description?: string;
  required_specialites: string[];
};

export type EstimationSubmissionResult = {
  success: true;
  project_id: string;
  reference: string;
};

/**
 * Mapping libellés UI → clés de spécialités attendues côté artisan
 * (cf. `artisans.specialites`).
 */
const SERVICE_TO_SPECIALITES: Record<string, string[]> = {
  poncage: ["Ponçage"],
  vitrification: ["Vitrification"],
  pose: ["Pose neuve"],
  renovation: ["Rénovation", "Ponçage", "Vitrification"],
};

const TYPE_TO_BOIS: Record<string, string> = {
  contrecolle: "Contrecollé",
  massif: "Massif",
  ancien: "Parquet ancien",
};

const ETAT_TO_LABEL: Record<string, string> = {
  bon: "Bon état",
  moyen: "État moyen",
  abime: "Très abîmé",
};

const SERVICE_TO_LABEL: Record<string, string> = {
  poncage: "Ponçage",
  vitrification: "Vitrification",
  pose: "Pose neuve",
  renovation: "Rénovation complète",
};

export type EstimationInputs = {
  service: string;
  type: string;
  etat: string;
  surface_m2: number;
  budget_min: number;
  budget_max: number;
  plinthes?: boolean;
  seuils?: number;
  delai?: string;
  description?: string;
};

export type ContactInputs = {
  nom: string;
  email: string;
  telephone?: string;
  cp: string;
  ville?: string;
  message?: string;
};

/**
 * Sérialise les réponses du wizard / formulaire contact en payload prêt
 * pour `submitEstimationProject`. Pure function — aucun appel réseau.
 */
export function buildEstimationPayload(
  inputs: EstimationInputs,
  contact: ContactInputs,
): EstimationPayload {
  const extras: string[] = [];
  if (inputs.plinthes) extras.push("plinthes incluses");
  if (inputs.seuils && inputs.seuils > 0)
    extras.push(`${inputs.seuils} seuil${inputs.seuils > 1 ? "s" : ""}`);

  const desc = [
    contact.message?.trim() || undefined,
    extras.length ? `Options : ${extras.join(" · ")}` : undefined,
    inputs.description?.trim() || undefined,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    client_name: contact.nom.trim(),
    client_email: contact.email.trim(),
    client_phone: contact.telephone?.trim() || undefined,
    ville: contact.ville?.trim() || "À préciser",
    code_postal: contact.cp.trim(),
    surface_m2: inputs.surface_m2,
    type_pose: SERVICE_TO_LABEL[inputs.service] ?? inputs.service,
    type_bois: TYPE_TO_BOIS[inputs.type] ?? inputs.type,
    etat_sol: ETAT_TO_LABEL[inputs.etat] ?? inputs.etat,
    budget_min: Math.round(inputs.budget_min),
    budget_max: Math.round(inputs.budget_max),
    delai_souhaite: inputs.delai?.trim() || undefined,
    description: desc || undefined,
    required_specialites: SERVICE_TO_SPECIALITES[inputs.service] ?? [],
  };
}

/**
 * Stub local — génère une référence de projet plausible côté client
 * sans appel réseau. À remplacer par `submitEstimationProject({ data })`
 * quand le backend sera branché.
 */
export async function submitEstimationStub(
  payload: EstimationPayload,
): Promise<EstimationSubmissionResult> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 600));
  const ref = `PJ-${Date.now().toString().slice(-6)}`;
  if (typeof window !== "undefined") {
    try {
      const key = "parqueto:projects:v1";
      const raw = window.localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) as Array<unknown>) : [];
      list.unshift({ reference: ref, submitted_at: new Date().toISOString(), payload });
      window.localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
    } catch {
      /* ignore */
    }
  }
  return { success: true, project_id: crypto.randomUUID(), reference: ref };
}
