import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Banknote, TrendingUp, Coins, Receipt } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard, Panel, Pill } from "@/components/admin/atoms";
import { FORMULES, RECHARGES, FACTURES, REVENUS } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/monetisation")({
  head: () => ({ meta: [{ title: "Monétisation — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MonetisationPage,
});

const FORECAST = [...REVENUS, { mois: "Janv.", revenu: 9900 }, { mois: "Févr.", revenu: 10800 }];

function MonetisationPage() {
  return (
    <AdminShell
      title="Monétisation"
      subtitle="MRR abonnements, ventes de leads et prévisions de revenus."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="MRR abonnements" value="6 320 €" trend={{ dir: "up", value: "+11 %" }} icon={Banknote} />
        <KpiCard label="Ventes de leads (30 j)" value="2 940 €" trend={{ dir: "up", value: "+7 %" }} icon={Coins} />
        <KpiCard label="Factures payées" value="142" icon={Receipt} />
        <KpiCard label="Prévision Févr." value="10 800 €" trend={{ dir: "up", value: "+18 %" }} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Revenus & prévisions" description="Historique 7 mois + 2 mois projetés (simulation).">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST} margin={{ top: 5, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v.toLocaleString("fr-FR")} €`, "Revenu"]}
                />
                <Line type="monotone" dataKey="revenu" stroke="var(--brand-orange)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--brand-orange)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Formules artisans" description="Répartition active.">
          <ul className="space-y-3">
            {FORMULES.map((f) => (
              <li key={f.nom} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${f.couleur}`}>{f.nom}</span>
                  <span className="font-medium text-foreground">{f.prix}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.credits}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{f.artisans} artisans abonnés</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Prix des leads" description="Tarif unitaire selon le budget client.">
          <ul className="space-y-2">
            {[
              { tier: "Lead Standard · < 3 000 €", prix: "49 € TTC" },
              { tier: "Lead Qualifié · 3 000 – 8 000 €", prix: "89 € TTC" },
              { tier: "Lead Premium · > 8 000 €", prix: "189 € TTC" },
            ].map((r) => (
              <li key={r.tier} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
                <span className="text-sm text-foreground">{r.tier}</span>
                <span className="font-medium text-foreground">{r.prix}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="lg:col-span-2" title="Factures récentes" description="Paiements simulés (aucune vraie transaction).">
          <div className="-mx-5 -my-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Facture</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Montant</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FACTURES.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{f.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.date}</td>
                    <td className="px-4 py-3 text-foreground">{f.client}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{f.montant}</td>
                    <td className="px-4 py-3">
                      <Pill tone={f.statut === "Payée" ? "success" : "danger"}>{f.statut}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
