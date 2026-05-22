// Articles de blog Parqueto — extraits éditoriaux du Guide Ultime,
// pensés pour le SEO (titres longue traîne, FAQ, JSON-LD).
import choisirImg from "@/assets/guide/choisir/01.webp";
import finirImg from "@/assets/guide/finir/01.webp";
import entretenirImg from "@/assets/guide/entretenir/01.webp";
import renoverImg from "@/assets/guide/renover/01.webp";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string; // meta description
  category: string;
  date: string; // ISO
  dateLabel: string;
  readTime: string;
  cover: string;
  // Ancre du chapitre du guide où l'article renvoie (CTA contextuel)
  guideAnchor: string;
  guideCtaLabel: string;
  blocks: PostBlock[];
  faq: { q: string; a: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "choisir-parquet-massif-contrecolle",
    title: "Parquet massif ou contrecollé : comment choisir en 2026 ?",
    excerpt:
      "Stabilité, rénovation, compatibilité plancher chauffant, budget : la vraie comparaison entre massif et contrecollé, sans parti-pris commercial.",
    description:
      "Massif ou contrecollé en 2026 : comparatif honnête (stabilité, ponçage, plancher chauffant, budget) par les artisans Parqueto. Notre recommandation par usage.",
    category: "Choisir",
    date: "2026-05-15",
    dateLabel: "Mai 2026",
    readTime: "7 min",
    cover: choisirImg,
    guideAnchor: "chapitre-choisir",
    guideCtaLabel: "Lire le chapitre complet « Bien choisir son parquet »",
    blocks: [
      {
        type: "p",
        text: "Le débat dure depuis trente ans. Côté massif, l'argument du « vrai bois » et de la rénovation infinie. Côté contrecollé, la stabilité, la compatibilité plancher chauffant et un prix plus accessible. La réponse moderne est nuancée — et dans 90 % des projets résidentiels, le contrecollé haut de gamme s'impose.",
      },
      { type: "h2", text: "Massif vs contrecollé : le tableau de référence" },
      {
        type: "table",
        head: ["Critère", "Massif", "Contrecollé"],
        rows: [
          ["Apparence", "100 % bois noble", "Couche d'usure noble identique"],
          ["Stabilité", "Sensible à l'humidité", "Très stable (multicouches)"],
          ["Plancher chauffant", "Déconseillé", "Recommandé"],
          ["Rénovations possibles", "5 à 8 ponçages", "1 à 3 ponçages selon couche"],
          ["Budget pose comprise", "≥ 90 €/m²", "≥ 60 €/m²"],
          ["Durée de vie", "80 à 100 ans", "40 à 60 ans"],
        ],
      },
      { type: "h2", text: "Notre recommandation par usage" },
      {
        type: "list",
        items: [
          "Maison de famille à transmettre, pose clouée sur lambourdes : massif chêne 20 mm.",
          "Appartement avec chauffage au sol : contrecollé chêne 14 mm, couche d'usure 3,2 mm minimum.",
          "Rénovation locative : contrecollé 10 mm finition vernis mat, pose collée.",
          "Boutique ou tertiaire : contrecollé 14 mm, couche d'usure 4 mm, vernis polyuréthane.",
        ],
      },
      {
        type: "quote",
        text: "Un contrecollé avec 4 mm de couche d'usure se ponce deux fois — soit 30 à 40 ans de vie. C'est largement suffisant pour la grande majorité des familles.",
      },
      { type: "h2", text: "Les trois erreurs à éviter" },
      {
        type: "list",
        items: [
          "Choisir un massif pour économiser sur la pose : la pose collée d'un massif coûte plus cher, pas moins.",
          "Poser un massif sur plancher chauffant : risque de tuilage et de fentes dès la première mise en chauffe.",
          "Acheter un contrecollé « premier prix » avec 2 mm de couche d'usure : impossible à rénover, durée de vie réduite à 15 ans.",
        ],
      },
    ],
    faq: [
      {
        q: "Le contrecollé est-il vraiment du vrai bois ?",
        a: "Oui. La couche supérieure (2 à 6 mm) est du bois noble massif identique à celui d'un parquet massif. Seul le support en dessous change : multicouches stables au lieu d'une planche unique.",
      },
      {
        q: "Combien de fois peut-on poncer un contrecollé ?",
        a: "Une fois pour 2 mm de couche d'usure, deux fois pour 3 mm, trois fois pour 4 mm et plus. Au-delà, il faut remplacer.",
      },
      {
        q: "Le massif est-il toujours plus cher ?",
        a: "À l'achat du matériau, oui. Mais le surcoût se réduit grâce à la durée de vie supérieure. Sur 50 ans, le coût annuel d'un bon massif peut être inférieur à celui d'un contrecollé entrée de gamme.",
      },
    ],
  },
  {
    slug: "vitrification-huile-cire-quelle-finition",
    title: "Vitrification, huile ou cire : quelle finition pour votre parquet ?",
    excerpt:
      "Tenue, rendu, entretien, réparabilité, coût : on compare les trois finitions et on vous dit laquelle choisir selon votre mode de vie.",
    description:
      "Vitrification, huile ou cire pour son parquet ? Comparatif Parqueto par usage (famille, animaux, plancher chauffant) avec entretien réel et coût au m².",
    category: "Finitions",
    date: "2026-04-22",
    dateLabel: "Avr. 2026",
    readTime: "5 min",
    cover: finirImg,
    guideAnchor: "chapitre-finir",
    guideCtaLabel: "Lire le chapitre complet « Finitions »",
    blocks: [
      {
        type: "p",
        text: "La finition n'est pas un détail esthétique : c'est elle qui détermine la résistance, l'entretien quotidien et la possibilité de réparer localement votre parquet. Trois familles cohabitent — vernis (vitrification), huile, cire — et chacune correspond à un mode de vie.",
      },
      { type: "h2", text: "Vitrification (vernis) : la robustesse moderne" },
      {
        type: "p",
        text: "Un film protecteur déposé en surface, généralement en deux à trois couches. Très résistant à l'eau, aux taches et aux passages. Entretien minimal : un produit pH neutre suffit. Inconvénient : on ne répare pas localement — quand le vernis s'use, il faut poncer toute la pièce.",
      },
      { type: "h2", text: "Huile : l'authenticité réparable" },
      {
        type: "p",
        text: "L'huile pénètre le bois et le nourrit en profondeur. Rendu mat, doux au toucher, veinage révélé. Surtout, elle se répare localement : une rayure se ponce au papier fin et se ré-huile en quelques minutes. Demande une à deux applications d'entretien par an.",
      },
      { type: "h2", text: "Cire : la patine d'antan" },
      {
        type: "p",
        text: "Réservée aux parquets anciens ou aux projets très patrimoniaux. Belle patine satinée mais entretien exigeant et faible résistance à l'eau. Déconseillée en cuisine, salle de bains et pour les familles avec jeunes enfants.",
      },
      { type: "h2", text: "Quelle finition selon votre mode de vie ?" },
      {
        type: "table",
        head: ["Profil", "Finition recommandée"],
        rows: [
          ["Famille avec enfants et animaux", "Vitrification mat polyuréthane"],
          ["Couple sans enfants, esthète", "Huile cire naturelle"],
          ["Cuisine ouverte", "Vitrification polyuréthane satiné"],
          ["Plancher chauffant", "Huile (meilleure conduction thermique)"],
          ["Rénovation patrimoine", "Cire ou huile traditionnelle"],
        ],
      },
      {
        type: "quote",
        text: "Le bon choix de finition vous fait gagner dix ans sur la durée de vie de votre parquet — et bien souvent, un ponçage complet en moins.",
      },
    ],
    faq: [
      {
        q: "Peut-on passer d'une vitrification à une huile ?",
        a: "Oui, mais à condition de poncer entièrement le parquet jusqu'au bois nu. C'est l'occasion d'un changement de rendu, mais cela représente un chantier complet.",
      },
      {
        q: "À quelle fréquence entretenir un parquet huilé ?",
        a: "Une application d'huile d'entretien tous les 12 à 18 mois dans les zones de passage, et une rénovation complète tous les 5 à 7 ans selon l'usage.",
      },
      {
        q: "La vitrification jaunit-elle avec le temps ?",
        a: "Les vernis polyuréthane modernes en phase aqueuse ne jaunissent pratiquement plus. Les anciens vernis solvant pouvaient jaunir : ils ne sont quasiment plus utilisés en résidentiel.",
      },
    ],
  },
  {
    slug: "entretien-parquet-quotidien-erreurs",
    title: "Entretenir son parquet au quotidien : les 7 erreurs qui le ruinent",
    excerpt:
      "Vapeur, javel, vinaigre, eau stagnante, mauvais aspirateur… La routine d'entretien qui prolonge la vie de votre parquet (et celle qui la raccourcit).",
    description:
      "Comment entretenir son parquet sans l'abîmer : 7 erreurs courantes à éviter et la routine validée par les artisans Parqueto. Vernis, huile, plancher chauffant.",
    category: "Entretien",
    date: "2026-03-18",
    dateLabel: "Mars 2026",
    readTime: "4 min",
    cover: entretenirImg,
    guideAnchor: "chapitre-entretenir",
    guideCtaLabel: "Lire le chapitre complet « Entretenir »",
    blocks: [
      {
        type: "p",
        text: "Un parquet bien entretenu dure cinquante ans. Mal entretenu, il faut le rénover au bout de quinze. La différence ne tient pas à des produits coûteux — elle tient à quelques gestes simples et à une liste d'interdits stricte.",
      },
      { type: "h2", text: "Les 7 erreurs qui ruinent un parquet" },
      {
        type: "list",
        items: [
          "Le nettoyeur vapeur : la chaleur fait gonfler le bois et décolle la finition.",
          "La serpillère détrempée : l'eau stagnante pénètre par les joints et tâche durablement.",
          "Le vinaigre blanc pur : trop acide, il attaque les vernis et les huiles.",
          "La javel : décolore le bois et altère les finitions de manière irréversible.",
          "L'aspirateur sans brosse : les roues rigides rayent la surface.",
          "Les tampons abrasifs : ils marquent immédiatement le vernis.",
          "Les produits multi-surfaces : leurs tensioactifs laissent un film qui ternit le bois.",
        ],
      },
      { type: "h2", text: "La routine hebdomadaire idéale" },
      {
        type: "list",
        items: [
          "Aspirateur avec brosse douce ou balai en microfibre.",
          "Serpillère bien essorée + nettoyant pH neutre dédié parquet.",
          "Essuyage immédiat de toute projection d'eau, en particulier près des éviers.",
          "Vérification annuelle des joints silicone (cuisine, salle de bains).",
        ],
      },
      { type: "h2", text: "L'entretien annuel selon la finition" },
      {
        type: "table",
        head: ["Finition", "Geste annuel"],
        rows: [
          ["Vitrification", "Application d'un rénovateur vernis dans les zones de passage."],
          ["Huile", "Une à deux applications d'huile d'entretien sur l'ensemble du parquet."],
          ["Cire", "Encaustique sur les zones ternies + lustrage à la brosse douce."],
        ],
      },
      {
        type: "quote",
        text: "Le pire ennemi d'un parquet n'est pas l'usure : c'est le mauvais produit appliqué pendant cinq ans.",
      },
    ],
    faq: [
      {
        q: "Peut-on utiliser un robot aspirateur sur un parquet ?",
        a: "Oui, à condition qu'il soit équipé de roues souples ou caoutchoutées et d'une brosse douce. Évitez les modèles avec serpillère humide intégrée sur parquet vitrifié et a fortiori huilé.",
      },
      {
        q: "Quel produit pour nettoyer un parquet huilé ?",
        a: "Un savon noir liquide spécial parquet huilé, dilué selon les recommandations du fabricant. Il nettoie tout en réintroduisant un peu de gras dans le bois.",
      },
      {
        q: "Comment retirer une tache sur un parquet ?",
        a: "Sur vernis : éponge humide et nettoyant pH neutre. Sur huile : ponçage local au papier 240 puis ré-huilage. Sur cire : encaustique appliquée à chaud à la spatule.",
      },
    ],
  },
  {
    slug: "renover-parquet-ancien-sans-le-denaturer",
    title: "Rénover un parquet ancien sans le dénaturer",
    excerpt:
      "Point de Hongrie, Versailles, lames anciennes : la méthode complète pour restaurer un parquet d'époque tout en respectant son âme et ses assemblages.",
    description:
      "Rénover un parquet ancien (point de Hongrie, Versailles) : diagnostic, recollage, ponçage doux, finition. Le mode opératoire des artisans Parqueto.",
    category: "Patrimoine",
    date: "2026-02-10",
    dateLabel: "Fév. 2026",
    readTime: "8 min",
    cover: renoverImg,
    guideAnchor: "chapitre-renover",
    guideCtaLabel: "Lire le chapitre complet « Rénover »",
    blocks: [
      {
        type: "p",
        text: "Un parquet ancien n'est pas un parquet neuf usagé : c'est un patrimoine, souvent posé à la main au XIXᵉ siècle, qui a son propre langage. Le rénover sans le dénaturer demande de comprendre ses assemblages avant de toucher la moindre lame.",
      },
      { type: "h2", text: "Étape 1 : le diagnostic visuel et acoustique" },
      {
        type: "list",
        items: [
          "Tap-tap au maillet caoutchouc : un son creux signale un décollement ou une lambourde affaissée.",
          "Inspection des joints : un espacement supérieur à 3 mm révèle un retrait du bois — donc une humidité ambiante trop basse.",
          "Repérage des lames bombées ou tuilées : signe d'un excès d'humidité, sans doute ancien.",
          "Photos millimétrées des motifs (Hongrie, Versailles, bâton rompu) avant tout démontage.",
        ],
      },
      { type: "h2", text: "Étape 2 : recoller, recaler, remplacer à l'identique" },
      {
        type: "p",
        text: "Les lames qui bougent se recollent à la colle PU souple (jamais d'époxy rigide sur du bois ancien). Les lames manquantes se remplacent par récupération en brocante ou en sciage sur mesure dans la même essence — chêne français vieilli, idéalement.",
      },
      { type: "h2", text: "Étape 3 : le ponçage doux" },
      {
        type: "p",
        text: "Sur un parquet ancien, on ponce le minimum. Grains 60 puis 100 puis 150 maximum. Surtout, ponceuse à bande lente ou orbitale large : jamais de monobrosse agressive qui creuserait le bois ramolli par les ans.",
      },
      {
        type: "quote",
        text: "On ne ponce pas un parquet de 1880 comme un parquet de 2010. L'objectif n'est pas l'uniformité — c'est de révéler la patine sans l'effacer.",
      },
      { type: "h2", text: "Étape 4 : la finition adaptée à l'époque" },
      {
        type: "list",
        items: [
          "Pour les parquets haussmanniens : huile cire dure ton bois ou légèrement ambré.",
          "Pour les parquets Art déco : huile teintée brun chaud ou cire d'abeille naturelle.",
          "Pour les parquets de ferme ou de chalet : huile mate, jamais de vernis.",
        ],
      },
    ],
    faq: [
      {
        q: "Faut-il déposer un parquet ancien avant de le rénover ?",
        a: "Rarement. Dans 80 % des cas, recollage local, recalage et ponçage doux suffisent. La dépose complète est réservée aux supports irrécupérables ou aux remises à niveau structurelles.",
      },
      {
        q: "Peut-on poser un plancher chauffant sous un parquet ancien remis en place ?",
        a: "Techniquement oui, mais c'est complexe : il faut déposer, isoler, installer le système, puis recoller. Un artisan qualifié est indispensable, et le résultat doit être validé par un essai d'hygrométrie sur plusieurs semaines.",
      },
      {
        q: "Combien coûte la rénovation d'un parquet ancien ?",
        a: "À partir de 45 €/m² pour un ponçage et un re-huilage simples. Comptez 80 à 120 €/m² pour une rénovation complète avec recollage, remplacement partiel et finition haut de gamme.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
