import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
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
  const surface = l * w;
  const total = surface * (1 + chute / 100);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Longueur" value={l} onChange={setL} unit="m" step={0.1} />
          <NumberField label="Largeur" value={w} onChange={setW} unit="m" step={0.1} />
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
      </div>
      <ResultBox hint="Quantité à commander, marge de découpe incluse. Comptez +2 lames par pièce pour les réserves.">
        {fmt(total, 2)} <span className="text-lg text-muted-foreground">m²</span>
        <div className="mt-1 text-xs text-muted-foreground">Surface nette : {fmt(surface, 2)} m²</div>
      </ResultBox>
    </div>
  );
}

function ColleTool() {
  const [surface, setSurface] = useState(35);
  const [type, setType] = useState<"contrecolle" | "massif" | "ancien">("contrecolle");
  const ratios = { contrecolle: 0.9, massif: 1.1, ancien: 1.3 };
  const labels = { contrecolle: "Contrecollé", massif: "Massif", ancien: "Parquet ancien" } as const;
  const kg = surface * ratios[type];
  const seaux = Math.ceil(kg / 15);
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
      </div>
      <ResultBox hint="Base : 900 g/m² (contrecollé) à 1,3 kg/m² (ancien). Seaux standard 15 kg.">
        {fmt(kg)} <span className="text-lg text-muted-foreground">kg</span>
        <div className="mt-1 text-xs text-muted-foreground">
          Soit {seaux} seau{seaux > 1 ? "x" : ""} de 15 kg
        </div>
      </ResultBox>
    </div>
  );
}

function SousCoucheTool() {
  const [surface, setSurface] = useState(35);
  const [rouleau, setRouleau] = useState(15);
  const surfaceUtile = surface * 1.05;
  const rouleaux = Math.ceil(surfaceUtile / rouleau);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <NumberField label="Surface à couvrir" value={surface} onChange={setSurface} unit="m²" />
        <NumberField label="Surface d'un rouleau" value={rouleau} onChange={setRouleau} unit="m²" />
        <p className="text-xs text-muted-foreground">
          Marge automatique de 5 % pour les recouvrements et chutes.
        </p>
      </div>
      <ResultBox hint="Rouleaux courants : 10 m² (mousse), 15 m² (liège), 20 m² (fibre de bois).">
        {rouleaux} <span className="text-lg text-muted-foreground">rouleau{rouleaux > 1 ? "x" : ""}</span>
        <div className="mt-1 text-xs text-muted-foreground">
          ≈ {fmt(surfaceUtile)} m² de sous-couche
        </div>
      </ResultBox>
    </div>
  );
}

function VitrifTool() {
  const [surface, setSurface] = useState(35);
  const [couches, setCouches] = useState(3);
  const [rendement, setRendement] = useState(10);
  const litres = useMemo(() => (surface * couches) / rendement, [surface, couches, rendement]);
  const bidons5 = Math.ceil(litres / 5);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Surface" value={surface} onChange={setSurface} unit="m²" />
          <NumberField label="Couches" value={couches} onChange={setCouches} unit="" min={1} />
        </div>
        <NumberField label="Rendement" value={rendement} onChange={setRendement} unit="m²/L" />
        <p className="text-xs text-muted-foreground">
          Standard : 3 couches, 10 m²/L. Première couche en fond dur, 2 couches de finition.
        </p>
      </div>
      <ResultBox hint="Bidons courants : 1 L, 2,5 L, 5 L. Prévoir 5-10 % de plus en pose complexe.">
        {fmt(litres)} <span className="text-lg text-muted-foreground">L</span>
        <div className="mt-1 text-xs text-muted-foreground">
          Soit {bidons5} bidon{bidons5 > 1 ? "s" : ""} de 5 L
        </div>
      </ResultBox>
    </div>
  );
}

export function Calculators() {
  const [active, setActive] = useState<ToolKey>("surface");
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
        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
