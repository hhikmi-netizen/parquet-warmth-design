type MicroReassuranceProps = {
  variant?: "inline" | "pill";
  items?: [string, string, string];
};

const DEFAULT_ITEMS: [string, string, string] = [
  "Gratuit",
  "Sans engagement",
  "Artisan partenaire ensuite",
];

export function MicroReassurance({
  variant = "inline",
  items = DEFAULT_ITEMS,
}: MicroReassuranceProps) {
  if (variant === "pill") {
    return (
      <p
        className="inline-flex max-w-full flex-nowrap items-center gap-1.5 truncate rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] tracking-tight text-muted-foreground sm:text-[12px] sm:tracking-normal"
        title={items.join(" · ")}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
        {/* Full label from sm+ ; condensed fallback under sm to avoid overflow */}
        <span className="hidden truncate sm:inline">{items.join(" · ")}</span>
        <span className="truncate sm:hidden">
          {items[0]} · {items[1]}
        </span>
      </p>
    );
  }

  return (
    <p
      className="flex flex-wrap items-center justify-start gap-x-2 gap-y-0.5 text-[11px] tracking-tight text-muted-foreground xs:flex-nowrap sm:gap-x-2.5 sm:text-[13px] sm:tracking-normal"
      title={items.join(" · ")}
    >
      <span className="whitespace-nowrap">{items[0]}</span>
      <span aria-hidden className="shrink-0 text-brand-orange/60">·</span>
      <span className="whitespace-nowrap">{items[1]}</span>
      <span aria-hidden className="shrink-0 text-brand-orange/60">·</span>
      <span className="whitespace-nowrap">{items[2]}</span>
    </p>
  );
}
