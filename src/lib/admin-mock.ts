// Mock data for the Parqueto admin space. No backend — UI/UX only.

export type LeadStatus =
  | "nouveau"
  | "qualifie"
  | "envoye"
  | "accepte"
  | "refuse"
  | "expire";

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nouveau: "Nouveau",
  qualifie: "Qualifié",
  envoye: "Envoyé artisan",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};

export const STATUS_TONE: Record<LeadStatus, string> = {
  nouveau: "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
  qualifie: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  envoye: "bg-sky-500/10 text-sky-700 border-sky-500/30",
  accepte: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  refuse: "bg-rose-500/10 text-rose-700 border-rose-500/30",
  expire: "bg-muted text-muted-foreground border-border",
};

export type Lead = {
  id: string;
  ref: string;
  client: string;
  ville: string;
  projet: "Ponçage" | "Vitrification" | "Pose parquet" | "Rénovation" | "Escalier";
  surface: number;
  budget: string;
  status: LeadStatus;
  date: string;
  artisan?: string;
  photos: number;
  notes?: string;
};

export const LEADS: Lead[] = [
  { id: "L-1042", ref: "PJ-204812", client: "Camille R.", ville: "Paris 11e", projet: "Ponçage", surface: 42, budget: "1 800 – 2 400 €", status: "nouveau", date: "il y a 12 min", photos: 4 },
  { id: "L-1041", ref: "PJ-204798", client: "Hugo M.", ville: "Lyon 6e", projet: "Vitrification", surface: 65, budget: "2 600 – 3 200 €", status: "qualifie", date: "il y a 1 h", photos: 3, artisan: "Antoine D." },
  { id: "L-1040", ref: "PJ-204776", client: "Léa P.", ville: "Bordeaux", projet: "Pose parquet", surface: 28, budget: "2 100 – 2 800 €", status: "envoye", date: "il y a 3 h", photos: 6, artisan: "Atelier Chêne & Co" },
  { id: "L-1039", ref: "PJ-204711", client: "Marc T.", ville: "Lille", projet: "Rénovation", surface: 90, budget: "5 400 – 6 800 €", status: "accepte", date: "hier", photos: 5, artisan: "Maison Vermeille" },
  { id: "L-1038", ref: "PJ-204688", client: "Sofia B.", ville: "Marseille 8e", projet: "Escalier", surface: 12, budget: "1 200 – 1 600 €", status: "refuse", date: "hier", photos: 2, artisan: "JM Parqueteur" },
  { id: "L-1037", ref: "PJ-204612", client: "Nicolas L.", ville: "Toulouse", projet: "Ponçage", surface: 55, budget: "2 300 – 2 900 €", status: "expire", date: "il y a 6 j", photos: 1 },
  { id: "L-1036", ref: "PJ-204588", client: "Élodie V.", ville: "Nantes", projet: "Vitrification", surface: 38, budget: "1 500 – 2 000 €", status: "nouveau", date: "il y a 28 min", photos: 3 },
  { id: "L-1035", ref: "PJ-204566", client: "Théo S.", ville: "Paris 17e", projet: "Pose parquet", surface: 72, budget: "5 800 – 7 200 €", status: "qualifie", date: "il y a 2 h", photos: 5 },
];

