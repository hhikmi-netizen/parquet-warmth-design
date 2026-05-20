import { ReactNode } from "react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  trend?: { dir: "up" | "down"; value: string };
  icon?: LucideIcon;
  hint?: string;
}) {
  const TrendIcon = trend?.dir === "down" ? TrendingDown : TrendingUp;
  const trendClass =
    trend?.dir === "down"
      ? "text-rose-600 bg-rose-500/10"
      : "text-emerald-700 bg-emerald-500/10";
  return (
    <div className="group rounded-2xl border border-border bg-card p-3.5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-warm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
          {label}
        </p>
        {Icon && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange/15 sm:h-8 sm:w-8">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:mt-3 sm:gap-2">
        <span className="font-display text-2xl text-foreground sm:text-3xl">{value}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${trendClass}`}>
            <TrendIcon className="h-3 w-3" />
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card shadow-soft ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-base text-foreground sm:text-lg">{title}</h2>}
            {description && <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "orange" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground border-border",
    orange: "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-700 border-rose-500/30",
    info: "bg-sky-500/10 text-sky-700 border-sky-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <h3 className="font-display text-base text-foreground">{children}</h3>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}
