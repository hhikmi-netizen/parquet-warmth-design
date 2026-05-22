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
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import sinistreImg from "@/assets/parquet-degat-eaux.jpg";

export const Route = createFileRoute("/renovation-sinistre")({
  component: SinistrePage,
  head: () => ({
    meta: [
      { title: "Rénovation parquet après sinistre — dégât des eaux, incendie · Parqueto" },
      {
        name: "description",
        content:
          "Parquet gondolé, taché ou brûlé après un sinistre ? Estimation rapide, artisan vérifié, dossier compatible assurance. Intervention sous 48 h en Île-de-France.",
      },
      { property: "og:title", content: "Rénovation parquet après sinistre · Parqueto" },
      {
        property: "og:description",
        content:
          "Dégât des eaux, incendie, fuite : on cadre votre dossier, on vous oriente vers un artisan vérifié, on documente pour votre assurance.",
      },
      { property: "og:image", content: sinistreImg },
    ],
  }),
});

const TYPES = [
  {
    icon: Droplets,
    title: "Dégât des eaux",
    body: "Fuite, infiltration, inondation : lames gondolées, tuilage, taches noires. Diagnostic d'humidité, dépose des zones atteintes, séchage et repose à l'identique.",
  },
  {
    icon: Flame,
    title: "Incendie & fumée",
    body: "Brûlures de surface, dépôts de suie, vernis altéré. Ponçage profond, traitement antifumée, nouvelle finition compatible avec l'essence d'origine.",
  },
  {
    icon: AlertTriangle,
    title: "Choc, rayures, taches",
    body: "Élément de mobilier tombé, produit corrosif, animal. Reprise localisée, raccord d'essence et de teinte, vitrification de la zone.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Constat & photos",
    body: "Vous nous décrivez le sinistre en 2 minutes via l'estimateur, photos comprises. On vous répond sous 24 h ouvrées.",
  },
  {
    n: "02",
    title: "Diagnostic sur place",
    body: "L'artisan partenaire mesure l'humidité, identifie l'essence et la finition d'origine, chiffre la remise en état.",
  },
  {
    n: "03",
    title: "Devis & rapport assurance",
    body: "Devis détaillé ligne par ligne + rapport photo daté, directement transmissible à votre assureur ou expert.",
  },
  {
    n: "04",
    title: "Chantier & garantie",
    body: "Dépose, séchage, repose, finition. Travaux couverts par la décennale de l'artisan, suivi Parqueto jusqu'à réception.",
  },
];

const FAQ = [
  {
    q: "Mon assurance prend-elle en charge la rénovation ?",
    a: "Dans la majorité des cas oui : dégât des eaux, incendie et catastrophe naturelle sont couverts par la multirisque habitation. Notre devis détaillé est conçu pour être directement transmis à votre assureur ou à l'expert mandaté.",
  },
  {
    q: "Faut-il déposer tout le parquet ou seulement la zone abîmée ?",
    a: "Tout dépend de l'étendue du sinistre, du type de pose (collée, clouée, flottante) et de l'essence. L'artisan privilégie toujours la reprise localisée quand c'est techniquement possible, pour limiter le coût et préserver le caractère du parquet d'origine.",
  },
  {
    q: "Combien de temps pour intervenir après un sinistre ?",
    a: "Premier retour en moins de 24 h ouvrées. Diagnostic sur place sous 48 à 72 h en Île-de-France. La durée du chantier varie selon le séchage nécessaire (souvent 7 à 14 jours pour un dégât des eaux).",
  },
  {
    q: "Et si l'essence d'origine n'existe plus ?",
    a: "Nos artisans disposent d'un stock de lames anciennes (chêne massif, bâtons rompus, point de Hongrie) et savent rattraper les teintes par mélange d'huiles ou vitrification teintée. Un raccord invisible est presque toujours possible.",
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
              Service spécialisé · Sinistre
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Parquet abîmé après un sinistre ?
              <span className="block italic text-brand-orange">On le remet en état.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Dégât des eaux, incendie, fuite, choc : un artisan parqueteur vérifié intervient,
              chiffre, documente — et vous transmet un dossier compatible assurance. Premier retour
              sous 24 h ouvrées.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/estimation"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
              >
                Lancer mon dossier sinistre
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                <Phone className="h-4 w-4" />
                Urgence : nous joindre
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Réponse en moins de 24 h</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Devis détaillé pour l'assureur</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Artisans couverts décennale</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Reprise localisée si possible</li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl shadow-warm">
              <img
                src={sinistreImg}
                alt="Parquet en chêne gondolé après un dégât des eaux — lames soulevées par l'humidité"
                className="aspect-[4/5] w-full object-cover"
                width={1200}
                height={1500}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-5 text-background">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Cas réel</p>
                <p className="mt-1 font-display text-xl">Parquet chêne gondolé — dégât des eaux</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Types de sinistre
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Trois familles, <span className="italic text-brand-orange">trois protocoles.</span>
            </h2>
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
                Notre process
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Du constat à la <span className="italic text-brand-orange">remise en état.</span>
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
                  Un dossier prêt pour votre assureur
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Chaque intervention sinistre livre un devis détaillé ligne par ligne, un rapport
                  photo daté et un descriptif technique. Vous transmettez le tout en l'état à votre
                  assureur ou à l'expert mandaté — sans rien re-saisir.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Artisans couverts par une décennale en cours de validité</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Diagnostic d'humidité avant toute repose</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-orange" />
                    <span>Compatibilité avec les barèmes d'expertise courants</span>
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
          <h2 className="font-display text-3xl sm:text-4xl">Questions fréquentes</h2>
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

          {/* FAQ JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-balance sm:text-4xl">
            Votre parquet a souffert ? <span className="italic text-brand-orange">On s'en occupe.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Décrivez votre sinistre en 2 minutes, ajoutez vos photos. Un artisan partenaire
            reprend contact sous 24 h.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Démarrer mon dossier
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
