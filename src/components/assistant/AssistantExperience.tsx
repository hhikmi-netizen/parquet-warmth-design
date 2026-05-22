import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Upload,
  ImageIcon,
  Sparkles,
  X,
  ShieldCheck,
  ArrowRight,
  CircleAlert,
  Wrench,
  Droplets,
  Ruler,
  CheckCircle2,
  Loader2,
  CircleDot,
} from "lucide-react";

type Stage = "idle" | "preview" | "analyzing" | "results";

const ANALYSIS_STEPS = [
  "Lecture de l'image",
  "Identification probable de l'essence",
  "Détection de la finition (vernis / huile)",
  "Repérage des marques d'usure",
  "Évaluation indicative de l'état général",
];

// Pre-rédigé : mock crédible, prudent, métier.
const MOCK_RESULT = {
  confidence: 78,
  essence: "Chêne (probable)",
  finition: "Vitrification, probablement usée",
  pose: "Pose à l'anglaise",
  signals: [
    {
      icon: CircleDot,
      label: "Micro-rayures",
      level: "Modérées",
      tone: "amber" as const,
    },
    {
      icon: Droplets,
      label: "Traces d'humidité",
      level: "Non détectées",
      tone: "emerald" as const,
    },
    {
      icon: Ruler,
      label: "Tuilage des lames",
      level: "Léger",
      tone: "amber" as const,
    },
    {
      icon: ShieldCheck,
      label: "Intégrité du support",
      level: "Apparente",
      tone: "emerald" as const,
    },
  ],
  recommendations: [
    {
      title: "Ponçage léger recommandé",
      body:
        "L'usure superficielle et les micro-rayures suggèrent qu'un ponçage fin (grain 120 à 150) suivi d'une nouvelle finition serait pertinent. À confirmer par un parqueteur sur place.",
    },
    {
      title: "Renouveler la vitrification",
      body:
        "L'aspect mat et terne par endroits laisse penser que la couche de vitrification est arrivée en fin de vie. Une vitrification 2 ou 3 couches redonnerait protection et profondeur à la teinte.",
    },
    {
      title: "Entretien : pas de lavage humide excessif",
      body:
        "En attendant les travaux, privilégiez un balayage doux et un nettoyant spécifique parquet vitrifié. Évitez les serpillières détrempées et les détergents alcalins.",
    },
  ],
  urgency: {
    level: "Modérée",
    body:
      "Pas d'urgence immédiate. Une intervention dans les 6 à 12 mois éviterait que les rayures n'atteignent la couche bois et n'imposent un ponçage plus profond.",
  },
} as const;

