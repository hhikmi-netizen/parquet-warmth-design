/**
 * Piliers SEO longue-traîne — données structurées pour PillarPage.
 * Chaque pilier cible un cluster de requêtes commerciales / informationnelles.
 */

export interface PillarSection {
  /** H2 de la section */
  title: string;
  /** Sur-titre eyebrow */
  kicker: string;
  /** Paragraphe d'intro (1-2 phrases) */
  intro: string;
  /** Bullets clés */
  bullets: string[];
}

export interface PillarFaq {
  question: string;
  answer: string;
}

export interface PillarRow {
  label: string;
  value: string;
}

export interface Pillar {
  slug: string; // sans /
  title: string; // <title>
  h1: string;
  h1Highlight?: string;
  description: string; // meta description
  keywords: string;
  eyebrow: string;
  intro: string;
  /** Stats clés affichées en hero (4 max) */
  stats: PillarRow[];
  /** Tableau comparatif / prix (optionnel) */
  table?: {
    title: string;
    kicker: string;
    headers: string[];
    rows: string[][];
  };
  sections: PillarSection[];
  faq: PillarFaq[];
  /** Liens internes vers autres piliers / pages */
  related: { label: string; href: string }[];
  ctaTitle: string;
  ctaText: string;
}

// ---------------------------------------------------------------------------
// Pilier 1 — Prix ponçage parquet
// ---------------------------------------------------------------------------
const POSE_PONCAGE: Pillar = {
  slug: "prix-poncage-parquet",
  title: "Prix ponçage parquet 2026 : tarif au m², devis & guide complet",
  h1: "Prix ponçage parquet",
  h1Highlight: "au m² en 2026.",
  description:
    "Combien coûte le ponçage d'un parquet ? Tarif au m², prix vitrification, huile ou cire, facteurs de variation et devis artisan vérifié sous 24 h.",
  keywords:
    "prix ponçage parquet, tarif ponçage parquet au m², prix vitrification parquet, ponçage parquet massif, devis ponçage parquet",
  eyebrow: "Guide tarifs",
  intro:
    "Le ponçage parquet est l'opération qui redonne son éclat à un sol abîmé : on retire 1 à 3 mm de bois pour effacer rayures, traces et anciennes finitions. Comptez en moyenne 25 à 45 €/m² ponçage + finition, mais le prix dépend fortement de la surface, du type de parquet et de la finition choisie. Voici le détail complet.",
  stats: [
    { label: "Prix moyen", value: "25–45 €/m²" },
    { label: "Avec finition", value: "35–65 €/m²" },
    { label: "Durée chantier", value: "2–4 jours" },
    { label: "Devis", value: "Sous 24 h" },
  ],
  table: {
    kicker: "Grille tarifaire",
    title: "Prix ponçage parquet 2026 — tarifs au m²",
    headers: ["Prestation", "Prix bas", "Prix haut", "Inclus"],
    rows: [
      ["Ponçage seul", "18 €/m²", "28 €/m²", "3 passes, dépoussiérage"],
      ["Ponçage + vitrification", "30 €/m²", "50 €/m²", "Vitrificateur PU 2 couches"],
      ["Ponçage + huile dure", "35 €/m²", "55 €/m²", "Huile naturelle 2 couches"],
      ["Ponçage + cire", "32 €/m²", "48 €/m²", "Fond dur + cire d'abeille"],
      ["Réparation lames + ponçage", "+ 15 €/m²", "+ 40 €/m²", "Remplacement à l'identique"],
      ["Bord de plinthe / escalier", "+ 8 €/ml", "+ 18 €/ml", "Travail manuel"],
    ],
  },
  sections: [
    {
      kicker: "Ce qui fait varier le prix",
      title: "Pourquoi un même chantier peut doubler de prix",
      intro:
        "5 facteurs concentrent 90 % de l'écart entre un devis bas et un devis haut. Comprenez-les avant de comparer.",
      bullets: [
        "Surface : sous 20 m², le forfait minimum (350-500 €) gonfle le prix au m².",
        "Type de parquet : massif > 8 mm OK, contrecollé > 2,5 mm de couche d'usure obligatoire, flottant non ponçable.",
        "État du bois : rayures profondes, taches d'eau, anciennes peintures = 2 à 3 passes supplémentaires.",
        "Finition : huile dure et vitrificateur bicomposant sont 20 à 30 % plus chers que la vitrification mono.",
        "Accessibilité : étage sans ascenseur, meubles à déplacer, escalier = supplément 100 à 400 €.",
      ],
    },
    {
      kicker: "Méthode",
      title: "Les 5 étapes d'un ponçage de parquet pro",
      intro:
        "Un ponçage réussi suit toujours le même protocole. Voici ce que doit contenir le devis de votre artisan.",
      bullets: [
        "Diagnostic : type de parquet, épaisseur restante, hygrométrie du support (< 3 %).",
        "Préparation : dépose plinthes ou protection, rebouchage trous et fissures à la pâte à bois.",
        "Ponçage : 3 passes croisées (grain 40 → 60 → 100/120) avec ponceuse à bande + bordureuse.",
        "Dépoussiérage minutieux : aspiration + nettoyage à sec avant finition.",
        "Finition : vitrification, huile ou cire — toujours 2 couches minimum avec ponçage intermédiaire.",
      ],
    },
    {
      kicker: "Quelle finition choisir",
      title: "Vitrification, huile ou cire : le comparatif",
      intro:
        "La finition représente 30 à 50 % du budget et conditionne l'entretien futur. Choisissez en fonction de l'usage.",
      bullets: [
        "Vitrification : la plus résistante (10-15 ans), idéale pour cuisine et passage intense. Aspect satiné ou brillant.",
        "Huile dure : aspect naturel, réparable localement, rénovation tous les 3-5 ans. Idéal séjour, chambres.",
        "Cire : aspect chaleureux et patiné, mais peu résistante à l'eau. Réservée pièces sèches faible passage.",
        "Bois bruts (chêne, frêne) acceptent les 3 finitions. Exotiques (teck, ipé) : huile recommandée.",
      ],
    },
    {
      kicker: "Faut-il faire soi-même ?",
      title: "Ponçage parquet en DIY : économie réelle ou fausse bonne idée ?",
      intro:
        "La location matériel revient à 250-400 € le week-end + finition. Sur le papier 50 % moins cher, mais 3 risques à connaître.",
      bullets: [
        "Risque n°1 : ponceuse à bande mal maîtrisée = creux irréversibles sur lames fines (< 4 mm).",
        "Risque n°2 : sous-évaluation du temps. 30 m² en DIY = 2 jours complets, vs 4-6 h en pro.",
        "Risque n°3 : finition mal appliquée = traces, bulles, mauvaise tenue dans le temps.",
        "Recommandation : DIY OK pour parquet massif récent < 30 m². Au-delà, un pro est rentable.",
      ],
    },
  ],
  faq: [
    {
      question: "Quel est le prix moyen d'un ponçage de parquet en 2026 ?",
      answer:
        "Comptez entre 25 et 45 €/m² ponçage seul, et 35 à 65 €/m² ponçage + finition (vitrification, huile ou cire). Pour une pièce de 25 m² avec vitrification, le budget tourne autour de 1 000 à 1 500 €. Les devis Parqueto sont gratuits et détaillés ligne par ligne.",
    },
    {
      question: "Combien de fois peut-on poncer un parquet ?",
      answer:
        "Un parquet massif (≥ 14 mm) supporte 5 à 8 ponçages sur sa durée de vie (chaque passage retire 1 à 1,5 mm). Un contrecollé avec couche d'usure de 2,5 à 4 mm n'accepte qu'un seul ponçage. Le flottant stratifié, lui, n'est jamais ponçable.",
    },
    {
      question: "Combien de temps dure un ponçage parquet ?",
      answer:
        "Pour une pièce de 20 à 30 m² : 1 jour de ponçage + 1 jour pour la finition (avec 24 h de séchage entre couches). Soit 2 à 4 jours en tout selon la finition choisie. La pièce reste inutilisable pendant tout le chantier et 24 à 48 h après la dernière couche.",
    },
    {
      question: "Quelle finition est la plus durable après ponçage ?",
      answer:
        "La vitrification polyuréthane bicomposant tient 12 à 15 ans en passage intense. L'huile dure offre 5 à 8 ans mais se renove localement sans tout reponcer — c'est souvent le meilleur compromis pour un parquet ancien que vous voulez garder vivant.",
    },
    {
      question: "Le ponçage est-il pris en charge par l'assurance ?",
      answer:
        "Oui si le ponçage suit un sinistre couvert (dégât des eaux, incendie, vandalisme). Votre multirisque habitation indemnise alors la remise en état à l'identique. Notre artisan établit un devis conforme aux exigences expert et peut dialoguer directement avec votre compagnie.",
    },
    {
      question: "Peut-on poncer un parquet flottant ?",
      answer:
        "Non : le parquet flottant stratifié n'a pas de couche bois véritable et ne supporte pas le ponçage. Le parquet flottant contrecollé peut être poncé une fois si la couche d'usure dépasse 2,5 mm — vérifiez la fiche technique du fabricant avant d'engager le chantier.",
    },
  ],
  related: [
    { label: "Parquet qui gondole : diagnostic & solutions", href: "/parquet-qui-gondole" },
    { label: "Rénover un parquet ancien", href: "/renover-parquet-ancien" },
    { label: "Parquet flottant ou massif : comparatif", href: "/parquet-flottant-ou-massif" },
    { label: "Estimer mon projet en 2 min", href: "/estimation" },
  ],
  ctaTitle: "Recevez votre devis ponçage parquet sous 24 h",
  ctaText: "Estimation gratuite, sans engagement, par un artisan vérifié assuré décennale.",
};

