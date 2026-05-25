import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  Receipt,
  TrendingUp,
  Info,
  Zap,
  Calendar,
  Tag,
} from "lucide-react";
import { PqButton, PqSurface, PqPill } from "@/components/parqueto";

export const Route = createFileRoute("/pro/offres")({
  component: OffresPage,
});

type Billing = "monthly" | "yearly";

const SUBSCRIPTION = {
  monthly: { price: 59, period: "mois", total: 708, label: "59€ / mois" },
  yearly: { price: 49, period: "mois", total: 588, label: "588€ / an", save: "Économisez 120€ (-17%)" },
};

type LeadTier = {
  id: "standard" | "qualifie" | "premium";
  name: string;
  price: number;
  range: string;
  highlight?: boolean;
};

const LEAD_TIERS: LeadTier[] = [
  { id: "standard", name: "Standard", price: 49, range: "Projet < 3 000 €" },
  { id: "qualifie", name: "Qualifié", price: 89, range: "Projet 3 000 – 8 000 €", highlight: true },
  { id: "premium", name: "Premium", price: 189, range: "Projet > 8 000 €" },
];

const HISTORY = [
  { date: "12 mai 2026", label: "Abonnement Pro · mensuel", amount: 59, status: "Payé" },
  { date: "28 avr. 2026", label: "Lead Qualifié · PRJ-3F92AB12", amount: 89, status: "Payé" },
  { date: "02 avr. 2026", label: "Essai gratuit · 14 jours", amount: 0, status: "Offert" },
];

function OffresPage() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const [loading, setLoading] = useState(false);
  const sub = SUBSCRIPTION[billing];

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Redirection Stripe", {
        description: `Abonnement ${billing === "yearly" ? "annuel" : "mensuel"} · essai 14 jours offert`,
      });
    }, 700);
  };

  const handleBuyLead = (tier: LeadTier) => {
    toast.info(`Lead ${tier.name} — ${tier.price}€ TTC`, {
      description: "L'achat à l'unité se fait depuis la fiche d'un projet proposé.",
    });
  };

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à mon espace
          </Link>
          <PqPill tone="success">
            <ShieldCheck className="h-3 w-3" /> Essai 14 jours offert
          </PqPill>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <PqPill tone="orange" className="mx-auto mb-4">
            <Sparkles className="h-3 w-3" /> Tarification Parqueto
          </PqPill>
          <h1 className="font-serif text-3xl text-brand-ink sm:text-4xl">
            Un abonnement clair, des leads à la carte
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            L'abonnement débloque votre espace pro, l'accès aux projets qualifiés et au support.
            Vous ne payez ensuite que les leads que vous décidez d'acheter.
          </p>
        </div>

        {/* ===== Abonnement ===== */}
        <section className="mb-14">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-brand-ink">1. Abonnement Pro</h2>
              <p className="text-sm text-muted-foreground">
                Accès illimité à votre espace, propositions de projets, statistiques.
              </p>
            </div>

            {/* Billing toggle */}
            <div className="inline-flex items-center rounded-full border border-border bg-background p-1 text-sm">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  billing === "monthly"
                    ? "bg-brand-ink text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensuel
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition ${
                  billing === "yearly"
                    ? "bg-brand-ink text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annuel
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    billing === "yearly"
                      ? "bg-brand-orange text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  -17%
                </span>
              </button>
            </div>
          </div>

          <PqSurface className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
              {/* Pricing */}
              <div className="border-b border-border p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                  <Calendar className="h-3.5 w-3.5" />
                  Facturation {billing === "yearly" ? "annuelle" : "mensuelle"}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-5xl text-brand-ink">{sub.price}€</span>
                  <span className="text-muted-foreground">/ {sub.period} TTC</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {billing === "yearly" ? (
                    <>
                      Soit <strong className="text-foreground">{sub.total}€ / an</strong> facturé en
                      une fois ·{" "}
                      <span className="font-semibold text-emerald-700">{SUBSCRIPTION.yearly.save}</span>
                    </>
                  ) : (
                    <>
                      Sans engagement · résiliable en 1 clic ·{" "}
                      <span className="font-semibold text-foreground">{sub.total}€ / an</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <PqButton
                    size="lg"
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    <CreditCard className="h-4 w-4" />
                    {loading ? "Redirection..." : "Démarrer mes 14 jours gratuits"}
                  </PqButton>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aucun prélèvement pendant l'essai. Annulation libre avant la fin.
                  </p>
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-brand-cream/40 p-8">
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
        </section>

        {/* ===== Paiement à l'unité ===== */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-brand-ink">2. Paiement des leads à l'unité</h2>
            <p className="text-sm text-muted-foreground">
              Vous choisissez chaque projet. Le prix dépend du budget client. Aucun engagement.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {LEAD_TIERS.map((t) => (
              <div
                key={t.id}
                className={`relative flex flex-col rounded-3xl border-2 p-6 text-left transition ${
                  t.highlight
                    ? "border-brand-orange bg-background shadow-warm sm:scale-[1.02]"
                    : "border-border bg-background"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <PqPill tone="orange">
                      <Sparkles className="h-3 w-3" /> Le plus fréquent
                    </PqPill>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Tag
                    className={`h-5 w-5 ${
                      t.highlight ? "text-brand-orange" : "text-muted-foreground"
                    }`}
                  />
                  <span className="font-serif text-2xl text-brand-ink">Lead {t.name}</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-brand-ink">{t.price}€</span>
                  <span className="text-sm text-muted-foreground">TTC / projet</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{t.range}</div>

                <ul className="mt-5 space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Coordonnées client complètes
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Lead 100% exclusif
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Remboursé si client injoignable sous 5 j
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => handleBuyLead(t)}
                  className={`mt-6 inline-flex h-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                    t.highlight
                      ? "bg-brand-orange text-white hover:bg-brand-orange-deep"
                      : "bg-muted text-foreground hover:bg-brand-orange/10"
                  }`}
                >
                  En savoir plus
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-cream/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <span>
              L'achat d'un lead se déclenche depuis la fiche d'un projet qui vous est proposé.
              Le prix est calculé automatiquement selon le budget client annoncé.
            </span>
          </div>
        </section>

        {/* History */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-brand-ink">Historique de facturation</h2>
            <span className="text-xs text-muted-foreground">3 transactions</span>
          </div>
          <PqSurface className="divide-y divide-border overflow-hidden p-0">
            {HISTORY.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{h.label}</div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-serif text-lg text-brand-ink">
                    {h.amount === 0 ? "—" : `${h.amount}€`}
                  </span>
                  <PqPill tone={h.amount === 0 ? "neutral" : "success"}>
                    {h.status}
                  </PqPill>
                </div>
              </div>
            ))}
          </PqSurface>
        </section>

        {/* Trust */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              t: "Remboursement garanti",
              d: "Client injoignable sous 5 jours = lead remboursé automatiquement.",
            },
            {
              icon: TrendingUp,
              t: "ROI moyen ×8",
              d: "Nos artisans signent en moyenne 1 chantier sur 4 projets reçus.",
            },
            {
              icon: Lock,
              t: "Paiement sécurisé",
              d: "Stripe certifié PCI-DSS. Vos données bancaires ne transitent jamais par Parqueto.",
            },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <b.icon className="h-5 w-5 text-brand-orange" />
              <div className="mt-3 font-semibold text-foreground">{b.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{b.d}</div>
            </div>
          ))}
        </section>

        {/* Receipt note */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
