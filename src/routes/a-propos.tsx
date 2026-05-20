import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Hammer, Compass, HandshakeIcon, ShieldCheck } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";
import artisanImg from "@/assets/about-artisan.jpg";
import detailImg from "@/assets/about-detail.jpg";

export const Route = createFileRoute("/a-propos")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "À propos — Parqueto, né du terrain" },
      {
        name: "description",
        content:
          "Parqueto a été imaginé par un artisan parqueteur fort de près de 20 ans d'expérience. Une plateforme pensée par quelqu'un qui connaît réellement les chantiers, les clients et les artisans.",
      },
      { property: "og:title", content: "À propos — Parqueto, né du terrain" },
      {
        property: "og:description",
        content:
          "Pensé par un artisan parqueteur, fondateur d'Antony Parquet. 19 ans de chantiers, de devis et de bois travaillé à la main.",
      },
      { property: "og:image", content: artisanImg },
    ],
  }),
});

const constats = [
  "Des clients souvent perdus dans des devis flous et difficiles à comparer.",
  "Des budgets approximatifs qui se transforment en mauvaises surprises.",
  "Des demandes dispersées sur dix plateformes, traitées à la chaîne.",
  "Des artisans sérieux noyés sous des leads partagés et peu qualifiés.",
  "Au final, beaucoup de temps perdu — des deux côtés.",
];

const reponses = [
  {
    icon: Compass,
    title: "Cadrer le projet correctement",
    text: "Surface, état du parquet, type de pose, finition : un cadrage clair dès la première minute, comme le ferait un artisan sur place.",
  },
  {
    icon: Hammer,
    title: "Donner une estimation immédiate",
    text: "Une fourchette de prix honnête, basée sur des prix de marché réels — pas sur un script marketing.",
  },
  {
    icon: HandshakeIcon,
    title: "Simplifier les échanges",
    text: "Un seul interlocuteur, un seul artisan partenaire. Pas de surenchère, pas de démarchage, pas de course au moins-disant.",
  },
  {
    icon: ShieldCheck,
    title: "Confier au bon artisan",
    text: "Chaque projet est dirigé vers un professionnel vérifié dont la spécialité, la zone et les disponibilités correspondent vraiment.",
  },
];

const preuves = [
  { v: "≈ 19 ans", l: "dans le parquet et la rénovation" },
  { v: "Antony Parquet", l: "société fondée par le créateur de Parqueto" },
  { v: "Île-de-France", l: "terrain de jeu d'origine, élargi peu à peu" },
];

function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Parqueto" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Accueil
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange-deep">
              À propos
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Parqueto est <span className="italic text-brand-orange">né du terrain.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Pas d'un studio de design. Pas d'une équipe produit déconnectée. Mais d'un
              artisan parqueteur qui, après près de vingt ans de chantiers, en avait assez
              de voir les mêmes problèmes se répéter — pour les clients comme pour ses
              confrères.
            </p>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Le fondateur de Parqueto est aussi le créateur et dirigeant d'
              <span className="font-medium text-foreground">Antony Parquet</span>. Il a
              passé près de 19 ans à poser, poncer, vitrifier, rénover, chiffrer, conseiller.
              Parqueto, c'est sa réponse — sobre, concrète, sans promesses creuses.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-warm">
              <img
                src={artisanImg}
                alt="Artisan parqueteur posant une lame de chêne dans un appartement haussmannien"
                className="h-full w-full object-cover"
                width={1080}
                height={1600}
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-background/85">
                  Chantier · chêne français · pose à la main
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MICRO PREUVES */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
          {preuves.map((p) => (
            <div key={p.l} className="flex items-baseline gap-3">
              <span className="font-serif text-2xl text-brand-orange-deep sm:text-3xl">
                {p.v}
              </span>
              <span className="text-sm text-muted-foreground">{p.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LE CONSTAT */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-deep">
              Le constat
            </p>
            <h2 className="mt-3 font-serif text-3xl text-balance sm:text-4xl">
              Toujours les mêmes histoires, sur tous les chantiers.
            </h2>
            <p className="mt-5 text-sm text-muted-foreground">
              Au fil des années, à force d'être appelé en rattrapage, de reprendre des devis
              mal cadrés ou d'expliquer pourquoi tel prix ne tenait pas, le constat est
              devenu évident.
            </p>
          </div>
          <ul className="space-y-4 lg:col-span-7">
            {constats.map((c) => (
              <li
                key={c}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                <span className="text-sm text-foreground/85">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DETAIL IMAGE BAND */}
      <section className="border-y border-border/60">
        <div className="relative h-64 overflow-hidden sm:h-80">
          <img
            src={detailImg}
            alt="Détail de parquet chêne fraîchement poncé, rabot et mètre pliant en bois"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
            <blockquote className="max-w-xl font-serif text-2xl leading-snug text-background sm:text-3xl">
              « On ne réinvente pas un métier qu'on a vu de près pendant vingt ans.
              On essaie juste de lui rendre justice. »
            </blockquote>
          </div>
        </div>
      </section>

      {/* LA REPONSE */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-deep">
            La réponse
          </p>
          <h2 className="mt-3 font-serif text-3xl text-balance sm:text-4xl">
            Une plateforme pensée comme un bon artisan : claire, honnête, à sa place.
          </h2>
          <p className="mt-5 text-sm text-muted-foreground">
            Parqueto ne remplace pas l'artisan. Il fait ce qu'aucun artisan n'a le temps
            de faire seul : accueillir proprement la demande, la cadrer, l'estimer, puis
            la confier à la bonne personne.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {reponses.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-warm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-deep">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">
              Un projet parquet ? Parlons-en simplement.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Estimation indicative en quelques minutes, sans démarchage, sans engagement —
              et un artisan vérifié au bout du chemin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-primary-foreground shadow-warm transition hover:-translate-y-0.5 hover:bg-brand-orange-deep"
            >
              Estimer mon projet <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/devenir-artisan"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              Je suis artisan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
