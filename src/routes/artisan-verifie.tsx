import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  BadgeCheck,
  Download,
  Share2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/artisan-verifie")({
  component: BadgePage,
  head: () => ({
    meta: [
      {
        title:
          "Badge Artisan Vérifié Parqueto — réputation portable du parqueteur",
      },
      {
        name: "description",
        content:
          "Le badge Artisan Vérifié Parqueto : décennale contrôlée, identité validée, avis clients certifiés. Un actif de réputation portable (HTML, PDF, QR code) que vos clients reconnaissent.",
      },
      { property: "og:title", content: "Badge Artisan Vérifié Parqueto" },
      {
        property: "og:description",
        content:
          "Décennale contrôlée, identité validée, avis certifiés. Le badge que vous emportez partout.",
      },
      { property: "og:url", content: "/artisan-verifie" },
    ],
    links: [{ rel: "canonical", href: "/artisan-verifie" }],
  }),
});

const CRITERIA = [
  {
    icon: ShieldCheck,
    title: "Décennale en cours",
    body: "Attestation vérifiée chaque année auprès de l'assureur. Pas de copie périmée.",
  },
  {
    icon: Lock,
    title: "Identité & SIRET validés",
    body: "KBIS, pièce d'identité du dirigeant, immatriculation au répertoire des métiers.",
  },
  {
    icon: BadgeCheck,
    title: "Savoir-faire évalué",
    body: "Entretien technique, photos de chantiers, références vérifiables.",
  },
  {
    icon: Sparkles,
    title: "Avis clients certifiés",
    body: "Avis collectés par Parqueto auprès de vrais clients, après chantier livré.",
  },
];

const BENEFITS = [
  "Page publique parqueto.fr/p/votre-nom pour vos prospects hors-Parqueto",
  "Badge HTML à embarquer sur votre site (3 lignes de code)",
  "Version PDF imprimable pour rendez-vous client et devis",
  "QR code unique vers votre page de vérification en direct",
  "Mention « Vérifié le JJ/MM/AAAA » mise à jour automatiquement",
  "Révocable : un manquement, le badge tombe — donc il vaut quelque chose",
];

function BadgePage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grain absolute inset-0 opacity-40" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Pour les artisans parqueteurs
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Votre réputation,
              <span className="block italic text-brand-orange">vous l'emportez partout.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Le <strong className="font-semibold text-foreground">Badge Artisan Vérifié Parqueto</strong>{" "}
              certifie votre sérieux — décennale, identité, savoir-faire, avis clients — sous une forme
              portable : page publique, embed HTML, PDF imprimable, QR code. Pas une étoile de plus
              dans un annuaire : un actif que vos clients reconnaissent, même en dehors de Parqueto.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/devenir-artisan"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
              >
                Demander mon badge
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

          {/* Mock badge card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-border bg-card p-8 shadow-warm">
              <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
                <BadgeCheck className="h-3.5 w-3.5" /> Vérifié
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 font-display text-2xl text-brand-orange">
                  JM
                </div>
                <div>
                  <p className="font-display text-xl">Jean-Marc L.</p>
                  <p className="text-sm text-muted-foreground">Parqueteur · Paris 11ᵉ</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Décennale</dt>
                  <dd className="mt-1 font-semibold text-foreground">À jour · 12/2026</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">SIRET</dt>
                  <dd className="mt-1 font-semibold text-foreground">Vérifié</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Chantiers</dt>
                  <dd className="mt-1 font-semibold text-foreground">Exemple</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Avis certifiés</dt>
                  <dd className="mt-1 font-semibold text-foreground">À jour</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <QrCode className="h-9 w-9 text-foreground" />
                  <span>
                    Vérifiez en direct sur
                    <br />
                    <span className="font-mono text-foreground">parqueto.fr/p/jm-l</span>
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Vérifié le 22/05/2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Criteria */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Ce que le badge atteste
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Quatre vérifications, <span className="italic text-brand-orange">renouvelées chaque année.</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CRITERIA.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Ce que vous emportez avec vous
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Un actif portable, <span className="italic text-brand-orange">pas un label captif.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trop de plateformes enferment votre réputation derrière leur logo. Parqueto fait l'inverse :
              le badge est <strong className="text-foreground">à vous</strong>. Sur votre site, dans vos
              devis, sur votre carte de visite, dans un mail à un prospect rencontré sur un chantier.
            </p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Trois formats, un même badge
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              HTML, PDF, QR code.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Share2 className="h-6 w-6 text-brand-orange" />
              <h3 className="mt-4 font-display text-xl">Embed HTML</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                3 lignes de code à coller sur votre site. Badge dynamique, mis à jour en temps réel
                quand votre décennale est renouvelée ou qu'un nouvel avis est ajouté.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Download className="h-6 w-6 text-brand-orange" />
              <h3 className="mt-4 font-display text-xl">PDF imprimable</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Une page A4 propre, datée, avec QR code. À joindre à un devis, à afficher dans le
                showroom, à laisser après un rendez-vous client.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <QrCode className="h-6 w-6 text-brand-orange" />
              <h3 className="mt-4 font-display text-xl">Page publique + QR</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Une URL courte (<span className="font-mono text-foreground">parqueto.fr/p/votre-nom</span>)
                avec votre fiche complète. Le QR mène à la version live, vérifiable par n'importe qui.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-balance sm:text-4xl">
            Prêt à porter votre réputation ?{" "}
            <span className="italic text-brand-orange">Rejoignez le réseau.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Le badge est accordé après vérification de votre dossier (décennale, identité, savoir-faire).
            Comptez 5 à 10 jours ouvrés. Aucun frais pour les artisans partenaires.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Demander mon badge
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/confrerie-du-parquet"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Découvrir la Confrérie du Parquet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
