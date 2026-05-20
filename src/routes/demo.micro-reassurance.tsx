import { createFileRoute, Link } from "@tanstack/react-router";
import { MicroReassurance } from "@/components/site/MicroReassurance";

export const Route = createFileRoute("/demo/micro-reassurance")({
  head: () => ({
    meta: [
      { title: "MicroReassurance — démo styles" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoPage,
});

type Combo = {
  label: string;
  variant: "inline" | "pill";
  separator: {
    size: "xs" | "sm" | "md";
    opacity: number;
    shape: "dot" | "square" | "diamond" | "bar";
    colorToken?: string;
  };
};

const SIZES: Array<"xs" | "sm" | "md"> = ["xs", "sm", "md"];
const SHAPES: Array<"dot" | "square" | "diamond" | "bar"> = [
  "dot",
  "square",
  "diamond",
  "bar",
];
const OPACITIES = [40, 60, 80, 100];

function Cell({ combo }: { combo: Combo }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="font-semibold text-foreground">{combo.label}</span>
        <span>
          {combo.variant} · {combo.separator.shape} · {combo.separator.size} ·{" "}
          {combo.separator.opacity}%
        </span>
      </div>
      <div className="flex min-h-[56px] items-center rounded-xl bg-background px-4 py-3">
        <MicroReassurance variant={combo.variant} separator={combo.separator} />
      </div>
      <code className="block overflow-x-auto rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground">
        {`<MicroReassurance variant="${combo.variant}" separator={{ size: "${combo.separator.size}", opacity: ${combo.separator.opacity}, shape: "${combo.separator.shape}" }} />`}
      </code>
    </div>
  );
}

function DemoPage() {
  const combos: Combo[] = [
    ...(["inline", "pill"] as const).flatMap((variant) =>
      SHAPES.map((shape) => ({
        label: `${variant} / ${shape}`,
        variant,
        separator: { size: "sm" as const, opacity: 60, shape },
      })),
    ),
    ...SIZES.map((size) => ({
      label: `inline / size ${size}`,
      variant: "inline" as const,
      separator: { size, opacity: 60, shape: "dot" as const },
    })),
    ...OPACITIES.map((opacity) => ({
      label: `inline / opacity ${opacity}`,
      variant: "inline" as const,
      separator: { size: "sm" as const, opacity, shape: "dot" as const },
    })),
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-brand-orange">
          ← Retour à l'accueil
        </Link>
        <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
          MicroReassurance — bibliothèque de styles
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Combinaisons taille / opacité / forme du séparateur pour choisir le
          rendu adapté à chaque section du template.
        </p>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {combos.map((c) => (
            <Cell key={c.label} combo={c} />
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl">Sur fonds variés</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-cream p-6">
              <MicroReassurance />
            </div>
            <div className="rounded-2xl bg-foreground p-6 text-background">
              <MicroReassurance separator={{ opacity: 80, colorToken: "brand-orange" }} />
            </div>
            <div className="rounded-2xl bg-brand-orange p-6 text-primary-foreground">
              <MicroReassurance
                separator={{ opacity: 100, colorToken: "background", shape: "diamond" }}
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <MicroReassurance variant="pill" separator={{ shape: "bar", opacity: 70 }} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
