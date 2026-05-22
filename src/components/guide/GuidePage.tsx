import { useState } from "react";
import { ZoomIn } from "lucide-react";
import type { GuidePage } from "@/lib/guide-data";
import { parseGuideText, type TextBlock } from "@/lib/guide-text";
import { ZoomLightbox } from "@/components/guide/ZoomLightbox";

/**
 * Renders an OCR'd guide page as structured blocks + the original visual
 * (click to zoom). Optimised for both human reading and SEO/AEO.
 */
export function GuidePageBlock({ page, index }: { page: GuidePage; index: number }) {
  const blocks = parseGuideText(page.text);
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <article
      id={`page-${page.order}`}
      className="grid gap-8 border-t border-border py-12 md:grid-cols-[1fr_1.1fr] md:gap-12"
    >
      <figure className="md:sticky md:top-24 md:self-start">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-warm"
          aria-label={`Agrandir : ${page.title || `Page ${page.order}`}`}
        >
          <img
            src={page.asset}
            alt={page.alt || page.title}
            loading={index < 2 ? "eager" : "lazy"}
            className="w-full object-contain"
            width={1600}
            height={1200}
          />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" /> Zoom
          </span>
        </button>
        <figcaption className="mt-3 text-xs text-muted-foreground">
          Page {page.order} · {page.summary}
        </figcaption>
      </figure>

      <div className="max-w-none">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          {page.title || `Page ${page.order}`}
        </h2>
        {page.summary && (
          <p className="mt-2 text-sm italic text-muted-foreground">{page.summary}</p>
        )}

        <div className="mt-6 space-y-4">
          {blocks.map((b, k) => (
            <BlockView key={k} block={b} />
          ))}
        </div>

        {page.keywords?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {page.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-medium text-brand-orange-deep"
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>

      {zoomOpen && (
        <ZoomLightbox
          src={page.asset}
          alt={page.alt || page.title}
          caption={page.title}
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
        <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 p-5">
          {block.number && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Chapitre {block.number}
            </p>
          )}
          <p className="mt-1 font-display text-xl text-foreground">{block.text}</p>
        </div>
      );

    case "heading":
      return block.level === 2 ? (
        <h3 className="mt-2 font-display text-xl text-foreground">{block.text}</h3>
      ) : (
        <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange-deep">
          {block.text}
        </h4>
      );

    case "callout":
      return (
        <aside className="rounded-xl border-l-4 border-brand-orange bg-secondary/40 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange-deep">
            {block.label}
          </p>
          {block.body.length > 0 && (
            <div className="mt-2 space-y-1 text-sm leading-relaxed text-foreground/90">
              {block.body.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          )}
        </aside>
      );

    case "list":
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 text-[15px] leading-relaxed text-foreground/90"
            >
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );

    case "tagline":
      return (
        <p className="mt-4 border-t border-border pt-4 text-center font-display text-lg italic text-brand-orange-deep">
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
        <p className="text-[15px] leading-relaxed text-foreground/90">{block.text}</p>
      );
  }
}
