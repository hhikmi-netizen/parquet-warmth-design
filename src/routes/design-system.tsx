import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Coins,
  Eye,
  FileText,
  Hammer,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import {
  PqButton,
  PqSurface,
  PqPill,
  PqField,
  PqTextarea,
  PqSelect,
  PqRadioCard,
  PqCheckCard,
  PqModal,
  PqToast,
  PqUpload,
  PqGauge,
  PqKpi,
  PqTable,
} from "@/components/parqueto";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System V9 — Parqueto" },
      { name: "description", content: "La bibliothèque de composants Parqueto : palette, typographie, boutons, cartes, formulaires, modales, jauges, tableaux." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DesignSystemPage,
});

// ───────── Showcase helpers ─────────
function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-12 sm:py-16">
      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-orange">{kicker}</p>
        <h2 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</h3>;
}

const SWATCHES: { name: string; var: string; hint: string }[] = [
  { name: "Crème", var: "--brand-cream", hint: "Fond principal" },
  { name: "Crème profond", var: "--brand-cream-deep", hint: "Surfaces secondaires" },
  { name: "Encre", var: "--brand-ink", hint: "Texte principal" },
  { name: "Encre douce", var: "--brand-ink-soft", hint: "Texte secondaire" },
  { name: "Orange", var: "--brand-orange", hint: "Action principale" },
  { name: "Orange profond", var: "--brand-orange-deep", hint: "Hover / accents" },
  { name: "Orange voile", var: "--brand-orange-soft", hint: "Surfaces accent" },
  { name: "Succès", var: "--state-success", hint: "Validation" },
  { name: "Attention", var: "--state-warning", hint: "Vigilance" },
  { name: "Erreur", var: "--state-danger", hint: "Bloquant" },
  { name: "Info", var: "--state-info", hint: "Neutre" },
];

const SPACING = [
  { token: "4 / xs", px: 4 },
  { token: "8 / sm", px: 8 },
  { token: "12 / md", px: 12 },
  { token: "16 / base", px: 16 },
  { token: "24 / lg", px: 24 },
  { token: "32 / xl", px: 32 },
  { token: "48 / 2xl", px: 48 },
  { token: "64 / 3xl", px: 64 },
];

const NAV = [
  { id: "fondations", label: "Fondations" },
  { id: "typo", label: "Typographie" },
  { id: "espacements", label: "Espacements" },
  { id: "ombres", label: "Ombres" },
  { id: "boutons", label: "Boutons" },
  { id: "badges", label: "Badges" },
  { id: "cartes", label: "Cartes" },
  { id: "formulaires", label: "Formulaires" },
  { id: "radios", label: "Radios" },
  { id: "uploads", label: "Uploads" },
  { id: "kpi", label: "KPI" },
  { id: "jauges", label: "Jauges" },
  { id: "tableaux", label: "Tableaux" },
  { id: "modales", label: "Modales" },
  { id: "notifications", label: "Notifications" },
  { id: "responsive", label: "Responsive" },
];

