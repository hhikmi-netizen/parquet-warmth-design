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
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CITIES, getCityBySlug } from "@/lib/cities";

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
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: `parqueteur ${city.name}, pose parquet ${city.name}, ponçage parquet ${city.name}, rénovation parquet ${city.name}, devis parquet ${city.name}, artisan parquet ${city.name}` },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/parqueteur/${city.slug}` },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fr_FR" },
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
            telephone: "+33-1-00-00-00-00",
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
              { "@type": "ListItem", position: 3, name: `Parqueteur ${city.name}`, item: `https://parqueto.fr/parqueteur/${city.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Ville non couverte</p>
        <h1 className="mt-3 font-display text-3xl text-foreground">Cette ville n'est pas encore référencée</h1>
        <p className="mt-3 text-sm text-muted-foreground">Nous étendons progressivement notre réseau. Consultez les villes disponibles ou demandez un devis personnalisé.</p>
        <Link to="/contact" className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-brand-orange-deep">Demander un devis</Link>
      </div>
    </div>
  ),
});

const PRESTATIONS = [
  { icon: Hammer, title: "Pose de parquet neuf", text: "Massif, contrecollé, stratifié. Pose clouée, collée ou flottante selon votre support.", href: "/estimation" },
  { icon: Sparkles, title: "Ponçage + vitrification", text: "Redonner éclat et protection à un parquet existant. Finition huile, vernis ou cire.", href: "/estimation" },
  { icon: Wrench, title: "Rénovation complète", text: "Diagnostic, recollage, ponçage doux, finition adaptée à l'époque du parquet.", href: "/estimation" },
  { icon: Droplets, title: "Réparation dégât des eaux", text: "Intervention rapide après sinistre, devis assurance, reprise localisée.", href: "/renovation-sinistre" },
];

function CityPage() {
  const { city } = Route.useLoaderData();

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-brand-orange">Accueil</Link>
            <span>/</span>
            <Link to="/artisans" className="hover:text-brand-orange">Parqueteurs</Link>
            <span>/</span>
            <span className="text-foreground">{city.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-brand-orange" />
            {city.region} · {city.population}
          </div>

          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Parqueteur à <span className="italic text-brand-orange">{city.name}.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Pose, ponçage, vitrification et rénovation de parquet à {city.name} et alentours. Artisans vérifiés, assurés décennale, devis gratuit sous 24 h.
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

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Tarif moyen</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">{city.tarifIndicatif}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Délai devis</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">24 h</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Garantie</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">Décennale</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Avis vérifiés</dt>
              <dd className="mt-1 font-display text-2xl text-foreground">4,8 / 5</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Contexte local */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">Le parquet à {city.name}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{city.contexte}</p>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
              <div>
                <h3 className="font-display text-xl">Quartiers couverts</h3>
                <p className="mt-1 text-sm text-muted-foreground">Nos parqueteurs partenaires interviennent dans tout {city.name} et ses environs immédiats.</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {city.quartiers.map((q: string) => (
                    <li key={q} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
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
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">Nos prestations parquet à {city.name}</h2>
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
                    En savoir plus <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi Parqueto */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">Pourquoi passer par Parqueto à {city.name} ?</h2>
          <ul className="mt-8 space-y-4">
            {[
              `Artisans parqueteurs sélectionnés et vérifiés à ${city.name} (SIRET, décennale, RC pro).`,
              "Devis gratuit, détaillé, comparable — sans démarchage téléphonique.",
              "Tarifs transparents : vous voyez la fourchette avant même le premier rendez-vous.",
              "Réseau confrérie : nos artisans s'entraident sur les chantiers complexes.",
              "Suivi de chantier : photos, factures, garanties centralisées dans votre espace.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-sm text-foreground">{t}</span>
              </li>
            ))}
          </ul>
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
