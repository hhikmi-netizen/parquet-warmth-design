import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Coins,
  CreditCard,
  Download,
  FileText,
  Check,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Lock,
  Calendar,
  RefreshCcw,
  Plus,
  ChevronRight,
  Info,
  Receipt,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Clock,
  Smartphone,
  Building2,
  Mail,
} from "lucide-react";
import { PqButton, PqSurface, PqPill, type PqPillTone } from "@/components/parqueto";

export const Route = createFileRoute("/pro/facturation")({
  component: FacturationPage,
});

type TabKey = "apercu" | "abonnement" | "credits" | "factures" | "moyens" | "activite";

const TABS: { key: TabKey; label: string }[] = [
  { key: "apercu", label: "Aperçu" },
  { key: "abonnement", label: "Abonnement" },
  { key: "credits", label: "Crédits" },
  { key: "factures", label: "Factures" },
  { key: "moyens", label: "Moyens de paiement" },
  { key: "activite", label: "Activité" },
];

function FacturationPage() {
  const [tab, setTab] = useState<TabKey>("apercu");

  return (
    <div className="min-h-screen bg-brand-cream/40 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/pro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Mon espace
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm">
            <Coins className="h-4 w-4 text-brand-orange" />
            <span className="font-semibold">8</span>
            <span className="hidden text-muted-foreground sm:inline">crédits</span>
          </div>
        </div>

        {/* Tabs — horizontal scroll mobile */}
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex min-w-max gap-1 border-t border-transparent">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition ${
                  tab === t.key
                    ? "text-brand-ink"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-orange" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Page title */}
        <div className="mb-8">
          <PqPill tone="orange" className="mb-3">
            <Sparkles className="h-3 w-3" /> Espace facturation
          </PqPill>
          <h1 className="font-serif text-3xl text-brand-ink sm:text-4xl">
            Facturation & paiements
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Tout votre suivi financier au même endroit. Transparent, sans
            engagement, sans pièges.
          </p>
        </div>

        {tab === "apercu" && <ApercuTab onGo={setTab} />}
        {tab === "abonnement" && <AbonnementTab />}
        {tab === "credits" && <CreditsTab />}
        {tab === "factures" && <FacturesTab />}
        {tab === "moyens" && <MoyensTab />}
        {tab === "activite" && <ActiviteTab />}
      </main>
    </div>
  );
}

/* ───────────────────────── APERÇU ───────────────────────── */

function ApercuTab({ onGo }: { onGo: (t: TabKey) => void }) {
  return (
    <div className="space-y-6">
      {/* Alert — crédits faibles */}
      <ReassuranceBanner
        tone="warning"
        title="Plus que 8 crédits"
        message="Pensez à recharger pour ne pas manquer vos prochains projets."
        cta={{ label: "Recharger", onClick: () => onGo("credits") }}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={<Coins className="h-5 w-5 text-brand-orange" />}
          label="Crédits disponibles"
          value="8"
          hint="≈ 8 projets clients"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-brand-orange" />}
          label="Prochain renouvellement"
          value="—"
          hint="Aucun abonnement actif"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-brand-orange" />}
          label="Dépensé ce mois"
          value="199 €"
          hint="1 recharge · 0 abonnement"
        />
      </div>

      <PqSurface className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Recharger maintenant</div>
            <div className="mt-1 font-serif text-2xl text-brand-ink">
              Pack 50 crédits · 199 €
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Soit 3,98 € le projet client qualifié.
            </div>
          </div>
          <Link
            to="/pro/offres"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-orange-deep"
          >
            <Plus className="h-4 w-4" />
            Choisir un pack
          </Link>
        </div>
      </PqSurface>

      <div className="grid gap-5 sm:grid-cols-2">
        <ShortcutCard
          icon={<FileText className="h-5 w-5" />}
          title="Mes factures"
          desc="Téléchargez vos reçus PDF en un clic"
          onClick={() => onGo("factures")}
        />
        <ShortcutCard
          icon={<CreditCard className="h-5 w-5" />}
          title="Moyens de paiement"
          desc="Carte, Apple Pay, Google Pay"
          onClick={() => onGo("moyens")}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── ABONNEMENT ───────────────────────── */

function AbonnementTab() {
  return (
    <div className="space-y-6">
      <PqSurface className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <PqPill tone="neutral">Formule actuelle</PqPill>
            <div className="font-serif text-3xl text-brand-ink">À la carte</div>
            <p className="max-w-md text-sm text-muted-foreground">
              Vous payez uniquement les crédits dont vous avez besoin. Aucun
              abonnement, aucun engagement, vos crédits ne périment jamais.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <PqPill tone="success">
                <CheckCircle2 className="h-3 w-3" /> Actif
              </PqPill>
              <PqPill tone="neutral">Sans renouvellement</PqPill>
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-4xl text-brand-ink">0 €</div>
            <div className="text-xs text-muted-foreground">par mois</div>
          </div>
        </div>
      </PqSurface>

      <div>
        <h2 className="mb-4 font-serif text-xl text-brand-ink">
          Passer à un forfait mensuel
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            name="Artisan"
            price={49}
            credits={15}
            features={["15 crédits / mois", "Crédits non-utilisés reportés", "Support email"]}
          />
          <PlanCard
            name="Atelier"
            price={129}
            credits={50}
            features={["50 crédits / mois", "Badge profil prioritaire", "Support sous 24 h"]}
            highlight
            badge="Recommandé"
          />
          <PlanCard
            name="Studio"
            price={299}
            credits={150}
            features={["150 crédits / mois", "Mise en avant régionale", "Accompagnement dédié"]}
          />
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          Sans engagement · résiliable à tout moment · 100 % transparent
        </p>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  credits,
  features,
  highlight,
  badge,
}: {
  name: string;
  price: number;
  credits: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 p-6 ${
        highlight
          ? "border-brand-orange bg-background shadow-warm"
          : "border-border bg-background"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <PqPill tone="orange">
            <Sparkles className="h-3 w-3" /> {badge}
          </PqPill>
        </div>
      )}
      <div className="font-serif text-xl text-brand-ink">{name}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-4xl text-brand-ink">{price}€</span>
        <span className="text-sm text-muted-foreground">/ mois</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Inclut {credits} crédits chantier
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => toast.info("Maquette — abonnement bientôt disponible")}
        className={`mt-6 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition ${
          highlight
            ? "bg-brand-orange text-white hover:bg-brand-orange-deep"
            : "bg-muted text-foreground hover:bg-brand-orange/10"
        }`}
      >
        Choisir cette formule
      </button>
    </div>
  );
}

