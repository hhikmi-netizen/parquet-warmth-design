import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surface = cva("rounded-2xl border transition", {
  variants: {
    tone: {
      card: "bg-card border-border shadow-soft",
      raised: "bg-card border-border shadow-warm",
      muted: "bg-muted/40 border-transparent",
      warm: "bg-gradient-warm border-brand-orange/15",
      outline: "bg-transparent border-dashed border-border",
    },
    interactive: {
      true: "hover:-translate-y-0.5 hover:shadow-warm hover:border-brand-orange/30 cursor-pointer",
      false: "",
    },
    padding: {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-5",
      lg: "p-5 sm:p-7",
    },
  },
  defaultVariants: { tone: "card", interactive: false, padding: "md" },
});

export interface PqSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surface> {}

export const PqSurface = React.forwardRef<HTMLDivElement, PqSurfaceProps>(
  ({ className, tone, interactive, padding, ...props }, ref) => (
    <div ref={ref} className={cn(surface({ tone, interactive, padding, className }))} {...props} />
  )
);
PqSurface.displayName = "PqSurface";