// ---------------------------------------------------------------------------
// Pilier 2 — Parquet flottant ou massif
// ---------------------------------------------------------------------------
const FLOTTANT_OU_MASSIF: Pillar = {
  slug: "parquet-flottant-ou-massif",
  title: "Parquet flottant ou massif : comparatif 2026, prix & quel choisir",
  h1: "Parquet flottant ou massif",
  h1Highlight: "lequel choisir ?",
  description:
    "Flottant, contrecollé ou massif ? Comparatif complet : prix, durée de vie, pose, entretien, compatibilité chauffage au sol. Conseils d'artisans vérifiés.",
  keywords:
    "parquet flottant ou massif, comparatif parquet, différence parquet flottant massif, parquet contrecollé, quel parquet choisir",
  eyebrow: "Comparatif",
  intro:
    "Trois grandes familles cohabitent sous le nom de « parquet » : massif, contrecollé (souvent appelé « flottant ») et stratifié. Leur prix varie du simple au triple, et tous ne se valent pas en durée de vie, rénovation possible, ou compatibilité chauffage au sol. Voici comment choisir en 5 minutes.",
  stats: [
    { label: "Massif", value: "60–180 €/m²" },
    { label: "Contrecollé", value: "30–90 €/m²" },
    { label: "Stratifié", value: "10–40 €/m²" },
    { label: "Durée vie max", value: "100+ ans" },
  ],
  table: {
    kicker: "Comparatif",
    title: "Massif vs contrecollé vs stratifié : le match",
    headers: ["Critère", "Massif", "Contrecollé", "Stratifié"],
    rows: [
      ["Composition", "100 % bois noble", "3 couches, parement bois", "Décor imprimé sur HDF"],
      ["Prix au m² (fourni)", "60–180 €", "30–90 €", "10–40 €"],
      ["Durée de vie", "50–100 ans", "20–40 ans", "10–20 ans"],
      ["Ponçable", "5 à 8 fois", "0 à 1 fois", "Jamais"],
      ["Chauffage au sol", "Limité", "Recommandé", "OK (compatible)"],
      ["Pose", "Clouée ou collée", "Flottante ou collée", "Flottante uniquement"],
      ["Résistance eau", "Faible", "Moyenne", "Faible à moyenne"],
      ["Aspect bois véritable", "Oui", "Oui", "Non (imitation)"],
    ],
  },
  sections: [
    {
      kicker: "Massif",
      title: "Parquet massif : le patrimoine qui traverse les générations",
      intro:
        "Une lame de massif est 100 % bois (chêne, châtaignier, exotique...), 14 à 23 mm d'épaisseur. Investissement initial fort, mais durée de vie quasi illimitée.",
      bullets: [
        "Idéal séjour, chambre, pièces nobles. Patine avec le temps.",
        "Pose collée ou clouée sur lambourdes — exclu en flottant.",
        "Compatible chauffage au sol uniquement si lames < 21 mm, essence stable (chêne) et pose collée.",
        "Se ponce 5 à 8 fois → rénovable à chaque génération.",
        "Sensible à l'humidité : à exclure salle de bain et buanderie.",
      ],
    },
    {
      kicker: "Contrecollé",
      title: "Parquet contrecollé : le bon compromis stabilité / prix",
      intro:
        "Trois couches collées : parement bois véritable (2,5 à 6 mm), âme en pin/HDF, contre-parement. Stable, moderne, posable partout.",
      bullets: [
        "Aspect identique au massif côté visible.",
        "Pose flottante (clic, sans colle) la plus rapide : 25-40 €/m² main d'œuvre.",
        "Recommandé sur chauffage au sol grâce à sa stabilité dimensionnelle.",
        "Ponçable une fois si couche d'usure ≥ 2,5 mm.",
        "Durée de vie 20 à 40 ans selon trafic et entretien.",
      ],
    },
    {
      kicker: "Stratifié",
      title: "Parquet stratifié : techniquement, ce n'est pas du parquet",
      intro:
        "Le « parquet stratifié » est un revêtement à décor imprimé sur panneau HDF. Norme française : pour s'appeler parquet, il faut ≥ 2,5 mm de bois noble en surface. Le stratifié n'en a aucun.",
      bullets: [
        "Budget mini : 10-25 €/m² fourni pour entrée et chambres secondaires.",
        "Pose flottante très facile, DIY accessible.",
        "Pas de bois véritable : pas de patine, pas de ponçage, remplacement intégral à terme.",
        "Bonne résistance aux rayures (couche mélaminée), correcte à l'humidité légère.",
        "Durée de vie 10 à 20 ans selon classe d'usage (AC3 à AC5).",
      ],
    },
    {
      kicker: "Aide à la décision",
      title: "Quel parquet pour quelle pièce et quel budget ?",
      intro:
        "Trois questions à se poser avant de choisir : durée de vie attendue, support, budget global pose comprise.",
      bullets: [
        "Pièce de vie patrimoniale, budget > 100 €/m² : massif chêne huilé, pose collée.",
        "Appartement neuf avec chauffage au sol : contrecollé clic chêne 12-14 mm.",
        "Location ou résidence secondaire : stratifié AC4, finition mate.",
        "Salle de bain : stratifié haute résistance H2O ou carrelage imitation bois — jamais de massif.",
        "Rénovation parquet ancien : massif neuf à l'identique ou contrecollé compatible épaisseur existante.",
      ],
    },
  ],
  faq: [
    {
      question: "Quelle est la différence entre parquet flottant et massif ?",
      answer:
        "Le massif est une lame 100 % bois noble (14-23 mm), posée clouée ou collée. Le « flottant » désigne une pose (sans colle ni clou, lames clipsées) plutôt qu'un matériau : il s'agit le plus souvent de contrecollé (parement bois sur âme HDF) ou de stratifié (décor imprimé sans bois véritable).",
    },
    {
      question: "Quel parquet choisir pour un chauffage au sol ?",
      answer:
        "Le contrecollé est le plus recommandé grâce à sa stabilité dimensionnelle. Le massif est possible uniquement en chêne ou châtaignier, < 21 mm, pose collée. Le stratifié reste une option budget. Vérifiez toujours la mention « compatible PCBT / RT2012 » sur la fiche technique.",
    },
    {
      question: "Combien coûte un parquet pose comprise en 2026 ?",
      answer:
        "Comptez 45 à 100 €/m² pour un contrecollé clic posé, 90 à 250 €/m² pour un massif chêne collé, et 30 à 60 €/m² pour un stratifié posé. Ces fourchettes incluent fourniture, sous-couche, pose, plinthes et finition. Le devis Parqueto est détaillé poste par poste.",
    },
    {
      question: "Parquet flottant ou massif : lequel dure le plus longtemps ?",
      answer:
        "Le massif sans équivoque : 50 à 100 ans, jusqu'à 8 ponçages possibles. Un contrecollé tient 20 à 40 ans avec 0 ou 1 ponçage selon couche d'usure. Le stratifié plafonne à 10-20 ans avant remplacement intégral.",
    },
    {
      question: "Peut-on poser du parquet flottant sur du carrelage ?",
      answer:
        "Oui, le parquet contrecollé en pose flottante est idéal sur carrelage existant : pas de dépose, pose en 1 jour, sous-couche acoustique recommandée. Vérifiez la planéité (< 3 mm sous règle de 2 m) et l'épaisseur finale par rapport aux huisseries.",
    },
    {
      question: "Quel parquet pour une salle de bain ?",
      answer:
        "Pas de massif, trop sensible à l'eau. Privilégiez un stratifié haute résistance hydrofuge (norme EN 13329, classe H2O) ou un contrecollé exotique (teck, bambou) huilé avec joints silicone périphériques. À défaut, optez pour un carrelage imitation bois.",
    },
  ],
  related: [
    { label: "Prix ponçage parquet", href: "/prix-poncage-parquet" },
    { label: "Parquet sur carrelage", href: "/parquet-sur-carrelage" },
    { label: "Rénover un parquet ancien", href: "/renover-parquet-ancien" },
    { label: "Estimer mon projet", href: "/estimation" },
  ],
  ctaTitle: "Hésitez encore ? Un artisan vous conseille",
  ctaText: "Recevez un devis personnalisé sous 24 h avec recommandation produit selon votre support et votre usage.",
};

