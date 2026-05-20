# Refonte structurelle : séparer marketing / produit / espaces métier

## Principe directeur

La homepage vend **une seule promesse** : *« Estimez votre projet parquet en quelques minutes. »*
Tout le reste devient des pages dédiées accessibles via la navigation.

## 1. Homepage allégée (`src/routes/index.tsx`)

Garder uniquement, dans cet ordre :

1. `Header`
2. `Hero` (la promesse + CTA estimation)
3. `Promise` (réassurance courte)
4. `Process` — *Comment ça marche*
5. `ArtisansShowcase` — version compacte (3 cartes max + lien « Voir tous nos artisans »)
6. Bloc « Quelques réalisations » — extrait de 3 visuels + lien `/realisations`
7. `Partners` — bandeau logos uniquement + lien `/partenaires`
8. `MicroReassurance` (déjà dans Hero, retirer le doublon si présent)
9. `FinalCTA`
10. `Footer` + `MobileStickyCTA`

À **retirer** de la homepage :
- `Pains`, `Expertise`, `Calculators`, `Artisan` (recrutement), `Blog`, `FAQ`, `ProcessFAQ`, `FloatingNav` (optionnel)

## 2. Pages dédiées à créer

| Route | Contenu déplacé depuis la home |
|---|---|
| `/outils` | `Calculators` + `OutilsTab` public + lien vers `/teintes` |
| `/realisations` | Galerie avant/après, extraits projets, lien estimation |
| `/blog` | Composant `Blog` + FAQ SEO |
| `/partenaires` | `Partners` complet + section « Devenir partenaire » + CTA contact |
| `/artisans` | Recrutement (composant `Artisan`) — renommer mentalement `/devenir-artisan` reste la page d'inscription ; `/artisans` = présentation publique + lien vers inscription |

Pages déjà existantes à conserver telles quelles :
- `/a-propos`, `/contact`, `/pro` (espace artisan), `/admin`, `/estimation`, `/devenir-artisan`, `/teintes`

## 3. Navigation header (`src/components/site/Header.tsx`)

Nouveau menu principal, court et lisible :

```
Comment ça marche   →  /#process
Réalisations        →  /realisations
Nos artisans        →  /artisans
Outils              →  /outils
À propos            →  /a-propos
Contact             →  /contact
```

CTA persistants à droite : **Espace Pro** + **Estimer gratuitement**.

Retirer les ancres `#nos-artisans`, `#outils`, `#realisations` qui pointaient vers la home.

## 4. Footer

Mettre à jour les liens vers les nouvelles routes : `/outils`, `/realisations`, `/blog`, `/partenaires`, `/artisans`.

## 5. Règle admin / dashboard

Aucune référence à `/admin` ni au dashboard depuis la homepage ou la nav publique. Accès uniquement via URL directe (déjà le cas).

## Détails techniques

- Chaque nouvelle page = `createFileRoute` + `head()` avec `title`, `description`, `og:title`, `og:description` propres (SEO).
- Réutiliser les composants existants (`Calculators`, `Blog`, `Partners`, `Artisan`, `FAQ`, `ProcessFAQ`) en les intégrant dans les nouvelles routes — pas de réécriture.
- Le composant `Header` est partagé : importer dans chaque nouvelle page + `Footer`.
- Garder `MobileStickyCTA` uniquement sur la homepage et `/estimation` (conversion).

## Hors scope (pour plus tard)

- Refonte visuelle des sections déplacées (elles gardent leur design actuel).
- Création de contenu blog réel.
- Page `/realisations` avec vrai CMS — pour l'instant statique avec les visuels existants.
