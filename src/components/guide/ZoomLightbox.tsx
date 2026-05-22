import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";

/**
 * Lightweight zoom lightbox: scroll/buttons to zoom, drag to pan, ESC to close.
 */
export function ZoomLightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoom(0.25);
      if (e.key === "-") zoom(-0.25);
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function zoom(delta: number) {
    setScale((s) => Math.min(5, Math.max(1, +(s + delta).toFixed(2))));
  }
  function reset() {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.2 : -0.2);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (scale <= 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    setPos({
      x: dragRef.current.ox + (e.clientX - dragRef.current.x),
      y: dragRef.current.oy + (e.clientY - dragRef.current.y),
    });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur"
      role="dialog"
      aria-label="Aperçu zoomable"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="truncate text-sm font-medium text-white/90">{caption || alt}</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => zoom(-0.25)}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Zoom arrière"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[3.5rem] text-center text-xs text-white/70">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => zoom(0.25)}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Zoom avant"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="ml-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in" }}
        onClick={() => scale === 1 && zoom(0.5)}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-[90vh] max-w-[95vw] select-none object-contain"
          style={{
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragRef.current ? "none" : "transform 0.18s ease-out",
          }}
        />
      </div>

      <div className="border-t border-white/10 px-4 py-2 text-center text-[11px] text-white/50">
        Molette = zoom · Glisser pour déplacer · + / − / 0 au clavier · Échap pour fermer
      </div>
    </div>
  );
}
