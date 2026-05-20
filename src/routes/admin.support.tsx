import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill, KpiCard } from "@/components/admin/atoms";
import { TICKETS } from "@/lib/admin-mock";
import { LifeBuoy, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/support")({
  head: () => ({ meta: [{ title: "Support — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SupportPage,
});

const TONE: Record<string, "success" | "warning" | "danger" | "info"> = {
  Ouvert: "warning",
  "En cours": "info",
  "À traiter": "danger",
  Résolu: "success",
};
const PRIO_TONE: Record<string, "danger" | "warning" | "neutral"> = {
  Haute: "danger",
  Moyenne: "warning",
  Basse: "neutral",
};

function SupportPage() {
  return (
    <AdminShell
      title="Support technique"
      subtitle="Tickets clients & artisans, priorités et assignations."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-orange-deep">
          + Nouveau ticket
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Tickets ouverts" value="2" icon={LifeBuoy} />
        <KpiCard label="En cours" value="2" icon={Clock} />
        <KpiCard label="Résolus (30 j)" value="38" trend={{ dir: "up", value: "+12" }} icon={CheckCircle2} />
        <KpiCard label="Priorité haute" value="2" icon={AlertCircle} />
      </div>

      <Panel className="mt-6" title="File de tickets">
        <div className="-mx-5 -my-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Réf.</th>
                <th className="px-4 py-3 font-medium">Sujet</th>
                <th className="px-4 py-3 font-medium">Auteur</th>
                <th className="px-4 py-3 font-medium">Priorité</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Assignation</th>
                <th className="px-4 py-3 font-medium">Ouvert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TICKETS.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-foreground">{t.sujet}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.auteur}</td>
                  <td className="px-4 py-3"><Pill tone={PRIO_TONE[t.priorite]}>{t.priorite}</Pill></td>
                  <td className="px-4 py-3"><Pill tone={TONE[t.statut]}>{t.statut}</Pill></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.assignee}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminShell>
  );
}
