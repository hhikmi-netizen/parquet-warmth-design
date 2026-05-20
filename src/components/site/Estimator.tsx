import { useMemo, useState } from "react";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";

type ServiceKey = "poncage" | "vitrification" | "pose" | "renovation";

const services: { key: ServiceKey; label: string; min: number; max: number }[] = [
  { key: "poncage", label: "Ponçage", min: 25, max: 40 },
  { key: "vitrification", label: "Vitrification", min: 15, max: 28 },
  { key: "pose", label: "Pose", min: 45, max: 90 },
  { key: "renovation", label: "Rénovation complète", min: 60, max: 110 },
];

const types = [
  { key: "contrecolle", label: "Contrecollé", factor: 1 },
  { key: "massif", label: "Massif", factor: 1.15 },
  { key: "ancien", label: "Parquet ancien", factor: 1.35 },
];

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n / 10) * 10);

export function Estimator() {
  const [service, setService] = useState<ServiceKey>("poncage");
  const [type, setType] = useState(types[0].key);
  const [surface, setSurface] = useState(35);

  const { min, max } = useMemo(() => {
    const s = services.find((x) => x.key === service)!;
    const t = types.find((x) => x.key === type)!;
    return { min: s.min * t.factor * surface, max: s.max * t.factor * surface };
  }, [service, type, surface]);

  return (
    <div className="rounded-2xl border border-background/15 bg-background/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Mini-simulation
          </p>
          <h3 className="mt-1 font-display text-2xl text-background">Votre fourchette en 10 secondes</h3>
        </div>
        <span className="rounded-full border border-background/20 px-2 py-0.5 text-[10px] font-semibold text-background/70">
          Indicatif
        </span>
      </div>

      {/* Service */}
      <div className="mt-5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-background/60">
          Prestation
        </label>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {services.map((s) => {
            const active = s.key === service;
            return (
              <button
                key={s.key}
                onClick={() => setService(s.key)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-brand-orange bg-brand-orange text-primary-foreground"
                    : "border-background/15 bg-background/5 text-background/80 hover:border-background/30"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type */}
      <div className="mt-4">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-background/60">
          Type de parquet
        </label>
        <div className="mt-2 flex gap-1.5">
          {types.map((t) => {
            const active = t.key === type;
            return (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-brand-orange bg-brand-orange/15 text-brand-orange"
                    : "border-background/15 bg-background/5 text-background/80 hover:border-background/30"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-background/60">
            Surface
          </label>
          <span className="font-display text-lg text-background">
            {surface} <span className="text-sm text-background/60">m²</span>
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={150}
          step={5}
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-background/15 accent-[color:var(--brand-orange)]"
          style={{
            background: `linear-gradient(to right, var(--brand-orange) 0%, var(--brand-orange) ${
              ((surface - 10) / 140) * 100
            }%, oklch(1 0 0 / 0.15) ${((surface - 10) / 140) * 100}%, oklch(1 0 0 / 0.15) 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-[10px] text-background/50">
          <span>10 m²</span>
          <span>150 m²</span>
        </div>
      </div>

      {/* Résultat */}
      <div className="mt-5 rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-background/60">
          Fourchette estimée
        </div>
        <div className="mt-1 font-display text-3xl text-background">
          {fmt(min)} – {fmt(max)} <span className="text-lg text-background/60">€ TTC</span>
        </div>
        <p className="mt-1 text-[11px] text-background/55">
          Fourchette indicative, hors fournitures spécifiques. Estimation détaillée gratuite en 3 minutes.
        </p>
      </div>

      <a
        href="#estimate"
        className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep active:scale-[0.98]"
      >
        Affiner mon estimation
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </a>

      <div className="mt-4 flex items-center justify-between text-[11px] text-background/55">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-brand-orange" /> ≈ 3 min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-brand-orange" /> Sans engagement
        </span>
      </div>
    </div>
  );
}
