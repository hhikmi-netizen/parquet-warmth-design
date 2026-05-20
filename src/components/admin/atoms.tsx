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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">{value}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${trendClass}`}>
            <TrendIcon className="h-3 w-3" />
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
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
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title && <h2 className="font-display text-lg text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
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
