import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Droplets,
  Flame,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Euro,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import sinistreImg from "@/assets/parquet-degat-eaux.jpg";

export const Route = createFileRoute("/renovation-sinistre")({
  component: SinistrePage,
  head: () => ({
    meta: [
      {
        title:
          "Dégât des eaux parquet — devis assurance parquet sous 24 h · Parqueto",
      },
      {
        name: "description",
        content:
          "Parquet gondolé après un dégât des eaux ? Devis parquet pour assurance, rapport photo daté, artisan parqueteur vérifié. Intervention 48 h en Île-de-France. Estimation gratuite.",
      },
      {
        name: "keywords",
        content:
          "dégât des eaux parquet, devis assurance parquet, devis parquet suite dégât des eaux, parquet gondolé assurance, rénovation parquet sinistre, expertise parquet assurance, remise en état parquet, parquet brûlé incendie, artisan parqueteur assurance, devis parqueteur Paris, parquet ancien rénovation",
      },
      { property: "og:title", content: "Dégât des eaux parquet — devis assurance sous 24 h · Parqueto" },
      {
        property: "og:description",
        content:
          "Devis parquet compatible assurance, rapport photo daté, artisan vérifié. Premier retour en 24 h ouvrées.",
      },
      { property: "og:image", content: sinistreImg },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/renovation-sinistre" },
    ],
    links: [{ rel: "canonical", href: "/renovation-sinistre" }],
  }),
});

const TYPES = [
  {
    icon: Droplets,
    title: "Dégât des eaux & parquet gondolé",
    body:
      "Fuite chaudière, machine à laver, infiltration toiture, voisin du dessus, inondation : lames gondolées, tuilage, taches noires d'humidité. Diagnostic d'hygrométrie, dépose des zones atteintes, séchage profond et repose à l'identique — chêne massif, contrecollé, point de Hongrie ou bâtons rompus.",
  },
  {
    icon: Flame,
    title: "Parquet brûlé — incendie & fumée",
    body:
      "Brûlures de surface, dépôts de suie, vernis altéré, odeur persistante. Ponçage profond, traitement antifumée professionnel, nouvelle finition (huile dure, vitrification mat ou satinée) compatible avec l'essence d'origine.",
  },
  {
    icon: AlertTriangle,
    title: "Choc, rayures profondes, taches",
    body:
      "Mobilier tombé, produit corrosif, brûlure de cigarette, animal. Reprise localisée, raccord d'essence et de teinte, vitrification de la zone — invisible dans la majorité des cas.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Constat & photos (2 min)",
    body:
      "Vous décrivez le sinistre via l'estimateur en ligne, photos comprises. Réponse Parqueto en moins de 24 h ouvrées avec une première fourchette de prix indicative.",
  },
  {
    n: "02",
    title: "Diagnostic sur place",
    body:
      "L'artisan parqueteur partenaire mesure l'humidité du support, identifie l'essence et la finition d'origine, chiffre la remise en état au mètre carré.",
  },
  {
    n: "03",
    title: "Devis parquet assurance",
    body:
      "Devis détaillé ligne par ligne + rapport photo daté + descriptif technique. Document directement transmissible à votre assureur ou à l'expert mandaté, sans rien re-saisir.",
  },
  {
    n: "04",
    title: "Chantier & garantie décennale",
    body:
      "Dépose, séchage contrôlé, repose, ponçage et finition. Travaux couverts par la décennale de l'artisan, suivi Parqueto jusqu'à réception du chantier.",
  },
];

const FAQ = [
  {
    q: "Mon assurance prend-elle en charge la rénovation du parquet après un dégât des eaux ?",
    a: "Oui dans la grande majorité des cas. Les contrats multirisque habitation couvrent le dégât des eaux, l'incendie et les catastrophes naturelles. Notre devis assurance parquet est conçu pour être transmis directement à votre assureur ou à l'expert : il détaille chaque poste (dépose, séchage, fourniture, pose, ponçage, finition) au mètre carré, conformément aux barèmes d'expertise courants (convention IRSI).",
  },
  {
    q: "Combien coûte un devis parquet suite à un dégât des eaux ?",
    a: "Le devis Parqueto est gratuit et sans engagement. Le coût des travaux varie selon la surface atteinte (40 à 90 €/m² pour une reprise localisée, 90 à 180 €/m² pour une dépose-repose complète avec fourniture). L'assurance rembourse généralement la vétusté déduite — notre rapport vous aide à argumenter en cas de litige.",
  },
  {
    q: "Faut-il déposer tout le parquet ou seulement la zone abîmée par l'eau ?",
    a: "L'artisan privilégie toujours la reprise localisée quand c'est techniquement possible : c'est moins coûteux et cela préserve le caractère du parquet d'origine. La dépose totale s'impose quand le tuilage dépasse 30 % de la pièce, quand le support (chape, lambourdes) est gorgé d'eau, ou quand l'essence n'est plus reproductible en raccord.",
  },
  {
    q: "Combien de temps pour intervenir après un sinistre parquet ?",
    a: "Premier retour Parqueto en moins de 24 h ouvrées. Diagnostic sur place sous 48 à 72 h en Île-de-France (Paris 75, Hauts-de-Seine 92, Seine-Saint-Denis 93, Val-de-Marne 94). La durée du chantier dépend du temps de séchage nécessaire — comptez 7 à 21 jours pour un dégât des eaux avec dépose-repose.",
  },
  {
    q: "Et si l'essence d'origine de mon parquet ancien n'existe plus ?",
    a: "Nos artisans parqueteurs disposent d'un stock de lames anciennes (chêne massif, châtaignier, point de Hongrie, bâtons rompus, parquet de Versailles) et savent rattraper les teintes par mélange d'huiles, teinture ou vitrification teintée. Un raccord invisible est presque toujours possible, même sur un parquet d'avant 1950.",
  },
  {
    q: "Parqueto intervient-il en urgence pour un parquet inondé ?",
    a: "Oui. Pour un parquet inondé, contactez-nous d'abord par téléphone via la page contact. Nous mobilisons un artisan partenaire pour un diagnostic d'urgence sous 24 à 48 h en Île-de-France, afin d'engager le séchage avant que les lames ne se déforment davantage.",
  },
];

