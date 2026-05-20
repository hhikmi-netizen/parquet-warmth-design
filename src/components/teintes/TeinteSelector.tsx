import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, GitCompare, ShieldCheck, Sparkles, Sun, Moon, Palette } from "lucide-react";

import cheneNaturel from "@/assets/teintes/chene-naturel.jpg";
import cheneBlanchi from "@/assets/teintes/chene-blanchi.jpg";
import cheneMiel from "@/assets/teintes/chene-miel.jpg";
import cheneDore from "@/assets/teintes/chene-dore.jpg";
import cheneFume from "@/assets/teintes/chene-fume.jpg";
import noyer from "@/assets/teintes/noyer.jpg";
import wenge from "@/assets/teintes/wenge.jpg";
import ebene from "@/assets/teintes/ebene.jpg";

type Famille = "clair" | "medium" | "fonce";

export type Teinte = {
  key: string;
  name: string;
  famille: Famille;
  essence: string;
  finition: string;
  description: string;
  ambiance: string;
  texture: string;
  swatch: string;
};

export const TEINTES: Teinte[] = [
  {
    key: "chene-naturel",
    name: "Chêne naturel",
    famille: "clair",
    essence: "Chêne européen",
    finition: "Huile cire — mat naturel",
    description: "La référence brute. Respect total du veinage et de la couleur d'origine du bois.",
    ambiance: "Scandinave, lumineux, intemporel",
    texture: cheneNaturel,
    swatch: "#d8b888",
  },
  {
    key: "chene-blanchi",
    name: "Chêne blanchi",
    famille: "clair",
    essence: "Chêne européen",
    finition: "Huile pigmentée blanche",
    description: "Effet cérusé doux qui amplifie la luminosité. Idéal sous lumière du nord.",
    ambiance: "Bord de mer, contemporain doux",
    texture: cheneBlanchi,
    swatch: "#ece2d2",
  },
  {
    key: "chene-miel",
    name: "Chêne miel",
    famille: "medium",
    essence: "Chêne français",
    finition: "Vitrificateur satiné",
    description: "Le grand classique haussmannien. Chaud, vivant, valorise sans imposer.",
    ambiance: "Parisien, élégant, familial",
    texture: cheneMiel,
    swatch: "#c89760",
  },
  {
    key: "chene-dore",
    name: "Chêne doré",
    famille: "medium",
    essence: "Chêne français",
    finition: "Vitrificateur brillant",
    description: "Saturation chaude maximale, reflets dorés. Effet boudoir.",
    ambiance: "Bourgeois, riche, lumineux",
    texture: cheneDore,
    swatch: "#b8823c",
  },
  {
    key: "chene-fume",
    name: "Chêne fumé",
    famille: "fonce",
    essence: "Chêne fumé thermo",
    finition: "Huile mate",
    description: "Brunissement par fumage à l'ammoniac. Profondeur sans noirceur.",
    ambiance: "Industriel chic, loft",
    texture: cheneFume,
    swatch: "#5e524a",
  },
  {
    key: "noyer",
    name: "Noyer",
    famille: "fonce",
    essence: "Noyer européen",
    finition: "Huile dure satinée",
    description: "Bois noble par excellence. Veinage marqué et reflets cuivrés.",
    ambiance: "Mid-century, raffiné, masculin",
    texture: noyer,
    swatch: "#7a4a2f",
  },
  {
    key: "wenge",
    name: "Wengé",
    famille: "fonce",
    essence: "Bois exotique",
    finition: "Huile mate",
    description: "Brun très foncé presque noir, veinage discret. Effet contemporain assumé.",
    ambiance: "Asiatique, minimaliste",
    texture: wenge,
    swatch: "#3a2820",
  },
  {
    key: "ebene",
    name: "Ébène",
    famille: "fonce",
    essence: "Chêne teinté noir",
    finition: "Vitrificateur mat",
    description: "Le noir profond, dramatique. À réserver aux espaces très lumineux.",
    ambiance: "Galeriste, théâtral",
    texture: ebene,
    swatch: "#1a1714",
  },
];

