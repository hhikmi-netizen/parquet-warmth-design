import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Hammer,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Sparkles,
  CalendarDays,
  CreditCard,
  Lock,
} from "lucide-react";
import { PqButton, PqSurface, PqPill } from "@/components/parqueto";

export const Route = createFileRoute("/_authenticated/pro/onboarding")({
  component: ArtisanOnboardingChecklist,
  head: () => ({
    meta: [
      { title: "Activer mon profil artisan — Parqueto" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

type StepStatus = "done" | "todo" | "review";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
  required: boolean;
  cta: { label: string; to: string };
  estMinutes: number;
};

// In a future iteration, derive from the actual artisan record + counts.
// For now we model the checklist visually so the artisan has a clear path.
const STEPS: Step[] = [
  {
    id: "identite",
    title: "Identité de l'entreprise",
    description:
      "Raison sociale, SIRET, forme juridique, représentant. Vérifié par notre équipe sous 24 h.",
    icon: Building2,
    status: "done",
    required: true,
    cta: { label: "Voir mes informations", to: "/pro" },
    estMinutes: 2,
  },
  {
    id: "zone",
    title: "Zone d'intervention",
    description:
      "Définissez votre ville d'attache et un rayon (en km). Vous ne recevrez que les projets à portée.",
    icon: MapPin,
    status: "todo",
    required: true,
    cta: { label: "Définir ma zone", to: "/pro" },
    estMinutes: 1,
  },
  {
    id: "specialites",
    title: "Spécialités & essences",
    description:
      "Pose collée, clouée, chevron, ponçage… plus précis vous êtes, mieux nous qualifions vos projets.",
    icon: Hammer,
    status: "todo",
    required: true,
    cta: { label: "Choisir mes spécialités", to: "/pro" },
    estMinutes: 3,
  },
  {
    id: "assurances",
    title: "Décennale & RC Pro",
    description:
      "Compagnie, n° de police, validité. Indispensable pour apparaître dans l'annuaire vérifié.",
    icon: ShieldCheck,
    status: "review",
    required: true,
    cta: { label: "Téléverser mes attestations", to: "/pro" },
    estMinutes: 4,
  },
  {
    id: "realisations",
    title: "3 réalisations minimum",
    description:
      "Photos avant/après de chantiers récents. C'est ce que les clients regardent en premier.",
    icon: Camera,
    status: "todo",
    required: true,
    cta: { label: "Ajouter mes photos", to: "/pro" },
    estMinutes: 8,
  },
  {
    id: "dispos",
    title: "Disponibilités",
    description:
      "Indiquez vos créneaux et délai de démarrage. Bientôt connecté au calendrier intégré.",
    icon: CalendarDays,
    status: "todo",
    required: false,
    cta: { label: "Renseigner mes dispos", to: "/pro" },
    estMinutes: 2,
  },
  {
    id: "credits",
    title: "Crédits projets",
    description:
      "3 projets offerts à l'inscription. Rechargez à tout moment, sans abonnement.",
    icon: CreditCard,
    status: "done",
    required: false,
    cta: { label: "Voir mes crédits", to: "/pro/facturation" },
    estMinutes: 1,
  },
];

const STATUS_META: Record<
  StepStatus,
  { label: string; tone: "success" | "warning" | "neutral"; Icon: React.ComponentType<{ className?: string }> }
> = {
  done: { label: "Complété", tone: "success", Icon: CheckCircle2 },
  review: { label: "En vérification", tone: "warning", Icon: ShieldCheck },
  todo: { label: "À compléter", tone: "neutral", Icon: Circle },
};

function ArtisanOnboardingChecklist() {
  const { completed, total, percent, remainingMin } = useMemo(() => {
    const total = STEPS.length;
    const completed = STEPS.filter((s) => s.status === "done").length;
    const remainingMin = STEPS.filter((s) => s.status !== "done").reduce(
      (sum, s) => sum + s.estMinutes,
      0,
    );
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
      remainingMin,
    };
  }, []);

  const requiredRemaining = STEPS.filter((s) => s.required && s.status !== "done").length;
  const profileReady = requiredRemaining === 0;

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Mon espace
          </Link>
          <PqPill tone={profileReady ? "success" : "orange"} size="md">
            {profileReady ? "Profil prêt" : `${completed}/${total} étapes`}
          </PqPill>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {/* Hero */}
        <PqSurface tone="warm" padding="lg" className="overflow-hidden">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-brand-orange-deep">
                <Sparkles className="h-3.5 w-3.5" />
                Activez votre compte
              </div>
              <h1 className="font-serif text-3xl text-brand-ink sm:text-4xl">
                {profileReady
                  ? "Votre profil est prêt"
                  : "Encore quelques étapes pour recevoir vos premiers projets"}
              </h1>
              <p className="text-sm leading-relaxed text-brand-ink/80">
                {profileReady
                  ? "Vous apparaissez désormais dans l'annuaire vérifié Parqueto et recevez les projets qualifiés correspondant à votre zone."
                  : "Plus votre profil est complet, plus nous vous proposons de projets pertinents. Comptez environ "}
                {!profileReady && (
                  <span className="font-semibold text-brand-ink">{remainingMin} minutes</span>
                )}
                {!profileReady && "."}
              </p>
            </div>
            <div className="shrink-0">
              <ProgressRing percent={percent} />
            </div>
          </div>

          {/* Linear progress */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-brand-ink/70">
              <span>Progression</span>
              <span className="font-semibold text-brand-ink">{percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background/60">
              <div
                className="h-full rounded-full bg-brand-orange transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </PqSurface>

        {/* Steps list */}
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.id} step={step} index={i + 1} />
          ))}
        </div>

        {/* Footer reassurance */}
        <PqSurface padding="md" tone="muted" className="border border-border/60">
          <div className="flex items-start gap-3 text-sm text-brand-ink/80">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <p>
              Vos documents sont chiffrés et utilisés uniquement pour vérifier votre éligibilité.
              Une équipe Parqueto contrôle chaque profil manuellement sous 24 h ouvrées.
            </p>
          </div>
        </PqSurface>
      </main>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const meta = STATUS_META[step.status];
  const Icon = step.icon;
  const StatusIcon = meta.Icon;
  const isDone = step.status === "done";

  return (
    <PqSurface
      padding="md"
      className={isDone ? "opacity-80" : ""}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Left: index + icon */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              isDone
                ? "border-[color:var(--state-success)]/30 bg-[color:var(--state-success-surface)] text-[color:var(--state-success)]"
                : "border-brand-orange/25 bg-brand-orange/8 text-brand-orange-deep"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:mt-1">
            Étape {String(index).padStart(2, "0")}
          </span>
        </div>

        {/* Middle: text */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg text-brand-ink">{step.title}</h3>
            {!step.required && (
              <PqPill tone="neutral">Optionnel</PqPill>
            )}
            <PqPill tone={meta.tone} icon={<StatusIcon />}>
              {meta.label}
            </PqPill>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          {!isDone && (
            <p className="text-xs text-brand-ink/60">≈ {step.estMinutes} min</p>
          )}
        </div>

        {/* Right: CTA */}
        <div className="sm:shrink-0">
          {isDone ? (
            <PqButton variant="ghost" size="sm" asChild>
              <Link to={step.cta.to}>
                Voir
                <ArrowRight className="h-4 w-4" />
              </Link>
            </PqButton>
          ) : (
            <PqButton variant={step.required ? "primary" : "secondary"} size="sm" asChild>
              <Link to={step.cta.to}>
                {step.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </PqButton>
          )}
        </div>
      </div>
    </PqSurface>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-background/60"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-brand-orange transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl text-brand-ink">{percent}%</span>
        <span className="text-[10px] uppercase tracking-wider text-brand-ink/60">complet</span>
      </div>
    </div>
  );
}