// ---------------------------------------------------------------------------
// Pilier 3 — Rénover parquet ancien
// ---------------------------------------------------------------------------
const RENOVER_ANCIEN: Pillar = {
  slug: "renover-parquet-ancien",
  title: "Rénover un parquet ancien : guide complet, prix & étapes 2026",
  h1: "Rénover un parquet ancien",
  h1Highlight: "sans le dénaturer.",
  description:
    "Parquet point de Hongrie, chevrons, lames anciennes : comment rénover sans casser le cachet. Diagnostic, méthode, prix au m² et artisan vérifié sous 24 h.",
  keywords:
    "rénover parquet ancien, rénovation parquet point de Hongrie, parquet chevron rénovation, prix rénovation parquet ancien, restaurer parquet",
  eyebrow: "Patrimoine",
  intro:
    "Un parquet ancien — point de Hongrie, chevrons, pose à l'anglaise, versailles — est un patrimoine. Mal rénové, il perd toute sa valeur ; bien restauré, il prend 30 ans de vie supplémentaire. Voici la méthode appliquée par les artisans Parqueto, avec budget réaliste et arbitrages clés.",
  stats: [
    { label: "Diagnostic", value: "Gratuit" },
    { label: "Prix rénovation", value: "40–120 €/m²" },
    { label: "Durée chantier", value: "3–10 j" },
    { label: "Garantie décennale", value: "10 ans" },
  ],
  table: {
    kicker: "Postes de prix",
    title: "Combien coûte la rénovation d'un parquet ancien ?",
    headers: ["Intervention", "Prix bas", "Prix haut", "Inclus"],
    rows: [
      ["Diagnostic + relevé", "0 €", "150 €", "Visite, mesures, photos, devis"],
      ["Réparation lames", "20 €/lame", "80 €/lame", "Remplacement à l'identique, calage"],
      ["Ponçage complet", "20 €/m²", "35 €/m²", "3 passes croisées, bordureuse"],
      ["Finition huile dure", "15 €/m²", "30 €/m²", "Saturation 2 couches"],
      ["Vitrification mate", "12 €/m²", "25 €/m²", "PU bicomposant 2 couches"],
      ["Décirage complet", "10 €/m²", "20 €/m²", "Solvant + neutralisation"],
      ["Traitement insectes/champignons", "20 €/m²", "60 €/m²", "Curatif + préventif"],
    ],
  },
  sections: [
    {
      kicker: "Diagnostic",
      title: "Avant de toucher au parquet : 5 vérifications à faire",
      intro:
        "Un parquet ancien cache souvent des surprises. Un diagnostic raté = budget multiplié par 2 en cours de chantier.",
      bullets: [
        "Épaisseur restante : moins de 6 mm de bois noble = ponçage impossible.",
        "Stabilité du support : lambourdes saines, sous-plancher sec, pas de creux ni grincements anormaux.",
        "Présence d'insectes xylophages (vrillette, capricorne) : trous de 1-3 mm, sciure fine = traitement obligatoire avant rénovation.",
        "Humidité : taux > 12 % sur le bois ou > 3 % sur le support = recherche de fuite avant tout.",
        "Anciennes finitions : cires accumulées, peintures, colles bitumineuses — dictent la méthode (ponçage classique vs décapage chimique).",
      ],
    },
    {
      kicker: "Méthode",
      title: "Les 6 étapes d'une rénovation parquet ancien réussie",
      intro:
        "L'ordre des opérations conditionne le résultat. Sauter une étape (ex. : poncer sans avoir traité l'humidité) ruine le chantier.",
      bullets: [
        "1. Assainissement support : recherche fuite, ventilation, traitement xylophages si besoin.",
        "2. Réparation lames cassées ou manquantes : remplacement à l'identique (bois de récup ou neuf vieilli).",
        "3. Décirage / décapage si finition incompatible avec ponçage.",
        "4. Ponçage 3 passes croisées + travail manuel sur motifs (point de Hongrie, frises).",
        "5. Rebouchage joints à la pâte à bois teintée si nécessaire.",
        "6. Finition : huile dure (aspect d'origine) ou vitrification mate (résistance moderne).",
      ],
    },
    {
      kicker: "Cas particuliers",
      title: "Point de Hongrie, chevrons, versailles : les pièges des motifs",
      intro:
        "Les parquets à motifs demandent un savoir-faire spécifique. Un artisan non formé peut détruire en 1 journée ce qui a tenu 80 ans.",
      bullets: [
        "Point de Hongrie : ponçage en biais impossible — travail manuel obligatoire aux extrémités.",
        "Chevrons hongrois : assurer le bon angle (45° ou 60°) au remplacement.",
        "Versailles / Aremberg : panneaux à démonter pour rénovation atelier puis repose.",
        "Pose à l'anglaise (lames droites) : la plus simple à rénover, ponçage parallèle au fil.",
        "Frises et plinthes anciennes : à protéger ou démonter — irremplaçables si abîmées.",
      ],
    },
    {
      kicker: "Aides & assurances",
      title: "Quelles aides pour rénover un parquet ancien ?",
      intro:
        "Plusieurs dispositifs allègent la facture, surtout en bâtiment classé ou monument historique.",
      bullets: [
        "TVA réduite à 10 % pour rénovation logement de plus de 2 ans (sur main d'œuvre et fournitures).",
        "MaPrimeRénov' : pas pour le parquet seul, mais éligible dans un bouquet de travaux énergétiques (isolation sous-plancher).",
        "Bâtiments classés : aide Fondation du Patrimoine + déduction fiscale Malraux.",
        "Sinistre couvert (dégât des eaux, incendie) : remise en état à l'identique par assurance multirisque.",
        "Aides ANAH pour propriétaires occupants modestes en rénovation globale.",
      ],
    },
  ],
  faq: [
    {
      question: "Combien coûte la rénovation d'un parquet ancien au m² ?",
      answer:
        "Entre 40 et 120 €/m² selon l'état : un parquet en bon état nécessitant juste ponçage + vitrification est à 40-65 €/m² ; un parquet avec lames à remplacer, traitement insectes et finition huilée monte à 90-120 €/m². Le diagnostic gratuit Parqueto chiffre précisément votre cas.",
    },
    {
      question: "Peut-on rénover un parquet point de Hongrie soi-même ?",
      answer:
        "Non recommandé : le point de Hongrie nécessite un ponçage en plusieurs sens, du travail manuel aux extrémités, et la maîtrise du remplacement de lames à l'identique. Une erreur de ponçage à la machine détruit irréversiblement le motif. Faites appel à un artisan spécialiste parquets anciens.",
    },
    {
      question: "Comment savoir si mon parquet ancien est encore ponçable ?",
      answer:
        "Soulevez une plinthe ou regardez entre 2 lames : le parquet doit avoir au moins 6 mm de bois noble au-dessus des rainures (« languettes »). En dessous, le ponçage exposerait les assemblages et ruinerait le sol. Un artisan mesure précisément lors du diagnostic.",
    },
    {
      question: "Quelle finition pour un parquet ancien : huile ou vitrification ?",
      answer:
        "L'huile dure restitue l'aspect d'origine, se renove localement et nourrit le bois — idéale pour un parquet de caractère. La vitrification mate offre une résistance moderne (cuisine, passage intense) mais fige le bois. Pour un parquet patrimonial, l'huile gagne 9 fois sur 10.",
    },
    {
      question: "Combien de temps dure une rénovation parquet ancien ?",
      answer:
        "Comptez 3 à 5 jours pour 30 m² standard (ponçage + finition), jusqu'à 10 jours si remplacement de lames, traitement insectes ou décirage préalable. La pièce reste inutilisable pendant tout le chantier et 48 h après la dernière couche.",
    },
    {
      question: "Mon assurance prend-elle en charge la rénovation d'un parquet ancien ?",
      answer:
        "Oui si la rénovation fait suite à un sinistre (dégât des eaux, incendie, vandalisme) : l'assurance indemnise la remise en état à l'identique, parquet ancien inclus. Hors sinistre, la rénovation est à votre charge — mais éligible TVA 10 % et parfois aides ANAH.",
    },
  ],
  related: [
    { label: "Prix ponçage parquet", href: "/prix-poncage-parquet" },
    { label: "Parquet qui gondole", href: "/parquet-qui-gondole" },
    { label: "Parquet flottant ou massif", href: "/parquet-flottant-ou-massif" },
    { label: "Estimer mon projet", href: "/estimation" },
  ],
  ctaTitle: "Faites diagnostiquer votre parquet ancien gratuitement",
  ctaText: "Un artisan spécialiste parquets anciens vous rappelle sous 24 h pour un devis détaillé sans engagement.",
};

