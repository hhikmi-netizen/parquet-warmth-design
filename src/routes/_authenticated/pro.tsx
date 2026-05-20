import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptMatch,
  declineMatch,
  getArtisanInbox,
  refundMatch,
} from "@/lib/projects.functions";
import {
  LayoutDashboard,
  Inbox,
  MapPin,
  Clock,
  Coins,
  Settings,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
  Phone,
  Mail,
  ImageIcon,
  TrendingUp,
  Calendar,
  Star,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Bell,
  RefreshCcw,
  Lock,
  AlertTriangle,
  X,
  Wrench,
} from "lucide-react";
import { MOCK_INBOX as _UNUSED_MOCK, type InboxMatch, type MatchStatus } from "@/lib/inbox-mock";
void _UNUSED_MOCK;
import { OutilsTab } from "@/components/pro/OutilsTab";
import { QuickActions } from "@/components/pro/QuickActions";
import { AddToCalendar } from "@/components/calendar/AddToCalendar";

export const Route = createFileRoute("/_authenticated/pro")({
  component: ProDashboard,
});

const STATUS_LABEL: Record<MatchStatus, string> = {
  pending: "Nouveau",
  accepted: "Accepté",
  declined: "Décliné",
  refunded: "Remboursé",
  expired: "Expiré",
};

const STATUS_CLASS: Record<MatchStatus, string> = {
  pending: "bg-emerald-100 text-emerald-700",
  accepted: "bg-amber-100 text-amber-700",
  declined: "bg-muted text-muted-foreground",
  refunded: "bg-sky-100 text-sky-700",
  expired: "bg-red-50 text-red-600",
};

type FilterKey = "tous" | MatchStatus;