const FAMILLES: { key: Famille | "all"; label: string; icon: typeof Sun }[] = [
  { key: "all", label: "Toutes", icon: Palette },
  { key: "clair", label: "Claires", icon: Sun },
  { key: "medium", label: "Médium", icon: Sparkles },
  { key: "fonce", label: "Foncées", icon: Moon },
];

export function TeinteSelector() {
  const [filter, setFilter] = useState<Famille | "all">("all");
  const [selected, setSelected] = useState<string>("chene-miel");
  const [compareMode, setCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState<string | null>(null);

  const list = useMemo(
    () => (filter === "all" ? TEINTES : TEINTES.filter((t) => t.famille === filter)),
    [filter],
  );

  const main = TEINTES.find((t) => t.key === selected) ?? TEINTES[0];
  const second = compareWith ? TEINTES.find((t) => t.key === compareWith) : null;

  const handleSelect = (key: string) => {
    if (compareMode) {
      if (key === selected) return;
      setCompareWith(key);
    } else {
      setSelected(key);
      setCompareWith(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres + compare toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FAMILLES.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-brand-orange bg-brand-orange text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            setCompareMode((m) => !m);
            setCompareWith(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            compareMode
              ? "border-brand-orange-deep bg-brand-orange-deep text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {compareMode ? "Comparaison active" : "Comparer 2 teintes"}
        </button>
      </div>

      {/* Aperçu grand format */}
      <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
        <div
          className={`grid ${second ? "grid-cols-2" : "grid-cols-1"} aspect-[16/9] sm:aspect-[21/9]`}
        >
          <div
            className="relative bg-cover bg-center"
            style={{ backgroundImage: `url(${main.texture})` }}
          >
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
                  {main.essence}
                </p>
                <p className="font-serif text-xl sm:text-2xl">{main.name}</p>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                {main.finition}
              </span>
            </div>
          </div>
          {second && (
            <div
              className="relative border-l-2 border-background bg-cover bg-center"
              style={{ backgroundImage: `url(${second.texture})` }}
            >
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-90">
                    {second.essence}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl">{second.name}</p>
                </div>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                  {second.finition}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Détails sous l'aperçu */}
        <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ambiance
            </p>
            <p className="mt-1 text-sm">{second ? `${main.ambiance} · vs · ${second.ambiance}` : main.ambiance}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </p>
            <p className="mt-1 text-sm text-foreground/80">{main.description}</p>
            {second && (
              <p className="mt-1 text-sm text-foreground/80">
                <span className="font-semibold">{second.name} :</span> {second.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grille de teintes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {list.map((t) => {
          const isMain = t.key === selected;
          const isSecond = t.key === compareWith;
          const isActive = isMain || isSecond;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => handleSelect(t.key)}
              className={`group relative overflow-hidden rounded-2xl border bg-background text-left transition ${
                isActive
                  ? "border-brand-orange ring-2 ring-brand-orange/30"
                  : "border-border hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-soft"
              }`}
            >
              <div
                className="aspect-square bg-cover bg-center"
                style={{ backgroundImage: `url(${t.texture})` }}
              />
              {isActive && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-primary-foreground shadow-warm">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              {isSecond && (
                <span className="absolute left-2 top-2 rounded-full bg-brand-orange-deep px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                  vs
                </span>
              )}
              <div className="flex items-center gap-2 p-2.5">
                <span
                  className="h-5 w-5 shrink-0 rounded-full ring-1 ring-border"
                  style={{ background: t.swatch }}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{t.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{t.essence}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-3xl border border-dashed border-brand-orange/40 bg-brand-orange/5 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange-deep" />
          <div>
            <p className="text-sm font-semibold">
              On valide votre choix sur place ?
            </p>
            <p className="text-xs text-muted-foreground">
              Un artisan vérifié vous présente un échantillon réel chez vous, sous votre lumière naturelle.
            </p>
          </div>
        </div>
        <Link
          to="/estimation"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
        >
          Demander un échantillon
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
