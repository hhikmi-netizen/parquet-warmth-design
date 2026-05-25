import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/confidentialite")({
  component: ConfidentialitePage,
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Parqueto" },
      {
        name: "description",
        content:
          "Politique de confidentialité Parqueto : quelles données nous collectons, pourquoi, combien de temps nous les conservons et comment exercer vos droits RGPD.",
      },
      { property: "og:title", content: "Politique de confidentialité — Parqueto" },
      { property: "og:description", content: "Données collectées, finalités, durées et vos droits RGPD." },
      { property: "og:url", content: "/confidentialite" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
});

function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
        <h1 className="font-display text-4xl text-foreground">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour&nbsp;: {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}.
          Conforme au Règlement Général sur la Protection des Données (RGPD, UE 2016/679) et à la
          loi Informatique et Libertés modifiée.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">1. Responsable du traitement</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Parqueto — contact&nbsp;:{" "}
            <a href="mailto:contact@parqueto.fr" className="text-brand-orange">contact@parqueto.fr</a>.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">2. Données collectées</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li><strong>Estimation parquet</strong>&nbsp;: surface, type de pose, état du support, photos optionnelles, code postal.</li>
            <li><strong>Mise en relation</strong>&nbsp;: prénom, nom, email, téléphone, adresse du chantier.</li>
            <li><strong>Compte artisan</strong>&nbsp;: raison sociale, SIRET, assurance décennale, RC Pro, zone d'intervention.</li>
            <li><strong>Navigation</strong>&nbsp;: cookies essentiels (session, consentement) et, avec votre accord, mesure d'audience anonyme.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">3. Finalités et bases légales</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Fournir le service d'estimation et de mise en relation — <em>exécution du contrat</em>.</li>
            <li>Gérer votre compte et la facturation artisan — <em>exécution du contrat</em>.</li>
            <li>Envoyer la newsletter et les communications commerciales — <em>consentement</em>.</li>
            <li>Mesurer l'audience anonyme du site — <em>consentement</em>.</li>
            <li>Lutter contre la fraude et respecter nos obligations légales — <em>intérêt légitime / obligation légale</em>.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">4. Destinataires</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Vos données sont accessibles aux équipes Parqueto, à l'artisan partenaire désigné pour
            votre projet (uniquement les informations nécessaires à l'établissement du devis) et à
            nos sous-traitants techniques (hébergement Vercel, base de données Supabase, envoi
            d'emails). Vos données ne sont jamais vendues à des tiers.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">5. Durées de conservation</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Demandes d'estimation&nbsp;: 3 ans après le dernier contact.</li>
            <li>Compte utilisateur&nbsp;: durée de vie du compte + 3 ans.</li>
            <li>Documents comptables&nbsp;: 10 ans (obligation légale).</li>
            <li>Cookies de mesure&nbsp;: 13 mois maximum.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">6. Transferts hors UE</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Certains sous-traitants (Vercel, Supabase) peuvent héberger des données aux États-Unis.
            Ces transferts sont encadrés par les Clauses Contractuelles Types de la Commission
            européenne et, le cas échéant, par le Data Privacy Framework.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">7. Vos droits</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de
            limitation, de portabilité et du droit de définir des directives post-mortem. Pour
            les exercer&nbsp;: <a href="mailto:contact@parqueto.fr" className="text-brand-orange">contact@parqueto.fr</a>.
            En cas de désaccord, vous pouvez introduire une réclamation auprès de la CNIL
            (<a href="https://www.cnil.fr" className="text-brand-orange" rel="noopener noreferrer" target="_blank">cnil.fr</a>).
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">8. Cookies</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Le site dépose uniquement les cookies strictement nécessaires à son fonctionnement
            (préférences de consentement, session). Aucun cookie de pistage publicitaire n'est
            utilisé. Si une mesure d'audience est activée, elle l'est uniquement après votre
            consentement explicite via la bannière dédiée et de façon anonymisée.
          </p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
