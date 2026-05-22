import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Users,
  ScrollText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/confrerie-du-parquet/candidater")({
  component: CandidaterPage,
  head: () => ({
    meta: [
      {
        title:
          "Candidater à la Confrérie du Parquet — Parqueto",
      },
      {
        name: "description",
        content:
          "Rejoignez la Confrérie du Parquet : communauté privée des parqueteurs vérifiés. Décennale, savoir-faire, charte d'engagement. Réponse sous 7 jours ouvrés.",
      },
      { property: "og:title", content: "Candidater à la Confrérie du Parquet" },
      { property: "og:url", content: "/confrerie-du-parquet/candidater" },
    ],
    links: [
      { rel: "canonical", href: "/confrerie-du-parquet/candidater" },
    ],
  }),
});

type Step = 1 | 2 | 3 | 4;

type FormData = {
  // Étape 1 — identité
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  siret: string;

  // Étape 2 — métier
  yearsExperience: string;
  teamSize: string;
  specialties: string[];
  insurance: boolean;
  insuranceProvider: string;

  // Étape 3 — motivation & cooptation
  sponsor: string;
  motivation: string;
  bestProject: string;

  // Étape 4 — charte
  agreeRespect: boolean;
  agreeShare: boolean;
  agreeClient: boolean;
  agreeConfidentiality: boolean;
};

const SPECIALTIES = [
  "Pose massif",
  "Pose contrecollé",
  "Point de Hongrie",
  "Chevron",
  "Versailles / Chantilly",
  "Mosaïque / Damier",
  "Ponçage & vitrification",
  "Réparation",
  "Huile dure",
  "Restauration ancien",
  "Sinistre / dégât des eaux",
];

const STEPS: { n: Step; label: string; icon: typeof Users }[] = [
  { n: 1, label: "Identité", icon: Users },
  { n: 2, label: "Métier", icon: ShieldCheck },
  { n: 3, label: "Motivation", icon: Sparkles },
  { n: 4, label: "Charte", icon: ScrollText },
];

const COMMITMENTS = [
  {
    key: "agreeRespect" as const,
    title: "Respect entre membres",
    body: "Pas de débauchage agressif, pas de dénigrement public d'un confrère.",
  },
  {
    key: "agreeShare" as const,
    title: "Partage actif",
    body: "Au moins une contribution trimestrielle (question, retour de chantier, photo, conseil).",
  },
  {
    key: "agreeClient" as const,
    title: "Engagements clients honorés",
    body: "Délais tenus, devis respectés, finitions livrées. La Confrérie défend ceux qui défendent leur travail.",
  },
  {
    key: "agreeConfidentiality" as const,
    title: "Confidentialité",
    body: "Les échanges, prix, dossiers et photos partagés en interne restent strictement entre membres.",
  },
];

function CandidaterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    siret: "",
    yearsExperience: "",
    teamSize: "",
    specialties: [],
    insurance: false,
    insuranceProvider: "",
    sponsor: "",
    motivation: "",
    bestProject: "",
    agreeRespect: false,
    agreeShare: false,
    agreeClient: false,
    agreeConfidentiality: false,
  });

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const toggleSpecialty = (s: string) => {
    setData((d) => ({
      ...d,
      specialties: d.specialties.includes(s)
        ? d.specialties.filter((x) => x !== s)
        : [...d.specialties, s],
    }));
  };

  const canNext = (() => {
    if (step === 1) {
      return (
        data.firstName.trim().length > 1 &&
        data.lastName.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(data.email) &&
        data.phone.trim().length >= 8 &&
        data.city.trim().length > 1
      );
    }
    if (step === 2) {
      return (
        data.yearsExperience !== "" &&
        data.teamSize !== "" &&
        data.specialties.length > 0 &&
        data.insurance === true
      );
    }
    if (step === 3) {
      return data.motivation.trim().length >= 40;
    }
    if (step === 4) {
      return (
        data.agreeRespect &&
        data.agreeShare &&
        data.agreeClient &&
        data.agreeConfidentiality
      );
    }
    return false;
  })();

  const next = () => {
    if (!canNext) return;
    if (step < 4) setStep((s) => ((s + 1) as Step));
  };
  const prev = () => {
    if (step > 1) setStep((s) => ((s - 1) as Step));
  };

  const submit = async () => {
    if (!canNext) return;
    setSubmitting(true);
    try {
      // Stockage local de la candidature (back-office à brancher plus tard)
      const payload = {
        ...data,
        submittedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        const prevList = JSON.parse(
          window.localStorage.getItem("parqueto.confrerie.candidatures") ?? "[]"
        );
        window.localStorage.setItem(
          "parqueto.confrerie.candidatures",
          JSON.stringify([...prevList, payload])
        );
      }
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Candidature envoyée — réponse sous 7 jours ouvrés.");
      navigate({ to: "/confrerie-du-parquet/candidater/merci" });
    } catch (e) {
      toast.error("Une erreur est survenue. Réessayez ou écrivez-nous.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <Link
            to="/confrerie-du-parquet"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la Confrérie
          </Link>
          <h1 className="mt-5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Candidater à la{" "}
            <span className="italic text-brand-orange">Confrérie du Parquet.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Quatre étapes, 4 à 6 minutes. Toutes les candidatures sont examinées par
            un comité de membres fondateurs. Réponse sous 7 jours ouvrés.
          </p>

          {/* Stepper */}
          <ol className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STEPS.map((s) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <li
                  key={s.n}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                    active
                      ? "border-brand-orange/50 bg-card shadow-soft"
                      : done
                      ? "border-border bg-card"
                      : "border-border/60 bg-card/50 text-muted-foreground"
                  }`}
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      done
                        ? "bg-brand-orange text-primary-foreground"
                        : active
                        ? "bg-brand-orange/15 text-brand-orange"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                  </span>
                  <span className="font-medium">{s.label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-10">
            {step === 1 && (
              <fieldset className="space-y-5">
                <legend className="font-display text-xl">Votre identité</legend>
                <p className="text-sm text-muted-foreground">
                  Ces informations restent confidentielles et ne servent qu'à la vérification du dossier.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom" value={data.firstName} onChange={(v) => update("firstName", v)} />
                  <Field label="Nom" value={data.lastName} onChange={(v) => update("lastName", v)} />
                  <Field label="Entreprise (raison sociale)" value={data.company} onChange={(v) => update("company", v)} />
                  <Field label="SIRET" placeholder="14 chiffres" value={data.siret} onChange={(v) => update("siret", v)} />
                  <Field label="Email pro" type="email" value={data.email} onChange={(v) => update("email", v)} />
                  <Field label="Téléphone" type="tel" value={data.phone} onChange={(v) => update("phone", v)} />
                  <Field label="Ville d'activité" value={data.city} onChange={(v) => update("city", v)} className="sm:col-span-2" />
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-6">
                <legend className="font-display text-xl">Votre métier</legend>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Années d'expérience"
                    value={data.yearsExperience}
                    onChange={(v) => update("yearsExperience", v)}
                    options={["< 3 ans", "3 – 7 ans", "8 – 15 ans", "+ 15 ans"]}
                  />
                  <Select
                    label="Taille de l'équipe"
                    value={data.teamSize}
                    onChange={(v) => update("teamSize", v)}
                    options={["Seul", "2 – 3", "4 – 9", "10 et +"]}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Spécialités (au moins une)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((s) => {
                      const on = data.specialties.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpecialty(s)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            on
                              ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                              : "border-border bg-background text-muted-foreground hover:border-brand-orange/40 hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={data.insurance}
                      onChange={(e) => update("insurance", e.target.checked)}
                      className="mt-1 h-4 w-4 accent-brand-orange"
                    />
                    <span className="text-sm">
                      <strong className="font-semibold text-foreground">
                        Je dispose d'une assurance décennale en cours
                      </strong>{" "}
                      — pré-requis pour intégrer la Confrérie.
                    </span>
                  </label>
                  {data.insurance && (
                    <div className="mt-4">
                      <Field
                        label="Assureur (facultatif)"
                        value={data.insuranceProvider}
                        onChange={(v) => update("insuranceProvider", v)}
                      />
                    </div>
                  )}
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="space-y-5">
                <legend className="font-display text-xl">Motivation & cooptation</legend>

                <Field
                  label="Membre qui vous parraine (facultatif)"
                  placeholder="Prénom Nom — si vous avez été coopté"
                  value={data.sponsor}
                  onChange={(v) => update("sponsor", v)}
                />

                <Textarea
                  label="Pourquoi rejoindre la Confrérie ? *"
                  hint="40 caractères minimum. Soyez sincère — c'est ce que le comité lit en premier."
                  value={data.motivation}
                  onChange={(v) => update("motivation", v)}
                  rows={5}
                />

                <Textarea
                  label="Un chantier dont vous êtes fier (facultatif)"
                  hint="Type de pose, essence, difficulté technique, contexte."
                  value={data.bestProject}
                  onChange={(v) => update("bestProject", v)}
                  rows={4}
                />
              </fieldset>
            )}

            {step === 4 && (
              <fieldset className="space-y-5">
                <legend className="font-display text-xl">La charte</legend>
                <p className="text-sm text-muted-foreground">
                  Quatre engagements non négociables. Cochez chacun pour valider votre candidature.
                </p>
                <ul className="space-y-3">
                  {COMMITMENTS.map((c) => (
                    <li
                      key={c.key}
                      className="rounded-xl border border-border bg-background/60 p-4"
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={data[c.key]}
                          onChange={(e) => update(c.key, e.target.checked)}
                          className="mt-1 h-4 w-4 accent-brand-orange"
                        />
                        <span>
                          <span className="block font-display text-base text-foreground">
                            {c.title}
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            {c.body}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand-orange/40 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </button>
              <span className="text-xs text-muted-foreground">
                Étape {step} sur 4
              </span>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canNext || submitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                    </>
                  ) : (
                    <>
                      Envoyer ma candidature <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En envoyant cette candidature, vous acceptez d'être recontacté par
            l'équipe Parqueto pour la vérification de votre dossier.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
      >
        <option value="">— Choisir —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
