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
  // ───────── Communes premium Île-de-France (fort pouvoir d'achat) ─────────
  {
    slug: "neuilly-sur-seine",
    name: "Neuilly-sur-Seine",
    region: "Île-de-France (Hauts-de-Seine)",
    population: "59 000 habitants",
    quartiers: ["Sablons", "Saint-James", "Bagatelle", "Pasteur", "Madrid", "Île de la Jatte"],
    contexte:
      "Neuilly est l'une des communes les plus huppées de France. Hôtels particuliers, immeubles haussmanniens cossus et appartements de standing exigent un parquet d'excellence : Versailles, point de Hongrie large, chêne sélection Première ou massif vieilli. Les artisans y travaillent souvent en relation avec architectes d'intérieur et décorateurs.",
    tarifIndicatif: "75 à 140 €/m²",
    codePostalPrincipal: "92200",
    geo: { lat: 48.8846, lng: 2.2696 },
  },
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    region: "Île-de-France (Hauts-de-Seine)",
    population: "121 000 habitants",
    quartiers: ["Centre-ville", "Parchamp-Albert Kahn", "Billancourt", "Île Seguin", "Silly-Gallieni", "Les Princes-Marmottan"],
    contexte:
      "Boulogne mêle immeubles Art déco classés (Mallet-Stevens, Le Corbusier), résidences haussmanniennes du centre et programmes neufs haut de gamme de l'Île Seguin. La rénovation Art déco demande un savoir-faire pointu (parquets mosaïque, marqueterie d'origine).",
    tarifIndicatif: "65 à 115 €/m²",
    codePostalPrincipal: "92100",
    geo: { lat: 48.8356, lng: 2.2412 },
  },
  {
    slug: "levallois-perret",
    name: "Levallois-Perret",
    region: "Île-de-France (Hauts-de-Seine)",
    population: "65 000 habitants",
    quartiers: ["Mairie", "Front de Seine", "Eiffel", "Anatole France", "Wilson", "Trébois"],
    contexte:
      "Levallois affiche la densité la plus forte d'Europe et un parc immobilier majoritairement post-1990 très qualitatif. Le contrecollé chêne large (180-220 mm) en pose collée domine, avec une forte demande pour les finitions huilées invisibles et les essences blondes.",
    tarifIndicatif: "62 à 105 €/m²",
    codePostalPrincipal: "92300",
    geo: { lat: 48.8939, lng: 2.2877 },
  },
  {
    slug: "antony",
    name: "Antony",
    region: "Île-de-France (Hauts-de-Seine)",
    population: "63 000 habitants",
    quartiers: ["Centre", "Parc de Sceaux", "Vallée", "Pajeaud", "Fontaine-Michalon", "La Croix-de-Berny"],
    contexte:
      "Antony, au sud des Hauts-de-Seine, attire familles CSP+ et cadres en quête de maisons des années 30 et pavillons rénovés. Le marché y est très porteur sur la rénovation complète : ponçage et vitrification de parquets chêne anciens, pose de massif clouée dans les maisons bourgeoises.",
    tarifIndicatif: "55 à 95 €/m²",
    codePostalPrincipal: "92160",
    geo: { lat: 48.7539, lng: 2.2978 },
  },
  {
    slug: "saint-cloud",
    name: "Saint-Cloud",
    region: "Île-de-France (Hauts-de-Seine)",
    population: "30 000 habitants",
    quartiers: ["Centre", "Coteaux", "Montretout", "Val d'Or", "Hippodrome", "Pasteur"],
    contexte:
      "Saint-Cloud, perchée sur les coteaux face à Paris, est l'une des communes les plus aisées d'Île-de-France. Hôtels particuliers, demeures bourgeoises et immeubles de standing y abritent des parquets d'origine (chêne massif, point de Hongrie) que les propriétaires veulent restaurer dans les règles de l'art.",
    tarifIndicatif: "70 à 125 €/m²",
    codePostalPrincipal: "92210",
    geo: { lat: 48.8456, lng: 2.2089 },
  },
  {
    slug: "versailles",
    name: "Versailles",
    region: "Île-de-France (Yvelines)",
    population: "85 000 habitants",
    quartiers: ["Notre-Dame", "Saint-Louis", "Montreuil", "Clagny-Glatigny", "Chantiers", "Porchefontaine"],
    contexte:
      "Versailles, c'est la patrie du parquet Versailles — panneaux d'art posés au Château dès le XVIIᵉ. La ville conserve une demande très haut de gamme : restauration de panneaux Versailles, pose neuve en point de Hongrie chêne massif, finitions traditionnelles à la cire ou à l'huile dure.",
    tarifIndicatif: "70 à 140 €/m²",
    codePostalPrincipal: "78000",
    geo: { lat: 48.8014, lng: 2.1301 },
  },
  {
    slug: "vincennes",
    name: "Vincennes",
    region: "Île-de-France (Val-de-Marne)",
    population: "49 000 habitants",
    quartiers: ["Centre", "Cœuilly", "Diderot", "République", "Bois", "Domaine du Bois"],
    contexte:
      "Vincennes, en lisière du Bois, est l'une des communes les plus prisées de l'Est parisien. Immeubles haussmanniens, Art déco et résidences récentes y accueillent une clientèle CSP+ exigeante : pose de contrecollé large chêne, restauration de parquets anciens en chevron.",
    tarifIndicatif: "60 à 105 €/m²",
    codePostalPrincipal: "94300",
    geo: { lat: 48.8476, lng: 2.4385 },
  },
  {
    slug: "saint-mande",
    name: "Saint-Mandé",
    region: "Île-de-France (Val-de-Marne)",
    population: "23 000 habitants",
    quartiers: ["Mairie", "Tourelle", "Alouette", "Faidherbe", "Bois"],
    contexte:
      "Saint-Mandé, micro-commune ultra-recherchée collée au Bois de Vincennes, affiche l'un des prix au m² les plus élevés d'Île-de-France. Le bâti haussmannien et Art déco abrite des parquets d'origine que les propriétaires souhaitent préserver : ponçage doux, finition huile naturelle, restauration de mosaïques.",
    tarifIndicatif: "65 à 115 €/m²",
    codePostalPrincipal: "94160",
    geo: { lat: 48.8413, lng: 2.4192 },
  },
];

export function getCityBySlug(slug: string): ParquetoCity | undefined {
  return CITIES.find((c) => c.slug === slug);
}
