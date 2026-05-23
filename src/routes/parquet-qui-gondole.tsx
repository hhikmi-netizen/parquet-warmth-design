import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Droplets,
  Flame,
  Hammer,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  FileText,
  Phone,
  Thermometer,
  Ruler,
  Wrench,
  Loader2,
  Brain,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GONDOLAGE_CASES } from "@/lib/gondolage-cases";
import { diagnosticGondolage, type DiagnosticResult } from "@/lib/gondolage-diagnostic.functions";


const PAGE_URL = "/parquet-qui-gondole";
const PAGE_TITLE = "Parquet qui gondole : causes, solutions et devis en ligne";
const PAGE_DESC =
  "Parquet qui gondole après inondation, humidité ou chauffage au sol ? Diagnostic, simulateur de gravité, prix de réparation et devis artisan vérifié sous 24 h.";

// ---------------------------------------------------------------------------
// Contenu
// ---------------------------------------------------------------------------

const CAUSES = [
  {
    icon: Droplets,
    title: "Humidité & dégâts des eaux",
    text: "Fuite, inondation ou remontée capillaire : le bois absorbe l'eau, gonfle et soulève les lames. Cause n°1 du gondolage.",
    keywords: "parquet gondolé après inondation, humidité sous-plancher",
  },
  {
    icon: Flame,
    title: "Chauffage au sol mal réglé",
    text: "Montée en température trop brutale ou parquet non compatible PCBT : le bois se dilate et se rétracte jusqu'à se déformer.",
    keywords: "parquet qui gondole chauffage au sol",
  },
  {
    icon: Ruler,
    title: "Pose non conforme",
    text: "Absence de jeu de dilatation périphérique (< 8 mm), colle inadaptée, sous-couche manquante : la lame n'a pas la place de bouger.",
    keywords: "parquet gondolé pose non conforme",
  },
  {
    icon: Layers,
    title: "Support inadapté",
    text: "Chape humide (> 3 %), carrelage non préparé, sous-plancher froid : le parquet subit l'écart hygrométrique entre haut et bas.",
    keywords: "parquet gondolé sous-plancher froid",
  },
];

const SCENARIOS = [
  {
    cas: "Légère bosse localisée, parquet sec",
    solution: "Séchage + déshumidificateur, observation 7 à 15 jours",
    prix: "0 – 200 €",
    delai: "1 à 2 semaines",
    badge: "DIY possible",
  },
  {
    cas: "Quelques lames soulevées (≤ 2 m²)",
    solution: "Réparation locale : dépose, remplacement à l'identique, ponçage de raccord",
    prix: "180 – 600 €",
    delai: "1 à 2 jours",
    badge: "Artisan",
  },
  {
    cas: "Zone gondolée 2 à 10 m², parquet collé",
    solution: "Remplacement partiel + ponçage / vitrification de la pièce entière",
    prix: "900 – 2 500 €",
    delai: "3 à 5 jours",
    badge: "Artisan",
  },
  {
    cas: "Pièce entière, parquet flottant gonflé",
    solution: "Dépose complète, séchage du support, nouvelle pose",
    prix: "45 – 90 €/m²",
    delai: "5 à 8 jours",
    badge: "Rénovation",
  },
  {
    cas: "Dégât des eaux étendu, plusieurs pièces",
    solution: "Dossier assurance + rénovation complète (souvent LVT ou nouveau parquet)",
    prix: "Pris en charge MRH",
    delai: "2 à 4 semaines",
    badge: "Assurance",
  },
];

