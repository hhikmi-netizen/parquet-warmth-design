// Pages locales SEO — données ville par ville pour /parqueteur/$ville
export type ParquetoCity = {
  slug: string;
  name: string;
  region: string;
  /** Population approximative pour calibrer le contenu */
  population: string;
  /** Quartiers / arrondissements emblématiques pour le contenu local */
  quartiers: string[];
  /** Particularité parquet locale (haussmannien, pierre, etc.) */
  contexte: string;
  /** Tarif moyen indicatif local (pose + ponçage) */
  tarifIndicatif: string;
  /** Code postal principal (le 1er arrondissement / centre-ville) */
  codePostalPrincipal: string;
  /** Coordonnées géographiques pour le schema LocalBusiness */
  geo: { lat: number; lng: number };
};

export const CITIES: ParquetoCity[] = [
  {
    slug: "paris",
    name: "Paris",
    region: "Île-de-France",
    population: "2,1 millions d'habitants",
    quartiers: [
      "Marais (3ᵉ, 4ᵉ)",
      "Saint-Germain (6ᵉ)",
      "Batignolles (17ᵉ)",
      "Montmartre (18ᵉ)",
      "Bastille (11ᵉ, 12ᵉ)",
      "Trocadéro (16ᵉ)",
    ],
    contexte:
      "Paris est le territoire historique du parquet français : 70 % des appartements haussmanniens conservent un parquet d'origine, souvent en point de Hongrie ou Versailles. La rénovation y exige des artisans habitués aux contraintes d'immeuble ancien (poutres, accès, copropriété).",
    tarifIndicatif: "55 à 95 €/m²",
    codePostalPrincipal: "75001",
    geo: { lat: 48.8566, lng: 2.3522 },
  },
  {
    slug: "lyon",
    name: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    population: "522 000 habitants",
    quartiers: [
      "Vieux Lyon (5ᵉ)",
      "Presqu'île (1ᵉʳ, 2ᵉ)",
      "Croix-Rousse (4ᵉ)",
      "Confluence (2ᵉ)",
      "Brotteaux (6ᵉ)",
      "Monplaisir (8ᵉ)",
    ],
    contexte:
      "Lyon mêle traboules historiques de la Croix-Rousse, immeubles haussmanniens des Brotteaux et logements neufs de la Confluence. Le marché du parquet y est très dynamique : rénovations canuts à l'ancienne et pose contemporaine en pose collée chevron.",
    tarifIndicatif: "48 à 85 €/m²",
    codePostalPrincipal: "69001",
    geo: { lat: 45.764, lng: 4.8357 },
  },
  {
    slug: "marseille",
    name: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    population: "870 000 habitants",
    quartiers: [
      "Le Panier (2ᵉ)",
      "Vieux-Port (1ᵉʳ, 7ᵉ)",
      "Endoume (7ᵉ)",
      "Saint-Giniez (8ᵉ)",
      "Périer (8ᵉ)",
      "La Plaine (5ᵉ, 6ᵉ)",
    ],
    contexte:
      "À Marseille, le climat méditerranéen impose un parquet stable : contrecollé chêne pour les appartements proches du port, massif local pour les villas du 8ᵉ. L'humidité saline du Vieux-Port nécessite des essences traitées et une ventilation maîtrisée.",
    tarifIndicatif: "45 à 80 €/m²",
    codePostalPrincipal: "13001",
    geo: { lat: 43.2965, lng: 5.3698 },
  },
  {
    slug: "bordeaux",
    name: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    population: "260 000 habitants",
    quartiers: [
      "Chartrons",
      "Saint-Pierre",
      "Saint-Michel",
      "Bacalan",
      "Caudéran",
      "Bastide",
    ],
    contexte:
      "Bordeaux, classée UNESCO, regorge d'échoppes du XIXᵉ et d'immeubles en pierre blonde. Les parquets d'origine en chêne du Limousin demandent un savoir-faire de rénovation pointu, souvent en pose clouée sur lambourdes restaurées.",
    tarifIndicatif: "46 à 82 €/m²",
    codePostalPrincipal: "33000",
    geo: { lat: 44.8378, lng: -0.5792 },
  },
  {
    slug: "toulouse",
    name: "Toulouse",
    region: "Occitanie",
    population: "493 000 habitants",
    quartiers: [
      "Capitole",
      "Carmes",
      "Saint-Étienne",
      "Compans-Caffarelli",
      "Rangueil",
      "Saint-Cyprien",
    ],
    contexte:
      "Toulouse, la ville rose, marie hôtels particuliers Renaissance et résidences neuves. Le parquet en chêne du Sud-Ouest (massif ou contrecollé) prédomine, avec une demande croissante pour les finitions huilées naturelles.",
    tarifIndicatif: "44 à 78 €/m²",
    codePostalPrincipal: "31000",
    geo: { lat: 43.6047, lng: 1.4442 },
  },
  {
    slug: "nice",
    name: "Nice",
    region: "Provence-Alpes-Côte d'Azur",
    population: "342 000 habitants",
    quartiers: [
      "Vieux Nice",
      "Carré d'Or",
      "Cimiez",
      "Musiciens",
      "Mont Boron",
      "Libération",
    ],
    contexte:
      "Nice combine immeubles Belle Époque du Carré d'Or, villas de Cimiez et appartements modernes du Port. La chaleur méditerranéenne et la proximité de la mer imposent des contrecollés stables, souvent en finition huile naturelle pour préserver l'aspect.",
    tarifIndicatif: "50 à 88 €/m²",
    codePostalPrincipal: "06000",
    geo: { lat: 43.7102, lng: 7.262 },
  },
  {
    slug: "nantes",
    name: "Nantes",
    region: "Pays de la Loire",
    population: "318 000 habitants",
    quartiers: [
      "Île de Nantes",
      "Bouffay",
      "Graslin",
      "Hauts-Pavés",
      "Procé",
      "Chantenay",
    ],
    contexte:
      "Nantes, dynamique et créative, voit cohabiter immeubles XIXᵉ du centre, lofts industriels de l'Île de Nantes et constructions neuves. Le contrecollé chêne domine, avec une vraie demande pour le bois local (châtaignier) en finition mate.",
    tarifIndicatif: "44 à 78 €/m²",
    codePostalPrincipal: "44000",
    geo: { lat: 47.2184, lng: -1.5536 },
  },
  {
    slug: "strasbourg",
    name: "Strasbourg",
    region: "Grand Est",
    population: "291 000 habitants",
    quartiers: [
      "Grande-Île (Centre)",
      "Petite France",
      "Krutenau",
      "Neudorf",
      "Robertsau",
      "Orangerie",
    ],
    contexte:
      "Strasbourg conserve un patrimoine bois exceptionnel : maisons à colombages de la Petite France, immeubles Wilhelminiens de la Neustadt. Les parquets d'origine en sapin et chêne demandent une expertise patrimoniale rare, encore vivante chez les artisans alsaciens.",
    tarifIndicatif: "46 à 82 €/m²",
    codePostalPrincipal: "67000",
    geo: { lat: 48.5734, lng: 7.7521 },
  },
];

export function getCityBySlug(slug: string): ParquetoCity | undefined {
  return CITIES.find((c) => c.slug === slug);
}
