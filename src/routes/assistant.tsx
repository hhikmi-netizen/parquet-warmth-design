import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Eye, Lock, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AssistantExperience } from "@/components/assistant/AssistantExperience";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "Assistant Parqueto — analyse visuelle de votre parquet" },
      {
        name: "description",
        content:
          "Analysez votre parquet à partir d'une photo, identifiez l'état, l'usure et obtenez des recommandations adaptées. Outil métier, lecture indicative, à confirmer par un parqueteur.",
      },
      { property: "og:title", content: "Assistant Parqueto — analyse visuelle" },
      {
        property: "og:description",
        content:
          "Une photo, une lecture indicative : essence, finition, usure, recommandations. Outil métier discret, pensé pour les particuliers.",
      },
      { property: "og:url", content: "/assistant" },
    ],
    links: [{ rel: "canonical", href: "/assistant" }],
  }),
});

const FAQ = [
  {
    q: "Mon parquet peut-il être rénové ?",
    a: "Dans la grande majorité des cas oui, à condition que la couche d'usure (la lame de bois noble au-dessus des rainures) mesure encore au moins 2,5 mm. Un parquet massif peut être poncé 4 à 6 fois sur sa durée de vie ; un contrecollé entre 1 et 3 fois selon son épaisseur. L'Assistant Parqueto donne un premier signal, mais seule une vérification sur place permet de trancher.",
  },
  {
    q: "Faut-il remplacer mon parquet ou seulement le poncer ?",
    a: "Remplacement et ponçage répondent à des situations différentes. Le ponçage convient si les lames sont saines, le support stable et la couche d'usure suffisante. Le remplacement s'impose si plus de 20 à 30 % des lames sont gondolées, tachées en profondeur ou si le support (chape, lambourdes) est dégradé. Une visite technique reste indispensable avant décision.",
  },
  {
    q: "Comment reconnaître un parquet massif d'un contrecollé ou d'un stratifié ?",
    a: "Le massif est constitué d'une seule essence de bois sur toute l'épaisseur (souvent 14 à 23 mm). Le contrecollé superpose une lame noble (2 à 6 mm) sur des couches techniques. Le stratifié, lui, est un décor imprimé sous résine — ce n'est pas du parquet. Un indice visuel : sur la tranche d'une lame relevée, le massif montre le même grain de bois sur toute la hauteur ; le contrecollé montre des strates.",
  },
  {
    q: "Mon parquet semble gondolé : que faire ?",
    a: "Un parquet gondolé (tuilage des lames, lames qui se soulèvent) signale presque toujours un excès d'humidité : fuite, infiltration, dégât des eaux. Coupez immédiatement la source d'eau si possible, aérez fortement la pièce et ne tentez pas de poncer dans cet état. Documentez avec des photos datées — ce sera utile pour votre assurance. Voir notre page dédiée Dégât des eaux & devis assurance.",
  },
  {
    q: "Quelle photo prendre pour obtenir la meilleure lecture ?",
    a: "Photographiez à la verticale, à hauteur d'épaule, en lumière naturelle (sans flash). Évitez les contre-jours et les zones avec tapis ou mobilier. Cadrez large pour montrer le sens des lames, puis prenez une seconde photo plus serrée sur la zone qui vous inquiète. C'est suffisant pour une première lecture indicative.",
  },
  {
    q: "Les conseils de l'Assistant valent-ils un diagnostic professionnel ?",
    a: "Non. L'Assistant Parqueto est un outil d'aide à la décision : il pré-qualifie votre besoin et oriente la conversation avec un artisan. Un diagnostic technique (mesure d'hygrométrie, identification précise de l'essence et de la finition, état du support) ne peut se faire que sur place, par un parqueteur vérifié.",
  },
];

function AssistantPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* HERO */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-foreground/70" />
              Beta · Outil métier
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            Assistant Parqueto.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Analysez votre parquet, estimez vos travaux et obtenez des conseils adaptés à votre sol.
            Une lecture visuelle, sobre et prudente — pensée comme un outil d'atelier, pas comme un
            chatbot.
          </p>

          <ul className="mt-8 grid max-w-3xl gap-4 text-sm sm:grid-cols-3">
            <Feature
              icon={Eye}
              title="Lecture visuelle"
              body="Essence probable, finition, signaux d'usure."
            />
            <Feature
              icon={ShieldCheck}
              title="Ton prudent"
              body="Aucune certitude technique, aucun prix figé."
            />
            <Feature
              icon={Lock}
              title="Photo non conservée"
              body="L'image reste dans votre navigateur."
            />
          </ul>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <AssistantExperience />
        </div>
      </section>

      {/* CTA mid */}
      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Aller plus loin
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">
              Prêt à transformer cette lecture en devis ?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Un artisan parqueteur vérifié reprend votre cas, mesure sur place et vous remet un
              devis détaillé sous 48 à 72 h.
            </p>
          </div>
          <Link
            to="/estimation"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
          >
            Lancer mon estimation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Questions fréquentes
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Ce que disent les artisans.
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="font-display text-base text-foreground sm:text-lg">
                    {f.q}
                  </span>
                  <span className="relative mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition group-open:rotate-45 group-open:border-foreground/40">
                    <span className="absolute block h-px w-2.5 bg-current" />
                    <span className="absolute block h-2.5 w-px bg-current transition group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

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

      <Footer />
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Eye;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground/70">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-display text-sm text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
