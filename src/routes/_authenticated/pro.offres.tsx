import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Coins,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  Receipt,
  TrendingUp,
  Info,
  Zap,
} from "lucide-react";
import { PqButton, PqSurface, PqPill } from "@/components/parqueto";

export const Route = createFileRoute("/pro/offres")({
  component: OffresPage,
});

type Pack = {
  id: string;
  credits: number;
  price: number;
  unit: number;
  badge?: string;
  highlight?: boolean;
  bonus?: string;
};

const PACKS: Pack[] = [
  { id: "starter", credits: 10, price: 49, unit: 4.9 },
  {
    id: "pro",
    credits: 50,
    price: 199,
    unit: 3.98,
    badge: "Le plus choisi",
    highlight: true,
    bonus: "+5 crédits offerts",
  },
  {
    id: "studio",
    credits: 150,
    price: 499,
    unit: 3.33,
    badge: "Meilleur tarif",
    bonus: "+20 crédits offerts",
  },
];

const HISTORY = [
  { date: "12 mai 2026", label: "Pack Pro · 50 crédits", amount: 199, status: "Payé" },
  { date: "28 avr. 2026", label: "Pack Starter · 10 crédits", amount: 49, status: "Payé" },
  { date: "02 avr. 2026", label: "Bienvenue · 3 crédits offerts", amount: 0, status: "Offert" },
];

function OffresPage() {
  const [selected, setSelected] = useState<string>("pro");
  const [loading, setLoading] = useState(false);
  const current = PACKS.find((p) => p.id === selected) ?? PACKS[1];

  const handleCheckout = () => {
    setLoading(true);
    // Mock — branchement Stripe à venir
    setTimeout(() => {
      setLoading(false);
      toast.success("Maquette UI — Stripe sera branché plus tard", {
        description: `Pack ${current.credits} crédits · ${current.price}€`,
      });
    }, 900);
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
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm">
            <Coins className="h-4 w-4 text-brand-orange" />
            <span className="font-semibold">8</span>
            <span className="text-muted-foreground">crédits restants</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <PqPill tone="orange" className="mx-auto mb-4">
            <Sparkles className="h-3 w-3" /> Recharger mes crédits
          </PqPill>
          <h1 className="font-serif text-3xl text-brand-ink sm:text-4xl">
            Choisissez votre pack
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            1 crédit = 1 projet client qualifié. Pas d'abonnement, pas
            d'engagement. Vos crédits ne périment jamais.
          </p>
        </div>

        {/* Packs */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PACKS.map((p) => {
            const isSel = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`group relative flex flex-col rounded-3xl border-2 p-6 text-left transition-all ${
                  isSel
                    ? "border-brand-orange bg-background shadow-warm"
                    : "border-border bg-background hover:border-brand-orange/40"
                } ${p.highlight ? "sm:scale-[1.03]" : ""}`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <PqPill tone={p.highlight ? "orange" : "neutral"}>
                      {p.highlight && <Sparkles className="h-3 w-3" />}
                      {p.badge}
                    </PqPill>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Coins
                    className={`h-5 w-5 ${
                      isSel ? "text-brand-orange" : "text-muted-foreground"
                    }`}
                  />
                  <span className="font-serif text-2xl text-brand-ink">
                    {p.credits} crédits
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-brand-ink">
                    {p.price}€
                  </span>
                  <span className="text-sm text-muted-foreground">TTC</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Soit {p.unit.toFixed(2).replace(".", ",")}€ / projet
                </div>

                {p.bonus && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Zap className="h-3 w-3" /> {p.bonus}
                  </div>
                )}

                <ul className="mt-5 space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Coordonnées client complètes
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Remboursement sous 5 jours si injoignable
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Crédits valables à vie
                  </li>
                </ul>

                <div className="mt-6">
                  <div
                    className={`flex h-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                      isSel
                        ? "bg-brand-orange text-white"
                        : "bg-muted text-foreground group-hover:bg-brand-orange/10"
                    }`}
                  >
                    {isSel ? "Sélectionné" : "Choisir"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Checkout */}
        <PqSurface className="mt-10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Récapitulatif</div>
              <div className="mt-1 font-serif text-2xl text-brand-ink">
                Pack {current.credits} crédits · {current.price}€
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Paiement sécurisé Stripe
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Facture envoyée par email
                </span>
                <span className="inline-flex items-center gap-1">
                  <Receipt className="h-3 w-3" /> TVA incluse
                </span>
              </div>
            </div>
            <PqButton
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <CreditCard className="h-4 w-4" />
              {loading ? "Redirection..." : `Payer ${current.price}€`}
            </PqButton>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-cream/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <span>
              Maquette UI — le paiement Stripe sera branché ultérieurement.
              Vos crédits seront ajoutés automatiquement après confirmation.
            </span>
          </div>
        </PqSurface>

        {/* History */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-brand-ink">
              Historique de facturation
            </h2>
            <span className="text-xs text-muted-foreground">3 transactions</span>
          </div>
          <PqSurface className="divide-y divide-border overflow-hidden p-0">
            {HISTORY.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">
                    {h.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-serif text-lg text-brand-ink">
                    {h.amount === 0 ? "—" : `${h.amount}€`}
                  </span>
                  <PqPill tone={h.amount === 0 ? "neutral" : "emerald"}>
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
              d: "Client injoignable sous 5 jours = crédit recrédité automatiquement.",
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
      </main>
    </div>
  );
}
