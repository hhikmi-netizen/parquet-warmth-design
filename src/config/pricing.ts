// Configuration centralisée des tarifs Parqueto
// Source unique de vérité — ne jamais hardcoder les prix dans les composants.

export const PRICING = {
  trialDays: 14,
  subscription: {
    monthly: {
      label: "Mensuel",
      priceHt: 59,
      billing: "mois",
      commitment: "Sans engagement",
    },
    yearly: {
      label: "Annuel",
      priceHtPerMonth: 49,
      totalHtPerYear: 588,
      billing: "an",
      discountLabel: "-17%",
      savingHtPerYear: 120,
      commitment: "Facturé annuellement",
    },
  },
  leadCategories: {
    standard: {
      label: "Standard",
      description: "Projets simples",
      estimateMin: 0,
      estimateMax: 3000,
      leadPriceHt: 49,
      responseDelayHours: 6,
      color: "green",
    },
    qualified: {
      label: "Qualifié",
      description: "Projets intermédiaires",
      estimateMin: 3000,
      estimateMax: 8000,
      leadPriceHt: 89,
      responseDelayHours: 12,
      color: "orange",
    },
    premium: {
      label: "Premium",
      description: "Grands projets",
      estimateMin: 8000,
      estimateMax: null,
      leadPriceHt: 189,
      responseDelayHours: 24,
      color: "purple",
      extraTimeAllowed: true,
      extraTimeHours: 24,
      extraTimeMaxUses: 1,
    },
  },
} as const;

export function getLeadCategoryByEstimate(amount: number) {
  if (amount < 3000) return PRICING.leadCategories.standard;
  if (amount <= 8000) return PRICING.leadCategories.qualified;
  return PRICING.leadCategories.premium;
}

export type LeadCategoryKey = keyof typeof PRICING.leadCategories;
export type LeadCategory = (typeof PRICING.leadCategories)[LeadCategoryKey];
