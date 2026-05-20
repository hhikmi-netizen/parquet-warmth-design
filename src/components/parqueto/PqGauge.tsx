import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "orange" | "success" | "warning" | "danger" | "info";

const FILLS: Record<Tone, string> = {
  orange: "from-brand-orange to-brand-orange-deep",
  success: "from-[color:var(--state-success)] to-[color:var(--state-success)]/80",
  warning: "from-[color:var(--state-warning)] to-[color:var(--state-warning)]/80",
  danger: "from-[color:var(--state-danger)] to-[color:var(--state-danger)]/80",
  info: "from-[color:var(--state-info)] to-[color:var(--state-info)]/80",
};

export interface PqGaugeProps {
  value: number;
  max?: number;
  label?: string;
  hint?: string;
  tone?: Tone;
  showValue?: boolean;
  className?: string;
}

export function PqGauge({
  value,
  max = 100,
  label,
  hint,
  tone = "orange",
  showValue = true,
  className,
}: PqGaugeProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-2 text-xs">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showValue && (
            <span className="font-display text-sm text-foreground">
              {value}
              <span className="text-muted-foreground"> / {max}</span>
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", FILLS[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
