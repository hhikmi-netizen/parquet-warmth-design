import type { ParquetoCity } from "@/lib/cities";
import type { Prestation } from "@/lib/prestations";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Génère 6 Q/R contextualisées ville × prestation pour AEO + Schema.org FAQPage.
 * Réponses concises (40-90 mots) avec données concrètes (prix, délai, garantie).
 */
export function buildPrestationFaq(city: City, prestation: Prestation): FaqItem[] {
  const presta = prestation.name.toLowerCase();
  return [
    {
      question: `Combien coûte ${presta} à ${city.name} ?`,
      answer: `À ${city.name}, ${presta} se situe en moyenne autour de ${prestation.tarif}. Le prix final dépend de la surface, de l'état du support, de l'essence du bois et des finitions choisies. Tous nos devis sont gratuits, détaillés ligne par ligne et envoyés sous 24 h par un artisan vérifié intervenant sur ${city.name} et sa région (${city.region}).`,
    },
    {
      question: `Quel est le délai pour ${presta} à ${city.name} ?`,
      answer: `Comptez généralement ${prestation.duree}. Après acceptation du devis, l'artisan ${city.name} planifie l'intervention sous 5 à 10 jours ouvrés selon la saison. Les délais peuvent être raccourcis en cas d'urgence (dégât des eaux, état d'avancement chantier) — précisez-le dans votre demande d'estimation.`,
    },
    {
      question: `Comment trouver un artisan parqueteur fiable à ${city.name} ?`,
      answer: `Tous les parqueteurs Parqueto à ${city.name} sont vérifiés : SIRET actif, assurance décennale à jour, références chantiers contrôlées et avis clients modérés. Vous recevez un devis personnalisé sous 24 h, sans engagement, et l'artisan reste votre interlocuteur unique du diagnostic à la garantie.`,
    },
    {
      question: `${prestation.longName} : quelles garanties à ${city.name} ?`,
      answer: `Chaque chantier ${presta} réalisé par un artisan Parqueto à ${city.name} bénéficie de la garantie décennale obligatoire (10 ans) sur les travaux, complétée par la garantie de parfait achèvement (1 an). Les matériaux posés conservent en plus la garantie fabricant. L'attestation d'assurance est jointe au devis.`,
    },
    {
      question: `${prestation.name} à ${city.name} : faut-il préparer le logement ?`,
      answer: `Oui : pièce vidée des meubles, accès dégagé, électricité fonctionnelle. Pour ${presta}, prévoyez aussi de pouvoir vous absenter pendant la phase de séchage si nécessaire. L'artisan ${city.name} vous transmet une checklist de préparation après acceptation du devis pour que le chantier démarre dans les meilleures conditions.`,
    },
    {
      question: `Mon assurance habitation couvre-t-elle ${presta} à ${city.name} ?`,
      answer: `Si l'intervention fait suite à un sinistre (dégât des eaux, incendie), votre multirisque habitation peut prendre en charge tout ou partie du chantier. Notre artisan à ${city.name} établit un devis conforme aux exigences des experts d'assurance et peut dialoguer directement avec votre compagnie pour accélérer l'indemnisation.`,
    },
  ];
}
