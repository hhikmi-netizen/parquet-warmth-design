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
import { MicroReassurance } from "@/components/site/MicroReassurance";

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

function buildWizardPDF(s: WizardState): { doc: jsPDF; ref: string; filename: string } {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  const RIGHT = W - M;
  const INNER = RIGHT - M;
  let y = 0;

  // Header band
  doc.setFillColor(229, 101, 28);
  doc.rect(0, 0, W, 24, "F");
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(255, 255, 255);
  doc.text("Parqueto", M, 15);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(255, 240, 232);
  doc.text("Demande d'estimation parquet", M, 20);

  const ref = `PQ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(255, 255, 255);
  doc.text(`Réf. ${ref}`, RIGHT, 15, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(255, 240, 232);
  doc.text(new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }), RIGHT, 20, { align: "right" });

  y = 34;

  // Fourchette prominent
  const range = computeRange(s);
  if (range) {
    doc.setFillColor(255, 244, 238);
    doc.setDrawColor(229, 101, 28).setLineWidth(0.4);
    doc.roundedRect(M, y, INNER, 30, 4, 4, "FD");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(229, 101, 28);
    doc.text("FOURCHETTE INDICATIVE TTC", M + 5, y + 8);
    doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(25, 25, 25);
    doc.text(`${fmt(range.min)} - ${fmt(range.max)} EUR`, M + 5, y + 21);
    doc.setFont("helvetica", "italic").setFontSize(8).setTextColor(120);
    doc.text("Non contractuelle - affinee apres visite technique", M + 5, y + 27);
    doc.setLineWidth(0.2);
    y += 38;
  }

  // Espacement uniforme entre sections : on n'impose plus de saut de page,
  // le flux remplit chaque page jusqu'à SAFE_BOTTOM puis paginera proprement.
  // → la densité verticale reste constante quel que soit le volume de chaque section.
  const SECTION_GAP = 10;          // air avant un nouveau titre
  const SECTION_HEADER_H = 22;     // hauteur du bloc titre

  let sectionCount = 0;
  const section = (title: string) => {
    if (sectionCount > 0) y += SECTION_GAP;
    // Évite les titres orphelins en bas de page : on réserve la place pour le titre + 1 ligne (~26 mm)
    if (y + SECTION_HEADER_H + 26 > 268) {
      doc.addPage();
      y = 20;
    }
    sectionCount += 1;

    // Titre haute lisibilité : kicker fin + grand titre + filet orange
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(229, 101, 28);
    doc.text(`SECTION ${sectionCount}`, M, y);
    doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(20, 20, 20);
    doc.text(title, M, y + 9);
    doc.setDrawColor(229, 101, 28).setLineWidth(1.2);
    doc.line(M, y + 13, M + 28, y + 13);
    doc.setLineWidth(0.2);
    y += SECTION_HEADER_H;
  };



  // Marge de sécurité : la zone de pied de page commence à 278 mm.
  // On ne dessine jamais au-delà de SAFE_BOTTOM pour éviter tout chevauchement.
  const SAFE_BOTTOM = 268;
  const PAGE_TOP = 20;
  const PAGE_USABLE = SAFE_BOTTOM - PAGE_TOP;
  const LINE_H = 5.5;
  const VALUE_LINE_H = 6;

  // Hauteur disponible restante sur la page courante.
  const remaining = () => SAFE_BOTTOM - y;

  // Garantit `needed` mm de hauteur dispo. Renvoie true si on a paginé.
  const ensureSpace = (needed: number) => {
    if (y + needed > SAFE_BOTTOM) {
      doc.addPage();
      y = PAGE_TOP;
      return true;
    }
    return false;
  };

  const row = (k: string, v: string) => {
    if (!v) return;

    // 1) Mesure du libellé : on adapte la taille de police pour tenir sur 1 ligne,
    //    sinon on tronque proprement avec une ellipse.
    const maxLabelW = INNER - 2;
    const labelUpper = k.toUpperCase();
    let labelSize = 7.5;
    doc.setFont("helvetica", "bold").setFontSize(labelSize);
    while (doc.getTextWidth(labelUpper) > maxLabelW && labelSize > 6) {
      labelSize -= 0.25;
      doc.setFontSize(labelSize);
    }
    let labelDisplay = labelUpper;
    if (doc.getTextWidth(labelDisplay) > maxLabelW) {
      while (labelDisplay.length > 1 && doc.getTextWidth(labelDisplay + "…") > maxLabelW) {
        labelDisplay = labelDisplay.slice(0, -1);
      }
      labelDisplay += "…";
    }
    const labelWasShrunk = labelSize < 7.5;
    const labelTruncated = labelDisplay !== labelUpper;

    // 2) Préparation de la valeur (gras 13 pt).
    doc.setFont("helvetica", "bold").setFontSize(13);
    const valueLines = doc.splitTextToSize(v, INNER - 4) as string[];

    // 3) Marges verticales dynamiques.
    const baseLabelToValue = labelSize + 1.5;
    const compensationShrink = labelWasShrunk ? (7.5 - labelSize) * 0.6 : 0;
    const compensationTrunc = labelTruncated ? 1.2 : 0;
    const labelToValue = Math.max(6, baseLabelToValue + compensationShrink + compensationTrunc);
    const bottomPad = valueLines.length > 1 ? 5.5 : 4;

    // 4) Algorithme anti-débordement renforcé.
    //    a) Hauteur minimale incompressible = kicker + 1 ligne de valeur + bas.
    const minBlockH = labelToValue + VALUE_LINE_H + bottomPad;
    //    b) Si même ce minimum ne tient pas → page suivante.
    if (remaining() < minBlockH + 2) {
      doc.addPage();
      y = PAGE_TOP;
    }
    //    c) Nombre max de lignes que l'on peut tracer sur la page courante.
    const fitLines = Math.max(
      1,
      Math.floor((remaining() - labelToValue - bottomPad - 2) / VALUE_LINE_H)
    );
    //    d) Si toutes les lignes tiennent → bloc unique.
    //       Sinon on découpe en plusieurs chunks paginés, chacun avec son kicker
    //       (« suite… ») pour conserver la hiérarchie après un saut de page.
    const chunks: string[][] = [];
    if (valueLines.length <= fitLines) {
      chunks.push(valueLines);
    } else {
      // 1er chunk sur la page courante
      chunks.push(valueLines.slice(0, fitLines));
      let i = fitLines;
      // chunks suivants sur pages neuves : capacité max = floor((PAGE_USABLE - labelToValue - bottomPad - 2) / VALUE_LINE_H)
      const perFreshPage = Math.max(
        1,
        Math.floor((PAGE_USABLE - labelToValue - bottomPad - 2) / VALUE_LINE_H)
      );
      while (i < valueLines.length) {
        chunks.push(valueLines.slice(i, i + perFreshPage));
        i += perFreshPage;
      }
    }

    chunks.forEach((chunk, idx) => {
      if (idx > 0) {
        doc.addPage();
        y = PAGE_TOP;
      }
      const isContinuation = idx > 0;
      const display = isContinuation ? `${labelDisplay} (SUITE)` : labelDisplay;

      // Kicker
      doc.setFont("helvetica", "bold").setFontSize(labelSize).setTextColor(229, 101, 28);
      doc.text(display, M + 1, y);

      // Valeur
      doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(20, 20, 20);
      doc.text(chunk, M + 1, y + labelToValue);

      // Filet de séparation
      const lineY = y + labelToValue + chunk.length * VALUE_LINE_H + 1.5;
      doc.setDrawColor(214, 205, 190).setLineWidth(0.15);
      doc.line(M + 1, lineY, RIGHT - 1, lineY);

      y += labelToValue + chunk.length * VALUE_LINE_H + bottomPad;
    });
  };




  section("Projet");
  row("Type de prestation", projets.find((p) => p.key === s.projet)?.label ?? "");
  row("Materiau", s.materiau ? materiaux[s.materiau].label : "");
  row("Surface", `${s.surface} m2`);
  const piecesStr = s.pieces.filter((p) => p.count > 0).map((p) => `${p.label} x${p.count}`).join(", ");
  if (piecesStr) row("Pieces concernees", piecesStr);
  if (s.escalier) row("Escalier", "Oui, a traiter");
  if (s.autrePiece) row("Autres pieces", s.autrePiece);

  section("Chantier");
  row("Adresse", `${s.adresse}${s.complement ? " - " + s.complement : ""}`);
  row("Ville", `${s.cp} ${s.ville}`);
  row("Logement", labelOf(LOGEMENTS, s.logement));
  row("Etage", labelOf(ETAGES, s.etage));
  row("Etat du logement", labelOf(MEUBLES, s.etatMeuble));
  row("Zone degagee J0", labelOf(ZONES, s.zoneDegagee));
  row("Manutention lourde", labelOf(YESNOMAYBE, s.manutention));
  row("Chauffage au sol", labelOf(YESNOMAYBE, s.chauffage));
  row("Delai souhaite", labelOf(DELAIS, s.delai));


  section("Client");
  row("Profil", s.profil === "pro" ? "Professionnel" : "Particulier");
  const nom = `${s.civilite === "m" ? "M." : s.civilite === "mme" ? "Mme" : ""} ${s.prenom} ${s.nom}`.trim();
  row("Nom", nom);
  if (s.entreprise) row("Societe", s.entreprise);
  if (s.siret) row("SIRET", s.siret);
  row("Email", s.email);
  row("Telephone", s.telephone);

  if (s.message) {
    section("Message");
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(40);
    const msgLines = doc.splitTextToSize(s.message, INNER - 2) as string[];
    for (const line of msgLines) {
      ensureSpace(LINE_H);
      doc.text(line, M + 1, y);
      y += LINE_H;
    }
  }


  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    // Filet de pied de page : un peu plus visible que les filets de lignes, sans rivaliser avec le contenu
    doc.setDrawColor(198, 188, 172).setLineWidth(0.25);
    doc.line(M, 280, RIGHT, 280);
    doc.setFont("helvetica", "italic").setFontSize(7).setTextColor(130);
    doc.text("Estimation indicative non contractuelle - Devis definitif apres visite - Validite 30 jours", M, 284);
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(160);
    doc.text("contact@parqueto.fr  ·  parqueto.fr", M, 289);
    doc.text(`${ref}  ·  Page ${i}/${pages}`, RIGHT, 289, { align: "right" });
  }

  return { doc, ref, filename: `devis-parqueto-${ref}.pdf` };
}

function generateWizardPDF(s: WizardState) {
  const { doc, filename } = buildWizardPDF(s);
  doc.save(filename);
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
  const [photos, setPhotos] = useState<{ id: string; name: string; url: string; size?: number; w?: number; h?: number }[]>([]);
  const [photoError, setPhotoError] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shareMsg, setShareMsg] = useState<string>("");
  const [shareFallback, setShareFallback] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdf = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      // Yield to the event loop so the spinner can paint before jsPDF blocks the main thread
      await new Promise((r) => setTimeout(r, 30));
      generateWizardPDF(s);
    } finally {
      setPdfLoading(false);
    }
  };

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
    setShareFallback(false);
    const text = buildShareText();
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    try {
      // 1) Try sharing with PDF file (best on iOS/Android)
      if (nav?.share && nav.canShare) {
        try {
          const { doc, filename } = buildWizardPDF(s);
          const blob = doc.output("blob");
          const file = new File([blob], filename, { type: "application/pdf" });
          const fileData: ShareData = { title: "Mon estimation Parqueto", text, files: [file] };
          if (nav.canShare(fileData)) {
            await nav.share(fileData);
            return;
          }
        } catch { /* fall through to text share */ }
      }
      // 2) Text share (PDF files not supported here → propose fallback)
      if (nav?.share) {
        await nav.share({ title: "Mon estimation Parqueto", text });
        setShareMsg("Résumé partagé. Le PDF n'a pas pu être joint sur ce navigateur.");
        setShareFallback(true);
        return;
      }
      // 3) Clipboard fallback
      if (nav?.clipboard) {
        await nav.clipboard.writeText(text);
        setShareMsg("Résumé copié dans le presse-papiers.");
        setShareFallback(true);
        return;
      }
      setShareMsg("Partage indisponible sur ce navigateur.");
      setShareFallback(true);
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "AbortError") return; // user cancelled
      try {
        await nav!.clipboard.writeText(text);
        setShareMsg("Partage refusé — résumé copié à la place.");
      } catch {
        setShareMsg("Impossible de partager.");
      }
      setShareFallback(true);
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

  /* --------------------------- Barre de progression PDF --------------------------- */
  const PdfProgress = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
      <>
        <style>{`@keyframes pq-pdf-indeterminate {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(40%); }
          100% { transform: translateX(220%); }
        }`}</style>
        <div
          role="status"
          aria-live="polite"
          aria-label="Génération du PDF en cours"
          className="fixed inset-x-0 top-0 z-50 pointer-events-none"
        >
          {/* Barre fine indéterminée en haut d'écran */}
          <div className="h-1 w-full overflow-hidden bg-brand-orange/15">
            <div
              className="h-full w-1/3 rounded-r-full bg-brand-orange"
              style={{ animation: "pq-pdf-indeterminate 1.2s ease-in-out infinite" }}
            />
          </div>
          {/* Pastille statut, plus visible sur mobile */}
          <div className="flex justify-center px-4 pt-3 sm:pt-4">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-background/95 px-4 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur">
              <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
              Génération du PDF…
            </div>
          </div>
        </div>
      </>
    );
  };

  /* ----------------------------- Écran final ----------------------------- */
  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <PdfProgress visible={pdfLoading} />
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
            onClick={handlePdf}
            disabled={pdfLoading}
            aria-busy={pdfLoading}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            {pdfLoading ? "Génération…" : "Télécharger le récap PDF"}
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
      <PdfProgress visible={pdfLoading} />
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
            onPdf={handlePdf}
            pdfLoading={pdfLoading}
            onShare={shareQuote}
            shareMsg={shareMsg}
            shareFallback={shareFallback}
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

const FIELD_LABELS: Record<string, string> = {
  projet: "Type de projet",
  materiau: "Matériau",
  logement: "Type de logement",
  surface: "Surface",
  etatMeuble: "État du logement",
  zoneDegagee: "Zone dégagée",
  manutention: "Manutention lourde",
  etage: "Étage",
  chauffage: "Chauffage au sol",
  delai: "Délai souhaité",
  adresse: "Adresse",
  ville: "Ville",
  cp: "Code postal",
  profil: "Profil",
  civilite: "Civilité",
  prenom: "Prénom",
  nom: "Nom",
  email: "Email",
  telephone: "Téléphone",
  entreprise: "Raison sociale",
  consent: "Consentement",
};

function StepErrors({ errors }: { errors: Errors }) {
  const entries = Object.entries(errors).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return null;
  return (
    <div
      role="alert"
      aria-live="polite"
      className="mb-6 overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5"
    >
      <div className="flex items-center gap-2.5 border-b border-destructive/20 bg-destructive/10 px-4 py-2.5">
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
        <div className="text-sm font-semibold text-destructive">
          {entries.length === 1 ? "Un champ à corriger" : `${entries.length} champs à corriger`}
        </div>
      </div>
      <ul className="grid gap-1 px-4 py-2.5 text-[12px] sm:grid-cols-2">
        {entries.slice(0, 6).map(([k, m]) => (
          <li key={k} className="flex items-baseline gap-1.5 text-destructive/90">
            <span className="text-destructive/60">·</span>
            <span className="font-semibold">{FIELD_LABELS[k] ?? k} :</span>
            <span className="text-destructive/80">{m}</span>
          </li>
        ))}
        {entries.length > 6 && (
          <li className="text-[11px] italic text-destructive/70">…et {entries.length - 6} autre(s)</li>
        )}
      </ul>
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

      <div className="-mt-2 mb-6">
        <MicroReassurance variant="pill" />
      </div>


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
  photoError,
  setPhotoError,
}: {
  s: WizardState;
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  errors: Errors;
  photos: { id: string; name: string; url: string; size?: number; w?: number; h?: number }[];
  setPhotos: React.Dispatch<React.SetStateAction<{ id: string; name: string; url: string; size?: number; w?: number; h?: number }[]>>;
  photoError: string;
  setPhotoError: React.Dispatch<React.SetStateAction<string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const MAX = 5;
  const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
  const MIN_DIM = 400; // px (shortest side)
  const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

  const readDimensions = (url: string) =>
    new Promise<{ w: number; h: number } | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const onFiles = async (list: FileList | null) => {
    setPhotoError("");
    if (!list || list.length === 0) return;
    const remaining = MAX - photos.length;
    if (remaining <= 0) {
      setPhotoError(`Limite de ${MAX} photos atteinte. Retirez-en une pour en ajouter d'autres.`);
      return;
    }
    const incoming = Array.from(list);
    const rejected: string[] = [];
    const candidates: File[] = [];
    for (const f of incoming) {
      if (!ACCEPT.includes(f.type)) { rejected.push(`${f.name} : format non supporté`); continue; }
      if (f.size > MAX_SIZE) { rejected.push(`${f.name} : trop volumineuse (> 8 Mo)`); continue; }
      if (f.size < 5 * 1024) { rejected.push(`${f.name} : fichier vide ou corrompu`); continue; }
      candidates.push(f);
    }
    const trimmed = candidates.slice(0, remaining);
    const skipped = candidates.length - trimmed.length;

    const accepted: { id: string; name: string; url: string; size: number; w: number; h: number }[] = [];
    for (const f of trimmed) {
      const url = URL.createObjectURL(f);
      const dim = await readDimensions(url);
      if (!dim) {
        rejected.push(`${f.name} : image illisible`);
        URL.revokeObjectURL(url);
        continue;
      }
      if (Math.min(dim.w, dim.h) < MIN_DIM) {
        rejected.push(`${f.name} : résolution trop faible (min ${MIN_DIM}px)`);
        URL.revokeObjectURL(url);
        continue;
      }
      accepted.push({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        name: f.name, url, size: f.size, w: dim.w, h: dim.h,
      });
    }
    setPhotos((p) => [...p, ...accepted].slice(0, MAX));
    const msgs: string[] = [];
    if (rejected.length) msgs.push(rejected.join(" · "));
    if (skipped > 0) msgs.push(`${skipped} photo(s) ignorée(s) — limite de ${MAX}.`);
    if (msgs.length) setPhotoError(msgs.join(" "));
  };

  const removePhoto = (id: string) => {
    setPhotos((arr) => {
      const found = arr.find((x) => x.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return arr.filter((x) => x.id !== id);
    });
    setLightbox(null);
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

      <FieldGroup
        label={`Photos du sol actuel (${photos.length}/${MAX})`}
        hint="1 à 5 photos — accélère l'estimation. Stockées localement dans votre navigateur."
        error={photoError}
      >
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
          className={`group relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            photos.length >= MAX
              ? "border-border bg-muted/40 opacity-70"
              : "border-border bg-muted/30 hover:border-brand-orange hover:bg-brand-orange/5"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={photos.length >= MAX}
            className="sr-only"
            onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }}
          />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange transition group-hover:bg-brand-orange/25">
            <Upload className="h-5 w-5" />
          </div>
          <div className="mt-3 font-display text-base text-foreground">
            {photos.length >= MAX
              ? `Maximum atteint (${MAX} photos)`
              : <>Glissez-déposez ou <span className="text-brand-orange underline-offset-4 group-hover:underline">parcourez</span></>}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">JPEG, PNG ou WebP · max 8 Mo par photo · jusqu'à {MAX} photos</div>
        </div>


        {photos.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="block w-full"
                  aria-label={`Agrandir ${p.name}`}
                >
                  <img src={p.url} alt={p.name} className="aspect-square w-full object-cover transition group-hover:scale-[1.03]" />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-foreground/85 to-transparent px-2 py-1.5 text-[10px] text-background">
                  <span className="truncate font-medium">{p.name}</span>
                  {p.w && p.h && <span className="flex-shrink-0 opacity-80">{p.w}×{p.h}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/90 text-background shadow-sm transition hover:bg-destructive"
                  aria-label={`Retirer ${p.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute left-1.5 top-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-orange px-1.5 text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </div>
              </li>
            ))}
            {photos.length < MAX && (
              <li>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-[11px] font-semibold text-muted-foreground transition hover:border-brand-orange hover:text-brand-orange"
                >
                  <Plus className="h-5 w-5" />
                  Ajouter
                </button>
              </li>
            )}
          </ul>
        )}

        {lightbox !== null && photos[lightbox] && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex flex-col bg-foreground/95 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <div className="flex items-center justify-between gap-3 border-b border-background/10 px-4 py-3 text-background">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{photos[lightbox].name}</div>
                <div className="text-[11px] opacity-70">
                  Photo {lightbox + 1} / {photos.length}
                  {photos[lightbox].w && photos[lightbox].h && <> · {photos[lightbox].w}×{photos[lightbox].h} px</>}
                  {photos[lightbox].size && <> · {(photos[lightbox].size! / 1024 / 1024).toFixed(1)} Mo</>}
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => removePhoto(photos[lightbox].id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-destructive/90 px-3 py-1.5 text-xs font-semibold text-background hover:bg-destructive"
                >
                  <X className="h-3.5 w-3.5" /> Retirer
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 text-background hover:bg-background/25"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[lightbox].url}
                alt={photos[lightbox].name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-3 pb-5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/15 text-background transition hover:bg-background/30"
                  aria-label="Précédente"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox((lightbox + 1) % photos.length)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/15 text-background transition hover:bg-background/30"
                  aria-label="Suivante"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
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
  onPdf,
  pdfLoading,
  onShare,
  shareMsg,
  shareFallback,
}: {
  s: WizardState;
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  errors: Errors;
  range: { min: number; max: number } | null;
  photos: number;
  onPdf: () => void;
  pdfLoading: boolean;
  onShare: () => void | Promise<void>;
  shareMsg: string;
  shareFallback: boolean;
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

      {/* Récap final avant envoi */}
      <div className="mt-8 overflow-hidden rounded-2xl border-2 border-brand-orange/30 bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-brand-orange/[0.06] px-5 py-3 sm:px-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">Récapitulatif avant envoi</div>
            <h3 className="mt-0.5 font-display text-lg text-foreground sm:text-xl">
              {projets.find((p) => p.key === s.projet)?.label ?? "Projet"}
            </h3>
          </div>
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-brand-orange" />
        </div>

        <div className="p-5 sm:p-6">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
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
              <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange">Fourchette indicative TTC</div>
              <div className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
                {fmt(range.min)} – {fmt(range.max)} <span className="text-base text-muted-foreground">€</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">Non contractuelle — un artisan affinera après visite.</div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPdf}
              disabled={pdfLoading}
              aria-busy={pdfLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-orange hover:bg-brand-orange/5 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {pdfLoading ? "Génération…" : "Télécharger le PDF"}
            </button>
            <button
              type="button"
              onClick={() => onShare()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-orange hover:bg-brand-orange/5 sm:flex-none"
            >
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>
          {shareMsg && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <p className="flex-1 text-xs text-muted-foreground">{shareMsg}</p>
              {shareFallback && (
                <button
                  type="button"
                  onClick={onPdf}
                  disabled={pdfLoading}
                  aria-busy={pdfLoading}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                  {pdfLoading ? "Génération…" : "Télécharger le PDF"}
                </button>
              )}
            </div>
          )}
        </div>
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
