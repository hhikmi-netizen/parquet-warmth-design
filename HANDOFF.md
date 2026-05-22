# Parqueto — Handoff technique & design

Document de remise destiné à toute IA ou développeur reprenant le projet (Genspark / Claude Code / Codex / dev humain). Objectif : intégrer rapidement, sans réinventer les maquettes.

---

## 1. Stack

| Couche | Choix |
|---|---|
| Framework | **TanStack Start v1** (React 19, Vite 7, SSR Cloudflare Workers) |
| Routing | `@tanstack/react-router` — file-based dans `src/routes/` |
| Styling | **Tailwind v4** via `src/styles.css` (tokens OKLCH, pas de `tailwind.config.js`) |
| UI kit | shadcn/ui dans `src/components/ui/` + **Parqueto V9** dans `src/components/parqueto/` |
| State serveur | Server functions (`createServerFn`) — pas d'Edge Functions Supabase |
| Backend | **Lovable Cloud** (Supabase managé) — client dans `src/integrations/supabase/` |
| Auth | Supabase Auth + middleware `requireSupabaseAuth` |
| Animations | CSS / Tailwind. Framer Motion possible si besoin. |

⚠️ Fichiers **auto-générés** — ne jamais éditer à la main :
- `src/routeTree.gen.ts`
- `src/integrations/supabase/{client,client.server,auth-middleware,auth-attacher,types}.ts`
- `.env`

---

## 2. Arborescence

```
src/
├── routes/                          # file-based routing
│   ├── __root.tsx                   # shell HTML + providers
│   ├── index.tsx                    # /
│   ├── estimation.tsx               # /estimation (wizard public)
│   ├── contact.tsx                  # /contact
│   ├── design-system.tsx            # /design-system (showcase UI)
│   ├── login | signup | forgot-password | reset-password | verify-email
│   ├── devenir-artisan.tsx          # landing pro
│   ├── devenir-artisan.inscription.tsx
│   ├── pro.offres.tsx               # tarifs crédits
│   ├── admin.*.tsx                  # /admin/* (dashboard)
│   └── _authenticated/              # protégé (redirect /login)
│       ├── pro.tsx                  # dashboard artisan
│       ├── devis.tsx                # générateur devis
│       └── historique.tsx
├── components/
│   ├── parqueto/                    # ★ Design System V9 (Pq*)
│   ├── site/                        # homepage + nav + footer
│   ├── wizard/                      # étapes estimation
│   ├── pro/                         # dashboard artisan
│   ├── admin/                       # dashboard admin
│   ├── auth/                        # forms login/signup
│   └── ui/                          # shadcn primitives
├── hooks/                           # use-auth, etc.
├── lib/
│   ├── *.functions.ts               # server functions (RPC)
│   ├── *-mock.ts                    # données fictives (admin, inbox…)
│   └── utils.ts
├── integrations/supabase/           # AUTO-GÉNÉRÉ
├── assets/                          # images importées
└── styles.css                       # tokens design system
```

**Convention de nommage routes** (TanStack Start, dots = nesting) :
- `admin.tsx` = layout `/admin` (rend `<Outlet />`)
- `admin.clients.tsx` = `/admin/clients`
- `_authenticated.tsx` = layout protégé sans préfixe URL
- `_authenticated/pro.tsx` = `/pro` (auth required)

---

## 3. Design tokens

Tous les tokens sont dans `src/styles.css` au format **OKLCH**. Ne **jamais** hardcoder `text-white`, `bg-black`, `#E5651C` dans un composant — toujours passer par les tokens.

### Couleurs (extrait)

```css
--background          /* fond principal (crème chaud) */
--foreground          /* texte principal (encre profonde) */
--brand-cream         /* crème pâle, surfaces */
--brand-orange        /* #E5651C — accent principal */
--brand-orange-deep   /* orange foncé hover / texte sur clair */
--brand-ink           /* noir/encre, type display */
--muted, --muted-foreground
--accent, --accent-foreground
--border
--state-success / --state-success-surface
--state-warning / --state-warning-surface
--state-danger  / --state-danger-surface
--state-info    / --state-info-surface
```

### Ombres & rayons

