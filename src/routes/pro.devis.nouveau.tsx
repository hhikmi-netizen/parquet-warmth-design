import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Printer,
  FileDown,
  User,
  Home,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { PqButton, PqSurface, PqField } from "@/components/parqueto";

export const Route = createFileRoute("/pro/devis/nouveau")({
  component: NouveauDevisPage,
  head: () => ({
    meta: [{ title: "Nouveau devis — Parqueto" }],
  }),
});

type Line = {
  id: string;
  designation: string;
  detail: string;
  qty: number;
  unit: string;
  pu: number;
};

const todayFr = () => {
  const d = new Date();
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const addDaysFr = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

const DEFAULT_LINES: Line[] = [
  {
    id: "1",
    designation: "Parquet contrecollé chêne naturel",
    detail: "Lame 14 mm · 190 mm · Finition huilée",
    qty: 45,
    unit: "m²",
    pu: 62,
  },
  {
    id: "2",
    designation: "Sous-couche acoustique",
    detail: "Sous-couche isolante 2 mm",
    qty: 45,
    unit: "m²",
    pu: 6.5,
  },
  {
    id: "3",
    designation: "Pose collée en plein",
    detail: "Préparation du support et pose",
    qty: 45,
    unit: "m²",
    pu: 38,
  },
  {
    id: "4",
    designation: "Plinthes MDF + pose",
    detail: "Finition chêne · hauteur 80 mm",
    qty: 45,
    unit: "ml",
    pu: 9.5,
  },
];

function NouveauDevisPage() {
  const [numero, setNumero] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-017`,
  );
  const [tvaRate, setTvaRate] = useState(10);

  const [client, setClient] = useState({
    nom: "M. Dupont",
    adresse: "12 rue des Lilas",
    cp: "75000 Paris",
    tel: "06 12 34 56 78",
    email: "m.dupont@email.com",
  });

  const [projet, setProjet] = useState({
    titre: "Pose de parquet contrecollé",
    type: "Appartement",
    surface: "45 m²",
  });

  const [artisan, setArtisan] = useState({
    nom: "Atelier du Parquet",
    siret: "123 456 789 00012",
    tel: "06 98 76 54 32",
    email: "contact@atelier-parquet.fr",
    site: "www.atelier-parquet.fr",
  });

  const [lines, setLines] = useState<Line[]>(DEFAULT_LINES);
  const [notes, setNotes] = useState(
    "Les travaux seront réalisés selon les règles de l'art et les normes en vigueur.",
  );
  const [inclus, setInclus] = useState<string>(
    "Protection du chantier\nNettoyage en fin de travaux\nÉvacuation des déchets",
  );

  const totals = useMemo(() => {
    const ht = lines.reduce((sum, l) => sum + l.qty * l.pu, 0);
    const tva = (ht * tvaRate) / 100;
    return { ht, tva, ttc: ht + tva };
  }, [lines, tvaRate]);

  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((arr) => arr.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addLine = () =>
    setLines((arr) => [
      ...arr,
      { id: crypto.randomUUID(), designation: "", detail: "", qty: 1, unit: "m²", pu: 0 },
    ]);
  const removeLine = (id: string) => setLines((arr) => arr.filter((l) => l.id !== id));

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      {/* Header — hidden when printing */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Mon espace
          </Link>
          <div className="flex items-center gap-2">
            <PqButton variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimer
            </PqButton>
            <PqButton size="sm" onClick={() => window.print()}>
              <FileDown className="h-4 w-4" />
              Télécharger PDF
            </PqButton>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[380px_1fr] print:block print:max-w-none print:p-0">
        {/* Form panel */}
        <aside className="space-y-5 print:hidden">
          <div>
            <h1 className="font-serif text-2xl text-brand-ink">Nouveau devis</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Saisissez les informations, l'aperçu se met à jour en direct.
            </p>
          </div>

          <PqSurface className="space-y-3 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Devis
            </div>
            <PqField
              label="N° devis"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <PqField
              label="TVA (%)"
              type="number"
              value={String(tvaRate)}
              onChange={(e) => setTvaRate(Number(e.target.value) || 0)}
            />
          </PqSurface>

          <PqSurface className="space-y-3 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Client
            </div>
            <PqField
              label="Nom"
              value={client.nom}
              onChange={(e) => setClient({ ...client, nom: e.target.value })}
            />
            <PqField
              label="Adresse"
              value={client.adresse}
              onChange={(e) => setClient({ ...client, adresse: e.target.value })}
            />
            <PqField
              label="CP / Ville"
              value={client.cp}
              onChange={(e) => setClient({ ...client, cp: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <PqField
                label="Téléphone"
                value={client.tel}
                onChange={(e) => setClient({ ...client, tel: e.target.value })}
              />
              <PqField
                label="Email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
              />
            </div>
          </PqSurface>

          <PqSurface className="space-y-3 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Projet
            </div>
            <PqField
              label="Intitulé"
              value={projet.titre}
              onChange={(e) => setProjet({ ...projet, titre: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <PqField
                label="Type"
                value={projet.type}
                onChange={(e) => setProjet({ ...projet, type: e.target.value })}
              />
              <PqField
                label="Surface"
                value={projet.surface}
                onChange={(e) => setProjet({ ...projet, surface: e.target.value })}
              />
            </div>
          </PqSurface>

          <PqSurface className="space-y-3 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Mon entreprise
            </div>
            <PqField
              label="Raison sociale"
              value={artisan.nom}
              onChange={(e) => setArtisan({ ...artisan, nom: e.target.value })}
            />
            <PqField
              label="SIRET"
              value={artisan.siret}
              onChange={(e) => setArtisan({ ...artisan, siret: e.target.value })}
            />
            <PqField
              label="Téléphone"
              value={artisan.tel}
              onChange={(e) => setArtisan({ ...artisan, tel: e.target.value })}
            />
            <PqField
              label="Email"
              value={artisan.email}
              onChange={(e) => setArtisan({ ...artisan, email: e.target.value })}
            />
            <PqField
              label="Site web"
              value={artisan.site}
              onChange={(e) => setArtisan({ ...artisan, site: e.target.value })}
            />
          </PqSurface>

          <PqSurface className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                Lignes
              </div>
              <PqButton type="button" variant="ghost" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4" /> Ajouter
              </PqButton>
            </div>
            {lines.map((l) => (
              <div
                key={l.id}
                className="space-y-2 rounded-2xl border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Désignation
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(l.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer la ligne"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <PqField
                  label="Titre"
                  value={l.designation}
                  onChange={(e) => updateLine(l.id, { designation: e.target.value })}
                />
                <PqField
                  label="Détail"
                  value={l.detail}
                  onChange={(e) => updateLine(l.id, { detail: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2">
                  <PqField
                    label="Qté"
                    type="number"
                    value={String(l.qty)}
                    onChange={(e) => updateLine(l.id, { qty: Number(e.target.value) || 0 })}
                  />
                  <PqField
                    label="Unité"
                    value={l.unit}
                    onChange={(e) => updateLine(l.id, { unit: e.target.value })}
                  />
                  <PqField
                    label="PU HT"
                    type="number"
                    value={String(l.pu)}
                    onChange={(e) => updateLine(l.id, { pu: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Total HT : <span className="font-semibold text-foreground">{fmt(l.qty * l.pu)}</span>
                </div>
              </div>
            ))}
          </PqSurface>

          <PqSurface className="space-y-3 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Prestation incluse · Notes
            </div>
            <label className="block text-xs font-semibold text-muted-foreground">
              Compris dans la prestation (une ligne par item)
            </label>
            <textarea
              value={inclus}
              onChange={(e) => setInclus(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
          </PqSurface>
        </aside>

        {/* Preview — printable */}
        <section className="print:p-0">
          <div
            id="devis-print"
            className="mx-auto w-full max-w-[820px] rounded-3xl border border-border bg-[#FBF7F0] p-8 shadow-warm print:max-w-none print:rounded-none print:border-0 print:shadow-none print:p-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6 border-b border-brand-orange/30 pb-6">
              <div>
                <div className="font-serif text-3xl font-bold tracking-tight text-brand-ink">
                  PARQUETO
                </div>
                <div className="mt-1 text-xs italic text-brand-orange">
                  Le parquet, sans détour.
                </div>
                <div className="mt-3 text-sm font-semibold text-brand-ink">{artisan.nom}</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-3xl font-bold uppercase tracking-tight text-brand-ink">
                  Devis <span className="text-brand-orange">estimatif</span>
                </div>
                <div className="mt-3 space-y-0.5 text-xs text-brand-ink/80">
                  <div>
                    <span className="font-semibold">N° DEVIS :</span>{" "}
                    <span className="text-brand-orange">{numero}</span>
                  </div>
                  <div>
                    <span className="font-semibold">DATE :</span>{" "}
                    <span className="text-brand-orange">{todayFr()}</span>
                  </div>
                  <div>
                    <span className="font-semibold">VALIDITÉ :</span>{" "}
                    <span className="text-brand-orange">{addDaysFr(30)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client + Projet */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-brand-orange/20 bg-white/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white">
                    <User className="h-3 w-3" />
                  </span>
                  Client
                </div>
                <div className="mt-2 text-sm leading-relaxed text-brand-ink">
                  <div className="font-semibold">{client.nom}</div>
                  <div>{client.adresse}</div>
                  <div>{client.cp}</div>
                  <div>{client.tel}</div>
                  <div>{client.email}</div>
                </div>
              </div>
              <div className="rounded-2xl border border-brand-orange/20 bg-white/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white">
                    <Home className="h-3 w-3" />
                  </span>
                  Projet
                </div>
                <div className="mt-2 text-sm leading-relaxed text-brand-ink">
                  <div>{projet.titre}</div>
                  <div>{projet.type}</div>
                  <div>
                    Surface : <span className="font-semibold">{projet.surface}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lines table */}
            <div className="mt-6 overflow-hidden rounded-2xl">
              <div className="grid grid-cols-[1fr_70px_90px_110px] gap-2 bg-brand-ink px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <div>Désignation</div>
                <div className="text-right">Qté</div>
                <div className="text-right">PU HT</div>
                <div className="text-right">Total HT</div>
              </div>
              <div className="divide-y divide-brand-orange/15 bg-white/60">
                {lines.map((l) => (
                  <div
                    key={l.id}
                    className="grid grid-cols-[1fr_70px_90px_110px] gap-2 px-4 py-3 text-sm text-brand-ink"
                  >
                    <div>
                      <div className="font-semibold">{l.designation}</div>
                      {l.detail && (
                        <div className="mt-0.5 text-xs text-brand-ink/60">{l.detail}</div>
                      )}
                    </div>
                    <div className="self-center text-right text-xs">
                      {l.qty} {l.unit}
                    </div>
                    <div className="self-center text-right">{fmt(l.pu)}</div>
                    <div className="self-center text-right font-semibold">
                      {fmt(l.qty * l.pu)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-6 grid grid-cols-[1fr_280px] gap-4">
              <div className="space-y-3">
                <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                    Compris dans notre prestation
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-brand-ink">
                    {inclus
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                          {line}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-brand-ink/15 bg-white/60 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                    Notes
                  </div>
                  <p className="mt-2 text-sm italic text-brand-ink/80">{notes}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-brand-orange/20 bg-white/70">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-brand-ink/70">Total HT</span>
                  <span className="font-semibold text-brand-ink">{fmt(totals.ht)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-brand-orange/15 px-4 py-2.5 text-sm">
                  <span className="text-brand-ink/70">TVA {tvaRate}%</span>
                  <span className="font-semibold text-brand-ink">{fmt(totals.tva)}</span>
                </div>
                <div className="flex items-center justify-between bg-brand-orange px-4 py-3 text-white">
                  <span className="text-sm font-bold uppercase tracking-wider">Total TTC</span>
                  <span className="font-serif text-xl font-bold">{fmt(totals.ttc)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-ink px-5 py-3 text-xs text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-brand-orange" /> {artisan.tel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-brand-orange" /> {artisan.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-brand-orange" /> {artisan.site}
              </span>
              <span className="text-white/70">SIRET : {artisan.siret}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          aside, header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
