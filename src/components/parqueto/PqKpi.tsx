import * as React from "react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PqKpiProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: { dir: "up" | "down"; value: string };
  className?: string;
}

export function PqKpi({ label, value, hint, icon: Icon, trend, className }: PqKpiProps) {
  const TrendIcon = trend?.dir === "down" ? TrendingDown : TrendingUp;
  const trendClass =
    trend?.dir === "down"
      ? "text-[color:var(--state-danger)] bg-[color:var(--state-danger-surface)]"
      : "text-[color:var(--state-success)] bg-[color:var(--state-success-surface)]";
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card p-3.5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-warm sm:p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
        {Icon && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange/15 sm:h-8 sm:w-8">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:mt-3 sm:gap-2">
        <span className="font-display text-2xl text-foreground sm:text-3xl">{value}</span>
        {trend && (
          <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", trendClass)}>
            <TrendIcon className="h-3 w-3" />
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{hint}</p>}
    </div>
  );
}
