import { useEffect, useMemo, useState } from "react";

import { Ruler, Droplet, Layers, Paintbrush, Info, Wallet, ArrowRight, ShieldCheck } from "lucide-react";

type ToolKey = "budget" | "surface" | "colle" | "souscouche" | "vitrification";

const tools: { key: ToolKey; label: string; icon: typeof Ruler; subtitle: string }[] = [
  { key: "budget", label: "Budget travaux", icon: Wallet, subtitle: "Fourchette de prix pour votre projet" },
  { key: "surface", label: "Surface & chutes", icon: Ruler, subtitle: "Calculez la surface réelle à commander" },
  { key: "colle", label: "Colle parquet", icon: Droplet, subtitle: "Quantité de colle nécessaire en kg" },
  { key: "souscouche", label: "Sous-couche", icon: Layers, subtitle: "Rouleaux à prévoir, recouvrement inclus" },
  { key: "vitrification", label: "Vitrificateur", icon: Paintbrush, subtitle: "Litres pour 3 couches de finition" },
];

const fmt = (n: number, d = 1) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);

function NumberField({
  label,
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  step?: number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5 flex items-center rounded-xl border border-border bg-background focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/20">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-3 py-2.5 font-display text-lg outline-none"
        />
        <span className="pr-3 text-sm text-muted-foreground">{unit}</span>
      </div>
    </label>
  );
}

function ResultBox({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Résultat
      </div>
      <div className="mt-1 font-display text-3xl text-foreground">{children}</div>
      {hint && (
        <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-orange" />
          {hint}
        </p>
      )}
    </div>
  );
}

