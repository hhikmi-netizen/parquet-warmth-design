import * as React from "react";
import { cn } from "@/lib/utils";

export type PqPillTone =
  | "neutral"
  | "orange"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ink";

const TONES: Record<PqPillTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  orange: "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
  success:
    "bg-[color:var(--state-success-surface)] text-[color:var(--state-success)] border-[color:var(--state-success)]/30",
  warning:
    "bg-[color:var(--state-warning-surface)] text-[color:var(--state-warning)] border-[color:var(--state-warning)]/30",
  danger:
    "bg-[color:var(--state-danger-surface)] text-[color:var(--state-danger)] border-[color:var(--state-danger)]/30",
  info: "bg-[color:var(--state-info-surface)] text-[color:var(--state-info)] border-[color:var(--state-info)]/30",
  ink: "bg-foreground text-background border-foreground",
};

export interface PqPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: PqPillTone;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

export function PqPill({ tone = "neutral", icon, size = "sm", className, children, ...props }: PqPillProps) {
  const sz = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium leading-none",
        sz,
        TONES[tone],
        className
      )}
      {...props}
    >
      {icon && <span className="[&_svg]:size-3">{icon}</span>}
      {children}
    </span>
  );
}
