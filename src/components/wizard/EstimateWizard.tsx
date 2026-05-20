import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import jsPDF from "jspdf";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileDown,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

/* =========================================================================
   Domaine — alignées sur la logique métier existante de Estimator.tsx.
   Les coefficients et prix de base ne sont pas modifiés.
   ========================================================================= */

type ProjetKey =
  | "pose-neuve"
  | "renovation"
  | "poncage-vitrification"
  | "reparation-degat-eaux"
  | "depose-remplacement";

type MateriauKey = "contrecolle" | "massif" | "ancien" | "stratifie";

type LogementKey = "appartement" | "maison" | "bureau" | "local" | "autre";
type MeubleKey = "meuble" | "vide" | "partiel";
type ZoneKey = "oui" | "non" | "partiel";
type TrierKey = "oui" | "non" | "nsp";
type EtageKey = "rdc" | "1" | "2" | "3" | "4+" | "ascenseur";
type ChauffageKey = "oui" | "non" | "nsp";
type DelaiKey = "urgent" | "1mois" | "3mois" | "flexible";
type ProfilKey = "particulier" | "pro";
type CiviliteKey = "m" | "mme" | "autre";

// Mapping projet → service de calcul (logique existante)
const projetToService: Record<ProjetKey, "poncage" | "vitrification" | "pose" | "renovation"> = {
  "pose-neuve": "pose",
  "renovation": "renovation",
  "poncage-vitrification": "poncage",
  "reparation-degat-eaux": "renovation",
  "depose-remplacement": "pose",
};

const projets: { key: ProjetKey; label: string; desc: string }[] = [
  { key: "pose-neuve", label: "Pose neuve", desc: "Installation d'un parquet sur sol nu ou ancien revêtement." },
  { key: "renovation", label: "Rénovation parquet", desc: "Remise en état d'un parquet existant." },
  { key: "poncage-vitrification", label: "Ponçage + vitrification", desc: "Redonner éclat et protection à un parquet sain." },
  { key: "reparation-degat-eaux", label: "Réparation dégât des eaux", desc: "Reprise localisée après sinistre." },
  { key: "depose-remplacement", label: "Dépose + remplacement", desc: "Retrait de l'ancien parquet et pose neuve." },
];

// Compatibilité matériaux par type de projet
const materiaux: Record<MateriauKey, { label: string; desc: string }> = {
  contrecolle: { label: "Contrecollé", desc: "Bois noble sur âme stable. Polyvalent et chauffage au sol." },
  massif: { label: "Massif", desc: "Lames pleines, longévité maximale, ponçables à vie." },
  ancien: { label: "Parquet ancien", desc: "Chêne d'origine à préserver ou restaurer." },
  stratifie: { label: "Stratifié", desc: "Décor imprimé, économique, pose flottante rapide." },
};

const compatibilite: Record<ProjetKey, MateriauKey[]> = {
  "pose-neuve": ["contrecolle", "massif", "stratifie"],
  "renovation": ["contrecolle", "massif", "ancien"],
  "poncage-vitrification": ["massif", "ancien"],
  "reparation-degat-eaux": ["contrecolle", "massif", "ancien", "stratifie"],
  "depose-remplacement": ["contrecolle", "massif", "stratifie"],
};

// Coefficients calc (alignés à Estimator.tsx)
const SERVICE_PRICES = {
  poncage: { min: 25, max: 40, label: "Ponçage" },
  vitrification: { min: 15, max: 28, label: "Vitrification" },
  pose: { min: 45, max: 90, label: "Pose" },
  renovation: { min: 60, max: 110, label: "Rénovation complète" },
} as const;

const MAT_FACTOR: Record<MateriauKey, number> = {
  contrecolle: 1,
  massif: 1.15,
  ancien: 1.35,
  stratifie: 0.85,
};

/* =========================================================================
   Persistance
   ========================================================================= */

const STORAGE_KEY = "parqueto:wizard:v1";

type Piece = { key: string; label: string; count: number };

type WizardState = {
  // Step 1
  projet: ProjetKey | null;
  materiau: MateriauKey | null;
  // Step 2
  logement: LogementKey | null;
  surface: number;
  pieces: Piece[];
  escalier: boolean;
  autrePiece: string;
  etatMeuble: MeubleKey | null;
  zoneDegagee: ZoneKey | null;
  manutention: TrierKey | null;
  etage: EtageKey | null;
  chauffage: ChauffageKey | null;
  delai: DelaiKey | null;
  // Step 3
  adresse: string;
  ville: string;
  cp: string;
  complement: string;
  // Step 4
  profil: ProfilKey;
  civilite: CiviliteKey | null;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
  siret: string;
  message: string;
  consent: boolean;
};

const DEFAULT_PIECES: Piece[] = [
  { key: "salon", label: "Salon / séjour", count: 0 },
  { key: "chambres", label: "Chambres", count: 0 },
  { key: "cuisine", label: "Cuisine", count: 0 },
  { key: "couloir", label: "Couloir / entrée", count: 0 },
];