function DesignSystemPage() {
  const [modal, setModal] = useState(false);
  const [radio, setRadio] = useState("massif");
  const [checks, setChecks] = useState<string[]>(["photos"]);
  const toggle = (k: string) => setChecks((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-warm">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <PqPill tone="orange" icon={<Sparkles />}>
            Design System · V9
          </PqPill>
          <h1 className="mt-4 font-display text-3xl text-foreground sm:text-5xl">
            La bibliothèque visuelle de <span className="text-brand-orange">Parqueto</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Un langage unique pour la homepage, le wizard, les espaces artisan & admin. Sobre, chaleureux, lisible —
            jamais SaaS futuriste.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <PqButton iconLeft={<Sparkles />}>Voir les composants</PqButton>
            <PqButton variant="secondary" asChild>
              <a href="#fondations">Fondations</a>
            </PqButton>
          </div>
        </div>
      </section>

      {/* Sticky in-page nav */}
      <nav className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[11px] text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Fondations / palette ── */}
        <Section id="fondations" kicker="Couleurs" title="Palette officielle">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SWATCHES.map((s) => (
              <PqSurface key={s.var} padding="sm">
                <div
                  className="h-16 w-full rounded-xl border border-border"
                  style={{ background: `oklch(from var(${s.var}) l c h)` }}
                />
                <p className="mt-3 text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.hint}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{s.var}</p>
              </PqSurface>
            ))}
          </div>
        </Section>

        {/* ── Typographie ── */}
        <Section id="typo" kicker="Typographie" title="Fraunces & Inter">
          <PqSurface padding="lg">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Display · Fraunces</p>
            <p className="mt-2 font-display text-4xl text-foreground sm:text-5xl">Un parquet bien posé, ça change tout.</p>
            <p className="mt-1 font-display text-2xl text-foreground">Sous-titre éditorial · 24px</p>

            <div className="my-6 h-px bg-border" />

            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Sans · Inter</p>
            <p className="mt-2 text-base text-foreground">
              Corps de texte courant. Lisible, calme, sans clinquant. Pensé pour lire vite et comprendre sans effort.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Petit · 14px — accompagnement, métadonnées.</p>
            <p className="mt-2 text-xs text-muted-foreground">Très petit · 12px — pills, étiquettes, légendes.</p>
          </PqSurface>
        </Section>

        {/* ── Espacements ── */}
        <Section id="espacements" kicker="Échelle" title="Espacements">
          <PqSurface padding="lg">
            <ul className="space-y-3">
              {SPACING.map((s) => (
                <li key={s.token} className="flex items-center gap-4">
                  <span className="w-28 font-mono text-[11px] text-muted-foreground">{s.token}</span>
                  <span className="h-2 rounded-full bg-brand-orange" style={{ width: s.px }} />
                  <span className="text-xs text-muted-foreground">{s.px}px</span>
                </li>
              ))}
            </ul>
          </PqSurface>
        </Section>

        {/* ── Ombres ── */}
        <Section id="ombres" kicker="Profondeur" title="Ombres">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "shadow-soft", class: "shadow-soft", hint: "Cartes, panneaux" },
              { name: "shadow-warm", class: "shadow-warm", hint: "Élévation hover, modales" },
              { name: "aucune", class: "", hint: "Surfaces neutres" },
            ].map((s) => (
              <div key={s.name} className={`rounded-2xl border border-border bg-card p-6 ${s.class}`}>
                <p className="font-display text-lg">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Boutons ── */}
        <Section id="boutons" kicker="Actions" title="Boutons">
          <PqSurface padding="lg" className="space-y-6">
            <div>
              <Sub>Variantes</Sub>
              <div className="flex flex-wrap items-center gap-3">
                <PqButton>Action principale</PqButton>
                <PqButton variant="secondary">Secondaire</PqButton>
                <PqButton variant="ghost">Ghost</PqButton>
                <PqButton variant="danger">Annuler le projet</PqButton>
                <PqButton variant="link">Lien discret</PqButton>
              </div>
            </div>
            <div>
              <Sub>Tailles</Sub>
              <div className="flex flex-wrap items-center gap-3">
                <PqButton size="sm">Petit</PqButton>
                <PqButton size="md">Standard</PqButton>
                <PqButton size="lg">Large</PqButton>
                <PqButton size="icon" aria-label="Recherche"><Search /></PqButton>
              </div>
            </div>
            <div>
              <Sub>États</Sub>
              <div className="flex flex-wrap items-center gap-3">
                <PqButton iconLeft={<Sparkles />}>Avec icône</PqButton>
                <PqButton loading>Envoi…</PqButton>
                <PqButton disabled>Désactivé</PqButton>
                <PqButton block iconLeft={<Phone />}>Pleine largeur (mobile)</PqButton>
              </div>
            </div>
          </PqSurface>
        </Section>

        {/* ── Badges ── */}
        <Section id="badges" kicker="Statuts" title="Badges">
          <PqSurface padding="lg">
            <Sub>Tons sémantiques</Sub>
            <div className="flex flex-wrap items-center gap-2">
              <PqPill tone="neutral">Neutre</PqPill>
              <PqPill tone="orange" icon={<Sparkles />}>Recommandé</PqPill>
              <PqPill tone="success" icon={<ShieldCheck />}>Vérifié</PqPill>
              <PqPill tone="warning">À surveiller</PqPill>
              <PqPill tone="danger">Urgent</PqPill>
              <PqPill tone="info">Information</PqPill>
              <PqPill tone="ink">Premium</PqPill>
            </div>
            <div className="mt-4">
              <Sub>Tailles</Sub>
              <div className="flex flex-wrap items-center gap-2">
                <PqPill tone="orange" size="sm">SM</PqPill>
                <PqPill tone="orange" size="md">MD — plus lisible</PqPill>
              </div>
            </div>
          </PqSurface>
        </Section>

        {/* ── Cartes ── */}
        <Section id="cartes" kicker="Surfaces" title="Cartes">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PqSurface>
              <p className="font-display text-base">Card standard</p>
              <p className="mt-1 text-xs text-muted-foreground">Bordure douce, ombre légère.</p>
            </PqSurface>
            <PqSurface tone="raised">
              <p className="font-display text-base">Élevée</p>
              <p className="mt-1 text-xs text-muted-foreground">Pour les contenus mis en avant.</p>
            </PqSurface>
            <PqSurface tone="warm">
              <p className="font-display text-base">Warm</p>
              <p className="mt-1 text-xs text-muted-foreground">Fond crème nuancé.</p>
            </PqSurface>
            <PqSurface tone="outline">
              <p className="font-display text-base">Outline</p>
              <p className="mt-1 text-xs text-muted-foreground">Pour les états vides.</p>
            </PqSurface>
            <PqSurface interactive className="sm:col-span-2">
              <p className="font-display text-base">Carte interactive</p>
              <p className="mt-1 text-xs text-muted-foreground">Hover : lift + bordure orange + ombre warm.</p>
            </PqSurface>
            <PqSurface tone="muted" className="sm:col-span-2">
              <p className="font-display text-base">Muted</p>
              <p className="mt-1 text-xs text-muted-foreground">Pour grouper des éléments sans hiérarchie forte.</p>
            </PqSurface>
          </div>
        </Section>

        {/* ── Formulaires ── */}
        <Section id="formulaires" kicker="Saisie" title="Formulaires & champs">
          <PqSurface padding="lg" className="grid gap-5 sm:grid-cols-2">
            <PqField label="Nom" placeholder="Marie Dupont" required iconLeft={<User />} />
            <PqField label="Email" type="email" placeholder="marie@exemple.fr" iconLeft={<Mail />} hint="Jamais partagé" />
            <PqField label="Téléphone" placeholder="06 12 34 56 78" iconLeft={<Phone />} success="Numéro valide" />
            <PqField label="Code postal" placeholder="75011" error="Code postal invalide" />
            <PqSelect label="Type de projet" required>
              <option>Pose neuve</option>
              <option>Rénovation</option>
              <option>Vitrification</option>
            </PqSelect>
            <PqField label="Champ désactivé" defaultValue="Ne peut pas être modifié" disabled />
            <PqTextarea
              label="Description du projet"
              placeholder="Surface, état actuel, contraintes…"
              className="sm:col-span-2"
              hint="Plus c'est précis, plus le devis sera juste"
            />
          </PqSurface>
        </Section>

        {/* ── Radios / checks ── */}
        <Section id="radios" kicker="Choix" title="Radios & cartes à cocher">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Sub>Radio cards (exclusif)</Sub>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "massif", label: "Parquet massif", desc: "Chêne, hêtre — durable" },
                  { id: "contre", label: "Contrecollé", desc: "Le meilleur rapport qualité/prix" },
                  { id: "strat", label: "Stratifié", desc: "Économique, pose rapide" },
                  { id: "vinyl", label: "Vinyle", desc: "Pièces humides" },
                ].map((o) => (
                  <PqRadioCard
                    key={o.id}
                    label={o.label}
                    description={o.desc}
                    icon={<Hammer />}
                    checked={radio === o.id}
                    onChange={() => setRadio(o.id)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Sub>Check cards (multiple)</Sub>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "photos", label: "Photos en pièce jointe", desc: "On les ajoutera à l'étape suivante" },
                  { id: "urgent", label: "Projet urgent", desc: "Pose souhaitée dans le mois" },
                  { id: "devis", label: "Plusieurs devis", desc: "Comparer 2–3 artisans" },
                  { id: "conseil", label: "Conseil avant achat", desc: "Aide au choix du parquet" },
                ].map((o) => (
                  <PqCheckCard
                    key={o.id}
                    label={o.label}
                    description={o.desc}
                    icon={<FileText />}
                    checked={checks.includes(o.id)}
                    onChange={() => toggle(o.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Uploads ── */}
        <Section id="uploads" kicker="Pièces jointes" title="Uploads">
          <div className="grid gap-4 lg:grid-cols-2">
            <PqUpload
              multiple
              accept="image/*,application/pdf"
              files={[
                { name: "salon-existant.jpg", size: "2,1 Mo" },
                { name: "plan-niveau.pdf", size: "412 Ko" },
              ]}
              onRemove={() => {}}
            />
            <PqUpload label="Aucun fichier pour l'instant" hint="Glissez-déposez ou cliquez" />
          </div>
        </Section>

        {/* ── KPI ── */}
        <Section id="kpi" kicker="Mesures" title="KPI">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <PqKpi label="Demandes" value="424" icon={FileText} trend={{ dir: "up", value: "+18 %" }} hint="14 jours" />
            <PqKpi label="Leads qualifiés" value="187" icon={Users} trend={{ dir: "up", value: "+9 %" }} />
            <PqKpi label="Crédits consommés" value="312" icon={Coins} trend={{ dir: "down", value: "−3 %" }} />
            <PqKpi label="Conversion" value="4,6 %" icon={Eye} trend={{ dir: "up", value: "+0,4 pt" }} />
          </div>
        </Section>

        {/* ── Jauges ── */}
        <Section id="jauges" kicker="Progression" title="Jauges">
          <div className="grid gap-4 sm:grid-cols-2">
            <PqSurface padding="lg" className="space-y-4">
              <PqGauge label="Qualité réseau" value={94} tone="success" hint="Score moyen artisans" />
              <PqGauge label="Conformité documents" value={72} tone="warning" hint="7 artisans à relancer" />
              <PqGauge label="Crédits restants" value={28} tone="danger" hint="Recharge recommandée" />
              <PqGauge label="Trafic vs objectif" value={66} tone="info" />
            </PqSurface>
            <PqSurface padding="lg">
              <p className="font-display text-base">Wizard · étape 3 / 6</p>
              <p className="mt-1 text-xs text-muted-foreground">Pour le tunnel client.</p>
              <div className="mt-4">
                <PqGauge value={50} tone="orange" showValue={false} />
              </div>
            </PqSurface>
          </div>
        </Section>

        {/* ── Tableaux ── */}
        <Section id="tableaux" kicker="Données" title="Tableaux">
          <PqTable
            rowKey={(r) => r.ref}
            columns={[
              { key: "ref", header: "Réf." },
              { key: "client", header: "Client" },
              { key: "ville", header: "Ville" },
              {
                key: "statut",
                header: "Statut",
                render: (r) => (
                  <PqPill tone={r.statut === "Accepté" ? "success" : r.statut === "Expiré" ? "danger" : "warning"}>
                    {r.statut}
                  </PqPill>
                ),
              },
              { key: "date", header: "Reçu", align: "right" },
            ]}
            rows={[
              { ref: "PRQ-1842", client: "Marie L.", ville: "Paris 11", statut: "Nouveau", date: "il y a 2 h" },
              { ref: "PRQ-1841", client: "Julien R.", ville: "Lille", statut: "Accepté", date: "hier" },
              { ref: "PRQ-1840", client: "Sophie M.", ville: "Lyon 3", statut: "Expiré", date: "3 j" },
            ]}
          />
        </Section>

        {/* ── Modales ── */}
        <Section id="modales" kicker="Dialogues" title="Modales">
          <PqSurface padding="lg" className="flex flex-wrap items-center gap-3">
            <PqButton onClick={() => setModal(true)} iconLeft={<Calendar />}>Réserver un créneau</PqButton>
            <p className="text-xs text-muted-foreground">Sur mobile : bottom sheet · sur desktop : centré.</p>
          </PqSurface>
          <PqModal
            open={modal}
            onClose={() => setModal(false)}
            title="Réserver un appel"
            description="15 minutes avec un conseiller Parqueto."
            footer={
              <>
                <PqButton variant="ghost" onClick={() => setModal(false)}>Annuler</PqButton>
                <PqButton onClick={() => setModal(false)}>Confirmer</PqButton>
              </>
            }
          >
            <div className="space-y-4">
              <PqField label="Nom" placeholder="Marie Dupont" iconLeft={<User />} />
              <PqField label="Téléphone" placeholder="06 12 34 56 78" iconLeft={<Phone />} />
              <PqSelect label="Créneau souhaité">
                <option>Demain matin</option>
                <option>Demain après-midi</option>
                <option>Après-demain</option>
              </PqSelect>
            </div>
          </PqModal>
        </Section>

        {/* ── Notifications ── */}
        <Section id="notifications" kicker="Feedback" title="Notifications">
          <div className="grid gap-3 sm:grid-cols-2">
            <PqToast tone="success" title="Devis envoyé" description="Marie recevra une réponse sous 48 h." />
            <PqToast
              tone="warning"
              title="RC Pro expire bientôt"
              description="Renouvelez avant le 30/06."
              action={<PqButton size="sm" variant="secondary">Mettre à jour</PqButton>}
              onDismiss={() => {}}
            />
            <PqToast tone="info" title="Nouveau lead disponible" description="Pose 65 m² · Paris 11" />
            <PqToast tone="danger" title="Crédit insuffisant" description="Rechargez pour accepter ce projet." />
          </div>
        </Section>

        {/* ── Responsive ── */}
        <Section id="responsive" kicker="Règles" title="Responsive mobile-first">
          <PqSurface padding="lg">
            <ul className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
              <li><span className="font-medium">Base ≤ 640px</span><p className="text-xs text-muted-foreground">Une colonne, padding 12–16, listes plutôt que tableaux, CTA pleine largeur.</p></li>
              <li><span className="font-medium">sm ≥ 640px</span><p className="text-xs text-muted-foreground">Grilles 2 cols, headers respirés, pills horizontales.</p></li>
              <li><span className="font-medium">md ≥ 768px</span><p className="text-xs text-muted-foreground">Tableaux complets, side panels, modal centrée.</p></li>
              <li><span className="font-medium">lg ≥ 1024px</span><p className="text-xs text-muted-foreground">Layouts 3 cols, max-width 1280px, sidebar admin déployée.</p></li>
            </ul>
            <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
              Règle d'or : on commence par dessiner l'écran mobile, on étend ensuite. Aucun composant ne doit casser sous 360px.
            </div>
          </PqSurface>
        </Section>

        <div className="h-16" />
      </main>

      <Footer />
    </div>
  );
}
