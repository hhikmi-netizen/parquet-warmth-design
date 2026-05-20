import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  className?: string;
}

function CardShell({
  label,
  description,
  icon,
  checked,
  disabled,
  onChange,
  className,
  badge,
  role,
}: BaseProps & { badge: React.ReactNode; role: "radio" | "checkbox" }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={!!checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked
          ? "border-brand-orange bg-brand-orange/5 shadow-soft"
          : "border-border hover:border-brand-orange/40 hover:-translate-y-0.5 hover:shadow-soft",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition [&_svg]:size-5",
            checked
              ? "bg-brand-orange text-primary-foreground"
              : "bg-brand-orange/10 text-brand-orange"
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
      {badge}
    </button>
  );
}

export function PqRadioCard(props: BaseProps) {
  return (
    <CardShell
      {...props}
      role="radio"
      badge={
        <span
          aria-hidden
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
            props.checked
              ? "border-brand-orange bg-brand-orange"
              : "border-border bg-background"
          )}
        >
          {props.checked && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
        </span>
      }
    />
  );
}

export function PqCheckCard(props: BaseProps) {
  return (
    <CardShell
      {...props}
      role="checkbox"
      badge={
        <span
          aria-hidden
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
            props.checked
              ? "border-brand-orange bg-brand-orange text-primary-foreground"
              : "border-border bg-background"
          )}
        >
          {props.checked && <Check className="size-3" />}
        </span>
      }
    />
  );
}
