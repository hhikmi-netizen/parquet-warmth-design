import { Link } from "@tanstack/react-router";
import { FileText, MessageSquare, CalendarDays, Calculator, Inbox, ArrowRight } from "lucide-react";

const ACTIONS = [
  { id: "devis", label: "Générer un devis", icon: FileText, to: "/devis" as const, tone: "primary" as const },
  { id: "messages", label: "Messagerie clients", icon: MessageSquare, to: "/pro/messages" as const, badge: 3 },
  { id: "agenda", label: "Mon calendrier", icon: CalendarDays, to: "/pro/calendrier" as const },
  { id: "estim", label: "Estimation rapide", icon: Calculator, to: "/estimation" as const },
  { id: "leads", label: "Voir projets reçus", icon: Inbox, to: "/pro" as const },
];

export function QuickActions() {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg">Accès rapide</h2>
          <p className="text-xs text-muted-foreground">Les actions du quotidien, à portée de clic.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const primary = a.tone === "primary";
          return (
            <Link
              key={a.id}
              to={a.to}
              className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                primary
                  ? "border-brand-orange/40 bg-brand-orange/5 hover:bg-brand-orange/10"
                  : "border-border bg-background hover:border-brand-orange/40 hover:bg-brand-cream/30"
              }`}
            >
              <span
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${
                  primary ? "bg-brand-orange text-primary-foreground" : "bg-brand-cream text-brand-orange-deep"
                }`}
              >
                <Icon className="h-5 w-5" />
                {"badge" in a && a.badge ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-primary-foreground">
                    {a.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-sm font-semibold leading-tight">{a.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-orange-deep" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
