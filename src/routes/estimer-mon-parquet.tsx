import { useCallback, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
  Ruler,
  Palette,
  Wrench,
  Info,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/estimer-mon-parquet")({
  component: EstimerMonParquetPage,
  head: () => ({
    meta: [
      {
        title:
          "Estimer mon parquet en photo — Analyse IA gratuite du sol et de la pièce · Parqueto",
      },
      {
        name: "description",
        content:
          "Prenez une photo de votre sol ou de votre pièce, l'IA Parqueto identifie le type de parquet adapté, les matériaux compatibles et estime la surface. Gratuit, sans inscription.",
      },
      { property: "og:title", content: "Estimer mon parquet en photo · Parqueto" },
      {
        property: "og:description",
        content:
          "Analyse IA d'une photo de votre sol : type de parquet recommandé, matériaux compatibles, estimation de surface. Gratuit.",
      },
      { property: "og:url", content: "/estimer-mon-parquet" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/estimer-mon-parquet" }],
  }),
});

type AnalysisResult = {
  flooringType: string;
  flooringDescription: string;
  recommendedParquet: Array<{ name: string; reason: string; priceRange: string }>;
  compatibleMaterials: string[];
  estimatedSurface: { value: number; unit: string; confidence: "Faible" | "Moyenne" | "Élevée" };
  observations: string[];
  warnings: string[];
};

// Mock response — wired to Gemini Vision via Codex backend.
function mockAnalyze(): Promise<AnalysisResult> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          flooringType: "Carrelage en grès cérame, format 30×30 cm",
          flooringDescription:
            "Sol existant en bon état, joints fins, surface plane. Compatible avec une pose flottante sans dépose.",
          recommendedParquet: [
            {
              name: "Parquet contrecollé chêne, 14 mm",
              reason:
                "Pose flottante directe sur carrelage avec sous-couche acoustique. Stable, finition élégante.",
              priceRange: "65–95 €/m² fourni",
            },
            {
              name: "Parquet massif chêne 15 mm clipsable",
              reason:
                "Pour un rendu authentique sur sol parfaitement plan. Pose flottante possible.",
              priceRange: "90–140 €/m² fourni",
            },
            {
              name: "Stratifié haut de gamme AC5",
              reason: "Option économique, rapide à poser, idéal pour pièces à fort passage.",
              priceRange: "30–55 €/m² fourni",
            },
          ],
          compatibleMaterials: [
            "Sous-couche acoustique 3 mm",
            "Plinthes assorties MDF placage chêne",
            "Barre de seuil aluminium discrète",
            "Profil de finition en L pour départ mur",
          ],
          estimatedSurface: { value: 18, unit: "m²", confidence: "Moyenne" },
          observations: [
            "Pièce de vie type séjour, exposition lumineuse correcte",
            "Présence d'un radiateur — prévoir découpe d'habillage",
            "Aucun seuil de porte visible nécessitant adaptation",
          ],
          warnings: [
            "Vérifier la planéité du sol avec une règle de 2 m avant pose flottante.",
            "Estimation de surface à confirmer avec mesures réelles ou plan.",
          ],
        }),
      1800,
    ),
  );
}

function EstimerMonParquetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);
    setResult(null);
    if (!f.type.startsWith("image/")) {
      setError("Format non supporté. Utilisez une photo JPG, PNG ou WEBP.");
      return;
    }
    if (f.size > 12 * 1024 * 1024) {
      setError("Image trop lourde (max 12 Mo). Réduisez la résolution.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await mockAnalyze();
      setResult(data);
    } catch {
      setError("L'analyse a échoué. Réessayez dans quelques instants.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const confidenceColor =
    result?.estimatedSurface.confidence === "Élevée"
      ? "bg-state-success-surface text-state-success"
      : result?.estimatedSurface.confidence === "Moyenne"
        ? "bg-state-warning-surface text-state-warning"
        : "bg-state-danger-surface text-state-danger";

  return (
    <>
      <Header />
      <main className="bg-surface-warm-soft">
        {/* Hero */}
        <section className="border-b border-border bg-surface-warm">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-deep">
              <Sparkles className="h-3.5 w-3.5" />
              Nouveau · Analyse photo par IA
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-foreground md:text-5xl">
              Estimer mon parquet <span className="text-brand-orange">en une photo</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Photographiez votre sol ou votre pièce. Notre IA identifie le revêtement
              existant, recommande le parquet adapté et estime la surface — gratuit, sans
              inscription.
            </p>
          </div>
        </section>

        {/* Upload + Result */}
        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload zone */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-display text-xl text-foreground">1. Votre photo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cadrez le sol entier si possible. Bonne lumière, sans contre-jour.
              </p>

              {!preview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => inputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  className={cn(
                    "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-warm-soft px-6 py-14 text-center transition",
                    isDragging && "border-brand-orange bg-brand-orange/5",
                  )}
                  aria-label="Zone de dépôt de photo"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Glissez une photo ou cliquez pour parcourir
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, WEBP · jusqu'à 12 Mo
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                    >
                      <ImageIcon className="mr-1.5 h-4 w-4" />
                      Choisir un fichier
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.setAttribute("capture", "environment");
                        inputRef.current?.click();
                      }}
                    >
                      <Camera className="mr-1.5 h-4 w-4" />
                      Prendre une photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="relative overflow-hidden rounded-2xl border border-border">
                    <img
                      src={preview}
                      alt="Aperçu de votre photo"
                      className="h-72 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={reset}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:bg-background"
                      aria-label="Retirer la photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 truncate text-xs text-muted-foreground">
                    {file?.name} · {file ? Math.round(file.size / 1024) : 0} Ko
                  </p>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-state-danger/30 bg-state-danger-surface px-3 py-2 text-sm text-state-danger">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="button"
                size="lg"
                disabled={!file || isAnalyzing}
                onClick={handleAnalyze}
                className="mt-6 w-full bg-brand-orange text-white hover:bg-brand-orange-deep"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Lancer l'analyse IA
                  </>
                )}
              </Button>

              <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Vos photos servent uniquement à l'analyse, ne sont pas stockées et ne
                contiennent aucune donnée personnelle.
              </p>
            </div>

            {/* Result panel */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-display text-xl text-foreground">2. Résultat de l'analyse</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Diagnostic du revêtement, parquets recommandés et estimation de surface.
              </p>

              {!result && !isAnalyzing && (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-warm-soft px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    L'analyse de votre photo apparaîtra ici.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-warm-soft px-6 py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
                  <p className="mt-4 text-sm text-foreground">L'IA examine votre photo…</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Identification du revêtement, recommandations, surface (≈ 5 s)
                  </p>
                </div>
              )}

              {result && (
                <div className="mt-6 space-y-6">
                  {/* Diagnostic */}
                  <div className="rounded-2xl border border-border bg-surface-warm-soft p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-orange-deep">
                      <CheckCircle2 className="h-4 w-4" />
                      Revêtement identifié
                    </div>
                    <p className="mt-2 font-display text-lg text-foreground">
                      {result.flooringType}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.flooringDescription}
                    </p>
                  </div>

                  {/* Surface */}
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                        <Ruler className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Surface estimée
                        </p>
                        <p className="font-display text-xl text-foreground">
                          ≈ {result.estimatedSurface.value} {result.estimatedSurface.unit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        confidenceColor,
                      )}
                    >
                      Fiabilité {result.estimatedSurface.confidence.toLowerCase()}
                    </span>
                  </div>

                  {/* Parquets recommandés */}
                  <div>
                    <h3 className="font-display text-base text-foreground">
                      Parquets recommandés
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {result.recommendedParquet.map((p) => (
                        <li
                          key={p.name}
                          className="rounded-xl border border-border bg-background p-4"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="font-semibold text-foreground">{p.name}</p>
                            <span className="text-xs font-semibold text-brand-orange-deep">
                              {p.priceRange}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{p.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Matériaux */}
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-base text-foreground">
                      <Wrench className="h-4 w-4 text-brand-orange" />
                      Matériaux compatibles
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {result.compatibleMaterials.map((m) => (
                        <li
                          key={m}
                          className="rounded-full border border-border bg-surface-warm-soft px-3 py-1 text-xs text-foreground"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Observations */}
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-base text-foreground">
                      <Palette className="h-4 w-4 text-brand-orange" />
                      Observations
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {result.observations.map((o) => (
                        <li key={o} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="rounded-xl border border-state-warning/30 bg-state-warning-surface p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-state-warning">
                        <AlertTriangle className="h-4 w-4" />
                        À vérifier avant pose
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-foreground">
                        {result.warnings.map((w) => (
                          <li key={w}>· {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5">
                    <p className="font-display text-base text-foreground">
                      Prêt à passer à l'étape suivante ?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Obtenez un devis précis d'un artisan parqueteur vérifié sous 24 h.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        asChild
                        className="bg-brand-orange text-white hover:bg-brand-orange-deep"
                      >
                        <Link to="/estimation">
                          Lancer une estimation détaillée
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" onClick={reset}>
                        <button type="button">Analyser une autre photo</button>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-t border-border bg-surface-warm">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <h2 className="font-display text-2xl text-foreground">
              Conseils pour une analyse fiable
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Cadrage large",
                  body: "Reculez pour capturer le sol entier, idéalement avec un repère (plinthe, porte).",
                },
                {
                  title: "Lumière naturelle",
                  body: "Évitez le contre-jour et les ombres trop marquées. Une lumière du jour suffit.",
                },
                {
                  title: "Sol dégagé",
                  body: "Retirez tapis et objets posés au sol pour que l'IA voie le revêtement existant.",
                },
              ].map((t) => (
                <div key={t.title} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-display text-base text-foreground">{t.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