const DEFAULT_STATE: WizardState = {
  projet: null,
  materiau: null,
  logement: null,
  surface: 0,
  pieces: DEFAULT_PIECES,
  escalier: false,
  autrePiece: "",
  etatMeuble: null,
  zoneDegagee: null,
  manutention: null,
  etage: null,
  chauffage: null,
  delai: null,
  adresse: "",
  ville: "",
  cp: "",
  complement: "",
  profil: "particulier",
  civilite: null,
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  entreprise: "",
  siret: "",
  message: "",
  consent: false,
};

function loadWizardState(): WizardState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw), pieces: DEFAULT_PIECES.map((p) => {
      const saved = (JSON.parse(raw).pieces as Piece[] | undefined)?.find((x) => x.key === p.key);
      return saved ?? p;
    }) };
  } catch {
    return DEFAULT_STATE;
  }
}

/* =========================================================================
   Validation Zod (nouveaux schémas, ne modifie pas ceux d'Estimator)
   ========================================================================= */

const step1Schema = z.object({
  projet: z.string().min(1, "Choisissez un type de projet"),
  materiau: z.string().min(1, "Choisissez un matériau"),
});

const step2Schema = z.object({
  logement: z.string().min(1, "Précisez le type de logement"),
  surface: z.number().min(1, "Surface obligatoire").max(2000, "Surface trop grande"),
  etatMeuble: z.string().min(1, "Champ requis"),
  zoneDegagee: z.string().min(1, "Champ requis"),
  manutention: z.string().min(1, "Champ requis"),
  etage: z.string().min(1, "Champ requis"),
  chauffage: z.string().min(1, "Champ requis"),
  delai: z.string().min(1, "Champ requis"),
});

const step3Schema = z.object({
  adresse: z.string().trim().min(3, "Adresse requise"),
  ville: z.string().trim().min(2, "Ville requise"),
  cp: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres"),
});

const step4Schema = z
  .object({
    profil: z.enum(["particulier", "pro"]),
    civilite: z.string().min(1, "Civilité requise"),
    prenom: z.string().trim().min(2, "Prénom requis"),
    nom: z.string().trim().min(2, "Nom requis"),
    email: z.string().trim().email("Email invalide"),
    telephone: z.string().trim().regex(/^[0-9 +().-]{8,20}$/, "Téléphone invalide"),
    entreprise: z.string().optional(),
    siret: z.string().optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
  })
  .superRefine((d, ctx) => {
    if (d.profil === "pro") {
      if (!d.entreprise || d.entreprise.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["entreprise"], message: "Raison sociale requise" });
      }
    }
  });

type Errors = Record<string, string>;

function runValidation<T>(schema: z.ZodType<T>, data: unknown): { ok: true; data: T } | { ok: false; errors: Errors } {
  const r = schema.safeParse(data);
  if (r.success) return { ok: true, data: r.data };
  const errors: Errors = {};
  for (const issue of r.error.issues) {
    const k = issue.path.join(".");
    if (!errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}

/* =========================================================================
   Calc fourchette (logique alignée Estimator, ne modifie pas l'existant)
   ========================================================================= */

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n / 10) * 10);

function computeRange(s: WizardState): { min: number; max: number } | null {
  if (!s.projet || !s.materiau || s.surface <= 0) return null;
  const service = projetToService[s.projet];
  const sp = SERVICE_PRICES[service];
  const f = MAT_FACTOR[s.materiau];
  return { min: sp.min * f * s.surface, max: sp.max * f * s.surface };
}

/* =========================================================================
   PDF (générateur dédié au wizard ; ne touche pas l'existant)
   ========================================================================= */

