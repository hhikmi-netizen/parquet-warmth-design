import { useEffect, useRef, useState } from "react";

export type VideoSource =
  | { kind: "mp4"; src: string; webm?: string }
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string };

type Props = {
  source: VideoSource;
  poster?: string;
  title: string;
  /** Auto-play muted in viewport — used for background hero loops. */
  ambient?: boolean;
  /** Aspect ratio. Default 16/9. */
  ratio?: string;
  className?: string;
  /** When true, controls are shown (default true unless ambient). */
  controls?: boolean;
  loop?: boolean;
  /** Optional schema.org caption for AEO. */
  captionsSrc?: string;
};

/**
 * Premium lazy video player.
 * - Lazy-mounts the actual <video>/iframe when scrolled near viewport (IntersectionObserver).
 * - Supports MP4/WebM, YouTube and Vimeo via the same API.
 * - "ambient" mode: muted, loop, autoplay, no controls — for hero backdrops.
 */
export function VideoPlayer({
  source,
  poster,
  title,
  ambient = false,
  ratio = "16 / 9",
  className = "",
  controls,
  loop,
  captionsSrc,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(ambient);

  useEffect(() => {
    if (!ref.current || mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [mounted]);

  const showControls = controls ?? !ambient;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-foreground/5 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Poster fallback while waiting */}
      {poster && (!mounted || (!playing && !ambient)) && (
        <img
          src={poster}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}

      {mounted && source.kind === "mp4" && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          autoPlay={ambient}
          muted={ambient}
          loop={ambient || loop}
          playsInline
          controls={showControls}
          preload="metadata"
          aria-label={title}
        >
          {source.webm && <source src={source.webm} type="video/webm" />}
          <source src={source.src} type="video/mp4" />
          {captionsSrc && (
            <track
              src={captionsSrc}
              kind="captions"
              srcLang="fr"
              label="Français"
              default
            />
          )}
        </video>
      )}

      {mounted && source.kind === "youtube" && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${source.id}?rel=0&modestbranding=1${ambient ? "&autoplay=1&mute=1&loop=1&controls=0&playlist=" + source.id : ""}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {mounted && source.kind === "vimeo" && (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://player.vimeo.com/video/${source.id}?title=0&byline=0&portrait=0${ambient ? "&autoplay=1&muted=1&loop=1&background=1" : ""}`}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* Play button overlay (only for non-ambient mp4 with poster, before play) */}
      {source.kind === "mp4" && !ambient && !playing && (
        <button
          type="button"
          onClick={() => {
            setMounted(true);
            setPlaying(true);
            // Manually play after mount
            requestAnimationFrame(() => {
              const v = ref.current?.querySelector("video");
              v?.play().catch(() => {});
            });
          }}
          className="group absolute inset-0 flex items-center justify-center bg-foreground/10 transition hover:bg-foreground/20"
          aria-label={`Lire : ${title}`}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-background/90 shadow-warm ring-1 ring-border transition group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-8 w-8 fill-foreground"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
