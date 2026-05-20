import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Upload,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingNav } from "@/components/site/FloatingNav";
import { MicroReassurance } from "@/components/site/MicroReassurance";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Parqueto" },
      {
        name: "description",
        content:
          "Une question, un projet de rénovation parquet ? Écrivez-nous : réponse humaine, sans engagement, sans démarchage.",
      },
      { property: "og:title", content: "Contact — Parqueto" },
      {
        property: "og:description",
        content: "Parlons de votre projet parquet. Réponse humaine, sans démarchage.",
      },
    ],
  }),
  component: ContactPage,
});

const PROJET_OPTIONS = [
  "Ponçage",
  "Vitrification",
  "Pose parquet",
  "Rénovation",
  "Escalier",
  "Autre",
] as const;

const contactSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Votre nom est requis.")
    .max(80, "80 caractères maximum.")
    .regex(/^[\p{L}\p{M}'\- ]+$/u, "Caractères non autorisés."),
  email: z
    .string()
    .trim()
    .min(1, "Email requis.")
    .email("Format d'email invalide (ex. nom@domaine.fr).")
    .max(255),
  telephone: z
    .string()
    .trim()
    .max(20, "20 caractères maximum.")
    .regex(/^[0-9 +().\-]{8,}$/, "Téléphone invalide (8 chiffres min).")
    .optional()
    .or(z.literal("")),
  ville: z
    .string()
    .trim()
    .min(2, "Indiquez votre ville.")
    .max(80)
    .regex(/^[\p{L}\p{M}'\-\s]+$/u, "Caractères non autorisés."),
  projet: z.enum(PROJET_OPTIONS, {
    errorMap: () => ({ message: "Choisissez un type de projet." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez brièvement votre projet (10 caractères min).")
    .max(2000, "2000 caractères maximum."),
});

type FormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
type FormValues = z.infer<typeof contactSchema>;

const MAX_FILES = 4;
const MAX_FILE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

function ContactPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [messageLen, setMessageLen] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Object URLs for previews — memoized + revoked on change/unmount.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    if (files.length >= MAX_FILES) {
      toast.error(`Limite atteinte : ${MAX_FILES} photos maximum.`);
      return;
    }
    const list = Array.from(incoming);
    const remaining = MAX_FILES - files.length;
    if (list.length > remaining) {
      toast.error(
        `Vous pouvez encore ajouter ${remaining} photo${remaining > 1 ? "s" : ""} (${list.length} sélectionnée${list.length > 1 ? "s" : ""}).`
      );
    }
    const next = [...files];
    let accepted = 0;
    let skippedOverflow = 0;
    for (const f of list) {
      if (next.length >= MAX_FILES) {
        skippedOverflow++;
        continue;
      }
      const isImage =
        f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(f.name);
      if (!isImage || (f.type && !ACCEPTED_TYPES.includes(f.type))) {
        toast.error(`${f.name} : format non supporté (JPG, PNG, WEBP).`);
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${f.name} dépasse ${MAX_FILE_MB} Mo.`);
        continue;
      }
      if (next.some((n) => n.name === f.name && n.size === f.size)) continue;
      next.push(f);
      accepted++;
    }
    setFiles(next.slice(0, MAX_FILES));
    if (accepted > 0) {
      toast.success(`${accepted} photo${accepted > 1 ? "s" : ""} ajoutée${accepted > 1 ? "s" : ""}.`);
    }
    if (skippedOverflow > 0 && accepted > 0) {
      toast.error(`${skippedOverflow} photo${skippedOverflow > 1 ? "s" : ""} ignorée${skippedOverflow > 1 ? "s" : ""} (max ${MAX_FILES}).`);
    }
  };

  const filesFull = files.length >= MAX_FILES;

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  // Drag & drop — counter avoids flicker when entering child nodes.
  const onDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer?.types?.includes("Files")) return;
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    addFiles(e.dataTransfer?.files ?? null);
  };

  // Per-field validation on blur.
  const validateField = (name: keyof FormValues, value: string) => {
    const shape = (contactSchema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape;
    const fieldSchema = shape[name];
    if (!fieldSchema) return;
    const res = fieldSchema.safeParse(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (res.success) delete next[name];
      else next[name] = res.error.issues[0]?.message ?? "Valeur invalide.";
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = contactSchema.safeParse({
      nom: fd.get("nom"),
      email: fd.get("email"),
      telephone: fd.get("telephone") ?? "",
      ville: fd.get("ville"),
      projet: fd.get("projet"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const fe: FormErrors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof FormErrors;
        if (!fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      toast.error("Merci de corriger les champs en rouge.");
      const firstKey = Object.keys(fe)[0];
      if (firstKey) {
        const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
      }
      return;
    }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
    toast.success("Demande envoyée. Nous revenons vers vous très vite.");
  };

  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (sent) successHeadingRef.current?.focus();
  }, [sent]);

  if (sent) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
        <Header />
        <section
          role="status"
          aria-live="polite"
          className="mx-auto max-w-2xl px-6 py-24 text-center"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-6 font-display text-4xl text-foreground sm:text-5xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-lg"
          >
            Merci, votre demande est partie.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Un interlocuteur humain vous répondra sous 24 à 48&nbsp;h ouvrées. En attendant,
            vous pouvez nous joindre directement :
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <a href="mailto:contact@parqueto.fr" className="inline-flex items-center gap-2 text-foreground hover:text-brand-orange">
              <Mail className="h-4 w-4" /> contact@parqueto.fr
            </a>
            <a href="tel:+33184606061" className="inline-flex items-center gap-2 text-foreground hover:text-brand-orange">
              <Phone className="h-4 w-4" /> 01 84 60 60 61
            </a>
          </div>
          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
          >
            Retour à l'accueil
          </Link>
        </section>
        <Footer />
        <FloatingNav />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grain absolute inset-0 opacity-30" aria-hidden />
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Contact
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] text-balance sm:text-6xl">
            Parlons de votre projet
            <span className="block italic text-brand-orange">parquet.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Une question, un projet de rénovation ou besoin d'informations ? Nous vous
            répondons avec clarté et simplicité.
          </p>
          <div className="mt-6 flex justify-center">
            <MicroReassurance
              items={["Réponse humaine", "Sans engagement", "Pas de démarchage agressif"]}
            />
          </div>
        </div>
      </section>

      {/* Form + side info */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="contact-form-title"
            className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-10"
          >
            <h2 id="contact-form-title" className="sr-only">
              Formulaire de contact Parqueto
            </h2>
            <p className="mb-6 text-xs text-muted-foreground">
              Les champs marqués d'un <span className="text-brand-orange" aria-hidden>*</span>{" "}
              <span className="sr-only">astérisque</span> sont obligatoires.
            </p>

            {/* Live region — announces validation errors to screen readers */}
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className={`${
                Object.keys(errors).length > 0
                  ? "mb-5 rounded-xl border border-destructive/40 bg-destructive/5 p-3"
                  : "sr-only"
              }`}
            >
              {Object.keys(errors).length > 0 && (
                <>
                  <p className="text-sm font-medium text-destructive">
                    {Object.keys(errors).length} champ
                    {Object.keys(errors).length > 1 ? "s" : ""} à corriger :
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-xs text-destructive">
                    {Object.entries(errors).map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom" name="nom" error={errors.nom} required autoComplete="name" onValidate={validateField} />
              <Field label="Email" name="email" type="email" error={errors.email} required autoComplete="email" onValidate={validateField} />
              <Field label="Téléphone" name="telephone" type="tel" placeholder="Optionnel" error={errors.telephone} autoComplete="tel" hint="Optionnel" onValidate={validateField} />
              <Field label="Ville" name="ville" error={errors.ville} required autoComplete="address-level2" onValidate={validateField} />
            </div>

            <fieldset
              className="mt-6"
              aria-invalid={!!errors.projet}
              aria-describedby={errors.projet ? "projet-error" : undefined}
            >
              <legend className="mb-2 text-sm font-medium text-foreground">
                Type de projet <span className="text-brand-orange" aria-hidden>*</span>
                <span className="sr-only"> (obligatoire)</span>
              </legend>
              <div role="radiogroup" aria-label="Type de projet" className="flex flex-wrap gap-2">
                {PROJET_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="group cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                  >
                    <input
                      type="radio"
                      name="projet"
                      value={opt}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.projet && (
                <p id="projet-error" className="mt-2 text-xs text-destructive">
                  {errors.projet}
                </p>
              )}
            </fieldset>

            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Votre message <span className="text-brand-orange" aria-hidden>*</span>
                  <span className="sr-only"> (obligatoire)</span>
                </label>
                <span
                  className={`text-[11px] tabular-nums ${
                    messageLen > 1800 ? "text-brand-orange" : "text-muted-foreground"
                  }`}
                  aria-live="polite"
                >
                  {messageLen}/2000
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={2000}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : "message-hint"}
                placeholder="Décrivez brièvement votre projet : surface, état actuel, délais souhaités…"
                onInput={(e) => setMessageLen((e.target as HTMLTextAreaElement).value.length)}
                onBlur={(e) => validateField("message", e.target.value)}
                className={`w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  errors.message ? "border-destructive" : "border-border"
                }`}
              />
              <p id="message-hint" className="mt-1.5 text-xs text-muted-foreground">
                Plus c'est précis, plus la réponse sera juste.
              </p>
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-xs text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Photos — drag & drop zone with previews */}
            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span id="photos-label" className="block text-sm font-medium">
                  Photos du projet
                </span>
                <span className="text-[11px] tabular-nums text-muted-foreground" aria-live="polite">
                  {files.length}/{MAX_FILES}
                </span>
              </div>
              <p id="photos-hint" className="mb-3 text-xs text-muted-foreground">
                Glissez-déposez vos photos ou cliquez pour parcourir. JPG, PNG, WEBP — {MAX_FILE_MB} Mo max chacune.
              </p>

              <div
                role="button"
                tabIndex={0}
                aria-label="Zone de dépôt de photos"
                aria-describedby="photos-hint"
                onClick={() => fileInput.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInput.current?.click();
                  }
                }}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isDragging
                    ? "border-brand-orange bg-brand-orange/5 text-brand-orange scale-[1.01]"
                    : "border-border bg-background text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                    isDragging ? "bg-brand-orange text-primary-foreground" : "bg-card text-brand-orange shadow-soft"
                  }`}
                >
                  {isDragging ? <ImagePlus className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                </span>
                <span className="font-medium text-foreground">
                  {isDragging ? "Déposez pour ajouter" : "Glissez vos photos ici"}
                </span>
                <span className="text-xs">
                  ou <span className="underline underline-offset-2">cliquez pour parcourir</span>
                </span>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                aria-labelledby="photos-label"
                aria-describedby="photos-hint"
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.currentTarget.value = ""; // allow re-selecting same file
                }}
              />

              <p className="sr-only" aria-live="polite">
                {files.length === 0
                  ? "Aucune photo sélectionnée."
                  : `${files.length} photo${files.length > 1 ? "s" : ""} sélectionnée${files.length > 1 ? "s" : ""}.`}
              </p>

              {files.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${f.size}-${i}`}
                      className="group relative overflow-hidden rounded-lg border border-border bg-background"
                    >
                      <img
                        src={previews[i]}
                        alt=""
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent px-2 pb-1.5 pt-6 text-[10px] text-background">
                        <p className="truncate" title={f.name}>{f.name}</p>
                        <p className="opacity-80">{(f.size / 1024 / 1024).toFixed(2)} Mo</p>
                      </div>
                      <span className="sr-only">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Retirer ${f.name}`}
                        className="absolute right-1 top-1 rounded-full bg-background/95 p-1 text-foreground shadow-soft transition hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-4 text-[15px] font-semibold text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…
                </>
              ) : (
                "Envoyer ma demande"
              )}
            </button>

            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" />
              Vos informations restent confidentielles. Aucune revente de données.
            </p>
          </form>

          {/* Side info */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-border bg-gradient-warm p-6 shadow-soft">
              <h2 className="font-display text-xl">Joindre Parqueto</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Une équipe à taille humaine, des artisans partenaires vérifiés.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href="mailto:contact@parqueto.fr" className="group inline-flex items-center gap-3 text-foreground hover:text-brand-orange">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
                      <Mail className="h-4 w-4 text-brand-orange" />
                    </span>
                    contact@parqueto.fr
                  </a>
                </li>
                <li>
                  <a href="tel:+33184606061" className="group inline-flex items-center gap-3 text-foreground hover:text-brand-orange">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
                      <Phone className="h-4 w-4 text-brand-orange" />
                    </span>
                    01 84 60 60 61
                  </a>
                </li>
                <li className="inline-flex items-center gap-3 text-muted-foreground">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft">
                    <MapPin className="h-4 w-4 text-brand-orange" />
                  </span>
                  France entière · réseau d'artisans
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-base">Notre engagement</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>· Réponse par un interlocuteur humain.</li>
                <li>· Aucun démarchage commercial après votre demande.</li>
                <li>· Vos données restent confidentielles, jamais revendues.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
      <FloatingNav />
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
  autoComplete,
  hint,
  onValidate,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  onValidate?: (name: keyof FormValues, value: string) => void;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
        {required && (
          <>
            <span className="ml-0.5 text-brand-orange" aria-hidden>
              *
            </span>
            <span className="sr-only"> (obligatoire)</span>
          </>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onBlur={(e) => onValidate?.(name as keyof FormValues, e.target.value)}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

