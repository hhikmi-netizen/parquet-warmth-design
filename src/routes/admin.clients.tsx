import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Download, Eye, UserPlus, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel } from "@/components/admin/atoms";
import { LEADS, STATUS_LABEL, STATUS_TONE, type LeadStatus } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({ meta: [{ title: "Demandes clients — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ClientsPage,
});

const STATUSES: LeadStatus[] = ["nouveau", "qualifie", "envoye", "accepte", "refuse", "expire"];

function ClientsPage() {
  const [active, setActive] = useState<LeadStatus | "tous">("tous");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    return LEADS.filter((l) => (active === "tous" ? true : l.status === active)).filter((l) =>
      q.trim() === "" ? true : (l.ref + l.client + l.ville + l.projet).toLowerCase().includes(q.toLowerCase())
    );
  }, [active, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { tous: LEADS.length };
    STATUSES.forEach((s) => (c[s] = LEADS.filter((l) => l.status === s).length));
    return c;
  }, []);

  return (
    <AdminShell
      title="Demandes clients"
      subtitle="Suivez le parcours de chaque demande, du formulaire à l'acceptation artisan."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-brand-orange/40">
          <Download className="h-3.5 w-3.5" /> Exporter CSV
        </button>
      }
    >
      {/* Status pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(["tous", ...STATUSES] as const).map((s) => {
          const isActive = active === s;
          const label = s === "tous" ? "Tous" : STATUS_LABEL[s];
          return (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                isActive
                  ? "border-brand-orange bg-brand-orange text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-brand-orange/40"
              }`}
            >
              {label}
              <span className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${isActive ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:max-w-sm">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (réf., client, ville, projet)…"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
          <Filter className="h-3.5 w-3.5" /> Ville
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
          <Filter className="h-3.5 w-3.5" /> Type
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
          <Filter className="h-3.5 w-3.5" /> Date
        </button>
      </div>

      {/* Table */}
      <Panel className="mt-4 overflow-hidden" >
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Projet</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Budget estimé</th>
                <th className="px-4 py-3 font-medium">Artisan</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Reçu</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{l.ref}</td>
                  <td className="px-4 py-3 text-foreground">{l.client}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.projet} · {l.surface} m² · {l.photos} photos</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.ville}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.budget}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.artisan ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[l.status]}`}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{l.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Voir" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-brand-orange/40 hover:text-brand-orange">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button title="Assigner un artisan" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-brand-orange/40 hover:text-brand-orange">
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Aucune demande pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered.length} demande{filtered.length > 1 ? "s" : ""} · Cliquez sur une ligne pour ouvrir le détail (photos, PDF, historique, notes internes).
      </p>
    </AdminShell>
  );
}
