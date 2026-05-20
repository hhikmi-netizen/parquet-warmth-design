import { useState, useRef, useEffect } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import {
  googleCalendarUrl,
  outlookCalendarUrl,
  downloadIcs,
  type CalendarEvent,
} from "@/lib/calendar-utils";

interface Props {
  event: CalendarEvent;
  label?: string;
  className?: string;
  /** Visual style: "primary" (orange), "outline" (default), "ghost". */
  variant?: "primary" | "outline" | "ghost";
  /** Suggested filename for the .ics download. */
  icsFilename?: string;
}

export function AddToCalendar({
  event,
  label = "Ajouter au calendrier",
  className = "",
  variant = "outline",
  icsFilename = "rendez-vous.ics",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";
  const tone =
    variant === "primary"
      ? "bg-brand-orange text-primary-foreground hover:bg-brand-orange-deep"
      : variant === "ghost"
      ? "text-brand-orange-deep hover:bg-brand-orange/10"
      : "border border-border bg-background hover:border-brand-orange/40 hover:bg-brand-cream/40";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${base} ${tone}`}
      >
        <CalendarPlus className="h-4 w-4" />
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-warm">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-cream/40"
          >
            <span className="text-base">📅</span> Google Calendar
          </a>
          <a
            href={outlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-cream/40"
          >
            <span className="text-base">📧</span> Outlook
          </a>
          <button
            type="button"
            onClick={() => {
              downloadIcs(event, icsFilename);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-brand-cream/40"
          >
            <span className="text-base">🍎</span> Apple / iCal (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