// ---------------------------------------------------------------------------
// Pilier 4 — Parquet sur carrelage
// ---------------------------------------------------------------------------
const PARQUET_SUR_CARRELAGE: Pillar = {
  slug: "parquet-sur-carrelage",
  title: "Pose parquet sur carrelage : méthode, prix & erreurs à éviter 2026",
  h1: "Parquet sur carrelage",
  h1Highlight: "sans casser le sol.",
  description:
    "Poser un parquet sur un carrelage existant : méthode (flottant ou collé), préparation, prix au m², compatibilité chauffage au sol et devis sous 24 h.",
  keywords:
    "parquet sur carrelage, pose parquet sur carrelage, parquet flottant sur carrelage, prix parquet sur carrelage, recouvrir carrelage parquet",
  eyebrow: "Méthode pose",
  intro:
    "Recouvrir un carrelage existant avec du parquet est aujourd'hui la solution rénovation la plus rapide : pas de dépose, pas de chape neuve, chantier d'une journée. Mais 3 vérifications sont indispensables avant de commencer — sous peine de problèmes de planéité, hauteur de porte ou tenue dans le temps. Voici le guide complet.",
  stats: [
    { label: "Prix posé", value: "45–110 €/m²" },
    { label: "Durée chantier", value: "1–3 j" },
    { label: "Sans dépose", value: "Oui" },
    { label: "Surépaisseur", value: "12–18 mm" },
  ],
  table: {
    kicker: "Grille tarifaire",
    title: "Prix parquet sur carrelage en 2026",
    headers: ["Type pose", "Fourniture m²", "Pose m²", "Total m²"],
    rows: [
      ["Stratifié clic sur carrelage", "15–35 €", "25–35 €", "40–70 €"],
      ["Contrecollé clic sur carrelage", "35–80 €", "30–45 €", "65–125 €"],
      ["Contrecollé collé sur carrelage", "35–80 €", "45–70 €", "80–150 €"],
      ["Massif collé sur carrelage", "60–180 €", "60–90 €", "120–270 €"],
      ["Sous-couche acoustique", "3–10 €", "—", "3–10 €"],
      ["Reprise plinthes & seuils", "—", "+ 150–400 €", "Forfait chantier"],
    ],
  },
  sections: [
    {
      kicker: "Préparation",
      title: "Les 3 vérifications obligatoires avant de poser",
      intro:
        "Sauter ces 3 contrôles est la cause n°1 des chantiers qui tournent mal. Un carrelage « OK à l'œil » peut cacher 3 défauts fatals.",
      bullets: [
        "Planéité : écart maximum 3 mm sous règle de 2 m. Au-delà, ragréage autolissant obligatoire (8-15 €/m²).",
        "Adhérence du carrelage : aucun carreau qui sonne creux, pas de fissure, pas de décollement.",
        "Hauteur de porte : surépaisseur de 12 à 18 mm (parquet + sous-couche) — vérifier que les portes ouvrent encore ou prévoir un rabotage.",
      ],
    },
    {
      kicker: "2 méthodes possibles",
      title: "Flottant ou collé : que choisir sur carrelage ?",
      intro:
        "La pose flottante (clic) est la plus simple, la pose collée est la plus stable. Le choix dépend du type de parquet et de l'usage.",
      bullets: [
        "Pose flottante (clic) sur sous-couche : idéale stratifié et contrecollé, chantier en 1 jour, démontable. La plus économique.",
        "Pose collée plein-bain : meilleure stabilité acoustique et thermique, obligatoire pour massif et chauffage au sol.",
        "Sous-couche acoustique 3-5 mm obligatoire en flottant : isole du bruit d'impact et corrige les micro-irrégularités.",
        "Joint de dilatation périphérique 8-10 mm impératif — masqué par les plinthes.",
        "Sens de pose : perpendiculaire à la source de lumière principale pour un rendu optimal.",
      ],
    },
    {
      kicker: "Chauffage au sol",
      title: "Parquet sur carrelage avec chauffage au sol : possible ?",
      intro:
        "Oui, mais avec des contraintes strictes. Le carrelage transmet bien la chaleur, le parquet doit respecter l'inertie thermique.",
      bullets: [
        "Pose collée plein-bain obligatoire : la pose flottante isole et baisse l'efficacité du chauffage.",
        "Parquet contrecollé < 14 mm recommandé (résistance thermique < 0,15 m².K/W).",
        "Massif possible uniquement en chêne / châtaignier < 21 mm, sur PCBT (Plancher Chauffant Basse Température, ≤ 28 °C surface).",
        "Sous-couche thermique compatible (pas d'acoustique épaisse).",
        "Montée en température progressive après pose : +5 °C/jour pendant 1 semaine.",
      ],
    },
    {
      kicker: "Pièges à éviter",
      title: "5 erreurs qui ruinent une pose parquet sur carrelage",
      intro:
        "Ces erreurs représentent 80 % des sinistres post-chantier que nos artisans rattrapent. Évitez-les dès le devis.",
      bullets: [
        "Oublier le ragréage : un défaut de planéité > 3 mm fait grincer le parquet flottant en quelques mois.",
        "Coller sans primaire d'accrochage : la colle parquet n'adhère pas au carrelage émaillé brut.",
        "Sous-couche trop épaisse : > 5 mm = parquet « mou » qui s'usera prématurément.",
        "Pas de jeu périphérique : le parquet gondole en 1 saison (dilatation bloquée par les murs).",
        "Massif flottant : interdit. Le massif se pose collé ou cloué, jamais en clic flottant.",
      ],
    },
  ],
  faq: [
    {
      question: "Peut-on poser n'importe quel parquet sur du carrelage ?",
      answer:
        "Non. Le stratifié et le contrecollé en pose flottante sont les plus adaptés (chantier rapide, démontable). Le massif est possible uniquement en pose collée plein-bain. Le carrelage doit être plan (< 3 mm sous règle de 2 m), bien collé et sec.",
    },
    {
      question: "Combien coûte une pose de parquet sur carrelage en 2026 ?",
      answer:
        "Comptez 40 à 70 €/m² posé pour un stratifié, 65 à 125 €/m² pour un contrecollé clic et 80 à 270 €/m² pour du contrecollé ou massif collé. Ajoutez 8-15 €/m² si ragréage nécessaire et 150-400 € de forfait pour reprise des plinthes et seuils.",
    },
    {
      question: "Faut-il enlever le carrelage avant de poser un parquet ?",
      answer:
        "Non, dans la grande majorité des cas la pose se fait directement par-dessus. Cela évite la dépose (poussière, casse), la chape neuve et permet un chantier d'une journée. Vérifiez juste la hauteur disponible (surépaisseur de 12 à 18 mm avec sous-couche) et l'état du carrelage existant.",
    },
    {
      question: "Quelle sous-couche pour parquet flottant sur carrelage ?",
      answer:
        "Une sous-couche acoustique de 3 à 5 mm, type fibre de bois compressée ou polyéthylène cellulaire. Elle isole du bruit d'impact (norme NF S 31-074, > 19 dB) et corrige les micro-irrégularités. Évitez les sous-couches trop épaisses (> 5 mm) qui rendent le parquet « mou ».",
    },
    {
      question: "Parquet sur carrelage avec chauffage au sol : c'est possible ?",
      answer:
        "Oui, à 3 conditions : pose collée plein-bain (pas flottante), parquet contrecollé < 14 mm ou massif chêne < 21 mm, et chauffage de type PCBT (température surface ≤ 28 °C). La résistance thermique du parquet ne doit pas dépasser 0,15 m².K/W pour préserver l'efficacité du chauffage.",
    },
    {
      question: "Quel délai pour poser un parquet sur carrelage ?",
      answer:
        "1 jour pour 30 m² en pose flottante clic, 2 à 3 jours en pose collée (temps de séchage colle + finitions). Si ragréage nécessaire, comptez 1 jour supplémentaire et 24-48 h de séchage avant pose. Devis Parqueto sous 24 h.",
    },
  ],
  related: [
    { label: "Parquet flottant ou massif", href: "/parquet-flottant-ou-massif" },
    { label: "Prix ponçage parquet", href: "/prix-poncage-parquet" },
    { label: "Parquet qui gondole", href: "/parquet-qui-gondole" },
    { label: "Estimer mon projet", href: "/estimation" },
  ],
  ctaTitle: "Devis pose parquet sur carrelage sous 24 h",
  ctaText: "Diagnostic planéité, recommandation produit et devis détaillé par un artisan vérifié.",
};

export const PILLARS: Pillar[] = [
  POSE_PONCAGE,
  FLOTTANT_OU_MASSIF,
  RENOVER_ANCIEN,
  PARQUET_SUR_CARRELAGE,
];

export function getPillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
