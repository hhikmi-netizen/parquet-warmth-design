// Données simulées — tableau de bord artisan (leads + stats)
// TODO (Claude) : remplacer ces helpers par des appels Supabase
//   - getArtisanLeads()   → SELECT depuis projects + project_matches
//   - getArtisanStats()   → agrégat (count, taux acceptation, CA estimé)
//   - subscribeToLeads()  → realtime channel postgres_changes

export type LeadStatus = "nouveau" | "vu" | "accepté" | "refusé" | "remporté";

export type ArtisanLead = {
  id: string;
  client: string;
  ville: string;
  cp: string;
  surface: number;
  prestation: "Pose" | "Ponçage et vitrification" | "Réparation" | "Rénovation";
  budget: string;
  receivedAt: string; // ISO
  status: LeadStatus;
  source: "Estimation" | "Sinistre" | "Recommandation";
};

export const MOCK_LEADS: ArtisanLead[] = [
  { id: "L-2410", client: "Mme Lefèvre", ville: "Neuilly-sur-Seine", cp: "92200", surface: 78, prestation: "Pose", budget: "9 500 – 11 200 €", receivedAt: "2026-05-21T09:14:00Z", status: "nouveau", source: "Estimation" },
  { id: "L-2409", client: "M. Bensaïd", ville: "Paris 7ᵉ", cp: "75007", surface: 42, prestation: "Ponçage et vitrification", budget: "1 800 – 2 400 €", receivedAt: "2026-05-20T17:42:00Z", status: "accepté", source: "Estimation" },
  { id: "L-2408", client: "Cabinet Maître Cohen", ville: "Levallois-Perret", cp: "92300", surface: 120, prestation: "Rénovation", budget: "14 000 – 18 000 €", receivedAt: "2026-05-20T11:08:00Z", status: "vu", source: "Sinistre" },
  { id: "L-2407", client: "Famille Dupont", ville: "Versailles", cp: "78000", surface: 95, prestation: "Pose", budget: "13 200 – 16 800 €", receivedAt: "2026-05-19T15:30:00Z", status: "remporté", source: "Recommandation" },
  { id: "L-2406", client: "M. Rahmani", ville: "Boulogne-Billancourt", cp: "92100", surface: 28, prestation: "Réparation", budget: "650 – 980 €", receivedAt: "2026-05-19T08:55:00Z", status: "refusé", source: "Estimation" },
  { id: "L-2405", client: "Mme Petit", ville: "Antony", cp: "92160", surface: 64, prestation: "Ponçage et vitrification", budget: "2 800 – 3 500 €", receivedAt: "2026-05-18T13:21:00Z", status: "accepté", source: "Estimation" },
];

export type ArtisanStats = {
  leadsReçus30j: number;
  leadsAcceptés30j: number;
  tauxAcceptation: number; // %
  caEstimé30j: number; // €
  notemoyenne: number;
  delaiReponseMoyenH: number;
  // Historique 8 semaines pour mini-graphe
  serie: { semaine: string; leads: number; acceptés: number }[];
};

export const MOCK_STATS: ArtisanStats = {
  leadsReçus30j: 28,
  leadsAcceptés30j: 19,
  tauxAcceptation: 68,
  caEstimé30j: 47800,
  notemoyenne: 4.8,
  delaiReponseMoyenH: 3.4,
  serie: [
    { semaine: "S14", leads: 4, acceptés: 2 },
    { semaine: "S15", leads: 6, acceptés: 4 },
    { semaine: "S16", leads: 5, acceptés: 3 },
    { semaine: "S17", leads: 7, acceptés: 5 },
    { semaine: "S18", leads: 8, acceptés: 5 },
    { semaine: "S19", leads: 6, acceptés: 4 },
    { semaine: "S20", leads: 9, acceptés: 6 },
    { semaine: "S21", leads: 7, acceptés: 5 },
  ],
};