function generateWizardPDF(s: WizardState) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  const RIGHT = W - M;
  let y = 14;

  doc.setFillColor(229, 101, 28);
  doc.rect(0, 0, W, 6, "F");
  y += 8;

  const ref = `PQ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(20);
  doc.text("Parqueto", M, y);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(120);
  doc.text("Demande d'estimation détaillée", M, y + 5);

  doc.setFontSize(9).setTextColor(60);
  doc.text(`Devis ${ref}`, RIGHT, y, { align: "right" });
  doc.setTextColor(120);
  doc.text(new Date().toLocaleDateString("fr-FR"), RIGHT, y + 5, { align: "right" });

  y += 14;
  doc.setDrawColor(229, 101, 28).setLineWidth(0.6);
  doc.line(M, y, RIGHT, y);
  doc.setLineWidth(0.2);
  y += 8;

  const section = (title: string) => {
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(20);
    doc.text(title, M, y);
    y += 6;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(60);
  };

  const row = (k: string, v: string) => {
    if (!v) return;
    doc.setTextColor(110); doc.text(k, M, y);
    doc.setTextColor(20); doc.text(v, M + 60, y);
    y += 6;
  };

  section("Client");
  row("Profil", s.profil === "pro" ? "Professionnel" : "Particulier");
  row("Nom", `${s.civilite === "m" ? "M." : s.civilite === "mme" ? "Mme" : ""} ${s.prenom} ${s.nom}`.trim());
  if (s.entreprise) row("Société", s.entreprise);
  if (s.siret) row("SIRET", s.siret);
  row("Email", s.email);
  row("Téléphone", s.telephone);
  y += 4;

  section("Chantier");
  row("Adresse", `${s.adresse}${s.complement ? " — " + s.complement : ""}`);
  row("Ville", `${s.cp} ${s.ville}`);
  row("Logement", labelOf(LOGEMENTS, s.logement));
  row("Étage", labelOf(ETAGES, s.etage));
  row("Chauffage au sol", labelOf(YESNOMAYBE, s.chauffage));
  row("Délai souhaité", labelOf(DELAIS, s.delai));
  y += 4;

  section("Projet");
  row("Type", projets.find((p) => p.key === s.projet)?.label ?? "");
  row("Matériau", s.materiau ? materiaux[s.materiau].label : "");
  row("Surface", `${s.surface} m²`);
  const piecesStr = s.pieces.filter((p) => p.count > 0).map((p) => `${p.label} ×${p.count}`).join(", ");
  if (piecesStr) row("Pièces", piecesStr);
  if (s.escalier) row("Escalier", "Oui");
  if (s.autrePiece) row("Autres pièces", s.autrePiece);
  row("État du logement", labelOf(MEUBLES, s.etatMeuble));
  row("Zone dégagée J0", labelOf(ZONES, s.zoneDegagee));
  row("Manutention lourde", labelOf(YESNOMAYBE, s.manutention));
  y += 4;

  const range = computeRange(s);
  if (range) {
    doc.setFillColor(255, 244, 238);
    doc.roundedRect(M, y, RIGHT - M, 22, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(229, 101, 28);
    doc.text("FOURCHETTE INDICATIVE TTC", M + 4, y + 7);
    doc.setFontSize(17).setTextColor(20);
    doc.text(`${fmt(range.min)} – ${fmt(range.max)} €`, RIGHT - 4, y + 14, { align: "right" });
    y += 28;
  }

  if (s.message) {
    section("Message");
    const lines = doc.splitTextToSize(s.message, RIGHT - M);
    doc.setFontSize(10).setTextColor(40);
    doc.text(lines, M, y);
    y += lines.length * 5 + 4;
  }

  doc.setFont("helvetica", "italic").setFontSize(8).setTextColor(130);
  const note = "Estimation indicative non contractuelle. Un devis définitif sera établi après visite technique sur place. Validité 30 jours.";
  doc.text(doc.splitTextToSize(note, RIGHT - M), M, Math.max(y, 270));

  doc.setFont("helvetica", "normal").setTextColor(160).setFontSize(8);
  doc.text("contact@parqueto.fr  ·  parqueto.fr", M, 287);
  doc.text(ref, RIGHT, 287, { align: "right" });

  doc.save(`devis-parqueto-${ref}.pdf`);
}

/* =========================================================================
   Référentiels d'options (libellés)
   ========================================================================= */

type Opt<K extends string> = { key: K; label: string; desc?: string };

const LOGEMENTS: Opt<LogementKey>[] = [
  { key: "appartement", label: "Appartement" },
  { key: "maison", label: "Maison" },
  { key: "bureau", label: "Bureau" },
  { key: "local", label: "Local commercial" },
  { key: "autre", label: "Autre" },
];
const MEUBLES: Opt<MeubleKey>[] = [
  { key: "meuble", label: "Meublé" },
  { key: "vide", label: "Vide" },
  { key: "partiel", label: "Partiellement meublé" },
];
const ZONES: Opt<ZoneKey>[] = [
  { key: "oui", label: "Oui, totalement" },
  { key: "non", label: "Non, à organiser" },
  { key: "partiel", label: "Partiellement" },
];
const YESNOMAYBE: Opt<TrierKey>[] = [
  { key: "oui", label: "Oui" },
  { key: "non", label: "Non" },
  { key: "nsp", label: "Je ne sais pas" },
];
const ETAGES: Opt<EtageKey>[] = [
  { key: "rdc", label: "Rez-de-chaussée" },
  { key: "1", label: "1ᵉʳ étage" },
  { key: "2", label: "2ᵉ étage" },
  { key: "3", label: "3ᵉ étage" },
  { key: "4+", label: "4ᵉ étage ou +" },
  { key: "ascenseur", label: "Avec ascenseur" },
];
const DELAIS: Opt<DelaiKey>[] = [
  { key: "urgent", label: "Sous 2 semaines" },
  { key: "1mois", label: "Sous 1 mois" },
  { key: "3mois", label: "Sous 3 mois" },
  { key: "flexible", label: "Je suis flexible" },
];

function labelOf<K extends string>(list: Opt<K>[], key: K | null): string {
  if (!key) return "";
  return list.find((o) => o.key === key)?.label ?? "";
}

/* =========================================================================
   Composant principal
   ========================================================================= */

export function EstimateWizard() {
  const [s, setS] = useState<WizardState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Errors>({});
  const [photos, setPhotos] = useState<{ id: string; name: string; url: string }[]>([]);
  const [photoError, setPhotoError] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shareMsg, setShareMsg] = useState<string>("");

  useEffect(() => {
    setS(loadWizardState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch { /* ignore */ }
  }, [s, hydrated]);

  // Si le projet change, on s'assure que le matériau reste compatible.
  useEffect(() => {
    if (s.projet && s.materiau && !compatibilite[s.projet].includes(s.materiau)) {
      setS((x) => ({ ...x, materiau: null }));
    }
  }, [s.projet, s.materiau]);

  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) => {
    setS((x) => ({ ...x, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k as string]: "" }));
  };

  const range = useMemo(() => computeRange(s), [s]);

  const validateStep = (n: 1 | 2 | 3 | 4): boolean => {
    let r;
    if (n === 1) r = runValidation(step1Schema, { projet: s.projet, materiau: s.materiau });
    else if (n === 2) r = runValidation(step2Schema, {
      logement: s.logement, surface: s.surface, etatMeuble: s.etatMeuble,
      zoneDegagee: s.zoneDegagee, manutention: s.manutention, etage: s.etage,
      chauffage: s.chauffage, delai: s.delai,
    });
    else if (n === 3) r = runValidation(step3Schema, { adresse: s.adresse, ville: s.ville, cp: s.cp });
    else r = runValidation(step4Schema, {
      profil: s.profil, civilite: s.civilite, prenom: s.prenom, nom: s.nom,
      email: s.email, telephone: s.telephone, entreprise: s.entreprise, siret: s.siret,
      consent: s.consent,
    });
    if (r.ok) { setErrors({}); return true; }
    setErrors(r.errors);
    return false;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const buildShareText = () => {
    const lines = [
      `Demande Parqueto — ${projets.find((p) => p.key === s.projet)?.label ?? ""}`,
      s.materiau ? `Matériau : ${materiaux[s.materiau].label}` : "",
      s.surface ? `Surface : ${s.surface} m²` : "",
      s.cp || s.ville ? `Lieu : ${s.cp} ${s.ville}` : "",
      range ? `Fourchette indicative : ${fmt(range.min)} – ${fmt(range.max)} € TTC` : "",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const shareQuote = async () => {
    setShareMsg("");
    const text = buildShareText();
    const shareData: ShareData = { title: "Mon estimation Parqueto", text };
    try {
      if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
        await (navigator as Navigator).share(shareData);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareMsg("Résumé copié dans le presse-papiers.");
        return;
      }
      setShareMsg("Partage indisponible sur ce navigateur.");
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "AbortError") return; // user cancelled
      try {
        await navigator.clipboard.writeText(text);
        setShareMsg("Partage refusé — résumé copié à la place.");
      } catch {
        setShareMsg("Impossible de partager. Réessayez ou téléchargez le PDF.");
      }
    }
  };

  const submit = () => {
    if (!validateStep(4)) return;
    setSending(true);
    const subject = `Demande d'estimation parquet — ${s.cp} ${s.ville}`;
    const body = [
      `Bonjour,`,
      ``,
      `Je souhaite recevoir un devis pour le chantier suivant :`,
      ``,
      `• Projet : ${projets.find((p) => p.key === s.projet)?.label}`,
      `• Matériau : ${s.materiau ? materiaux[s.materiau].label : ""}`,
      `• Surface : ${s.surface} m²`,
      `• Logement : ${labelOf(LOGEMENTS, s.logement)} — ${labelOf(ETAGES, s.etage)}`,
      `• État : ${labelOf(MEUBLES, s.etatMeuble)} · Zone J0 ${labelOf(ZONES, s.zoneDegagee)}`,
      `• Manutention lourde : ${labelOf(YESNOMAYBE, s.manutention)} · Chauffage au sol : ${labelOf(YESNOMAYBE, s.chauffage)}`,
      `• Délai : ${labelOf(DELAIS, s.delai)}`,
      `• Adresse : ${s.adresse}${s.complement ? " — " + s.complement : ""}, ${s.cp} ${s.ville}`,
      range ? `• Fourchette indicative : ${fmt(range.min)} – ${fmt(range.max)} € TTC` : null,
      photos.length ? `• ${photos.length} photo(s) du sol disponible(s) sur demande` : null,
      ``,
      `— ${s.civilite === "m" ? "M." : s.civilite === "mme" ? "Mme" : ""} ${s.prenom} ${s.nom}`,
      s.profil === "pro" ? `${s.entreprise}${s.siret ? " · SIRET " + s.siret : ""}` : "",
      `${s.email} · ${s.telephone}`,
      s.message ? `\nMessage : ${s.message}` : "",
    ].filter(Boolean).join("\n");

    window.location.href = `mailto:contact@parqueto.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => { setSending(false); setSent(true); window.scrollTo({ top: 0, behavior: "smooth" }); }, 700);
  };

  /* ----------------------------- Écran final ----------------------------- */
  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/15">
          <CheckCircle2 className="h-8 w-8 text-brand-orange" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">Demande envoyée</h1>
        <p className="mt-3 text-muted-foreground">
          Un artisan vérifié vous recontacte sous 24 h ouvrées avec une proposition adaptée.
        </p>
        {range && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-soft">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">Fourchette indicative</div>
            <div className="mt-1 font-display text-3xl">{fmt(range.min)} – {fmt(range.max)} € TTC</div>
            <div className="mt-1 text-xs text-muted-foreground">Non contractuelle, hors fournitures spécifiques.</div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => generateWizardPDF(s)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            <FileDown className="h-4 w-4" /> Télécharger le récap PDF
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------- Layout wizard ----------------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Parqueto
          </Link>
          <div className="hidden items-center gap-2 text-[11px] font-medium text-muted-foreground sm:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" /> Sans engagement · Données confidentielles
          </div>
        </div>
        <ProgressBar step={step} />
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-44 pt-8 sm:pt-12">
        <ReassuranceStrip />

        <StepErrors errors={errors} />

        {step === 1 && <Step1 s={s} set={set} errors={errors} />}
        {step === 2 && <Step2 s={s} set={set} errors={errors} />}
        {step === 3 && (
          <Step3
            s={s}
            set={set}
            errors={errors}
            photos={photos}
            setPhotos={setPhotos}
            photoError={photoError}
            setPhotoError={setPhotoError}
          />
        )}
        {step === 4 && (
          <Step4
            s={s}
            set={set}
            errors={errors}
            range={range}
            photos={photos.length}
            onPdf={() => generateWizardPDF(s)}
            onShare={shareQuote}
            shareMsg={shareMsg}
          />
        )}
      </main>

      {/* Bottom navigation bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-2.5 sm:px-5 sm:py-4">
          {/* Mobile range chip */}
          {range && step < 4 && (
            <div className="mb-2 flex items-center justify-center sm:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold text-brand-orange">
                <Sparkles className="h-3 w-3" /> {fmt(range.min)}–{fmt(range.max)} € indicatif
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={prev}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-foreground/70 transition hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            <div className="hidden text-xs text-muted-foreground sm:block">
              Étape <span className="font-semibold text-foreground">{step}</span> / 4
              {range && step < 4 && (
                <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 font-semibold text-brand-orange">
                  <Sparkles className="h-3 w-3" /> {fmt(range.min)}–{fmt(range.max)} € indicatif
                </span>
              )}
            </div>

            <span className="text-[11px] font-semibold text-muted-foreground sm:hidden">
              {step}/4
            </span>

            {step < 4 ? (
              <button
                onClick={next}
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep active:scale-[0.98] sm:px-6"
              >
                Continuer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={sending}
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep active:scale-[0.98] disabled:opacity-70 sm:px-6"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Envoyer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepErrors({ errors }: { errors: Errors }) {
  const list = Object.values(errors).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
      <div>
        <div className="text-sm font-semibold text-destructive">
          {list.length === 1 ? "1 champ à corriger" : `${list.length} champs à corriger`}
        </div>
        <ul className="mt-1 list-disc pl-5 text-xs text-destructive/90">
          {list.slice(0, 4).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
          {list.length > 4 && <li>…et {list.length - 4} autre(s)</li>}
        </ul>
      </div>
    </div>
  );
}

/* =========================================================================
   Sections (steps)
   ========================================================================= */

function StepHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">{kicker}</div>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>
    </div>
  );
}

function Step1({ s, set, errors }: { s: WizardState; set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void; errors: Errors }) {
  const matsAvailable = s.projet ? compatibilite[s.projet] : [];
  return (
    <section>
      <StepHeader
        kicker="Étape 1 / 4 — Projet"
        title="Parlez-nous de votre projet."
        subtitle="Le type de prestation et le matériau souhaité conditionnent l'estimation. Pas de mauvaise réponse — vous pouvez préciser en bas de page."
      />

      <FieldGroup label="Type de projet" error={errors["projet"]}>
        <div className="grid gap-3 sm:grid-cols-2">
          {projets.map((p) => (
            <RadioCard
              key={p.key}
              active={s.projet === p.key}
              onClick={() => set("projet", p.key)}
              title={p.label}
              desc={p.desc}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        label="Matériau souhaité"
        hint={!s.projet ? "Choisissez d'abord un type de projet pour voir les matériaux compatibles." : "Seuls les matériaux compatibles avec votre projet sont proposés."}
        error={errors["materiau"]}
      >
        {s.projet ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {matsAvailable.map((k) => (
              <RadioCard
                key={k}
                active={s.materiau === k}
                onClick={() => set("materiau", k)}
                title={materiaux[k].label}
                desc={materiaux[k].desc}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            En attente du type de projet…
          </div>
        )}
      </FieldGroup>
    </section>
  );
}

function Step2({ s, set, errors }: { s: WizardState; set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void; errors: Errors }) {
  return (
    <section>
      <StepHeader
        kicker="Étape 2 / 4 — Logement"
        title="Quelques précisions sur le chantier."
        subtitle="Ces éléments permettent à l'artisan d'évaluer la complexité réelle et la logistique."
      />

      <FieldGroup label="Type de logement" error={errors["logement"]}>
        <NativeSelect
          value={s.logement ?? ""}
          onChange={(v) => set("logement", v as LogementKey)}
          options={[{ value: "", label: "— Choisir —" }, ...LOGEMENTS.map((o) => ({ value: o.key, label: o.label }))]}
        />
      </FieldGroup>

      <FieldGroup label="Surface totale du chantier" error={errors["surface"]} hint="Estimation au m². Vous pourrez préciser pièce par pièce en dessous.">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-brand-orange">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={s.surface || ""}
            onChange={(e) => set("surface", Math.max(0, Number(e.target.value) || 0))}
            placeholder="ex : 42"
            className="w-full bg-transparent font-display text-2xl text-foreground outline-none"
          />
          <span className="text-sm font-semibold text-muted-foreground">m²</span>
        </div>
      </FieldGroup>

      <FieldGroup label="Pièces concernées" hint="Optionnel — aide l'artisan à comprendre la configuration.">
        <div className="space-y-2">
          {s.pieces.map((p) => (
            <div key={p.key} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
              <span className="text-sm font-medium text-foreground">{p.label}</span>
              <Stepper
                value={p.count}
                onChange={(v) =>
                  set("pieces", s.pieces.map((q) => (q.key === p.key ? { ...q, count: v } : q)))
                }
              />
            </div>
          ))}
          <label className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <input
              type="checkbox"
              checked={s.escalier}
              onChange={(e) => set("escalier", e.target.checked)}
              className="h-4 w-4 accent-[color:var(--brand-orange)]"
            />
            <span className="text-sm font-medium text-foreground">Escalier à traiter</span>
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <span className="text-sm font-medium text-foreground">Autre</span>
            <input
              type="text"
              value={s.autrePiece}
              onChange={(e) => set("autrePiece", e.target.value)}
              placeholder="ex : dressing, bureau…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="État du logement" error={errors["etatMeuble"]}>
        <SegmentedCards options={MEUBLES} value={s.etatMeuble} onChange={(v) => set("etatMeuble", v)} />
      </FieldGroup>

      <FieldGroup label="Zone de travaux dégagée le jour J ?" error={errors["zoneDegagee"]}>
        <SegmentedCards options={ZONES} value={s.zoneDegagee} onChange={(v) => set("zoneDegagee", v)} />
      </FieldGroup>

      <FieldGroup label="Manutention lourde nécessaire ?" hint="Meubles lourds, accès difficile, escaliers étroits…" error={errors["manutention"]}>
        <SegmentedCards options={YESNOMAYBE} value={s.manutention} onChange={(v) => set("manutention", v)} />
      </FieldGroup>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup label="Étage" error={errors["etage"]}>
          <NativeSelect
            value={s.etage ?? ""}
            onChange={(v) => set("etage", v as EtageKey)}
            options={[{ value: "", label: "— Choisir —" }, ...ETAGES.map((o) => ({ value: o.key, label: o.label }))]}
          />
        </FieldGroup>
        <FieldGroup label="Délai souhaité" error={errors["delai"]}>
          <NativeSelect
            value={s.delai ?? ""}
            onChange={(v) => set("delai", v as DelaiKey)}
            options={[{ value: "", label: "— Choisir —" }, ...DELAIS.map((o) => ({ value: o.key, label: o.label }))]}
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Chauffage au sol ?" error={errors["chauffage"]}>
        <SegmentedCards options={YESNOMAYBE} value={s.chauffage} onChange={(v) => set("chauffage", v)} />
      </FieldGroup>
    </section>
  );
}

function Step3({
  s,
  set,
  errors,
  photos,
  setPhotos,
}: {
  s: WizardState;
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  errors: Errors;
  photos: { id: string; name: string; url: string }[];
  setPhotos: React.Dispatch<React.SetStateAction<{ id: string; name: string; url: string }[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 5 - photos.length);
    const next = arr.map((f) => ({ id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`, name: f.name, url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...next].slice(0, 5));
  };

  return (
    <section>
      <StepHeader
        kicker="Étape 3 / 4 — Localisation"
        title="Où se trouve le chantier ?"
        subtitle="L'adresse précise permet à l'artisan d'évaluer ses déplacements. Les photos accélèrent l'estimation."
      />

      <FieldGroup label="Adresse du chantier" error={errors["adresse"]}>
        <TextInput value={s.adresse} onChange={(v) => set("adresse", v)} placeholder="4 rue de la Chine" autoComplete="street-address" icon={<MapPin className="h-4 w-4 text-brand-orange" />} />
      </FieldGroup>

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <FieldGroup label="Ville" error={errors["ville"]}>
          <TextInput value={s.ville} onChange={(v) => set("ville", v)} placeholder="Paris" autoComplete="address-level2" />
        </FieldGroup>
        <FieldGroup label="Code postal" error={errors["cp"]}>
          <TextInput value={s.cp} onChange={(v) => set("cp", v.replace(/\D/g, "").slice(0, 5))} placeholder="75020" autoComplete="postal-code" inputMode="numeric" />
        </FieldGroup>
      </div>

      <FieldGroup label="Complément d'adresse" hint="Optionnel">
        <TextInput value={s.complement} onChange={(v) => set("complement", v)} placeholder="Bât. B, 3ᵉ étage gauche" />
      </FieldGroup>

      <FieldGroup label="Photos du sol actuel" hint="1 à 5 photos — accélère l'estimation. Stockées localement dans votre navigateur.">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
          className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition hover:border-brand-orange hover:bg-brand-orange/5"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange transition group-hover:bg-brand-orange/25">
            <Upload className="h-5 w-5" />
          </div>
          <div className="mt-3 font-display text-base text-foreground">
            Glissez-déposez ou <span className="text-brand-orange underline-offset-4 group-hover:underline">parcourez</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">JPEG, PNG ou WebP · jusqu'à 5 photos</div>
        </div>

        {photos.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((p) => (
              <li key={p.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                <img src={p.url} alt={p.name} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => setPhotos((arr) => arr.filter((x) => x.id !== p.id))}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/85 text-background opacity-0 transition group-hover:opacity-100"
                  aria-label="Retirer cette photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-muted-foreground">
                  <ImageIcon className="h-3 w-3" /> <span className="truncate">{p.name}</span>
                </div>
              </li>
            ))}
            {photos.length > 0 && photos.length < 5 && (
              <li>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-xs font-semibold text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter
                </button>
              </li>
            )}
          </ul>
        )}
      </FieldGroup>
    </section>
  );
}

