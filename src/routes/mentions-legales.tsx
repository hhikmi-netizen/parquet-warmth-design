import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsLegalesPage,
  head: () => ({
    meta: [
      { title: "Mentions légales — Parqueto" },
      {
        name: "description",
        content:
          "Mentions légales de Parqueto : éditeur du site, hébergeur, directeur de la publication, propriété intellectuelle et contact.",
      },
      { property: "og:title", content: "Mentions légales — Parqueto" },
      { property: "og:description", content: "Éditeur, hébergeur et contact du site Parqueto." },
      { property: "og:url", content: "/mentions-legales" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
});

function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
        <h1 className="font-display text-4xl text-foreground">Mentions légales</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la
          Confiance dans l'économie numérique (LCEN).
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Éditeur du site</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Le site <strong>parqueto.fr</strong> est édité par <strong>HIKMI Hicham</strong>,
            entrepreneur individuel exerçant sous le nom commercial <strong>HH Digital</strong>.<br />
            Siège social : 4 rue Pierre Kohlmann, 92160 Antony, France<br />
            SIREN : <strong>509 241 022</strong> — SIRET (établissement principal) :{" "}
            <strong>509 241 022 00037</strong><br />
            Code APE : 6311Z — Traitement de données, hébergement et activités connexes<br />
            Forme juridique : Entrepreneur individuel<br />
            TVA intracommunautaire : non applicable, article 293 B du CGI<br />
            Contact :{" "}
            <a href="mailto:contact@parqueto.fr" className="text-brand-orange">
              contact@parqueto.fr
            </a>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Directeur de la publication</h2>
          <p className="mt-3 text-sm text-muted-foreground">Hicham HIKMI, en qualité d'éditeur.</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Hébergement</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut,
            CA 91789, USA — <a href="https://vercel.com" className="text-brand-orange" rel="noopener noreferrer" target="_blank">vercel.com</a>.
            La base de données et les services backend sont fournis par <strong>Supabase</strong>
            (Supabase Inc., 970 Toa Payoh North #07-04, Singapour).
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Propriété intellectuelle</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            L'ensemble du site (textes, illustrations, photographies, marque, logo, code source,
            charte graphique) est protégé par le droit d'auteur et le droit des marques. Toute
            reproduction, représentation ou diffusion, totale ou partielle, sans autorisation
            écrite préalable est interdite et constitue une contrefaçon (articles L.335-2 et
            suivants du Code de la propriété intellectuelle).
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Responsabilité</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Les estimations affichées sur Parqueto sont fournies à titre indicatif et n'ont
            aucune valeur contractuelle. Seul le devis signé par l'artisan engage les parties.
            Parqueto agit en qualité d'intermédiaire technique entre clients particuliers et
            artisans indépendants : la prestation de pose, ponçage ou rénovation est réalisée
            sous la seule responsabilité de l'artisan choisi.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Médiation de la consommation</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas
            de litige non résolu avec Parqueto, le consommateur peut recourir gratuitement au
            médiateur de la consommation <strong>CNPM — Médiation de la consommation</strong>,
            27 avenue de la Libération, 42400 Saint-Chamond —{" "}
            <a href="https://cnpm-mediation-consommation.eu" className="text-brand-orange" rel="noopener noreferrer" target="_blank">cnpm-mediation-consommation.eu</a>.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">Données personnelles</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Le traitement de vos données personnelles est décrit dans notre{" "}
            <a href="/confidentialite" className="text-brand-orange">politique de confidentialité</a>.
          </p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