function SurfaceTool() {
  const [l, setL] = useState(5);
  const [w, setW] = useState(4);
  const [chute, setChute] = useState(8);
  // Dimensions lame (mm) + surface botte (m²) + prix au m² personnalisables
  const [lameL, setLameL] = useState(1200);
  const [lameW, setLameW] = useState(190);
  const [botteSurface, setBotteSurface] = useState(2.2);
  const [prixM2, setPrixM2] = useState(45);

  const surface = l * w;
  const total = surface * (1 + chute / 100);
  const lameM2 = (lameL * lameW) / 1_000_000; // mm² → m²
  const nbLames = lameM2 > 0 ? Math.ceil(total / lameM2) : 0;
  const nbBottes = botteSurface > 0 ? Math.ceil(total / botteSurface) : 0;
  const coutTotal = total * prixM2;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Longueur pièce" value={l} onChange={setL} unit="m" step={0.1} />
          <NumberField label="Largeur pièce" value={w} onChange={setW} unit="m" step={0.1} />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Marge de chutes
            </span>
            <span className="font-display text-base text-foreground">{chute} %</span>
          </div>
          <input
            type="range"
            min={5}
            max={15}
            value={chute}
            onChange={(e) => setChute(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, var(--brand-orange) ${((chute - 5) / 10) * 100}%, oklch(0.88 0.015 70) ${((chute - 5) / 10) * 100}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Pose droite · 5%</span>
            <span>Chevron · 12-15%</span>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Dimensions des lames & conditionnement
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Longueur lame" value={lameL} onChange={setLameL} unit="mm" step={10} />
            <NumberField label="Largeur lame" value={lameW} onChange={setLameW} unit="mm" step={5} />
            <NumberField label="Surface / botte" value={botteSurface} onChange={setBotteSurface} unit="m²" step={0.1} />
            <NumberField label="Prix au m²" value={prixM2} onChange={setPrixM2} unit="€" step={1} />
          </div>
        </div>
      </div>
      <ResultBox hint="Quantité à commander, marge de découpe incluse. Comptez +2 lames par pièce pour les réserves.">
        {fmt(total, 2)} <span className="text-lg text-muted-foreground">m²</span>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>Surface nette : {fmt(surface, 2)} m²</div>
          <div>≈ {nbLames} lame{nbLames > 1 ? "s" : ""} ({lameL}×{lameW} mm)</div>
          <div>≈ {nbBottes} botte{nbBottes > 1 ? "s" : ""} de {fmt(botteSurface, 2)} m²</div>
          <div className="pt-1 font-display text-base text-foreground">Budget fourniture : {eur(coutTotal)}</div>
        </div>
      </ResultBox>
    </div>
  );
}

function ColleTool() {
  const [surface, setSurface] = useState(35);
  const [type, setType] = useState<"contrecolle" | "massif" | "ancien">("contrecolle");
  const [kgSeau, setKgSeau] = useState(15);
  const [prixSeau, setPrixSeau] = useState(85);
  const ratios = { contrecolle: 0.9, massif: 1.1, ancien: 1.3 };
  const labels = { contrecolle: "Contrecollé", massif: "Massif", ancien: "Parquet ancien" } as const;
  const kg = surface * ratios[type];
  const seaux = kgSeau > 0 ? Math.ceil(kg / kgSeau) : 0;
  const cout = seaux * prixSeau;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <NumberField label="Surface à coller" value={surface} onChange={setSurface} unit="m²" />
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Type de parquet
          </span>
          <div className="mt-2 flex gap-1.5">
            {(Object.keys(labels) as (keyof typeof labels)[]).map((k) => (
              <button
                key={k}
                onClick={() => setType(k)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  type === k
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-border bg-background text-foreground/70 hover:border-brand-orange/40"
                }`}
              >
                {labels[k]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Contenance seau" value={kgSeau} onChange={setKgSeau} unit="kg" step={1} />
          <NumberField label="Prix par seau" value={prixSeau} onChange={setPrixSeau} unit="€" step={1} />
        </div>
      </div>
      <ResultBox hint="Base : 900 g/m² (contrecollé) à 1,3 kg/m² (ancien). Personnalisez la contenance et le prix de vos seaux.">
        {fmt(kg)} <span className="text-lg text-muted-foreground">kg</span>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>Soit {seaux} seau{seaux > 1 ? "x" : ""} de {kgSeau} kg</div>
          <div className="pt-1 font-display text-base text-foreground">Budget colle : {eur(cout)}</div>
        </div>
      </ResultBox>
    </div>
  );
}

function SousCoucheTool() {
  const [surface, setSurface] = useState(35);
  const [rouleau, setRouleau] = useState(15);
  const [prixRouleau, setPrixRouleau] = useState(35);
  const surfaceUtile = surface * 1.05;
  const rouleaux = rouleau > 0 ? Math.ceil(surfaceUtile / rouleau) : 0;
  const cout = rouleaux * prixRouleau;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <NumberField label="Surface à couvrir" value={surface} onChange={setSurface} unit="m²" />
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Surface d'un rouleau" value={rouleau} onChange={setRouleau} unit="m²" />
          <NumberField label="Prix par rouleau" value={prixRouleau} onChange={setPrixRouleau} unit="€" step={1} />
        </div>
        <p className="text-xs text-muted-foreground">
          Marge automatique de 5 % pour les recouvrements et chutes.
        </p>
      </div>
      <ResultBox hint="Rouleaux courants : 10 m² (mousse), 15 m² (liège), 20 m² (fibre de bois).">
        {rouleaux} <span className="text-lg text-muted-foreground">rouleau{rouleaux > 1 ? "x" : ""}</span>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>≈ {fmt(surfaceUtile)} m² de sous-couche</div>
          <div className="pt-1 font-display text-base text-foreground">Budget sous-couche : {eur(cout)}</div>
        </div>
      </ResultBox>
    </div>
  );
}

function VitrifTool() {
  const [surface, setSurface] = useState(35);
  const [couches, setCouches] = useState(3);
  const [rendement, setRendement] = useState(10);
  const [litreBidon, setLitreBidon] = useState(5);
  const [prixBidon, setPrixBidon] = useState(95);
  const litres = useMemo(() => (surface * couches) / rendement, [surface, couches, rendement]);
  const bidons = litreBidon > 0 ? Math.ceil(litres / litreBidon) : 0;
  const cout = bidons * prixBidon;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Surface" value={surface} onChange={setSurface} unit="m²" />
          <NumberField label="Couches" value={couches} onChange={setCouches} unit="" min={1} />
        </div>
        <NumberField label="Rendement" value={rendement} onChange={setRendement} unit="m²/L" />
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Contenance bidon" value={litreBidon} onChange={setLitreBidon} unit="L" step={0.5} />
          <NumberField label="Prix par bidon" value={prixBidon} onChange={setPrixBidon} unit="€" step={1} />
        </div>
        <p className="text-xs text-muted-foreground">
          Standard : 3 couches, 10 m²/L. Première couche en fond dur, 2 couches de finition.
        </p>
      </div>
      <ResultBox hint="Bidons courants : 1 L, 2,5 L, 5 L. Prévoir 5-10 % de plus en pose complexe.">
        {fmt(litres)} <span className="text-lg text-muted-foreground">L</span>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>Soit {bidons} bidon{bidons > 1 ? "s" : ""} de {litreBidon} L</div>
          <div className="pt-1 font-display text-base text-foreground">Budget vitrificateur : {eur(cout)}</div>
        </div>
      </ResultBox>
    </div>
  );
}

// --- Budget travaux -------------------------------------------------------
// Fourchettes indicatives TTC (€/m²), pose + fournitures standard.
// Sources : ordres de grandeur métier 2024-2025 marché parisien/IDF.
type BudgetProjet = "neuf" | "renovation";
type BudgetPose = "flottante" | "collee" | "massif";
type BudgetSupport = "plat" | "moquette" | "ragreage";

const POSE_RANGES: Record<BudgetPose, { min: number; max: number; label: string }> = {
  flottante: { min: 35, max: 55, label: "Flottante (clipsée)" },
  collee: { min: 55, max: 85, label: "Collée plein bain" },
  massif: { min: 80, max: 130, label: "Massif cloué" },
};

const SUPPORT_EXTRA: Record<BudgetSupport, { min: number; max: number; label: string }> = {
  plat: { min: 0, max: 0, label: "Sol plat & propre" },
  moquette: { min: 8, max: 15, label: "Moquette à déposer" },
  ragreage: { min: 18, max: 32, label: "Ragréage nécessaire" },
};

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    Math.round(n / 10) * 10,
  );

function BudgetTool() {
  const [projet, setProjet] = useState<BudgetProjet>("renovation");
  const [pose, setPose] = useState<BudgetPose>("collee");
  const [surface, setSurface] = useState(35);
  const [support, setSupport] = useState<BudgetSupport>("plat");
  const [customize, setCustomize] = useState(false);
  const [priceMin, setPriceMin] = useState<number>(POSE_RANGES["collee"].min);
  const [priceMax, setPriceMax] = useState<number>(POSE_RANGES["collee"].max);

  // Synchronise les valeurs par défaut quand on change de type de pose,
  // sauf si l'utilisateur a activé le mode tarif personnalisé.
  useEffect(() => {
    if (!customize) {
      setPriceMin(POSE_RANGES[pose].min);
      setPriceMax(POSE_RANGES[pose].max);
    }
  }, [pose, customize]);

  const { low, high } = useMemo(() => {
    const baseMin = customize ? priceMin : POSE_RANGES[pose].min;
    const baseMax = customize ? priceMax : POSE_RANGES[pose].max;
    const sup = projet === "renovation" ? SUPPORT_EXTRA[support] : { min: 0, max: 0 };
    // Neuf bénéficie d'une légère décote (pas d'enlèvement/protection existant).
    const neufFactor = projet === "neuf" ? 0.92 : 1;
    const safeSurface = Math.max(1, surface);
    return {
      low: (baseMin + sup.min) * safeSurface * neufFactor,
      high: (Math.max(baseMax, baseMin) + sup.max) * safeSurface * neufFactor,
    };
  }, [projet, pose, surface, support, customize, priceMin, priceMax]);

  // Build a plain query string so /contact can prefill later without
  // forcing a typed search schema on the route.
  const contactHref = useMemo(() => {
    const params = new URLSearchParams({
      projet:
        pose === "massif" || pose === "flottante"
          ? "Pose parquet"
          : projet === "renovation"
          ? "Rénovation"
          : "Pose parquet",
      surface: String(surface),
      budget: `${Math.round(low / 10) * 10}-${Math.round(high / 10) * 10}€`,
      pose: POSE_RANGES[pose].label,
    });
    return `/contact?${params.toString()}`;
  }, [pose, projet, surface, low, high]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-5 lg:col-span-3">
        {/* Type de projet */}
        <SegmentedGroup
          label="Type de projet"
          value={projet}
          options={[
            { value: "neuf", label: "Neuf", hint: "Construction" },
            { value: "renovation", label: "Rénovation", hint: "Logement existant" },
          ]}
          onChange={(v) => setProjet(v as BudgetProjet)}
        />

        {/* Type de pose */}
        <SegmentedGroup
          label="Type de pose souhaitée"
          value={pose}
          options={[
            { value: "flottante", label: "Flottante", hint: "35-55 €/m²" },
            { value: "collee", label: "Collée", hint: "55-85 €/m²" },
            { value: "massif", label: "Massif cloué", hint: "80-130 €/m²" },
          ]}
          onChange={(v) => setPose(v as BudgetPose)}
        />

        {/* Surface */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Surface à poser
            </span>
            <span className="font-display text-base text-foreground">{surface} m²</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={1}
            value={surface}
            onChange={(e) => setSurface(Number(e.target.value))}
            aria-label="Surface en mètres carrés"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, var(--brand-orange) ${((surface - 5) / 195) * 100}%, oklch(0.88 0.015 70) ${((surface - 5) / 195) * 100}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>5 m²</span>
            <span>200 m²</span>
          </div>
        </div>

        {/* État du support — uniquement en rénovation */}
        {projet === "renovation" && (
          <SegmentedGroup
            label="État du support actuel"
            value={support}
            options={[
              { value: "plat", label: "Sol plat", hint: "Inclus" },
              { value: "moquette", label: "Moquette", hint: "+8-15 €/m²" },
              { value: "ragreage", label: "Ragréage", hint: "+18-32 €/m²" },
            ]}
            onChange={(v) => setSupport(v as BudgetSupport)}
          />
        )}

        {/* Tarif personnalisé €/m² (override des fourchettes par défaut) */}
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-3">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Personnaliser le tarif €/m² (devis, artisan…)
            </span>
            <input
              type="checkbox"
              checked={customize}
              onChange={(e) => setCustomize(e.target.checked)}
              className="h-4 w-4 accent-brand-orange"
            />
          </label>
          {customize && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <NumberField label="Prix min" value={priceMin} onChange={setPriceMin} unit="€/m²" step={1} />
              <NumberField label="Prix max" value={priceMax} onChange={setPriceMax} unit="€/m²" step={1} />
            </div>
          )}
        </div>
      </div>

      {/* Résultat + CTA conversion */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 p-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Votre projet est estimé entre
          </div>
          <div className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            <span aria-live="polite">{eur(low)}</span>
            <span className="mx-2 text-muted-foreground">et</span>
            <span aria-live="polite">{eur(high)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Fourniture + pose · TTC · {surface} m² · {POSE_RANGES[pose].label}
            {projet === "renovation" && support !== "plat" ? ` · ${SUPPORT_EXTRA[support].label}` : ""}
          </p>

          <div className="my-5 h-px bg-border" />

          <p className="text-sm font-medium text-foreground">
            Bloquez ce tarif et recevez 3 devis fermes d'artisans locaux.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>· Sous 48 h ouvrées</li>
            <li>· Artisans vérifiés près de chez vous</li>
            <li>· Sans engagement, sans démarchage</li>
          </ul>

          <a
            href={contactHref}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Recevoir mes 3 devis
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-brand-orange" aria-hidden />
            Vos coordonnées restent confidentielles.
          </p>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mr-1 inline h-3 w-3 text-brand-orange" aria-hidden />
          Fourchette indicative basée sur les tarifs métier courants. Le devis ferme dépend du
          produit choisi, de l'accessibilité du chantier et des finitions souhaitées.
        </p>
      </div>
    </div>
  );
}

function SegmentedGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; hint?: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active
                  ? "border-brand-orange bg-brand-orange/10 text-foreground shadow-soft"
                  : "border-border bg-background text-foreground/80 hover:border-brand-orange/40"
              }`}
            >
              <div className={`text-sm font-semibold ${active ? "text-brand-orange" : ""}`}>
                {o.label}
              </div>
              {o.hint && <div className="text-[10px] text-muted-foreground">{o.hint}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Calculators() {
  const [active, setActive] = useState<ToolKey>("budget");
  const current = tools.find((t) => t.key === active)!;

  return (
    <section id="outils" className="scroll-mt-24 border-y border-border bg-secondary/40 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Boîte à outils
          </p>
          <h2 className="mt-4 font-display text-4xl text-balance sm:text-5xl">
            Les calculateurs <span className="italic text-brand-orange">du parquet.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Quatre outils précis, utilisés au quotidien par nos artisans. Surface réelle, colle, sous-couche, vitrificateur — chiffrés en deux clics.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {tools.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-brand-orange bg-card shadow-warm"
                    : "border-border bg-card/60 hover:border-brand-orange/40 hover:bg-card"
                }`}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition ${
                    isActive ? "bg-brand-orange text-primary-foreground" : "bg-brand-orange/10 text-brand-orange"
                  }`}
                >
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-base">{t.label}</div>
                  <div className="text-[11px] leading-snug text-muted-foreground">{t.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <current.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl">{current.label}</h3>
              <p className="text-xs text-muted-foreground">{current.subtitle}</p>
            </div>
          </div>
          {active === "budget" && <BudgetTool />}
          {active === "surface" && <SurfaceTool />}
          {active === "colle" && <ColleTool />}
          {active === "souscouche" && <SousCoucheTool />}
          {active === "vitrification" && <VitrifTool />}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Valeurs indicatives basées sur les usages métier courants. Pour un chiffrage précis, demandez un devis artisan.
        </p>
      </div>
    </section>
  );
}
