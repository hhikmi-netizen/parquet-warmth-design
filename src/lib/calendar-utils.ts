/**
 * Utilities to add events to external calendars (Google, Apple/iCal, Outlook).
 * No backend required — generates URLs and downloadable .ics blobs client-side.
 */

export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  /** Local date/time, start. */
  start: Date;
  /** Local date/time, end. If omitted, +1h is used. */
  end?: Date;
  /** Optional URL appended to description. */
  url?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Format a Date as "YYYYMMDDTHHmmssZ" in UTC, per RFC 5545 / Google. */
function formatUtc(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function resolveEnd(ev: CalendarEvent): Date {
  return ev.end ?? new Date(ev.start.getTime() + 60 * 60 * 1000);
}

function fullDescription(ev: CalendarEvent): string {
  const parts: string[] = [];
  if (ev.description) parts.push(ev.description);
  if (ev.url) parts.push(ev.url);
  return parts.join("\n\n");
}

/** Google Calendar "create event" link. Opens in a new tab. */
export function googleCalendarUrl(ev: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${formatUtc(ev.start)}/${formatUtc(resolveEnd(ev))}`,
    details: fullDescription(ev),
    location: ev.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Outlook Web "create event" link. */
export function outlookCalendarUrl(ev: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    startdt: ev.start.toISOString(),
    enddt: resolveEnd(ev).toISOString(),
    body: fullDescription(ev),
    location: ev.location ?? "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Build a valid VCALENDAR/VEVENT block (RFC 5545). */
export function buildIcs(ev: CalendarEvent, uid?: string): string {
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Parqueto//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid ?? `${Date.now()}-${Math.random().toString(36).slice(2)}@parqueto.fr`}`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(ev.start)}`,
    `DTEND:${formatUtc(resolveEnd(ev))}`,
    `SUMMARY:${escape(ev.title)}`,
    `DESCRIPTION:${escape(fullDescription(ev))}`,
    ev.location ? `LOCATION:${escape(ev.location)}` : "",
    ev.url ? `URL:${ev.url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

/** Trigger a download of the .ics file in the browser. */
export function downloadIcs(ev: CalendarEvent, filename = "rendez-vous.ics") {
  const ics = buildIcs(ev);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
