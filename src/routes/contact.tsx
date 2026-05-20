import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, Phone, MapPin, Upload, X, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
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
  nom: z.string().trim().min(2, "Votre nom est requis.").max(80),
  email: z.string().trim().email("Email invalide.").max(255),
  telephone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9 +().-]*$/, "Téléphone invalide.")
    .optional()
    .or(z.literal("")),
  ville: z.string().trim().min(2, "Indiquez votre ville.").max(80),
  projet: z.enum(PROJET_OPTIONS, { errorMap: () => ({ message: "Choisissez un type de projet." }) }),
  message: z.string().trim().min(10, "Décrivez brièvement votre projet (10 caractères min).").max(2000),
});

type FormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const MAX_FILES = 4;
const MAX_FILE_MB = 5;

function ContactPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    Array.from(incoming).forEach((f) => {
      if (next.length >= MAX_FILES) return;
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} : seules les images sont acceptées.`);
        return;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${f.name} dépasse ${MAX_FILE_MB} Mo.`);
        return;
      }
      next.push(f);
    });
    setFiles(next.slice(0, MAX_FILES));
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

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
      // Move focus to the first invalid field for keyboard / SR users.
      const firstKey = Object.keys(fe)[0];
      if (firstKey) {
        const el = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.focus();
      }
      return;
    }
    setErrors({});
    setSubmitting(true);
    // Simulated submission — wire to a server function when available.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
    toast.success("Demande envoyée. Nous revenons vers vous très vite.");
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">
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
    <main className="min-h-screen bg-background text-foreground">
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
              <Field label="Nom" name="nom" error={errors.nom} required autoComplete="name" />
              <Field label="Email" name="email" type="email" error={errors.email} required autoComplete="email" />
              <Field label="Téléphone" name="telephone" type="tel" placeholder="Optionnel" error={errors.telephone} autoComplete="tel" hint="Optionnel" />
              <Field label="Ville" name="ville" error={errors.ville} required autoComplete="address-level2" />
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
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Votre message <span className="text-brand-orange" aria-hidden>*</span>
                <span className="sr-only"> (obligatoire)</span>
              </label>
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
                className={`w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  errors.message ? "border-destructive" : "border-border"
                }`}
              />
              <p id="message-hint" className="mt-1.5 text-xs text-muted-foreground">
                2000 caractères maximum.
              </p>
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-xs text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Photos */}
            <div className="mt-6">
              <span id="photos-label" className="mb-2 block text-sm font-medium">
                Photos du projet
              </span>
              <p id="photos-hint" className="mb-3 text-xs text-muted-foreground">
                Ajoutez quelques photos si vous le souhaitez (jusqu'à {MAX_FILES}, {MAX_FILE_MB} Mo max chacune).
              </p>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                aria-describedby="photos-hint"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground transition hover:border-brand-orange/40 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Upload className="h-4 w-4" aria-hidden />
                Cliquer pour ajouter des photos
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                aria-labelledby="photos-label"
                aria-describedby="photos-hint"
                className="sr-only"
                onChange={(e) => onFiles(e.target.files)}
              />
              <p className="sr-only" aria-live="polite">
                {files.length === 0
                  ? "Aucune photo sélectionnée."
                  : `${files.length} photo${files.length > 1 ? "s" : ""} sélectionnée${files.length > 1 ? "s" : ""}.`}
              </p>
              {files.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {files.map((f, i) => (
                    <li key={i} className="group relative overflow-hidden rounded-lg border border-border bg-background">
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                      <span className="sr-only">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Retirer ${f.name}`}
                        className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground opacity-100 shadow-soft transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
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

