import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LogOut,
  Download,
  Share2,
  Mail,
  Plus,
  Trash2,
  Upload,
  FileText,
  Building2,
  User as UserIcon,
  Eye,
  ArrowLeft,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/parqueto-logo.png";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/devis")({
  component: DevisPage,
  head: () => ({
    meta: [
      { title: "Devis Express — Espace Pro Parqueto" },
      {
        name: "description",
        content:
          "Générez un devis PDF aux normes françaises depuis le chantier. Logo, TVA, mentions légales et envoi en deux clics.",
      },
    ],
  }),
});

// ---------------- Types & helpers --------------------------------------------

type Ligne = {
  id: string;
  designation: string;
  quantite: number;
  unite: string;
  prixHT: number;
};

type ArtisanProfil = {
  raisonSociale: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  rcs: string;
  assurance: string;
  mentionTVA: "assujetti" | "franchise"; // "TVA non applicable, art. 293 B du CGI"
  logoDataUrl: string | null;
};

type Client = {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  email: string;
  telephone: string;
};

const PROFIL_KEY = "parqueto.pro.profil";
const CLIENT_KEY = "parqueto.pro.derniereClient";

const emptyProfil: ArtisanProfil = {
  raisonSociale: "",
  siret: "",
  adresse: "",
  codePostal: "",
  ville: "",
  telephone: "",
  email: "",
  rcs: "",
  assurance: "",
  mentionTVA: "assujetti",
  logoDataUrl: null,
};

const emptyClient: Client = {
  nom: "",
  adresse: "",
  codePostal: "",
  ville: "",
  email: "",
  telephone: "",
};

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);

const dateFR = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(d);

const uid = () => Math.random().toString(36).slice(2, 9);

