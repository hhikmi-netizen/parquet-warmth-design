import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Hammer,
  Sparkles,
  Wrench,
  Droplets,
  Phone,
  Building2,
  ShieldCheck,
  Clock,
  Euro,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CITIES, getCityBySlug } from "@/lib/cities";
import { PRESTATIONS as LOCAL_PRESTATIONS, type Prestation } from "@/lib/prestations";

export const Route = createFileRoute("/parqueteur/$ville")({
  loader: ({ params }) => {
    const city = getCityBySlug(params.ville);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { city } = loaderData;
    const title = `Parqueteur ${city.name} — pose, ponçage, rénovation parquet · Parqueto`;
    const description = `Trouvez un parqueteur vérifié à ${city.name} : pose, ponçage, vitrification, rénovation. Devis gratuit en 24 h, artisans assurés décennale, tarifs ${city.tarifIndicatif}.`;

    const faqs = buildFaqs(city.name, city.tarifIndicatif);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `parqueteur ${city.name}, pose parquet ${city.name}, ponçage parquet ${city.name}, rénovation parquet ${city.name}, devis parquet ${city.name}, artisan parquet ${city.name}, vitrification parquet ${city.name}`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/parqueteur/${city.slug}` },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fr_FR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: `/parqueteur/${city.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://parqueto.fr/parqueteur/${city.slug}`,
            name: `Parqueto — Parqueteurs à ${city.name}`,
            description,
            url: `https://parqueto.fr/parqueteur/${city.slug}`,
            email: "contact@parqueto.fr",
            priceRange: city.tarifIndicatif,
            areaServed: {
              "@type": "City",
              name: city.name,
              containedInPlace: { "@type": "AdministrativeArea", name: city.region },
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: city.name,
              postalCode: city.codePostalPrincipal,
              addressRegion: city.region,
              addressCountry: "FR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: city.geo.lat,
              longitude: city.geo.lng,
            },
            image: "https://parqueto.fr/logo.png",
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://parqueto.fr/" },
              { "@type": "ListItem", position: 2, name: "Parqueteurs", item: "https://parqueto.fr/artisans" },
              {
                "@type": "ListItem",
                position: 3,
                name: `Parqueteur ${city.name}`,
                item: `https://parqueto.fr/parqueteur/${city.slug}`,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
          Ville non couverte
        </p>
        <h1 className="mt-3 font-display text-3xl text-foreground">
          Cette ville n'est pas encore référencée
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Nous étendons progressivement notre réseau. Consultez les villes disponibles ou demandez
          un devis personnalisé.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-brand-orange-deep"
        >
          Demander un devis
        </Link>
      </div>
    </div>
  ),
});

const PRESTATIONS = [
  {
    icon: Hammer,
    title: "Pose de parquet neuf",
    text: "Massif, contrecollé, stratifié. Pose clouée, collée ou flottante selon votre support.",
    href: "/estimation",
  },
  {
    icon: Sparkles,
    title: "Ponçage + vitrification",
    text: "Redonner éclat et protection à un parquet existant. Finition huile, vernis ou cire.",
    href: "/estimation",
  },
  {
    icon: Wrench,
    title: "Rénovation complète",
    text: "Diagnostic, recollage, ponçage doux, finition adaptée à l'époque du parquet.",
    href: "/estimation",
  },
  {
    icon: Droplets,
    title: "Réparation dégât des eaux",
    text: "Intervention rapide après sinistre, devis assurance, reprise localisée.",
    href: "/renovation-sinistre",
  },
] as const;

const PRICING_ROWS = [
  { label: "Pose parquet contrecollé", unit: "€/m²", range: "35 – 55" },
  { label: "Pose parquet massif chêne", unit: "€/m²", range: "55 – 85" },
  { label: "Pose point de Hongrie / Versailles", unit: "€/m²", range: "75 – 130" },
  { label: "Ponçage + huile dure", unit: "€/m²", range: "30 – 45" },
  { label: "Ponçage + vitrification", unit: "€/m²", range: "25 – 40" },
  { label: "Reprise locale (réparation)", unit: "forfait", range: "180 – 450" },
];

function buildFaqs(city: string, tarif: string) {
  return [
    {
      q: `Quel est le prix d'un parqueteur à ${city} ?`,
      a: `À ${city}, comptez en moyenne ${tarif} pour la pose, et 25 à 45 €/m² pour un ponçage avec finition. Les tarifs varient selon l'essence de bois, le type de pose (clouée, collée, flottante) et l'état du support.`,
    },
    {
      q: `Combien de temps pour rénover un parquet à ${city} ?`,
      a: `Un ponçage + vitrification prend généralement 2 à 4 jours pour 30 m². Une pose complète demande 3 à 7 jours selon la surface et la complexité (point de Hongrie, Versailles). Le devis Parqueto précise la durée pour chaque chantier.`,
    },
    {
      q: `Vos parqueteurs à ${city} sont-ils assurés ?`,
      a: `Oui. Tous les artisans Parqueto à ${city} sont vérifiés : SIRET actif, assurance décennale et RC pro à jour, attestations contrôlées. Vous recevez les justificatifs avant la signature du devis.`,
    },
    {
      q: `Sous quel délai recevoir un devis à ${city} ?`,
      a: `Le devis est envoyé sous 24 à 48 h après votre estimation en ligne. Pour les chantiers urgents (dégât des eaux, sinistre), nos artisans à ${city} interviennent sous 72 h.`,
    },
    {
      q: `Faut-il poncer ou remplacer un vieux parquet ?`,
      a: `Tant qu'il reste 3 à 4 mm de couche d'usure, un parquet massif peut être poncé. En dessous, ou en cas de lames cassées sur plus de 20 % de la surface, le remplacement devient pertinent. Nos artisans à ${city} font le diagnostic gratuitement.`,
    },
    {
      q: `Quelle finition choisir : huile, vernis ou cire ?`,
      a: `L'huile dure (Rubio, Osmo) préserve l'aspect naturel et se rénove par zone — idéale pour parquet massif. Le vernis offre une protection maximale pour les pièces à fort passage. La cire reste réservée aux pièces sèches et peu passantes.`,
    },
  ];
}

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Estimation en ligne",
    text: "3 minutes pour décrire votre projet. Fourchette de prix immédiate.",
  },
  {
    n: "02",
    title: "Mise en relation",
    text: "Un artisan vérifié, sélectionné pour votre projet et votre quartier.",
  },
  {
    n: "03",
    title: "Visite & devis",
    text: "Diagnostic sur place, devis détaillé sous 24 à 48 h.",
  },
  {
    n: "04",
    title: "Chantier suivi",
    text: "Photos, documents et messages centralisés dans votre espace.",
  },
];

