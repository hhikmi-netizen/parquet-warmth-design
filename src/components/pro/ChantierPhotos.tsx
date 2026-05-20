import { useMemo, useRef, useState } from "react";
import { Camera, ImagePlus, Trash2, Calendar, Pencil, Check, X, Info } from "lucide-react";
import { PqButton } from "@/components/parqueto/PqButton";

/**
 * Suivi photo chantier — mock front-only.
 * Storage prévu plus tard côté Cloud (bucket `chantier-photos`,
 * RLS: artisan owner + admin, TTL 90-180j après clôture projet).
 */

type Phase = "avant" | "pendant" | "apres";

type Photo = {
  id: string;
  phase: Phase;
  dataUrl: string; // compressed base64 preview
  takenAt: string; // ISO
  note: string;
  sizeKb: number;
};

const MAX_PER_PHASE = 5;
const TARGET_LONG_EDGE = 1600; // compression cible
const JPEG_QUALITY = 0.78;

const PHASES: { id: Phase; label: string; hint: string; tone: string }[] = [
  { id: "avant", label: "Avant travaux", hint: "État initial du parquet", tone: "bg-amber-50 text-amber-900 border-amber-200" },
  { id: "pendant", label: "Pendant travaux", hint: "Avancement, ponçage, pose", tone: "bg-sky-50 text-sky-900 border-sky-200" },
  { id: "apres", label: "Après travaux", hint: "Rendu final livré", tone: "bg-emerald-50 text-emerald-900 border-emerald-200" },
];

const MOCK_PROJECTS = [
  { ref: "PJ-002479", label: "Reprise locale + huile dure · 12 m² — Lyon 3e" },
  { ref: "PJ-002471", label: "Point de Hongrie · 38 m² — Caluire" },
  { ref: "PJ-002460", label: "Vitrification · 24 m² — Lyon 2e" },
];

async function compressImage(file: File): Promise<{ dataUrl: string; sizeKb: number }> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, TARGET_LONG_EDGE / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
  return { dataUrl, sizeKb };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChantierPhotos() {
  const [projectRef, setProjectRef] = useState(MOCK_PROJECTS[0].ref);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const inputs = useRef<Record<Phase, HTMLInputElement | null>>({ avant: null, pendant: null, apres: null });

  const list = photos[projectRef] ?? [];
  const byPhase = useMemo(() => {
    const m: Record<Phase, Photo[]> = { avant: [], pendant: [], apres: [] };
    list.forEach((p) => m[p.phase].push(p));
    return m;
  }, [list]);

  const totalKb = list.reduce((s, p) => s + p.sizeKb, 0);

  async function handleFiles(phase: Phase, files: FileList | null) {
    if (!files?.length) return;
    const current = byPhase[phase];
    const room = Math.max(0, MAX_PER_PHASE - current.length);
    const slice = Array.from(files).slice(0, room);
    const newOnes: Photo[] = [];
    for (const f of slice) {
      try {
        const { dataUrl, sizeKb } = await compressImage(f);
        newOnes.push({
          id: crypto.randomUUID(),
          phase,
          dataUrl,
          takenAt: new Date().toISOString(),
          note: "",
          sizeKb,
        });
      } catch {
        // ignore unreadable file
      }
    }
    setPhotos((prev) => ({
      ...prev,
      [projectRef]: [...(prev[projectRef] ?? []), ...newOnes],
    }));
  }

  function removePhoto(id: string) {
    setPhotos((prev) => ({
      ...prev,
      [projectRef]: (prev[projectRef] ?? []).filter((p) => p.id !== id),
    }));
  }

  function saveNote(id: string) {
    setPhotos((prev) => ({
      ...prev,
      [projectRef]: (prev[projectRef] ?? []).map((p) => (p.id === id ? { ...p, note: draftNote.trim() } : p)),
    }));
    setEditing(null);
    setDraftNote("");
  }

  return (
    <div className="space-y-5">
      {/* Sélecteur projet */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <label className="text-xs font-medium text-muted-foreground">Projet client</label>
        <select
          value={projectRef}
          onChange={(e) => setProjectRef(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        >
          {MOCK_PROJECTS.map((p) => (
            <option key={p.ref} value={p.ref}>
              {p.ref} — {p.label}
            </option>
          ))}
        </select>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Info className="size-3" />
          Photos visibles par vous et l'admin Parqueto. Conservées 90 jours après clôture du projet.
        </p>
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const items = byPhase[phase.id];
        const full = items.length >= MAX_PER_PHASE;
        return (
          <section key={phase.id} className="rounded-2xl border border-border bg-background p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${phase.tone}`}>
                  {phase.label}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">{phase.hint}</p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {items.length}/{MAX_PER_PHASE}
              </span>
            </div>

            {items.length === 0 ? (
              <button
                type="button"
                onClick={() => inputs.current[phase.id]?.click()}
                className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-8 text-center transition hover:border-brand-orange/40 hover:bg-brand-orange/5"
              >
                <Camera className="size-6 text-brand-orange" />
                <span className="text-sm font-medium">Prendre / ajouter une photo</span>
                <span className="text-[11px] text-muted-foreground">Compression auto · max 5</span>
              </button>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {items.map((p) => (
                    <figure key={p.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
                      <img
                        src={p.dataUrl}
                        alt={p.note || `${phase.label} ${formatDate(p.takenAt)}`}
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        aria-label="Supprimer"
                        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <figcaption className="space-y-1 p-2">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="size-3" />
                          {formatDate(p.takenAt)} · {p.sizeKb} Ko
                        </div>
                        {editing === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              value={draftNote}
                              onChange={(e) => setDraftNote(e.target.value)}
                              maxLength={80}
                              placeholder="Courte note…"
                              className="flex-1 rounded-md border border-border bg-background px-1.5 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-brand-orange/40"
                            />
                            <button
                              type="button"
                              onClick={() => saveNote(p.id)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-orange text-primary-foreground"
                              aria-label="Enregistrer"
                            >
                              <Check className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(null);
                                setDraftNote("");
                              }}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border"
                              aria-label="Annuler"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(p.id);
                              setDraftNote(p.note);
                            }}
                            className="flex w-full items-center gap-1 truncate text-left text-[11px] text-foreground/80 hover:text-brand-orange-deep"
                          >
                            <Pencil className="size-3 shrink-0 opacity-60" />
                            <span className="truncate">{p.note || "Ajouter une note"}</span>
                          </button>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {!full && (
                  <PqButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    iconLeft={<ImagePlus />}
                    onClick={() => inputs.current[phase.id]?.click()}
                  >
                    Ajouter une photo ({MAX_PER_PHASE - items.length} restantes)
                  </PqButton>
                )}
              </>
            )}

            <input
              ref={(el) => (inputs.current[phase.id] = el)}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(phase.id, e.target.files);
                e.target.value = "";
              }}
            />
          </section>
        );
      })}

      {/* Footer poids */}
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-3 text-[11px] text-muted-foreground">
        Stockage utilisé pour ce projet : <strong className="text-foreground">{Math.round(totalKb)} Ko</strong> ·
        compression automatique appliquée (max 1600 px, JPEG 78 %). Vidéos non supportées.
      </div>
    </div>
  );
}
