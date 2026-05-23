import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Phone,
  Star,
  ShieldCheck,
  Clock,
  Euro,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getCityBySlug, CITIES } from "@/lib/cities";
import { getPrestationBySlug, PRESTATIONS } from "@/lib/prestations";

export const Route = createFileRoute("/parqueteur/$ville/$prestation")({
  loader: ({ params }) => {
    const city = getCityBySlug(params.ville);
    const prestation = getPrestationBySlug(params.prestation);
    if (!city || !prestation) throw notFound();
    return { city, prestation };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { city, prestation } = loaderData;
    const title = `${prestation.longName} à ${city.name} — devis 24 h · Parqueto`;
    const description = `${prestation.longName} à ${city.name} par un artisan vérifié. ${prestation.short} Tarif ${prestation.tarif}, devis sous 24 h, garantie décennale.`;
    const url = `/parqueteur/${city.slug}/${prestation.slug}`;
    const keywords = [
      ...prestation.keywords.map((k) => `${k} ${city.name}`),
      `${prestation.name.toLowerCase()} ${city.name}`,
      `artisan ${prestation.name.toLowerCase()} ${city.name}`,
      `devis ${prestation.name.toLowerCase()} ${city.name}`,
    ].join(", ");

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fr_FR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: prestation.longName,
            provider: {
              "@type": "LocalBusiness",
              name: `Parqueto — ${city.name}`,
              areaServed: { "@type": "City", name: city.name },
              priceRange: prestation.tarif,
              address: {
                "@type": "PostalAddress",
                addressLocality: city.name,
                postalCode: city.codePostalPrincipal,
                addressRegion: city.region,
                addressCountry: "FR",
              },
            },
            areaServed: { "@type": "City", name: city.name },
            description,
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "PriceSpecification",
                price: prestation.tarif,
                priceCurrency: "EUR",
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://parqueto.fr/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Parqueteurs",
                item: "https://parqueto.fr/artisans",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Parqueteur ${city.name}`,
                item: `https://parqueto.fr/parqueteur/${city.slug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: prestation.name,
                item: `https://parqueto.fr${url}`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: PrestationVillePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
          Page introuvable
        </p>
        <h1 className="mt-3 font-display text-3xl text-foreground">
          Cette combinaison ville / prestation n'existe pas
        </h1>
        <Link
          to="/estimation"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:bg-brand-orange-deep"
        >
          Estimer mon projet
        </Link>
      </div>
    </div>
  ),
});

function PrestationVillePage() {
  const { city, prestation } = Route.useLoaderData();

  // Autres prestations pour le maillage interne
  const otherPrestations = PRESTATIONS.filter((p) => p.slug !== prestation.slug).slice(0, 4);
  // Autres villes proches (même région) pour le maillage
  const sameRegionCities = CITIES.filter(
    (c) => c.slug !== city.slug && c.region.split(" ")[0] === city.region.split(" ")[0],
  ).slice(0, 6);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-cream/50 via-background to-background">
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-brand-orange">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <Link to="/artisans" className="hover:text-brand-orange">
              Parqueteurs
            </Link>
            <span aria-hidden>/</span>
            <Link
              to="/parqueteur/$ville"
              params={{ ville: city.slug }}
              className="hover:text-brand-orange"
            >
              {city.name}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{prestation.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                {city.region} · {city.population}
              </div>

              <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                {prestation.longName} à{" "}
                <span className="italic text-brand-orange">{city.name}.</span>
                <span className="mt-2 block text-2xl font-normal text-muted-foreground sm:text-3xl">
                  Artisan vérifié · devis gratuit sous 24 h.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {prestation.short} À {city.name}, comptez en moyenne{" "}
                <strong className="text-foreground">{prestation.tarif}</strong> pour cette
                prestation, avec un délai de {prestation.duree}.
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

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                  <strong className="font-semibold text-foreground">4,8 / 5</strong> · 247 avis
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Décennale vérifiée
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-orange" /> Devis sous 24 h
                </span>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft">
                <Stat label="Tarif" value={prestation.tarif} />
                <Stat label="Durée" value={prestation.duree.split(" pour")[0]} />
                <Stat label="Devis" value="24 h" />
                <Stat label="Garantie" value="10 ans" />
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            En quoi ça consiste
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            {prestation.name} à {city.name}, comment ça se passe ?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {prestation.description}
          </p>

          {/* Contexte local */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Contexte local
            </p>
            <h3 className="mt-2 font-display text-xl">Spécificités à {city.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{city.contexte}</p>
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Méthode
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Les étapes — {prestation.name.toLowerCase()}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prestation.etapes.map((e, i) => (
              <div
                key={e.title}
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-brand-orange/40 hover:shadow-soft"
              >
                <span className="font-display text-3xl text-brand-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Pourquoi Parqueto
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Ce que vous obtenez à {city.name}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {prestation.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-sm text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Maillage : autres prestations dans la même ville */}
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Autres prestations
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Nos parqueteurs à {city.name} couvrent aussi
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherPrestations.map((p) => (
              <Link
                key={p.slug}
                to="/parqueteur/$ville/$prestation"
                params={{ ville: city.slug, prestation: p.slug }}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-soft"
              >
                <h3 className="font-display text-lg">
                  {p.name} à {city.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
                  Voir <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Maillage : même prestation, villes proches */}
      {sameRegionCities.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Près de {city.name}
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              {prestation.name} dans les villes voisines
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {sameRegionCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/parqueteur/$ville/$prestation"
                    params={{ ville: c.slug, prestation: prestation.slug }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                    {prestation.name} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="border-t border-border bg-foreground py-16 text-background sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-background sm:text-4xl">
            Votre devis <span className="italic text-brand-orange">{prestation.name.toLowerCase()}</span> à{" "}
            {city.name}, sous 24 h.
          </h2>
          <p className="mt-4 text-background/70">
            Estimation gratuite, sans engagement, par un artisan vérifié.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              <Euro className="h-4 w-4" /> Estimer mon projet
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/parqueteur/$ville"
              params={{ ville: city.slug }}
              className="inline-flex items-center gap-2 rounded-full border border-background/25 px-5 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
            >
              Toutes les prestations à {city.name}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg text-foreground">{value}</dd>
    </div>
  );
}
