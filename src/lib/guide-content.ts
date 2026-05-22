// Le Guide Ultime du Parquet — contenu éditorial rédigé par Parqueto.
// Structuré, hiérarchisé, optimisé SEO/GEO/AEO.

export type Block =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "tip"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "image"; src: string; caption?: string };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Chapter = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  intro: string;
  cover: string; // imported asset url
  sections: Section[];
};

// Images
import cover from "@/assets/guide/cover.jpg";
import introImg from "@/assets/guide/introduction/01.webp";
import lexiqueImg from "@/assets/guide/introduction/03.webp";
import choisirImg from "@/assets/guide/choisir/01.webp";
import pieceImg from "@/assets/guide/choisir/05.webp";
import poserImg from "@/assets/guide/poser/01.webp";
import finirImg from "@/assets/guide/finir/01.webp";
import entretenirImg from "@/assets/guide/entretenir/01.webp";
import renoverImg from "@/assets/guide/renover/01.webp";
import problemesImg from "@/assets/guide/problemes/01.webp";

export const GUIDE_COVER = cover;

export const GUIDE_META = {
  title: "Le Guide Ultime du Parquet",
  subtitle: "Choisir · Poser · Entretenir · Rénover",
  author: "Hicham Hikmi — Fondateur de Parqueto",
  edition: "Édition 2026",
  signature: "Le parquet, sans détour.",
};

