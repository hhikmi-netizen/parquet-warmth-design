import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Calculator,
  HandshakeIcon,
  Hammer,
  Euro,
  Lock,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FaqAccordion, type FaqItem } from "@/components/site/FaqAccordion";

type Category = {
  id: string;
  label: string;
  icon: typeof ShieldCheck;
  intro: string;
  items: FaqItem[];
};

const CATEGORIES: Category[] = [
  {
    id: "estimation",
    label: "Estimation",
    icon: Calculator,
    intro:
      "Comment fonctionne l'estimation en ligne, sur quoi elle se base, et quelle marge d'erreur prévoir.",
    items: [
      {
        q: "L'estimation est-elle vraiment gratuite et sans engagement ?",
        a: "Oui, totalement. Vous obtenez une fourchette de prix claire en quelques minutes, sans inscription préalable obligatoire. Vous décidez ensuite, à votre rythme, si vous voulez aller plus loin avec notre artisan partenaire — ou pas.",
      },
      {
        q: "Sur quoi se base l'estimation que vous me donnez ?",
        a: "Sur les tarifs réellement pratiqués par les artisans parqueteurs de votre région, croisés avec les paramètres de votre projet : surface, type de bois, état du sol, prestation souhaitée. C'est une fourchette honnête, pas un chiffre marketing.",
      },
      {
        q: "Combien de temps prend l'estimation ?",
        a: "Entre 2 et 4 minutes selon la complexité de votre projet. Vous répondez à quelques questions guidées (surface, état du parquet existant, prestation visée), et vous obtenez immédiatement une fourchette de prix avec le détail des postes.",
      },
      {
        q: "Est-ce que je dois fournir des photos ?",
        a: "Non, c'est optionnel. Mais si vous en ajoutez (sol actuel, pièce, défauts éventuels), notre assistant IA affine l'estimation et l'artisan partenaire arrive mieux préparé à votre rendez-vous.",
      },
      {
        q: "Quelle est la marge d'erreur de l'estimation ?",
        a: "La fourchette tient compte des cas standards à 90 %. Pour les chantiers particuliers (sinistre, parquet ancien atypique, contraintes d'accès), l'artisan ajuste lors du devis sur place — qui reste, lui, ferme et détaillé.",
      },
    ],
  },
  {
    id: "mise-en-relation",
    label: "Mise en relation",
    icon: HandshakeIcon,
    intro:
      "Combien d'artisans, quand sont-ils en contact, qu'arrive-t-il à vos données.",
    items: [
      {
        q: "Combien d'artisans vais-je avoir au bout du fil ?",
        a: "Un seul. Parqueto n'est pas une plateforme de mise en concurrence : on cadre votre projet, puis on vous oriente vers un artisan partenaire vérifié, choisi pour son savoir-faire et la nature de votre chantier. Pas trois, pas cinq — un interlocuteur, une relation de confiance.",
      },
      {
        q: "Vais-je être démarché ou recevoir des appels en rafale ?",
        a: "Non. Votre numéro ne circule pas, vos coordonnées ne sont jamais revendues. L'artisan partenaire vous contacte une seule fois, à l'horaire que vous indiquez. Aucune relance commerciale, aucun spam — vous gardez la main, toujours.",
      },
      {
        q: "Dans quel délai l'artisan me contacte-t-il ?",
        a: "Sous 48 h ouvrées en moyenne. Pour les urgences (dégât des eaux, sinistre en cours), précisez-le dans la demande : nous priorisons l'envoi à un artisan disponible immédiatement.",
      },
      {
        q: "Et si je veux comparer plusieurs prix quand même ?",
        a: "Vous restez libre, bien sûr. Mais notre rôle n'est pas d'organiser une compétition entre artisans : c'est de vous donner un repère de prix fiable et un artisan sérieux qui prend le temps de comprendre votre parquet. La plupart de nos clients trouvent ça reposant.",
      },
      {
        q: "Que se passe-t-il si le projet ne me convient pas ?",
        a: "Aucun problème : aucun engagement, aucun frais. L'estimation est à vous, et vous pouvez vous arrêter à n'importe quelle étape. On préfère un projet bien cadré qu'un projet forcé.",
      },
      {
        q: "Le courant ne passe pas avec l'artisan : puis-je en changer ?",
        a: "Oui. Vous nous écrivez à contact@parqueto.fr, on échange une fois pour comprendre, et on vous propose un autre artisan partenaire. Le critère est simple : que vous repartiez serein.",
      },
    ],
  },
  {
    id: "artisans",
    label: "Artisans",
    icon: Hammer,
    intro:
      "Sur quels critères ils sont vérifiés, comment ils sont sélectionnés et notés.",
    items: [
      {
        q: "Comment sont sélectionnés les artisans partenaires ?",
        a: "Chaque artisan passe par 8 critères vérifiés : SIRET actif, assurance décennale à jour, références chantiers contrôlées, qualification métier, avis clients modérés, charte qualité signée, formation continue et entretien d'intégration. Pas de candidature anonyme, pas d'auto-déclaration.",
      },
      {
        q: "Que garantit le badge « Artisan Vérifié » ?",
        a: "Que l'artisan est légalement en règle (SIRET, décennale), qu'il maîtrise techniquement le parquet (pose, rénovation, finition), qu'il a accepté la charte qualité Parqueto, et qu'il est noté en continu par les clients du réseau. Le badge est revérifié chaque année.",
      },
      {
        q: "Combien d'artisans sont actuellement dans le réseau ?",
        a: "Le réseau Parqueto démarre avec un noyau restreint d'artisans triés sur le volet, dans les principales métropoles françaises. Nous préférons une couverture progressive et exigeante plutôt qu'un annuaire pléthorique. Si aucun artisan n'est encore disponible dans votre zone, nous vous le disons en toute transparence.",
      },
      {
        q: "Que se passe-t-il si l'artisan livre un travail décevant ?",
        a: "Vous nous le signalez. Nous médiatisons l'échange, et si le grief est confirmé, l'artisan corrige à ses frais ou sort du réseau. La garantie décennale (10 ans) reste, dans tous les cas, votre filet juridique en cas de désordre lié à la pose.",
      },
      {
        q: "Je suis artisan parqueteur : comment rejoindre Parqueto ?",
        a: "Rendez-vous sur la page Devenir artisan partenaire. Vous remplissez un formulaire (15 min), nous vérifions les pièces, on organise un entretien, et — si tout colle — vous démarrez avec un onboarding accompagné.",
      },
    ],
  },
  {
    id: "prix-devis",
    label: "Prix & devis",
    icon: Euro,
    intro:
      "Ce que couvre l'estimation, comment se passe le devis chez vous, et les garanties.",
    items: [
      {
        q: "Le devis sur place est-il gratuit ?",
        a: "Oui. La visite de l'artisan partenaire pour mesurer, diagnostiquer et remettre un devis détaillé est gratuite et sans engagement, partout en France métropolitaine.",
      },
      {
        q: "Quels postes sont inclus dans le devis ?",
        a: "Main d'œuvre, matériaux (parquet, sous-couches, colles, finitions), préparation du support, évacuation des déchets, et garantie décennale. Tout est ligne par ligne, sans frais cachés.",
      },
      {
        q: "Le prix de l'estimation peut-il changer après la visite ?",
        a: "Oui, à la marge. La fourchette en ligne couvre 90 % des cas standards. L'artisan ajuste si le diagnostic révèle des éléments invisibles depuis vos photos (chape humide, lames pourries, niveau à reprendre). Le devis sur place, lui, est ferme.",
      },
      {
        q: "Puis-je passer par mon assurance pour un sinistre ?",
        a: "Oui. Si votre chantier fait suite à un dégât des eaux, incendie ou autre, l'artisan partenaire établit un devis conforme aux exigences des experts d'assurance et peut dialoguer directement avec votre compagnie pour accélérer l'indemnisation. Voir la page dédiée Dégât des eaux.",
      },
      {
        q: "Quelles garanties après les travaux ?",
        a: "Garantie de parfait achèvement (1 an) sur toute la prestation, garantie biennale (2 ans) sur les éléments dissociables, et garantie décennale (10 ans) sur les vices liés à la pose. Les matériaux conservent en plus la garantie fabricant. L'attestation d'assurance est jointe au devis.",
      },
    ],
  },
  {
    id: "donnees-rgpd",
    label: "Données & RGPD",
    icon: Lock,
    intro:
      "Ce qu'on stocke, ce qu'on ne fait jamais, comment exercer vos droits.",
    items: [
      {
        q: "Qui voit mes données personnelles ?",
        a: "Strictement : vous, Parqueto (pour cadrer votre projet), et l'artisan partenaire affecté à votre demande. Personne d'autre. Aucune revente, aucun partage avec des tiers, aucun croisement publicitaire.",
      },
      {
        q: "Combien de temps mes données sont-elles conservées ?",
        a: "Trois ans après votre dernière interaction si vous êtes client, conformément à nos obligations légales (preuve fiscale, garantie décennale). Vous pouvez demander la suppression à tout moment en écrivant à contact@parqueto.fr.",
      },
      {
        q: "Comment exercer mes droits RGPD ?",
        a: "Accès, rectification, suppression, portabilité : une simple demande par email à contact@parqueto.fr. Nous répondons sous 30 jours maximum, le plus souvent sous 5 jours ouvrés.",
      },
      {
        q: "Utilisez-vous des cookies de tracking ?",
        a: "Uniquement les cookies essentiels au fonctionnement du site et — avec votre consentement — un cookie d'analyse anonymisée (pour comprendre comment améliorer l'expérience). Aucun pixel publicitaire, aucun retargeting tiers.",
      },
      {
        q: "Mes photos de chantier sont-elles publiées ?",
        a: "Jamais sans accord écrit. Si nous souhaitons mettre en avant une réalisation, nous vous le demandons explicitement, et vous pouvez refuser sans conséquence sur votre projet.",
      },
    ],
  },
];

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => {
    const allItems = CATEGORIES.flatMap((c) => c.items);
    return {
      meta: [
        { title: "FAQ — Toutes vos questions sur Parqueto" },
        {
          name: "description",
          content:
            "Estimation, mise en relation, artisans vérifiés, prix, garanties, données personnelles : les réponses claires aux questions les plus posées sur Parqueto.",
        },
        { property: "og:title", content: "FAQ — Toutes vos questions sur Parqueto" },
        {
          property: "og:description",
          content:
            "Comment fonctionne l'estimation, comment sont sélectionnés les artisans, ce qu'on fait de vos données. On vous répond clairement, sans détour.",
        },
        { property: "og:url", content: "/faq" },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: "/faq" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
});

function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const current = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-warm/40">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <ShieldCheck className="h-3.5 w-3.5" />
            On vous répond clairement
          </span>
          <h1 className="mt-5 font-display text-4xl text-balance text-foreground sm:text-5xl lg:text-6xl">
            Vos questions,
            <span className="block italic text-brand-orange">nos réponses honnêtes.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Estimation, mise en relation, artisans, devis, données personnelles. Si une question
            manque, écrivez-nous — on l'ajoute.
          </p>
        </div>
      </section>

      {/* Tabs + contenu */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Tab nav */}
          <nav
            aria-label="Catégories de questions fréquentes"
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-4 sm:flex-wrap sm:justify-center sm:overflow-visible"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0);
                  }}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "border-brand-orange bg-brand-orange text-primary-foreground shadow-soft"
                      : "border-border bg-card text-foreground/75 hover:border-brand-orange/40 hover:text-brand-orange"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Intro catégorie */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
            {current.intro}
          </p>

          {/* Accordéon */}
          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion
              key={current.id}
              items={current.items}
              open={openIndex}
              onToggle={setOpenIndex}
              size="md"
            />
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="border-t border-border bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-brand-orange" aria-hidden />
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
            Une question qui n'est pas dans la liste ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Écrivez-nous : on répond en moins de 48 h ouvrées, sans formulaire interminable.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Nous écrire
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/estimation"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/50 hover:text-brand-orange"
            >
              Estimer mon projet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
