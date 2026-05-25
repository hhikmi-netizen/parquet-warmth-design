# Brief Codex — Gemini Vision sur `/estimer-mon-parquet`

> Sprint **V11** (lancement public). Tout le scaffold UI + serveur est en place,
> il ne reste qu'à activer l'appel multimodal.

## TL;DR

1. Ouvrir `src/lib/parquet-vision.functions.ts`.
2. Supprimer le bloc `─── MOCK V10 ───` (≈ 4 lignes).
3. Décommenter le bloc `─── V11 RÉEL ───` juste en dessous.
4. Vérifier que `LOVABLE_API_KEY` est bien présent côté serveur (déjà géré par Lovable Cloud).
5. Tester via la page `/estimer-mon-parquet`.

Aucun changement nécessaire côté UI, contrat ni routing.

---

## Architecture

```
[Browser]
  src/routes/estimer-mon-parquet.tsx
    ├─ Upload photo → preview en data URL base64
    └─ useServerFn(analyzeParquetPhoto)({ data: { imageDataUrl } })
                            │
                            ▼
[Worker SSR]
  src/lib/parquet-vision.functions.ts
    ├─ Zod validate (AnalyzeInputSchema)
    ├─ callAI({ model: "google/gemini-2.5-flash", multimodal })  ← À ACTIVER
    └─ Zod re-validate (AnalysisResultSchema) → réponse typée
                            │
                            ▼
[Lovable AI Gateway]
  https://ai.gateway.lovable.dev/v1/chat/completions
  Header: Authorization: Bearer ${LOVABLE_API_KEY}
```

## Contrat figé (ne pas casser)

- **Input** : `{ imageDataUrl: string; hint?: string }` — voir `AnalyzeInputSchema`
  dans `src/lib/parquet-vision.types.ts`.
- **Output** : `{ result: AnalysisResult | null; error: string | null }` — voir
  `AnalysisResultSchema` (même fichier). C'est la **source de vérité** : le tool
  schema JSON dans `parquet-vision.functions.ts` (`PARQUET_VISION_TOOL_PARAMS`)
  est calqué dessus. Si tu modifies l'un, modifie l'autre **en miroir**.

## Modèle recommandé

- **`google/gemini-2.5-flash`** — multimodal, ~0,001 € / requête, latence < 3 s.
- Fallback envisageable : `google/gemini-2.5-pro` si la précision surface est
  insuffisante en prod (coût ×6, latence ×2).

## Prompts

Déjà rédigés en français et exportés depuis `parquet-vision.functions.ts` :

- `PARQUET_VISION_SYSTEM_PROMPT` — règles métier, garde-fous, format imposé.
- `PARQUET_VISION_TOOL_PARAMS` — JSON schema strict pour le tool calling.

Le système prompt force l'appel de la fonction `return_parquet_analysis` →
pas de free text à parser.

## Gestion d'erreurs (déjà câblée)

| Cas | Comportement | Message UI |
|-----|--------------|------------|
| `AI_RATE_LIMITED` (429) | `error` non null | "Trop de requêtes, réessayez dans une minute." |
| `AI_PAYMENT_REQUIRED` (402) | `error` non null | "Crédits IA épuisés — contactez l'équipe." |
| Schema mismatch (Zod KO) | `error` non null + log serveur | "Réponse IA invalide. Réessayez." |
| Exception réseau / autre | `error` non null + log serveur | "L'analyse IA est temporairement indisponible." |

La page `/estimer-mon-parquet` affiche `error` dans une bannière warning et
laisse l'utilisateur réessayer sans reset de la photo.

## Limites & garde-fous client

- Taille image max : **12 Mo** (validé côté UI).
- Formats acceptés : JPG, PNG, WEBP (regex côté zod input).
- Taille data URL max côté serveur : **~15 Mo base64** (`AnalyzeInputSchema`).
- Pas de stockage : la photo n'est **pas persistée** (RGPD). Si V11 veut
  archiver pour fine-tuning, créer un bucket dédié + consentement explicite.

## Métriques à logger (V11+)

À ajouter quand tu actives le réel :

```ts
console.info("parquet-vision", {
  durationMs,
  flooringType: parsed.data.flooringType,
  confidence: parsed.data.estimatedSurface.confidence,
  surfaceM2: parsed.data.estimatedSurface.value,
});
```

Permettra d'estimer le coût mensuel et la précision perçue.

## Tests manuels recommandés

1. Photo de carrelage net, pièce visible → confiance "Moyenne" attendue.
2. Photo très floue → confiance "Faible" + warning explicite.
3. Photo non-sol (visage, voiture) → résultat marqué "Faible" + warning.
4. Photo > 12 Mo → bloqué côté UI avant envoi.
5. Coupure réseau pendant l'appel → message d'erreur, pas de crash.

## Hors scope V11

- Multi-photos (1 seule photo par requête pour l'instant).
- Estimation au cm près (l'IA reste une **pré-évaluation**).
- Comparatif chiffré avec devis artisan (V12).