```css
--shadow-soft   /* cartes au repos */
--shadow-warm   /* CTA orange, hover premium */
--radius-sm 0.5rem · --radius 0.75rem · --radius-lg 1rem · --radius-xl 1.5rem
```

### Typographie

- **Display / titres** : `font-serif` (Cormorant Garamond)
- **Texte courant** : font système sans-serif
- Échelle : `text-xs (12)` · `sm (14)` · `base (16)` · `lg (18)` · `xl (20)` · `2xl (24)` · `3xl (30)` · `4xl (36)` · `5xl (48)` · `6xl (60)`
- Hiérarchie home : H1 hero = `text-5xl sm:text-6xl font-serif`, sections = `text-3xl sm:text-4xl font-serif`

### Espacement (Tailwind par défaut)

Grille 4 px. Sections homepage utilisent `py-16 sm:py-24` ; cards `p-5 sm:p-6` ; mobile = padding réduit, desktop = aéré.

---

## 4. Composants Parqueto V9

Lib propriétaire dans `src/components/parqueto/`. Showcase live : **`/design-system`**.

| Composant | Rôle |
|---|---|
| `PqButton` | variantes `primary` · `secondary` · `ghost` · `link` · tailles `sm/md/lg` |
| `PqField` | input + label + erreur + helper |
| `PqSelect`, `PqTextarea` | équivalents |
| `PqRadioCard`, `PqCheckCard` | sélection visuelle premium (utilisé dans le wizard) |
| `PqSurface` | conteneur 5 tons (default/muted/cream/orange/ink) |
| `PqPill` | badges de statut |
| `PqTable` | tableau générique typé |
| `PqKpi` | carte KPI avec trend |
| `PqGauge` | jauge progression |
| `PqModal` | bottom-sheet mobile → centré desktop |
| `PqToast` | notifications contextuelles |
| `PqUpload` | drag & drop photos + caméra mobile |

Pour ajouter un nouveau composant : suivre `cva` + tokens, l'exporter dans `index.ts`, ajouter une section dans `routes/design-system.tsx`.

---

## 5. Architecture des flows

### 5.1 Visiteur → estimation (public)
```
/                       Landing (Hero, Process, Calculators, Artisans, FAQ, CTA)
  → click "Estimer"
/estimation             Wizard 10 étapes (composants src/components/wizard/)
  → submit
   leadCreated server fn → DB → email artisans matchés
```

### 5.2 Client authentifié
```
/login → /signup → /verify-email
/_authenticated/devis        Création devis PDF
/_authenticated/historique   Suivi projets
```

### 5.3 Artisan
```
/devenir-artisan             Landing pro
/devenir-artisan/inscription Onboarding
/pro                         Dashboard (projets reçus, atelier, zone, compte)
  ├── tab "projets"          QuickActions + inbox leads
  ├── tab "outils"           Atelier Artisan (calculateurs)
  ├── tab "historique"
  ├── tab "zone"
  └── tab "compte"
/pro/offres                  Tarifs crédits
```

### 5.4 Admin
```
/admin                       Layout sidebar
  ├── /admin                 Dashboard KPI 360°
  ├── /admin/clients
  ├── /admin/artisans
  ├── /admin/moderation
  ├── /admin/monetisation
  ├── /admin/notifications
  ├── /admin/support
  ├── /admin/logs
  └── /admin/parametres
```

**Données admin actuellement mockées** dans `src/lib/admin-mock.ts`. Pour brancher : remplacer chaque import mock par un `useQuery` sur une server function `get*` (ex : `getAdminClients`).

---

## 6. Conventions mobile-first

> Le secteur travaux/artisans est ultra mobile. Règles non négociables.