function Step4({
  s,
  set,
  errors,
  range,
  photos,
}: {
  s: WizardState;
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  errors: Errors;
  range: { min: number; max: number } | null;
  photos: number;
}) {
  return (
    <section>
      <StepHeader
        kicker="Étape 4 / 4 — Vos coordonnées"
        title="On vous recontacte sous 24 h."
        subtitle="Utilisées uniquement pour vous envoyer votre estimation. Pas de revente, pas d'appels commerciaux répétés."
      />

      <FieldGroup label="Vous êtes ?" error={errors["profil"]}>
        <div className="grid gap-3 sm:grid-cols-2">
          <RadioCard
            active={s.profil === "particulier"}
            onClick={() => set("profil", "particulier")}
            title="Particulier"
            desc="Pour vous-même ou votre logement personnel."
          />
          <RadioCard
            active={s.profil === "pro"}
            onClick={() => set("profil", "pro")}
            title="Professionnel"
            desc="Entreprise, syndic, agence, hôtelier, restaurateur."
          />
        </div>
      </FieldGroup>

      <FieldGroup label="Civilité" error={errors["civilite"]}>
        <SegmentedCards
          options={[
            { key: "m", label: "M." },
            { key: "mme", label: "Mme" },
            { key: "autre", label: "Autre / Préfère ne pas préciser" },
          ]}
          value={s.civilite}
          onChange={(v) => set("civilite", v)}
        />
      </FieldGroup>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Prénom" error={errors["prenom"]}>
          <TextInput value={s.prenom} onChange={(v) => set("prenom", v)} autoComplete="given-name" />
        </FieldGroup>
        <FieldGroup label="Nom" error={errors["nom"]}>
          <TextInput value={s.nom} onChange={(v) => set("nom", v)} autoComplete="family-name" />
        </FieldGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Email" error={errors["email"]}>
          <TextInput value={s.email} onChange={(v) => set("email", v)} type="email" placeholder="vous@exemple.fr" autoComplete="email" inputMode="email" />
        </FieldGroup>
        <FieldGroup label="Téléphone" error={errors["telephone"]} hint="Formats : 06 12 34 56 78, +33 6 12 34 56 78">
          <TextInput value={s.telephone} onChange={(v) => set("telephone", v)} type="tel" placeholder="06 12 34 56 78" autoComplete="tel" inputMode="tel" />
        </FieldGroup>
      </div>

      {s.profil === "pro" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup label="Raison sociale" error={errors["entreprise"]}>
            <TextInput value={s.entreprise} onChange={(v) => set("entreprise", v)} placeholder="Mon entreprise SAS" autoComplete="organization" />
          </FieldGroup>
          <FieldGroup label="SIRET" hint="Optionnel">
            <TextInput value={s.siret} onChange={(v) => set("siret", v.replace(/\D/g, "").slice(0, 14))} placeholder="14 chiffres" inputMode="numeric" />
          </FieldGroup>
        </div>
      )}

      <FieldGroup label="Message complémentaire" hint="Optionnel — contraintes, précisions, photos manquantes…">
        <textarea
          value={s.message}
          onChange={(e) => set("message", e.target.value.slice(0, 600))}
          rows={3}
          placeholder="Quelques mots sur votre projet…"
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand-orange"
        />
      </FieldGroup>

      {/* Récap */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">Récapitulatif</div>
        <h3 className="mt-1 font-display text-xl text-foreground">{projets.find((p) => p.key === s.projet)?.label ?? "Projet"}</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <RecapLine k="Matériau" v={s.materiau ? materiaux[s.materiau].label : "—"} />
          <RecapLine k="Surface" v={s.surface ? `${s.surface} m²` : "—"} />
          <RecapLine k="Logement" v={labelOf(LOGEMENTS, s.logement) || "—"} />
          <RecapLine k="Étage" v={labelOf(ETAGES, s.etage) || "—"} />
          <RecapLine k="Délai" v={labelOf(DELAIS, s.delai) || "—"} />
          <RecapLine k="Chauffage sol" v={labelOf(YESNOMAYBE, s.chauffage) || "—"} />
          <RecapLine k="Ville" v={s.ville && s.cp ? `${s.cp} ${s.ville}` : "—"} />
          <RecapLine k="Photos" v={photos ? `${photos} photo(s)` : "—"} />
        </dl>
        {range && (
          <div className="mt-5 rounded-xl bg-brand-orange/10 px-4 py-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange">Fourchette indicative</div>
            <div className="mt-1 font-display text-2xl text-foreground">{fmt(range.min)} – {fmt(range.max)} <span className="text-base text-muted-foreground">€ TTC</span></div>
            <div className="mt-1 text-[11px] text-muted-foreground">Non contractuelle — un artisan affinera après visite.</div>
          </div>
        )}
      </div>

      {/* Consentement */}
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-brand-orange/40">
        <input
          type="checkbox"
          checked={s.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[color:var(--brand-orange)]"
        />
        <span className="text-xs text-muted-foreground">
          J'accepte d'être recontacté par Parqueto et un artisan partenaire au sujet de cette demande. Pas de revente, pas de spam.{" "}
          <span className="font-semibold text-foreground">Vous pouvez retirer ce consentement à tout moment.</span>
        </span>
      </label>
      {errors["consent"] && <p className="mt-1 text-xs font-medium text-destructive">{errors["consent"]}</p>}
    </section>
  );
}

/* =========================================================================
   Sous-composants UI
   ========================================================================= */

function ProgressBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const labels = ["Projet", "Logement", "Localisation", "Coordonnées"];
  return (
    <div className="mx-auto max-w-5xl px-5 pb-3">
      <div className="flex gap-1.5">
        {labels.map((l, i) => {
          const n = i + 1;
          const reached = n <= step;
          return (
            <div key={l} className="flex-1">
              <div className={`h-1 rounded-full transition ${reached ? "bg-brand-orange" : "bg-border"}`} />
              <div className={`mt-1.5 hidden text-[10px] font-semibold uppercase tracking-wider sm:block ${reached ? "text-foreground" : "text-muted-foreground"}`}>
                {n}. {l}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReassuranceStrip() {
  const items = [
    { icon: Sparkles, t: "Estimation instantanée" },
    { icon: ShieldCheck, t: "Sans engagement" },
    { icon: Clock, t: "Réponse sous 24 h" },
    { icon: Check, t: "Artisan vérifié" },
  ];
  return (
    <div className="mb-8 flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
      {items.map(({ icon: Icon, t }) => (
        <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
          <Icon className="h-3.5 w-3.5 text-brand-orange" /> {t}
        </span>
      ))}
    </div>
  );
}

function FieldGroup({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {hint && !error && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function RadioCard({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative rounded-2xl border bg-card p-4 text-left transition active:scale-[0.99] sm:p-5 ${
        active
          ? "border-brand-orange bg-brand-orange/[0.06] shadow-soft"
          : "border-border hover:border-brand-orange/50 hover:bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
            active ? "border-brand-orange bg-brand-orange" : "border-border bg-background"
          }`}
        >
          {active && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
        </span>
        <div>
          <div className={`font-display text-base ${active ? "text-foreground" : "text-foreground"}`}>{title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{desc}</div>
        </div>
      </div>
    </button>
  );
}

function SegmentedCards<K extends string>({ options, value, onChange }: { options: Opt<K>[]; value: K | null; onChange: (k: K) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={`min-h-[52px] rounded-xl border bg-card px-3 py-3 text-left text-sm font-medium transition active:scale-[0.98] ${
              active
                ? "border-brand-orange bg-brand-orange/[0.06] text-foreground shadow-soft"
                : "border-border text-foreground/80 hover:border-brand-orange/40 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-brand-orange bg-brand-orange" : "border-border"}`}>
                {active && <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />}
              </span>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NativeSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-brand-orange"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text", autoComplete, inputMode, icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-brand-orange">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-border bg-background">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-9 w-9 items-center justify-center text-foreground/70 transition hover:bg-muted active:scale-95"
        aria-label="Diminuer"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-10 text-center font-display text-base text-foreground">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex h-9 w-9 items-center justify-center text-foreground/70 transition hover:bg-muted active:scale-95"
        aria-label="Augmenter"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function RecapLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium text-foreground">{v}</dd>
    </div>
  );
}
