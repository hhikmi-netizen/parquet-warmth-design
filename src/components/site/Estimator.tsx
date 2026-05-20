import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import jsPDF from "jspdf";
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
  FileDown,
  Share2,
  Ruler,
  ClipboardList,
  Calculator,
  Send,
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

const PLINTHE_PRICE = 18;
const SEUIL_PRICE = 110;

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n / 10) * 10);
const fmtNum = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n);

// ---------- Persistance ----------
const STORAGE_KEY = "parqueto:estimate:v1";
const CONTACT_KEY = "parqueto:contact:v1";

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

const DEFAULT_CONTACT: ContactInput = {
  nom: "",
  email: "",
  telephone: "",
  cp: "",
  message: "",
};

function loadContact(): ContactInput {
  if (typeof window === "undefined") return DEFAULT_CONTACT;
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (!raw) return DEFAULT_CONTACT;
    return { ...DEFAULT_CONTACT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONTACT;
  }
}

// ---------- Lien devis (encodage URL) ----------
const QUOTE_PARAM = "devis";

function encodeQuote(state: EstimateState): string {
  try {
    const payload = JSON.stringify(state);
    // base64url safe
    return btoa(unescape(encodeURIComponent(payload)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeQuote(token: string): Partial<EstimateState> | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object") return parsed as Partial<EstimateState>;
    return null;
  } catch {
    return null;
  }
}

function buildQuoteLink(state: EstimateState): string {
  const token = encodeQuote(state);
  if (typeof window === "undefined") return `https://parqueto.fr/?${QUOTE_PARAM}=${token}#estimate`;
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?${QUOTE_PARAM}=${token}#estimate`;
}

// ---------- Génération PDF ----------
type Totals = {
  min: number;
  max: number;
  surface: number;
  perimetre: number;
  plinthesCost: number;
  seuilsCost: number;
  laborMin: number;
  laborMax: number;
};

function buildQuoteDoc(state: EstimateState, totals: Totals, contact?: ContactInput) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  const RIGHT = W - M;
  let y = 14;

  // Bandeau haut
  doc.setFillColor(232, 93, 58);
  doc.rect(0, 0, W, 6, "F");
  y += 8;

  // En-tête : marque + référence + date
  const ref = `PQ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20);
  doc.text("Parqueto", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Estimation parquet artisanal", M, y + 5);

  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(`Devis ${ref}`, RIGHT, y, { align: "right" });
  doc.setTextColor(120);
  doc.text(new Date().toLocaleDateString("fr-FR"), RIGHT, y + 5, { align: "right" });
  doc.text("Validité 30 jours", RIGHT, y + 10, { align: "right" });

  y += 16;
  doc.setDrawColor(232, 93, 58);
  doc.setLineWidth(0.6);
  doc.line(M, y, RIGHT, y);
  doc.setLineWidth(0.2);
  y += 8;

  // Bloc Client / Pour
  const colW = (RIGHT - M - 6) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("ÉMETTEUR", M, y);
  doc.text("CLIENT", M + colW + 6, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.text("Parqueto", M, y);
  doc.text("contact@parqueto.fr", M, y + 5);
  doc.text("parqueto.fr", M, y + 10);

  const cx = M + colW + 6;
  if (contact && (contact.nom || contact.email)) {
    if (contact.nom) doc.text(contact.nom, cx, y);
    if (contact.email) doc.text(contact.email, cx, y + 5);
    let cy = y + 10;
    if (contact.telephone) { doc.text(`Tél. ${contact.telephone}`, cx, cy); cy += 5; }
    if (contact.cp) doc.text(`Code postal ${contact.cp}`, cx, cy);
  } else {
    doc.setTextColor(150);
    doc.text("À compléter", cx, y);
    doc.setTextColor(30);
  }

  y += 22;

  // Section Projet
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Descriptif du projet", M, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const rows: [string, string][] = [
    ["Prestation", services[state.service].label],
    ["Type de parquet", types[state.type].label],
    ["État actuel", etats[state.etat].label],
    ["Dimensions", `${state.longueur} × ${state.largeur} m`],
    ["Surface", `${fmtNum(totals.surface)} m²`],
    ["Périmètre", `${fmtNum(totals.perimetre)} ml`],
  ];

  rows.forEach(([k, v], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 246, 242);
      doc.rect(M, y - 4, RIGHT - M, 6, "F");
    }
    doc.setTextColor(110); doc.text(k, M + 2, y);
    doc.setTextColor(20); doc.text(v, M + 60, y);
    y += 6;
  });

  y += 6;

  // Détail chiffré
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Détail estimatif", M, y);
  y += 6;

  // En-têtes colonnes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text("LIGNE", M + 2, y);
  doc.text("MIN", RIGHT - 40, y, { align: "right" });
  doc.text("MAX", RIGHT - 2, y, { align: "right" });
  y += 2;
  doc.setDrawColor(220);
  doc.line(M, y, RIGHT, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lineItems: { label: string; min: number; max: number }[] = [
    {
      label: `${services[state.service].label} · ${types[state.type].label}`,
      min: totals.laborMin,
      max: totals.laborMax,
    },
  ];
  if (state.plinthes) {
    lineItems.push({
      label: `Plinthes (${fmtNum(totals.perimetre)} ml × ${PLINTHE_PRICE} €)`,
      min: totals.plinthesCost,
      max: totals.plinthesCost,
    });
  }
  if (state.seuils > 0) {
    lineItems.push({
      label: `Seuils (${state.seuils} × ${SEUIL_PRICE} €)`,
      min: totals.seuilsCost,
      max: totals.seuilsCost,
    });
  }

  lineItems.forEach(({ label, min, max }) => {
    doc.setTextColor(40);
    const wrapped = doc.splitTextToSize(label, RIGHT - M - 90);
    doc.text(wrapped, M + 2, y);
    doc.setTextColor(20);
    doc.text(`${fmt(min)} €`, RIGHT - 40, y, { align: "right" });
    doc.text(`${fmt(max)} €`, RIGHT - 2, y, { align: "right" });
    y += Math.max(6, wrapped.length * 5);
  });

  y += 2;
  doc.setDrawColor(220);
  doc.line(M, y, RIGHT, y);
  y += 6;

  // Total / Fourchette
  doc.setFillColor(255, 244, 238);
  doc.roundedRect(M, y, RIGHT - M, 22, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(232, 93, 58);
  doc.text("FOURCHETTE TOTALE TTC", M + 4, y + 7);
  doc.setFontSize(17);
  doc.setTextColor(20);
  doc.text(`${fmt(totals.min)} – ${fmt(totals.max)} €`, RIGHT - 4, y + 14, { align: "right" });
  y += 28;

  // Lien devis
  const link = buildQuoteLink(state);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("RETROUVER CE DEVIS EN LIGNE", M, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(232, 93, 58);
  const linkLines = doc.splitTextToSize(link, RIGHT - M);
  doc.textWithLink(linkLines[0], M, y, { url: link });
  if (linkLines.length > 1) {
    for (let i = 1; i < linkLines.length; i++) {
      y += 4;
      doc.textWithLink(linkLines[i], M, y, { url: link });
    }
  }
  y += 8;

  // Note bas
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(130);
  const note =
    "Estimation indicative générée à titre informatif, hors fournitures spécifiques. Un devis définitif sera établi après visite technique sur place. Validité 30 jours à compter de la date d'émission.";
  const split = doc.splitTextToSize(note, RIGHT - M);
  doc.text(split, M, y);

  // Pied de page
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160);
  doc.setFontSize(8);
  doc.text("contact@parqueto.fr  ·  parqueto.fr", M, 287);
  doc.text(ref, RIGHT, 287, { align: "right" });

  return doc;
}

function generateQuotePDF(state: EstimateState, totals: Totals, contact?: ContactInput) {
  buildQuoteDoc(state, totals, contact).save(`devis-parqueto-${Date.now()}.pdf`);
}

function buildShareText(state: EstimateState, totals: Totals) {
  return [
    `Devis Parqueto — ${services[state.service].label}`,
    `${types[state.type].label} · ${etats[state.etat].label}`,
    `Surface : ${fmtNum(totals.surface)} m²${state.plinthes ? " · plinthes" : ""}${state.seuils > 0 ? ` · ${state.seuils} seuil(s)` : ""}`,
    `Fourchette estimée : ${fmt(totals.min)} – ${fmt(totals.max)} € TTC`,
    ``,
    `Voir le devis : ${buildQuoteLink(state)}`,
  ].join("\n");
}

type ShareResult = "shared" | "copied" | "aborted" | "unsupported" | "error";

async function shareQuote(state: EstimateState, totals: Totals, contact?: ContactInput): Promise<ShareResult> {
  const text = buildShareText(state, totals);
  const title = "Mon devis Parqueto";
  const url = buildQuoteLink(state);

  const copyFallback = async (): Promise<ShareResult> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return "copied";
      }
      return "unsupported";
    } catch {
      return "error";
    }
  };

  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return copyFallback();
  }

  // 1) Tentative avec PDF en pièce jointe (mobile compatibles)
  try {
    const doc = buildQuoteDoc(state, totals, contact);
    const blob = doc.output("blob");
    const file = new File([blob], `devis-parqueto.pdf`, { type: "application/pdf" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await navigator.share({ title, text, url, files: [file] });
      return "shared";
    }
  } catch (err) {
    const name = (err as DOMException)?.name;
    if (name === "AbortError") return "aborted";
    // NotAllowedError, DataError, TypeError → on retombe sur le partage texte
  }

  // 2) Partage texte + URL (sans fichier)
  try {
    await navigator.share({ title, text, url });
    return "shared";
  } catch (err) {
    const name = (err as DOMException)?.name;
    if (name === "AbortError") return "aborted";
    return copyFallback();
  }
}


// ---------- Composant ----------
export function Estimator() {
  const [s, setS] = useState<EstimateState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [initialContact, setInitialContact] = useState<ContactInput>(DEFAULT_CONTACT);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadState();
    // Override depuis l'URL si présent (lien devis partagé)
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get(QUOTE_PARAM);
      if (token) {
        const decoded = decodeQuote(token);
        if (decoded) {
          setS({ ...loaded, ...decoded });
          setShowContact(false);
          setHydrated(true);
          setInitialContact(loadContact());
          // scroll vers l'estimateur après hydratation
          setTimeout(() => {
            document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setS(loaded);
    setInitialContact(loadContact());
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

  const totals: Totals = useMemo(() => {
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
      laborMin: baseMin,
      laborMax: baseMax,
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

      {/* CTA principal + PDF + Partage */}
      {!showContact ? (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowContact(true)}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep active:scale-[0.98]"
          >
            Être recontacté avec ce devis
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => generateQuotePDF(s, totals, initialContact)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 bg-background/5 px-4 py-3 text-xs font-semibold text-background transition hover:bg-background/10 active:scale-[0.98]"
              aria-label="Télécharger le devis PDF"
            >
              <FileDown className="h-4 w-4 text-brand-orange" />
              Devis PDF
            </button>
            <button
              onClick={async () => {
                const r = await shareQuote(s, totals, initialContact);
                if (r === "copied") setShareMsg("Résumé copié dans le presse-papier");
                else if (r === "shared") setShareMsg("Devis partagé");
                else if (r === "error") setShareMsg("Partage indisponible");
                if (r === "copied" || r === "shared" || r === "error") {
                  setTimeout(() => setShareMsg(null), 2500);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 bg-background/5 px-4 py-3 text-xs font-semibold text-background transition hover:bg-background/10 active:scale-[0.98]"
              aria-label="Partager le devis"
            >
              <Share2 className="h-4 w-4 text-brand-orange" />
              Partager
            </button>
          </div>
          {shareMsg && (
            <p className="text-center text-[11px] text-background/70" role="status" aria-live="polite">
              {shareMsg}
            </p>
          )}
        </div>
      ) : (
        <ContactForm
          totals={totals}
          state={s}
          initial={initialContact}
          onCancel={() => setShowContact(false)}
          onSaved={(c) => setInitialContact(c)}
        />
      )}

      {/* Comment ça marche */}
      <div className="mt-5 rounded-xl border border-background/10 bg-background/5 p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h4 className="font-display text-sm text-background">Comment ça marche</h4>
        </div>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { icon: Ruler, t: "1. Mesurez", d: "Longueur × largeur de la pièce." },
            { icon: ClipboardList, t: "2. Décrivez", d: "Type, état, options." },
            { icon: Calculator, t: "3. Estimez", d: "Fourchette TTC en direct." },
            { icon: Send, t: "4. Recevez", d: "Devis PDF ou rappel sous 24 h." },
          ].map(({ icon: Icon, t, d }) => (
            <li
              key={t}
              className="flex items-start gap-2 rounded-lg border border-background/10 bg-background/5 p-2.5"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <div>
                <div className="text-xs font-semibold text-background">{t}</div>
                <div className="text-[11px] text-background/60 leading-snug">{d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

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
  initial,
  onCancel,
  onSaved,
}: {
  totals: Totals;
  state: EstimateState;
  initial: ContactInput;
  onCancel: () => void;
  onSaved: (c: ContactInput) => void;
}) {
  const [form, setForm] = useState<ContactInput>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Persist on change (pré-remplissage au retour)
  useEffect(() => {
    try {
      localStorage.setItem(CONTACT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const set = (k: keyof ContactInput, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return null;
    }
    return parsed.data;
  };

  const submit = () => {
    const data = validate();
    if (!data) return;
    setSending(true);
    onSaved(data);

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
      `— ${data.nom}`,
      `Tél. ${data.telephone} · CP ${data.cp}`,
      data.message ? `\nMessage : ${data.message}` : "",
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

  const downloadPdf = () => {
    const data = validate();
    generateQuotePDF(state, totals, data ?? form);
    if (data) onSaved(data);
  };

  if (sent) {
    return (
      <div className="mt-4 rounded-xl border border-brand-orange/40 bg-brand-orange/10 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-brand-orange" />
        <h4 className="mt-2 font-display text-xl text-background">Demande envoyée</h4>
        <p className="mt-1 text-xs text-background/70">
          Un artisan vous recontacte sous 24 h. Vos infos sont sauvegardées pour la prochaine fois.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
          <button
            onClick={() => generateQuotePDF(state, totals, form)}
            className="inline-flex items-center gap-1.5 font-semibold text-brand-orange underline-offset-4 hover:underline"
          >
            <FileDown className="h-3.5 w-3.5" /> Télécharger le devis PDF
          </button>
          <button
            onClick={() => {
              setSent(false);
              onCancel();
            }}
            className="font-semibold text-background/70 underline-offset-4 hover:underline"
          >
            Modifier mon estimation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2.5 rounded-xl border border-background/15 bg-background/5 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-background">Vos coordonnées</div>
        <button
          onClick={onCancel}
          className="text-[11px] text-background/55 underline-offset-4 hover:underline"
        >
          Annuler
        </button>
      </div>

      {/* Nom + Email côte à côte sur sm+, empilés mobile */}
      <div className="grid gap-2 sm:grid-cols-2">
        <FormField
          label="Nom"
          value={form.nom}
          onChange={(v) => set("nom", v)}
          error={errors.nom}
          placeholder="Camille Dubois"
          autoComplete="name"
          tabIndex={1}
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
          tabIndex={2}
        />
      </div>

      {/* Tél + CP compacts */}
      <div className="grid grid-cols-[1fr_96px] gap-2">
        <FormField
          label="Téléphone"
          value={form.telephone}
          onChange={(v) => set("telephone", v)}
          error={errors.telephone}
          placeholder="06 12 34 56 78"
          autoComplete="tel"
          inputMode="tel"
          tabIndex={3}
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
          tabIndex={4}
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
        tabIndex={5}
      />

      <div className="rounded-lg border border-background/10 bg-background/5 p-2.5 text-[11px] text-background/65">
        <div className="font-semibold text-background/80">Récap envoyé</div>
        <div className="mt-0.5 leading-relaxed">
          {services[state.service].label} · {types[state.type].label} · {fmtNum(totals.surface)} m²
          {state.plinthes && ` · plinthes`}
          {state.seuils > 0 && ` · ${state.seuils} seuil${state.seuils > 1 ? "s" : ""}`}
          {" · "}
          <span className="font-semibold text-brand-orange">
            {fmt(totals.min)}–{fmt(totals.max)} €
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <button
          onClick={submit}
          disabled={sending}
          tabIndex={6}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep active:scale-[0.98] disabled:opacity-70"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Envoyer ma demande
        </button>
        <button
          onClick={downloadPdf}
          tabIndex={7}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 bg-background/5 px-4 py-3 text-xs font-semibold text-background transition hover:bg-background/10 active:scale-[0.98]"
        >
          <FileDown className="h-4 w-4 text-brand-orange" /> Devis PDF
        </button>
      </div>
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
  tabIndex,
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
  tabIndex?: number;
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
          rows={2}
          tabIndex={tabIndex}
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
          tabIndex={tabIndex}
          enterKeyHint={tabIndex === 5 ? "send" : "next"}
          className={inputCls}
        />
      )}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}
