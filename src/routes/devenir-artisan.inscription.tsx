import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Hammer,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Upload,
  X,
  Sparkles,
  Lock,
  FileText,
  Award,
  Pencil,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/devenir-artisan/inscription")({
  component: ArtisanOnboarding,
  head: () => ({
    meta: [
      { title: "Inscription artisan partenaire — Parqueto" },
      {
        name: "description",
        content:
          "Créez votre profil d'artisan parqueteur Parqueto en quelques minutes : zone d'intervention, spécialités, réalisations, assurance.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

type Specialite =
  | "pose_flottante"
  | "pose_collee"
  | "pose_clouee"
  | "ponçage_vitrification"
  | "renovation"
  | "chevron_hongrie"
  | "escaliers"
  | "terrasse_bois";

type Essence =
  | "chene"
  | "chataignier"
  | "exotiques"
  | "resineux"
  | "ancien_recupere";

type Finition = "huile" | "vitrification" | "cire" | "savon_noir";

type FormeJuridique =
  | "auto_entrepreneur"
  | "ei"
  | "eurl"
  | "sarl"
  | "sas"
  | "sasu"
  | "autre";

type DocFile = { name: string; dataUrl: string; size: number } | null;

type FormState = {
  // Étape 1 — Identité
  raisonSociale: string;
  representant: string;
  email: string;
  telephone: string;
  siret: string;
  anneesExperience: string;
  // Étape 2 — Zone
  adresse: string;
  ville: string;
  codePostal: string;
  rayonKm: number;
  // Étape 3 — Métier
  specialites: Specialite[];
  essences: Essence[];
  finitions: Finition[];
  poseMin: string;
  capaciteMois: string;
  delaiDemarrage: string;
  tarifIndicatif: string;
  // Étape 4 — Réalisations
  photos: { name: string; dataUrl: string }[];
  bio: string;
  anneeCreation: string;
  effectif: string;
  chantierSignature: string;
  siteWeb: string;
  instagram: string;
  // Étape 5 — Statut & assurances
  formeJuridique: FormeJuridique | "";
  justificatif: DocFile;
  decennaleCompagnie: string;
  decennaleNumero: string;
  decennaleValidite: string;
  decennaleAttestation: DocFile;
  rcProCompagnie: string;
  rcProNumero: string;
  qualibat: boolean;
  rge: boolean;
  // Étape 6 — Récap & validation
  cgu: boolean;
  chartQualite: boolean;
  exactitude: boolean;
};

const STORAGE_KEY = "parqueto.artisan.inscription";

const SPECIALITE_LABELS: Record<Specialite, string> = {
  pose_flottante: "Pose flottante",
  pose_collee: "Pose collée",
  pose_clouee: "Pose clouée (massif)",
  ponçage_vitrification: "Ponçage & vitrification",
  renovation: "Rénovation parquet ancien",
  chevron_hongrie: "Chevron / Point de Hongrie",
  escaliers: "Escaliers bois",
  terrasse_bois: "Terrasse extérieure",
};

const ESSENCE_LABELS: Record<Essence, string> = {
  chene: "Chêne",
  chataignier: "Châtaignier",
  exotiques: "Bois exotiques",
  resineux: "Résineux (pin, sapin)",
  ancien_recupere: "Bois ancien / récupéré",
};

const FINITION_LABELS: Record<Finition, string> = {
  huile: "Huile naturelle",
  vitrification: "Vitrification",
  cire: "Cire traditionnelle",
  savon_noir: "Savon noir",
};

const FORME_LABELS: Record<FormeJuridique, string> = {
  auto_entrepreneur: "Auto-entrepreneur / Micro-entreprise",
  ei: "Entreprise individuelle (EI)",
  eurl: "EURL",
  sarl: "SARL",
  sas: "SAS",
  sasu: "SASU",
  autre: "Autre",
};

const initialState: FormState = {
  raisonSociale: "",
  representant: "",
  email: "",
  telephone: "",
  siret: "",
  anneesExperience: "",
  adresse: "",
  ville: "",
  codePostal: "",
  rayonKm: 25,
  specialites: [],
  essences: [],
  finitions: [],
  poseMin: "",
  capaciteMois: "",
  delaiDemarrage: "",
  tarifIndicatif: "",
  photos: [],
  bio: "",
  anneeCreation: "",
  effectif: "",
  chantierSignature: "",
  siteWeb: "",
  instagram: "",
  formeJuridique: "",
  justificatif: null,
  decennaleCompagnie: "",
  decennaleNumero: "",
  decennaleValidite: "",
  decennaleAttestation: null,
  rcProCompagnie: "",
  rcProNumero: "",
  qualibat: false,
  rge: false,
  cgu: false,
  chartQualite: false,
  exactitude: false,
};

const STEPS = [
  { id: 1, label: "Identité", icon: Building2 },
  { id: 2, label: "Zone", icon: MapPin },
  { id: 3, label: "Métier", icon: Hammer },
  { id: 4, label: "Réalisations", icon: Camera },
  { id: 5, label: "Assurances", icon: ShieldCheck },
  { id: 6, label: "Récap", icon: ClipboardCheck },
] as const;

function ArtisanOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Hydratation depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm({ ...initialState, ...parsed.form });
        setStep(parsed.step ?? 1);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persistance
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
    } catch {
      /* ignore */
    }
  }, [form, step]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSpecialite = (s: Specialite) =>
    setForm((prev) => ({
      ...prev,
      specialites: prev.specialites.includes(s)
        ? prev.specialites.filter((x) => x !== s)
        : [...prev.specialites, s],
    }));

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const limit = 6 - form.photos.length;
    const slice = Array.from(files).slice(0, Math.max(0, limit));
    slice.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, { name: file.name, dataUrl }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (i: number) =>
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }));

  const toggleEssence = (e: Essence) =>
    setForm((prev) => ({
      ...prev,
      essences: prev.essences.includes(e)
        ? prev.essences.filter((x) => x !== e)
        : [...prev.essences, e],
    }));

  const toggleFinition = (f: Finition) =>
    setForm((prev) => ({
      ...prev,
      finitions: prev.finitions.includes(f)
        ? prev.finitions.filter((x) => x !== f)
        : [...prev.finitions, f],
    }));

  const onDoc = (key: "justificatif" | "decennaleAttestation", file: File | null) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return;
    const ok = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!ok.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        [key]: { name: file.name, dataUrl: reader.result as string, size: file.size },
      }));
    };
    reader.readAsDataURL(file);
  };

  const labelJustificatif =
    form.formeJuridique === "auto_entrepreneur" || form.formeJuridique === "ei"
      ? "Certificat d'immatriculation INSEE / extrait Sirene"
      : "Extrait Kbis (moins de 3 mois)";

  const validity = useMemo(() => {
    const v: Record<number, boolean> = {
      1:
        form.raisonSociale.trim().length > 1 &&
        form.representant.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(form.email) &&
        form.telephone.replace(/\D/g, "").length >= 9 &&
        form.siret.replace(/\D/g, "").length === 14,
      2:
        form.ville.trim().length > 1 &&
        /^\d{5}$/.test(form.codePostal) &&
        form.rayonKm >= 5,
      3:
        form.specialites.length >= 1 &&
        form.essences.length >= 1 &&
        form.finitions.length >= 1,
      4:
        form.photos.length >= 1 &&
        form.bio.trim().length >= 40 &&
        /^\d{4}$/.test(form.anneeCreation) &&
        Number(form.anneeCreation) >= 1900 &&
        Number(form.anneeCreation) <= new Date().getFullYear(),
      5:
        form.formeJuridique !== "" &&
        form.justificatif !== null &&
        form.decennaleCompagnie.trim().length > 1 &&
        form.decennaleNumero.trim().length > 3 &&
        /^\d{4}-\d{2}-\d{2}$/.test(form.decennaleValidite) &&
        new Date(form.decennaleValidite) > new Date() &&
        form.decennaleAttestation !== null &&
        form.rcProCompagnie.trim().length > 1 &&
        form.rcProNumero.trim().length > 3,
      6: form.cgu && form.chartQualite && form.exactitude,
    };
    return v;
  }, [form]);

  const progress = Math.round(((step - 1) / STEPS.length) * 100);

  const handleNext = () => {
    if (!validity[step]) return;
    if (step < STEPS.length) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // soumission
      setSubmitted(true);
      try {
        localStorage.setItem(
          "parqueto.artisan.submitted",
          JSON.stringify({ form, at: new Date().toISOString() }),
        );
      } catch {
        /* ignore */
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
        <Header />
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 font-serif text-4xl tracking-tight">
            Candidature transmise
          </h1>
          <p className="mt-4 text-muted-foreground">
            Merci <strong className="text-foreground">{form.representant.split(" ")[0]}</strong>.
            Nous étudions votre profil sous 48&nbsp;h ouvrées. Un membre de l'équipe
            Parqueto vous appellera au <strong>{form.telephone}</strong> pour finaliser
            votre intégration au réseau.
          </p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
              Prochaines étapes
            </p>
            <ol className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-serif text-lg text-brand-orange">1.</span>
                <span>Vérification de votre SIRET et de votre attestation d'assurance décennale.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-lg text-brand-orange">2.</span>
                <span>Appel de 15&nbsp;min pour valider votre zone, vos disponibilités et vos tarifs indicatifs.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-lg text-brand-orange">3.</span>
                <span>Activation de votre tableau de bord et de vos 3 premiers projets offerts.</span>
              </li>
            </ol>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Retour à la page artisan
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setForm(initialState);
                setStep(1);
                setSubmitted(false);
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Retour à l'accueil
            </button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* En-tête */}
      <section className="border-b border-border/60 bg-gradient-to-b from-brand-cream to-background">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
          <Link
            to="/devenir-artisan"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Retour
          </Link>
          <div className="mt-4 flex items-start justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                <Sparkles className="h-3.5 w-3.5" /> Inscription artisan
              </span>
              <h1 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
                Rejoignez le réseau Parqueto
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                5 étapes, environ 5 minutes. Vos informations sont sauvegardées
                au fil de l'eau — vous pouvez revenir plus tard.
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Étape</p>
              <p className="font-serif text-3xl text-brand-orange-deep">
                {step}<span className="text-muted-foreground">/{STEPS.length}</span>
              </p>
            </div>
          </div>

          {/* Stepper */}
          <ol className="mt-8 grid grid-cols-5 gap-2">
            {STEPS.map((s) => {
              const active = s.id === step;
              const done = s.id < step;
              const Icon = s.icon;
              return (
                <li key={s.id} className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => s.id < step && setStep(s.id)}
                    disabled={s.id > step}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      active
                        ? "border-brand-orange bg-brand-orange text-primary-foreground shadow-warm"
                        : done
                          ? "border-emerald-500 bg-emerald-500 text-white cursor-pointer hover:scale-105"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                    aria-label={`Étape ${s.id} : ${s.label}`}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </button>
                  <span
                    className={`text-center text-[10px] font-medium uppercase tracking-wider sm:text-xs ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-deep transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-10">
            {/* Étape 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <header>
                  <h2 className="font-serif text-2xl tracking-tight">Votre entreprise</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Informations administratives — vérifiées avant activation.
                  </p>
                </header>

                <Field label="Raison sociale" required>
                  <input
                    type="text"
                    value={form.raisonSociale}
                    onChange={(e) => update("raisonSociale", e.target.value)}
                    placeholder="Ex. Atelier Bois & Tradition"
                    className={inputCls}
                    maxLength={120}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Représentant légal" required>
                    <input
                      type="text"
                      value={form.representant}
                      onChange={(e) => update("representant", e.target.value)}
                      placeholder="Prénom Nom"
                      className={inputCls}
                      maxLength={80}
                    />
                  </Field>
                  <Field label="Années d'expérience">
                    <select
                      value={form.anneesExperience}
                      onChange={(e) => update("anneesExperience", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Sélectionner…</option>
                      <option value="0-2">Moins de 2 ans</option>
                      <option value="2-5">2 à 5 ans</option>
                      <option value="5-10">5 à 10 ans</option>
                      <option value="10-20">10 à 20 ans</option>
                      <option value="20+">Plus de 20 ans</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email professionnel" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="contact@votre-atelier.fr"
                      className={inputCls}
                      maxLength={255}
                    />
                  </Field>
                  <Field label="Téléphone" required>
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={(e) => update("telephone", e.target.value)}
                      placeholder="06 12 34 56 78"
                      className={inputCls}
                      maxLength={20}
                    />
                  </Field>
                </div>

                <Field label="SIRET" hint="14 chiffres" required>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.siret}
                    onChange={(e) =>
                      update("siret", e.target.value.replace(/[^\d ]/g, "").slice(0, 17))
                    }
                    placeholder="123 456 789 00012"
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {/* Étape 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <header>
                  <h2 className="font-serif text-2xl tracking-tight">Votre zone d'intervention</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nous ne vous transmettrons que des projets dans ce périmètre.
                  </p>
                </header>

                <Field label="Adresse de l'atelier">
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => update("adresse", e.target.value)}
                    placeholder="12 rue des Artisans"
                    className={inputCls}
                    maxLength={150}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                  <Field label="Ville" required>
                    <input
                      type="text"
                      value={form.ville}
                      onChange={(e) => update("ville", e.target.value)}
                      placeholder="Lyon"
                      className={inputCls}
                      maxLength={80}
                    />
                  </Field>
                  <Field label="Code postal" required>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.codePostal}
                      onChange={(e) =>
                        update("codePostal", e.target.value.replace(/\D/g, "").slice(0, 5))
                      }
                      placeholder="69006"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field
                  label={`Rayon d'intervention — ${form.rayonKm} km`}
                  hint="Distance maximale autour de votre atelier"
                >
                  <input
                    type="range"
                    min={5}
                    max={150}
                    step={5}
                    value={form.rayonKm}
                    onChange={(e) => update("rayonKm", Number(e.target.value))}
                    className="w-full accent-[var(--brand-orange)]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>5 km</span>
                    <span>75 km</span>
                    <span>150 km</span>
                  </div>
                </Field>

                <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Astuce :</strong> un rayon
                    réaliste (20–40 km) génère plus de projets de qualité que
                    150 km, où vos frais de déplacement deviennent prohibitifs.
                  </p>
                </div>
              </div>
            )}

            {/* Étape 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <header>
                  <h2 className="font-serif text-2xl tracking-tight">Votre métier</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sélectionnez les prestations que vous proposez (au moins une).
                  </p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(SPECIALITE_LABELS) as Specialite[]).map((s) => {
                    const active = form.specialites.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpecialite(s)}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm transition ${
                          active
                            ? "border-brand-orange bg-brand-orange/5 shadow-soft"
                            : "border-border bg-background hover:border-brand-orange/50"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                            active
                              ? "border-brand-orange bg-brand-orange text-white"
                              : "border-border"
                          }`}
                        >
                          {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </span>
                        <span className={active ? "font-semibold" : ""}>
                          {SPECIALITE_LABELS[s]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Field label="Surface minimum acceptée" hint="Optionnel — filtre les petits chantiers">
                  <select
                    value={form.poseMin}
                    onChange={(e) => update("poseMin", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Aucun minimum</option>
                    <option value="10">À partir de 10 m²</option>
                    <option value="20">À partir de 20 m²</option>
                    <option value="30">À partir de 30 m²</option>
                    <option value="50">À partir de 50 m²</option>
                  </select>
                </Field>
              </div>
            )}

            {/* Étape 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <header>
                  <h2 className="font-serif text-2xl tracking-tight">Vos réalisations</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Au moins 1 photo (jusqu'à 6) et une courte présentation.
                    C'est ce que les clients verront en premier.
                  </p>
                </header>

                <div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {form.photos.map((p, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                      >
                        <img
                          src={p.dataUrl}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-background backdrop-blur transition hover:bg-foreground"
                          aria-label="Supprimer la photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {form.photos.length < 6 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 text-xs text-muted-foreground transition hover:border-brand-orange hover:bg-brand-orange/5 hover:text-foreground"
                      >
                        <Upload className="h-5 w-5" />
                        Ajouter
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      onPhotos(e.target.files);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG ou PNG, 5 Mo max par photo. {form.photos.length}/6 ajoutées.
                  </p>
                </div>

                <Field
                  label="Présentation de votre atelier"
                  hint={`${form.bio.length}/500 caractères — min. 40`}
                  required
                >
                  <textarea
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value.slice(0, 500))}
                    rows={5}
                    placeholder="Ex. Atelier familial transmis depuis 1987. Spécialiste de la rénovation de parquets anciens et de la pose de chevron à Lyon et alentours…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            )}

            {/* Étape 5 */}
            {step === 5 && (
              <div className="space-y-6">
                <header>
                  <h2 className="font-serif text-2xl tracking-tight">Assurance & conditions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Obligatoire pour rejoindre le réseau. Justificatif demandé après validation.
                  </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Compagnie d'assurance décennale" required>
                    <input
                      type="text"
                      value={form.assuranceDecennale}
                      onChange={(e) => update("assuranceDecennale", e.target.value)}
                      placeholder="Ex. MAAF Pro, SMABTP…"
                      className={inputCls}
                      maxLength={80}
                    />
                  </Field>
                  <Field label="N° de contrat" required>
                    <input
                      type="text"
                      value={form.numeroDecennale}
                      onChange={(e) => update("numeroDecennale", e.target.value)}
                      placeholder="Ex. 1234567890"
                      className={inputCls}
                      maxLength={40}
                    />
                  </Field>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 transition hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={form.rcPro}
                    onChange={(e) => update("rcPro", e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[var(--brand-orange)]"
                  />
                  <span className="text-sm">
                    <strong>Je dispose d'une RC Pro</strong> et d'une assurance décennale
                    en cours de validité.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 transition hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={form.cgu}
                    onChange={(e) => update("cgu", e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[var(--brand-orange)]"
                  />
                  <span className="text-sm">
                    J'accepte la{" "}
                    <Link to="/" className="font-semibold text-brand-orange-deep underline">
                      charte qualité
                    </Link>{" "}
                    et les conditions du réseau Parqueto.
                  </span>
                </label>

                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Vos données ne sont jamais revendues. Elles servent uniquement
                    à vérifier votre profil et à vous mettre en relation avec des clients
                    qualifiés.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!validity[step]}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {step === STEPS.length ? "Envoyer ma candidature" : "Continuer"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Votre saisie est sauvegardée automatiquement dans ce navigateur.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="ml-1 text-brand-orange">*</span>}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
