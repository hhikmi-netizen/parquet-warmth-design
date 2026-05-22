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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">Erreur 404</p>
        <h1 className="mt-3 font-display text-6xl text-foreground sm:text-7xl">Page introuvable</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas, a été déplacée ou n'est plus disponible.
          Continuez votre visite via les raccourcis ci-dessous.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/estimation"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Estimer mon projet
          </Link>
          <Link
            to="/guide"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Le guide du parquet
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
          <Link to="/realisations" className="hover:text-brand-orange">Réalisations</Link>
          <Link to="/artisans" className="hover:text-brand-orange">Nos artisans</Link>
          <Link to="/teintes" className="hover:text-brand-orange">Teintes</Link>
          <Link to="/blog" className="hover:text-brand-orange">Blog</Link>
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
      { title: "Parqueto — Estimation parquet en ligne & artisan partenaire" },
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
      </AuthProvider>
    </QueryClientProvider>
  );
}