function SinistrePage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grain absolute inset-0 opacity-40" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6 lg:pt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Service spécialisé · Sinistre assurance
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Dégât des eaux sur votre parquet ?
              <span className="block italic text-brand-orange">Devis assurance sous 24 h.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Parquet gondolé, taché, brûlé ou inondé : un{" "}
              <strong className="font-semibold text-foreground">artisan parqueteur vérifié</strong>{" "}
              intervient, chiffre et vous remet un{" "}
              <strong className="font-semibold text-foreground">
                devis parquet compatible assurance
              </strong>{" "}
              avec rapport photo daté. Premier retour en moins de 24 h ouvrées, intervention en Île-de-France.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/estimation"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
              >
                Obtenir mon devis assurance gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                <Phone className="h-4 w-4" />
                Urgence parquet inondé
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Réponse en moins de 24 h ouvrées</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Devis détaillé pour assurance</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Artisans couverts décennale</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Compatible convention IRSI</li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl shadow-warm">
              <img
                src={sinistreImg}
                alt="Parquet en chêne gondolé après un dégât des eaux, lames soulevées par l'humidité — cas type pris en charge par Parqueto pour devis assurance"
                className="aspect-[4/5] w-full object-cover"
                width={1200}
                height={1500}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-5 text-background">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Cas réel · Île-de-France</p>
                <p className="mt-1 font-display text-xl">Parquet chêne gondolé après fuite chaudière</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick reassurance band — AEO friendly */}
      <section className="border-b border-border bg-secondary/50 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-brand-orange" />
            <div>
              <p className="font-display text-sm">Réponse 24 h ouvrées</p>
              <p className="text-xs text-muted-foreground">Diagnostic sur place sous 48–72 h</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Euro className="mt-0.5 h-5 w-5 text-brand-orange" />
            <div>
              <p className="font-display text-sm">Devis gratuit, sans engagement</p>
              <p className="text-xs text-muted-foreground">Transmissible à votre assureur</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-brand-orange" />
            <div>
              <p className="font-display text-sm">Île-de-France (75, 92, 93, 94)</p>
              <p className="text-xs text-muted-foreground">Paris et 1ère couronne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Types de sinistre parquet
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Dégât des eaux, incendie, choc :{" "}
              <span className="italic text-brand-orange">trois protocoles.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Chaque type de sinistre demande une approche technique différente. Nos artisans parqueteurs
              partenaires sont formés à la remise en état après assurance — du diagnostic au procès-verbal de réception.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TYPES.map((t) => (
              <article
                key={t.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Notre process sinistre
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Du constat à la{" "}
                <span className="italic text-brand-orange">remise en état.</span>
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-brand-orange" />
              Premier retour &lt; 24 h ouvrées
            </div>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="font-display text-4xl text-brand-orange/80">{s.n}</span>
                <h3 className="mt-2 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Assurance reassurance */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl">
                  Besoin d'un devis parquet pour votre assurance&nbsp;?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Chaque intervention sinistre livre un{" "}
                  <strong className="text-foreground">devis détaillé ligne par ligne</strong>, un
                  rapport photo daté et un descriptif technique. Vous transmettez le tout en l'état à
                  votre assureur (MAIF, MAAF, Allianz, AXA, Groupama, MACIF, Matmut…) ou à l'expert
                  mandaté — sans rien re-saisir, sans relance.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Artisans couverts par une décennale en cours de validité</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Diagnostic d'humidité (hygromètre) avant toute repose</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Compatibilité barèmes IRSI &amp; expertise courants</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Suivi Parqueto jusqu'à réception du chantier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            Dégât des eaux parquet : vos questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Les réponses concrètes que nos clients posent le plus souvent avant de lancer un devis sinistre.
          </p>
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="cursor-pointer list-none font-display text-lg text-foreground transition group-open:text-brand-orange">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          {/* FAQ + Service JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "FAQPage",
                    mainEntity: FAQ.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  },
                  {
                    "@type": "Service",
                    serviceType: "Rénovation parquet après sinistre",
                    name: "Devis parquet assurance — dégât des eaux, incendie",
                    provider: {
                      "@type": "Organization",
                      name: "Parqueto",
                      url: "https://parqueto.fr",
                    },
                    areaServed: [
                      { "@type": "AdministrativeArea", name: "Île-de-France" },
                      { "@type": "City", name: "Paris" },
                    ],
                    offers: {
                      "@type": "Offer",
                      price: "0",
                      priceCurrency: "EUR",
                      description:
                        "Devis parquet compatible assurance, rapport photo daté, premier retour sous 24 h ouvrées.",
                    },
                  },
                ],
              }),
            }}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-balance sm:text-4xl">
            Votre parquet a souffert ?{" "}
            <span className="italic text-brand-orange">On s'en occupe.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Décrivez votre dégât des eaux ou sinistre en 2 minutes, ajoutez vos photos. Un artisan
            partenaire reprend contact sous 24 h ouvrées avec un devis assurance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Lancer mon devis assurance
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/charte-qualite"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Lire la charte qualité
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
