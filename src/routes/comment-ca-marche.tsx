import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardEdit,
  Sparkles,
  UserCheck,
  PhoneCall,
  FileText,
  HandHeart,
  UserPlus,
  Target,
  MessagesSquare,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Award,
  Wrench,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JourneyStepper, type JourneyStep } from "@/components/site/JourneyStepper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import clientStep1 from "@/assets/how-it-works/client-step-1.png";
import clientStep2 from "@/assets/how-it-works/client-step-2.png";
import clientStep3 from "@/assets/how-it-works/client-step-3.png";
import clientStep4 from "@/assets/how-it-works/client-step-4.png";
import clientStep5 from "@/assets/how-it-works/client-step-5.png";
import clientStep6 from "@/assets/how-it-works/client-step-6.png";
import artisanStep1 from "@/assets/how-it-works/artisan-step-1.png";
import artisanStep2 from "@/assets/how-it-works/artisan-step-2.png";
import artisanStep3 from "@/assets/how-it-works/artisan-step-3.png";
import artisanStep4 from "@/assets/how-it-works/artisan-step-4.png";
import artisanStep5 from "@/assets/how-it-works/artisan-step-5.png";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comment-ca-marche")({
  component: HowItWorksPage,
  head: () => ({
    meta: [
      { title: "Comment ça marche — Estimation parquet & artisan vérifié en 6 étapes · Parqueto" },
      {
        name: "description",
        content:
          "Découvrez comment Parqueto fonctionne : décrivez votre projet parquet, recevez une estimation IA, et soyez mis en relation avec un artisan parqueteur vérifié sous 24 h. Côté client et côté artisan, expliqué pas à pas.",
      },
      { property: "og:title", content: "Comment ça marche — Parqueto" },
      {
        property: "og:description",
        content:
          "Le parcours Parqueto expliqué : 6 étapes côté client, 5 étapes côté artisan, et l'algorithme de mise en relation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/comment-ca-marche" },
    ],
    links: [{ rel: "canonical", href: "/comment-ca-marche" }],
  }),
});

const clientSteps: JourneyStep[] = [
  {
    n: "01",
    icon: ClipboardEdit,
    title: "Vous décrivez votre projet",
    body: "Quelques questions simples, en français clair : type de travaux, surface, budget, photos de votre parquet… en quelques minutes, votre demande est prête.",
    highlight: "5 minutes",
    image: clientStep1,
    imageAlt: "Étape 1 côté client : formulaire de description du projet parquet sur mobile.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Nous estimons votre projet",
    body: "Notre IA analyse votre demande et vous fournit une estimation personnalisée du coût des travaux, claire, gratuite et sans engagement.",
    highlight: "Estimation instantanée",
    image: clientStep2,
    imageAlt: "Étape 2 côté client : estimation de prix Parqueto avec détail des postes.",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Nous sélectionnons le meilleur artisan pour vous",
    body: "Notre algorithme sélectionne l'artisan le plus qualifié, le plus proche et disponible pour votre projet. Un seul bon contact, au bon moment.",
    highlight: "1 artisan, pas 10",
    image: clientStep3,
    imageAlt: "Étape 3 côté client : fiche artisan sélectionné avec notes, proximité et disponibilité.",
  },
  {
    n: "04",
    icon: PhoneCall,
    title: "L'artisan vous contacte sous 24 h",
    body: "L'artisan sélectionné prend contact rapidement pour échanger sur votre projet, répondre à vos questions et convenir d'une visite si nécessaire.",
    highlight: "Sous 24 h",
    image: clientStep4,
    imageAlt: "Étape 4 côté client : appel de l'artisan sélectionné dans l'interface mobile.",
  },
  {
    n: "05",
    icon: FileText,
    title: "Vous recevez un devis clair",
    body: "L'artisan vous propose un devis détaillé et transparent, adapté à votre projet : prestations, délais, garanties et prix justes, sans surprise.",
    highlight: "Devis détaillé",
    image: clientStep5,
    imageAlt: "Étape 5 côté client : devis détaillé parquet avec total, délais et garanties.",
  },
  {
    n: "06",
    icon: HandHeart,
    title: "Votre projet est entre de bonnes mains",
    body: "Les travaux sont planifiés. Votre artisan s'occupe de tout, et Parqueto reste disponible avant, pendant et après le chantier pour votre tranquillité.",
    highlight: "Suivi inclus",
    image: clientStep6,
    imageAlt: "Étape 6 côté client : chantier parquet démarré avec suivi et satisfaction client.",
  },
];

