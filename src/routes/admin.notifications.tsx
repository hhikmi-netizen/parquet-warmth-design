import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill } from "@/components/admin/atoms";
import { NOTIFICATIONS } from "@/lib/admin-mock";
import { ShieldCheck, Clock, User, Mail, CreditCard, FileWarning, Zap } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: NotificationsPage,
});

const ICONS: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  clock: Clock,
  user: User,
  mail: Mail,
  card: CreditCard,
  file: FileWarning,
  bolt: Zap,
};

function NotificationsPage() {
  return (
    <AdminShell
      title="Notifications & rappels"
      subtitle="Les signaux à traiter avant qu'ils ne deviennent des problèmes."
      actions={
        <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
          Tout marquer comme lu
        </button>
      }
    >
      <Panel>
        <ul className="divide-y divide-border">
          {NOTIFICATIONS.map((n) => {
            const Icon = ICONS[n.icon] ?? Clock;
            return (
              <li key={n.id} className="flex flex-wrap items-start gap-3 py-4 first:pt-0 last:pb-0">
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.urgence === "haute" ? "bg-rose-500/10 text-rose-600" : "bg-brand-orange/10 text-brand-orange"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{n.titre}</p>
                    <Pill tone={n.urgence === "haute" ? "danger" : "warning"}>
                      {n.urgence === "haute" ? "Urgent" : "À surveiller"}
                    </Pill>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.quand}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-brand-orange/40">
                    Reporter
                  </button>
                  <button className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-orange-deep">
                    Traiter
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </AdminShell>
  );
}
