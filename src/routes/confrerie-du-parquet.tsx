import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  MessageCircle,
  Hammer,
  GraduationCap,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Trophy,
  Coffee,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/confrerie-du-parquet")({
  component: ConfreriePage,
  head: () => ({
    meta: [
      {
        title:
          "La Confrérie du Parquet — communauté privée des parqueteurs · Parqueto",
      },
      {
        name: "description",
        content:
          "La Confrérie du Parquet : communauté privée des artisans parqueteurs Parqueto. Entraide technique, formations, rencontres terrain, défense du métier. Sur invitation, gratuit.",
      },
      { property: "og:title", content: "La Confrérie du Parquet · Parqueto" },
      {
        property: "og:description",
        content:
          "Entre parqueteurs, pas entre commerciaux. Entraide technique, formations, rencontres, défense du métier.",
      },
      { property: "og:url", content: "/confrerie-du-parquet" },
    ],
    links: [{ rel: "canonical", href: "/confrerie-du-parquet" }],
  }),
});

const PILLARS = [
  {
    icon: MessageCircle,
    title: "Entraide technique 7j/7",
    body:
      "Un canal privé (WhatsApp + forum) où poser une vraie question : un point de Hongrie qui ne tombe pas juste, une teinte impossible à raccorder, un client qui dérape. Les anciens répondent.",
  },
  {
    icon: GraduationCap,
    title: "Masterclasses & démos",
    body:
      "Une session par mois animée par un maître parqueteur ou un fournisseur : finition huile dure, pose collée sur sol chauffant, restauration de parquet de Versailles. En visio ou en atelier.",
  },
  {
    icon: Hammer,
    title: "Achats groupés",
    body:
      "Tarifs négociés avec les fournisseurs partenaires (Bona, Blanchon, Junckers, Berry Floor) : -8 à -18 % pour les membres. Pas de minimum de commande.",
  },
  {
    icon: Trophy,
    title: "Trophée du chantier de l'année",
    body:
      "Chaque hiver, les membres votent. Le gagnant est mis en avant pendant 12 mois sur Parqueto, presse pro et réseaux. Une vraie vitrine.",
  },
  {
    icon: Coffee,
    title: "Rencontres terrain",
    body:
      "Petits-déjeuners trimestriels à Paris, visites d'ateliers, journées découverte chez un fournisseur. On se voit pour de vrai — c'est rare dans ce métier.",
  },
  {
    icon: Handshake,
    title: "Défense du métier",
    body:
      "Parqueto porte les sujets communs : reconnaissance du métier de parqueteur, lutte contre le démarchage déloyal, dialogue avec les assureurs. Vous êtes consultés, pas représentés sans avis.",
  },
];

const COMMITMENTS = [
  "Rester correct entre membres — pas de débauchage agressif, pas de dénigrement",
  "Partager au moins une fois par trimestre (question, retour de chantier, photo)",
  "Honorer ses engagements clients — la Confrérie défend ceux qui défendent leur travail",
  "Respecter la confidentialité — ce qui se dit ici reste ici",
];

function ConfreriePage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground focus:outline-none">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grain absolute inset-0 opacity-40" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3 w-3 text-brand-orange" />
              Sur invitation · Gratuit · Pour artisans parqueteurs
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              La Confrérie
              <span className="block italic text-brand-orange">du Parquet.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Le métier de parqueteur se transmet d'atelier en atelier, pas dans des manuels.
              La <strong className="font-semibold text-foreground">Confrérie du Parquet</strong>{" "}
              remet ce lien au centre : une communauté privée où les artisans Parqueto s'entraident,
              se forment, négocient ensemble et défendent leur métier — entre eux, sans démarcheurs,
              sans bruit commercial.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/devenir-artisan"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
              >
                Demander à rejoindre
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/artisan-verifie"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                Voir le badge Artisan Vérifié
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Accès réservé aux artisans titulaires du badge Artisan Vérifié Parqueto.
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-warm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Users className="h-5 w-5" />
                </div>
                <p className="font-display text-lg">La Confrérie en chiffres</p>
              </div>
              <dl className="mt-6 space-y-4">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Membres fondateurs</dt>
                  <dd className="font-display text-2xl">28</dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Régions couvertes</dt>
                  <dd className="font-display text-2xl">5</dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-muted-foreground">Masterclass/an</dt>
                  <dd className="font-display text-2xl">12</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-muted-foreground">Frais d'adhésion</dt>
                  <dd className="font-display text-2xl text-brand-orange">0&nbsp;€</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Six piliers
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Entre parqueteurs, <span className="italic text-brand-orange">pas entre commerciaux.</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="border-y border-border bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Notre charte
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Quatre engagements,{" "}
              <span className="italic text-brand-orange">non négociables.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une communauté forte commence par des règles claires. Voici les quatre engagements
              que chaque membre prend en rejoignant la Confrérie. Un manquement = un avertissement.
              Deux = la porte.
            </p>
          </div>
          <ul className="space-y-3">
            {COMMITMENTS.map((c, i) => (
              <li
                key={c}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 font-display text-xs text-brand-orange">
                  {i + 1}
                </span>
                <span className="text-sm">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Comment rejoindre
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Trois étapes, <span className="italic text-brand-orange">aucun frais.</span>
            </h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              <li>
                <span className="font-display text-4xl text-brand-orange/80">01</span>
                <h3 className="mt-2 font-display text-lg">Devenir Artisan Vérifié</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Décennale, SIRET, savoir-faire évalué. C'est le pré-requis.
                </p>
              </li>
              <li>
                <span className="font-display text-4xl text-brand-orange/80">02</span>
                <h3 className="mt-2 font-display text-lg">Parrainage ou cooptation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Un membre actuel vous propose, ou Parqueto vous invite après vos premiers chantiers réussis.
                </p>
              </li>
              <li>
                <span className="font-display text-4xl text-brand-orange/80">03</span>
                <h3 className="mt-2 font-display text-lg">Signer la charte</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Quatre engagements. Une lecture. Une signature. Vous êtes dedans.
                </p>
              </li>
            </ol>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> 0 € · à vie</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Aucun engagement de volume</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Sortie libre à tout moment</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-orange" /> Confidentialité garantie</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-balance sm:text-4xl">
            Le parquet est un métier de transmission.{" "}
            <span className="italic text-brand-orange">Reprenons-la.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            La Confrérie ouvre 12 nouvelles places par trimestre. Si vous êtes parqueteur en
            activité et titulaire d'une décennale en cours, vous y avez votre place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm transition hover:bg-brand-orange-deep"
            >
              Candidater
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Une question ? Nous écrire
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