function ProDashboard() {
  const [tab, setTab] = useState<"projets" | "outils" | "historique" | "zone" | "compte">("projets");
  const [filter, setFilter] = useState<FilterKey>("tous");
  const [selected, setSelected] = useState<InboxMatch | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Real backend wiring — server fns + React Query
  const fetchInbox = useServerFn(getArtisanInbox);
  const acceptFn = useServerFn(acceptMatch);
  const declineFn = useServerFn(declineMatch);
  const refundFn = useServerFn(refundMatch);
  const qc = useQueryClient();

  const { data: inbox, isLoading } = useQuery({
    queryKey: ["artisan-inbox"],
    queryFn: () => fetchInbox(),
    staleTime: 30_000,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["artisan-inbox"] });

  const acceptMutation = useMutation({
    mutationFn: (match_id: string) => acceptFn({ data: { match_id } }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Projet accepté", { description: "Crédit débité — coordonnées client débloquées." });
        invalidate();
        setSelected(null);
      } else {
        toast.error("Échec", { description: res?.error ?? "Action impossible." });
      }
    },
    onError: (e: Error) => toast.error("Erreur", { description: e.message }),
  });

  const declineMutation = useMutation({
    mutationFn: (match_id: string) => declineFn({ data: { match_id } }),
    onSuccess: () => {
      toast("Projet décliné", { description: "Aucun crédit débité." });
      invalidate();
      setSelected(null);
    },
    onError: (e: Error) => toast.error("Erreur", { description: e.message }),
  });

  const refundMutation = useMutation({
    mutationFn: ({ match_id, reason }: { match_id: string; reason: "client_injoignable" | "hors_zone" | "annulation_client" }) =>
      refundFn({ data: { match_id, reason } }),
    onSuccess: (res, vars) => {
      if (res?.success) {
        toast.success("Crédit remboursé", { description: vars.reason });
        invalidate();
        setSelected(null);
      } else {
        toast.error("Échec", { description: res?.error ?? "Action impossible." });
      }
    },
    onError: (e: Error) => toast.error("Erreur", { description: e.message }),
  });

  const filteredMatches = useMemo(() => {
    const list = (inbox?.matches ?? []) as InboxMatch[];
    return filter === "tous" ? list : list.filter((m) => m.status === filter);
  }, [filter, inbox?.matches]);

  const onAccept = (m: InboxMatch) => {
    const balance = inbox?.artisan?.credits_balance ?? 0;
    if (balance < m.project.credits_cost) {
      toast.error("Crédits insuffisants", { description: "Rechargez votre compte pour accepter ce projet." });
      return;
    }
    acceptMutation.mutate(m.match_id);
  };
  const onDecline = (m: InboxMatch) => declineMutation.mutate(m.match_id);
  const onRefund = (m: InboxMatch, reasonLabel: string) => {
    // map French label → enum
    const map: Record<string, "client_injoignable" | "hors_zone" | "annulation_client"> = {
      "Client injoignable sous 5 jours": "client_injoignable",
      "Projet hors zone d'intervention": "hors_zone",
      "Annulation du client": "annulation_client",
    };
    const reason = map[reasonLabel] ?? "client_injoignable";
    refundMutation.mutate({ match_id: m.match_id, reason });
  };

  // Loading / empty states
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream/30 text-sm text-muted-foreground">
        Chargement de votre tableau de bord…
      </div>
    );
  }

  if (!inbox?.artisan) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-2xl">Aucun profil artisan</h1>
        <p className="text-sm text-muted-foreground">
          Pour accéder au dashboard pro, créez votre profil artisan vérifié.
        </p>
        <Link
          to="/devenir-artisan/inscription"
          className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm"
        >
          Créer mon profil artisan
        </Link>
      </div>
    );
  }

  const stats = inbox.stats ?? { pending: 0, accepted: 0, refunded: 0, total: 0 };

  return (
    <div className="min-h-screen bg-brand-cream/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg">
            <span className="font-semibold">Parqueto</span>
            <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange-deep">
              Pro
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <CreditsBadge balance={inbox.artisan.credits_balance} />
            <button
              type="button"
              className="relative rounded-full border border-border bg-background p-2"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {inbox.stats.pending > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-orange" />
              )}
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"
              aria-label={inbox.artisan.representant}
            >
              {initials(inbox.artisan.representant)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-background p-2 lg:flex-col lg:gap-1">
            {[
              { k: "projets", l: "Projets reçus", i: Inbox },
              { k: "outils", l: "Atelier artisan", i: Wrench },
              { k: "historique", l: "Historique", i: LayoutDashboard },
              { k: "zone", l: "Zone d'intervention", i: MapPin },
              { k: "compte", l: "Compte & profil", i: Settings },
            ].map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setTab(t.k as typeof tab)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  tab === t.k
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <t.i className="h-4 w-4" />
                {t.l}
              </button>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4 text-sm">
            <p className="font-semibold text-brand-orange-deep">Formule Essentiel</p>
            <p className="mt-1 text-xs text-muted-foreground">
              5 crédits inclus / mois · prochaine recharge le 14 juin
            </p>
            <Link
              to="/pro/offres"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange-deep hover:underline"
            >
              Gérer ma formule <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>

        <main className="space-y-6">
          {showOnboarding && <OnboardingCard onClose={() => setShowOnboarding(false)} />}

          {tab === "projets" && (
            <>
              <QuickActions />
              <ProjectsTab
                matches={filteredMatches}
                stats={stats}
                filter={filter}
                setFilter={setFilter}
                onSelect={setSelected}
              />
            </>
          )}
          {tab === "outils" && <OutilsTab />}
          {tab === "historique" && <HistoryTab refunded={stats.refunded} />}
          {tab === "zone" && <ZoneTab />}
          {tab === "compte" && (
            <CompteTab artisanName={inbox.artisan.raison_sociale} balance={inbox.artisan.credits_balance} />
          )}
        </main>
      </div>

      {selected && (
        <ProjectDrawer
          match={selected}
          balance={inbox.artisan.credits_balance}
          onClose={() => setSelected(null)}
          onAccept={onAccept}
          onDecline={onDecline}
          onRefund={onRefund}
        />
      )}
    </div>
  );
}

