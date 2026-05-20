export function MicroReassurance({ variant = "inline" }: { variant?: "inline" | "pill" }) {
  if (variant === "pill") {
    return (
      <p className="inline-flex flex-nowrap items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] tracking-tight text-muted-foreground sm:text-[12px] sm:tracking-normal">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
        <span className="whitespace-nowrap">Gratuit · Sans engagement · Artisan partenaire ensuite</span>
      </p>
    );
  }

  return (
    <p className="flex flex-nowrap items-center gap-1 text-[11px] tracking-tight text-muted-foreground sm:gap-x-2.5 sm:text-[13px] sm:tracking-normal">
      <span className="whitespace-nowrap">Gratuit</span>
      <span aria-hidden className="shrink-0 text-brand-orange/60">·</span>
      <span className="whitespace-nowrap">Sans engagement</span>
      <span aria-hidden className="shrink-0 text-brand-orange/60">·</span>
      <span className="whitespace-nowrap">Artisan partenaire ensuite</span>
    </p>
  );
}
