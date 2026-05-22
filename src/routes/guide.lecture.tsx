import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { CHAPTERS, getAllPages, type ChapterSlug } from "@/lib/guide-data";

export const Route = createFileRoute("/guide/lecture")({
  component: GuideReader,
  head: () => ({
    meta: [
      { title: "Lire le guide du parquet — Mode flipbook · Parqueto" },
      {
        name: "description",
        content:
          "Lisez les 79 pages du guide ultime du parquet en mode flipbook interactif. Navigation clavier, sommaire, plein écran.",
      },
      // Reader is interactive; the rendered chapter pages already carry SEO.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function GuideReader() {
  const pages = useMemo(() => getAllPages(), []);
  const [idx, setIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  // Restore last page
  useEffect(() => {
    const saved = Number(localStorage.getItem("parqueto-guide-page") || 0);
    if (saved >= 0 && saved < pages.length) setIdx(saved);
  }, [pages.length]);

  useEffect(() => {
    localStorage.setItem("parqueto-guide-page", String(idx));
  }, [idx]);

  const next = useCallback(() => setIdx((i) => Math.min(i + 1, pages.length - 1)), [pages.length]);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const page = pages[idx];
  const chapter = CHAPTERS.find((c) => c.slug === page?.chapter);

  // Group for TOC
  const grouped = useMemo(() => {
    const groups: Record<string, { idx: number; page: typeof pages[0] }[]> = {};
    pages.forEach((p, i) => {
      (groups[p.chapter] ||= []).push({ idx: i, page: p });
    });
    return groups;
  }, [pages]);

  return (
    <main className="flex min-h-screen flex-col bg-[oklch(0.18_0.02_60)] text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur sm:px-6">
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Sommaire
        </Link>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
            {chapter?.title}
          </p>
          <p className="text-xs text-white/70">
            Page {idx + 1} / {pages.length}
          </p>
        </div>
        <button
          onClick={() => setTocOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          <List className="h-3.5 w-3.5" /> Chapitres
        </button>
      </header>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
        <button
          aria-label="Page précédente"
          onClick={prev}
          disabled={idx === 0}
          className="absolute left-2 z-10 rounded-full bg-white/10 p-3 backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={page?.asset}
            alt={page?.alt || page?.title || `Page ${idx + 1}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          />
        </AnimatePresence>
        <button
          aria-label="Page suivante"
          onClick={next}
          disabled={idx === pages.length - 1}
          className="absolute right-2 z-10 rounded-full bg-white/10 p-3 backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-white/10 bg-black/30 px-4 py-3 text-center text-xs text-white/60 backdrop-blur sm:px-6">
        ← → pour naviguer · Espace = page suivante · Échap pour fermer le sommaire
      </div>

      <AnimatePresence>
        {tocOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-stretch bg-black/70 backdrop-blur-sm"
            onClick={() => setTocOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto h-full w-full max-w-md overflow-y-auto bg-[oklch(0.22_0.02_60)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">Sommaire</h2>
                <button
                  onClick={() => setTocOpen(false)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 space-y-6">
                {CHAPTERS.filter((c) => grouped[c.slug]?.length > 0).map((c) => (
                  <div key={c.slug}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {c.title}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {grouped[c.slug as ChapterSlug].map(({ idx: i, page: p }) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              setIdx(i);
                              setTocOpen(false);
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10 ${
                              i === idx ? "bg-white/15 text-white" : "text-white/70"
                            }`}
                          >
                            {p.title || `Page ${p.order}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