export const CHAPTERS: Chapter[] = [
  {
    id: "introduction",
    number: "00",
    title: "Introduction",
    kicker: "Pourquoi ce guide",
    intro:
      "Un parquet réussi ne doit rien au hasard. Il résulte de bons choix, d'une préparation rigoureuse, d'une pose maîtrisée et d'un entretien adapté. Ce guide rassemble, en quelques pages, l'essentiel qu'un poseur expérimenté met dix ans à apprendre.",
    cover: introImg,
    sections: [
      {
        id: "vision",
        title: "La vision Parqueto",
        blocks: [
          {
            type: "lead",
            text: "Rendre le parquet accessible, compréhensible et durable pour tous.",
          },
          {
            type: "p",
            text: "Chez Parqueto, nous croyons en la beauté naturelle du bois et en son pouvoir d'embellir chaque intérieur. Notre métier : transmettre, sans détour, ce qu'il faut savoir pour faire les bons choix et profiter pleinement de son parquet, année après année.",
          },
          {
            type: "h3",
            text: "Nos quatre engagements",
          },
          {
            type: "list",
            items: [
              "Matériaux sélectionnés avec soin, issus de filières contrôlées.",
              "Conseils indépendants : on recommande ce qui vous convient, pas ce qui coûte le plus cher.",
              "Transmission du savoir-faire : un contenu clair, pratique, complet.",
              "Votre satisfaction avant tout : un accompagnement de bout en bout.",
            ],
          },
          {
            type: "callout",
            title: "Mot du fondateur",
            text: "Ce guide est le fruit de nombreuses années d'expérience, de rencontres et de chantiers. Mon objectif : vous partager, avec clarté et sincérité, ce que j'aurais aimé savoir avant de me lancer. — Hicham Hikmi",
          },
        ],
      },
      {
        id: "comment-lire",
        title: "Comment lire ce guide",
        blocks: [
          {
            type: "p",
            text: "Six chapitres pour couvrir l'intégralité d'un projet parquet : choisir, préparer, poser, finir, entretenir, rénover. Chaque chapitre est autonome — vous pouvez sauter directement à celui qui vous concerne — mais l'ensemble forme une méthode cohérente.",
          },
          {
            type: "list",
            items: [
              "Encadrés orange : conseils d'expert à retenir.",
              "Tableaux : repères chiffrés (épaisseurs, dimensions, normes DTU).",
              "Lexique : tous les termes techniques expliqués en chapitre 1.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "lexique",
    number: "01",
    title: "Comprendre le parquet",
    kicker: "Vocabulaire & repères",
    intro:
      "Avant d'acheter, il faut savoir lire une fiche technique. Ce chapitre pose les définitions essentielles et les repères chiffrés qui reviendront tout au long du guide.",
    cover: lexiqueImg,
    sections: [
      {
        id: "definitions",
        title: "Le lexique essentiel",
        blocks: [
          {
            type: "p",
            text: "Quinze termes suffisent pour comprendre 95 % d'une fiche produit. Apprenez-les une fois, ils vous serviront pour toute la vie de votre parquet.",
          },
          {
            type: "table",
            head: ["Terme", "Définition"],
            rows: [
              ["Parquet massif", "Une seule pièce de bois noble sur toute l'épaisseur. Rénovable plusieurs fois."],
              ["Parquet contrecollé", "Couche d'usure en bois noble collée sur un support stable (HDF ou contreplaqué)."],
              ["Couche d'usure", "Épaisseur de bois noble (2 à 6 mm) qui détermine la durée de vie et le nombre de ponçages possibles."],
              ["Lame", "Planche unitaire constituant la surface visible du sol."],
              ["Rainure & languette", "Système d'assemblage mâle/femelle pour un emboîtement parfait."],
              ["Joint de dilatation", "Espace de 8 à 10 mm laissé en périphérie pour la respiration du bois."],
              ["Sous-couche", "Couche intermédiaire qui isole acoustiquement et compense les défauts du support."],
              ["Hygrométrie", "Taux d'humidité du support et du bois. Critère n°1 de stabilité."],
              ["Finition", "Vernis, huile ou cire qui protège la surface et sublime le veinage."],
              ["Point de Hongrie", "Pose en chevrons coupés à 45°, motif en « V » très élégant."],
              ["Bâton rompu", "Pose en chevrons coupés à 90°, motif décalé."],
              ["Plinthe", "Baguette de finition le long des murs masquant le joint de dilatation."],
              ["Nez de marche", "Profil de finition sur le bord d'une marche d'escalier."],
              ["Brossage", "Technique mécanique qui révèle le veinage et donne du relief au bois."],
              ["DTU 51.2 / 51.11", "Normes françaises encadrant la pose collée et la pose flottante."],
            ],
          },
          {
            type: "callout",
            title: "Le saviez-vous ?",
            text: "Le parquet est un matériau vivant. Les nuances et les veinages varient d'une lame à l'autre : c'est précisément ce qui fait son charme et son authenticité.",
          },
        ],
      },
      {
        id: "10-choses",
        title: "10 choses à savoir avant de choisir",
        blocks: [
          {
            type: "list",
            items: [
              "Naturel et renouvelable : le parquet est issu d'une ressource responsable.",
              "Il améliore la qualité de l'air intérieur — pas d'émissions nocives.",
              "Bien entretenu, il dure plusieurs dizaines d'années, voire se transmet.",
              "Avec une bonne sous-couche, il est plus silencieux qu'on ne le pense.",
              "Compatible plancher chauffant — sous conditions précises (voir chap. 3).",
              "Le contrecollé est aujourd'hui plus stable que le massif pour 90 % des projets.",
              "Le ponçage permet de rénover un parquet 2 à 5 fois selon la couche d'usure.",
              "L'huile pénètre le bois et se répare ; le vernis le filme et se rénove.",
              "Le coût total = matériau + pose + finition + entretien sur 20 ans.",
              "Un parquet bien posé est un parquet pour la vie.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "choisir",
    number: "02",
    title: "Bien choisir son parquet",
    kicker: "Pièce par pièce",
    intro:
      "Chaque pièce a ses usages, son humidité, sa lumière. Le bon parquet n'est pas le plus cher : c'est celui qui est adapté à son environnement et à votre mode de vie.",
    cover: choisirImg,
    sections: [
      {
        id: "massif-vs-contrecolle",
        title: "Massif ou contrecollé : la vraie comparaison",
        blocks: [
          {
            type: "p",
            text: "Le débat dure depuis 30 ans. La réponse moderne est nuancée : pour la grande majorité des projets, le contrecollé haut de gamme offre le meilleur compromis entre beauté, stabilité et budget.",
          },
          {
            type: "table",
            head: ["Critère", "Massif", "Contrecollé"],
            rows: [
              ["Apparence", "100 % bois noble", "Couche d'usure noble identique"],
              ["Stabilité", "Sensible à l'humidité", "Très stable (multicouches)"],
              ["Plancher chauffant", "Déconseillé", "Recommandé"],
              ["Rénovations possibles", "5 à 8 ponçages", "1 à 3 ponçages selon couche"],
              ["Pose", "Collée le plus souvent", "Collée ou flottante"],
              ["Budget pose comprise", "À partir de 90 €/m²", "À partir de 60 €/m²"],
              ["Durée de vie", "80 à 100 ans", "40 à 60 ans"],
            ],
          },
          {
            type: "callout",
            title: "Le conseil Parqueto",
            text: "En cas de doute, privilégiez un contrecollé de qualité avec couche d'usure de 3 à 4 mm minimum. Vous gagnez en stabilité sans rien perdre en esthétique.",
          },
        ],
      },
      {
        id: "essences",
        title: "Choisir son essence de bois",
        blocks: [
          {
            type: "table",
            head: ["Essence", "Caractère", "Idéal pour"],
            rows: [
              ["Chêne français", "Noble, polyvalent, durable (dureté 3,7)", "Toutes pièces sèches"],
              ["Chêne fumé", "Teinte chaude et profonde", "Salons, suites parentales"],
              ["Frêne", "Veinage marqué, très clair", "Intérieurs lumineux"],
              ["Noyer", "Brun chaud, raffiné", "Pièces de prestige"],
              ["Hêtre", "Lisse, clair, contemporain", "Chambres, bureaux"],
              ["Bambou densifié", "Très dur, éco-responsable", "Pièces à fort passage"],
            ],
          },
        ],
      },
      {
        id: "par-piece",
        title: "Le bon parquet pour chaque pièce",
        blocks: [
          { type: "image", src: pieceImg, caption: "Adapter l'essence et la finition à l'usage de la pièce" },
          {
            type: "h3",
            text: "Salon & salle à manger",
          },
          {
            type: "p",
            text: "Pièce de vie, fort passage, lumière variable. Chêne contrecollé 14 mm, finition huile cire naturelle pour la patine, ou vernis mat pour la facilité d'entretien.",
          },
          {
            type: "h3",
            text: "Chambres",
          },
          {
            type: "p",
            text: "Confort acoustique prioritaire. Contrecollé 10 à 14 mm posé flottant sur sous-couche acoustique 19 dB minimum. Teintes douces, finition huilée.",
          },
          {
            type: "h3",
            text: "Cuisine",
          },
          {
            type: "p",
            text: "Possible sous conditions : pose collée obligatoire, finition vernis polyuréthane, joint silicone le long des éléments fixes. Évitez le massif.",
          },
          {
            type: "h3",
            text: "Salle de bains",
          },
          {
            type: "p",
            text: "Réservé aux parquets spécifiquement conçus (teck, bambou marin, certains chênes traités). Pose collée à la colle PU, joints étanches, ventilation indispensable.",
          },
          {
            type: "h3",
            text: "Entrée & couloir",
          },
          {
            type: "p",
            text: "Zone d'usure intense. Privilégiez les essences dures (chêne, bambou) en finition vernis, et un tapis de propreté à l'entrée.",
          },
          {
            type: "callout",
            title: "Règle d'or",
            text: "Plus l'humidité est variable, plus le parquet doit être stable. Plus le passage est intense, plus la finition doit être résistante.",
          },
        ],
      },
    ],
  },
  {
    id: "poser",
    number: "03",
    title: "Préparer & poser",
    kicker: "Du support à la dernière lame",
    intro:
      "80 % des défauts d'un parquet viennent du support, pas du parquet lui-même. Ce chapitre détaille la préparation, les techniques de pose et les pièges à éviter — y compris sur plancher chauffant.",
    cover: poserImg,
    sections: [
      {
        id: "preparation",
        title: "Préparer le support : l'étape qu'on ne saute jamais",
        blocks: [
          {
            type: "lead",
            text: "Un support sain, plan et sec est non-négociable.",
          },
          {
            type: "h3",
            text: "Les trois critères du support",
          },
          {
            type: "list",
            items: [
              "Propre : aspiré, dépoussiéré, exempt de toute trace de colle, peinture, plâtre.",
              "Plan : tolérance de 5 mm sous une règle de 2 m (norme DTU 51.2).",
              "Sec : hygrométrie ≤ 3 % CM pour une chape ciment, ≤ 0,5 % CM pour une chape anhydrite.",
            ],
          },
          {
            type: "tip",
            text: "Toujours mesurer l'hygrométrie au bombe à carbure (méthode CM), pas avec un appareil à pointes électrique. C'est la seule mesure reconnue par les assurances.",
          },
        ],
      },
      {
        id: "techniques",
        title: "Les trois techniques de pose",
        blocks: [
          {
            type: "table",
            head: ["Technique", "Avantage clé", "Limites"],
            rows: [
              ["Pose collée", "Stabilité maximale, silencieux, compatible chauffage au sol", "Demande un support irréprochable, irréversible"],
              ["Pose flottante", "Rapide, propre, démontable", "Légère résonance, sensible à l'humidité"],
              ["Pose clouée", "Tradition, sur lambourdes", "Réservée aux planchers bois anciens"],
            ],
          },
          {
            type: "h3",
            text: "Les motifs de pose",
          },
          {
            type: "list",
            items: [
              "À l'anglaise : lames parallèles, joints décalés. Le grand classique.",
              "Point de Hongrie : chevrons à 45°, élégance haussmannienne.",
              "Bâton rompu : chevrons à 90°, motif graphique et structurant.",
              "Damier (Versailles) : panneaux assemblés, pièces d'exception.",
            ],
          },
          {
            type: "callout",
            title: "Sens de pose",
            text: "Pour agrandir visuellement une pièce, posez les lames dans le sens de la lumière principale et de la plus grande longueur.",
          },
        ],
      },
      {
        id: "chauffage",
        title: "Parquet sur plancher chauffant",
        blocks: [
          {
            type: "p",
            text: "Compatible, mais exigeant. Quatre règles à respecter sans exception :",
          },
          {
            type: "list",
            items: [
              "Parquet contrecollé exclusivement, essence stable (chêne, noyer).",
              "Épaisseur 10 à 14 mm maximum, lames de largeur ≤ 18 cm.",
              "Pose collée obligatoire avec colle conductrice spécifique.",
              "Mise en chauffe progressive : palier de +5 °C par jour, jamais au-dessus de 27 °C en surface.",
            ],
          },
          {
            type: "tip",
            text: "Allumer le chauffage 3 semaines avant la pose, puis l'arrêter 48 h avant. Remise en chauffe progressive 7 jours après la pose, après séchage complet de la colle.",
          },
        ],
      },
    ],
  },
  {
    id: "finir",
    number: "04",
    title: "Finir le parquet",
    kicker: "Vernis · Huile · Cire",
    intro:
      "La finition est l'étape qui révèle le bois et le protège pour les vingt prochaines années. Le choix se joue entre trois familles : vernis, huile, cire. Aucune n'est meilleure : chacune répond à un usage.",
    cover: finirImg,
    sections: [
      {
        id: "comparatif-finitions",
        title: "Comparatif des finitions",
        blocks: [
          {
            type: "table",
            head: ["Finition", "Rendu", "Entretien", "Réparation"],
            rows: [
              ["Vernis", "Filmogène, brillant à mat", "Eau légèrement savonneuse", "Ponçage + revernissage zone entière"],
              ["Huile", "Naturel, mat, tactile", "Savon spécial huile", "Réparation locale possible"],
              ["Cire", "Patine ancienne, mat satiné", "Brossage doux + recirage annuel", "Réparation locale facile"],
            ],
          },
        ],
      },
      {
        id: "choisir-finition",
        title: "Quelle finition pour quel projet",
        blocks: [
          {
            type: "list",
            items: [
              "Famille avec enfants, animaux : vernis polyuréthane mat — robustesse maximale.",
              "Recherche d'authenticité : huile naturelle — toucher chaleureux, patine au fil du temps.",
              "Rénovation de parquet ancien : cire — respect du caractère d'origine.",
              "Cuisine ouverte : vernis avec joint silicone autour des meubles fixes.",
            ],
          },
          {
            type: "callout",
            title: "Le conseil Parqueto",
            text: "Demandez toujours un échantillon de finition appliqué sur votre essence. Le rendu varie énormément d'un bois à l'autre — voir la finition sur papier ne suffit pas.",
          },
        ],
      },
    ],
  },
  {
    id: "entretenir",
    number: "05",
    title: "Entretenir",
    kicker: "Quotidien, hebdomadaire, annuel",
    intro:
      "Un parquet entretenu reste beau pendant des décennies. Trois habitudes simples suffisent : protéger, nettoyer doux, nourrir au bon moment.",
    cover: entretenirImg,
    sections: [
      {
        id: "rituels",
        title: "Les bons gestes au quotidien",
        blocks: [
          {
            type: "h3",
            text: "Chaque semaine",
          },
          {
            type: "list",
            items: [
              "Aspirateur avec brosse spéciale parquet (jamais de brosse dure).",
              "Serpillère bien essorée + produit pH neutre adapté à la finition.",
              "Essuyer immédiatement toute projection d'eau.",
            ],
          },
          {
            type: "h3",
            text: "Chaque saison",
          },
          {
            type: "list",
            items: [
              "Contrôler l'hygrométrie ambiante (45 à 60 %).",
              "Vérifier les patins sous les meubles, les remplacer si usés.",
              "Aérer 10 minutes par jour, même en hiver.",
            ],
          },
          {
            type: "h3",
            text: "Une fois par an",
          },
          {
            type: "list",
            items: [
              "Huile : appliquer une couche d'entretien sur les zones de passage.",
              "Vernis : raviveur en spray pour redonner de l'éclat.",
              "Cire : encaustique en couche fine, lustrage doux.",
            ],
          },
          {
            type: "callout",
            title: "À éviter absolument",
            text: "Vapeur, javel, vinaigre blanc pur, produits abrasifs, eau stagnante. Tous endommagent durablement la finition.",
          },
        ],
      },
    ],
  },
  {
    id: "renover",
    number: "06",
    title: "Rénover",
    kicker: "Ponçage, réparation, transformation",
    intro:
      "Un parquet ancien peut presque toujours être sauvé. Ce chapitre explique quand poncer, quand remplacer une lame, et comment transformer un sol fatigué en parquet d'exception.",
    cover: renoverImg,
    sections: [
      {
        id: "ponçage",
        title: "Le ponçage en 4 étapes",
        blocks: [
          {
            type: "list",
            items: [
              "Diagnostic : épaisseur résiduelle de la couche d'usure (minimum 2 mm pour poncer).",
              "Grain 40 : élimine les anciennes finitions et égalise la surface.",
              "Grain 80 puis 120 : affine progressivement le rendu.",
              "Application de la finition neuve dans les 24 h.",
            ],
          },
          {
            type: "tip",
            text: "Un parquet massif accepte 5 à 8 ponçages. Un contrecollé 3 mm en accepte 2, un 4 mm en accepte 3. Au-delà, il faut remplacer.",
          },
        ],
      },
      {
        id: "reparation",
        title: "Remplacer une lame abîmée",
        blocks: [
          {
            type: "p",
            text: "Une lame fendue, brûlée ou décollée se remplace sans toucher au reste du sol. Trois étapes :",
          },
          {
            type: "list",
            items: [
              "Découpe à la scie plongeante en suivant les rives.",
              "Retrait de la lame, nettoyage du support.",
              "Insertion d'une lame neuve, collage, mise en charge 24 h.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "problemes",
    number: "07",
    title: "Solutions aux problèmes",
    kicker: "Diagnostic & remèdes",
    intro:
      "Tâches, grincements, lames qui se soulèvent, parquet qui se rétracte : chaque symptôme a une cause, et chaque cause a une solution.",
    cover: problemesImg,
    sections: [
      {
        id: "diagnostics",
        title: "Diagnostic rapide",
        blocks: [
          {
            type: "table",
            head: ["Symptôme", "Cause probable", "Solution"],
            rows: [
              ["Lames qui gonflent", "Hygrométrie trop élevée", "Ventiler, déshumidifier, contrôler les fuites"],
              ["Joints qui s'élargissent", "Air trop sec en hiver", "Humidifier à 45-55 % HR"],
              ["Grincements", "Sous-couche affaissée ou pose flottante mal calée", "Identifier la zone, injecter de la colle ou reprendre la pose"],
              ["Tâche d'eau blanche", "Humidité piégée sous le vernis", "Tampon imbibé d'huile + lustrage"],
              ["Rayure profonde", "Choc ou meuble traîné", "Rebouchage à la cire dure teintée"],
              ["Lame qui claque", "Joint de dilatation insuffisant", "Reprendre la plinthe et recouper la périphérie"],
            ],
          },
          {
            type: "callout",
            title: "Quand appeler un artisan",
            text: "Si plus de 10 % de la surface est touchée, ou si le défaut concerne le support (chape, plancher), faites intervenir un professionnel certifié.",
          },
        ],
      },
    ],
  },
  {
    id: "conclusion",
    number: "08",
    title: "L'essentiel à retenir",
    kicker: "Synthèse",
    intro:
      "Quatre principes suffisent pour réussir et transmettre un beau parquet.",
    cover: introImg,
    sections: [
      {
        id: "principes",
        title: "Les quatre principes Parqueto",
        blocks: [
          {
            type: "list",
            items: [
              "Choisir un parquet adapté à la pièce, pas à la mode.",
              "Préparer le support : 80 % de la réussite se joue avant la première lame.",
              "Respecter les règles de pose et d'étanchéité.",
              "Entretenir régulièrement, avec les bons produits.",
            ],
          },
          {
            type: "callout",
            title: "Le mot de la fin",
            text: "Bien choisir aujourd'hui, c'est profiter pendant des décennies. Un parquet bien posé est un parquet pour la vie.",
          },
          {
            type: "p",
            text: "Une question ? Un projet ? Notre équipe est à votre écoute au 01 84 60 60 61 ou par e-mail à contact@parqueto.fr. Retrouvez tous nos conseils et nos réalisations sur parqueto.fr.",
          },
        ],
      },
    ],
  },
];

export function getReadingTime(): number {
  const wordsPerMinute = 220;
  let words = 0;
  for (const ch of CHAPTERS) {
    words += ch.intro.split(/\s+/).length;
    for (const s of ch.sections) {
      for (const b of s.blocks) {
        if ("text" in b) words += (b.text || "").split(/\s+/).length;
        if (b.type === "list") words += b.items.join(" ").split(/\s+/).length;
        if (b.type === "table") words += b.rows.flat().join(" ").split(/\s+/).length;
      }
    }
  }
  return Math.max(1, Math.round(words / wordsPerMinute));
}
