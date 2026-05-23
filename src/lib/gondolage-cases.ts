// Pages satellites du pilier /parquet-qui-gondole
// Chaque cas cible une longue-traîne précise

export type GondolageCase = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  symptomes: string[];
  causes: { title: string; text: string }[];
  solutions: { title: string; text: string; prix: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
};

export const GONDOLAGE_CASES: GondolageCase[] = [
  {
    slug: "degat-des-eaux",
    h1: "Parquet qui gondole après dégât des eaux",
    metaTitle: "Parquet gondolé après dégât des eaux : que faire, qui paye ?",
    metaDesc:
      "Parquet gondolé après fuite, inondation ou dégât des eaux : réagir en 24 h, devis assurance conforme MRH, indemnisation et réparation par un artisan vérifié.",
    intro:
      "Un dégât des eaux est la cause n°1 d'un parquet qui gondole. Bonne nouvelle : si vous réagissez vite et que votre MRH couvre le sinistre, la réparation est prise en charge — à condition de monter un dossier propre. Voici le bon protocole.",
    symptomes: [
      "Lames soulevées au niveau d'un mur ou d'une canalisation",
      "Joints qui s'écartent ou parquet qui « sonne creux »",
      "Tâches sombres, odeur de moisi sous le parquet",
      "Plinthes décollées ou peinture qui cloque",
    ],
    causes: [
      {
        title: "Fuite progressive non détectée",
        text: "Une fuite lente (joint robinet, machine à laver) imbibe le parquet par-dessous. C'est insidieux : le dégât apparaît plusieurs jours après l'origine.",
      },
      {
        title: "Inondation ponctuelle (baignoire, voisin)",
        text: "Volume d'eau important en quelques heures. Si l'eau reste plus de 24 h, la déformation devient irréversible.",
      },
      {
        title: "Remontée capillaire / infiltration",
        text: "Mur enterré, défaut d'étanchéité : l'humidité monte en permanence dans le support. Solution : traiter l'origine avant de reposer.",
      },
    ],
    solutions: [
      {
        title: "Intervention d'urgence",
        text: "Aspirer l'eau, déshumidificateur 48–72 h, mesure d'hygrométrie. Photos systématiques pour l'assurance.",
        prix: "180 – 350 €",
      },
      {
        title: "Devis assurance + expertise",
        text: "Nous établissons un devis conforme MRH (descriptif, photos, prix unitaire, garantie décennale).",
        prix: "Devis gratuit",
      },
      {
        title: "Réparation / dépose-repose",
        text: "Selon l'ampleur : remplacement local de lames, ponçage de la pièce, ou dépose complète et nouvelle pose.",
        prix: "Pris en charge MRH",
      },
    ],
    faq: [
      {
        q: "Qui paye un parquet gondolé par un dégât des eaux ?",
        a: "Votre assurance habitation (MRH) sur le poste « dégât des eaux ». Si l'origine est chez un voisin, la convention IRSI s'applique : vous ne payez que votre franchise, votre assureur se retourne contre celui du responsable.",
      },
      {
        q: "Combien de temps ai-je pour déclarer ?",
        a: "5 jours ouvrés à compter de la découverte. Au-delà, l'assureur peut refuser la prise en charge. Faites le constat amiable dégât des eaux avec le voisin si applicable.",
      },
      {
        q: "L'expert assurance va-t-il accepter mon devis ?",
        a: "Oui s'il est détaillé : descriptif des travaux, surface, prix unitaire au m², photos avant, garantie décennale, mention des règles DTU. Nos devis Parqueto sont acceptés par toutes les MRH.",
      },
    ],
    keywords: [
      "parquet gondolé dégât des eaux",
      "parquet inondation assurance",
      "parquet gondolé qui paye",
      "devis assurance parquet sinistre",
      "indemnisation parquet gondolé",
    ],
  },
  {
    slug: "chauffage-au-sol",
    h1: "Parquet qui gondole sur chauffage au sol",
    metaTitle: "Parquet qui gondole sur chauffage au sol : causes et solutions",
    metaDesc:
      "Parquet déformé sur plancher chauffant : causes (mise en chauffe brutale, parquet non PCBT), protocole de remise en état et devis artisan.",
    intro:
      "Un parquet posé sur chauffage au sol exige un parquet certifié PCBT, une colle élastique et un protocole de mise en chauffe strict. Quand l'un de ces 3 paramètres n'est pas respecté, le bois bouge — et gondole.",
    symptomes: [
      "Bosses régulières au-dessus des serpentins",
      "Joints qui s'écartent surtout en hiver",
      "Lames qui « claquent » quand on marche",
      "Apparition après remise en chauffe d'automne",
    ],
    causes: [
      {
        title: "Mise en chauffe trop brutale",
        text: "Passage de l'arrêt à 28 °C en quelques heures = choc thermique. Protocole : +5 °C / jour après une coupure prolongée.",
      },
      {
        title: "Parquet non compatible PCBT",
        text: "Massif épais, certaines essences instables (hêtre, érable) ne supportent pas le chauffage au sol. Seul un contrecollé certifié garantit la stabilité.",
      },
      {
        title: "Résistance thermique trop élevée",
        text: "Parquet + sous-couche > 0,15 m².K/W : la chaleur ne passe plus, le bois surchauffe en surface. Limite à respecter scrupuleusement.",
      },
    ],
    solutions: [
      {
        title: "Diagnostic + protocole de chauffe",
        text: "Test du parquet, mesure d'humidité de la chape, plan de remise en chauffe progressive sur 15 jours.",
        prix: "150 – 250 €",
      },
      {
        title: "Reprise locale",
        text: "Si quelques lames seulement, remplacement à l'identique en contrecollé certifié PCBT, pose collée SMP.",
        prix: "350 – 900 €",
      },
      {
        title: "Dépose et repose complète",
        text: "Si parquet inadapté à l'origine, dépose et pose neuve en contrecollé PCBT + colle élastique. Garantie décennale.",
        prix: "75 – 130 €/m²",
      },
    ],
    faq: [
      {
        q: "Quel parquet ne gondole pas sur chauffage au sol ?",
        a: "Un contrecollé certifié PCBT, épaisseur 10–14 mm, en chêne ou noyer, posé collé pleine surface à la colle SMP. Le massif est déconseillé sauf cas particulier.",
      },
      {
        q: "À quelle température régler le chauffage au sol pour ne pas abîmer le parquet ?",
        a: "Température de surface ≤ 28 °C en permanence. Au démarrage, palier de +5 °C par jour. Jamais d'arrêt-redémarrage brutal.",
      },
    ],
    keywords: [
      "parquet qui gondole chauffage au sol",
      "parquet plancher chauffant déformation",
      "parquet PCBT chauffage",
      "parquet contrecollé chauffage sol gondolé",
    ],
  },
  {
    slug: "humidite",
    h1: "Parquet qui gondole à cause de l'humidité",
    metaTitle: "Parquet qui gondole humidité : causes et traitement durable",
    metaDesc:
      "Parquet qui gondole à cause de l'humidité ambiante, des remontées capillaires ou d'un sous-plancher froid : diagnostic, hygrométrie et devis.",
    intro:
      "Pas besoin d'inondation pour qu'un parquet gondole : une humidité ambiante trop forte (> 70 %) ou un sous-plancher humide suffit. Le bois respire — il faut juste l'aider à respirer dans les bonnes limites.",
    symptomes: [
      "Gondolage progressif sans événement déclencheur",
      "Joints qui s'écartent en hiver (chauffage sec) puis se referment en été",
      "Bois plus foncé localement",
      "Sensation de souplesse anormale sous le pied",
    ],
    causes: [
      {
        title: "Hygrométrie ambiante hors plage",
        text: "Idéal : 45–65 %. Au-dessus de 70 %, le bois gonfle. En dessous de 35 %, il se rétracte. Un simple hygromètre à 20 € permet de surveiller.",
      },
      {
        title: "Remontée capillaire par le support",
        text: "Chape humide, dalle sur terre-plein mal isolée, vide sanitaire non ventilé : l'humidité passe au travers et imprègne le parquet par-dessous.",
      },
      {
        title: "Sous-plancher froid (point de rosée)",
        text: "Sous-sol non chauffé sous votre parquet : condensation entre support et lames. Fréquent dans les vieux appartements rénovés.",
      },
    ],
    solutions: [
      {
        title: "Diagnostic hygrométrie",
        text: "Mesure de l'humidité du support et de l'ambiance sur 7 jours. Identification précise de la source.",
        prix: "120 – 200 €",
      },
      {
        title: "Traitement de la cause",
        text: "Déshumidificateur, ventilation, isolation du sous-plancher selon le diagnostic. Avant toute reprise du parquet.",
        prix: "Variable",
      },
      {
        title: "Reprise du parquet",
        text: "Une fois la cause traitée et le support sec (< 3 %), ponçage ou remplacement local.",
        prix: "25 – 90 €/m²",
      },
    ],
    faq: [
      {
        q: "Quelle hygrométrie pour ne pas abîmer le parquet ?",
        a: "Entre 45 % et 65 % d'humidité relative. Un hygromètre digital à 20 € permet de surveiller. Humidificateur en hiver chauffé, déshumidificateur en été humide.",
      },
      {
        q: "Peut-on poser un parquet sur une dalle humide ?",
        a: "Non. Humidité < 3 % obligatoire pour pose collée, < 2,5 % avec chauffage au sol. Un test au CM (carbure) est indispensable avant pose.",
      },
    ],
    keywords: [
      "parquet qui gondole humidité",
      "parquet hygrométrie",
      "parquet remontée capillaire",
      "parquet sous-plancher froid",
    ],
  },
  {
    slug: "flottant",
    h1: "Parquet flottant qui gondole : peut-on le réparer ?",
    metaTitle: "Parquet flottant qui gondole : réparation ou remplacement ?",
    metaDesc:
      "Parquet flottant déformé : pourquoi le système clipsable casse à l'humidité, quand on peut réparer localement, quand il faut tout remplacer.",
    intro:
      "Un parquet flottant (contrecollé clipsable) qui gondole pose un problème spécifique : le système clic se déforme avec l'humidité et casse au démontage. Dans 7 cas sur 10, la dépose complète est inévitable.",
    symptomes: [
      "Bosse au milieu d'une lame ou sur un joint",
      "Clic qui ne tient plus, lames qui se désolidarisent",
      "Sensation de « tremplin » sous le pied",
      "Joints visibles en surface",
    ],
    causes: [
      {
        title: "Sous-couche absente ou inadaptée",
        text: "Pas de pare-vapeur sur dalle béton, sous-couche acoustique manquante : l'humidité du sol remonte directement dans le parquet.",
      },
      {
        title: "Jeu de dilatation insuffisant",
        text: "Joint périphérique < 8 mm : le parquet ne peut pas se dilater, il se soulève au centre de la pièce.",
      },
      {
        title: "Eau localisée (verre renversé, fuite)",
        text: "L'eau s'infiltre par les joints, fait gonfler la couche centrale en HDF, et fait casser le clic.",
      },
    ],
    solutions: [
      {
        title: "Remplacement local (si possible)",
        text: "Démontage depuis un mur jusqu'à la zone, remplacement à l'identique. Souvent démonte la moitié de la pièce.",
        prix: "400 – 1 200 €",
      },
      {
        title: "Dépose complète + nouvelle pose",
        text: "Dépose, contrôle du support, mise en place d'un pare-vapeur + sous-couche conforme, repose en flottant ou bascule en collé.",
        prix: "35 – 60 €/m²",
      },
    ],
    faq: [
      {
        q: "Peut-on réparer un parquet flottant gondolé sans tout déposer ?",
        a: "Rarement. Le système clic, une fois gondolé, casse au démontage. La seule solution propre est de remplacer depuis le mur le plus proche jusqu'à la zone abîmée — ce qui implique souvent de démonter une grande partie de la pièce.",
      },
      {
        q: "Le parquet flottant gondole-t-il plus que le massif ?",
        a: "Oui, beaucoup plus. Sa couche centrale en HDF (panneau de fibres) gonfle de manière irréversible au contact de l'eau. Le massif, lui, sèche et reprend souvent sa forme.",
      },
    ],
    keywords: [
      "parquet flottant qui gondole",
      "parquet clipsable gondolé",
      "réparation parquet flottant déformé",
      "parquet flottant inondation",
    ],
  },
  {
    slug: "apres-pose",
    h1: "Parquet qui gondole juste après la pose : malfaçon ?",
    metaTitle: "Parquet qui gondole après pose : malfaçon ou garantie ?",
    metaDesc:
      "Parquet qui gondole quelques jours ou semaines après la pose : 3 causes fréquentes, recours garantie de parfait achèvement et décennale.",
    intro:
      "Un parquet qui gondole moins d'un an après la pose relève presque toujours d'une malfaçon : support trop humide, jeu de dilatation insuffisant, parquet non acclimaté. Vous avez des recours.",
    symptomes: [
      "Gondolage dans les semaines suivant la pose",
      "Bosses régulières en milieu de pièce",
      "Joints qui s'ouvrent en hiver",
      "L'artisan ne reconnaît pas sa responsabilité",
    ],
    causes: [
      {
        title: "Support trop humide à la pose",
        text: "Chape > 3 % d'humidité, dalle pas sèche. L'artisan doit mesurer au CM (carbure) avant pose et l'inscrire sur le PV de réception.",
      },
      {
        title: "Pas de jeu de dilatation",
        text: "Joint périphérique < 8 mm contre les murs : le parquet ne peut pas se dilater, il se soulève. Faute professionnelle caractérisée.",
      },
      {
        title: "Parquet non acclimaté",
        text: "Lames livrées et posées le jour même, sans 48 h minimum d'acclimatation dans la pièce. Le bois bouge ensuite chez vous.",
      },
    ],
    solutions: [
      {
        title: "Mise en cause amiable",
        text: "Courrier RAR à l'artisan rappelant la garantie de parfait achèvement (1 an). Demande d'expertise contradictoire.",
        prix: "Gratuit",
      },
      {
        title: "Contre-expertise indépendante",
        text: "Nous fournissons un rapport technique chiffré (mesures, photos, normes DTU 51.2 / 51.11) opposable au constructeur.",
        prix: "350 – 600 €",
      },
      {
        title: "Reprise complète à charge de l'artisan",
        text: "Si la malfaçon est avérée, l'artisan reprend à sa charge (garantie de parfait achèvement 1 an, biennale 2 ans, décennale 10 ans).",
        prix: "Sans frais",
      },
    ],
    faq: [
      {
        q: "Quelles garanties protègent contre une malfaçon parquet ?",
        a: "Garantie de parfait achèvement (1 an, tous désordres), biennale (2 ans, éléments dissociables), décennale (10 ans, impropre à destination). Le gondolage relève en général de la décennale.",
      },
      {
        q: "Que faire si l'artisan refuse d'intervenir ?",
        a: "Courrier RAR de mise en demeure, déclaration à votre protection juridique (ou celle de l'artisan via sa décennale), expertise judiciaire en dernier recours. Nous accompagnons souvent ces dossiers.",
      },
    ],
    keywords: [
      "parquet gondolé après pose",
      "malfaçon parquet",
      "parquet qui gondole garantie",
      "décennale parquet gondolé",
    ],
  },
  {
    slug: "apres-poncage",
    h1: "Parquet qui gondole après ponçage / vitrification",
    metaTitle: "Parquet qui gondole après ponçage : causes et reprise",
    metaDesc:
      "Parquet déformé après ponçage et vitrification : excès d'humidité du vernis, vitrification trop épaisse, support insuffisamment poncé. Solutions et devis.",
    intro:
      "Cas rare mais bien réel : un parquet peut gondoler dans les semaines suivant un ponçage-vitrification. La cause est presque toujours technique — vernis trop chargé en eau, vitrification appliquée trop tôt, ou support qui n'a pas été préparé.",
    symptomes: [
      "Lames qui se déforment après séchage de la vitrification",
      "Joints qui s'écartent au-dessus de zones anciennement humides",
      "Bois qui « cloche » à certains endroits",
      "Aspect tuilé (bords plus hauts que le centre)",
    ],
    causes: [
      {
        title: "Vernis aqueux mal dosé",
        text: "Un vernis polyuréthane à l'eau apporte de l'humidité. Si l'artisan superpose 3 couches en 24 h sans laisser sécher, le bois absorbe trop d'eau.",
      },
      {
        title: "Support pas assez préparé",
        text: "Ponçage trop léger, fissures non traitées, anciennes traces de cire : la vitrification accroche mal, le bois travaille sous la pellicule.",
      },
      {
        title: "Hygrométrie du chantier",
        text: "Pièce trop humide pendant la pose (> 65 %), pas de ventilation : le vernis sèche mal, le bois gonfle.",
      },
    ],
    solutions: [
      {
        title: "Diagnostic du chantier",
        text: "Inspection visuelle + mesure d'humidité, identification de la cause exacte (vernis, support, ambiance).",
        prix: "120 – 200 €",
      },
      {
        title: "Reprise partielle",
        text: "Ponçage de rattrapage + nouvelle vitrification sur les zones touchées, dans les règles de l'art.",
        prix: "35 – 55 €/m²",
      },
      {
        title: "Mise en cause garantie",
        text: "Si la prestation est récente, la garantie de parfait achèvement (1 an) couvre la reprise par l'artisan d'origine.",
        prix: "Sans frais (si malfaçon)",
      },
    ],
    faq: [
      {
        q: "Combien de temps faut-il attendre entre deux couches de vitrification ?",
        a: "Minimum 4 h pour un vernis à l'eau, 8 h pour un polyuréthane bicomposant. Toujours égrener entre les couches. Hygrométrie de la pièce idéalement 45–60 %.",
      },
      {
        q: "Peut-on remettre une couche de vernis sur un parquet qui gondole ?",
        a: "Non, ça aggraverait le problème. Il faut d'abord poncer pour retirer la vitrification, laisser sécher le bois, puis reprendre la finition une fois la stabilité retrouvée.",
      },
    ],
    keywords: [
      "parquet qui gondole après ponçage",
      "parquet déformé après vitrification",
      "ponçage parquet malfaçon",
      "vitrification parquet gondolage",
    ],
  },
];

export function getGondolageCase(slug: string): GondolageCase | undefined {
  return GONDOLAGE_CASES.find((c) => c.slug === slug);
}
