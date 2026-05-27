import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  Calendar,
  Star,
  Crown,
  Clock,
  Ban,
  UserCheck,
  Tag,
  HelpCircle,
} from "lucide-react";
import { PRICING } from "@/config/pricing";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs Parqueto — Abonnement artisan & leads exclusifs" },
      {
        name: "description",
        content:
          "14 jours d'essai gratuit, abonnement 59€ HT/mois (ou 49€ en annuel) et leads exclusifs à 49€, 89€ ou 189€ HT selon la taille du projet. Sans enchères, sans doublons.",
      },
      { property: "og:title", content: "Tarifs Parqueto — Abonnement & leads" },
      {
        property: "og:description",
        content:
          "Une formule claire pour les artisans parqueteurs : abonnement simple + leads exclusifs facturés à l'unité selon le budget client.",
      },
    ],
  }),
  component: TarifsPage,
});

type Billing = "monthly" | "yearly";

const LEAD_TIERS = [
  {
    key: "standard" as const,
    ...PRICING.leadCategories.standard,
    icon: Star,
    ring: "ring-emerald-500/30",
    badge: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-700",
    band: "bg-emerald-600",
    rangeLabel: "< 3 000 €",
  },
  {
    key: "qualified" as const,
    ...PRICING.leadCategories.qualified,
    icon: ShieldCheck,
    ring: "ring-orange-500/40",
    badge: "bg-orange-100 text-orange-700",
    accent: "text-orange-700",
    band: "bg-orange-500",
    rangeLabel: "3 000 € – 8 000 €",
    highlight: true,
  },
  {
    key: "premium" as const,
    ...PRICING.leadCategories.premium,
    icon: Crown,
    ring: "ring-purple-500/30",
    badge: "bg-purple-100 text-purple-700",
    accent: "text-purple-700",
    band: "bg-purple-600",
    rangeLabel: "> 8 000 €",
  },
];