const artisanSteps: JourneyStep[] = [
  {
    n: "01",
    icon: UserPlus,
    title: "Vous créez votre compte artisan",
    body: "Inscription rapide et gratuite. Renseignez votre entreprise, vos spécialités et votre zone d'intervention pour commencer à recevoir des opportunités adaptées.",
    highlight: "100 % gratuit",
    image: artisanStep1,
    imageAlt: "Étape 1 côté artisan : création du compte artisan sur mobile avec formulaire d'entreprise.",
  },
  {
    n: "02",
    icon: Target,
    title: "Vous recevez des missions ciblées",
    body: "Notre algorithme vous envoie uniquement des demandes correspondant à vos compétences, votre zone d'intervention et vos disponibilités.",
    highlight: "Leads qualifiés",
    image: artisanStep2,
    imageAlt: "Étape 2 côté artisan : notification de nouvelle mission ciblée correspondant au profil de l'artisan.",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Vous répondez et échangez avec le client",
    body: "Prenez connaissance du projet, posez vos questions et proposez votre expertise. Les échanges sont centralisés et sécurisés dans l'application.",
    highlight: "Direct & sans intermédiaire",
    image: artisanStep3,
    imageAlt: "Étape 3 côté artisan : détail de mission et échange avec le client depuis l'application.",
  },
  {
    n: "04",
    icon: CheckCircle2,
    title: "Vous êtes sélectionné et le chantier est validé",
    body: "Le client accepte votre proposition. Le chantier est officialisé sur la plateforme, avec toutes les informations utiles pour organiser l'intervention.",
    highlight: "Chantier validé",
    image: artisanStep4,
    imageAlt: "Étape 4 côté artisan : mission acceptée, planning visible et chantier validé.",
  },
  {
    n: "05",
    icon: CircleDollarSign,
    title: "Vous réalisez le chantier et êtes payé",
    body: "Vous travaillez sereinement, le client est satisfait, votre paiement est sécurisé à la fin du chantier et votre réputation grandit sur la plateforme.",
    highlight: "Paiement sécurisé",
    image: artisanStep5,
    imageAlt: "Étape 5 côté artisan : chantier terminé, avis client positif et paiement sécurisé effectué.",
  },
];

const algoPillars = [
  {
    icon: MapPin,
    title: "Géolocalisation précise",
    body: "Zone d'intervention déclarée par l'artisan, croisée avec votre adresse. Pas de déplacement inutile, pas de surcoût injustifié.",
  },
  {
    icon: Wrench,
    title: "Spécialité métier",
    body: "Pose chevron, rénovation de parquet ancien, traitement gondolage, vitrification écologique… chaque artisan déclare son cœur de métier.",
  },
  {
    icon: Award,
    title: "Niveau de qualification",
    body: "Standard, Qualifié ou Premium — selon l'ancienneté, les avis clients vérifiés et les justificatifs assurance. Plus la qualif est haute, plus la priorité est élevée.",
  },
];

