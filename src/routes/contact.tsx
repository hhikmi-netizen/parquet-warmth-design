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
    const fd = new FormData(e.currentTarget);
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
            className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom" name="nom" error={errors.nom} required autoComplete="name" />
              <Field label="Email" name="email" type="email" error={errors.email} required autoComplete="email" />
              <Field label="Téléphone" name="telephone" type="tel" placeholder="Optionnel" error={errors.telephone} autoComplete="tel" />
              <Field label="Ville" name="ville" error={errors.ville} required autoComplete="address-level2" />
            </div>

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-foreground">
                Type de projet <span className="text-brand-orange">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {PROJET_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:border-brand-orange/50 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange has-[:checked]:text-primary-foreground"
                  >
                    <input type="radio" name="projet" value={opt} className="sr-only" />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.projet && (
                <p className="mt-2 text-xs text-destructive">{errors.projet}</p>
              )}
            </fieldset>

            <div className="mt-6">
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Votre message <span className="text-brand-orange">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={2000}
                placeholder="Décrivez brièvement votre projet : surface, état actuel, délais souhaités…"
                className={`w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${
                  errors.message ? "border-destructive" : "border-border"
                }`}
              />
              {errors.message && (
                <p className="mt-2 text-xs text-destructive">{errors.message}</p>
              )}
            </div>

            {/* Photos */}
            <div className="mt-6">
              <span className="mb-2 block text-sm font-medium">Photos du projet</span>
              <p className="mb-3 text-xs text-muted-foreground">
                Ajoutez quelques photos si vous le souhaitez (jusqu'à {MAX_FILES}, {MAX_FILE_MB} Mo max chacune).
              </p>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                <Upload className="h-4 w-4" />
                Cliquer pour ajouter des photos
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              {files.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {files.map((f, i) => (
                    <li key={i} className="group relative overflow-hidden rounded-lg border border-border bg-background">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Retirer ${f.name}`}
                        className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground opacity-0 shadow-soft transition group-hover:opacity-100 focus:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-4 text-[15px] font-semibold text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-brand-orange">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
