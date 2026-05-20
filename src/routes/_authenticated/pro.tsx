import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/pro")({
  component: ProDashboard,
});

type ProjectStatus = "nouveau" | "accepte" | "en_cours" | "termine" | "refuse";

type Project = {
  id: string;
  title: string;
  city: string;
  distanceKm: number;
  type: string;
  surface: number;
  delay: string;
  budgetLow: number;
  budgetHigh: number;
  credits: 1 | 2 | 3;
  status: ProjectStatus;
  receivedAt: string;
  photos: number;
  client?: { name: string; phone: string; email: string };
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "PRJ-2486",
    title: "Rénovation parquet massif chêne",
    city: "Lyon 6e",
    distanceKm: 4.2,
    type: "Ponçage + vitrification",
    surface: 42,
    delay: "Sous 4 semaines",
    budgetLow: 2100,
    budgetHigh: 2800,
    credits: 2,
    status: "nouveau",
    receivedAt: "Il y a 2 h",
    photos: 5,
  },
  {
    id: "PRJ-2484",
    title: "Pose parquet flottant appartement",
    city: "Villeurbanne",
    distanceKm: 8.1,
    type: "Pose flottante chêne contrecollé",
    surface: 68,
    delay: "Mai 2026",
    budgetLow: 3400,
    budgetHigh: 4200,
    credits: 3,
    status: "nouveau",
    receivedAt: "Il y a 5 h",
    photos: 8,
  },
  {
    id: "PRJ-2479",
    title: "Réparation lames abîmées",
    city: "Lyon 3e",
    distanceKm: 2.6,
    type: "Reprise locale + huile",
    surface: 12,
    delay: "Dès que possible",
    budgetLow: 450,
    budgetHigh: 700,
    credits: 1,
    status: "accepte",
    receivedAt: "Hier",
    photos: 3,
    client: { name: "Camille R.", phone: "06 12 34 56 78", email: "camille.r@example.com" },
  },
  {
    id: "PRJ-2471",
    title: "Pose chevron point de Hongrie",
    city: "Caluire",
    distanceKm: 6.4,
    type: "Pose collée motif chevron",
    surface: 38,
    delay: "Juin 2026",
    budgetLow: 4800,
    budgetHigh: 6200,
    credits: 3,
    status: "en_cours",
    receivedAt: "Il y a 4 jours",
    photos: 6,
    client: { name: "Famille D.", phone: "06 98 76 54 32", email: "fam.d@example.com" },
  },
  {
    id: "PRJ-2460",
    title: "Vitrification parquet salon",
    city: "Lyon 2e",
    distanceKm: 5.0,
    type: "Vitrification mate",
    surface: 24,
    delay: "Avril 2026",
    budgetLow: 720,
    budgetHigh: 980,
    credits: 1,
    status: "termine",
    receivedAt: "Il y a 3 semaines",
    photos: 4,
    client: { name: "Léa T.", phone: "06 11 22 33 44", email: "lea.t@example.com" },
  },
];

const STATUS_LABEL: Record<ProjectStatus, string> = {
  nouveau: "Nouveau",
  accepte: "Accepté",
  en_cours: "En cours",
  termine: "Terminé",
  refuse: "Refusé",
};

const STATUS_CLASS: Record<ProjectStatus, string> = {
  nouveau: "bg-emerald-100 text-emerald-700",
  accepte: "bg-amber-100 text-amber-700",
  en_cours: "bg-sky-100 text-sky-700",
  termine: "bg-muted text-muted-foreground",
  refuse: "bg-red-50 text-red-600",
};

