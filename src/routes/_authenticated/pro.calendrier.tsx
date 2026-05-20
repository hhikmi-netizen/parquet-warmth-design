import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { PqSurface, PqPill, PqButton } from "@/components/parqueto";
import { AddToCalendar } from "@/components/calendar/AddToCalendar";

export const Route = createFileRoute("/_authenticated/pro/calendrier")({
  component: CalendrierPage,
  head: () => ({
    meta: [
      { title: "Calendrier & disponibilités — Parqueto Pro" },
      {
        name: "description",
        content:
          "Gérez vos plages de disponibilité, vos congés et vos rendez-vous chantier. Ajoutez vos RDV à Google Calendar ou iCal en un clic.",
      },
    ],
  }),
});

type DayKey = "lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim";
type Slot = { start: string; end: string };
type WeeklyAvail = Record<DayKey, { active: boolean; slots: Slot[] }>;
type DayOff = { id: string; from: string; to: string; reason: string };
type Rdv = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  start: string; // HH:mm
  end: string;
  type: "visite" | "chantier" | "appel";
  client: string;
  ville: string;
  ref: string;
  address?: string;
};

const DAYS: { key: DayKey; label: string }[] = [
  { key: "lun", label: "Lundi" },
  { key: "mar", label: "Mardi" },
  { key: "mer", label: "Mercredi" },
  { key: "jeu", label: "Jeudi" },
  { key: "ven", label: "Vendredi" },
  { key: "sam", label: "Samedi" },
  { key: "dim", label: "Dimanche" },
];

