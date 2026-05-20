/**
 * Mock côté front qui respecte la shape retournée par `getArtisanInbox`
 * (`src/lib/projects.functions.ts`). Tant que le backend n'est pas
 * branché, on alimente le dashboard pro avec ces données — quand on
 * branchera, il suffira de remplacer `useInbox()` par un `useQuery`
 * autour du serverFn.
 */

export type MatchStatus = "pending" | "accepted" | "declined" | "refunded" | "expired";
export type ProjectStatus = "qualified" | "matched" | "accepted" | "closed" | "expired";

export type InboxProject = {
  id: string;
  reference: string;
  /** Visible uniquement quand `status === "accepted"`. */
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  ville: string;
  code_postal: string;
  surface_m2: number;
  type_pose: string;
  type_bois: string;
  etat_sol: string;
  budget_min: number;
  budget_max: number;
  delai_souhaite: string | null;
  description: string | null;
  created_at: string;
  status: ProjectStatus;
  credits_cost: number;
};

export type InboxMatch = {
  match_id: string;
  status: MatchStatus;
  proposed_at: string;
  decided_at: string | null;
  expires_at: string;
  match_score: number;
  project: InboxProject;
};

export type InboxArtisan = {
  id: string;
  raison_sociale: string;
  representant: string;
  ville: string;
  code_postal: string;
  rayon_km: number;
  credits_balance: number;
  status: "pending" | "verified" | "paused";
};

export type InboxStats = {
  pending: number;
  accepted: number;
  refunded: number;
  total: number;
};

export type InboxData = {
  artisan: InboxArtisan;
  matches: InboxMatch[];
  stats: InboxStats;
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

export const MOCK_INBOX: InboxData = {
  artisan: {
    id: "art-demo-1",
    raison_sociale: "Atelier du Parquet Lyonnais",
    representant: "Julien Marchand",
    ville: "Lyon 6e",
    code_postal: "69006",
    rayon_km: 25,
    credits_balance: 7,
    status: "verified",
  },
  matches: [
    {
      match_id: "m-2486",
      status: "pending",
      proposed_at: hoursAgo(2),
      decided_at: null,
      expires_at: inDays(4),
      match_score: 92,
      project: {
        id: "p-2486",
        reference: "PJ-002486",
        client_name: "C. R.",
        client_email: null,
        client_phone: null,
        ville: "Lyon 6e",
        code_postal: "69006",
        surface_m2: 42,
        type_pose: "Ponçage",
        type_bois: "Massif",
        etat_sol: "État moyen",
        budget_min: 2100,
        budget_max: 2800,
        delai_souhaite: "Sous 4 semaines",
        description: "Salon et couloir, parquet d'origine 1930. Vitrification mate souhaitée.",
        created_at: hoursAgo(2),
        status: "matched",
        credits_cost: 1,
      },
    },
    {
      match_id: "m-2484",
      status: "pending",
      proposed_at: hoursAgo(5),
      decided_at: null,
      expires_at: inDays(4),
      match_score: 78,
      project: {
        id: "p-2484",
        reference: "PJ-002484",
        client_name: "Famille D.",
        client_email: null,
        client_phone: null,
        ville: "Villeurbanne",
        code_postal: "69100",
        surface_m2: 68,
        type_pose: "Pose neuve",
        type_bois: "Contrecollé",
        etat_sol: "Bon état",
        budget_min: 3400,
        budget_max: 4200,
        delai_souhaite: "Mai 2026",
        description: "Appartement neuf, livraison brute. Chêne contrecollé clair.",
        created_at: hoursAgo(5),
        status: "matched",
        credits_cost: 1,
      },
    },
    {
      match_id: "m-2479",
      status: "accepted",
      proposed_at: daysAgo(1),
      decided_at: daysAgo(0.5),
      expires_at: inDays(3),
      match_score: 88,
      project: {
        id: "p-2479",
        reference: "PJ-002479",
        client_name: "Camille Roussel",
        client_email: "camille.r@example.com",
        client_phone: "06 12 34 56 78",
        ville: "Lyon 3e",
        code_postal: "69003",
        surface_m2: 12,
        type_pose: "Rénovation",
        type_bois: "Massif",
        etat_sol: "Très abîmé",
        budget_min: 450,
        budget_max: 700,
        delai_souhaite: "Dès que possible",
        description: "Reprise locale + huile dure.",
        created_at: daysAgo(1),
        status: "accepted",
        credits_cost: 1,
      },
    },
    {
      match_id: "m-2471",
      status: "accepted",
      proposed_at: daysAgo(4),
      decided_at: daysAgo(3.5),
      expires_at: inDays(-1),
      match_score: 95,
      project: {
        id: "p-2471",
        reference: "PJ-002471",
        client_name: "Famille Dupont",
        client_email: "fam.d@example.com",
        client_phone: "06 98 76 54 32",
        ville: "Caluire",
        code_postal: "69300",
        surface_m2: 38,
        type_pose: "Pose chevron",
        type_bois: "Massif",
        etat_sol: "Bon état",
        budget_min: 4800,
        budget_max: 6200,
        delai_souhaite: "Juin 2026",
        description: "Point de Hongrie, finition huilée naturelle.",
        created_at: daysAgo(4),
        status: "accepted",
        credits_cost: 1,
      },
    },
    {
      match_id: "m-2460",
      status: "refunded",
      proposed_at: daysAgo(21),
      decided_at: daysAgo(20),
      expires_at: daysAgo(16),
      match_score: 70,
      project: {
        id: "p-2460",
        reference: "PJ-002460",
        client_name: "L. T.",
        client_email: null,
        client_phone: null,
        ville: "Lyon 2e",
        code_postal: "69002",
        surface_m2: 24,
        type_pose: "Vitrification",
        type_bois: "Contrecollé",
        etat_sol: "Bon état",
        budget_min: 720,
        budget_max: 980,
        delai_souhaite: "Avril 2026",
        description: "Client injoignable — crédit remboursé automatiquement.",
        created_at: daysAgo(21),
        status: "closed",
        credits_cost: 1,
      },
    },
  ],
  stats: { pending: 2, accepted: 2, refunded: 1, total: 5 },
};
