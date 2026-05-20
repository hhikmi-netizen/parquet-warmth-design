import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PqModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function PqModal({ open, onClose, title, description, children, footer, size = "md" }: PqModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal>
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-in fade-in"
      />
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-t-2xl bg-card text-foreground shadow-warm animate-in fade-in slide-in-from-bottom-4",
          "sm:rounded-2xl sm:border sm:border-border",
          sizeClass
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border bg-gradient-warm/60 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-lg text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm">{children}</div>
        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
