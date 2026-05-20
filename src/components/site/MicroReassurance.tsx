type SepSize = "xs" | "sm" | "md";
type SepShape = "dot" | "square" | "diamond" | "bar";

type MicroReassuranceProps = {
  variant?: "inline" | "pill";
  items?: [string, string, string];
  /** Separator visual config — lets the component blend into any section. */
  separator?: {
    size?: SepSize;
    /** 0–100 */
    opacity?: number;
    shape?: SepShape;
    /** Tailwind text-/bg-friendly color token, e.g. "brand-orange" */
    colorToken?: string;
  };
  className?: string;
};

const DEFAULT_ITEMS: [string, string, string] = [
  "Gratuit",
  "Sans engagement",
  "Artisan partenaire ensuite",
];

const SIZE_CLASSES: Record<SepSize, string> = {
  xs: "h-[3px] w-[3px] sm:h-1 sm:w-1",
  sm: "h-1 w-1 sm:h-[5px] sm:w-[5px]",
  md: "h-1.5 w-1.5 sm:h-2 sm:w-2",
};

const SHAPE_CLASSES: Record<SepShape, string> = {
  dot: "rounded-full",
  square: "rounded-[1px]",
  diamond: "rounded-[1px] rotate-45",
  bar: "rounded-full w-3 h-[2px] sm:w-4 sm:h-[2px]",
};

function Sep({
  size = "sm",
  opacity = 60,
  shape = "dot",
  colorToken = "brand-orange",
  solid = false,
}: {
  size?: SepSize;
  opacity?: number;
  shape?: SepShape;
  colorToken?: string;
  solid?: boolean;
}) {
  const sizeCls = shape === "bar" ? SHAPE_CLASSES.bar : SIZE_CLASSES[size];
  const shapeCls = shape === "bar" ? "" : SHAPE_CLASSES[shape];
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${sizeCls} ${shapeCls}`}
      style={{
        backgroundColor: `color-mix(in oklab, var(--${colorToken}) ${
          solid ? 100 : opacity
        }%, transparent)`,
      }}
    />
  );
}

export function MicroReassurance({
  variant = "inline",
  items = DEFAULT_ITEMS,
  separator,
  className = "",
}: MicroReassuranceProps) {
  const sep = {
    size: separator?.size ?? "sm",
    opacity: separator?.opacity ?? 60,
    shape: separator?.shape ?? "dot",
    colorToken: separator?.colorToken ?? "brand-orange",
  };
  const a11yLabel = items.join(", ");

  if (variant === "pill") {
    return (
      <p
        role="note"
        aria-label={a11yLabel}
        title={items.join(" · ")}
        tabIndex={0}
        className={`inline-flex max-w-full flex-nowrap items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] tracking-tight text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-2 sm:text-[12px] sm:tracking-normal ${className}`}
      >
        <Sep {...sep} solid />
        <span aria-hidden className="truncate whitespace-nowrap">{items[0]}</span>
        <Sep {...sep} />
        <span aria-hidden className="truncate whitespace-nowrap">{items[1]}</span>
        <span aria-hidden className="hidden items-center gap-1.5 sm:inline-flex sm:gap-2">
          <Sep {...sep} />
          <span className="whitespace-nowrap">{items[2]}</span>
        </span>
      </p>
    );
  }

  return (
    <p
      role="note"
      aria-label={a11yLabel}
      title={items.join(" · ")}
      tabIndex={0}
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-sm text-[11px] tracking-tight text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background xs:flex-nowrap sm:gap-x-2 sm:text-[13px] sm:tracking-normal ${className}`}
    >
      <span aria-hidden className="whitespace-nowrap">{items[0]}</span>
      <Sep {...sep} />
      <span aria-hidden className="whitespace-nowrap">{items[1]}</span>
      <Sep {...sep} />
      <span aria-hidden className="whitespace-nowrap">{items[2]}</span>
    </p>
  );
}