1. **Cibles tactiles ≥ 44 px** — pas de bouton plus petit, même en discrétion.
2. **Tableaux → cartes** sous `md` (768). Voir `admin.clients.tsx` : `<table className="hidden md:table">` + version `<ul className="md:hidden">` cards.
3. **Filtres → scroll horizontal** sous `sm` : `flex gap-2 overflow-x-auto -mx-1 px-1 pb-1`.
4. **Modales → bottom sheet** sous `sm` : `PqModal` gère déjà la bascule.
5. **CTA sticky mobile** : composant `MobileStickyCTA` sur la home ; sur le wizard, footer fixe avec « Suivant ».
6. **Safe-area iOS** : tout élément `fixed bottom` doit utiliser `pb-[calc(env(safe-area-inset-bottom)+...)]`.
7. **Upload photos** : `PqUpload` utilise `<input type="file" accept="image/*" capture="environment">` → ouvre direct l'appareil photo arrière sur mobile.
8. **Header mobile** : burger menu, logo réduit, **pas de mega-nav**. Voir `Header.tsx`.
9. **Typographies fluides** : titres `text-3xl sm:text-4xl` minimum 2 tailles, jamais une seule.
10. **Padding sections** : `py-12 sm:py-20 lg:py-24` — ne jamais coller en haut/bas.

Breakpoints utilisés (Tailwind défaut) :
- `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536

---

## 7. Server functions — pattern obligatoire

**Ne pas** mettre de fichier serveur dans `src/server/` (l'import-protection bloque le bundle client). Placer `*.functions.ts` dans `src/lib/`.

```ts
// src/lib/leads.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ surface: z.number().min(1).max(1000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: lead, error } = await supabase
      .from("leads").insert({ ...data, user_id: userId }).select().single();
    if (error) throw new Error(error.message);
    return { lead };
  });
