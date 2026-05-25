import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  HandCoins,
  Lock,
  Heart,
  Clock,
  CheckCircle2,
  Scale,
  Eye,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/charte-qualite")({
  component: ChartePage,
  head: () => ({
    meta: [
      { title: "Charte qualité — Parqueto" },
      {
        name: "description",
        content:
          "Les 10 engagements du réseau Parqueto envers les clients et les artisans : transparence des devis, projets exclusifs, garantie de remboursement, respect de la parole donnée.",
      },
      { property: "og:title", content: "Charte qualité Parqueto" },
      { property: "og:url", content: "/charte-qualite" },
    ],

    links: [{ rel: "canonical", href: "/charte-qualite" }],
  }),
});

const ENGAGEMENTS = [
  {
    icon: Eye,
    title: "Transparence totale des prix",
    body: "Chaque estimation client présente une fourchette claire, sourcée et révisable. Aucun devis caché, aucun supplément surprise. L'artisan présente toujours un devis détaillé ligne par ligne avant tout engagement.",
  },
  {
    icon: Lock,
    title: "Lead exclusif, jamais revendu",
    body: "Un projet client = un seul artisan partenaire. Pas de mise en concurrence, pas de revente du même besoin à 5 entreprises. C'est la fin du devis-poubelle.",
  },
  {
    icon: Scale,
    title: "Pas de commission sur les chantiers",
    body: "Parqueto ne prélève rien sur les devis signés. L'artisan fixe librement ses tarifs et encaisse 100 % de son chiffre. Notre seul revenu : un coût d'accès au projet, fixe et connu d'avance.",
  },
  {
    icon: HandCoins,
    title: "Remboursement automatique",
    body: "Si le client est injoignable sous 5 jours ouvrés, si le projet est finalement hors zone d'intervention, ou si la demande s'avère non sérieuse, le lead est remboursé sans démarche.",
  },
  {
    icon: ShieldCheck,
    title: "Artisans vérifiés",
    body: "SIRET, assurance décennale et RC Pro vérifiés avant intégration. Justificatif d'immatriculation (Kbis ou certificat INSEE pour les auto-entrepreneurs) demandé systématiquement. Pas de profil fantôme.",
  },
  {
    icon: Clock,
    title: "Respect des délais annoncés",
    body: "Le délai de démarrage communiqué au client doit être tenu à la semaine près. En cas d'imprévu, l'artisan prévient sous 48 h avec une date de report ferme.",
  },
  {
    icon: CheckCircle2,
    title: "Garantie parfait achèvement",
    body: "Tout chantier signé via Parqueto bénéficie de la garantie de parfait achèvement légale (1 an) et de la garantie décennale de l'artisan. Aucune dérogation possible.",
  },
  {
    icon: Heart,
    title: "Aucun engagement, aucune pénalité",
    body: "Les artisans peuvent mettre leur compte en pause à tout moment, le réactiver, ou quitter le réseau sans frais. Les clients ne paient jamais pour utiliser l'estimateur.",
  },
  {
    icon: Users,
    title: "Communication directe et humaine",
    body: "Une fois le projet accepté, le client et l'artisan échangent en direct, sans intermédiaire. Parqueto reste joignable en cas de litige, sous 24 h ouvrées par téléphone.",
  },
  {
    icon: AlertTriangle,
    title: "Tolérance zéro pour les abus",
    body: "Démarchage agressif, faux avis, dépassement de devis injustifié, non-respect des délais répétés : exclusion immédiate du réseau et restitution proportionnelle des frais au client lésé.",
  },
];

function ChartePage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-brand-cream to-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange-deep">
            <ShieldCheck className="h-3.5 w-3.5" /> Engagement réseau
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            La charte qualité Parqueto
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Dix engagements concrets envers les clients et les artisans partenaires.
            C'est la définition exacte du service que nous garantissons — et la mesure
            de notre exigence envers nous-mêmes.
          </p>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            Version 1.0 · applicable depuis mai 2026
          </p>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <ol className="grid gap-4 sm:grid-cols-2">
            {ENGAGEMENTS.map((e, i) => (
              <li
                key={e.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-warm"
              >
                <div className="absolute right-4 top-4 font-serif text-4xl text-brand-orange/15">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-deep">
                  <e.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-serif text-xl tracking-tight">{e.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Litiges */}
      <section className="border-y border-border/60 bg-brand-cream/40 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl tracking-tight">En cas de désaccord</h2>
          <p className="mt-4 text-muted-foreground">
            Malgré tous nos contrôles, un litige peut survenir. Voici la procédure
            que nous nous engageons à respecter :
          </p>
          <ol className="mt-8 space-y-4 text-sm">
            <li className="flex gap-4 rounded-2xl border border-border bg-background p-5">
              <span className="font-serif text-2xl text-brand-orange">1.</span>
              <div>
                <p className="font-semibold">Signalement sous 48 h</p>
                <p className="mt-1 text-muted-foreground">
                  Vous écrivez à <a href="mailto:litige@parqueto.fr" className="font-semibold text-brand-orange-deep underline">litige@parqueto.fr</a> avec
                  le numéro de projet et un descriptif du désaccord.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-2xl border border-border bg-background p-5">
              <span className="font-serif text-2xl text-brand-orange">2.</span>
              <div>
                <p className="font-semibold">Médiation Parqueto sous 5 jours</p>
                <p className="mt-1 text-muted-foreground">
                  Notre équipe contacte les deux parties, rassemble les éléments
                  (devis, échanges, photos) et propose une solution amiable.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-2xl border border-border bg-background p-5">
              <span className="font-serif text-2xl text-brand-orange">3.</span>
              <div>
                <p className="font-semibold">Médiateur de la consommation</p>
                <p className="mt-1 text-muted-foreground">
                  Si aucun accord n'est trouvé, recours possible au médiateur officiel de
                  la consommation (CMAP) — gratuit pour le client.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Une charte, pas un slogan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Chaque artisan partenaire la signe avant son intégration au réseau.
            Chaque client peut s'y référer à tout moment. Et nous nous y tenons aussi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Devenir artisan partenaire <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              Estimer mon projet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
