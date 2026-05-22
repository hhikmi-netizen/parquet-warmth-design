/**
 * Mock du suivi de projet côté client.
 * Shape pensée pour migration Supabase :
 *   - table `projects` (déjà existante)
 *   - table `project_milestones` (à créer : id, project_id, key, label, status, expected_at, completed_at, note)
 *   - table `project_photos` (réutilise bucket `chantier-photos`, visibilité client si projet matched/accepted)
 *   - table `project_documents` (id, project_id, kind, label, url, size_kb, issued_at)
 *   - table `project_events` (timeline lisible : RDV, messages clés, jalons)
 */

export type MilestoneStatus = "done" | "current" | "upcoming";
export type MilestoneKey =
  | "devis"
  | "acceptation"
  | "rdv_technique"
  | "preparation"
  | "pose"
  | "finitions"
  | "reception";

export type Milestone = {
  key: MilestoneKey;
  label: string;
  description: string;
  status: MilestoneStatus;
  date: string | null; // ISO ou null si à venir
};

export type TimelinePhoto = {
  id: string;
  url: string;
  caption: string;
  phase: "avant" | "pendant" | "apres";
  taken_at: string;
};

export type ProjectDocument = {
  id: string;
  kind: "devis" | "facture" | "garantie" | "fiche_technique";
  label: string;
  size_kb: number;
  issued_at: string;
};

export type NextAppointment = {
  title: string;
  start: string; // ISO
  end: string; // ISO
  location: string;
  with: string;
} | null;

export type ClientProject = {
  id: string;
  reference: string;
  label: string;
  ville: string;
  surface_m2: number;
  type_pose: string;
  status: "matched" | "accepted" | "en_cours" | "termine";
  progress: number; // 0-100
  artisan: {
    raison_sociale: string;
    representant: string;
    initials: string;
    verified: boolean;
    note: number;
    avis: number;
    telephone: string;
  };
  milestones: Milestone[];
  next_appointment: NextAppointment;
  photos: TimelinePhoto[];
  documents: ProjectDocument[];
  unread_messages: number;
};

const daysFromNow = (d: number) =>
  new Date(Date.now() + d * 86_400_000).toISOString();

export const MOCK_CLIENT_PROJECT: ClientProject = {
  id: "p-2479",
  reference: "PJ-002479",
  label: "Reprise locale + huile dure · 12 m²",
  ville: "Lyon 3e",
  surface_m2: 12,
  type_pose: "Reprise locale + huilage",
  status: "en_cours",
  progress: 58,
  artisan: {
    raison_sociale: "Atelier du Parquet Lyonnais",
    representant: "Julien Marchand",
    initials: "JM",
    verified: true,
    note: 4.9,
    avis: 47,
    telephone: "+33 4 78 00 00 00",
  },
  milestones: [
    {
      key: "devis",
      label: "Devis envoyé",
      description: "Devis détaillé reçu et consulté.",
      status: "done",
      date: daysFromNow(-9),
    },
    {
      key: "acceptation",
      label: "Devis accepté",
      description: "Engagement confirmé, planning bloqué.",
      status: "done",
      date: daysFromNow(-7),
    },
    {
      key: "rdv_technique",
      label: "Visite technique",
      description: "Diagnostic sur place, prises de mesure.",
      status: "done",
      date: daysFromNow(-4),
    },
    {
      key: "preparation",
      label: "Préparation chantier",
      description: "Protections, commande de bois et finitions.",
      status: "current",
      date: daysFromNow(0),
    },
    {
      key: "pose",
      label: "Pose / reprise",
      description: "Intervention parquet sur le chantier.",
      status: "upcoming",
      date: daysFromNow(3),
    },
    {
      key: "finitions",
      label: "Finitions",
      description: "Ponçage, huilage et nettoyage.",
      status: "upcoming",
      date: daysFromNow(6),
    },
    {
      key: "reception",
      label: "Réception de chantier",
      description: "Visite de contrôle et signature PV.",
      status: "upcoming",
      date: daysFromNow(8),
    },
  ],
  next_appointment: {
    title: "Démarrage du chantier",
    start: daysFromNow(2),
    end: daysFromNow(2.25),
    location: "12 rue Sébastien Gryphe, 69007 Lyon",
    with: "Julien Marchand — Atelier du Parquet Lyonnais",
  },
  photos: [
    {
      id: "ph1",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70",
      caption: "État initial — zone abîmée près de la fenêtre",
      phase: "avant",
      taken_at: daysFromNow(-4),
    },
    {
      id: "ph2",
      url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=900&q=70",
      caption: "Protections posées, début de la dépose",
      phase: "pendant",
      taken_at: daysFromNow(-1),
    },
    {
      id: "ph3",
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=70",
      caption: "Ponçage en cours",
      phase: "pendant",
      taken_at: daysFromNow(0),
    },
  ],
  documents: [
    {
      id: "d1",
      kind: "devis",
      label: "Devis n°2479-A",
      size_kb: 220,
      issued_at: daysFromNow(-9),
    },
    {
      id: "d2",
      kind: "fiche_technique",
      label: "Fiche huile dure — Rubio Monocoat",
      size_kb: 480,
      issued_at: daysFromNow(-7),
    },
    {
      id: "d3",
      kind: "garantie",
      label: "Attestation décennale artisan",
      size_kb: 310,
      issued_at: daysFromNow(-9),
    },
  ],
  unread_messages: 1,
};