const FAQS = [
  {
    q: "Pourquoi mon parquet gondole après une inondation ?",
    a: "Le bois absorbe l'eau via les pores et les joints entre lames. En gonflant, il pousse contre les murs et, faute de jeu de dilatation suffisant, se soulève. Plus l'eau stagne longtemps (> 24 h), plus le risque de déformation permanente est élevé. Une intervention dans les 48 h permet souvent de sauver le sol.",
  },
  {
    q: "Quand un parquet gondolé peut-il être réparé, quand faut-il le remplacer ?",
    a: "Un parquet massif de 20 mm avec une couche d'usure de 6 mm peut presque toujours être sauvé par séchage + ponçage. Un parquet flottant (contrecollé clipsable) dont les joints ont gonflé est souvent irrécupérable car la languette se casse au démontage. Règle : massif → on tente, flottant → on remplace.",
  },
  {
    q: "Comment savoir si le gondolage vient de l'humidité du sol ou du chauffage au sol ?",
    a: "Mesurez l'humidité à la sonde : si elle est > 3 % sur le support et que les bosses sont régulières au-dessus des serpentins, c'est le chauffage. Si les bosses se concentrent près d'un mur, d'une canalisation ou d'une pièce d'eau, c'est l'humidité. Un artisan Parqueto réalise ce diagnostic gratuitement.",
  },
  {
    q: "Mon parquet gondole juste après la pose : est-ce une malfaçon ?",
    a: "Très probablement oui. Trois causes fréquentes : (1) jeu de dilatation périphérique < 8 mm, (2) pose sur support trop humide (chape non sèche), (3) parquet stocké en milieu sec puis posé en pièce humide. Vous pouvez invoquer la garantie de parfait achèvement (1 an) ou la décennale.",
  },
  {
    q: "L'assurance habitation prend-elle en charge un parquet qui gondole ?",
    a: "Oui, si le gondolage est consécutif à un dégât des eaux couvert (fuite, débordement, infiltration accidentelle). La MRH indemnise sur devis chiffré, après expertise. Non si l'origine est l'usure, un défaut d'entretien ou un chauffage au sol mal réglé.",
  },
  {
    q: "Qui paye la réparation après une fuite chez le voisin ?",
    a: "Vous déclarez à votre assurance, qui se retourne vers celle du voisin via la convention IRSI. Vous n'avancez pas les frais au-delà de votre franchise. Demandez à votre artisan un devis détaillé avec photos avant/après — c'est obligatoire pour le dossier.",
  },
  {
    q: "Quel hygromètre utiliser pour prévenir le gondolage ?",
    a: "Un hygromètre digital simple (15–30 €) suffit. Maintenez l'humidité de la pièce entre 45 % et 65 %. En hiver, si vous chauffez fort et que l'air descend sous 35 %, le parquet se rétracte ; en été humide au-dessus de 70 %, il gonfle. Un humidificateur ou un déshumidificateur règle le problème.",
  },
  {
    q: "Combien de temps attendre pour réagir après une inondation sur parquet ?",
    a: "Idéalement < 24 h pour aspirer l'eau, puis 48 h sous déshumidificateur. Au-delà de 72 h d'eau stagnante, la déformation devient irréversible et le risque de moisissure sous le parquet est sérieux. Photographiez tout dès le début pour l'assurance.",
  },
  {
    q: "Peut-on réparer un parquet flottant gondolé sans tout déposer ?",
    a: "Rarement. Le système clic se déforme avec l'humidité et casse au démontage. La seule réparation propre est de remplacer la zone gondolée à partir d'un mur, ce qui implique souvent de démonter une bonne moitié de pièce. Dans 7 cas sur 10, on dépose et on repose tout.",
  },
  {
    q: "Parquet sur chauffage au sol qui gondole : que faire ?",
    a: "Coupez immédiatement le chauffage. Mesurez l'humidité du support — si > 3 %, le problème vient de là. Sinon, le parquet n'était probablement pas certifié PCBT (compatible plancher chauffant). Remise en chauffe lente (+5 °C/jour), et si le gondolage persiste, dépose et repose en contrecollé certifié.",
  },
];