export type ArtisanStatus = "a_verifier" | "valide" | "suspendu";
export const ARTISAN_STATUS: Record<ArtisanStatus, { label: string; tone: string }> = {
  a_verifier: { label: "À vérifier", tone: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  valide: { label: "Validé", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  suspendu: { label: "Suspendu", tone: "bg-rose-500/10 text-rose-700 border-rose-500/30" },
};

export type Artisan = {
  id: string;
  nom: string;
  raison: string;
  ville: string;
  zones: string[];
  specialites: string[];
  formule: "Gratuit" | "Essentiel" | "Premium";
  credits: number;
  leads30j: number;
  score: number;
  status: ArtisanStatus;
  rcExpire: string;
  rcAlerte: boolean;
  kbis: boolean;
};

export const ARTISANS: Artisan[] = [
  { id: "A-201", nom: "Antoine Delmas", raison: "Delmas Parqueteur SARL", ville: "Lyon", zones: ["69", "01", "38"], specialites: ["Ponçage", "Vitrification"], formule: "Premium", credits: 28, leads30j: 14, score: 4.9, status: "valide", rcExpire: "12/04/2026", rcAlerte: false, kbis: true },
  { id: "A-202", nom: "Sophie Vermeille", raison: "Maison Vermeille", ville: "Lille", zones: ["59", "62"], specialites: ["Rénovation", "Pose parquet", "Escalier"], formule: "Premium", credits: 41, leads30j: 19, score: 4.8, status: "valide", rcExpire: "03/02/2026", rcAlerte: true, kbis: true },
  { id: "A-203", nom: "Karim Belkacem", raison: "Atelier Chêne & Co", ville: "Bordeaux", zones: ["33", "40"], specialites: ["Pose parquet", "Vitrification"], formule: "Essentiel", credits: 12, leads30j: 7, score: 4.7, status: "valide", rcExpire: "22/09/2026", rcAlerte: false, kbis: true },
  { id: "A-204", nom: "Jean-Michel Roux", raison: "JM Parqueteur", ville: "Marseille", zones: ["13", "83", "84"], specialites: ["Ponçage", "Escalier"], formule: "Essentiel", credits: 5, leads30j: 4, score: 4.4, status: "a_verifier", rcExpire: "—", rcAlerte: true, kbis: false },
  { id: "A-205", nom: "Pauline Garnier", raison: "Garnier Bois & Finitions", ville: "Nantes", zones: ["44", "49", "85"], specialites: ["Vitrification", "Rénovation"], formule: "Gratuit", credits: 3, leads30j: 2, score: 4.6, status: "valide", rcExpire: "08/07/2026", rcAlerte: false, kbis: true },
  { id: "A-206", nom: "Bruno Lemaire", raison: "Lemaire & Fils", ville: "Toulouse", zones: ["31", "82"], specialites: ["Pose parquet"], formule: "Essentiel", credits: 0, leads30j: 0, score: 3.9, status: "suspendu", rcExpire: "01/11/2025", rcAlerte: true, kbis: true },
];

export type Alert = {
  id: string;
  level: "info" | "warning" | "danger";
  title: string;
  meta: string;
  cta?: string;
};

export const ALERTS: Alert[] = [
  { id: "AL-1", level: "danger", title: "RC Pro expirée — Lemaire & Fils", meta: "Artisan suspendu • à régulariser", cta: "Ouvrir fiche" },
  { id: "AL-2", level: "warning", title: "Lead PJ-204812 sans réponse depuis 4 jours", meta: "Camille R. • Paris 11e", cta: "Relancer" },
  { id: "AL-3", level: "warning", title: "2 documents manquants — JM Parqueteur", meta: "KBIS + RC Pro à téléverser", cta: "Demander" },
  { id: "AL-4", level: "info", title: "Pic de demandes Île-de-France", meta: "+38 % vs semaine dernière", cta: "Voir détail" },
  { id: "AL-5", level: "danger", title: "Paiement échoué — Atelier Chêne & Co", meta: "Recharge 25 crédits • réessai prévu", cta: "Détail" },
];

// 14 days
export const TRAFFIC = [
  { d: "J-13", visites: 412, demandes: 18 },
  { d: "J-12", visites: 488, demandes: 22 },
  { d: "J-11", visites: 520, demandes: 25 },
  { d: "J-10", visites: 467, demandes: 19 },
  { d: "J-9", visites: 612, demandes: 31 },
  { d: "J-8", visites: 588, demandes: 28 },
  { d: "J-7", visites: 705, demandes: 36 },
  { d: "J-6", visites: 644, demandes: 30 },
  { d: "J-5", visites: 712, demandes: 38 },
  { d: "J-4", visites: 803, demandes: 42 },
  { d: "J-3", visites: 768, demandes: 39 },
  { d: "J-2", visites: 821, demandes: 45 },
  { d: "J-1", visites: 880, demandes: 48 },
  { d: "Auj.", visites: 612, demandes: 33 },
];

export const REVENUS = [
  { mois: "Juin", revenu: 4280 },
  { mois: "Juil.", revenu: 5120 },
  { mois: "Août", revenu: 4870 },
  { mois: "Sept.", revenu: 6240 },
  { mois: "Oct.", revenu: 7320 },
  { mois: "Nov.", revenu: 8410 },
  { mois: "Déc.", revenu: 9180 },
];

export const TICKETS = [
  { id: "T-318", sujet: "Photos non envoyées avec l'estimation", auteur: "Camille R. (client)", priorite: "Haute", statut: "Ouvert", date: "il y a 22 min", assignee: "Léa (support)" },
  { id: "T-317", sujet: "Crédit non débité après acceptation", auteur: "Antoine D. (artisan)", priorite: "Moyenne", statut: "En cours", date: "il y a 1 h", assignee: "Marc (technique)" },
  { id: "T-316", sujet: "Erreur lors du téléversement du KBIS", auteur: "JM Parqueteur", priorite: "Moyenne", statut: "En cours", date: "il y a 4 h", assignee: "Léa (support)" },
  { id: "T-315", sujet: "Demande de remboursement crédit", auteur: "Maison Vermeille", priorite: "Haute", statut: "À traiter", date: "hier", assignee: "—" },
  { id: "T-314", sujet: "Question facturation décembre", auteur: "Chêne & Co", priorite: "Basse", statut: "Résolu", date: "il y a 2 j", assignee: "Marc (technique)" },
];

export const MODERATION = [
  { id: "M-88", type: "Lead contesté", cible: "Lead PJ-204688 • JM Parqueteur", motif: "Client injoignable après 5 appels", date: "il y a 1 j", action: "Remboursement crédit demandé" },
  { id: "M-87", type: "Signalement client", cible: "Camille R.", motif: "Photos non conformes au projet décrit", date: "il y a 2 j", action: "À examiner" },
  { id: "M-86", type: "Artisan injoignable", cible: "Lemaire & Fils", motif: "Pas de réponse depuis 9 jours", date: "il y a 3 j", action: "Suspendu" },
  { id: "M-85", type: "Litige", cible: "Lead PJ-204512", motif: "Devis hors estimation initiale (+45 %)", date: "il y a 5 j", action: "Médiation en cours" },
];

export const LOGS = [
  { id: "LG-9821", quand: "14:32", quoi: "Lead PJ-204812 créé", qui: "Estimation site", canal: "Création", niveau: "info" },
  { id: "LG-9820", quand: "14:18", quoi: "PDF d'estimation généré (PJ-204798)", qui: "Système", canal: "Document", niveau: "info" },
  { id: "LG-9819", quand: "14:02", quoi: "Email envoyé à camille.r@…", qui: "Système", canal: "Email", niveau: "info" },
  { id: "LG-9818", quand: "13:47", quoi: "Crédit débité (1) — Antoine D.", qui: "Antoine D.", canal: "Crédits", niveau: "info" },
  { id: "LG-9817", quand: "13:31", quoi: "Échec d'envoi email — Lemaire & Fils", qui: "Système", canal: "Email", niveau: "alerte" },
  { id: "LG-9816", quand: "13:10", quoi: "RC Pro téléversée — Pauline G.", qui: "Pauline G.", canal: "Document", niveau: "info" },
  { id: "LG-9815", quand: "12:58", quoi: "Connexion admin", qui: "Vous", canal: "Sécurité", niveau: "info" },
  { id: "LG-9814", quand: "12:41", quoi: "Tentative de connexion échouée", qui: "IP 92.184.x.x", canal: "Sécurité", niveau: "alerte" },
];

export const NOTIFICATIONS = [
  { id: "N-1", icon: "shield", titre: "RC Pro expire dans 14 jours", detail: "Maison Vermeille — pensez à demander le renouvellement.", quand: "il y a 1 h", urgence: "haute" },
  { id: "N-2", icon: "clock", titre: "Lead PJ-204812 sans réponse", detail: "Camille R. attend un retour depuis 4 jours.", quand: "il y a 2 h", urgence: "haute" },
  { id: "N-3", icon: "user", titre: "Artisan sans activité 30 j", detail: "Lemaire & Fils — 0 lead accepté.", quand: "hier", urgence: "moyenne" },
  { id: "N-4", icon: "mail", titre: "Email non délivré", detail: "Bounce sur lemaire@…", quand: "hier", urgence: "moyenne" },
  { id: "N-5", icon: "card", titre: "Paiement échoué", detail: "Recharge 25 crédits — Atelier Chêne & Co.", quand: "il y a 2 j", urgence: "haute" },
  { id: "N-6", icon: "file", titre: "KBIS manquant", detail: "JM Parqueteur — relance automatique envoyée.", quand: "il y a 2 j", urgence: "moyenne" },
  { id: "N-7", icon: "bolt", titre: "Nouvelle demande urgente", detail: "Théo S. — Paris 17e — pose parquet 72 m².", quand: "il y a 3 h", urgence: "haute" },
];

export const FORMULES = [
  { nom: "Gratuit", prix: "0 €/mois", credits: "3 crédits offerts", artisans: 42, couleur: "bg-muted text-foreground" },
  { nom: "Essentiel", prix: "49 €/mois", credits: "10 crédits inclus", artisans: 28, couleur: "bg-brand-orange/10 text-brand-orange" },
  { nom: "Premium", prix: "129 €/mois", credits: "30 crédits inclus + priorité", artisans: 17, couleur: "bg-foreground text-background" },
];

export const RECHARGES = [
  { pack: "10 crédits", prix: "60 €" },
  { pack: "25 crédits", prix: "140 €" },
  { pack: "60 crédits", prix: "300 €" },
];

export const FACTURES = [
  { id: "F-2026-0142", date: "12/05/2026", client: "Maison Vermeille", montant: "129 €", statut: "Payée" },
  { id: "F-2026-0141", date: "12/05/2026", client: "Delmas Parqueteur", montant: "129 €", statut: "Payée" },
  { id: "F-2026-0140", date: "11/05/2026", client: "Atelier Chêne & Co", montant: "49 €", statut: "Échec" },
  { id: "F-2026-0139", date: "10/05/2026", client: "Garnier Bois", montant: "140 €", statut: "Payée" },
  { id: "F-2026-0138", date: "09/05/2026", client: "JM Parqueteur", montant: "49 €", statut: "Payée" },
];