function CityPage() {
  const { city } = Route.useLoaderData();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* Hero éditorial */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-cream/50 via-background to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] [background-size:24px_24px]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-brand-orange">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <Link to="/artisans" className="hover:text-brand-orange">
              Parqueteurs
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{city.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                {city.region} · {city.population}
              </div>

              <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Parqueteur à <span className="italic text-brand-orange">{city.name}.</span>
                <span className="mt-2 block text-2xl font-normal text-muted-foreground sm:text-3xl">
                  Pose, ponçage, rénovation — par des artisans vérifiés.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Recevez un devis gratuit sous 24 h d'un parqueteur sélectionné pour votre projet à{" "}
                {city.name}. Artisans assurés décennale, prix transparents, suivi de chantier
                digital.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/estimation"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
                >
                  Estimer mon projet <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  <Phone className="h-4 w-4" /> Être rappelé
                </Link>
              </div>

              {/* Signaux de confiance */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Décennale vérifiée
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-orange" /> Devis sous 24 h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" /> Artisan sélectionné
                </span>
              </div>
            </div>

            {/* KPI card */}
            <aside className="lg:col-span-4">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft">
                <Stat label="Tarif moyen" value={city.tarifIndicatif} />
                <Stat label="Délai devis" value="24 h" />
                <Stat label="Garantie" value="10 ans" />
                <Stat label="Artisan" value="Vérifié" />
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Contexte local */}
      <section id="contexte" className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Spécificités locales
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Le parquet à {city.name}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{city.contexte}</p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
              <div className="min-w-0">
                <h3 className="font-display text-xl">Quartiers couverts</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nos parqueteurs partenaires interviennent dans tout {city.name} et ses environs
                  immédiats.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {city.quartiers.map((q: string) => (
                    <li
                      key={q}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prestations */}
      <section id="prestations" className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Nos services
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Prestations parquet à {city.name}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tous types de pose, toutes essences, toutes finitions. Du diagnostic à la livraison.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRESTATIONS.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  to={p.href}
                  className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-soft"
                >
                  <Icon className="h-7 w-7 text-brand-orange" />
                  <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
                    En savoir plus{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Liens prestations dédiées — SEO local longue traîne */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Pages dédiées
          </p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">
            Tous nos services parquet à {city.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Une page détaillée par prestation, avec la méthode, les tarifs et les spécificités
            locales à {city.name}.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOCAL_PRESTATIONS.map((p: Prestation) => (
              <li key={p.slug}>
                <Link
                  to="/parqueteur/$ville/$prestation"
                  params={{ ville: city.slug, prestation: p.slug }}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-soft"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base text-foreground">
                      {p.name} à {city.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.tarif}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>


      {/* Tarifs */}
      <section id="tarifs" className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Prix transparents
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Tarifs parqueteur à {city.name}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Fourchettes indicatives constatées chez nos artisans en {city.region}. Fournitures non
            comprises sauf mention.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Prestation</th>
                  <th className="px-5 py-3 text-right font-semibold">Tarif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PRICING_ROWS.map((row) => (
                  <tr key={row.label} className="transition hover:bg-secondary/30">
                    <td className="px-5 py-3.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-display text-base text-foreground">{row.range}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{row.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Euro className="h-3.5 w-3.5 text-brand-orange" /> Prix réels établis après diagnostic
            sur place. Devis gratuit et sans engagement.
          </p>
        </div>
      </section>

      {/* Process */}
      <section
        id="process"
        className="border-y border-border bg-secondary/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Comment ça marche
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            4 étapes simples pour votre projet à {city.name}
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange/40"
              >
                <span className="font-display text-3xl text-brand-orange">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagements qualité */}
      <section id="engagements" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Nos engagements
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Ce que nous garantissons à {city.name}
              </h2>
            </div>
          </div>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Artisan vérifié",
                text: "KBIS, décennale et RC Pro contrôlés chaque année. Vous recevez les justificatifs avant le devis.",
              },
              {
                title: "Devis détaillé",
                text: "Chaque poste est détaillé : main d'œuvre, matériaux, finition. Pas de chiffre d'accroche.",
              },
              {
                title: "Médiation incluse",
                text: "En cas de litige, Parqueto intervient en médiateur neutre. Vous n'êtes jamais seul face à un artisan.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
              >
                <CheckCircle2 className="h-6 w-6 text-brand-orange" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pourquoi Parqueto */}
      <section
        id="pourquoi"
        className="border-y border-border bg-secondary/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            La méthode Parqueto
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Pourquoi passer par Parqueto à {city.name} ?
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              `Artisans parqueteurs sélectionnés et vérifiés à ${city.name} (SIRET, décennale, RC pro).`,
              "Devis gratuit, détaillé, comparable — sans démarchage téléphonique.",
              "Tarifs transparents : vous voyez la fourchette avant même le premier rendez-vous.",
              "Réseau confrérie : nos artisans s'entraident sur les chantiers complexes.",
              "Suivi de chantier digital : photos, factures, garanties centralisées dans votre espace.",
              "Médiation Parqueto en cas de litige — vous n'êtes jamais seul.",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-sm text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Questions fréquentes
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Parquet à {city.name} : tout savoir
          </h2>

          <dl className="mt-10 space-y-3">
            {buildFaqs(city.name, city.tarifIndicatif).map((f, i) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange/40 open:border-brand-orange/40 open:shadow-soft"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-sm font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-brand-orange transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-border bg-brand-orange/5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Votre projet parquet à {city.name} commence ici.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Estimation en 3 minutes, devis sous 24 h, artisan vérifié sélectionné pour vous.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Démarrer mon estimation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              <Sparkles className="h-4 w-4 text-brand-orange" /> Analyser une photo
            </Link>
          </div>
        </div>
      </section>

      {/* Autres villes */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-xl text-foreground">Autres villes couvertes</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/parqueteur/$ville"
                  params={{ ville: c.slug }}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  Parqueteur {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-5">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-xl text-foreground sm:text-2xl">{value}</dd>
    </div>
  );
}
