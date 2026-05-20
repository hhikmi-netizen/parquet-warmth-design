import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// ---------- Modèle de calcul ----------
type ServiceKey = "poncage" | "vitrification" | "pose" | "renovation";
type TypeKey = "contrecolle" | "massif" | "ancien";
type EtatKey = "bon" | "moyen" | "abime";

const services: Record<ServiceKey, { label: string; min: number; max: number }> = {
  poncage: { label: "Ponçage", min: 25, max: 40 },
  vitrification: { label: "Vitrification", min: 15, max: 28 },
  pose: { label: "Pose", min: 45, max: 90 },
  renovation: { label: "Rénovation complète", min: 60, max: 110 },
};

const types: Record<TypeKey, { label: string; factor: number }> = {
  contrecolle: { label: "Contrecollé", factor: 1 },
  massif: { label: "Massif", factor: 1.15 },
  ancien: { label: "Parquet ancien", factor: 1.35 },
};

const etats: Record<EtatKey, { label: string; factor: number; hint: string }> = {
  bon: { label: "Bon état", factor: 0.95, hint: "Quelques rayures, finition usée" },
  moyen: { label: "État moyen", factor: 1, hint: "Tâches, rayures profondes" },
  abime: { label: "Très abîmé", factor: 1.15, hint: "Lames à reprendre, trous, fissures" },
};

const PLINTHE_PRICE = 18; // €/ml
const SEUIL_PRICE = 110;  // €/u

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n / 10) * 10);
const fmtNum = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n);

// ---------- Persistance ----------
const STORAGE_KEY = "parqueto:estimate:v1";

type EstimateState = {
  service: ServiceKey;
  type: TypeKey;
  etat: EtatKey;
  longueur: number;
  largeur: number;
  plinthes: boolean;
  seuils: number;
};

const DEFAULT_STATE: EstimateState = {
  service: "poncage",
  type: "contrecolle",
  etat: "moyen",
  longueur: 5,
  largeur: 4,
  plinthes: false,
  seuils: 0,
};

function loadState(): EstimateState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

// ---------- Validation contact ----------
const contactSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(160),
  telephone: z
    .string()
    .trim()
    .regex(/^[0-9 +().-]{8,20}$/, "Téléphone invalide"),
  cp: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres"),
  message: z.string().trim().max(500, "500 caractères max").optional(),
});
type ContactInput = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactInput, string>>;

