# Sprint Handoff — Parqueto Studio → Codex Prod

> **Usage** : copier ce fichier en `docs/handoff/sprint-vXX.md` à chaque fin de sprint Lovable.
> Remplir chaque section. Ne pas supprimer les sections inutilisées — écrire "N/A".
> **Source stack** : Lovable (TanStack Start v1 + Cloudflare Workers, `src/routes/`).
> **Target stack** : Codex (Next.js 15 App Router + Vercel, `app/`).

---

## 0. Méta

- **Sprint** : vXX
- **Date de livraison** :
- **Branche / tag Lovable** : `sprint-vXX` (mirror GitHub `parqueto-lovable-studio`)
- **ZIP backup** : oui / non — lien :
- **Auteur Lovable** :
- **Reviewer Codex** :

---

## 1. Scope du sprint

Résumé en 3 lignes max de ce qui a été livré.

- Pages :
- Composants :
- Server functions :
- Migrations DB :

---

## 2. Fichiers créés / modifiés

Chemins **exacts** côté Lovable (`src/...`). Marquer `[CRÉÉ]`, `[MODIFIÉ]`, `[SUPPRIMÉ]`.

```
src/routes/...           [CRÉÉ]
src/components/site/...  [MODIFIÉ]
src/lib/....functions.ts [CRÉÉ]
```

**Fichiers non négociables à NE PAS toucher côté Codex** (liste de garde) :

- `src/routes/index.tsx` (homepage figée)
- ...

---

## 3. Design tokens touchés

| Token | Avant | Après | Fichier |
|---|---|---|---|
| `--brand-orange` | — | `oklch(...)` | `src/styles.css` |

**Mode append-only côté Codex** : ne pas écraser, ajouter à la fin de `globals.css`.

---

## 4. Contrats partagés (Zod / TS)

Lister chaque schéma exposé entre client et serveur, avec source de vérité.

- `AnalyzeInputSchema` — `src/lib/parquet-vision.types.ts` — input : `imageDataUrls[]` (1–3, 5 Mo)
- `AnalysisResultSchema` — idem — output server fn

---

## 5. Dépendances ajoutées

```
package.json :
  + lib@x.y.z
```

Vérifier compat **Cloudflare Workers** ET **Vercel Node runtime**.
Packages Node-only (sharp, puppeteer, child_process) interdits.

---

## 6. Variables d'environnement requises

| Variable | Scope | Usage | Présente Lovable | Présente Codex |
|---|---|---|---|---|
| `LOVABLE_API_KEY` | server | AI Gateway | ✅ auto | ❌ à provisionner |
| `OPENROUTER_API_KEY` | server | fallback IA | ❌ | ✅ |

---

## 7. Points de portage Next.js (CRITIQUE)

### Routing
- `src/routes/foo.tsx` → `app/foo/page.tsx`
- `src/routes/foo.$id.tsx` → `app/foo/[id]/page.tsx`
- `src/routes/_authenticated/foo.tsx` → `app/(auth)/foo/page.tsx` + middleware

### Server functions
- `createServerFn({ method: "POST" })` → `app/api/foo/route.ts` (`export async function POST`)
- Input validator → parser Zod en début de handler
- `useServerFn(fn)` côté client → `fetch("/api/foo")` ou Server Action

### Imports à remplacer
| TanStack | Next.js |
|---|---|
| `@tanstack/react-router` `Link` | `next/link` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `createFileRoute(...).head()` | `export const metadata` |
| `@tanstack/react-start` `useServerFn` | direct `fetch` / Server Action |

### Composants
- Composants UI purs (shadcn, Pq*) : portables tels quels (zéro dépendance routing).
- Composants avec `<Link to="">` : remplacer par `<Link href="">`.

---

## 8. Captures d'écran

Joindre 2-3 screenshots par page livrée (desktop + mobile) dans `docs/handoff/sprint-vXX/`.

---

## 9. Décisions gelées ce sprint

- ...

## 10. Questions ouvertes pour Codex

- ...

---

## 11. Checklist pré-merge Codex

- [ ] Tokens design ajoutés en append-only dans `globals.css`
- [ ] Aucun fichier "non négociable" modifié
- [ ] Variables d'env documentées dans `.env.example`
- [ ] Build Next.js OK (`pnpm build`)
- [ ] Lint OK
- [ ] Pas de package Node-only ajouté
- [ ] Screenshots desktop + mobile validés
