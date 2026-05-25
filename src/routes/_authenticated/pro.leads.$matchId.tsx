import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Ruler,
  TreePine,
  Paintbrush,
  CalendarDays,
  Clock,
  Euro,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { PqButton, PqSurface, PqPill } from "@/components/parqueto";

export const Route = createFileRoute("/_authenticated/pro/leads/$matchId")({
  component: LeadDetailPage,
  head: () => ({
    meta: [
      { title: "Détail du projet — Parqueto Pro" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

// ─── MOCK : à remplacer par server fn quand Codex branche Stripe + DB ───
const MOCK_LEAD = {
  match_id: "m-2486",
  status: "pending" as "pending" | "accepted" | "declined" | "refunded" | "expired",
  proposed_at: "2026-05-25T10:00:00Z",
  expires_at: "2026-05-29T23:59:59Z",
  match_score: 92,
  purchased: false,
  project: {
    id: "p-2486",
    reference: "PJ-002486",
    client_name: "C. R.",
    client_email: null as string | null,
    client_phone: null as string | null,
    ville: "Lyon 6e",
    code_postal: "69006",
    surface_m2: 42,
    type_pose: "Ponçage",
    type_bois: "Massif",
    etat_sol: "État moyen",
    budget_min: 2100,
    budget_max: 2800,
    delai_souhaite: "Sous 4 semaines",
    description: "Salon et couloir, parquet d'origine 1930. Vitrification mate souhaitée.",
    created_at: "2026-05-25T10:00:00Z",
  },
};

function getLeadPrice(budgetMax: number): { tier: string; price: number } {
  if (budgetMax < 3000) return { tier: "Standard", price: 49 };
  if (budgetMax <= 8000) return { tier: "Qualifié", price: 89 };
  return { tier: "Premium", price: 189 };
}

function LeadDetailPage() {
  const { matchId } = Route.useParams();
  const [lead, setLead] = useState(MOCK_LEAD);
  const [loading, setLoading] = useState(false);
  const [showCoords, setShowCoords] = useState(false);

  const pricing = getLeadPrice(lead.project.budget_max);
  const isAccepted = lead.status === "accepted";
  const isPurchased = lead.purchased || isAccepted;
  const canBuy = lead.status === "pending" && !isPurchased;

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(lead.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const handleBuy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLead((l) => ({ ...l, purchased: true, status: "accepted" as const }));
      toast.success("Lead acheté", {
        description: `${pricing.price}€ TTC — coordonnées client débloquées.`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Projets reçus
          </Link>
          <div className="flex items-center gap-2">
            {lead.match_score >= 90 && (
              <PqPill tone="orange">
                <Sparkles className="h-3 w-3" /> Match {lead.match_score}%
              </PqPill>
            )}
            <PqPill tone={isPurchased ? "success" : "neutral"}>
              {isPurchased ? "Acquis" : "À l'étude"}
            </PqPill>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Project ref + expiry */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Référence projet
            </div>
            <div className="mt-1 font-serif text-2xl text-brand-ink">
              {lead.project.reference}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm">
            <Clock className="h-4 w-4 text-brand-orange" />
            <span className={daysLeft <= 1 ? "text-red-600 font-semibold" : ""}>
              {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Client card (masked until purchased) */}
        <PqSurface className="mb-6 overflow-hidden p-0">
          <div className={`p-6 sm:p-8 ${!isPurchased ? "relative" : ""}`}>
            {!isPurchased && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                <Lock className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-muted-foreground">
                  Coordonnées masquées — achetez ce lead pour les révéler
                </p>
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl text-brand-ink">
                  {isPurchased ? lead.project.client_name : "Client masqué"}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lead.project.ville} · {lead.project.code_postal}
                </div>
              </div>
              {isPurchased && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${lead.project.client_phone ?? ""}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-orange-deep"
                  >
                    <Phone className="h-4 w-4" />
                    Appeler
                  </a>
                  <a
                    href={`mailto:${lead.project.client_email ?? ""}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                  >
                    <Mail className="h-4 w-4" />
                    E-mail
                  </a>
                  <Link
                    to="/pro/messages"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Link>
                </div>
              )}
            </div>

            {isPurchased && lead.project.client_email && lead.project.client_phone && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <Mail className="h-5 w-5 text-brand-orange" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">{lead.project.client_email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <div>
                    <div className="text-xs text-muted-foreground">Téléphone</div>
                    <div className="text-sm font-medium">{lead.project.client_phone}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PqSurface>

        {/* Project details */}
        <PqSurface className="mb-6 p-6 sm:p-8">
          <h3 className="font-serif text-lg text-brand-ink">Détails du projet</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem icon={<Ruler className="h-5 w-5" />} label="Surface" value={`${lead.project.surface_m2} m²`} />
            <DetailItem icon={<TreePine className="h-5 w-5" />} label="Type de bois" value={lead.project.type_bois} />
            <DetailItem icon={<Paintbrush className="h-5 w-5" />} label="Prestation" value={lead.project.type_pose} />
            <DetailItem icon={<MapPin className="h-5 w-5" />} label="État du sol" value={lead.project.etat_sol} />
            <DetailItem icon={<CalendarDays className="h-5 w-5" />} label="Délai souhaité" value={lead.project.delai_souhaite ?? "—"} />
            <DetailItem
              icon={<Euro className="h-5 w-5" />}
              label="Budget estimé"
              value={`${lead.project.budget_min.toLocaleString("fr-FR")} – ${lead.project.budget_max.toLocaleString("fr-FR")} €`}
            />
          </div>
          {lead.project.description && (
            <div className="mt-4 rounded-2xl border border-border bg-brand-cream/30 p-4">
              <p className="text-sm leading-relaxed text-foreground">
                {lead.project.description}
              </p>
            </div>
          )}
        </PqSurface>

        {/* Purchase CTA */}
        {canBuy && (
          <PqSurface className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
              <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                  <CreditCard className="h-3.5 w-3.5" />
                  Achat à l'unité
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-5xl text-brand-ink">{pricing.price}€</span>
                  <span className="text-muted-foreground">TTC</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Lead <strong className="text-foreground">{pricing.tier}</strong> · projet {" "}
                  <strong className="text-foreground">{pricing.tier === "Standard" ? "< 3 000 €" : pricing.tier === "Qualifié" ? "3 000 – 8 000 €" : "> 8 000 €"}</strong>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Coordonnées client complètes (email + téléphone)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Lead 100% exclusif — jamais revendu
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Remboursé si client injoignable sous 5 jours
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                <PqButton size="lg" onClick={handleBuy} disabled={loading} className="w-full">
                  <CreditCard className="h-4 w-4" />
                  {loading ? "Redirection Stripe…" : `Acheter ce lead — ${pricing.price}€`}
                </PqButton>
                <button
                  type="button"
                  onClick={() => toast.info("Projet décliné")}
                  className="text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  Décliner ce projet
                </button>
              </div>
            </div>
          </PqSurface>
        )}

        {/* Post-purchase reassurance */}
        {isPurchased && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Lead acquis — coordonnées débloquées
                </p>
                <p className="text-xs text-emerald-700">
                  Vous avez 5 jours pour contacter le client. Si injoignable, le lead est remboursé automatiquement.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
      <span className="text-brand-orange">{icon}</span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
