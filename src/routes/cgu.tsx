import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/cgu")({
  component: CGUPage,
  head: () => ({
    meta: [
      { title: "Conditions Générales d'Utilisation — Parqueto" },
      {
        name: "description",
        content:
          "Conditions Générales d'Utilisation (CGU) du site et des services Parqueto : estimation parquet, mise en relation client-artisan, droits et obligations.",
      },
      { property: "og:title", content: "CGU — Parqueto" },
      { property: "og:description", content: "Règles d'usage du site et du service de mise en relation Parqueto." },
      { property: "og:url", content: "/cgu" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/cgu" }],
  }),
});

function CGUPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
        <h1 className="font-display text-4xl text-foreground">Conditions Générales d'Utilisation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Version en vigueur au {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">1. Objet</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Les présentes CGU régissent l'utilisation du site <strong>parqueto.fr</strong>, qui
            propose un service d'estimation en ligne de travaux de parquet (pose, ponçage,
            vitrification, rénovation) et de mise en relation entre particuliers et artisans
            partenaires indépendants.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">2. Acceptation</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            L'utilisation du site implique l'acceptation pleine et entière des présentes CGU.
            En cas de désaccord, l'utilisateur est invité à ne pas utiliser le service.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">3. Service client (particulier)</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>L'estimation est <strong>gratuite</strong> et fournie à titre indicatif uniquement.</li>
            <li>Aucune valeur contractuelle&nbsp;: seul le devis signé avec l'artisan engage les parties.</li>
            <li>Parqueto sélectionne un artisan partenaire correspondant à votre zone et à votre besoin.</li>
            <li>Aucun paiement n'est demandé au particulier&nbsp;: le service de mise en relation est gratuit.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">4. Service artisan partenaire</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>L'inscription est réservée aux professionnels disposant d'un SIRET valide et d'une assurance décennale en cours de validité.</li>
            <li>L'accès aux projets clients fonctionne selon deux modalités&nbsp;: <strong>abonnement mensuel</strong> au réseau et/ou <strong>achat de leads à l'unité</strong>. Aucune commission n'est prélevée sur les devis signés.</li>
            <li>Un projet client = un seul artisan désigné. Pas de revente du même lead à plusieurs entreprises.</li>
            <li>L'artisan s'engage à respecter la charte qualité Parqueto&nbsp;: réactivité, transparence des prix, traitement professionnel du chantier.</li>
            <li>Remboursement automatique en cas de client injoignable sous 5 jours ouvrés ou de demande hors zone.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">5. Tarifs et facturation artisan</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Les tarifs détaillés de l'abonnement et des leads à l'unité sont présentés sur la
            page <a href="/devenir-artisan" className="text-brand-orange">Devenir artisan partenaire</a>
            et confirmés lors de la souscription. Les paiements sont traités via prestataire
            sécurisé. Les factures sont disponibles dans l'espace Pro.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">6. Rétractation</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Conformément aux articles L.221-18 et suivants du Code de la consommation, l'artisan
            professionnel ne bénéficie pas du droit de rétractation lorsque le contrat est conclu
            dans le cadre de son activité. Les particuliers utilisant le service d'estimation
            gratuit ne contractent aucun engagement payant via Parqueto.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">7. Responsabilités</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Parqueto agit en qualité d'intermédiaire technique. La réalisation effective des
            travaux est sous la responsabilité exclusive de l'artisan choisi. Parqueto ne peut
            être tenu responsable des malfaçons, retards ou litiges liés à l'exécution du
            chantier, sans préjudice de la garantie de remboursement du lead prévue par la charte
            qualité.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">8. Données personnelles</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Le traitement des données est détaillé dans la{" "}
            <a href="/confidentialite" className="text-brand-orange">politique de confidentialité</a>.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">9. Médiation et droit applicable</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Les présentes CGU sont soumises au droit français. En cas de litige, une solution
            amiable sera recherchée avant toute action judiciaire. Le consommateur peut recourir
            gratuitement à un médiateur de la consommation conformément aux articles L.611-1 et
            suivants du Code de la consommation. À défaut, les tribunaux français seront seuls
            compétents.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-foreground">10. Modifications</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Parqueto se réserve le droit de modifier les présentes CGU à tout moment. La version
            applicable est celle en ligne au moment de l'utilisation du service.
          </p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
