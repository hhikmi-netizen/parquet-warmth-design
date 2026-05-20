import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const pqButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-orange text-primary-foreground shadow-soft hover:bg-brand-orange-deep hover:shadow-warm",
        secondary:
          "bg-card text-foreground border border-border hover:border-brand-orange/40 hover:text-brand-orange",
        ghost:
          "bg-transparent text-foreground hover:bg-brand-orange/8 hover:text-brand-orange",
        link: "bg-transparent text-brand-orange hover:underline underline-offset-4 p-0 h-auto shadow-none",
        danger:
          "bg-[color:var(--state-danger)] text-white shadow-soft hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-full [&_svg]:size-3.5",
        md: "h-10 px-4 text-sm rounded-full [&_svg]:size-4",
        lg: "h-12 px-6 text-sm rounded-full [&_svg]:size-4",
        icon: "h-10 w-10 rounded-full [&_svg]:size-4",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  }
);

export interface PqButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pqButton> {
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const PqButton = React.forwardRef<HTMLButtonElement, PqButtonProps>(
  (
    { className, variant, size, block, asChild, loading, iconLeft, iconRight, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(pqButton({ variant, size, block, className }))}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : iconLeft}
        {children}
        {!loading && iconRight}
      </Comp>
    );
  }
);
PqButton.displayName = "PqButton";
