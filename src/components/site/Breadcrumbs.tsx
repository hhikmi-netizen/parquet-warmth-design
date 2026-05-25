import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb visible (SEO + UX). Le JSON-LD BreadcrumbList correspondant
 * est défini dans la `head()` de la route.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'ariane" className="border-b border-border bg-secondary/30">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-6 py-3 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-brand-orange"
            aria-label="Accueil"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Accueil</span>
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            {c.href && i < items.length - 1 ? (
              <a href={c.href} className="hover:text-brand-orange">
                {c.label}
              </a>
            ) : (
              <span className="text-foreground" aria-current={i === items.length - 1 ? "page" : undefined}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
