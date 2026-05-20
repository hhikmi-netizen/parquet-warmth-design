/**
 * Parqueto Design Tokens (V9)
 * Mirrors CSS variables in src/styles.css — for runtime use & documentation.
 */
export const PQ_TOKENS = {
  color: {
    cream: "var(--brand-cream)",
    creamDeep: "var(--brand-cream-deep)",
    ink: "var(--brand-ink)",
    inkSoft: "var(--brand-ink-soft)",
    orange: "var(--brand-orange)",
    orangeDeep: "var(--brand-orange-deep)",
    orangeSoft: "var(--brand-orange-soft)",
    success: "var(--state-success)",
    warning: "var(--state-warning)",
    danger: "var(--state-danger)",
    info: "var(--state-info)",
  },
  font: {
    display: '"Fraunces", Georgia, serif',
    sans: '"Inter", system-ui, sans-serif',
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
    pill: "9999px",
  },
  spacing: {
    /** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 */
    scale: [4, 8, 12, 16, 24, 32, 48, 64],
  },
  shadow: {
    soft: "var(--shadow-soft)",
    warm: "var(--shadow-warm)",
  },
} as const;

export const PQ_RESPONSIVE = {
  /** mobile-first breakpoints (Tailwind defaults) */
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;
