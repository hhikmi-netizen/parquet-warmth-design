import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";

function NotFoundComponent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Décor parquet subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 18px, var(--brand-orange) 18px 19px, transparent 19px 60px), repeating-linear-gradient(115deg, transparent 0 80px, var(--brand-orange) 80px 81px, transparent 81px 240px)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          Erreur 404
        </p>

        <h1 className="mt-6 font-display text-7xl leading-none tracking-tight text-foreground sm:text-8xl lg:text-[9rem]">
          Lame{" "}
          <span className="italic text-brand-orange">manquante.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          La page que vous cherchez n'est plus à sa place — peut-être déposée, déplacée
          ou jamais posée. Pas de panique : on vous remet sur les bons rails.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/estimation"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Estimer mon projet
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Assistant IA
          </Link>
        </div>

        <div className="mt-14 w-full max-w-xl border-t border-border pt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Continuer la visite
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {[
              { to: "/realisations" as const, label: "Réalisations" },
              { to: "/artisans" as const, label: "Nos artisans" },
              { to: "/teintes" as const, label: "Teintes" },
              { to: "/blog" as const, label: "Blog" },
              { to: "/guide" as const, label: "Le guide" },
              { to: "/renovation-sinistre" as const, label: "Sinistre" },
              { to: "/confrerie-du-parquet" as const, label: "La Confrérie" },
              { to: "/contact" as const, label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full border border-border bg-card px-3 py-2 text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Parqueto — Estimation parquet & artisan vérifié" },
      {
        name: "description",
        content:
          "Estimez votre projet parquet (pose, ponçage, vitrification, rénovation) en quelques minutes, puis échangez avec un artisan partenaire vérifié. Sans démarchage.",
      },
      { name: "author", content: "Parqueto" },
      { name: "theme-color", content: "#E25822" },
      { property: "og:site_name", content: "Parqueto" },
      { property: "og:title", content: "Parqueto — Le parquet, sans détour" },
      { property: "og:description", content: "Estimation parquet en ligne et accompagnement par un artisan partenaire vérifié." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@parqueto" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Parqueto",
          url: "https://parqueto.fr",
          logo: "https://parqueto.fr/logo.png",
          email: "contact@parqueto.fr",
          areaServed: "FR",
          sameAs: [
            "https://instagram.com/parqueto",
            "https://linkedin.com/company/parqueto",
            "https://tiktok.com/@parqueto",
            "https://x.com/parqueto",
            "https://facebook.com/parqueto",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Parqueto",
          url: "https://parqueto.fr",
          inLanguage: "fr-FR",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://parqueto.fr/blog?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://parqueto.fr/#parqueto",
          name: "Parqueto",
          description:
            "Réseau d'artisans parqueteurs vérifiés en France. Pose, ponçage, vitrification, rénovation et réparation de parquet. Devis gratuit sous 24 h.",
          url: "https://parqueto.fr",
          image: "https://parqueto.fr/logo.png",
          telephone: "+33-1-00-00-00-00",
          priceRange: "€€",
          address: {
            "@type": "PostalAddress",
            addressCountry: "FR",
          },
          areaServed: { "@type": "Country", name: "France" },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "19:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "10:00",
              closes: "17:00",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "247",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:items-center focus:gap-2 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background focus:shadow-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Aller au contenu principal
    </a>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SkipToContent />
        <Outlet />
        <Toaster />
        <CookieBanner />
        <Analytics />
      </AuthProvider>
    </QueryClientProvider>
  );
}