export function AssistantExperience() {
  const [stage, setStage] = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFileName(file.name);
    setStage("preview");
  }, [imageUrl]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const startAnalysis = useCallback(() => {
    setStage("analyzing");
    setProgress(0);
    setActiveStep(0);

    const totalMs = 3800;
    const tick = 60;
    const increment = (tick / totalMs) * 100;

    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + increment);
        const stepIndex = Math.min(
          ANALYSIS_STEPS.length - 1,
          Math.floor((next / 100) * ANALYSIS_STEPS.length),
        );
        setActiveStep(stepIndex);
        if (next >= 100) {
          window.clearInterval(id);
          window.setTimeout(() => setStage("results"), 280);
        }
        return next;
      });
    }, tick);
  }, []);

  const reset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFileName(null);
    setProgress(0);
    setActiveStep(0);
    setStage("idle");
  }, [imageUrl]);

  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft">
      <div className="grid gap-px overflow-hidden rounded-3xl bg-border md:grid-cols-2">
        {/* LEFT — Upload / preview */}
        <div className="bg-card p-6 sm:p-8">
          <Header
            kicker="01 · Source"
            title="Votre photo de parquet"
            hint="JPG, PNG · 10 Mo max"
          />

          {stage === "idle" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              className={[
                "mt-6 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition",
                isDragging
                  ? "border-brand-orange/70 bg-brand-orange/5"
                  : "border-border bg-secondary/30 hover:border-brand-orange/40 hover:bg-secondary/60",
              ].join(" ")}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground/70">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-5 font-display text-lg text-foreground">
                Glissez une photo, ou cliquez pour parcourir
              </p>
              <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
                Photo prise à la verticale, lumière naturelle, sans tapis : meilleur résultat.
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onPick}
                className="hidden"
              />
            </div>
          )}

          {(stage === "preview" || stage === "analyzing" || stage === "results") && imageUrl && (
            <div className="mt-6">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/30">
                <img
                  src={imageUrl}
                  alt={fileName ?? "Photo de parquet à analyser"}
                  className="aspect-[4/3] w-full object-cover"
                />
                {stage === "analyzing" && (
                  <>
                    <div className="absolute inset-0 bg-foreground/15 backdrop-blur-[1px]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] animate-scan bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
                  </>
                )}
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/85 text-foreground shadow-soft transition hover:bg-background"
                  aria-label="Retirer la photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 truncate">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{fileName}</span>
                </span>
                {stage === "preview" && (
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="shrink-0 font-medium text-foreground hover:text-brand-orange"
                  >
                    Changer
                  </button>
                )}
              </div>

              {stage === "preview" && (
                <button
                  onClick={startAnalysis}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  <Sparkles className="h-4 w-4" />
                  Lancer l'analyse
                </button>
              )}

              {stage === "results" && (
                <button
                  onClick={reset}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  Analyser une autre photo
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Analysis / results */}
        <div className="bg-card p-6 sm:p-8">
          <Header
            kicker="02 · Analyse"
            title="Lecture assistée du parquet"
            hint="Résultat indicatif, à confirmer par un parqueteur"
          />

          {stage === "idle" && <EmptyAnalysis />}
          {stage === "preview" && <ReadyAnalysis />}
          {stage === "analyzing" && (
            <AnalyzingPanel progress={progress} activeStep={activeStep} />
          )}
          {stage === "results" && <ResultsPanel />}
        </div>
      </div>

      {/* Bottom band — disclaimer + CTA */}
      <div className="flex flex-col items-start gap-4 border-t border-border px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="max-w-xl leading-relaxed">
          L'Assistant Parqueto fournit une lecture <strong className="font-medium text-foreground">indicative</strong>{" "}
          basée sur une seule photo. Aucun diagnostic technique ni devis ferme n'est produit à ce stade.
          Une visite sur place reste indispensable.
        </p>
        <Link
          to="/estimation"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
        >
          Demander un devis vérifié
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Sub-pieces ---------- */

function Header({ kicker, title, hint }: { kicker: string; title: string; hint: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {kicker}
        </p>
        <h3 className="mt-1 font-display text-xl text-foreground">{title}</h3>
      </div>
      <p className="hidden text-right text-[11px] text-muted-foreground sm:block">{hint}</p>
    </div>
  );
}

function EmptyAnalysis() {
  return (
    <div className="mt-6 flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-border bg-secondary/30 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground/60">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-base text-foreground">En attente d'une photo</p>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Dès qu'une image est chargée, l'assistant prépare une lecture visuelle de votre parquet.
      </p>
    </div>
  );
}

function ReadyAnalysis() {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Image prête
      </div>
      <p className="mt-4 font-display text-lg">L'assistant est prêt à analyser.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Cliquez sur <strong className="font-medium text-foreground">Lancer l'analyse</strong> pour
        obtenir une lecture indicative — essence probable, finition, signes d'usure, recommandations.
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        {[
          "Essence du bois (probable)",
          "État de la finition",
          "Marques d'usure et de chocs",
          "Recommandations d'entretien ou de rénovation",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground/70" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnalyzingPanel({ progress, activeStep }: { progress: number; activeStep: number }) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-foreground/70" />
        <p className="font-display text-base">Analyse en cours…</p>
        <span className="ml-auto font-mono text-sm tabular-nums text-foreground/80">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-6 space-y-2.5">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          return (
            <li
              key={step}
              className={[
                "flex items-center gap-3 text-sm transition",
                done ? "text-foreground" : current ? "text-foreground" : "text-muted-foreground/60",
              ].join(" ")}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-foreground/80" />
              ) : current ? (
                <Loader2 className="h-4 w-4 animate-spin text-foreground/70" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-border" />
              )}
              <span>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResultsPanel() {
  const r = MOCK_RESULT;
  return (
    <div className="mt-6 space-y-4">
      {/* Confidence + summary */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Lecture indicative
            </p>
            <p className="mt-2 font-display text-xl">État général : <span className="italic">satisfaisant</span></p>
          </div>
          <ConfidenceRing value={r.confidence} />
        </div>
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <Meta label="Essence" value={r.essence} />
          <Meta label="Finition" value={r.finition} />
          <Meta label="Pose" value={r.pose} />
        </dl>
      </div>

      {/* Signals */}
      <div className="grid grid-cols-2 gap-3">
        {r.signals.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-3.5"
          >
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </div>
            <p
              className={[
                "mt-1.5 font-display text-sm",
                s.tone === "amber" ? "text-amber-700" : "text-emerald-700",
              ].join(" ")}
            >
              {s.level}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-foreground/70" />
          <p className="font-display text-base">Recommandations</p>
        </div>
        <ul className="mt-4 space-y-4">
          {r.recommendations.map((rec) => (
            <li key={rec.title} className="border-l-2 border-foreground/20 pl-4">
              <p className="font-display text-sm text-foreground">{rec.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{rec.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Urgency */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/30 p-5">
        <CircleAlert className="mt-0.5 h-5 w-5 text-amber-600" />
        <div>
          <p className="font-display text-sm">
            Urgence estimée :{" "}
            <span className="italic text-amber-700">{r.urgency.level}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{r.urgency.body}</p>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-sm text-foreground">{value}</dd>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-border"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-foreground transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="text-[8px] uppercase tracking-wide text-muted-foreground">conf.</span>
      </div>
    </div>
  );
}
