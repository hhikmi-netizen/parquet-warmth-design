import { useMemo, useState } from "react";
import {
  Search,
  Star,
  Clock,
  FileText,
  Ruler,
  Layers,
  Calculator,
  Droplets,
  Sparkles,
  Wrench,
  ShieldCheck,
  Thermometer,
  Hammer,
  Flame,
  Replace,
  ArrowRight,
} from "lucide-react";

type Category = "quotidien" | "chantier";

type Tool = {
  id: string;
  title: string;
  desc: string;
  category: Category;
  icon: typeof Ruler;
};

const TOOLS: Tool[] = [
  // Quotidien
  { id: "devis-express", title: "Générateur devis express", desc: "Devis PDF prêt à envoyer en 2 min.", category: "quotidien", icon: FileText },
  { id: "calc-surface", title: "Calcul de surface", desc: "Pièces simples, complexes ou en L.", category: "quotidien", icon: Ruler },
  { id: "calc-plinthes", title: "Calcul plinthes", desc: "Longueur totale + chutes 10 %.", category: "quotidien", icon: Layers },
  { id: "calc-parquet", title: "Quantité parquet", desc: "M² + pertes selon type de pose.", category: "quotidien", icon: Calculator },
  { id: "rendement-vitri", title: "Rendement vitrificateur", desc: "Litres nécessaires par couche.", category: "quotidien", icon: Droplets },
  { id: "calc-colle", title: "Colle & sous-couche", desc: "Quantité selon support et m².", category: "quotidien", icon: Sparkles },

  // Chantier
  { id: "compat-support", title: "Compatibilité support", desc: "Vérifier béton, OSB, carrelage…", category: "chantier", icon: ShieldCheck },
  { id: "humidite", title: "Humidité support", desc: "Seuils CM / sondes Tramex.", category: "chantier", icon: Thermometer },
  { id: "ragreage", title: "Ragréage", desc: "Épaisseur, primaire, sacs nécessaires.", category: "chantier", icon: Hammer },
  { id: "chauffage-sol", title: "Chauffage au sol", desc: "Compatibilité essence & pose.", category: "chantier", icon: Flame },
  { id: "renovation", title: "Rénovation / remplacement", desc: "Diagnostic ponçage vs dépose.", category: "chantier", icon: Replace },
  { id: "diagnostic-chantier", title: "Diagnostic chantier", desc: "Check-list complète avant devis.", category: "chantier", icon: Wrench },
];

const CAT_LABEL: Record<Category, string> = {
  quotidien: "Outils quotidiens",
  chantier: "Outils chantier",
};

const CAT_DESC: Record<Category, string> = {
  quotidien: "Les calculs que vous utilisez tous les jours.",
  chantier: "Plus techniques — à dégainer en visite ou avant pose.",
};

export function OutilsTab() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"tous" | Category | "favoris">("tous");
  const [favs, setFavs] = useState<string[]>(["devis-express", "calc-surface"]);
  const [recents, setRecents] = useState<string[]>(["calc-surface", "rendement-vitri", "humidite"]);

  const toggleFav = (id: string) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const openTool = (id: string) => {
    setRecents((r) => [id, ...r.filter((x) => x !== id)].slice(0, 4));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (filter === "favoris" && !favs.includes(t.id)) return false;
      if (filter !== "tous" && filter !== "favoris" && t.category !== filter) return false;
      if (!q) return true;
      return t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    });
  }, [query, filter, favs]);

  const groups: Category[] = filter === "tous" || filter === "favoris" ? ["quotidien", "chantier"] : [filter];
  const recentTools = recents.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean) as Tool[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Boîte à outils artisan</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculs métier, simulateurs et générateurs — tout au même endroit.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-deep">
            <Sparkles className="h-3 w-3" /> {TOOLS.length} outils
          </span>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil (surface, plinthes, humidité…)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { k: "tous", l: "Tous" },
            { k: "favoris", l: "★ Favoris" },
            { k: "quotidien", l: "Quotidien" },
            { k: "chantier", l: "Chantier" },
          ].map((f) => (
            <button
              key={f.k}
              type="button"
              onClick={() => setFilter(f.k as typeof filter)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f.k
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Derniers utilisés */}
      {filter === "tous" && !query && recentTools.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Derniers utilisés
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.map((t) => (
              <button
                key={`recent-${t.id}`}
                type="button"
                onClick={() => openTool(t.id)}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition hover:border-brand-orange/40 hover:bg-brand-cream/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-orange-deep">
                  <t.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{CAT_LABEL[t.category]}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Catégories */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-background p-10 text-center">
          <Search className="mx-auto h-6 w-6 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-medium">Aucun outil ne correspond</p>
          <p className="mt-1 text-xs text-muted-foreground">Essayez un autre mot-clé ou changez de filtre.</p>
        </div>
      ) : (
        groups.map((cat) => {
          const items = filtered.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg">{CAT_LABEL[cat]}</h3>
                  <p className="text-xs text-muted-foreground">{CAT_DESC[cat]}</p>
                </div>
                <span className="text-xs text-muted-foreground">{items.length} outils</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <ToolCard
                    key={t.id}
                    tool={t}
                    fav={favs.includes(t.id)}
                    onToggleFav={() => toggleFav(t.id)}
                    onOpen={() => openTool(t.id)}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function ToolCard({
  tool,
  fav,
  onToggleFav,
  onOpen,
}: {
  tool: Tool;
  fav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  const Icon = tool.icon;
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-soft">
      <button
        type="button"
        onClick={onToggleFav}
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        className={`absolute right-3 top-3 rounded-full p-1.5 transition ${
          fav
            ? "text-brand-orange"
            : "text-muted-foreground/40 hover:bg-accent hover:text-brand-orange"
        }`}
      >
        <Star className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
      </button>

      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cream text-brand-orange-deep">
        <Icon className="h-5 w-5" />
      </span>

      <h4 className="mt-4 pr-6 font-semibold leading-tight">{tool.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-orange-deep transition hover:gap-2"
      >
        Ouvrir l'outil <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
