type MicroReassuranceProps = {
  variant?: "inline" | "pill";
  items?: [string, string, string];
};

const DEFAULT_ITEMS: [string, string, string] = [
  "Gratuit",
  "Sans engagement",
  "Artisan partenaire ensuite",
];

// Shared separator — kept identical between inline and pill variants.
function Sep() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 shrink-0 rounded-full bg-brand-orange/60 sm:h-[5px] sm:w-[5px]"
    />
  );
}

export function MicroReassurance({
  variant = "inline",
  items = DEFAULT_ITEMS,
}: MicroReassuranceProps) {
  if (variant === "pill") {
    return (
      <p
        className="inline-flex max-w-full flex-nowrap items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] tracking-tight text-muted-foreground sm:gap-2 sm:text-[12px] sm:tracking-normal"
        title={items.join(" · ")}
      >
        <span className="h-1 w-1 shrink-0 rounded-full bg-brand-orange sm:h-[5px] sm:w-[5px]" />
        <span className="truncate whitespace-nowrap">{items[0]}</span>
        <Sep />
        <span className="truncate whitespace-nowrap">{items[1]}</span>
        <span className="hidden items-center gap-1.5 sm:inline-flex sm:gap-2">
          <Sep />
          <span className="whitespace-nowrap">{items[2]}</span>
        </span>
      </p>
    );
  }

  return (
    <p
      className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] tracking-tight text-muted-foreground xs:flex-nowrap sm:gap-x-2 sm:text-[13px] sm:tracking-normal"
      title={items.join(" · ")}
    >
      <span className="whitespace-nowrap">{items[0]}</span>
      <Sep />
      <span className="whitespace-nowrap">{items[1]}</span>
      <Sep />
      <span className="whitespace-nowrap">{items[2]}</span>
    </p>
  );
}