function ProDashboard() {
  const [tab, setTab] = useState<"projets" | "historique" | "zone" | "compte">("projets");
  const [filter, setFilter] = useState<"tous" | ProjectStatus>("tous");
  const [selected, setSelected] = useState<Project | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const projects = useMemo(
    () => (filter === "tous" ? MOCK_PROJECTS : MOCK_PROJECTS.filter((p) => p.status === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-brand-cream/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg">
            <span className="font-semibold">Parqueto</span>
            <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange-deep">
              Pro
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm sm:flex">
              <Coins className="h-4 w-4 text-brand-orange" />
              <span className="font-semibold">7</span>
              <span className="text-muted-foreground">crédits</span>
              <Link to="/pro/offres" className="ml-2 text-xs font-semibold text-brand-orange-deep hover:underline">
                Recharger
              </Link>
            </div>
            <button className="relative rounded-full border border-border bg-background p-2">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              JM
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-background p-2 lg:flex-col lg:gap-1">
            {[
              { k: "projets", l: "Projets reçus", i: Inbox },
              { k: "historique", l: "Historique", i: LayoutDashboard },
              { k: "zone", l: "Zone d'intervention", i: MapPin },
              { k: "compte", l: "Compte & profil", i: Settings },
            ].map((t) => (
              <button
                key={t.k}
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

        {/* Main */}
        <main className="space-y-6">
          {showOnboarding && (
            <OnboardingCard onClose={() => setShowOnboarding(false)} />
          )}

          {tab === "projets" && (
            <ProjectsTab
              projects={projects}
              filter={filter}
              setFilter={setFilter}
              onSelect={setSelected}
            />
          )}

          {tab === "historique" && <HistoryTab />}
          {tab === "zone" && <ZoneTab />}
          {tab === "compte" && <CompteTab />}
        </main>
      </div>

      {selected && <ProjectDrawer project={selected} onClose={() => setSelected(null)} />}
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
    </div>
  );
}

function ProjectsTab({
  projects,
  filter,
  setFilter,
  onSelect,
}: {
  projects: Project[];
  filter: "tous" | ProjectStatus;
  setFilter: (f: "tous" | ProjectStatus) => void;
  onSelect: (p: Project) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Nouveaux", v: 2, i: Inbox, color: "text-emerald-600" },
          { l: "Acceptés", v: 1, i: CheckCircle2, color: "text-amber-600" },
          { l: "En cours", v: 1, i: Calendar, color: "text-sky-600" },
          { l: "Taux d'acceptation", v: "68%", i: TrendingUp, color: "text-brand-orange-deep" },
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-serif text-xl">Projets reçus</h2>
            <p className="text-xs text-muted-foreground">
              Leads exclusifs · jamais revendus à un autre artisan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "tous" | ProjectStatus)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs"
            >
              <option value="tous">Tous les statuts</option>
              <option value="nouveau">Nouveaux</option>
              <option value="accepte">Acceptés</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminés</option>
            </select>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p)}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-accent/40"
              >
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-cream sm:flex">
                  <ImageIcon className="h-5 w-5 text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.id} · {p.receivedAt} · {p.photos} photos
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {p.city} · {p.distanceKm} km
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.delay}
                    </span>
                    <span>{p.type} · {p.surface} m²</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {p.budgetLow.toLocaleString("fr-FR")} – {p.budgetHigh.toLocaleString("fr-FR")} €
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange-deep">
                    <Coins className="h-3 w-3" /> {p.credits} crédit{p.credits > 1 ? "s" : ""}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const unlocked = project.status !== "nouveau";
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-lg overflow-y-auto bg-background shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs text-muted-foreground">{project.id}</p>
            <h3 className="font-serif text-lg">{project.title}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        <div className="space-y-6 p-6">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[project.status]}`}>
            {STATUS_LABEL[project.status]}
          </span>

          <dl className="grid gap-3 text-sm">
            <Row icon={MapPin} label="Localisation" value={`${project.city} · ${project.distanceKm} km`} />
            <Row icon={Clock} label="Délai souhaité" value={project.delay} />
            <Row icon={LayoutDashboard} label="Type de projet" value={`${project.type} · ${project.surface} m²`} />
            <Row icon={TrendingUp} label="Budget estimé client" value={`${project.budgetLow.toLocaleString("fr-FR")} – ${project.budgetHigh.toLocaleString("fr-FR")} €`} />
          </dl>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Photos du chantier
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {Array.from({ length: project.photos }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-brand-cream flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-brand-orange/50" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Coordonnées client</p>
              {!unlocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange-deep">
                  <Coins className="h-3 w-3" /> {project.credits} crédit{project.credits > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {unlocked && project.client ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="font-medium">{project.client.name}</p>
                <a href={`tel:${project.client.phone}`} className="flex items-center gap-2 text-brand-orange-deep hover:underline">
                  <Phone className="h-4 w-4" /> {project.client.phone}
                </a>
                <a href={`mailto:${project.client.email}`} className="flex items-center gap-2 text-brand-orange-deep hover:underline">
                  <Mail className="h-4 w-4" /> {project.client.email}
                </a>
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Acceptez le projet pour débloquer les coordonnées et contacter le client en direct.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-800">
            <ShieldCheck className="mb-1 inline h-4 w-4" /> Lead exclusif. Si le client est
            injoignable sous 5 jours ouvrés ou hors zone, votre crédit est automatiquement remboursé.
          </div>

          {!unlocked ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep">
                Accepter ({project.credits} crédit{project.credits > 1 ? "s" : ""})
              </button>
              <button className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-accent">
                Décliner
              </button>
            </div>
          ) : (
            <Link
              to="/devis"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Créer un devis express <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
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

function HistoryTab() {
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
        <p>2 crédits remboursés ce mois-ci (clients injoignables). Aucune démarche à faire.</p>
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
              <input type="range" min={5} max={80} defaultValue={25} className="flex-1 accent-[color:var(--brand-orange)]" />
              <span className="w-16 text-right font-semibold">25 km</span>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Types de prestations
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Pose neuve", "Rénovation", "Ponçage", "Vitrification", "Pose chevron", "Conseil"].map((t) => (
                <span key={t} className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
            Mettre à jour ma zone
          </button>
        </div>
      </div>
    </div>
  );
}

function CompteTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-background p-8">
        <h2 className="font-serif text-xl">Profil artisan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont visibles par les clients lorsque vous acceptez un projet.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Raison sociale" value="Atelier du Parquet Lyonnais" />
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
          <Stat label="Crédits disponibles" value="7" />
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