function HowItWorksPage() {
  const [tab, setTab] = useState<"client" | "artisan">("client");
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Comment ça marche</p>
          <h1 className="mt-4 font-display text-4xl text-balance sm:text-6xl">
            Un projet parquet, <span className="italic text-brand-orange">un parcours limpide.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground sm:text-lg">
            Parqueto, ce n'est ni un annuaire, ni un comparateur de devis. C'est une méthode :
            on cadre votre projet, on vous oriente vers le bon artisan, et on reste là jusqu'à la réception du chantier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Je suis artisan
            </Link>
          </div>
        </div>
      </section>

      {/* Tab switcher */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-12 flex max-w-md gap-2 rounded-full border border-border bg-card p-1.5 shadow-soft">
            {(["client", "artisan"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  tab === k
                    ? "bg-brand-orange text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {k === "client" ? "Côté client" : "Côté artisan"}
              </button>
            ))}
          </div>

          {tab === "client" ? (
            <JourneyStepper steps={clientSteps} label="Parcours client en 6 étapes" />
          ) : (
            <JourneyStepper steps={artisanSteps} label="Parcours artisan en 4 étapes" accent="ink" />
          )}
        </div>
      </section>

      {/* Algorithm explainer */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Notre méthode de mise en relation
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
              Comment on choisit <span className="italic text-brand-orange">le bon artisan</span> pour vous.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Un seul artisan vous est proposé. Pas dix. Notre algorithme croise trois critères majeurs pour vous orienter vers celui qui correspond vraiment à votre projet.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {algoPillars.map(({ icon: Icon, title, body }, idx) => (
              <div
                key={title}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <span className="absolute right-5 top-5 font-display text-3xl text-brand-orange/20">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Questions fréquentes</p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
              On vous dit <span className="italic text-brand-orange">tout.</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-left">Combien coûte l'estimation ?</AccordionTrigger>
              <AccordionContent>
                L'estimation Parqueto est 100 % gratuite et sans engagement. Vous recevez une fourchette de prix
                réaliste, calée sur les tarifs réels des artisans parqueteurs de votre région.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-left">Pourquoi un seul artisan, et pas trois devis ?</AccordionTrigger>
              <AccordionContent>
                Parce que mettre trois artisans en concurrence pour un même chantier, c'est leur faire perdre du temps
                — et ce temps perdu, ils le facturent quelque part. On vous oriente vers le bon artisan du premier coup :
                spécialité, zone, disponibilité, qualification. Si le courant ne passe pas, on en propose un autre.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-left">
                Comment vérifiez-vous les artisans du réseau ?
              </AccordionTrigger>
              <AccordionContent>
                Chaque artisan fournit son KBIS, son attestation RC Pro et sa décennale. Identité, assurances et avis
                clients sont vérifiés manuellement avant validation, puis recontrôlés régulièrement. Les artisans en
                infraction sont suspendus.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-left">Sous quel délai l'artisan me contacte ?</AccordionTrigger>
              <AccordionContent>
                Sous 24 heures ouvrées après votre demande, dans 95 % des cas. Si aucun artisan disponible ne correspond
                à votre projet, nous vous prévenons et reprenons la recherche.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="text-left">Et si je suis artisan, comment ça marche ?</AccordionTrigger>
              <AccordionContent>
                Vous créez votre compte, fournissez vos justificatifs, choisissez votre formule (essai gratuit 14 jours
                disponible) et recevez uniquement les missions qui correspondent à votre métier et votre zone. Aucun
                lead générique, aucun spam. Voir{" "}
                <Link to="/devenir-artisan" className="font-semibold text-brand-orange hover:underline">
                  notre offre artisans
                </Link>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger className="text-left">Le paiement passe-t-il par Parqueto ?</AccordionTrigger>
              <AccordionContent>
                Non. Vous payez directement l'artisan, selon les modalités fixées dans son devis. Parqueto ne prélève
                rien sur votre chantier — notre modèle économique repose uniquement sur les artisans du réseau.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-brand-orange/20 bg-gradient-warm p-8 text-center sm:p-10">
            <h3 className="font-display text-2xl text-balance sm:text-3xl">Prêt à lancer votre projet ?</h3>
            <p className="max-w-md text-sm text-brand-ink/75">
              Estimation gratuite en 5 minutes. Un artisan vérifié vous recontacte sous 24 h.
            </p>
            <Link
              to="/estimation"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