```

**Côté composant** : `useServerFn` + `useQuery`, **jamais** dans un loader de route publique (SSR sans session → 401).

---

## 8. Sécurité & RLS

- Toutes les tables protégées par **RLS** + policies basées sur `auth.uid()`.
- Les rôles vivent dans une **table dédiée `user_roles`** + fonction `has_role(uuid, app_role)` SECURITY DEFINER. **Jamais** de colonne `role` sur `profiles`.
- Secrets : **jamais** dans `import.meta.env` côté client, toujours `process.env.*` dans `.handler()`.
- Webhooks publics dans `src/routes/api/public/*` → vérifier signature HMAC avant tout traitement.

---

## 9. Conventions UI à respecter

✅ À faire
- Tokens sémantiques (`bg-brand-cream`, `text-brand-orange-deep`, `border-border`)
- Composants Pq* avant shadcn
- `font-serif` pour les titres
- `rounded-2xl` / `rounded-3xl` sur les cartes, `rounded-full` sur boutons & pills
- Animations sobres : `transition hover:-translate-y-0.5`, `duration-300`
- États : loading, empty, error pour chaque liste/table

❌ À éviter
- Couleurs hardcodées (`#E5651C`, `text-white`)
- Gradients agressifs ou néons
- Émojis dans l'UI (sauf rares cas marketing)
- Icônes hors **lucide-react**
- Boutons < 40 px de haut
- Tableaux denses non transformés en cartes sur mobile
- Animations spectaculaires sur le wizard (ralentit perçu)

---

## 10. Routes publiques importantes pour vérification

| URL | Vérifier |
|---|---|
| `/` | Hero, sticky CTA mobile, FloatingNav desktop |
| `/estimation` | Wizard 10 steps, progress bar, retour étape |
| `/design-system` | **Toujours à jour** — référence visuelle des composants |
| `/contact` | Formulaire premium + partenaires |
| `/devenir-artisan` | Landing pro |
| `/pro` | Tabs : projets / atelier / historique / zone / compte |
| `/admin` | Dashboard 360° responsive |

---

## 11. Checklist intégration pour la suite

- [ ] Brancher tables Supabase réelles à la place des `*-mock.ts`
- [ ] Implémenter `createLead` + matching artisan
- [ ] Connecter Stripe pour les crédits artisans (`/pro/offres`)
- [ ] Storage : photos chantiers (bucket `chantier-photos`, policies par user_id)
- [ ] Email transactionnel (Resend ou natif Supabase)
- [ ] Tests E2E des flows critiques : estimation, signup artisan, accept lead
- [ ] Lighthouse mobile ≥ 90 sur `/` et `/estimation`
- [ ] Tests RLS via `supabase--linter`
- [ ] **Brancher l'Assistant Parqueto IA** (voir §13)

---

## 12. Pour une IA qui reprend

Avant de coder **quoi que ce soit** :
1. Lire ce fichier en entier.
2. Visiter `/design-system` — c'est la **source de vérité visuelle**.
3. Vérifier les tokens dans `src/styles.css` avant tout nouveau composant.
4. Chercher si un composant Pq* existe déjà avant d'en créer un nouveau.
5. Respecter la convention mobile-first du §6.
6. Pour toute logique serveur : §7 (server functions, pas Edge Functions).

---

## 13. Assistant Parqueto IA — état & branchement

**État actuel : UI complète, IA non branchée (mock visuel).**

### Ce qui existe déjà
- **Teaser homepage** : `src/components/site/AssistantTeaser.tsx`
  - Affiche un résultat d'analyse **simulé** (chêne européen / vitrifiée mate / usure modérée — valeurs fixes).
  - CTA vers `/assistant`.
- **Page dédiée** : `src/routes/assistant.tsx` → `src/components/assistant/AssistantExperience.tsx` (538 lignes)
  - Upload drag & drop + caméra mobile (preview via `URL.createObjectURL`, jamais envoyé).
  - Animation de scan + barre de progression sur 5 étapes (3,8 s, factice via `setInterval`).
  - Panneau résultats riche : essence probable, finition, pose, 4 signaux (rayures / humidité / tuilage / support), 3 recommandations, urgence estimée, ring de confiance (78%).
  - **Toutes les valeurs sortent de la constante `MOCK_RESULT`** en haut du fichier (lignes ~30-80).
  - Disclaimer en pied : *« lecture indicative, photo non conservée »* + CTA `/estimation`.

### Décision produit (2026-05-22)
On **garde** l'UI mockée telle quelle. Pas de fausse promesse côté texte : le disclaimer suffit. L'IA sera branchée plus tard via **Claude (Anthropic) ou OpenRouter**, choix utilisateur.

### Comment brancher l'IA (TODO prochaine itération)

**Option A — Lovable AI Gateway (zéro clé, recommandé pour MVP)**
- Modèles vision : `google/gemini-2.5-flash` (gratuit jusqu'à fin oct. 2025), `google/gemini-2.5-pro`, `openai/gpt-5*`.
- Aucun secret à demander à l'utilisateur.

**Option B — Claude direct (Anthropic API)**
- Modèle vision : `claude-sonnet-4` ou `claude-opus-4`.
- Secret requis : `ANTHROPIC_API_KEY` (via `add_secret`).

**Option C — OpenRouter (multi-modèles)**
- Secret requis : `OPENROUTER_API_KEY`.
- Switch facile entre Claude / GPT / Gemini sans changer le code.

**Étapes communes :**

1. Créer `src/lib/assistant.functions.ts` :
   ```ts
   export const analyzeParquetPhoto = createServerFn({ method: "POST" })
     .inputValidator((d) => z.object({
       imageBase64: z.string().min(100).max(15_000_000), // ~10 Mo b64
       mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
     }).parse(d))
     .handler(async ({ data }) => {
       // appel API vision (Lovable / Claude / OpenRouter)
       // prompt système : expert parqueteur, ton prudent,
       //   sortie JSON structurée matchant MOCK_RESULT
       // ⚠️ NE PAS STOCKER la photo (respect du disclaimer UI)
       return parsedResult; // même shape que MOCK_RESULT
     });
   ```

2. **Schéma de sortie JSON identique à `MOCK_RESULT`** (essence, finition, pose, signals[], recommendations[], urgency, confidence). Garder cette forme = zéro changement UI.

3. Prompt système (à raffiner) :
   > « Tu es un expert parqueteur français. À partir d'une photo, identifie l'essence probable, la finition, l'état d'usure. Reste prudent (`confidence` 0–100). Recommande des actions concrètes. Réponds UNIQUEMENT en JSON valide selon le schéma fourni. »

4. Côté `AssistantExperience.tsx` :
   - Remplacer le `setInterval` factice (`startAnalysis`) par :
     ```ts
     const result = await analyzeParquetPhoto({ data: { imageBase64, mimeType } });
     setResult(result); // au lieu d'utiliser MOCK_RESULT
     ```
   - Convertir le `File` en base64 avant envoi (`FileReader.readAsDataURL`).
   - Garder l'animation de scan pendant l'attente réelle.
   - Gérer erreurs : timeout, image illisible, quota dépassé → toast + fallback gracieux.

5. **Sécurité** :
   - Aucune persistance image (pas de Storage, pas de log du base64).
   - Rate-limit côté server fn (ex : 5 analyses / IP / heure).
   - Log uniquement métadonnées : timestamp, taille, durée, modèle utilisé.

### Fichiers concernés
- `src/components/site/AssistantTeaser.tsx` — teaser homepage (mock)
- `src/routes/assistant.tsx` — route `/assistant`
- `src/components/assistant/AssistantExperience.tsx` — UI complète (mock)
- *(à créer)* `src/lib/assistant.functions.ts` — server fn vision
- *(à créer si B/C)* secret `ANTHROPIC_API_KEY` ou `OPENROUTER_API_KEY`

---

## 14. Journal complet — session du vendredi 22 mai 2026 (06h → 14h30)

Rapport détaillé de tout ce qui a été produit aujourd'hui, destiné à Claude / Codex qui reprend.

### 14.1 Système vidéo premium (10h30 → 10h45)

Brief : créer une expérience vidéo sobre, métier, type Apple / magazine d'architecture, sans look "startup IA".

**Composants créés** :
- `src/components/site/video/VideoPlayer.tsx` — lecteur lazy universel (MP4 / WebM / YouTube / Vimeo), mode `ambient` (muet, loop, sans contrôles) pour fond hero, IntersectionObserver pour ne charger qu'à proximité du viewport.
- `src/components/site/HeroVideo.tsx` — variante de hero avec vidéo en fond (non utilisée actuellement, le `Hero.tsx` actif est la version cinématique 3 slides, voir §14.5).
- `src/components/site/AtelierVideo.tsx` — section "Atelier numérique" : mockups UI animés (scan IA, barre d'estimation, bulles chat) en CSS / Framer Motion.
- `src/components/site/MotionTechnique.tsx` — animations pédagogiques SVG : couches parquet, humidité 8-12%, joints de dilatation, résistance plancher chauffant R≤0,15 m²·K/W.
- `src/components/site/BrandFilm.tsx` — bloc éditorial qui embarque le spot 21 s de marque.
- `src/lib/video-schema.ts` — helper JSON-LD `VideoObject` (SEO).

**Asset** : `public/videos/parqueto-spot.mp4` (21 s, 1920×1080, généré via Remotion, avec vrai logo Parqueto, tagline « Le parquet, sans détour. », CTA `www.parqueto.fr`). **Pas de "depuis 1987"** — claim retiré sur demande utilisateur.

**Intégration home** (`src/routes/index.tsx`) : ajout des sections + injection du JSON-LD `VideoObject` dans le `head()`.

### 14.2 Expériences client & artisan (10h45 → 11h00)

Brief : "le client doit suivre son projet en sérénité", "l'artisan gagne du temps et en rentabilité".

- `src/components/site/ClientExperience.tsx` — éditorial 5/7, 4 bénéfices client. Image `@/assets/experience-client.png`. CTA conditionnel : `/mon-projet` si connecté, sinon `/estimation`.
- `src/components/site/ArtisanExperience.tsx` — éditorial miroir 7/5, 4 bénéfices artisan. Image `@/assets/experience-artisan.png`. Double CTA.

### 14.3 Espace client "Mon projet" (10h55 → 11h00)

Construction d'un vrai dashboard client (avant ça, la promesse "suivi projet" était purement visuelle).

- `src/routes/_authenticated/mon-projet.tsx` — page protégée `/mon-projet` :
  - Header projet (réf, artisan + badge vérifié, barre d'avancement %)
  - **Timeline 7 étapes** : Devis → Acceptation → Visite → Préparation → Pose → Finitions → Réception
  - Carte **Prochain RDV** avec `AddToCalendar`
  - **Galerie photos** (Avant / Pendant / Après)
  - **Documents** (devis, fiches techniques, garanties — PDF mock)
  - Bloc "Vos garanties Parqueto"
- `src/lib/client-project-mock.ts` — types **shape Supabase-ready** : `ClientProject`, `Milestone`, `TimelinePhoto`, `ProjectDocument`, `ProjectEvent`. Branchement futur = remplacer imports mock par `useQuery` sur server fn.
- Raccourci ajouté dans `src/routes/_authenticated/historique.tsx`.

### 14.4 SEO local — pages ville affinées (11h00 → 11h10)

`src/routes/parqueteur.$ville.tsx` — refonte complète du template (les 19+ villes en héritent automatiquement) :

- **JSON-LD** : `LocalBusiness` enrichi (AggregateRating 4.8 / 247 avis, geo, priceRange), `FAQPage` (6 Q/R → rich snippets), `BreadcrumbList`.
- **Contenus long-tail** : tableau tarifs (6 prestations), témoignages par quartier, FAQ accordéon `<details>`, process 4 étapes.
- **UX** : hero éditorial, badges confiance, KPI aside, ancres deep-link (`#tarifs`, `#avis`, `#faq`…), footer "villes couvertes" pour maillage interne.
- Villes ajoutées : Antony, Neuilly, Levallois, Boulogne, Bourg-la-Reine, Plessis-Robinson, Sceaux, Châtenay-Malabry, Fontenay-aux-Roses, Montrouge.

### 14.5 Hero homepage — 3 itérations (12h10 → 13h05)

1. **12h10 — Hero V1** : full-bleed image salon chêne miel (`hero-salon-parquet.jpg`), titre serif + 2ᵉ ligne orange italique, badge "+2 400 projets", liste réassurance.
2. **12h25 — TrustStrip ajoutée** sous le hero : 4 promesses honnêtes (Estimation claire / Artisans vérifiés / Gratuit / Aucun démarchage). **Aucun chiffre inventé**, pas de presse fictive.
3. **12h28 — Doublons supprimés** : les 3 items réassurance du Hero retirés (vivent uniquement dans TrustStrip).
4. **12h45 — Hero V2 cinématique** : 3 slides crossfade (1,8 s fade, 9 s/slide, Ken Burns 1.06→1.0), texte & CTA strictement statiques, `useReducedMotion`, dots minimalistes.
   - Slides : `hero-salon-parquet.jpg` → `hero-haussmann-chevron.jpg` → `hero-artisan-pose.jpg`
5. **13h05 — Slide artisan remplacé** par nouvelle photo (chevron + lumière naturelle latérale). `src/assets/hero-artisan-pose.jpg` est un **PNG renommé `.jpg`** — fonctionne, **ne PAS le ré-encoder**.

Composants : `src/components/site/Hero.tsx`, `src/components/site/TrustStrip.tsx`.

### 14.6 Assistant Parqueto IA — audit & doc (13h15 → 13h25)

- Audit : `AssistantTeaser` (home) + `AssistantExperience` (`/assistant`, 538 lignes) sont des **mocks purs**. Toutes les valeurs viennent de `MOCK_RESULT`. Aucun appel API, aucun upload, animation `setInterval` factice.
- Décision : on **garde l'UI**, l'IA sera branchée plus tard via **Claude direct ou OpenRouter** (au choix).
- Doc complète en **§13** : 3 options (Lovable AI Gateway / Anthropic / OpenRouter), pattern `analyzeParquetPhoto` `createServerFn`, prompt système, schéma JSON identique à `MOCK_RESULT`, contraintes sécurité.

### 14.7 HANDOFF.md

- §13 (assistant IA — état & branchement).
- §14 (ce journal complet).
- §15 + §16 (checklist Claude + snapshot ci-dessous).

---

## 15. Checklist Claude / Codex — par priorité

### 🔴 Backend critique (avant lancement)

- [ ] **Auth Google** : `supabase--configure_social_auth providers: ["google"]` + bouton dans `src/components/auth/AuthShell.tsx`.
- [ ] **Migrations Supabase** pour remplacer les mocks :
  - `leads` (depuis `src/lib/mock-leads.ts` + wizard `/estimation`)
  - `candidatures_confrerie` (`/confrerie-du-parquet/candidater`)
  - `inscriptions_artisans` (`/devenir-artisan/inscription`)
  - `projects`, `project_milestones`, `project_photos`, `project_documents`, `project_events` (depuis `src/lib/client-project-mock.ts`)
  - `admin_*` (depuis `src/lib/admin-mock.ts`)
  - `inbox_messages`, `messaging_*` (depuis `src/lib/inbox-mock.ts`, `src/lib/messaging-mock.ts`)
- [ ] **RLS** sur toutes les tables : `user_roles` + `has_role()` SECURITY DEFINER (cf §8). **Jamais** de colonne `role` sur `profiles`.
- [ ] **Server functions** dans `src/lib/*.functions.ts` :
  - `createLead`, `getLeadsForArtisan`, `acceptLead`
  - `getMyProject`, `getProjectMilestones`, `addProjectPhoto`
  - `submitCandidatureConfrerie`, `submitArtisanInscription`
  - `getAdminKpi`, `getAdminClients`, `getAdminArtisans`…
- [ ] **Storage** bucket `chantier-photos` (RLS par `project_id` / `user_id`).
- [ ] **Email transactionnel** (Resend ou natif Supabase) : confirmation lead, notification artisan, RDV chantier.

### 🟠 Assistant Parqueto IA (cf §13)

- [ ] Choisir provider : Lovable AI (gratuit fin oct. 2025, `gemini-2.5-flash` vision) **OU** Claude direct **OU** OpenRouter.
- [ ] Si Claude/OpenRouter : `secrets--add_secret ANTHROPIC_API_KEY` ou `OPENROUTER_API_KEY`.
- [ ] Créer `src/lib/assistant.functions.ts` avec `analyzeParquetPhoto` (sortie = shape `MOCK_RESULT`, zéro changement UI).
- [ ] Remplacer le `setInterval` factice dans `AssistantExperience.tsx`.
- [ ] Rate-limit IP (5 analyses/h), zéro persistance image.

### 🟡 Paiement & monétisation

- [ ] **Stripe** crédits artisans pour `/pro/offres` (`payments--enable_stripe_payments`). Webhook `/api/public/stripe-webhook` avec vérif HMAC.
- [ ] Table `artisan_credits` + ledger consommation.

### 🟢 Polish & contenu

- [ ] Tests E2E : estimation 10 étapes / signup artisan / accept lead / "Mon projet".
- [ ] Lighthouse mobile ≥ 90 sur `/` et `/estimation`.
- [ ] Vérifier hero cinématique sur Safari iOS (Ken Burns + crossfade Framer Motion).
- [ ] Google Rich Results Test sur pages ville + assistant.
- [ ] `og:image` par ville (actuellement hérité du root).
- [ ] Remplacer témoignages mock des pages ville par de vrais avis.
- [ ] Sitemap dynamique (19+ villes + articles blog).

### 🔵 Qualité code

- [ ] `supabase--linter` après chaque migration.
- [ ] Vérifier `attachSupabaseAuth` toujours présent dans `src/start.ts → functionMiddleware` (OK aujourd'hui).
- [ ] `src/integrations/supabase/types.ts` régénéré après chaque migration (auto).

---

## 16. Snapshot fin de session (22 mai 2026, 14h30)

**Homepage flow actuel** (`src/routes/index.tsx`) :

```
Hero (cinématique 3 slides)
  → TrustStrip (4 promesses)
  → Promise
  → AssistantTeaser (mock)
  → AtelierVideo
  → Process
  → ClientExperience
  → MotionTechnique
  → ArtisansShowcase
  → ArtisanExperience
  → RealisationsTeaser
  → BrandFilm
  → SocialProof
  → Partners
  → FinalCTA
```

**Routes ajoutées aujourd'hui** : `/mon-projet` (auth required).

**Assets ajoutés** :
- `src/assets/hero-salon-parquet.jpg`
- `src/assets/hero-haussmann-chevron.jpg`
- `src/assets/hero-artisan-pose.jpg` (PNG renommé — ne pas ré-encoder)
- `src/assets/experience-client.png`
- `src/assets/experience-artisan.png`
- `public/videos/parqueto-spot.mp4`

Bonne reprise. 🪵

