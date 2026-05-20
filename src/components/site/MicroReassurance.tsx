export function MicroReassurance({ variant = "inline" }: { variant?: "inline" | "pill" }) {
  if (variant === "pill") {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[12px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
        Gratuit · Sans engagement · Artisan partenaire ensuite
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted-foreground">
      <span>Gratuit</span>
      <span aria-hidden className="text-brand-orange/60">·</span>
      <span>Sans engagement</span>
      <span aria-hidden className="text-brand-orange/60">·</span>
      <span>Artisan partenaire ensuite</span>
    </p>
  );
}
