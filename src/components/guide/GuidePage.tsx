import type { GuidePage } from "@/lib/guide-data";

/**
 * Renders an OCR'd guide page: real machine-readable text for Google/AEO,
 * plus the original page visual for human readers.
 */
export function GuidePageBlock({ page, index }: { page: GuidePage; index: number }) {
  const paragraphs = page.text.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <article
      id={`page-${page.order}`}
      className="grid gap-8 border-t border-border py-10 md:grid-cols-[1fr_1.1fr] md:gap-12"
    >
      <figure className="md:sticky md:top-24 md:self-start">
        <img
          src={page.asset}
          alt={page.alt || page.title}
          loading={index < 2 ? "eager" : "lazy"}
          className="w-full rounded-2xl border border-border bg-card object-contain shadow-soft"
          width={1600}
          height={1200}
        />
        <figcaption className="mt-3 text-xs text-muted-foreground">
          Page {page.order} · {page.summary}
        </figcaption>
      </figure>

      <div className="prose prose-sm sm:prose-base max-w-none">
        <h2 className="font-display text-2xl sm:text-3xl text-foreground">
          {page.title || `Page ${page.order}`}
        </h2>
        {page.summary && (
          <p className="text-base text-muted-foreground italic">{page.summary}</p>
        )}
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/90">
          {paragraphs.map((para, i) => {
            if (para.startsWith("- ") || para.startsWith("• ")) {
              const items = para.split(/\n/).map((l) => l.replace(/^[-•]\s*/, ""));
              return (
                <ul key={i} className="list-disc space-y-1 pl-5">
                  {items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>
        {page.keywords?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
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
    </article>
  );
}
