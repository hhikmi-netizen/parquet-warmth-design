import { useState } from "react";
import { ChevronDown, FileText, ZoomIn } from "lucide-react";
import type { GuidePage } from "@/lib/guide-data";
import { parseGuideText, sanitizeGuideText, type TextBlock } from "@/lib/guide-text";
import { ZoomLightbox } from "@/components/guide/ZoomLightbox";

/**
 * Editorial layout: the page IMAGE is the hero (the original guide is highly
 * visual). The OCR'd text is rendered in a collapsed "full text" disclosure
 * below — it stays in the DOM for Google / AI crawlers (SEO + AEO) but does
 * not pollute the reading experience.
 */
export function GuidePageBlock({ page, index }: { page: GuidePage; index: number }) {
  const blocks = parseGuideText(page.text);
  const cleanTitle = sanitizeGuideText(page.title || "");
  const cleanSummary = sanitizeGuideText(page.summary || "");
  const cleanAlt = sanitizeGuideText(page.alt || "");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);

  const wordCount = blocks.reduce(
    (n, b) =>
      n +
      (b.kind === "list"
        ? b.items.join(" ").split(/\s+/).length
        : "text" in b
          ? (b as { text: string }).text.split(/\s+/).length
          : "body" in b
            ? (b as { body: string[] }).body.join(" ").split(/\s+/).length
            : 0),
    0
  );

  return (
    <article
      id={`page-${page.order}`}
      className="border-t border-border py-10"
    >
      {/* Header — page index + clean title */}
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Page {page.order}
          </p>
          <h2 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
            {cleanTitle || `Page ${page.order}`}
          </h2>
        </div>
      </header>

      {/* HERO IMAGE — full width, click to zoom */}
      <figure>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-warm"
          aria-label={`Agrandir : ${cleanTitle || `Page ${page.order}`}`}
        >
          <img
            src={page.asset}
            alt={cleanAlt || cleanTitle}
            loading={index < 2 ? "eager" : "lazy"}
            className="mx-auto w-full max-w-3xl object-contain"
            width={1600}
            height={1200}
          />
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" /> Cliquer pour zoomer
          </span>
        </button>
        {cleanSummary && (
          <figcaption className="mx-auto mt-4 max-w-2xl text-center text-sm italic text-muted-foreground">
            {cleanSummary}
          </figcaption>
        )}
      </figure>

      {/* Keywords — discreet, useful chips */}
      {page.keywords?.length > 0 && (
        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-1.5">
          {page.keywords.slice(0, 6).map((k) => (
            <span
              key={k}
              className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-medium text-brand-orange-deep"
            >
              {k}
            </span>
          ))}
        </div>
      )}

      {/* Full text — collapsed by default. Indexable by Google/AI. */}
      {blocks.length > 0 && (
        <details
          open={textOpen}
          onToggle={(e) => setTextOpen((e.target as HTMLDetailsElement).open)}
          className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-border bg-secondary/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground/80 transition hover:bg-secondary">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-orange" />
              Lire le texte intégral
              <span className="text-xs text-muted-foreground">
                · {wordCount} mots
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${textOpen ? "rotate-180" : ""}`}
            />
          </summary>
          <div className="space-y-4 border-t border-border bg-background px-5 py-5">
            {blocks.map((b, k) => (
              <BlockView key={k} block={b} />
            ))}
          </div>
        </details>
      )}

      {zoomOpen && (
        <ZoomLightbox
          src={page.asset}
          alt={cleanAlt || cleanTitle}
          caption={cleanTitle}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </article>
  );
}

function BlockView({ block }: { block: TextBlock }) {
  switch (block.kind) {
    case "chapter":
      return (
        <div className="rounded-lg border border-brand-orange/25 bg-brand-orange/5 p-4">
          {block.number && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Chapitre {block.number}
            </p>
          )}
          <p className="mt-1 font-display text-lg text-foreground">{block.text}</p>
        </div>
      );

    case "heading":
      return block.level === 2 ? (
        <h3 className="mt-3 font-display text-lg text-foreground">{block.text}</h3>
      ) : (
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange-deep">
          {block.text}
        </h4>
      );

    case "callout":
      return (
        <aside className="rounded-lg border-l-2 border-brand-orange bg-secondary/60 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange-deep">
            {block.label}
          </p>
          {block.body.length > 0 && (
            <div className="mt-1.5 space-y-1 text-sm leading-relaxed text-foreground/85">
              {block.body.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          )}
        </aside>
      );

    case "list":
      return (
        <ul className="space-y-1">
          {block.items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 text-[14px] leading-relaxed text-foreground/85"
            >
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange/70" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );

    case "tagline":
      return (
        <p className="mt-3 border-t border-border pt-3 text-center font-display text-base italic text-brand-orange-deep">
          {block.text}
        </p>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-brand-orange/40 pl-4 italic text-muted-foreground">
          {block.text}
        </blockquote>
      );

    default:
      return (
        <p className="text-[14px] leading-relaxed text-foreground/85">{block.text}</p>
      );
  }
}