const DEFAULT_AVAIL: WeeklyAvail = {
  lun: { active: true, slots: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  mar: { active: true, slots: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  mer: { active: true, slots: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  jeu: { active: true, slots: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:00" }] },
  ven: { active: true, slots: [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "17:00" }] },
  sam: { active: false, slots: [] },
  dim: { active: false, slots: [] },
};

const MOCK_RDV: Rdv[] = [
  {
    id: "r1",
    date: nextWeekdayISO(2),
    start: "10:00",
    end: "11:30",
    type: "visite",
    client: "M. Lemoine",
    ville: "Paris 11e",
    ref: "PRJ-A12F9C8E",
    address: "12 rue Oberkampf, 75011 Paris",
  },
  {
    id: "r2",
    date: nextWeekdayISO(5),
    start: "08:30",
    end: "17:00",
    type: "chantier",
    client: "Famille Dubois",
    ville: "Boulogne-Billancourt",
    ref: "PRJ-B7E11A22",
    address: "5 av. Jean Jaurès, 92100 Boulogne",
  },
  {
    id: "r3",
    date: nextWeekdayISO(7),
    start: "14:00",
    end: "14:30",
    type: "appel",
    client: "Mme Garnier",
    ville: "Vincennes",
    ref: "PRJ-C03DD771",
  },
];

function nextWeekdayISO(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function CalendrierPage() {
  const [avail, setAvail] = useState<WeeklyAvail>(DEFAULT_AVAIL);
  const [daysOff, setDaysOff] = useState<DayOff[]>([
    { id: "d1", from: "2026-07-20", to: "2026-08-03", reason: "Congés d'été" },
  ]);
  const [pauseAccept, setPauseAccept] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalHours = useMemo(() => {
    let m = 0;
    for (const k of Object.keys(avail) as DayKey[]) {
      if (!avail[k].active) continue;
      for (const s of avail[k].slots) {
        m += diffMinutes(s.start, s.end);
      }
    }
    return Math.round((m / 60) * 10) / 10;
  }, [avail]);

  const upcoming = useMemo(
    () => [...MOCK_RDV].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)),
    [],
  );

  function toggleDay(k: DayKey) {
    setAvail((a) => ({
      ...a,
      [k]: { ...a[k], active: !a[k].active, slots: a[k].active ? a[k].slots : a[k].slots.length ? a[k].slots : [{ start: "09:00", end: "17:00" }] },
    }));
  }

  function updateSlot(k: DayKey, i: number, field: "start" | "end", v: string) {
    setAvail((a) => {
      const copy = [...a[k].slots];
      copy[i] = { ...copy[i], [field]: v };
      return { ...a, [k]: { ...a[k], slots: copy } };
    });
  }

  function addSlot(k: DayKey) {
    setAvail((a) => ({
      ...a,
      [k]: { ...a[k], slots: [...a[k].slots, { start: "14:00", end: "18:00" }] },
    }));
  }

  function removeSlot(k: DayKey, i: number) {
    setAvail((a) => ({
      ...a,
      [k]: { ...a[k], slots: a[k].slots.filter((_, idx) => idx !== i) },
    }));
  }

  function addDayOff() {
    const today = new Date().toISOString().slice(0, 10);
    setDaysOff((d) => [
      ...d,
      { id: `d${Date.now()}`, from: today, to: today, reason: "" },
    ]);
  }

  function updateDayOff(id: string, field: keyof DayOff, v: string) {
    setDaysOff((d) => d.map((x) => (x.id === id ? { ...x, [field]: v } : x)));
  }

  function removeDayOff(id: string) {
    setDaysOff((d) => d.filter((x) => x.id !== id));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <main className="min-h-screen bg-brand-cream/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link
          to="/pro"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-orange-deep"
        >
          <ArrowLeft className="h-4 w-4" /> Retour tableau de bord
        </Link>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-orange-deep">
              Calendrier & disponibilités
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Mon planning</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Définissez vos plages travaillées, vos congés et synchronisez vos RDV
              chantier avec Google Calendar, Apple Calendar ou Outlook.
            </p>
          </div>
          <div className="flex gap-2">
            <PqButton variant="ghost" onClick={() => setAvail(DEFAULT_AVAIL)}>
              Réinitialiser
            </PqButton>
            <PqButton onClick={save}>{saved ? "✓ Enregistré" : "Enregistrer"}</PqButton>
          </div>
        </header>

        {/* KPIs */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <PqSurface tone="warm" padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-primary-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Heures travaillées / semaine</p>
                <p className="font-serif text-2xl">{totalHours} h</p>
              </div>
            </div>
          </PqSurface>
          <PqSurface padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">RDV à venir</p>
                <p className="font-serif text-2xl">{upcoming.length}</p>
              </div>
            </div>
          </PqSurface>
          <PqSurface padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Périodes de congés</p>
                <p className="font-serif text-2xl">{daysOff.length}</p>
              </div>
            </div>
          </PqSurface>
        </div>

        {/* Weekly availability */}
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-xl">Plages hebdomadaires</h2>
              <p className="text-xs text-muted-foreground">
                Vos créneaux standards. Le matching propose des projets en cohérence.
              </p>
            </div>
            <PqPill tone={pauseAccept ? "warning" : "neutral"}>
              <button
                type="button"
                onClick={() => setPauseAccept((v) => !v)}
                className="flex items-center gap-1.5"
              >
                {pauseAccept ? <AlertCircle className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                {pauseAccept ? "Pause active — projets suspendus" : "Recevoir des projets"}
              </button>
            </PqPill>
          </div>
          <PqSurface padding="none">
            <div className="divide-y divide-border">
              {DAYS.map((d) => {
                const day = avail[d.key];
                return (
                  <div key={d.key} className="grid gap-3 p-4 sm:grid-cols-[140px_1fr] sm:items-start">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={day.active}
                        onChange={() => toggleDay(d.key)}
                        className="h-4 w-4 accent-brand-orange"
                      />
                      <span className={`text-sm font-medium ${day.active ? "" : "text-muted-foreground"}`}>
                        {d.label}
                      </span>
                    </label>
                    {day.active ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {day.slots.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-1"
                          >
                            <input
                              type="time"
                              value={s.start}
                              onChange={(e) => updateSlot(d.key, i, "start", e.target.value)}
                              className="bg-transparent text-sm focus:outline-none"
                            />
                            <span className="text-muted-foreground">→</span>
                            <input
                              type="time"
                              value={s.end}
                              onChange={(e) => updateSlot(d.key, i, "end", e.target.value)}
                              className="bg-transparent text-sm focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeSlot(d.key, i)}
                              className="ml-1 text-muted-foreground hover:text-destructive"
                              aria-label="Supprimer le créneau"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addSlot(d.key)}
                          className="inline-flex items-center gap-1 rounded-xl border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange-deep"
                        >
                          <Plus className="h-3 w-3" /> Créneau
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Fermé</p>
                    )}
                  </div>
                );
              })}
            </div>
          </PqSurface>
        </section>

        {/* Days off */}
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-xl">Congés & indisponibilités</h2>
              <p className="text-xs text-muted-foreground">
                Aucune proposition de projet ne vous sera envoyée pendant ces périodes.
              </p>
            </div>
            <PqButton variant="ghost" onClick={addDayOff}>
              <Plus className="h-4 w-4" /> Ajouter
            </PqButton>
          </div>
          <PqSurface padding="md">
            {daysOff.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune période planifiée.</p>
            ) : (
              <ul className="space-y-2">
                {daysOff.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Du</span>
                      <input
                        type="date"
                        value={d.from}
                        onChange={(e) => updateDayOff(d.id, "from", e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">au</span>
                      <input
                        type="date"
                        value={d.to}
                        onChange={(e) => updateDayOff(d.id, "to", e.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={d.reason}
                      onChange={(e) => updateDayOff(d.id, "reason", e.target.value)}
                      placeholder="Motif (optionnel)"
                      className="min-w-[180px] flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDayOff(d.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PqSurface>
        </section>

        {/* Upcoming RDV */}
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-xl">Mes prochains rendez-vous</h2>
              <p className="text-xs text-muted-foreground">
                Synchronisez d'un clic avec votre agenda personnel.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((r) => {
              const [y, m, d] = r.date.split("-").map(Number);
              const [sh, sm] = r.start.split(":").map(Number);
              const [eh, em] = r.end.split(":").map(Number);
              const startDate = new Date(y, m - 1, d, sh, sm);
              const endDate = new Date(y, m - 1, d, eh, em);
              const typeLabel = r.type === "visite" ? "Visite technique" : r.type === "chantier" ? "Chantier" : "Appel découverte";
              const typeTone =
                r.type === "visite" ? "info" : r.type === "chantier" ? "warning" : "neutral";
              return (
                <PqSurface key={r.id} padding="md" tone="card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <PqPill tone={typeTone}>{typeLabel}</PqPill>
                      <p className="mt-2 font-serif text-lg">{r.client}</p>
                      <p className="text-xs text-muted-foreground">Réf. {r.ref}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-2xl leading-none text-brand-orange-deep">
                        {startDate.toLocaleDateString("fr-FR", { day: "2-digit" })}
                      </p>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {startDate.toLocaleDateString("fr-FR", { month: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {r.start} – {r.end}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {r.address ?? r.ville}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <AddToCalendar
                      variant="outline"
                      label="Ajouter à mon agenda"
                      icsFilename={`parqueto-${r.ref}.ics`}
                      event={{
                        title: `${typeLabel} · ${r.client} (${r.ref})`,
                        description: `Projet Parqueto ${r.ref}\nClient : ${r.client}`,
                        location: r.address ?? r.ville,
                        start: startDate,
                        end: endDate,
                      }}
                    />
                  </div>
                </PqSurface>
              );
            })}
          </div>
        </section>

        <PqSurface tone="muted" padding="md" className="mt-8">
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
            Vos disponibilités servent au matching exclusif : seuls les projets compatibles
            avec votre planning et votre zone vous sont proposés.
          </p>
        </PqSurface>
      </div>
    </main>
  );
}

function diffMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}