// ---------- Composant ----------
export function Estimator() {
  const [s, setS] = useState<EstimateState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    setS(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s, hydrated]);

  const surface = s.longueur * s.largeur;
  const perimetre = (s.longueur + s.largeur) * 2;

  const totals = useMemo(() => {
    const svc = services[s.service];
    const t = types[s.type];
    const e = etats[s.etat];
    const baseMin = svc.min * t.factor * e.factor * surface;
    const baseMax = svc.max * t.factor * e.factor * surface;
    const plinthesCost = s.plinthes ? perimetre * PLINTHE_PRICE : 0;
    const seuilsCost = s.seuils * SEUIL_PRICE;
    const extras = plinthesCost + seuilsCost;
    return {
      min: baseMin + extras,
      max: baseMax + extras,
      surface,
      perimetre,
      plinthesCost,
      seuilsCost,
    };
  }, [s, surface, perimetre]);

  return (
    <div className="rounded-2xl border border-background/15 bg-background/5 p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Mini-simulation
          </p>
          <h3 className="mt-1 font-display text-2xl text-background">
            Personnalisez votre estimation
          </h3>
        </div>
        <span className="rounded-full border border-background/20 px-2 py-0.5 text-[10px] font-semibold text-background/70">
          Indicatif
        </span>
      </div>

      {/* Prestation */}
      <Field label="Prestation">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(services) as ServiceKey[]).map((k) => (
            <Pill
              key={k}
              active={s.service === k}
              onClick={() => setS((x) => ({ ...x, service: k }))}
              variant="solid"
            >
              {services[k].label}
            </Pill>
          ))}
        </div>
      </Field>

      {/* Type */}
      <Field label="Type de parquet">
        <div className="flex gap-1.5">
          {(Object.keys(types) as TypeKey[]).map((k) => (
            <Pill
              key={k}
              active={s.type === k}
              onClick={() => setS((x) => ({ ...x, type: k }))}
              className="flex-1"
            >
              {types[k].label}
            </Pill>
          ))}
        </div>
      </Field>

      {/* État */}
      <Field label="État actuel">
        <div className="grid gap-1.5 sm:grid-cols-3">
          {(Object.keys(etats) as EtatKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setS((x) => ({ ...x, etat: k }))}
              className={`rounded-lg border px-3 py-2.5 text-left transition ${
                s.etat === k
                  ? "border-brand-orange bg-brand-orange/15"
                  : "border-background/15 bg-background/5 hover:border-background/30"
              }`}
            >
              <div className={`text-xs font-semibold ${s.etat === k ? "text-brand-orange" : "text-background"}`}>
                {etats[k].label}
              </div>
              <div className="mt-0.5 text-[10px] text-background/55 leading-snug">
                {etats[k].hint}
              </div>
            </button>
          ))}
        </div>
      </Field>

      {/* Dimensions */}
      <Field label={`Dimensions · ${fmtNum(surface)} m²`}>
        <div className="grid grid-cols-2 gap-2">
          <DimInput
            label="Longueur"
            value={s.longueur}
            onChange={(v) => setS((x) => ({ ...x, longueur: v }))}
          />
          <DimInput
            label="Largeur"
            value={s.largeur}
            onChange={(v) => setS((x) => ({ ...x, largeur: v }))}
          />
        </div>
      </Field>

      {/* Options pliables */}
      <button
        onClick={() => setShowOptions((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-lg border border-dashed border-background/20 px-3 py-2.5 text-left text-xs font-semibold text-background/80 transition hover:border-background/40"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
          Options : plinthes & seuils
        </span>
        {showOptions ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>

      {showOptions && (
        <div className="mt-3 space-y-3 rounded-xl border border-background/10 bg-background/5 p-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={s.plinthes}
              onChange={(e) => setS((x) => ({ ...x, plinthes: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-[color:var(--brand-orange)]"
            />
            <span className="flex-1">
              <span className="block text-xs font-semibold text-background">
                Plinthes assorties
              </span>
              <span className="block text-[11px] text-background/55">
                Périmètre estimé : {fmtNum(perimetre)} ml · {PLINTHE_PRICE} €/ml posés
              </span>
            </span>
            {s.plinthes && (
              <span className="font-display text-sm text-brand-orange">
                +{fmt(totals.plinthesCost)} €
              </span>
            )}
          </label>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs font-semibold text-background">Seuils de porte</div>
              <div className="text-[11px] text-background/55">
                {SEUIL_PRICE} € pièce, pose & finition incluses
              </div>
            </div>
            <Stepper value={s.seuils} onChange={(v) => setS((x) => ({ ...x, seuils: v }))} />
          </div>
        </div>
      )}

      {/* Résultat */}
      <div className="mt-5 rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-background/65">
          Votre fourchette estimée
        </div>
        <div className="mt-1 font-display text-3xl text-background sm:text-4xl">
          {fmt(totals.min)} – {fmt(totals.max)}{" "}
          <span className="text-lg text-background/60">€ TTC</span>
        </div>
        <p className="mt-1 text-[11px] text-background/60">
          Fourchette indicative, hors fournitures spécifiques.
        </p>
      </div>

      {/* CTA principal */}
      {!showContact ? (
        <button
          onClick={() => setShowContact(true)}
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep active:scale-[0.98]"
        >
          Être recontacté avec ce devis
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      ) : (
        <ContactForm
          totals={totals}
          state={s}
          onCancel={() => setShowContact(false)}
        />
      )}

      <div className="mt-4 flex items-center justify-between text-[11px] text-background/55">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-brand-orange" /> Recontact sous 24 h
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-brand-orange" /> Sans engagement
        </span>
      </div>
    </div>
  );
}

// ---------- Sous-composants ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-background/60">
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  className = "",
  variant = "soft",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "soft";
}) {
  const base =
    "rounded-lg border px-3 py-2.5 text-xs font-semibold transition active:scale-[0.97] min-h-[40px]";
  const inactive =
    "border-background/15 bg-background/5 text-background/80 hover:border-background/30";
  const activeCls =
    variant === "solid"
      ? "border-brand-orange bg-brand-orange text-primary-foreground"
      : "border-brand-orange bg-brand-orange/15 text-brand-orange";
  return (
    <button onClick={onClick} className={`${base} ${active ? activeCls : inactive} ${className}`}>
      {children}
    </button>
  );
}

function DimInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-background/55">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-background/15 bg-background/5 focus-within:border-brand-orange">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-3 py-2.5 font-display text-lg text-background outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="pr-3 text-xs text-background/55">m</span>
      </div>
    </label>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-background/15 bg-background/5">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-9 w-9 items-center justify-center text-background/80 transition hover:bg-background/10 active:scale-95"
        aria-label="Diminuer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-9 text-center font-display text-base text-background">{value}</span>
      <button
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex h-9 w-9 items-center justify-center text-background/80 transition hover:bg-background/10 active:scale-95"
        aria-label="Augmenter"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ---------- Formulaire contact ----------
function ContactForm({
  totals,
  state,
  onCancel,
}: {
  totals: { min: number; max: number; surface: number; perimetre: number };
  state: EstimateState;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ContactInput>({
    nom: "",
    email: "",
    telephone: "",
    cp: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof ContactInput, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSending(true);
    const body = [
      `Bonjour,`,
      ``,
      `Je souhaite être recontacté pour le projet suivant :`,
      ``,
      `• Prestation : ${services[state.service].label}`,
      `• Type : ${types[state.type].label}`,
      `• État : ${etats[state.etat].label}`,
      `• Surface : ${fmtNum(totals.surface)} m² (${state.longueur} × ${state.largeur} m)`,
      state.plinthes ? `• Plinthes : oui (${fmtNum(totals.perimetre)} ml)` : null,
      state.seuils > 0 ? `• Seuils : ${state.seuils}` : null,
      ``,
      `Fourchette estimée : ${fmt(totals.min)} – ${fmt(totals.max)} € TTC`,
      ``,
      `— ${parsed.data.nom}`,
      `Tél. ${parsed.data.telephone} · CP ${parsed.data.cp}`,
      parsed.data.message ? `\nMessage : ${parsed.data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `mailto:contact@parqueto.fr?subject=${encodeURIComponent(
      `Demande de devis parquet — ${fmt(totals.min)}–${fmt(totals.max)} €`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 600);
  };

  if (sent) {
    return (
      <div className="mt-4 rounded-xl border border-brand-orange/40 bg-brand-orange/10 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-brand-orange" />
        <h4 className="mt-2 font-display text-xl text-background">Demande envoyée</h4>
        <p className="mt-1 text-xs text-background/70">
          Un artisan vous recontacte sous 24 h. Votre estimation est sauvegardée.
        </p>
        <button
          onClick={() => {
            setSent(false);
            onCancel();
          }}
          className="mt-3 text-xs font-semibold text-brand-orange underline-offset-4 hover:underline"
        >
          Modifier mon estimation
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-background/15 bg-background/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-background">Vos coordonnées</div>
        <button
          onClick={onCancel}
          className="text-[11px] text-background/55 underline-offset-4 hover:underline"
        >
          Annuler
        </button>
      </div>

      <FormField
        label="Nom complet"
        value={form.nom}
        onChange={(v) => set("nom", v)}
        error={errors.nom}
        placeholder="Camille Dubois"
        autoComplete="name"
      />
      <FormField
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => set("email", v)}
        error={errors.email}
        placeholder="camille@exemple.fr"
        autoComplete="email"
        inputMode="email"
      />
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <FormField
          label="Téléphone"
          value={form.telephone}
          onChange={(v) => set("telephone", v)}
          error={errors.telephone}
          placeholder="06 12 34 56 78"
          autoComplete="tel"
          inputMode="tel"
        />
        <FormField
          label="CP"
          value={form.cp}
          onChange={(v) => set("cp", v.replace(/\D/g, "").slice(0, 5))}
          error={errors.cp}
          placeholder="75011"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={5}
        />
      </div>
      <FormField
        label="Message (optionnel)"
        value={form.message ?? ""}
        onChange={(v) => set("message", v.slice(0, 500))}
        error={errors.message}
        placeholder="Précisions sur votre projet…"
        multiline
        maxLength={500}
      />

      <div className="rounded-lg border border-background/10 bg-background/5 p-3 text-[11px] text-background/65">
        <div className="font-semibold text-background/80">Récap envoyé avec la demande</div>
        <div className="mt-1 leading-relaxed">
          {services[state.service].label} · {types[state.type].label} · {fmtNum(totals.surface)} m²
          {state.plinthes && ` · plinthes (${fmtNum(totals.perimetre)} ml)`}
          {state.seuils > 0 && ` · ${state.seuils} seuil${state.seuils > 1 ? "s" : ""}`}
          {" · "}
          <span className="font-semibold text-brand-orange">
            {fmt(totals.min)}–{fmt(totals.max)} €
          </span>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={sending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep active:scale-[0.98] disabled:opacity-70"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        Envoyer ma demande
      </button>
      <p className="flex items-center justify-center gap-1.5 text-[10px] text-background/50">
        <Check className="h-3 w-3 text-brand-orange" /> Données utilisées uniquement pour vous recontacter
      </p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
  maxLength?: number;
  multiline?: boolean;
}) {
  const inputCls = `w-full rounded-lg border bg-background/10 px-3 py-2.5 text-sm text-background placeholder:text-background/40 outline-none transition focus:border-brand-orange ${
    error ? "border-destructive/70" : "border-background/15 focus:bg-background/15"
  }`;
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-background/60">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          className={inputCls + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          className={inputCls}
        />
      )}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
