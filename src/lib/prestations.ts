// Prestations parquet — utilisées pour les pages SEO locales
// /parqueteur/$ville/$prestation
export type Prestation = {
  slug: string;
  /** Nom court (H1, breadcrumb) */
  name: string;
  /** Nom long pour les meta titres */
  longName: string;
  /** Verbe d'action ("poser", "poncer"...) */
  verb: string;
  /** Description courte pour les cartes / hub */
  short: string;
  /** Tarif indicatif national (affiné par ville si besoin) */
  tarif: string;
  /** Durée indicative pour ~30 m² */
  duree: string;
  /** Paragraphe descriptif (contenu principal de la page) */
  description: string;
  /** Points de méthode / étapes */
  etapes: { title: string; text: string }[];
  /** Bénéfices / "pourquoi nous" */
  benefits: string[];
  /** Mots-clés SEO additionnels */
  keywords: string[];
};

export const PRESTATIONS: Prestation[] = [
  {
    slug: "pose-parquet",
    name: "Pose de parquet",
    longName: "Pose de parquet neuf",
    verb: "poser",
    short:
      "Massif, contrecollé ou stratifié — pose clouée, collée ou flottante par un artisan vérifié.",
    tarif: "35 – 95 €/m²",
    duree: "3 à 7 jours pour 30 m²",
    description:
      "La pose d'un parquet neuf est une opération technique qui conditionne la durée de vie du sol. Le choix de la technique (clouée sur lambourdes, collée pleine surface, flottante sur sous-couche) dépend du support existant, de la pièce, et du type de parquet retenu. Nos artisans réalisent la pose dans les règles de l'art DTU 51.2 et 51.11.",
    etapes: [
      {
        title: "Diagnostic du support",
        text: "Mesure d'humidité, contrôle de planéité, vérification des points singuliers (radiateur, seuils).",
      },
      {
        title: "Préparation",
        text: "Ragréage si besoin, dépose de l'ancien revêtement, dépoussiérage, pose d'une sous-couche acoustique.",
      },
      {
        title: "Pose des lames",
        text: "Calepinage, coupe précise des lames, pose collée ou clouée selon la technique retenue.",
      },
      {
        title: "Finitions",
        text: "Plinthes, seuils, joints périphériques, contrôle final du rendu et du calage acoustique.",
      },
    ],
    benefits: [
      "Pose DTU 51.2 / 51.11 respectée",
      "Garantie décennale incluse",
      "Devis détaillé sous 48 h",
      "Calepinage validé avant pose",
    ],
    keywords: [
      "pose parquet",
      "poseur parquet",
      "installation parquet",
      "pose chevron",
      "pose point de hongrie",
      "pose contrecollé",
    ],
  },
  {
    slug: "poncage-vitrification",
    name: "Ponçage & vitrification",
    longName: "Ponçage et vitrification de parquet",
    verb: "poncer et vitrifier",
    short:
      "Redonner éclat et protection à un parquet existant. Ponçage progressif puis vernis 1 à 3 couches.",
    tarif: "25 – 45 €/m²",
    duree: "2 à 4 jours pour 30 m²",
    description:
      "Le ponçage + vitrification est la rénovation la plus demandée. Trois passes de ponçage à grain décroissant éliminent l'usure et les rayures, puis une vitrification au vernis polyuréthane offre une protection durable adaptée aux pièces à fort passage. Le parquet retrouve un aspect neuf pour 30 à 50 % du prix d'un remplacement.",
    etapes: [
      {
        title: "Protection du chantier",
        text: "Bâchage des meubles, protection des huisseries, scellement des fissures et joints.",
      },
      {
        title: "Ponçage en 3 passes",
        text: "Grain 40 puis 80 puis 120 pour une surface parfaitement plane et lisse.",
      },
      {
        title: "Dépoussiérage industriel",
        text: "Aspirateur HEPA puis chiffon antistatique pour éliminer toute poussière résiduelle.",
      },
      {
        title: "Vitrification 2 à 3 couches",
        text: "Vernis polyuréthane à l'eau, mat ou satiné, avec égrenage entre chaque couche.",
      },
    ],
    benefits: [
      "Résistance forte aux passages",
      "Entretien à l'eau savonneuse",
      "Aspect mat, satiné ou brillant",
      "Garantie 5 à 10 ans selon vernis",
    ],
    keywords: [
      "ponçage parquet",
      "vitrification parquet",
      "rénovation parquet",
      "vernis parquet",
      "remise à neuf parquet",
    ],
  },
  {
    slug: "ponçage-huilage",
    name: "Ponçage & huilage",
    longName: "Ponçage et huilage de parquet",
    verb: "poncer et huiler",
    short:
      "Finition naturelle qui pénètre le bois — aspect mat authentique, rénovable par zone.",
    tarif: "30 – 50 €/m²",
    duree: "3 à 5 jours pour 30 m²",
    description:
      "L'huile dure (Rubio Monocoat, Osmo, Blanchon) pénètre dans la fibre du bois et le protège de l'intérieur, contrairement au vernis qui forme un film en surface. Avantage : un éclat de sol ou une rayure se rénove localement sans tout reponcer. Idéal pour les parquets massifs et les amateurs de toucher bois authentique.",
    etapes: [
      {
        title: "Ponçage à grain fin",
        text: "Passes plus fines (jusqu'au grain 150) pour ouvrir les pores du bois et faciliter la pénétration de l'huile.",
      },
      {
        title: "Application 1ʳᵉ couche",
        text: "Huile dure appliquée au rouleau ou à la spatule selon le produit, essuyage de l'excédent.",
      },
      {
        title: "Temps de séchage",
        text: "12 à 24 h selon hygrométrie, contrôle visuel et tactile de l'absorption.",
      },
      {
        title: "Application 2ᵉ couche",
        text: "Seconde passe pour saturer le bois, polissage final pour un toucher soyeux.",
      },
    ],
    benefits: [
      "Aspect bois naturel préservé",
      "Rénovation possible par zone",
      "Sans COV, respect de l'air intérieur",
      "Compatible chauffage au sol",
    ],
    keywords: [
      "huilage parquet",
      "ponçage huile dure",
      "rubio monocoat",
      "osmo parquet",
      "huile naturelle parquet",
    ],
  },
  {
    slug: "renovation-parquet-ancien",
    name: "Rénovation parquet ancien",
    longName: "Rénovation de parquet ancien",
    verb: "rénover",
    short:
      "Recollage de lames, reprise de mosaïque, ponçage doux et finition adaptée à l'époque.",
    tarif: "55 – 130 €/m²",
    duree: "5 à 10 jours pour 30 m²",
    description:
      "Rénover un parquet ancien (Versailles, point de Hongrie, chevron, mosaïque) demande un savoir-faire de restaurateur : diagnostic précis de l'usure, recollage des lames désolidarisées, remplacement à l'identique des pièces cassées, ponçage doux pour préserver la couche d'usure, finition cohérente avec l'esthétique d'origine.",
    etapes: [
      {
        title: "Diagnostic patrimoine",
        text: "Mesure de la couche d'usure restante, identification de l'essence et de l'époque, repérage des pièces à remplacer.",
      },
      {
        title: "Recollage & réparations",
        text: "Recollage des lames sonnant creux, fabrication sur mesure des pièces manquantes en essence identique.",
      },
      {
        title: "Ponçage progressif",
        text: "Ponçage doux pour préserver la patine, attention particulière aux bordures et motifs complexes.",
      },
      {
        title: "Finition cohérente",
        text: "Cire d'antan, huile teintée ou vitrification mate selon l'esthétique recherchée.",
      },
    ],
    benefits: [
      "Préservation du patrimoine",
      "Pièces de remplacement sur mesure",
      "Respect du calepinage d'origine",
      "Garantie décennale incluse",
    ],
    keywords: [
      "rénovation parquet ancien",
      "restauration parquet versailles",
      "rénovation point de hongrie",
      "parquet haussmannien",
      "réparation parquet",
    ],
  },
  {
    slug: "reparation-degat-des-eaux",
    name: "Réparation dégât des eaux",
    longName: "Réparation parquet après dégât des eaux",
    verb: "réparer",
    short:
      "Intervention rapide après sinistre, devis assurance, reprise localisée ou globale.",
    tarif: "180 – 1 200 € (forfait)",
    duree: "1 à 5 jours selon ampleur",
    description:
      "Après un dégât des eaux, le parquet gondole, sonne creux ou se décolle. Nos artisans interviennent sous 72 h pour diagnostiquer, mesurer l'humidité résiduelle, et établir un devis chiffré pour votre assurance. Reprise localisée (quelques lames) ou dépose-repose complète selon l'ampleur.",
    etapes: [
      {
        title: "Diagnostic d'urgence",
        text: "Visite sous 72 h, mesure d'humidité du support et des lames, photos pour le dossier assurance.",
      },
      {
        title: "Devis assurance",
        text: "Devis détaillé conforme aux exigences MRH / PNO, transmis sous 48 h.",
      },
      {
        title: "Séchage du support",
        text: "Si humidité résiduelle, mise en place de déshumidificateurs ou séchage par injection avant intervention.",
      },
      {
        title: "Reprise du parquet",
        text: "Remplacement des lames endommagées en essence identique ou dépose-repose si surface importante.",
      },
    ],
    benefits: [
      "Intervention sous 72 h",
      "Devis assurance conforme",
      "Accompagnement dossier sinistre",
      "Reprise à l'identique",
    ],
    keywords: [
      "parquet dégât des eaux",
      "réparation parquet sinistre",
      "parquet gondolé",
      "devis assurance parquet",
      "expert parquet sinistre",
    ],
  },
  {
    slug: "pose-point-de-hongrie",
    name: "Pose point de Hongrie",
    longName: "Pose de parquet point de Hongrie",
    verb: "poser",
    short:
      "Pose technique en chevrons à 45° ou 60°, calepinage précis, finition haut de gamme.",
    tarif: "75 – 140 €/m²",
    duree: "5 à 8 jours pour 30 m²",
    description:
      "Le point de Hongrie est le motif iconique du parquet français — chevrons coupés à 45° ou 60° qui forment une ligne brisée d'une géométrie parfaite. La pose exige un calepinage millimétrique, un collage pleine surface et un savoir-faire que peu d'artisans maîtrisent encore. Le rendu, lui, traverse les modes.",
    etapes: [
      {
        title: "Calepinage millimétrique",
        text: "Tracé de l'axe central, calcul des départs, validation visuelle avec le client avant collage.",
      },
      {
        title: "Préparation du support",
        text: "Ragréage parfait, mesure d'hygrométrie, primaire d'accrochage adapté à la colle MS Polymer.",
      },
      {
        title: "Pose collée plein bain",
        text: "Collage pleine surface lame par lame, contrôle de l'alignement à chaque rangée.",
      },
      {
        title: "Ponçage & finition",
        text: "Ponçage progressif puis huilage ou vitrification mate selon le rendu recherché.",
      },
    ],
    benefits: [
      "Calepinage validé avant pose",
      "Pose collée DTU 51.2",
      "Essences au choix (chêne, noyer, teck)",
      "Rendu haut de gamme garanti",
    ],
    keywords: [
      "pose point de hongrie",
      "parquet chevron",
      "parquet hongrois",
      "calepinage point de hongrie",
      "parquet français traditionnel",
    ],
  },
];

export function getPrestationBySlug(slug: string): Prestation | undefined {
  return PRESTATIONS.find((p) => p.slug === slug);
}