function recomputeStats(matches: InboxMatch[]) {
  return {
    pending: matches.filter((m) => m.status === "pending").length,
    accepted: matches.filter((m) => m.status === "accepted").length,
    refunded: matches.filter((m) => m.status === "refunded").length,
    total: matches.length,
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function CreditsBadge({ balance }: { balance: number }) {
  const low = balance <= 2;
  return (
    <div
      className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-sm sm:flex ${
        low ? "border-red-200 bg-red-50" : "border-border bg-background"
      }`}
    >
      <Coins className={`h-4 w-4 ${low ? "text-red-500" : "text-brand-orange"}`} />
      <span className="font-semibold">{balance}</span>
      <span className="text-muted-foreground">crédit{balance > 1 ? "s" : ""}</span>
      <Link
        to="/pro/facturation"
        className="ml-2 text-xs font-semibold text-brand-orange-deep hover:underline"
      >
        Facturation
      </Link>
    </div>
  );
}

function OnboardingCard({ onClose }: { onClose: () => void }) {
  const steps = [
    { t: "Compléter votre profil artisan", done: true },
    { t: "Définir votre zone d'intervention", done: true },
    { t: "Ajouter 3 réalisations en photo", done: false },
    { t: "Accepter votre 1er projet offert", done: false },
  ];
  const completed = steps.filter((s) => s.done).length;

  return (
    <div className="rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-cream to-background p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-deep">
            <Sparkles className="h-3 w-3" /> Bienvenue sur Parqueto Pro
          </span>
          <h2 className="mt-3 font-serif text-2xl">Plus que quelques étapes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Activez vos 3 projets offerts en finalisant votre profil.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-brand-orange transition-all"
            style={{ width: `${(completed / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {completed}/{steps.length}
        </span>
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {steps.map((s) => (
          <li
            key={s.t}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
          >
            {s.done ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border-2 border-border" />
            )}
            <span className={s.done ? "text-muted-foreground line-through" : "text-foreground"}>
              {s.t}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-end">
        <Link
          to="/pro/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep"
        >
          Activer mon profil
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}


function ProjectsTab({
  matches,
  stats,
  filter,
  setFilter,
  onSelect,
}: {
  matches: InboxMatch[];
  stats: { pending: number; accepted: number; refunded: number; total: number };
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  onSelect: (m: InboxMatch) => void;
}) {
  const acceptanceRate =
    stats.total - stats.pending > 0
      ? Math.round((stats.accepted / (stats.total - stats.pending)) * 100)
      : 0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Nouveaux", v: stats.pending, i: Inbox, color: "text-emerald-600" },
          { l: "Acceptés", v: stats.accepted, i: CheckCircle2, color: "text-amber-600" },
          { l: "Remboursés", v: stats.refunded, i: RefreshCcw, color: "text-sky-600" },
          {
            l: "Taux d'acceptation",
            v: `${acceptanceRate}%`,
            i: TrendingUp,
            color: "text-brand-orange-deep",
          },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</span>
              <k.i className={`h-4 w-4 ${k.color}`} />
            </div>
            <p className="mt-2 font-serif text-2xl">{k.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-background">
        <InboxTabs filter={filter} setFilter={setFilter} stats={stats} />

        {matches.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">Aucun projet dans cette catégorie</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Élargissez votre zone d'intervention pour recevoir plus de propositions.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {matches.map((m) => (
              <li key={m.match_id}>
                <MatchCard match={m} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function InboxTabs({
  filter,
  setFilter,
  stats,
}: {
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  stats: { pending: number; accepted: number; refunded: number; total: number };
}) {
  const tabs: { k: FilterKey; l: string; c?: number }[] = [
    { k: "tous", l: "Tous", c: stats.total },
    { k: "pending", l: "À traiter", c: stats.pending },
    { k: "accepted", l: "Acceptés", c: stats.accepted },
    { k: "refunded", l: "Remboursés", c: stats.refunded },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
      <div>
        <h2 className="font-serif text-xl">Projets reçus</h2>
        <p className="text-xs text-muted-foreground">
          Leads exclusifs · jamais revendus à un autre artisan
        </p>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1">
        <Filter className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
        {tabs.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setFilter(t.k)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === t.k
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.l}
            {typeof t.c === "number" && (
              <span
                className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                  filter === t.k ? "bg-background/20" : "bg-muted-foreground/15"
                }`}
              >
                {t.c}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  onSelect,
}: {
  match: InboxMatch;
  onSelect: (m: InboxMatch) => void;
}) {
  const p = match.project;
  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-accent/40"
    >
      <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-cream sm:flex">
        <ImageIcon className="h-5 w-5 text-brand-orange" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">
            {p.type_pose} · {p.type_bois}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              STATUS_CLASS[match.status]
            }`}
          >
            {STATUS_LABEL[match.status]}
          </span>
          {match.status === "pending" && match.match_score >= 85 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange-deep">
              <Sparkles className="h-2.5 w-2.5" /> Match {match.match_score}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {p.reference} · {relativeTime(match.proposed_at)}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {p.ville} ({p.code_postal})
          </span>
          {p.delai_souhaite && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {p.delai_souhaite}
            </span>
          )}
          <span>
            {p.etat_sol} · {p.surface_m2} m²
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          {p.budget_min.toLocaleString("fr-FR")} – {p.budget_max.toLocaleString("fr-FR")} €
        </p>
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange-deep">
          <Coins className="h-3 w-3" /> {p.credits_cost} crédit
          {p.credits_cost > 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}

function ProjectDrawer({
  match,
  balance,
  onClose,
  onAccept,
  onDecline,
  onRefund,
}: {
  match: InboxMatch;
  balance: number;
  onClose: () => void;
  onAccept: (m: InboxMatch) => void;
  onDecline: (m: InboxMatch) => void;
  onRefund: (m: InboxMatch, reason: string) => void;
}) {
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const defaultRdvDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }, []);
  const [rdvDate, setRdvDate] = useState(defaultRdvDate);
  const [rdvTime, setRdvTime] = useState("10:00");
  const p = match.project;
  const unlocked = match.status === "accepted";
  const isPending = match.status === "pending";

  const rdvStart = useMemo(() => {
    const [y, mo, d] = rdvDate.split("-").map(Number);
    const [h, mi] = rdvTime.split(":").map(Number);
    return new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 10, mi ?? 0);
  }, [rdvDate, rdvTime]);
  const rdvEnd = useMemo(() => new Date(rdvStart.getTime() + 60 * 60 * 1000), [rdvStart]);

  return (
    <>
      <div className="fixed inset-0 z-40 flex">
        <div
          className="flex-1 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Fermer"
        />
        <aside className="w-full max-w-lg overflow-y-auto bg-background shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
            <div>
              <p className="text-xs text-muted-foreground">{p.reference}</p>
              <h3 className="font-serif text-lg">
                {p.type_pose} · {p.type_bois}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_CLASS[match.status]
                }`}
              >
                {STATUS_LABEL[match.status]}
              </span>
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Expire {relativeTime(match.expires_at)}
                </span>
              )}
            </div>

            <dl className="grid gap-3 text-sm">
              <Row
                icon={MapPin}
                label="Localisation"
                value={`${p.ville} (${p.code_postal})`}
              />
              {p.delai_souhaite && (
                <Row icon={Clock} label="Délai souhaité" value={p.delai_souhaite} />
              )}
              <Row
                icon={LayoutDashboard}
                label="Type de projet"
                value={`${p.type_pose} · ${p.type_bois} · ${p.surface_m2} m²`}
              />
              <Row icon={Sparkles} label="État du sol" value={p.etat_sol} />
              <Row
                icon={TrendingUp}
                label="Budget estimé client"
                value={`${p.budget_min.toLocaleString("fr-FR")} – ${p.budget_max.toLocaleString(
                  "fr-FR",
                )} €`}
              />
            </dl>

            {p.description && (
              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description du client
                </p>
                <p className="mt-2 text-foreground">{p.description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Coordonnées client</p>
                {!unlocked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange-deep">
                    <Lock className="h-3 w-3" /> {p.credits_cost} crédit
                    {p.credits_cost > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {unlocked && p.client_email ? (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="font-medium">{p.client_name}</p>
                  {p.client_phone && (
                    <a
                      href={`tel:${p.client_phone}`}
                      className="flex items-center gap-2 text-brand-orange-deep hover:underline"
                    >
                      <Phone className="h-4 w-4" /> {p.client_phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${p.client_email}`}
                    className="flex items-center gap-2 text-brand-orange-deep hover:underline"
                  >
                    <Mail className="h-4 w-4" /> {p.client_email}
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Acceptez le projet pour débloquer les coordonnées et contacter le
                  client en direct.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-800">
              <ShieldCheck className="mb-1 inline h-4 w-4" /> Lead exclusif. Si le client
              est injoignable sous 5 jours ouvrés ou hors zone, votre crédit est
              automatiquement remboursé.
            </div>

            {isPending && (
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAcceptOpen(true)}
                  className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
                >
                  Accepter ({p.credits_cost} crédit{p.credits_cost > 1 ? "s" : ""})
                </button>
                <button
                  type="button"
                  onClick={() => onDecline(match)}
                  className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-accent"
                >
                  Décliner
                </button>
              </div>
            )}

            {unlocked && (
              <div className="space-y-3">
                <Link
                  to="/devis"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
                >
                  Créer un devis express <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setRefundOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <RefreshCcw className="h-3.5 w-3.5" /> Demander un remboursement
                </button>
              </div>
            )}

            {match.status === "declined" && (
              <p className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                <XCircle className="mb-1 inline h-4 w-4" /> Projet décliné le{" "}
                {match.decided_at ? formatDate(match.decided_at) : "—"}. Aucun crédit
                débité.
              </p>
            )}
            {match.status === "refunded" && (
              <p className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 text-xs text-sky-800">
                <RefreshCcw className="mb-1 inline h-4 w-4" /> Crédit remboursé le{" "}
                {match.decided_at ? formatDate(match.decided_at) : "—"}.
              </p>
            )}
          </div>
        </aside>
      </div>

      {acceptOpen && (
        <AcceptModal
          match={match}
          balance={balance}
          onClose={() => setAcceptOpen(false)}
          onConfirm={() => {
            setAcceptOpen(false);
            onAccept(match);
          }}
        />
      )}
      {refundOpen && (
        <RefundModal
          onClose={() => setRefundOpen(false)}
          onConfirm={(reason) => {
            setRefundOpen(false);
            onRefund(match, reason);
          }}
        />
      )}
    </>
  );
}

function AcceptModal({
  match,
  balance,
  onClose,
  onConfirm,
}: {
  match: InboxMatch;
  balance: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const cost = match.project.credits_cost;
  const insufficient = balance < cost;
  const after = Math.max(0, balance - cost);

  return (
    <ModalShell onClose={onClose} title="Confirmer l'acceptation">
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          En acceptant ce projet, <strong className="text-foreground">{cost} crédit
          {cost > 1 ? "s" : ""}</strong> sera débité de votre compte et les coordonnées
          du client vous seront révélées immédiatement.
        </p>
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Solde actuel</span>
            <span className="font-semibold">{balance} crédits</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-muted-foreground">Après acceptation</span>
            <span className={`font-semibold ${insufficient ? "text-red-600" : ""}`}>
              {after} crédit{after > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {insufficient ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertTriangle className="mb-1 inline h-4 w-4" /> Crédits insuffisants.
            Rechargez votre compte pour accepter ce projet.
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            <ShieldCheck className="mb-0.5 inline h-3.5 w-3.5 text-emerald-600" /> Si
            le client est injoignable sous 5 jours ou hors zone, le crédit est
            automatiquement remboursé.
          </p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
          >
            Annuler
          </button>
          {insufficient ? (
            <Link
              to="/pro/offres"
              className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Recharger
            </Link>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Confirmer & débiter
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function RefundModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const reasons = [
    {
      k: "client_injoignable",
      l: "Client injoignable sous 5 jours",
      d: "Aucune réponse à vos appels et e-mails après 3 tentatives.",
    },
    {
      k: "hors_zone",
      l: "Projet hors zone d'intervention",
      d: "Adresse réelle hors de votre rayon malgré le code postal.",
    },
    {
      k: "annulation_client",
      l: "Annulation du client",
      d: "Le client a abandonné le projet ou choisi de reporter.",
    },
  ];
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <ModalShell onClose={onClose} title="Demander un remboursement">
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Sélectionnez le motif. Sous 24 h ouvrées, votre crédit est recrédité si la
          demande est éligible.
        </p>
        <ul className="space-y-2">
          {reasons.map((r) => (
            <li key={r.k}>
              <button
                type="button"
                onClick={() => setPicked(r.l)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  picked === r.l
                    ? "border-brand-orange bg-brand-orange/5"
                    : "border-border bg-background hover:bg-accent/40"
                }`}
              >
                <p className="font-semibold">{r.l}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.d}</p>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!picked}
            onClick={() => picked && onConfirm(picked)}
            className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep disabled:opacity-50"
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-brand-orange" />
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    </div>
  );
}

function HistoryTab({ refunded }: { refunded: number }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h2 className="font-serif text-xl">Historique & performance</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Suivi de vos projets sur les 12 derniers mois.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Projets signés", v: "23" },
          { l: "Chiffre généré", v: "48 200 €" },
          { l: "Note moyenne", v: "4,9 / 5", i: Star },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-muted/30 p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</p>
            <p className="mt-2 font-serif text-2xl">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-brand-cream/40 p-4 text-sm">
        <RefreshCcw className="h-4 w-4 text-brand-orange" />
        <p>
          {refunded} crédit{refunded > 1 ? "s" : ""} remboursé
          {refunded > 1 ? "s" : ""} ce mois-ci. Aucune démarche à faire.
        </p>
      </div>
    </div>
  );
}

function ZoneTab() {
  return (
    <div className="rounded-3xl border border-border bg-background p-8">
      <h2 className="font-serif text-xl">Zone d'intervention</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous recevez uniquement les projets situés dans votre rayon.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-brand-cream to-muted flex items-center justify-center text-muted-foreground">
          <MapPin className="h-8 w-8 text-brand-orange" />
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Ville de référence
            </label>
            <p className="mt-1 font-medium">Lyon 6e — 69006</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Rayon d'intervention
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={80}
                defaultValue={25}
                className="flex-1 accent-[color:var(--brand-orange)]"
              />
              <span className="w-16 text-right font-semibold">25 km</span>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Types de prestations
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Pose neuve", "Rénovation", "Ponçage", "Vitrification", "Pose chevron", "Conseil"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
          >
            Mettre à jour ma zone
          </button>
        </div>
      </div>
    </div>
  );
}

function CompteTab({ artisanName, balance }: { artisanName: string; balance: number }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-background p-8">
        <h2 className="font-serif text-xl">Profil artisan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont visibles par les clients lorsque vous acceptez un projet.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Raison sociale" value={artisanName} />
          <Field label="SIRET" value="812 345 678 00012" />
          <Field label="Téléphone" value="06 12 34 56 78" />
          <Field label="Email" value="contact@atelier-parquet.fr" />
          <Field label="Années d'expérience" value="14 ans" />
          <Field label="Assurance décennale" value="MAAF Pro · valide jusqu'au 12/2026" />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-background p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl">Abonnement & crédits</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Formule Essentiel · 29 € / mois · sans engagement
            </p>
          </div>
          <Link
            to="/pro/offres"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
          >
            Changer de formule <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Stat label="Crédits disponibles" value={String(balance)} />
          <Stat label="Inclus chaque mois" value="5" />
          <Stat label="Prochaine recharge" value="14 juin" />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-2xl">{value}</p>
    </div>
  );
}

// --- Helpers ---

function relativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const future = diffMs > 0;
  const minutes = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  if (minutes < 60) {
    return future ? `dans ${minutes} min` : `il y a ${minutes} min`;
  }
  if (hours < 24) {
    return future ? `dans ${hours} h` : `il y a ${hours} h`;
  }
  return future ? `dans ${days} j` : `il y a ${days} j`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
