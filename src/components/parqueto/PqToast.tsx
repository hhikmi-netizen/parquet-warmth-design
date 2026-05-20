import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info";

const ICONS: Record<Tone, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

const TONE_CLASS: Record<Tone, string> = {
  success: "border-[color:var(--state-success)]/30 bg-[color:var(--state-success-surface)] text-[color:var(--state-success)]",
  warning: "border-[color:var(--state-warning)]/30 bg-[color:var(--state-warning-surface)] text-[color:var(--state-warning)]",
  danger: "border-[color:var(--state-danger)]/30 bg-[color:var(--state-danger-surface)] text-[color:var(--state-danger)]",
  info: "border-[color:var(--state-info)]/30 bg-[color:var(--state-info-surface)] text-[color:var(--state-info)]",
};

export interface PqToastProps {
  tone?: Tone;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function PqToast({ tone = "info", title, description, action, onDismiss, className }: PqToastProps) {
  const Icon = ICONS[tone];
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-soft",
        "ring-1 ring-inset ring-foreground/[0.02]",
        className
      )}
    >
      <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", TONE_CLASS[tone])}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Fermer"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