function TarifsPage() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const sub =
    billing === "yearly"
      ? PRICING.subscription.yearly
      : PRICING.subscription.monthly;

  const monthlyPrice =
    billing === "yearly"
      ? PRICING.subscription.yearly.priceHtPerMonth
      : PRICING.subscription.monthly.priceHt;

  return (
    <div className="min-h-screen bg-brand-cream/40">
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
            <Sparkles className="h-3.5 w-3.5" /> Tarification artisan
          </span>
          <h1 className="mt-4 font-serif text-4xl text-brand-ink sm:text-5xl">
            Un abonnement clair,
            <br className="hidden sm:block" /> des leads exclusifs à l'unité
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {PRICING.trialDays} jours d'essai gratuit. Aucune enchère, aucun
            doublon : un seul artisan reçoit le lead à la fois.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Sans engagement
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Résiliable en 1 clic
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" /> Paiement sécurisé Stripe
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {/* ===== Abonnement ===== */}
        <section className="mb-20">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
              1 — Abonnement Pro
            </span>
            <h2 className="font-serif text-3xl text-brand-ink">
              Accédez à votre espace artisan
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              L'abonnement débloque votre profil, la réception illimitée de
              propositions qualifiées, les statistiques et le support.
            </p>

            {/* Billing toggle */}
            <div className="mt-2 inline-flex items-center rounded-full border border-border bg-background p-1 text-sm shadow-sm">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-1.5 font-medium transition ${
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
                className={`inline-flex items-center gap-2 rounded-full px-5 py-1.5 font-medium transition ${
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
                  {PRICING.subscription.yearly.discountLabel}
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
              {/* Pricing */}
              <div className="border-b border-border p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                  <Calendar className="h-3.5 w-3.5" />
                  Facturation {billing === "yearly" ? "annuelle" : "mensuelle"}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-5xl text-brand-ink">
                    {monthlyPrice}€
                  </span>
                  <span className="text-muted-foreground">/ mois HT</span>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  {billing === "yearly" ? (
                    <>
                      Soit{" "}
                      <strong className="text-foreground">
                        {PRICING.subscription.yearly.totalHtPerYear}€ HT / an
                      </strong>{" "}
                      facturé en une fois ·{" "}
                      <span className="font-semibold text-emerald-700">
                        Économisez {PRICING.subscription.yearly.savingHtPerYear}€ / an
                      </span>
                    </>
                  ) : (
                    <>
                      Sans engagement · résiliable en 1 clic ·{" "}
                      <span className="font-semibold text-foreground">
                        {PRICING.subscription.monthly.priceHt * 12}€ HT / an
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {PRICING.trialDays} jours d'essai gratuit
                </div>

                <div className="mt-6">
                  <Link
                    to="/devenir-artisan/inscription"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-orange-deep"
                  >
                    <CreditCard className="h-4 w-4" />
                    Démarrer mes {PRICING.trialDays} jours gratuits
                  </Link>
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
                    "Portail Stripe self-service (factures, RIB)",
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
          </div>
        </section>

        {/* ===== Leads à l'unité ===== */}
        <section className="mb-20">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
              2 — Leads exclusifs à l'unité
            </span>
            <h2 className="mt-3 font-serif text-3xl text-brand-ink">
              Vous choisissez chaque projet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Le prix dépend du budget client annoncé. Un seul artisan reçoit
              le lead à la fois. Pas d'enchères. Pas de doublons.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {LEAD_TIERS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.key}
                  className={`relative flex flex-col overflow-hidden rounded-3xl border-2 bg-background transition ${
                    t.highlight
                      ? "border-brand-orange shadow-warm sm:scale-[1.02]"
                      : "border-border"
                  }`}
                >
                  {t.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                        <Sparkles className="h-3 w-3" /> Le plus fréquent
                      </span>
                    </div>
                  )}

                  <div className="p-6 pb-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${t.badge}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {t.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {t.description}
                      </span>
                    </div>

                    <div className="mt-5 flex items-baseline gap-2">
                      <span className="font-serif text-4xl text-brand-ink">
                        {t.leadPriceHt}€
                      </span>
                      <span className="text-sm text-muted-foreground">HT / lead</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Devis estimatif {t.rangeLabel}
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        Lead 100% exclusif (un seul artisan)
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        Délai de réponse : {t.responseDelayHours}h
                      </li>
                      {"extraTimeAllowed" in t && t.extraTimeAllowed ? (
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                          +{t.extraTimeHours}h supplémentaires possibles (1 fois)
                        </li>
                      ) : null}
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        Coordonnées client complètes
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        Remboursé si client injoignable sous 5 j
                      </li>
                    </ul>
                  </div>

                  <div className={`mt-auto px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white ${t.band}`}>
                    Devis estimatif {t.rangeLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: UserCheck, t: "1 lead = 1 artisan", d: "Aucun doublon, jamais." },
              { icon: Ban, t: "Pas d'enchères", d: "Personne ne paie pour passer devant." },
              { icon: Tag, t: "Prix calculé auto", d: "Selon le budget client annoncé." },
            ].map((b) => (
              <div
                key={b.t}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <b.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{b.t}</div>
                  <div className="text-xs text-muted-foreground">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Règles ===== */}
        <section className="mb-20 rounded-3xl border border-border bg-background p-8">
          <h2 className="font-serif text-2xl text-brand-ink">
            Règles d'attribution des leads
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Transparentes, identiques pour tous les artisans.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Chaque lead est exclusif par défaut : un seul artisan le reçoit.",
              "Aucun artisan ne peut payer plus pour passer devant un autre.",
              "Un artisan qui refuse ou laisse expirer un lead ne le revoit jamais.",
              "Délais : 6h (Standard) · 12h (Qualifié) · 24h (Premium).",
              "Premium uniquement : possibilité de demander +24h, une seule fois.",
              "Remboursement automatique si le client est injoignable sous 5 jours.",
            ].map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 rounded-2xl bg-brand-cream/40 p-4 text-sm text-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Trust ===== */}
        <section className="mb-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              t: "Remboursement garanti",
              d: "Client injoignable sous 5 jours = lead remboursé automatiquement.",
            },
            {
              icon: Lock,
              t: "Paiement sécurisé",
              d: "Stripe certifié PCI-DSS. Vos données bancaires ne transitent jamais par Parqueto.",
            },
            {
              icon: HelpCircle,
              t: "Support dédié",
              d: "Une équipe française vous répond sous 24h ouvrées par email.",
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

        {/* CTA final */}
        <section className="rounded-3xl bg-brand-ink p-10 text-center text-background">
          <h2 className="font-serif text-3xl">Prêt à recevoir vos premiers chantiers ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-background/80">
            {PRICING.trialDays} jours d'essai gratuit. Aucun engagement. Vous ne
            payez les leads qu'à partir du moment où vous décidez de les accepter.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/devenir-artisan/inscription"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-orange-deep"
            >
              Démarrer l'essai gratuit
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-background/30 px-6 text-sm font-semibold text-background transition hover:bg-background/10"
            >
              Parler à l'équipe
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
