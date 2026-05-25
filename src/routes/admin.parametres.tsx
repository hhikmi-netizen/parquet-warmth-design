import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Panel, Pill } from "@/components/admin/atoms";
import { MapPin, Coins, AlertTriangle, Mail, Handshake, Home } from "lucide-react";

export const Route = createFileRoute("/admin/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ParametresPage,
});

function ParametresPage() {
  return (
    <AdminShell title="Paramètres" subtitle="Zones, tarifs, seuils, emails et contenus de la homepage.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Zones couvertes" description="Départements actifs pour le matching.">
          <div className="flex flex-wrap gap-1.5">
            {["75", "77", "78", "91", "92", "93", "94", "95", "59", "62", "69", "01", "13", "33", "31", "44"].map((z) => (
              <Pill key={z} tone="orange">
                <MapPin className="h-3 w-3" /> {z}
              </Pill>
            ))}
            <button className="rounded-full border border-dashed border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange">
              + Ajouter
            </button>
          </div>
        </Panel>

        <Panel title="Tarifs abonnement & leads" description="Modèle économique artisan.">
          <ul className="space-y-2 text-sm">
            <Row icon={Coins} label="Abonnement mensuel" value="59 €/mois" />
            <Row icon={Coins} label="Abonnement annuel (-17%)" value="49 €/mois · 588 €/an" />
            <Row icon={Coins} label="Essai gratuit" value="14 jours" />
            <Row icon={Coins} label="Lead Standard (< 3 000 €)" value="49 € TTC" />
            <Row icon={Coins} label="Lead Qualifié (3–8 000 €)" value="89 € TTC" />
            <Row icon={Coins} label="Lead Premium (> 8 000 €)" value="189 € TTC" />
          </ul>
        </Panel>

        <Panel title="Seuils d'alerte" description="Quand déclencher une notification.">
          <ul className="space-y-2 text-sm">
            <Row icon={AlertTriangle} label="RC Pro expire dans" value="30 jours" />
            <Row icon={AlertTriangle} label="Lead sans réponse" value="5 jours" />
            <Row icon={AlertTriangle} label="Artisan sans activité" value="30 jours" />
            <Row icon={AlertTriangle} label="Abonnement past_due" value="Notif. immédiate" />
          </ul>
        </Panel>

        <Panel title="Emails système" description="Adresses de notification.">
          <ul className="space-y-2 text-sm">
            <Row icon={Mail} label="Contact public" value="contact@parqueto.fr" />
            <Row icon={Mail} label="Support" value="support@parqueto.fr" />
            <Row icon={Mail} label="Alertes admin" value="alertes@parqueto.fr" />
          </ul>
        </Panel>

        <Panel title="Modèles de notifications" description="Wording envoyé automatiquement.">
          <ul className="space-y-2 text-sm">
            <Row label="Confirmation client" value="Personnalisé" />
            <Row label="Nouveau lead artisan" value="Personnalisé" />
            <Row label="Relance RC Pro" value="Par défaut" />
            <Row label="Remboursement lead" value="Par défaut" />
          </ul>
        </Panel>

        <Panel title="Partenaires" description="Marques mises en avant côté public.">
          <ul className="space-y-2 text-sm">
            <Row icon={Handshake} label="Blanchon" value="Visible" />
            <Row icon={Handshake} label="Repex Floor" value="Visible" />
            <Row icon={Handshake} label="Antony Parquet" value="Visible" />
            <Row icon={Handshake} label="Daniel's" value="Masqué" />
          </ul>
        </Panel>

        <Panel className="lg:col-span-2" title="Contenus homepage" description="Modifications rapides du site public.">
          <ul className="space-y-2 text-sm">
            <Row icon={Home} label="Titre hero" value="Votre parquet, fait par les bons artisans." />
            <Row icon={Home} label="Promesse" value="Estimation claire, artisan vérifié, sans démarchage." />
            <Row icon={Home} label="CTA principal" value="Estimer mon projet" />
          </ul>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Row({ icon: Icon, label, value }: { icon?: typeof MapPin; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-brand-orange" />}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </li>
  );
}
