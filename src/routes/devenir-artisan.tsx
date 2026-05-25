import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  ShieldCheck,
  Sparkles,
  HandCoins,
  MapPin,
  Clock,
  CheckCircle2,
  Quote,
  ArrowRight,
  Users,
  Lock,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/devenir-artisan")({
  component: DevenirArtisan,
  head: () => ({
    meta: [
      { title: "Devenir artisan partenaire — Parqueto" },
      {
        name: "description",
        content:
          "Rejoignez un réseau d'artisans parqueteurs sélectionnés. Leads exclusifs, projets qualifiés, aucune guerre de devis. Modèle transparent et premium.",
      },
      { property: "og:title", content: "Devenir artisan partenaire — Parqueto" },
      {
        property: "og:description",
        content:
          "Des projets parquet déjà cadrés, des clients déjà informés. Pas d'enchères, pas de revente de leads.",
      },
      { property: "og:url", content: "/devenir-artisan" },
    ],

    links: [{ rel: "canonical", href: "/devenir-artisan" }],
  }),
});

function DevenirArtisan() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-brand-cream to-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
              <Sparkles className="h-3.5 w-3.5" /> Réseau d'artisans partenaires
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Des projets parquet déjà&nbsp;cadrés.
              <span className="block text-brand-orange-deep">Sans démarchage. Sans enchères.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Parqueto pré-qualifie chaque demande côté client&nbsp;: surface, type de pose,
              état du support, budget. Vous recevez des projets sérieux, exclusifs, dans votre
              zone d'intervention. Vous gardez la main sur votre planning et vos tarifs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/pro/offres"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
              >
                Découvrir les formules <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/devenir-artisan/inscription"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Créer mon profil artisan
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              3 premiers projets offerts · aucun engagement · aucune commission sur vos chantiers
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-warm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nouveau projet
                  </p>
                  <p className="mt-1 font-serif text-xl">Rénovation parquet massif</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Exclusif
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  <span className="text-muted-foreground">Lyon 6e — 4,2 km de votre atelier</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  <span className="text-muted-foreground">Démarrage souhaité : sous 4 semaines</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-muted-foreground">Surface : 42 m² · chêne 14 mm · ponçage + vitrification</span>
                </li>
                <li className="flex items-center gap-3">
                  <HandCoins className="h-4 w-4 text-brand-orange" />
                  <span className="text-muted-foreground">Budget estimé client : 2 100 € – 2 800 €</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/60 p-4">
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Lead Standard · 49 € TTC</p>
                  <p>Coordonnées débloquées après achat</p>
                </div>
                <button className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
                  Voir le projet
                </button>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-4 shadow-soft lg:block">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold">Client injoignable ?</p>
                  <p className="text-xs text-muted-foreground">Lead remboursé automatiquement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophie */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
                Notre philosophie
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                Un réseau qualitatif, pas une foire aux devis.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                Parqueto a été pensé pour les artisans qui en ont assez d'être l'un des cinq devis
                envoyés à un client perdu. Ici, chaque projet est <strong className="text-foreground">exclusif</strong> :
                un seul artisan partenaire est mis en relation par chantier.
              </p>
              <p>
                Nous prenons le temps de cadrer le besoin avec le client (surface, type de bois,
                état du support, délais, budget) <strong className="text-foreground">avant</strong> de
                vous transmettre quoi que ce soit. Vous arrivez sur un projet mûr, pas sur un lead à
                la chaîne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-b border-border/60 bg-brand-cream/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Comment ça marche</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Quatre étapes simples, du premier clic du client à la signature du devis.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Le client estime son projet",
                d: "Surface, type de pose, état du sol. L'outil affiche une fourchette transparente.",
              },
              {
                n: "02",
                t: "Nous qualifions la demande",
                d: "Photos, contraintes techniques, délais. Aucun projet flou ne vous est transmis.",
              },
              {
                n: "03",
                t: "Le projet vous est proposé",
                d: "Exclusivement. Vous achetez le lead (49 / 89 / 189 € selon budget) ou non, librement.",
              },
              {
                n: "04",
                t: "Vous échangez en direct",
                d: "Coordonnées débloquées. Vous signez votre devis sans intermédiaire.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
                <div className="font-serif text-3xl text-brand-orange">{s.n}</div>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Garanties */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-warm">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-8 w-8 text-emerald-600" />
              <div>
                <h2 className="font-serif text-3xl tracking-tight">Nos garanties artisan</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Vous payez pour un projet sérieux, pas pour une promesse. Si quelque chose
                  ne va pas, votre crédit revient sur votre compte.
                </p>
              </div>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                {
                  t: "Lead 100 % exclusif",
                  d: "Jamais revendu à un autre artisan. Un projet = un partenaire.",
                  i: Lock,
                },
                {
                  t: "Client injoignable = remboursé",
                  d: "Si vous ne parvenez pas à joindre le client sous 5 jours ouvrés, le crédit est restitué.",
                  i: ShieldCheck,
                },
                {
                  t: "Hors zone = remboursé",
                  d: "Si le projet est finalement hors de votre rayon d'intervention, crédit restitué.",
                  i: MapPin,
                },
                {
                  t: "Aucun engagement",
                  d: "Pas de durée minimum, pas de pénalité. Vous mettez en pause quand vous voulez.",
                  i: Heart,
                },
              ].map((g) => (
                <li key={g.t} className="flex gap-4 rounded-2xl bg-muted/40 p-5">
                  <g.i className="h-5 w-5 shrink-0 text-brand-orange" />
                  <div>
                    <p className="font-semibold">{g.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{g.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ce qu'on n'est pas */}
      <section className="border-b border-border/60 bg-foreground py-20 text-background">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Ce que Parqueto n'est pas
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Pas une marketplace agressive. Pas un casino à crédits.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              "Pas de guerre de devis à 5 artisans",
              "Pas d'enchères, pas de surenchère",
              "Pas de tokens incompréhensibles",
              "Pas de leads revendus en série",
              "Pas d'urgence artificielle",
              "Pas de jargon SaaS ni de dark patterns",
            ].map((x) => (
              <div key={x} className="flex items-center gap-3 border-b border-background/10 pb-4 text-sm">
                <span className="text-brand-orange">✕</span> {x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignage */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Quote className="h-10 w-10 text-brand-orange" />
          <p className="mt-4 font-serif text-2xl leading-relaxed sm:text-3xl">
            « Avant Parqueto, je passais mes soirées à rappeler des clients déjà engagés ailleurs.
            Aujourd'hui, je reçois trois projets par mois, tous sérieux, tous dans ma zone.
            C'est exactement ce que je cherchais. »
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> Julien M., artisan parqueteur depuis 14 ans · Lyon
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-b from-background to-brand-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Rejoignez le réseau Parqueto
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Inscription gratuite. 3 premiers projets offerts pour découvrir la plateforme,
            sans saisie de moyen de paiement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/devenir-artisan/inscription"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Créer mon profil artisan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pro/offres"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Voir les formules
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
