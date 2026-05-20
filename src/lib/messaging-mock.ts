/**
 * Mock conversations client ↔ artisan.
 * Shape pensée pour migrer facilement vers Supabase (table `conversations`
 * + `messages` + realtime channel scoping par `project_id`).
 */

export type Author = "client" | "artisan" | "system";
export type MsgKind = "text" | "file" | "rdv" | "quote";

export type ChatMessage = {
  id: string;
  author: Author;
  kind: MsgKind;
  body: string;
  at: string; // ISO
  read: boolean;
  attachment?: { name: string; sizeKb: number; type: "pdf" | "img" };
  rdv?: { title: string; start: string; end: string; location?: string };
};

export type Conversation = {
  id: string;
  project_ref: string;
  project_label: string;
  /** Vu côté client : l'artisan. Vu côté artisan : le client. */
  client: { name: string; initials: string; ville: string };
  artisan: { name: string; raison_sociale: string; initials: string; verified: boolean };
  status: "active" | "rdv_planifie" | "devis_envoye" | "archive";
  unread_client: number;
  unread_artisan: number;
  last_at: string;
  messages: ChatMessage[];
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c-2479",
    project_ref: "PJ-002479",
    project_label: "Reprise locale + huile dure · 12 m²",
    client: { name: "Camille Roussel", initials: "CR", ville: "Lyon 3e" },
    artisan: {
      name: "Julien Marchand",
      raison_sociale: "Atelier du Parquet Lyonnais",
      initials: "JM",
      verified: true,
    },
    status: "rdv_planifie",
    unread_client: 1,
    unread_artisan: 0,
    last_at: hoursAgo(1),
    messages: [
      {
        id: "m1",
        author: "system",
        kind: "text",
        body: "Match accepté — vous pouvez échanger librement.",
        at: daysAgo(1),
        read: true,
      },
      {
        id: "m2",
        author: "artisan",
        kind: "text",
        body: "Bonjour Camille, merci pour votre confiance. Quelques photos de la zone abîmée seraient parfaites pour préparer la visite.",
        at: daysAgo(1),
        read: true,
      },
      {
        id: "m3",
        author: "client",
        kind: "file",
        body: "Voici 3 photos prises ce matin.",
        at: hoursAgo(20),
        read: true,
        attachment: { name: "parquet-salon.jpg", sizeKb: 1840, type: "img" },
      },
      {
        id: "m4",
        author: "artisan",
        kind: "rdv",
        body: "Je vous propose un passage pour diagnostic.",
        at: hoursAgo(4),
        read: true,
        rdv: {
          title: "Visite technique — Parqueto",
          start: inDays(2),
          end: inDays(2.05),
          location: "12 rue Sébastien Gryphe, Lyon 3e",
        },
      },
      {
        id: "m5",
        author: "artisan",
        kind: "text",
        body: "Ajoutez-le à votre agenda en un clic 👆",
        at: hoursAgo(1),
        read: false,
      },
    ],
  },
  {
    id: "c-2471",
    project_ref: "PJ-002471",
    project_label: "Point de Hongrie · 38 m² · huile naturelle",
    client: { name: "Famille Dupont", initials: "FD", ville: "Caluire" },
    artisan: {
      name: "Julien Marchand",
      raison_sociale: "Atelier du Parquet Lyonnais",
      initials: "JM",
      verified: true,
    },
    status: "devis_envoye",
    unread_client: 0,
    unread_artisan: 2,
    last_at: hoursAgo(6),
    messages: [
      {
        id: "m1",
        author: "artisan",
        kind: "quote",
        body: "Devis n°2471-A — 5 480 € TTC, valable 30 jours.",
        at: daysAgo(2),
        read: true,
        attachment: { name: "devis-2471-A.pdf", sizeKb: 220, type: "pdf" },
      },
      {
        id: "m2",
        author: "client",
        kind: "text",
        body: "Merci, on regarde en famille ce week-end et on revient vers vous lundi.",
        at: daysAgo(2),
        read: true,
      },
      {
        id: "m3",
        author: "client",
        kind: "text",
        body: "Petite question sur les plinthes : neuves ou récupérées ?",
        at: hoursAgo(6),
        read: false,
      },
    ],
  },
  {
    id: "c-2460",
    project_ref: "PJ-002460",
    project_label: "Vitrification · 24 m²",
    client: { name: "Léa Thibault", initials: "LT", ville: "Lyon 2e" },
    artisan: {
      name: "Julien Marchand",
      raison_sociale: "Atelier du Parquet Lyonnais",
      initials: "JM",
      verified: true,
    },
    status: "archive",
    unread_client: 0,
    unread_artisan: 0,
    last_at: daysAgo(16),
    messages: [
      {
        id: "m1",
        author: "system",
        kind: "text",
        body: "Conversation clôturée — projet archivé.",
        at: daysAgo(16),
        read: true,
      },
    ],
  },
];
