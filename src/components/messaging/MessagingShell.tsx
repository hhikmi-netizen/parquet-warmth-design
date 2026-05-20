import { useMemo, useState } from "react";
import {
  Search,
  Paperclip,
  Send,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  CalendarClock,
  CheckCheck,
  Phone,
  ChevronLeft,
  Sparkles,
  Archive,
  CircleDot,
} from "lucide-react";
import { MOCK_CONVERSATIONS, type Conversation, type ChatMessage } from "@/lib/messaging-mock";
import { AddToCalendar } from "@/components/calendar/AddToCalendar";

type Viewer = "client" | "artisan";

interface Props {
  viewer: Viewer;
  /** Force ouvrir une conversation au montage (deep-link). */
  initialConversationId?: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const diff = (today.getTime() - d.getTime()) / 86_400_000;
  if (diff < 7) return d.toLocaleDateString("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function statusLabel(c: Conversation) {
  switch (c.status) {
    case "rdv_planifie":
      return { label: "RDV planifié", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    case "devis_envoye":
      return { label: "Devis envoyé", tone: "bg-brand-orange/10 text-brand-orange-deep ring-brand-orange/30" };
    case "archive":
      return { label: "Archivée", tone: "bg-muted text-muted-foreground ring-border" };
    default:
      return { label: "Active", tone: "bg-blue-50 text-blue-700 ring-blue-200" };
  }
}

export function MessagingShell({ viewer, initialConversationId }: Props) {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversationId ?? conversations[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const other = viewer === "client" ? c.artisan.raison_sociale : c.client.name;
      return (
        other.toLowerCase().includes(q) ||
        c.project_label.toLowerCase().includes(q) ||
        c.project_ref.toLowerCase().includes(q)
      );
    });
  }, [conversations, query, viewer]);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active
    ? [...active.messages, ...(localMessages[active.id] ?? [])]
    : [];

  const send = () => {
    if (!active || !draft.trim()) return;
    const msg: ChatMessage = {
      id: `local-${Date.now()}`,
      author: viewer,
      kind: "text",
      body: draft.trim(),
      at: new Date().toISOString(),
      read: false,
    };
    setLocalMessages((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
    setDraft("");
  };

  return (
    <div className="grid h-[calc(100vh-180px)] min-h-[560px] grid-cols-1 overflow-hidden rounded-3xl border border-border bg-background shadow-soft md:grid-cols-[320px_1fr] lg:grid-cols-[340px_1fr_280px]">
      {/* === Liste conversations === */}
      <aside
        className={`flex flex-col border-r border-border ${
          active ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-border p-4">
          <h2 className="font-serif text-lg leading-tight">Messagerie</h2>
          <p className="text-xs text-muted-foreground">
            {viewer === "client"
              ? "Échangez avec votre artisan vérifié."
              : "Conversations actives avec vos clients."}
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Aucune conversation.
            </div>
          ) : (
            filtered.map((c) => {
              const other = viewer === "client" ? c.artisan : c.client;
              const otherLabel = viewer === "client" ? c.artisan.raison_sociale : c.client.name;
              const unread = viewer === "client" ? c.unread_client : c.unread_artisan;
              const isActive = c.id === activeId;
              const last = c.messages[c.messages.length - 1];
              const st = statusLabel(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-accent/40 ${
                    isActive ? "bg-brand-cream/40" : ""
                  }`}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange-deep">
                    {other.initials}
                    {unread > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-primary-foreground">
                        {unread}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{otherLabel}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatTime(c.last_at)}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {c.project_ref} · {c.project_label}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-foreground/75">
                        {last?.kind === "rdv"
                          ? "📅 Proposition de RDV"
                          : last?.kind === "quote"
                          ? "📄 Devis envoyé"
                          : last?.kind === "file"
                          ? "📎 Pièce jointe"
                          : last?.body ?? ""}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ring-1 ${st.tone}`}
                      >
                        {st.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* === Thread === */}
      <section className={`flex flex-col ${active ? "flex" : "hidden md:flex"}`}>
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Sélectionnez une conversation.
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="md:hidden -ml-1 rounded-full p-1.5 hover:bg-accent"
                aria-label="Retour"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange-deep">
                {viewer === "client" ? active.artisan.initials : active.client.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">
                    {viewer === "client" ? active.artisan.raison_sociale : active.client.name}
                  </p>
                  {viewer === "client" && active.artisan.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck className="h-3 w-3" /> Vérifié
                    </span>
                  )}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
                  {active.project_ref} · {active.project_label}
                </p>
              </div>
              <button
                type="button"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent"
                aria-label="Appeler"
                title="Appeler (disponible après acceptation du match)"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent"
                aria-label="Archiver"
                title="Archiver"
              >
                <Archive className="h-4 w-4" />
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-brand-cream/20 to-background px-4 py-4">
              {messages.map((m) => (
                <Bubble key={m.id} message={m} viewer={viewer} />
              ))}
            </div>

            {/* Composer */}
            <footer className="border-t border-border bg-background p-3">
              {viewer === "client" && (
                <p className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-brand-orange" />
                  Échangez en sécurité. Pas de paiement hors plateforme.
                </p>
              )}
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2 focus-within:border-brand-orange/40 focus-within:bg-background">
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent"
                  aria-label="Joindre un fichier"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Écrire un message…"
                  className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim()}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-brand-orange px-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </div>
            </footer>
          </>
        )}
      </section>

      {/* === Side panel (desktop only) === */}
      {active && (
        <aside className="hidden border-l border-border bg-muted/20 p-4 lg:block">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Projet
              </p>
              <p className="mt-1 text-sm font-semibold">{active.project_ref}</p>
              <p className="text-xs text-muted-foreground">{active.project_label}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {viewer === "client" ? "Votre artisan" : "Votre client"}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange-deep">
                  {viewer === "client" ? active.artisan.initials : active.client.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {viewer === "client" ? active.artisan.raison_sociale : active.client.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {viewer === "client" ? active.artisan.name : active.client.ville}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-brand-orange/40 bg-brand-orange/5 p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange-deep">
                <Sparkles className="h-3 w-3" /> Astuces
              </p>
              <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                {viewer === "client" ? (
                  <>
                    <li>· Partagez 2–3 photos en lumière naturelle.</li>
                    <li>· Précisez vos contraintes d'accès.</li>
                    <li>· Tout RDV proposé est synchronisable avec votre agenda.</li>
                  </>
                ) : (
                  <>
                    <li>· Répondez dans les 24 h pour booster votre score.</li>
                    <li>· Proposez un créneau de visite dès le 1er échange.</li>
                    <li>· Joignez vos références chantiers similaires.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function Bubble({ message, viewer }: { message: ChatMessage; viewer: Viewer }) {
  if (message.author === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
          <CircleDot className="mr-1 inline h-3 w-3" />
          {message.body}
        </span>
      </div>
    );
  }

  const mine = message.author === viewer;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] sm:max-w-[70%] ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
            mine
              ? "rounded-br-md bg-brand-orange text-primary-foreground"
              : "rounded-bl-md bg-background ring-1 ring-border"
          }`}
        >
          {message.kind === "rdv" && message.rdv ? (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-90">
                <CalendarClock className="h-3.5 w-3.5" /> Rendez-vous proposé
              </p>
              <p className="font-semibold">{message.rdv.title}</p>
              <p className="text-xs opacity-90">
                {new Date(message.rdv.start).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {message.rdv.location && (
                <p className="text-xs opacity-80">📍 {message.rdv.location}</p>
              )}
              <div className="pt-1">
                <AddToCalendar
                  variant={mine ? "ghost" : "outline"}
                  label="Ajouter à mon agenda"
                  event={{
                    title: message.rdv.title,
                    start: message.rdv.start,
                    end: message.rdv.end,
                    location: message.rdv.location,
                    description: message.body,
                  }}
                  icsFilename="rdv-parqueto.ics"
                />
              </div>
            </div>
          ) : message.kind === "quote" && message.attachment ? (
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  mine ? "bg-white/15" : "bg-brand-cream"
                }`}
              >
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{message.attachment.name}</p>
                <p className="text-[11px] opacity-80">PDF · {message.attachment.sizeKb} Ko</p>
                <p className="mt-1 text-xs">{message.body}</p>
              </div>
            </div>
          ) : message.kind === "file" && message.attachment ? (
            <div className="space-y-2">
              <p className="text-sm">{message.body}</p>
              <div
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs ${
                  mine ? "bg-white/15" : "bg-muted"
                }`}
              >
                {message.attachment.type === "img" ? (
                  <ImageIcon className="h-4 w-4 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{message.attachment.name}</span>
                <span className="opacity-70">· {Math.round(message.attachment.sizeKb / 10) / 100} Mo</span>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
          )}
        </div>
        <span className={`flex items-center gap-1 text-[10px] text-muted-foreground ${mine ? "pr-1" : "pl-1"}`}>
          {formatTime(message.at)}
          {mine && <CheckCheck className={`h-3 w-3 ${message.read ? "text-brand-orange" : ""}`} />}
        </span>
      </div>
    </div>
  );
}
