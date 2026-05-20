import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill } from "@/components/admin/atoms";
import { LOGS } from "@/lib/admin-mock";
import { Mail, FileText, Shield, Coins, AlertTriangle, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({ meta: [{ title: "Journal & logs — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: LogsPage,
});

const ICONS: Record<string, typeof Mail> = {
  Email: Mail,
  Document: FileText,
  Sécurité: Shield,
  Crédits: Coins,
  Création: FileText,
};
const CHANNELS = ["Tous", "Email", "Document", "Sécurité", "Crédits", "Création"];

function LogsPage() {
  const [channel, setChannel] = useState("Tous");
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      LOGS.filter((l) => channel === "Tous" || l.canal === channel).filter((l) =>
        q.trim() === "" ? true : (l.quoi + l.qui + l.canal).toLowerCase().includes(q.toLowerCase())
      ),
    [channel, q]
  );

  return (
    <AdminShell
      title="Journal d'activité"
      subtitle="Lisible pour un dirigeant : qui a fait quoi, quand, et ce qui mérite attention."
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition focus-within:border-brand-orange/40 sm:w-auto sm:max-w-sm sm:flex-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher dans l'activité…"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="-mx-3 flex items-center gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {CHANNELS.map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] transition ${
                channel === c
                  ? "border-brand-orange bg-brand-orange text-primary-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-brand-orange/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Panel className="mt-4">
        <ul className="divide-y divide-border">
          {filtered.map((l) => {
            const Icon = ICONS[l.canal] ?? FileText;
            const isAlert = l.niveau === "alerte";
            return (
              <li key={l.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isAlert ? "bg-rose-500/10 text-rose-600" : "bg-brand-orange/10 text-brand-orange"}`}>
                  {isAlert ? <AlertTriangle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{l.quoi}</p>
                    <Pill tone={isAlert ? "danger" : "neutral"}>{l.canal}</Pill>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Par {l.qui} · {l.quand} · réf. {l.id}
                  </p>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm text-muted-foreground">Aucune entrée pour ce filtre.</li>
          )}
        </ul>
      </Panel>
    </AdminShell>
  );
}
