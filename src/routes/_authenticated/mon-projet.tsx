import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  LogOut,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import logo from "@/assets/parqueto-logo.png";
import { useAuth } from "@/hooks/use-auth";
import { MOCK_CLIENT_PROJECT, type Milestone } from "@/lib/client-project-mock";
import { AddToCalendar } from "@/components/calendar/AddToCalendar";

export const Route = createFileRoute("/_authenticated/mon-projet")({
  component: MonProjetPage,
  head: () => ({
    meta: [
      { title: "Mon projet — Parqueto" },
      {
        name: "description",
        content:
          "Suivez l'avancement de votre chantier parquet : étapes, photos, documents et messages avec votre artisan.",
      },
    ],
  }),
});

const dateFormat = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

const dateTimeFormat = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

function MilestoneRow({ m, last }: { m: Milestone; last: boolean }) {
  const Icon =
    m.status === "done" ? CheckCircle2 : m.status === "current" ? Clock : Circle;
  const iconColor =
    m.status === "done"
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : m.status === "current"
        ? "text-brand-orange bg-brand-orange/10 border-brand-orange/30"
        : "text-muted-foreground bg-muted border-border";

  return (
    <li className="relative flex gap-4 pb-6">
      {!last && (
        <span
          aria-hidden
          className="absolute left-[18px] top-9 h-full w-px bg-border"
        />
      )}
      <span
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${iconColor}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 pt-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{m.label}</h3>
          <span className="text-xs text-muted-foreground">{dateFormat(m.date)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {m.description}
        </p>
        {m.status === "current" && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-orange-deep">
            En cours
          </span>
        )}
      </div>
    </li>
  );
}

function MonProjetPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const p = MOCK_CLIENT_PROJECT;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto" className="h-9 w-auto sm:h-10" />
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/historique"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Mon espace
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 font-medium transition hover:bg-accent"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero projet */}
        <div className="rounded-3xl border border-border bg-gradient-to-br from-brand-cream/60 via-background to-background p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Suivi de projet · {p.reference}
              </p>
              <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                {p.label}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {p.ville} · {p.surface_m2} m² · {p.type_pose}
              </p>

              <div className="mt-6 max-w-md">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Avancement</span>
                  <span className="font-semibold text-foreground">{p.progress}%</span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={p.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-orange-deep transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Artisan */}
            <div className="w-full max-w-xs rounded-2xl border border-border bg-background p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 font-semibold text-brand-orange-deep">
                  {p.artisan.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.artisan.representant}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.artisan.raison_sociale}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                {p.artisan.verified && (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Vérifié
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                  <span className="font-semibold">{p.artisan.note}</span>
                  <span className="text-muted-foreground">({p.artisan.avis})</span>
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/messages"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Écrire
                  {p.unread_messages > 0 && (
                    <span className="rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold">
                      {p.unread_messages}
                    </span>
                  )}
                </Link>
                <a
                  href={`tel:${p.artisan.telephone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-accent"
                >
                  <Phone className="h-3.5 w-3.5" /> Appeler
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Prochain RDV */}
        {p.next_appointment && (
          <div className="mt-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange-deep">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange-deep">
                    Prochain rendez-vous
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-foreground">
                    {p.next_appointment.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dateTimeFormat(p.next_appointment.start)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {p.next_appointment.location}
                  </p>
                </div>
              </div>
              <AddToCalendar
                title={p.next_appointment.title}
                start={p.next_appointment.start}
                end={p.next_appointment.end}
                location={p.next_appointment.location}
                description={`Avec ${p.next_appointment.with}`}
              />
            </div>
          </div>
        )}

        {/* Grille principale */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl">Étapes du projet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Un parcours clair, validé étape par étape.
              </p>
              <ol className="mt-8">
                {p.milestones.map((m, i) => (
                  <MilestoneRow
                    key={m.key}
                    m={m}
                    last={i === p.milestones.length - 1}
                  />
                ))}
              </ol>
            </div>

            {/* Photos */}
            <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-soft sm:p-8">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="font-display text-2xl">Photos du chantier</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mises à jour par votre artisan à chaque étape.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {p.photos.length} photo{p.photos.length > 1 ? "s" : ""}
                </span>
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.photos.map((ph) => (
                  <li
                    key={ph.id}
                    className="group overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={ph.url}
                        alt={ph.caption}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="border-t border-border bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                        {ph.phase === "avant"
                          ? "Avant"
                          : ph.phase === "pendant"
                            ? "Pendant"
                            : "Après"}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-foreground">
                        {ph.caption}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Aside */}
          <aside className="lg:col-span-5">
            {/* Documents */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
              <h2 className="font-display text-xl">Documents</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Devis, garanties et fiches techniques.
              </p>
              <ul className="mt-5 divide-y divide-border">
                {p.documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {d.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateFormat(d.issued_at)} · {Math.round(d.size_kb)} Ko
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-accent"
                      aria-label={`Télécharger ${d.label}`}
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Garanties */}
            <div className="mt-6 rounded-2xl border border-border bg-brand-cream/40 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Vos garanties Parqueto
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li>• Artisan vérifié — décennale & RC Pro à jour</li>
                    <li>• Prix conformes au devis signé</li>
                    <li>• Médiation Parqueto en cas de litige</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Raccourcis */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/devis"
                className="rounded-xl border border-border bg-background p-4 transition hover:bg-accent"
              >
                <FileText className="h-4 w-4 text-brand-orange" />
                <p className="mt-2 text-sm font-semibold">Mes devis</p>
                <p className="text-xs text-muted-foreground">Historique complet</p>
              </Link>
              <Link
                to="/messages"
                className="rounded-xl border border-border bg-background p-4 transition hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4 text-brand-orange" />
                <p className="mt-2 text-sm font-semibold">Messagerie</p>
                <p className="text-xs text-muted-foreground">
                  {p.unread_messages > 0
                    ? `${p.unread_messages} non lu`
                    : "À jour"}
                </p>
              </Link>
            </div>
          </aside>
        </div>

        {user && (
          <p className="mt-10 text-center text-xs text-muted-foreground">
            Connecté en tant que {user.email}
          </p>
        )}
      </section>
    </main>
  );
}
