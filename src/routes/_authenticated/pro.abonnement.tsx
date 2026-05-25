import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  Lock,
  Receipt,
  ExternalLink,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { PqButton, PqSurface, PqPill } from "@/components/parqueto";

export const Route = createFileRoute("/_authenticated/pro/abonnement")({
  component: AbonnementPage,
  head: () => ({
    meta: [
      { title: "Mon abonnement — Parqueto Pro" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

// ─── MOCK : à remplacer par server fn quand Codex branche Stripe ───
type SubscriptionStatus = "trial" | "active" | "paused" | "cancelled" | "past_due";

const MOCK_SUBSCRIPTION = {
  status: "trial" as SubscriptionStatus,
  plan: "pro",
  billing: "yearly" as "monthly" | "yearly",
  price: 588,
  periodEnd: "2026-06-08T23:59:59Z", // 14 jours après aujourd'hui
  trialEnd: "2026-06-08T23:59:59Z",
  stripeCustomerId: "cus_mock_123",
  stripeSubscriptionId: "sub_mock_456",
  invoices: [
    { id: "inv_1", date: "25 mai 2026", amount: 0, status: "Offert" as const, label: "Essai 14 jours — Parqueto Pro" },
  ],
};

const PLAN_LABEL: Record<string, string> = {
  pro: "Parqueto Pro",
};

const STATUS_META: Record<
  SubscriptionStatus,
  { label: string; tone: "success" | "warning" | "neutral" | "danger" | "orange"; Icon: React.ComponentType<{ className?: string }> }
> = {
  trial: { label: "Essai en cours", tone: "orange", Icon: Sparkles },
  active: { label: "Abonnement actif", tone: "success", Icon: ShieldCheck },
  paused: { label: "Mise en pause", tone: "warning", Icon: PauseCircle },
  cancelled: { label: "Résilié", tone: "neutral", Icon: XCircle },
  past_due: { label: "Paiement en attente", tone: "danger", Icon: AlertTriangle },
};

function AbonnementPage() {
  const sub = MOCK_SUBSCRIPTION;
  const meta = STATUS_META[sub.status];
  const StatusIcon = meta.Icon;
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">(sub.billing);
  const [switchLoading, setSwitchLoading] = useState(false);

  const periodEndDate = new Date(sub.periodEnd);
  const trialEndDate = new Date(sub.trialEnd);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isTrial = sub.status === "trial";

  // Toasts retour Stripe Checkout / Portal (?checkout=success|canceled, ?portal=updated)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const portal = params.get("portal");
    if (checkout === "success") {
      toast.success("Abonnement activé 🎉", {
        description: "Votre essai 14 jours a démarré. Bienvenue sur Parqueto Pro.",
      });
    } else if (checkout === "canceled") {
      toast.info("Paiement annulé", {
        description: "Aucun prélèvement effectué. Vous pouvez réessayer quand vous voulez.",
      });
    }
    if (portal === "updated") {
      toast.success("Abonnement mis à jour", {
        description: "Vos changements ont bien été enregistrés.",
      });
    }
    if (checkout || portal) {
      params.delete("checkout");
      params.delete("portal");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
  }, []);

  const handleOpenPortal = () => {
    toast.info("Portail Stripe", {
      description: "Redirection vers le Customer Portal de Stripe en cours…",
    });
    // TODO: appeler createServerFn qui renvoie l'URL du Customer Portal
  };

  const handleResume = () => {
    toast.success("Abonnement réactivé");
  };

  const handlePause = () => {
    toast.info("Mise en pause", { description: "Votre abonnement sera suspendu à la fin de la période en cours." });
  };

  const handleSwitchPlan = () => {
    if (selectedBilling === sub.billing) return;
    setSwitchLoading(true);
    setTimeout(() => {
      setSwitchLoading(false);
      toast.success(
        `Bascule vers ${selectedBilling === "yearly" ? "annuel (-17%)" : "mensuel"}`,
        { description: "Redirection vers le portail Stripe pour confirmer le changement…" },
      );
      // TODO: appeler createServerFn (Customer Portal flow data avec subscription_update)
    }, 500);
  };

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Mon espace
          </Link>
          <PqPill tone={meta.tone}>
            <StatusIcon className="h-3 w-3" /> {meta.label}
          </PqPill>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-brand-ink sm:text-4xl">
            Mon abonnement
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Gérez votre formule, consultez vos factures et accédez au portail
            Stripe en self-service.
          </p>
        </div>

        {/* Status card */}
        <PqSurface className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: plan + price */}
            <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                <CreditCard className="h-3.5 w-3.5" />
                Formule {sub.billing === "yearly" ? "annuelle" : "mensuelle"}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-5xl text-brand-ink">
                  {sub.price}€
                </span>
                <span className="text-muted-foreground">
                  / {sub.billing === "yearly" ? "an" : "mois"} TTC
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {sub.billing === "yearly" ? (
                  <>
                    Économisez <strong className="text-foreground">120€ (-17%)</strong> par rapport au mensuel
                  </>
                ) : (
                  <>Sans engagement · résiliable en 1 clic</>
                )}
              </div>

              {isTrial && (
                <div className="mt-4 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                    <div>
                      <p className="text-sm font-semibold text-brand-orange-deep">
                        Essai gratuit — {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aucun prélèvement avant le{" "}
                        <strong className="text-foreground">
                          {trialEndDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </strong>
                        . Annulation libre à tout moment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <PqButton onClick={handleOpenPortal}>
                  <ExternalLink className="h-4 w-4" />
                  Portail Stripe
                </PqButton>
                {sub.status === "paused" ? (
                  <PqButton variant="secondary" onClick={handleResume}>
                    <PlayCircle className="h-4 w-4" />
                    Réactiver
                  </PqButton>
                ) : sub.status === "active" ? (
                  <PqButton variant="ghost" onClick={handlePause}>
                    <PauseCircle className="h-4 w-4" />
                    Mettre en pause
                  </PqButton>
                ) : null}
              </div>
            </div>

            {/* Right: inclusions */}
            <div className="bg-brand-cream/40 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inclus dans l'abonnement
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground">
                {[
                  "Espace pro complet (profil, photos, zone, dispos)",
                  "Réception illimitée de propositions qualifiées",
                  "Statistiques de performance & taux de signature",
                  "Portail Stripe en self-service (factures, RIB)",
                  "Support prioritaire par email",
                  "Mise en pause libre, sans engagement",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PqSurface>

        {/* ===== Grille Mensuel / Annuel — changer de formule ===== */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-brand-ink">Changer de formule</h2>
              <p className="text-sm text-muted-foreground">
                Passez à l'annuel pour économiser <strong className="text-foreground">120€ (-17%)</strong>, ou revenez au mensuel à tout moment.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {([
              {
                id: "monthly" as const,
                title: "Mensuel",
                price: 59,
                unit: "/ mois TTC",
                total: "708€ / an",
                perks: ["Sans engagement", "Résiliable en 1 clic", "Facturation chaque mois"],
              },
              {
                id: "yearly" as const,
                title: "Annuel",
                price: 49,
                unit: "/ mois TTC",
                total: "588€ facturés en une fois",
                perks: ["2 mois offerts (-17%)", "1 seule facture par an", "Idem mensuel, moins cher"],
                save: "-17%",
              },
            ]).map((plan) => {
              const isCurrent = plan.id === sub.billing;
              const isSelected = plan.id === selectedBilling;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedBilling(plan.id)}
                  className={`relative rounded-3xl border-2 p-6 text-left transition ${
                    isSelected
                      ? "border-brand-orange bg-background shadow-warm"
                      : "border-border bg-background hover:border-brand-orange/40"
                  }`}
                >
                  {plan.save && (
                    <div className="absolute -top-3 right-4">
                      <PqPill tone="orange">
                        <Sparkles className="h-3 w-3" /> {plan.save}
                      </PqPill>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-brand-ink">{plan.title}</span>
                    {isCurrent && (
                      <PqPill tone="success">
                        <Check className="h-3 w-3" /> Formule actuelle
                      </PqPill>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-brand-ink">{plan.price}€</span>
                    <span className="text-sm text-muted-foreground">{plan.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{plan.total}</div>
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {plan.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">
              {selectedBilling === sub.billing ? (
                <>Vous êtes déjà en formule <strong className="text-foreground">{selectedBilling === "yearly" ? "annuelle" : "mensuelle"}</strong>.</>
              ) : (
                <>Basculer en <strong className="text-foreground">{selectedBilling === "yearly" ? "annuel" : "mensuel"}</strong> prendra effet à la fin de la période en cours.</>
              )}
            </div>
            <PqButton
              onClick={handleSwitchPlan}
              disabled={selectedBilling === sub.billing || switchLoading}
            >
              <ArrowRight className="h-4 w-4" />
              {switchLoading ? "Redirection…" : "Confirmer la bascule"}
            </PqButton>
          </div>
        </section>

        {/* Leads pricing reminder */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-brand-ink">Prix des leads à l'unité</h2>
            <p className="text-sm text-muted-foreground">
              Votre abonnement débloque l'accès. Vous ne payez ensuite que les leads que vous choisissez d'acheter.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Standard", price: 49, range: "< 3 000 €", color: "border-border" },
              { name: "Qualifié", price: 89, range: "3 000 – 8 000 €", color: "border-brand-orange", highlight: true },
              { name: "Premium", price: 189, range: "> 8 000 €", color: "border-border" },
            ].map((t) => (
              <div
                key={t.name}
                className={`rounded-3xl border-2 ${t.color} bg-background p-5 ${t.highlight ? "shadow-warm" : ""}`}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lead {t.name}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-brand-ink">{t.price}€</span>
                  <span className="text-sm text-muted-foreground">TTC</span>
                </div>
                <div className="text-xs text-muted-foreground">{t.range}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-brand-ink">Historique de facturation</h2>
            <span className="text-xs text-muted-foreground">
              {sub.invoices.length} transaction{sub.invoices.length > 1 ? "s" : ""}
            </span>
          </div>
          <PqSurface className="divide-y divide-border overflow-hidden p-0">
            {sub.invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-4 p-4 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{inv.label}</div>
                  <div className="text-xs text-muted-foreground">{inv.date}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-serif text-lg text-brand-ink">
                    {inv.amount === 0 ? "—" : `${inv.amount}€`}
                  </span>
                  <PqPill tone={inv.amount === 0 ? "neutral" : "success"}>
                    {inv.status}
                  </PqPill>
                </div>
              </div>
            ))}
          </PqSurface>
        </section>

        {/* Trust */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Receipt className="h-3 w-3" /> Factures TTC envoyées par email
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3" /> Paiement sécurisé Stripe
          </span>
        </div>
      </main>
    </div>
  );
}