const PILIER_LINKS = [
  {
    to: "/parqueteur/paris/poncage-vitrification",
    anchor: "Ponçage & vitrification après gondolage",
    angle: "Quand la rénovation complète est plus sûre que des réparations locales.",
  },
  {
    to: "/parqueteur/paris/parquet-chauffage-au-sol",
    anchor: "Parquet sur chauffage au sol",
    angle: "Éviter le gondolage selon le type de parquet et le protocole de chauffe.",
  },
  {
    to: "/parqueteur/paris/renovation-parquet-ancien",
    anchor: "Parquet haussmannien gondolé",
    angle: "Priorités de réparation et devis premium après inondation.",
  },
  {
    to: "/estimation",
    anchor: "Devis rénovation parquet en ligne",
    angle: "Estimation chiffrée en 3 minutes, artisan vérifié sous 24 h.",
  },
  {
    to: "/renovation-sinistre",
    anchor: "Rénovation parquet après sinistre",
    angle: "Diagnostic gondolage + humidité + accompagnement assurance.",
  },
  {
    to: "/parqueteur/paris/reparation-degat-des-eaux",
    anchor: "Réparation parquet dégât des eaux",
    angle: "Intervention sous 72 h, devis assurance conforme MRH.",
  },
];

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/parquet-qui-gondole")({
  component: ParquetQuiGondolePage,
  head: () => ({
    meta: [
      { title: `${PAGE_TITLE} · Parqueto` },
      { name: "description", content: PAGE_DESC },
      {
        name: "keywords",
        content:
          "parquet qui gondole, parquet qui gondole que faire, parquet gondolé après inondation, parquet qui gondole dégâts des eaux, parquet qui gondole assurance, parquet qui gondole chauffage au sol, parquet qui gondole humidité, parquet flottant qui gondole, parquet massif qui gondole, prix réparation parquet gondolé",
      },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: PAGE_TITLE,
          description: PAGE_DESC,
          author: { "@type": "Organization", name: "Parqueto" },
          publisher: {
            "@type": "Organization",
            name: "Parqueto",
            logo: { "@type": "ImageObject", url: "/parqueto-logo.png" },
          },
          mainEntityOfPage: PAGE_URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "/guide-parquet" },
            { "@type": "ListItem", position: 3, name: "Parquet qui gondole", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ParquetQuiGondolePage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        <Hero />
        <CausesSection />
        <GravitySimulator />
        <ScenariosTable />
        <AssuranceSection />
        <PreventionSection />
        <FaqSection />
        <SatelliteCases />
        <InternalMesh />
        <FinalCta />

      </main>
      <Footer />
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30 px-6 pb-16 pt-28 lg:pt-32">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link>
          <span>/</span>
          <Link to="/guide-parquet" className="hover:text-foreground">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Parquet qui gondole</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
          <AlertTriangle className="h-3 w-3" />
          Diagnostic & devis
        </span>
        <h1 className="mt-5 font-display text-4xl leading-[1.05] text-balance text-foreground sm:text-5xl lg:text-6xl">
          Parquet qui gondole :
          <span className="block italic text-brand-orange">causes, solutions et devis en ligne.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Inondation, fuite, chauffage au sol, humidité… On vous dit en 3 minutes
          si votre parquet peut être sauvé, combien coûte la réparation, et qui
          appeler — un artisan Parqueto vérifié, dans votre ville.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#simulateur"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
          >
            <Sparkles className="h-4 w-4" />
            Simuler la gravité (2 min)
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <Link
            to="/estimation"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <FileText className="h-4 w-4" />
            Demande de devis
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { k: "≤ 24 h", v: "Diagnostic urgent dégât des eaux" },
            { k: "180 – 2 500 €", v: "Fourchette réparation locale → pièce" },
            { k: "MRH", v: "Devis conforme assurance habitation" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-background/60 p-4">
              <div className="font-display text-xl text-brand-orange">{s.k}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Causes
// ---------------------------------------------------------------------------

function CausesSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Les 4 causes d'un parquet qui gondole
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Identifier la cause détermine la solution. Voici le diagnostic qu'un
          artisan parqueteur réalise sur place — et que vous pouvez pré-qualifier
          en quelques minutes.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CAUSES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-secondary/30 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
                <p className="mt-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                  {c.keywords}
                </p>
              </div>
            );
          })}
        </div>

        {/* Schéma cause → conséquence */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-background">
          <h3 className="font-display text-lg">Schéma cause → conséquence</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-5">
            {["Source d'humidité", "Dilatation du bois", "Soulèvement des lames", "Séparation des joints", "Réparation ou remplacement"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-background/85">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Simulateur de gravité
// ---------------------------------------------------------------------------

type SimState = {
  type: "massif" | "flottant" | "stratifie" | "";
  cause: "inondation" | "humidite" | "chauffage" | "pose" | "";
  surface: "petite" | "moyenne" | "grande" | "";
  duree: "moins24" | "moins72" | "plus72" | "";
  chauffage: "oui" | "non" | "";
};

const initialSim: SimState = { type: "", cause: "", surface: "", duree: "", chauffage: "" };

function GravitySimulator() {
  const [sim, setSim] = useState<SimState>(initialSim);
  const [contexte, setContexte] = useState("");
  const [ville, setVille] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<DiagnosticResult | null>(null);
  const runDiagnostic = useServerFn(diagnosticGondolage);
  const complete = Object.values(sim).every((v) => v !== "");

  const askAi = async () => {
    if (!complete) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await runDiagnostic({
        data: {
          typeParquet: sim.type as "massif" | "flottant" | "stratifie",
          cause: sim.cause as "inondation" | "humidite" | "chauffage" | "pose",
          surface: sim.surface as "petite" | "moyenne" | "grande",
          duree: sim.duree as "moins24" | "moins72" | "plus72",
          chauffageSol: sim.chauffage === "oui",
          contexte: contexte.trim() || undefined,
          ville: ville.trim() || undefined,
        },
      });
      if (res.error) setAiError(res.error);
      else setAiResult(res.result);
    } catch (e) {
      setAiError("Le diagnostic IA est temporairement indisponible.");
    } finally {
      setAiLoading(false);
    }
  };


  const result = useMemo(() => {
    if (!complete) return null;

    let score = 0;
    if (sim.type === "flottant") score += 2;
    if (sim.type === "stratifie") score += 3;
    if (sim.type === "massif") score += 0;
    if (sim.cause === "inondation") score += 2;
    if (sim.cause === "humidite") score += 1;
    if (sim.cause === "chauffage") score += 2;
    if (sim.cause === "pose") score += 1;
    if (sim.surface === "moyenne") score += 1;
    if (sim.surface === "grande") score += 2;
    if (sim.duree === "moins72") score += 1;
    if (sim.duree === "plus72") score += 3;
    if (sim.chauffage === "oui") score += 1;

    const level = Math.min(5, Math.max(1, Math.round(score / 2)));

    const reco =
      level <= 1
        ? {
            title: "Niveau 1 — Observation",
            text: "Cas léger. Séchez la zone (déshumidificateur 48–72 h), aérez, mesurez l'hygrométrie. Si la bosse persiste après 15 jours, demandez un diagnostic.",
            cta: "Demander un diagnostic",
          }
        : level === 2
        ? {
            title: "Niveau 2 — Réparation locale envisageable",
            text: "Quelques lames soulevées, support sec. Un artisan peut remplacer la zone à l'identique puis poncer pour raccorder. Compter 180 à 600 €.",
            cta: "Recevoir un devis local",
          }
        : level === 3
        ? {
            title: "Niveau 3 — Intervention pro recommandée",
            text: "Zone significative, parquet probablement abîmé en profondeur. Diagnostic humidité obligatoire avant tout devis. Reprise partielle + ponçage de la pièce.",
            cta: "Diagnostic + devis",
          }
        : level === 4
        ? {
            title: "Niveau 4 — Rénovation probable",
            text: "Le parquet a bougé sur une grande surface. Souvent dépose-repose nécessaire. Si parquet flottant ou stratifié, remplacement complet quasi systématique.",
            cta: "Devis rénovation",
          }
        : {
            title: "Niveau 5 — Sinistre & dossier assurance",
            text: "Dégât majeur, eau prolongée, risque moisissure. Photographiez tout, déclarez sous 5 jours à votre MRH. Nous fournissons un devis conforme expertise.",
            cta: "Lancer dossier sinistre",
          };

    return { level, ...reco };
  }, [sim, complete]);

  return (
    <section id="simulateur" className="scroll-mt-24 bg-secondary/40 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-orange" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            Assistant gondolage
          </span>
        </div>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          Votre parquet gondole : niveau de gravité 1 → 5
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          5 questions, 2 minutes. On vous dit si c'est récupérable, par quoi
          commencer, et combien ça coûte — sans jargon.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-background p-6 shadow-warm sm:p-8">
          <SimQuestion
            label="1. Type de parquet"
            options={[
              { v: "massif", l: "Massif (bois plein)" },
              { v: "flottant", l: "Flottant / contrecollé clipsé" },
              { v: "stratifie", l: "Stratifié" },
            ]}
            value={sim.type}
            onChange={(v) => setSim({ ...sim, type: v as SimState["type"] })}
          />
          <SimQuestion
            label="2. Cause principale"
            options={[
              { v: "inondation", l: "Inondation / fuite ponctuelle" },
              { v: "humidite", l: "Humidité chronique / remontée" },
              { v: "chauffage", l: "Chauffage au sol" },
              { v: "pose", l: "Pose récente / malfaçon suspectée" },
            ]}
            value={sim.cause}
            onChange={(v) => setSim({ ...sim, cause: v as SimState["cause"] })}
          />
          <SimQuestion
            label="3. Surface concernée"
            options={[
              { v: "petite", l: "< 1 m² (quelques lames)" },
              { v: "moyenne", l: "1 à 5 m²" },
              { v: "grande", l: "> 5 m² ou pièce entière" },
            ]}
            value={sim.surface}
            onChange={(v) => setSim({ ...sim, surface: v as SimState["surface"] })}
          />
          <SimQuestion
            label="4. Depuis combien de temps ?"
            options={[
              { v: "moins24", l: "Moins de 24 h" },
              { v: "moins72", l: "1 à 3 jours" },
              { v: "plus72", l: "Plus de 3 jours" },
            ]}
            value={sim.duree}
            onChange={(v) => setSim({ ...sim, duree: v as SimState["duree"] })}
          />
          <SimQuestion
            label="5. Chauffage au sol présent ?"
            options={[
              { v: "oui", l: "Oui" },
              { v: "non", l: "Non" },
            ]}
            value={sim.chauffage}
            onChange={(v) => setSim({ ...sim, chauffage: v as SimState["chauffage"] })}
          />

          {result && (
            <div className="mt-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-primary-foreground">
                  {result.level}
                </div>
                <h3 className="font-display text-xl text-foreground">{result.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{result.text}</p>
              <Link
                to="/estimation"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
              >
                {result.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {!complete && (
            <p className="mt-5 text-xs text-muted-foreground">
              Répondez aux 5 questions pour afficher votre niveau de gravité.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SimQuestion({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 text-sm font-semibold text-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              value === o.v
                ? "border-brand-orange bg-brand-orange text-primary-foreground"
                : "border-border bg-background text-foreground hover:border-brand-orange/50"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scénarios & prix
// ---------------------------------------------------------------------------

function ScenariosTable() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Réparation, remplacement, rénovation : combien ça coûte ?
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Fourchettes indicatives 2026, hors dégât des eaux pris en charge par
          l'assurance. Chaque cas est devisé sous 24 h après visite.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-12 gap-4 bg-secondary/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div className="col-span-4">Cas</div>
            <div className="col-span-4">Solution recommandée</div>
            <div className="col-span-2">Prix indicatif</div>
            <div className="col-span-2">Délai</div>
          </div>
          {SCENARIOS.map((s, i) => (
            <div
              key={s.cas}
              className={`grid gap-3 px-5 py-5 md:grid-cols-12 md:gap-4 ${
                i % 2 === 0 ? "bg-background" : "bg-secondary/20"
              }`}
            >
              <div className="md:col-span-4">
                <div className="text-sm font-semibold text-foreground">{s.cas}</div>
                <span className="mt-1 inline-block rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
                  {s.badge}
                </span>
              </div>
              <div className="text-sm text-muted-foreground md:col-span-4">{s.solution}</div>
              <div className="text-sm font-semibold text-foreground md:col-span-2">{s.prix}</div>
              <div className="text-sm text-muted-foreground md:col-span-2">{s.delai}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Assurance
// ---------------------------------------------------------------------------

function AssuranceSection() {
  return (
    <section className="bg-foreground px-6 py-20 text-background">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-brand-orange">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Assurance & sinistre</span>
        </div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">
          Parquet gondolé après dégât des eaux : qui paye, comment déclarer ?
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "1. Constater",
              d: "Photographiez la zone, mesurez si possible (mètre + sonde humidité). Conservez tout : factures parquet d'origine, photo avant sinistre.",
            },
            {
              t: "2. Déclarer",
              d: "Déclaration à votre MRH sous 5 jours ouvrés. Mentionnez la cause (fuite, voisin, intempéries). Demandez si une expertise est prévue.",
            },
            {
              t: "3. Faire chiffrer",
              d: "Nous établissons un devis conforme : descriptif précis, photos, prix unitaire au m², garantie décennale. Accepté par toutes les MRH.",
            },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-background/10 bg-background/5 p-6">
              <div className="font-display text-xl text-brand-orange">{b.t}</div>
              <p className="mt-3 text-sm text-background/80">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-background/10 bg-background/5 p-6 text-sm text-background/85">
          <strong className="text-background">Règles DTU à connaître :</strong>{" "}
          humidité de la chape &lt; 3 % pour pose sur chauffage au sol · jeu de
          dilatation périphérique ≥ 8 mm · hygrométrie ambiante 45 – 65 %.
          Au-delà, l'artisan ne peut pas garantir la pose — et l'assureur peut
          refuser la prise en charge.
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Prévention
// ---------------------------------------------------------------------------

function PreventionSection() {
  const items = [
    { icon: Thermometer, t: "Hygromètre 45–65 %", d: "Un hygromètre digital à 20 € évite 80 % des cas de gondolage saisonnier." },
    { icon: Flame, t: "Chauffage au sol par paliers", d: "Mise en chauffe +5 °C / jour. Jamais de bond brutal après une coupure prolongée." },
    { icon: Droplets, t: "Réagir sous 24 h", d: "Aspirateur eau + déshumidificateur dès la moindre fuite. 72 h = déformation irréversible." },
    { icon: Wrench, t: "Entretien doux", d: "Serpillière essorée, jamais détrempée. Produits dédiés parquet, pas de vapeur." },
  ];
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Prévention : 4 réflexes qui sauvent un parquet
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.t} className="rounded-2xl border border-border bg-secondary/30 p-5">
                <Icon className="h-5 w-5 text-brand-orange" />
                <div className="mt-3 font-display text-base text-foreground">{i.t}</div>
                <p className="mt-2 text-xs text-muted-foreground">{i.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-secondary/40 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Questions fréquentes
        </h2>
        <p className="mt-3 text-muted-foreground">
          10 réponses concrètes — du diagnostic à l'assurance, en passant par la
          rénovation.
        </p>

        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-border bg-background">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold text-foreground">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Maillage interne
// ---------------------------------------------------------------------------

function SatelliteCases() {
  return (
    <section className="bg-muted/30 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
          <Sparkles className="h-3.5 w-3.5" />
          Cas pratiques
        </div>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          Diagnostic détaillé selon votre situation
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Chaque cas de gondolage a ses propres causes, son protocole et son
          budget. Ouvrez la page qui correspond exactement à votre parquet.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {GONDOLAGE_CASES.map((c) => (
            <Link
              key={c.slug}
              to="/parquet-qui-gondole/$cas"
              params={{ cas: c.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition hover:border-brand-orange/60 hover:shadow-warm"
            >
              <div className="font-display text-lg text-foreground group-hover:text-brand-orange">
                {c.h1}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {c.intro}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange">
                Lire le cas
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------


function InternalMesh() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Aller plus loin selon votre cas
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Le gondolage rejoint d'autres sujets — ponçage, chauffage au sol,
          parquet ancien, sinistre. Voici les pages qui complètent ce guide.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PILIER_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-5 transition hover:border-brand-orange/50 hover:shadow-warm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                <Hammer className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-display text-base text-foreground group-hover:text-brand-orange">
                  {l.anchor}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{l.angle}</p>
              </div>
              <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-orange" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA final
// ---------------------------------------------------------------------------

function FinalCta() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-foreground p-10 text-background sm:p-14">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--brand-orange)" }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="font-display text-3xl text-background sm:text-4xl">
            Votre parquet gondole.
            <span className="block italic text-brand-orange">On vous rappelle aujourd'hui.</span>
          </h2>
          <p className="mt-4 max-w-xl text-background/75">
            Un artisan parqueteur Parqueto vérifié, dans votre ville, vous
            propose un diagnostic + devis sous 24 h. Devis conforme assurance
            si dégât des eaux.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
            >
              <FileText className="h-4 w-4" />
              Demander un devis
            </Link>
            <Link
              to="/renovation-sinistre"
              className="inline-flex items-center gap-2 rounded-full border border-background/25 px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-background/10"
            >
              <Phone className="h-4 w-4" />
              Dossier sinistre
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-background/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" />
            Sans engagement · réponse sous 24 h ouvrées
          </div>
        </div>
      </div>
    </section>
  );
}