/* ───────────────────────── CRÉDITS ───────────────────────── */

const CREDIT_HISTORY: {
  date: string;
  label: string;
  ref?: string;
  delta: number;
  type: "use" | "refund" | "topup" | "bonus";
}[] = [
  { date: "Aujourd'hui", label: "Acceptation projet · M. Dupont", ref: "PRJ-A1B2C3D4", delta: -1, type: "use" },
  { date: "Hier", label: "Remboursement · client injoignable", ref: "PRJ-7XYZ889A", delta: +1, type: "refund" },
  { date: "12 mai 2026", label: "Recharge Pack Pro", ref: "FAC-2026-0042", delta: +50, type: "topup" },
  { date: "10 mai 2026", label: "Acceptation projet · Mme Bernard", ref: "PRJ-6F0E11AB", delta: -1, type: "use" },
  { date: "02 avr. 2026", label: "Bonus de bienvenue", delta: +3, type: "bonus" },
];

function CreditsTab() {
  return (
    <div className="space-y-6">
      <PqSurface className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand-cream to-background p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Solde disponible
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-6xl text-brand-ink">8</span>
                <span className="text-lg text-muted-foreground">crédits</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Vos crédits ne périment jamais.
              </div>
            </div>
            <Link
              to="/pro/offres"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white shadow-warm transition hover:bg-brand-orange-deep"
            >
              <Plus className="h-4 w-4" />
              Recharger
            </Link>
          </div>
        </div>
      </PqSurface>

      {/* Quick recharge */}
      <div>
        <h2 className="mb-3 font-serif text-xl text-brand-ink">
          Recharge rapide
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { c: 10, p: 49 },
            { c: 50, p: 199 },
            { c: 150, p: 499 },
          ].map((p) => (
            <button
              key={p.c}
              type="button"
              onClick={() =>
                toast.success(`Maquette — pack ${p.c} crédits · ${p.p}€`)
              }
              className="rounded-2xl border border-border bg-background p-4 text-left transition hover:border-brand-orange hover:shadow-warm"
            >
              <div className="flex items-center gap-2 text-brand-orange">
                <Coins className="h-4 w-4" />
                <span className="font-serif text-lg text-brand-ink">
                  {p.c} crédits
                </span>
              </div>
              <div className="mt-1 font-serif text-2xl text-brand-ink">
                {p.p} €
              </div>
              <div className="text-xs text-muted-foreground">
                Soit {(p.p / p.c).toFixed(2).replace(".", ",")} € / projet
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="mb-3 font-serif text-xl text-brand-ink">
          Historique des crédits
        </h2>
        <PqSurface className="divide-y divide-border overflow-hidden p-0">
          {CREDIT_HISTORY.map((h, i) => {
            const positive = h.delta > 0;
            const toneByType: Record<typeof h.type, PqPillTone> = {
              use: "neutral",
              refund: "info",
              topup: "success",
              bonus: "orange",
            };
            const labelByType: Record<typeof h.type, string> = {
              use: "Utilisation",
              refund: "Remboursement",
              topup: "Recharge",
              bonus: "Cadeau",
            };
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">
                    {h.label}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{h.date}</span>
                    {h.ref && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{h.ref}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <PqPill tone={toneByType[h.type]}>{labelByType[h.type]}</PqPill>
                  <span
                    className={`font-serif text-lg ${
                      positive ? "text-emerald-700" : "text-brand-ink"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {h.delta}
                  </span>
                </div>
              </div>
            );
          })}
        </PqSurface>
      </div>

      <ReassuranceBanner
        tone="info"
        title="Client injoignable ? Crédit remboursé."
        message="Sous 5 jours après l'acceptation, signalez-nous un client injoignable : nous recréditons automatiquement votre compte."
      />
    </div>
  );
}

/* ───────────────────────── FACTURES ───────────────────────── */

const INVOICES = [
  { ref: "FAC-2026-0042", date: "12 mai 2026", label: "Pack Pro · 50 crédits", amount: 199, status: "paid" as const },
  { ref: "FAC-2026-0031", date: "28 avr. 2026", label: "Pack Starter · 10 crédits", amount: 49, status: "paid" as const },
  { ref: "FAC-2026-0014", date: "02 avr. 2026", label: "Bonus bienvenue", amount: 0, status: "free" as const },
];

function FacturesTab() {
  return (
    <div className="space-y-6">
      <PqSurface className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-serif text-lg text-brand-ink">
              Vos factures et reçus
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Téléchargeables en PDF · envoyés aussi par email
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.success("Maquette — export comptable à venir")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Tout exporter
          </button>
        </div>
      </PqSurface>

      <PqSurface className="divide-y divide-border overflow-hidden p-0">
        {INVOICES.map((inv) => (
          <div
            key={inv.ref}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-cream">
                <FileText className="h-5 w-5 text-brand-orange" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    {inv.label}
                  </span>
                  <PqPill tone={inv.status === "paid" ? "success" : "neutral"}>
                    {inv.status === "paid" ? "Payée" : "Offert"}
                  </PqPill>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="font-mono">{inv.ref}</span>
                  <span>·</span>
                  <span>{inv.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="font-serif text-xl text-brand-ink">
                {inv.amount === 0 ? "—" : `${inv.amount} €`}
              </span>
              <button
                type="button"
                onClick={() => toast.success(`Téléchargement ${inv.ref} (mock)`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </PqSurface>

      <div className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 text-brand-orange" />
          <div>
            <div className="font-semibold text-foreground">
              Email de facturation
            </div>
            <div className="text-sm text-muted-foreground">
              Vos factures sont envoyées à{" "}
              <span className="font-medium text-foreground">
                contact@atelier-dubois.fr
              </span>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Maquette — édition email à venir")}
              className="mt-2 text-sm font-medium text-brand-orange-deep hover:underline"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── MOYENS DE PAIEMENT ───────────────────────── */

function MoyensTab() {
  return (
    <div className="space-y-6">
      <PqSurface className="p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-cream">
            <CreditCard className="h-6 w-6 text-brand-orange" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-lg text-brand-ink">
                Visa •••• 4242
              </span>
              <PqPill tone="success">Par défaut</PqPill>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Expire 04 / 2028 · ajoutée le 12 mai 2026
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Maquette — édition à venir")}
            className="text-sm font-medium text-brand-orange-deep hover:underline"
          >
            Modifier
          </button>
        </div>
      </PqSurface>

      <div>
        <h2 className="mb-3 font-serif text-xl text-brand-ink">
          Ajouter un moyen de paiement
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PaymentOption
            icon={<CreditCard className="h-5 w-5" />}
            title="Carte bancaire"
            desc="Visa, Mastercard, CB"
            available
          />
          <PaymentOption
            icon={<Smartphone className="h-5 w-5" />}
            title="Apple Pay"
            desc="Paiement en un toucher"
            available
          />
          <PaymentOption
            icon={<Smartphone className="h-5 w-5" />}
            title="Google Pay"
            desc="Paiement rapide Android"
            available
          />
          <PaymentOption
            icon={<Building2 className="h-5 w-5" />}
            title="Prélèvement SEPA"
            desc="Bientôt disponible"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-brand-cream/60 p-4 text-sm text-muted-foreground">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
        <span>
          Paiements sécurisés par <strong className="text-foreground">Stripe</strong>{" "}
          (certifié PCI-DSS). Vos données bancaires ne transitent jamais par
          nos serveurs.
        </span>
      </div>
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  desc,
  available,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  available?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => toast.success(`Maquette — ajout ${title}`)}
      className={`flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 text-left transition ${
        available
          ? "hover:border-brand-orange hover:shadow-warm"
          : "cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-cream text-brand-orange">
          {icon}
        </div>
        <div>
          <div className="font-medium text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      {available ? (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      ) : (
        <PqPill tone="neutral">Bientôt</PqPill>
      )}
    </button>
  );
}

/* ───────────────────────── ACTIVITÉ ───────────────────────── */

type ActivityType = "topup" | "use" | "refund" | "failed" | "subscription";

const ACTIVITY: {
  date: string;
  label: string;
  amount?: number;
  delta?: number;
  type: ActivityType;
}[] = [
  { date: "12 mai 2026", label: "Recharge Pack Pro", amount: 199, type: "topup" },
  { date: "10 mai 2026", label: "Projet accepté · Mme Bernard", delta: -1, type: "use" },
  { date: "05 mai 2026", label: "Remboursement projet · client injoignable", delta: +1, type: "refund" },
  { date: "28 avr. 2026", label: "Recharge Pack Starter", amount: 49, type: "topup" },
  { date: "20 avr. 2026", label: "Paiement refusé · Visa •••• 0009", amount: 49, type: "failed" },
  { date: "02 avr. 2026", label: "Bienvenue · 3 crédits offerts", delta: +3, type: "refund" },
];

const ACT_META: Record<
  ActivityType,
  { tone: PqPillTone; label: string; icon: React.ReactNode }
> = {
  topup: { tone: "success", label: "Recharge", icon: <Plus className="h-3 w-3" /> },
  use: { tone: "neutral", label: "Utilisation", icon: <Coins className="h-3 w-3" /> },
  refund: { tone: "info", label: "Remboursement", icon: <RefreshCcw className="h-3 w-3" /> },
  failed: { tone: "danger", label: "Échec paiement", icon: <XCircle className="h-3 w-3" /> },
  subscription: { tone: "orange", label: "Abonnement", icon: <Receipt className="h-3 w-3" /> },
};

function ActiviteTab() {
  const [filter, setFilter] = useState<"tous" | ActivityType>("tous");
  const items =
    filter === "tous" ? ACTIVITY : ACTIVITY.filter((a) => a.type === filter);

  return (
    <div className="space-y-6">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2">
          {(["tous", "topup", "use", "refund", "failed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange-deep"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "tous" ? "Tout" : ACT_META[f].label}
            </button>
          ))}
        </div>
      </div>

      <PqSurface className="divide-y divide-border overflow-hidden p-0">
        {items.map((a, i) => {
          const meta = ACT_META[a.type];
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-4 sm:px-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-orange">
                  {meta.icon}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">
                    {a.label}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{a.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <PqPill tone={meta.tone}>{meta.label}</PqPill>
                <span
                  className={`font-serif text-base ${
                    a.type === "failed"
                      ? "text-red-600 line-through"
                      : a.delta && a.delta > 0
                      ? "text-emerald-700"
                      : "text-brand-ink"
                  }`}
                >
                  {a.amount !== undefined
                    ? `${a.amount} €`
                    : `${a.delta && a.delta > 0 ? "+" : ""}${a.delta} cr.`}
                </span>
              </div>
            </div>
          );
        })}
      </PqSurface>
    </div>
  );
}

/* ───────────────────────── PRIMITIVES ───────────────────────── */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <PqSurface className="p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-serif text-3xl text-brand-ink">{value}</div>
      {hint && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
    </PqSurface>
  );
}

function ShortcutCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-border bg-background p-5 text-left transition hover:border-brand-orange hover:shadow-warm"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-cream text-brand-orange">
          {icon}
        </div>
        <div>
          <div className="font-serif text-lg text-brand-ink">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:text-brand-orange" />
    </button>
  );
}

function ReassuranceBanner({
  tone,
  title,
  message,
  cta,
}: {
  tone: "info" | "warning" | "success" | "danger";
  title: string;
  message: string;
  cta?: { label: string; onClick: () => void };
}) {
  const styles: Record<typeof tone, { bg: string; border: string; icon: React.ReactNode }> = {
    info: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      icon: <Info className="h-5 w-5 text-sky-600" />,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
  };
  const s = styles[tone];
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border ${s.border} ${s.bg} p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex items-start gap-3">
        {s.icon}
        <div>
          <div className="font-semibold text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">{message}</div>
        </div>
      </div>
      {cta && (
        <PqButton variant="secondary" onClick={cta.onClick} className="w-full sm:w-auto">
          {cta.label}
        </PqButton>
      )}
    </div>
  );
}
