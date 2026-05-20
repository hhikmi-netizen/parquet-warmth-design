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

---

## 12. Pour une IA qui reprend

Avant de coder **quoi que ce soit** :
1. Lire ce fichier en entier.
2. Visiter `/design-system` — c'est la **source de vérité visuelle**.
3. Vérifier les tokens dans `src/styles.css` avant tout nouveau composant.
4. Chercher si un composant Pq* existe déjà avant d'en créer un nouveau.
5. Respecter la convention mobile-first du §6.
6. Pour toute logique serveur : §7 (server functions, pas Edge Functions).

Bonne intégration. 🪵