function numeroDevis() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `DEV-${y}${m}${day}-${rand}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

// ---------------- Component --------------------------------------------------

function DevisPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profil, setProfil] = useState<ArtisanProfil>(emptyProfil);
  const [client, setClient] = useState<Client>(emptyClient);
  const [lignes, setLignes] = useState<Ligne[]>([
    { id: uid(), designation: "Fourniture parquet chêne contrecollé 14 mm", quantite: 25, unite: "m²", prixHT: 65 },
    { id: uid(), designation: "Pose collée plein bain (incl. ragréage)", quantite: 25, unite: "m²", prixHT: 45 },
    { id: uid(), designation: "Plinthes assorties hauteur 60 mm", quantite: 22, unite: "ml", prixHT: 12 },
  ]);
  const [tauxTVA, setTauxTVA] = useState<10 | 20 | 5.5>(10);
  const [numero, setNumero] = useState<string>("");
  const [acomptePct, setAcomptePct] = useState(30);
  const [validiteJours, setValiditeJours] = useState(30);
  const [notes, setNotes] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profilOpen, setProfilOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Charger l'état persistant au montage
  useEffect(() => {
    setProfil(loadJSON(PROFIL_KEY, emptyProfil));
    setClient(loadJSON(CLIENT_KEY, emptyClient));
    setNumero(numeroDevis());
    // Ouvrir le profil si vide (premier usage)
    const p = loadJSON(PROFIL_KEY, emptyProfil);
    if (!p.raisonSociale) setProfilOpen(true);
  }, []);

  // Persister profil & client
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(PROFIL_KEY, JSON.stringify(profil));
  }, [profil]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
  }, [client]);

  // Cleanup preview blob
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const totalHT = useMemo(
    () => lignes.reduce((s, l) => s + l.quantite * l.prixHT, 0),
    [lignes],
  );
  const franchise = profil.mentionTVA === "franchise";
  const tvaApplicable = franchise ? 0 : tauxTVA;
  const totalTVA = (totalHT * tvaApplicable) / 100;
  const totalTTC = totalHT + totalTVA;
  const acompte = (totalTTC * acomptePct) / 100;
  const solde = totalTTC - acompte;

  // ---------------- PDF -------------------------------------------------------

  function buildPDF(): jsPDF {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const M = 14;
    let y = 14;

    // En-tête : logo + bloc artisan
    if (profil.logoDataUrl) {
      try {
        doc.addImage(profil.logoDataUrl, "PNG", M, y, 35, 18, undefined, "FAST");
      } catch {
        // ignore image errors
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(profil.raisonSociale || "Votre raison sociale", W - M, y + 4, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const headerRight = [
      profil.adresse,
      [profil.codePostal, profil.ville].filter(Boolean).join(" "),
      profil.telephone && `Tél. ${profil.telephone}`,
      profil.email,
      profil.siret && `SIRET ${profil.siret}`,
      profil.rcs && profil.rcs,
    ].filter(Boolean) as string[];
    headerRight.forEach((line, i) => doc.text(line, W - M, y + 9 + i * 4, { align: "right" }));

    y = Math.max(y + 18, y + 9 + headerRight.length * 4) + 6;
    doc.setDrawColor(220);
    doc.line(M, y, W - M, y);
    y += 8;

    // Titre devis + numéro
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("DEVIS", M, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`N° ${numero}`, M, y + 5);
    doc.text(`Émis le ${dateFR(new Date())}`, M, y + 10);
    doc.text(
      `Validité : ${validiteJours} jours`,
      M,
      y + 15,
    );

    // Bloc client (droite)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Client", W - M - 70, y);
    doc.setFont("helvetica", "normal");
    const clientLines = [
      client.nom,
      client.adresse,
      [client.codePostal, client.ville].filter(Boolean).join(" "),
      client.email,
      client.telephone,
    ].filter(Boolean) as string[];
    clientLines.forEach((line, i) => doc.text(line, W - M - 70, y + 5 + i * 4));

    y += Math.max(20, 5 + clientLines.length * 4) + 4;

    // Tableau lignes
    autoTable(doc, {
      startY: y,
      head: [["Désignation", "Qté", "Unité", "PU HT", "Total HT"]],
      body: lignes.map((l) => [
        l.designation || "—",
        new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(l.quantite),
        l.unite,
        eur(l.prixHT),
        eur(l.quantite * l.prixHT),
      ]),
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [220, 95, 30], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { halign: "right", cellWidth: 18 },
        2: { halign: "center", cellWidth: 16 },
        3: { halign: "right", cellWidth: 24 },
        4: { halign: "right", cellWidth: 28 },
      },
      margin: { left: M, right: M },
    });

    // Totaux
    // @ts-expect-error lastAutoTable is added by the plugin at runtime
    y = (doc.lastAutoTable?.finalY ?? y) + 6;
    const labelX = W - M - 60;
    const valX = W - M;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Total HT", labelX, y);
    doc.text(eur(totalHT), valX, y, { align: "right" });
    if (!franchise) {
      doc.text(`TVA (${tauxTVA} %)`, labelX, y + 5);
      doc.text(eur(totalTVA), valX, y + 5, { align: "right" });
      y += 5;
    }
    doc.setDrawColor(200);
    doc.line(labelX - 2, y + 2, valX, y + 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total TTC", labelX, y + 8);
    doc.text(eur(totalTTC), valX, y + 8, { align: "right" });

    if (acomptePct > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Acompte ${acomptePct} % à la commande : ${eur(acompte)}`, M, y + 8);
      doc.text(`Solde à la livraison : ${eur(solde)}`, M, y + 13);
      y += 5;
    }

    y += 18;

    // Notes
    if (notes.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Précisions chantier", M, y);
      doc.setFont("helvetica", "normal");
      const split = doc.splitTextToSize(notes, W - 2 * M);
      doc.text(split, M, y + 4);
      y += 6 + split.length * 4;
    }

    // Mentions légales (pied de page)
    doc.setDrawColor(220);
    const footY = 275;
    doc.line(M, footY - 4, W - M, footY - 4);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    const mentions: string[] = [];
    if (franchise) {
      mentions.push("TVA non applicable, art. 293 B du CGI.");
    }
    if (profil.assurance) mentions.push(`Assurance pro : ${profil.assurance}.`);
    mentions.push(
      "Devis gratuit valable selon durée indiquée. Bon pour accord à retourner daté et signé avec la mention « Bon pour travaux ».",
    );
    mentions.push(
      "En cas de litige, le client peut recourir gratuitement au médiateur de la consommation compétent (art. L.612-1 et s. du Code de la consommation).",
    );
    const mLines = doc.splitTextToSize(mentions.join(" "), W - 2 * M);
    doc.text(mLines, M, footY);

    doc.setTextColor(150);
    doc.setFontSize(7);
    doc.text("Devis généré avec Parqueto — espace Pro", W - M, 290, { align: "right" });

    return doc;
  }

  function safeFilename() {
    const base = (client.nom || "client").replace(/[^\w-]+/g, "_").slice(0, 40);
    return `Devis_${numero}_${base}.pdf`;
  }

  function handleDownload() {
    const doc = buildPDF();
    doc.save(safeFilename());
  }

  function handlePreview() {
    const doc = buildPDF();
    const blob = doc.output("blob");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  }

  async function handleShare() {
    const doc = buildPDF();
    const blob = doc.output("blob");
    const file = new File([blob], safeFilename(), { type: "application/pdf" });

    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: `Devis ${numero}`,
          text: `Devis ${numero} — ${profil.raisonSociale}`,
        });
        return;
      } catch {
        // user cancelled : fallback below
      }
    }
    // Fallback : ouvrir dans un onglet
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  function handleEmail() {
    handleDownload();
    const subject = encodeURIComponent(`Devis ${numero} — ${profil.raisonSociale || "votre projet"}`);
    const body = encodeURIComponent(
      [
        `Bonjour ${client.nom || ""},`.trim(),
        "",
        `Vous trouverez ci-joint le devis n° ${numero} d'un montant de ${eur(totalTTC)} TTC.`,
        `Ce devis est valable ${validiteJours} jours à compter de sa date d'émission.`,
        "",
        "Restant à votre disposition pour toute question,",
        profil.raisonSociale || "",
      ].join("\n"),
    );
    const to = client.email ? encodeURIComponent(client.email) : "";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  function handleLogoUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setProfil((p) => ({ ...p, logoDataUrl: typeof reader.result === "string" ? reader.result : null }));
    };
    reader.readAsDataURL(file);
  }

  // ---------------- UI --------------------------------------------------------

  const profilIncomplet = !profil.raisonSociale || !profil.siret;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/_authenticated/historique" className="text-muted-foreground hover:text-foreground sm:hidden" aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link to="/" className="hidden items-center gap-2 sm:flex">
              <img src={logo} alt="Parqueto" className="h-9 w-auto" />
            </Link>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-brand-orange" />
              <span className="font-display text-base">Devis Express</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">{user?.email}</span>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
            >
              <LogOut className="h-3.5 w-3.5" /> Quitter
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Bandeau profil incomplet */}
        {profilIncomplet && !profilOpen && (
          <button
            onClick={() => setProfilOpen(true)}
            className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-left text-sm text-amber-900"
          >
            <span>⚠️ Complétez votre profil artisan (raison sociale, SIRET, logo) pour des devis aux normes.</span>
            <span className="font-semibold underline">Compléter</span>
          </button>
        )}

        {/* Section profil artisan */}
        <details
          open={profilOpen}
          onToggle={(e) => setProfilOpen((e.target as HTMLDetailsElement).open)}
          className="mb-6 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-brand-orange" />
              <div>
                <div className="font-display text-base">Mon profil artisan</div>
                <div className="text-[11px] text-muted-foreground">
                  {profil.raisonSociale || "Non renseigné"} · sauvegardé sur cet appareil
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{profilOpen ? "Replier" : "Modifier"}</span>
          </summary>
          <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Logo (PNG/JPG, max ~1 Mo)">
                <div className="flex items-center gap-3">
                  {profil.logoDataUrl ? (
                    <img src={profil.logoDataUrl} alt="Logo" className="h-16 w-16 rounded-lg border border-border object-contain bg-white p-1" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      Aucun
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      <Upload className="h-3.5 w-3.5" /> {profil.logoDataUrl ? "Remplacer" : "Importer"}
                    </button>
                    {profil.logoDataUrl && (
                      <button
                        type="button"
                        onClick={() => setProfil((p) => ({ ...p, logoDataUrl: null }))}
                        className="text-xs text-muted-foreground underline"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleLogoUpload(f);
                      e.target.value = "";
                    }}
                  />
                </div>
              </Field>
            </div>
            <Field label="Raison sociale *">
              <Input value={profil.raisonSociale} onChange={(v) => setProfil((p) => ({ ...p, raisonSociale: v }))} />
            </Field>
            <Field label="SIRET *">
              <Input value={profil.siret} onChange={(v) => setProfil((p) => ({ ...p, siret: v }))} />
            </Field>
            <Field label="Adresse">
              <Input value={profil.adresse} onChange={(v) => setProfil((p) => ({ ...p, adresse: v }))} />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="CP">
                <Input value={profil.codePostal} onChange={(v) => setProfil((p) => ({ ...p, codePostal: v }))} />
              </Field>
              <div className="col-span-2">
                <Field label="Ville">
                  <Input value={profil.ville} onChange={(v) => setProfil((p) => ({ ...p, ville: v }))} />
                </Field>
              </div>
            </div>
            <Field label="Téléphone">
              <Input value={profil.telephone} onChange={(v) => setProfil((p) => ({ ...p, telephone: v }))} />
            </Field>
            <Field label="Email pro">
              <Input value={profil.email} onChange={(v) => setProfil((p) => ({ ...p, email: v }))} />
            </Field>
            <Field label="RCS / RM">
              <Input value={profil.rcs} onChange={(v) => setProfil((p) => ({ ...p, rcs: v }))} />
            </Field>
            <Field label="Assurance professionnelle">
              <Input value={profil.assurance} onChange={(v) => setProfil((p) => ({ ...p, assurance: v }))} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Régime TVA">
                <div className="flex gap-2">
                  {(["assujetti", "franchise"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setProfil((p) => ({ ...p, mentionTVA: k }))}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        profil.mentionTVA === k
                          ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                          : "border-border bg-background"
                      }`}
                    >
                      {k === "assujetti" ? "Assujetti TVA" : "Franchise en base (art. 293 B)"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        </details>

        {/* Bloc Client */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-brand-orange" />
            <h2 className="font-display text-base">Client</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nom / société">
              <Input value={client.nom} onChange={(v) => setClient((c) => ({ ...c, nom: v }))} />
            </Field>
            <Field label="Email">
              <Input value={client.email} onChange={(v) => setClient((c) => ({ ...c, email: v }))} />
            </Field>
            <Field label="Adresse chantier">
              <Input value={client.adresse} onChange={(v) => setClient((c) => ({ ...c, adresse: v }))} />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="CP">
                <Input value={client.codePostal} onChange={(v) => setClient((c) => ({ ...c, codePostal: v }))} />
              </Field>
              <div className="col-span-2">
                <Field label="Ville">
                  <Input value={client.ville} onChange={(v) => setClient((c) => ({ ...c, ville: v }))} />
                </Field>
              </div>
            </div>
            <Field label="Téléphone">
              <Input value={client.telephone} onChange={(v) => setClient((c) => ({ ...c, telephone: v }))} />
            </Field>
          </div>
        </div>

        {/* Lignes */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base">Prestations & fournitures</h2>
            <button
              type="button"
              onClick={() =>
                setLignes((l) => [...l, { id: uid(), designation: "", quantite: 1, unite: "m²", prixHT: 0 }])
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une ligne
            </button>
          </div>
          <div className="space-y-2">
            {lignes.map((l, i) => (
              <div key={l.id} className="grid grid-cols-12 items-end gap-2 rounded-xl border border-border/70 bg-background p-2.5">
                <div className="col-span-12 sm:col-span-5">
                  <Label>Désignation</Label>
                  <Input
                    value={l.designation}
                    onChange={(v) => setLignes((arr) => arr.map((x, j) => (j === i ? { ...x, designation: v } : x)))}
                    placeholder="Ex. Pose collée chêne 14 mm"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label>Qté</Label>
                  <NumInput
                    value={l.quantite}
                    onChange={(v) => setLignes((arr) => arr.map((x, j) => (j === i ? { ...x, quantite: v } : x)))}
                    step={0.5}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label>Unité</Label>
                  <select
                    value={l.unite}
                    onChange={(e) => setLignes((arr) => arr.map((x, j) => (j === i ? { ...x, unite: e.target.value } : x)))}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm outline-none focus:border-brand-orange"
                  >
                    {["m²", "ml", "h", "u", "forfait", "L", "kg"].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label>PU HT (€)</Label>
                  <NumInput
                    value={l.prixHT}
                    onChange={(v) => setLignes((arr) => arr.map((x, j) => (j === i ? { ...x, prixHT: v } : x)))}
                    step={1}
                  />
                </div>
                <div className="col-span-12 flex items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                  <span className="text-sm font-semibold text-foreground">{eur(l.quantite * l.prixHT)}</span>
                  <button
                    type="button"
                    onClick={() => setLignes((arr) => arr.filter((_, j) => j !== i))}
                    aria-label="Supprimer la ligne"
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paramètres devis */}
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <Field label="TVA applicable">
              <select
                value={String(tauxTVA)}
                onChange={(e) => setTauxTVA(Number(e.target.value) as 10 | 20 | 5.5)}
                disabled={franchise}
                className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm outline-none focus:border-brand-orange disabled:opacity-50"
              >
                <option value="10">10 % (rénovation logement &gt; 2 ans)</option>
                <option value="20">20 % (neuf / standard)</option>
                <option value="5.5">5,5 % (éco-PTZ / énergétique)</option>
              </select>
            </Field>
            <Field label="Acompte (%)">
              <NumInput value={acomptePct} onChange={setAcomptePct} step={5} />
            </Field>
            <Field label="Validité (jours)">
              <NumInput value={validiteJours} onChange={setValiditeJours} step={1} />
            </Field>
            <div className="sm:col-span-3">
              <Field label="Précisions chantier (optionnel)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Délai d'intervention, conditions d'accès, garantie, etc."
                  className="w-full rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-brand-orange"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Totaux + actions */}
        <div className="sticky bottom-0 -mx-4 rounded-t-2xl border-t border-border bg-card p-4 shadow-warm sm:mx-0 sm:rounded-2xl sm:border">
          <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Devis n° {numero}
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm sm:max-w-sm">
                <span className="text-muted-foreground">Total HT</span>
                <span className="text-right font-medium">{eur(totalHT)}</span>
                {!franchise && (
                  <>
                    <span className="text-muted-foreground">TVA {tauxTVA} %</span>
                    <span className="text-right font-medium">{eur(totalTVA)}</span>
                  </>
                )}
                <span className="font-display text-base text-foreground">Total TTC</span>
                <span className="text-right font-display text-base text-brand-orange">{eur(totalTTC)}</span>
                {acomptePct > 0 && (
                  <>
                    <span className="text-[11px] text-muted-foreground">Acompte {acomptePct} %</span>
                    <span className="text-right text-[11px] text-muted-foreground">{eur(acompte)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                onClick={handlePreview}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2.5 text-xs font-semibold hover:bg-accent"
              >
                <Eye className="h-4 w-4" /> Aperçu
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-orange px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-warm hover:bg-brand-orange-deep"
              >
                <Download className="h-4 w-4" /> Télécharger
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-2.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange/20"
              >
                <Share2 className="h-4 w-4" /> Partager
              </button>
              <button
                onClick={handleEmail}
                disabled={!client.email}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2.5 text-xs font-semibold hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                title={client.email ? "Envoyer par email" : "Renseignez l'email du client"}
              >
                <Mail className="h-4 w-4" /> Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* Modal aperçu PDF */}
        {previewUrl && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Aperçu du devis"
            className="fixed inset-0 z-50 flex flex-col bg-black/70 p-2 sm:p-6"
            onClick={() => setPreviewUrl(null)}
          >
            <div
              className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border p-3">
                <div className="text-sm font-semibold">Aperçu PDF</div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    Télécharger
                  </button>
                  <button onClick={() => setPreviewUrl(null)} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                    Fermer
                  </button>
                </div>
              </div>
              <iframe src={previewUrl} title="Aperçu devis" className="flex-1 w-full" />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// ---------------- Sub-components --------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
    />
  );
}

function NumInput({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={0}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm tabular-nums outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
    />
  );
}
