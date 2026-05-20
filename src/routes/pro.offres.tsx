import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Info,
  ArrowRight,
  Star,
  Lock,
  RefreshCcw,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/pro/offres")({
  component: ProOffres,
  head: () => ({
    meta: [
      { title: "Formules artisans & crédits projet — Parqueto" },
      {
        name: "description",
        content:
          "Un modèle simple : un abonnement léger pour la visibilité, des crédits projet rechargeables pour les leads. Sans engagement, sans piège.",
      },
    ],
  }),
});

type Plan = {
  key: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
};

const plans: Plan[] = [
  {
    key: "decouverte",
    name: "Découverte",
    price: "0 €",
    period: "/ pour démarrer",
    tagline: "Créez votre profil et testez la plateforme à votre rythme.",
    cta: "Commencer gratuitement",
    features: [
      { label: "Profil artisan public", included: true },
      { label: "3 projets offerts pour découvrir", included: true },
      { label: "Visibilité standard dans votre zone", included: true },
      { label: "Notifications nouveaux projets", included: false },
      { label: "Badge artisan vérifié", included: false },
      { label: "Statistiques de performance", included: false },
    ],
  },
  {
    key: "essentiel",
    name: "Essentiel",
    price: "29 €",
    period: "/ mois",
    tagline: "Pour les artisans qui veulent un flux régulier de projets locaux.",
    cta: "Choisir Essentiel",
    highlight: true,
    features: [
      { label: "Tout Découverte, plus :", included: true },
      { label: "5 crédits projet inclus chaque mois", included: true },
      { label: "Visibilité prioritaire dans votre zone", included: true },
      { label: "Badge artisan vérifié", included: true },
      { label: "Notifications instantanées nouveaux projets", included: true },
      { label: "Statistiques de performance", included: false },
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "à partir de 79 €",
    period: "/ mois",
    tagline: "Pour structurer votre activité avec des projets prioritaires.",
    cta: "Choisir Premium",
    features: [
      { label: "Tout Essentiel, plus :", included: true },
      { label: "12 crédits projet inclus chaque mois", included: true },
      { label: "Leads prioritaires sur votre zone réservée", included: true },
      { label: "Visibilité renforcée (mise en avant home)", included: true },
      { label: "Statistiques détaillées (taux de signature, ROI)", included: true },
      { label: "Accès anticipé aux nouveaux outils Pro", included: true },
    ],
  },
];

const creditPacks = [
  { credits: 3, price: "39 €", unit: "13 € / crédit", note: "Pour démarrer en douceur" },
  { credits: 10, price: "110 €", unit: "11 € / crédit", note: "Le plus choisi", best: true },
  { credits: 25, price: "245 €", unit: "9,80 € / crédit", note: "Pour un volume régulier" },
];

function ProOffres() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-brand-cream to-background py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
            <Sparkles className="h-3.5 w-3.5" /> Espace Pro
          </span>
          <h1 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Un modèle simple, transparent,
            <span className="block text-brand-orange-deep">pensé pour les artisans.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Un abonnement léger pour la visibilité, des crédits projet rechargeables quand vous
            voulez accepter un chantier. Pas d'engagement, pas d'enchères, pas de surprise.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-background p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billing === "monthly" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                billing === "yearly" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              Annuel <span className="ml-1 text-xs text-brand-orange">-2 mois</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.key}
                className={`relative flex flex-col rounded-3xl border p-8 shadow-soft transition ${
                  p.highlight
                    ? "border-brand-orange bg-card shadow-warm ring-2 ring-brand-orange/20"
                    : "border-border bg-card"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="h-3 w-3" /> Le plus choisi
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl">{p.price}</span>
                    <span className="text-sm text-muted-foreground">{p.period}</span>
                  </div>
                  {billing === "yearly" && p.price !== "0 €" && (
                    <p className="mt-1 text-xs text-brand-orange-deep">
                      Soit 2 mois offerts payés à l'année
                    </p>
                  )}
                </div>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-3">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <span className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground">—</span>
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                    p.highlight
                      ? "bg-brand-orange text-primary-foreground shadow-warm hover:-translate-y-0.5 hover:bg-brand-orange-deep"
                      : "border border-border bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Tous les plans sont sans engagement · résiliable à tout moment · TVA non incluse
          </p>
        </div>
      </section>

      {/* Crédits projet */}
      <section className="border-b border-border/60 bg-brand-cream/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                Crédits projet
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                Vous ne payez que les projets que vous acceptez.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Chaque projet a un coût en crédits selon son ampleur. Vous décidez lequel vous
                intéresse, vous débloquez les coordonnées, vous contactez le client en direct.
                Aucun crédit consommé tant que vous n'avez pas accepté.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 font-serif text-brand-orange-deep">
                    1
                  </span>
                  Petit chantier (réparation, conseil, &lt; 20 m²)
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 font-serif text-brand-orange-deep">
                    2
                  </span>
                  Projet moyen (rénovation 20–60 m²)
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange/10 font-serif text-brand-orange-deep">
                    3
                  </span>
                  Grand chantier (pose neuve, &gt; 60 m², commerces)
                </li>
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {creditPacks.map((c) => (
                <div
                  key={c.credits}
                  className={`relative rounded-2xl border bg-background p-6 shadow-soft transition ${
                    c.best ? "border-brand-orange ring-2 ring-brand-orange/20" : "border-border"
                  }`}
                >
                  {c.best && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                  <CreditCard className="h-5 w-5 text-brand-orange" />
                  <p className="mt-3 font-serif text-3xl">{c.credits}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    crédits projet
                  </p>
                  <p className="mt-4 text-lg font-semibold">{c.price}</p>
                  <p className="text-xs text-muted-foreground">{c.unit}</p>
                  <p className="mt-3 text-xs text-foreground/70">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
            <p>
              Les crédits inclus dans votre abonnement se cumulent avec vos recharges et n'expirent
              pas tant que votre abonnement est actif.
            </p>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Nos garanties</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Si quelque chose ne va pas avec un projet, votre crédit revient automatiquement sur
            votre compte. Pas de formulaire labyrinthique, pas de service client à harceler.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Lock, t: "Lead exclusif", d: "Un projet, un seul artisan partenaire." },
              { i: RefreshCcw, t: "Injoignable = remboursé", d: "Pas de contact sous 5 jours ouvrés." },
              { i: MapPin, t: "Hors zone = remboursé", d: "Adresse finale hors rayon ? Crédit rendu." },
              { i: ShieldCheck, t: "Sans engagement", d: "Pause ou résiliation en un clic." },
            ].map((g) => (
              <div key={g.t} className="rounded-2xl border border-border bg-card p-6">
                <g.i className="h-5 w-5 text-brand-orange" />
                <p className="mt-3 font-semibold">{g.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ courte */}
      <section className="border-b border-border/60 bg-brand-cream/30 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl tracking-tight">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: "Y a-t-il une commission sur les chantiers signés ?",
                r: "Non. Vous facturez votre client en direct, Parqueto ne prend aucune commission sur vos devis.",
              },
              {
                q: "Que se passe-t-il si je n'accepte aucun projet un mois ?",
                r: "Rien. Vos crédits inclus sont reportés tant que votre abonnement est actif. Vous pouvez aussi mettre en pause votre compte.",
              },
              {
                q: "Puis-je changer de formule à tout moment ?",
                r: "Oui, à tout moment, à la hausse comme à la baisse. Le prorata est calculé automatiquement.",
              },
              {
                q: "Comment êtes-vous sûrs que les leads sont sérieux ?",
                r: "Chaque demande passe par notre estimateur (surface, type, contraintes) et est revue manuellement avant transmission.",
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-background p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold">
                  <span className="flex items-center justify-between">
                    {f.q}
                    <span className="text-brand-orange transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-background to-brand-cream py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Prêt à recevoir vos premiers projets ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Inscription gratuite, 3 projets offerts pour découvrir. Aucune carte demandée à l'entrée.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Créer mon profil <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
