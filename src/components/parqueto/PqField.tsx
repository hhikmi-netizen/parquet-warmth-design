import * as React from "react";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "default" | "error" | "success";

const fieldBase =
  "w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const stateClass: Record<State, string> = {
  default: "border-border focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20",
  error:
    "border-[color:var(--state-danger)]/60 focus:border-[color:var(--state-danger)] focus:ring-2 focus:ring-[color:var(--state-danger)]/20",
  success:
    "border-[color:var(--state-success)]/60 focus:border-[color:var(--state-success)] focus:ring-2 focus:ring-[color:var(--state-success)]/20",
};

interface WrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

function FieldWrapper({ label, hint, error, success, required, htmlFor, children }: WrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="flex items-baseline justify-between text-xs font-medium text-foreground">
          <span>
            {label}
            {required && <span className="ml-0.5 text-brand-orange">*</span>}
          </span>
          {hint && !error && !success && <span className="font-normal text-muted-foreground">{hint}</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-[color:var(--state-danger)]">
          <AlertCircle className="size-3" /> {error}
        </p>
      )}
      {success && !error && (
        <p className="flex items-center gap-1 text-[11px] text-[color:var(--state-success)]">
          <CheckCircle2 className="size-3" /> {success}
        </p>
      )}
    </div>
  );
}

export interface PqFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  iconLeft?: React.ReactNode;
}

export const PqField = React.forwardRef<HTMLInputElement, PqFieldProps>(
  ({ label, hint, error, success, required, iconLeft, className, id, ...props }, ref) => {
    const state: State = error ? "error" : success ? "success" : "default";
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <FieldWrapper label={label} hint={hint} error={error} success={success} required={required} htmlFor={inputId}>
        <div className="relative">
          {iconLeft && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(fieldBase, stateClass[state], iconLeft && "pl-10", className)}
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  }
);
PqField.displayName = "PqField";

export interface PqTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
}

export const PqTextarea = React.forwardRef<HTMLTextAreaElement, PqTextareaProps>(
  ({ label, hint, error, success, required, className, id, rows = 4, ...props }, ref) => {
    const state: State = error ? "error" : success ? "success" : "default";
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <FieldWrapper label={label} hint={hint} error={error} success={success} required={required} htmlFor={inputId}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          className={cn(fieldBase, stateClass[state], "resize-y", className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
PqTextarea.displayName = "PqTextarea";

export interface PqSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const PqSelect = React.forwardRef<HTMLSelectElement, PqSelectProps>(
  ({ label, hint, error, required, className, id, children, ...props }, ref) => {
    const state: State = error ? "error" : "default";
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <FieldWrapper label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            className={cn(fieldBase, stateClass[state], "appearance-none pr-10", className)}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </FieldWrapper>
    );
  }
);
PqSelect.displayName = "PqSelect";
