import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Users, Sparkles, Copy, Check, ArrowRight, Heart } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/parrainage")({
  head: () => ({
    meta: [
      { title: "Parrainage Parqueto — 50 € offerts à chaque client recommandé" },
      {
        name: "description",
        content:
          "Recommandez Parqueto à vos proches : 50 € de remise pour eux sur leur prochain entretien parquet, 50 € de cagnotte pour vous. Sans limite.",
      },
      { property: "og:title", content: "Programme de parrainage Parqueto" },
      { property: "og:description", content: "50 € pour votre filleul, 50 € pour vous, à chaque parrainage." },
      { property: "og:url", content: "/parrainage" },
    ],
    links: [{ rel: "canonical", href: "/parrainage" }],
  }),
  component: ParrainagePage,
});

// TODO (Claude) : remplacer par lecture côté serveur
//   - GET /parrainage : code unique de l'utilisateur connecté
//   - POST /parrainage/envoyer : crée invitation + envoie email
//   - Tables : referrals (parrain_id, code, filleul_email, status, reward_credited_at)
const MOCK_CODE = "PARQ-LEA-92A1";

function ParrainagePage() {
  const [copied, setCopied] = useState(false);
  const [filleuls, setFilleuls] = useState<{ email: string; status: string }[]>([
    { email: "marc.b@…", status: "Inscrit · devis en cours" },
    { email: "celine.d@…", status: "Chantier signé · 50 € crédités 🎉" },
  ]);
  const [email, setEmail] = useState("");
  const url = `https://parqueto.fr/?ref=${MOCK_CODE}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-orange/8 to-transparent py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
              <Heart className="h-3.5 w-3.5" /> Programme parrainage
            </p>
            <h1 className="mt-6 font-display text-5xl tracking-tight text-foreground sm:text-6xl">
              Parrainez. <span className="italic text-brand-orange">Gagnez 50 €.</span>
              <br />
              Encore et encore.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Vous recommandez Parqueto à un proche ? Il bénéficie de <strong>50 € de remise</strong> sur
              son prochain ponçage ou pose, et vous recevez <strong>50 € de cagnotte</strong> dès que son
              chantier est signé. Sans plafond, sans bla-bla.
            </p>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center font-display text-3xl text-foreground">Comment ça marche</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { icon: Sparkles, title: "1. Récupérez votre code", body: "Connectez-vous, votre code unique est généré automatiquement." },
                { icon: Users, title: "2. Partagez-le", body: "Par SMS, email ou WhatsApp. Votre filleul l'utilise à l'estimation." },
                { icon: Gift, title: "3. Encaissez 50 €", body: "Dès que son chantier est signé avec un artisan partenaire." },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mon code */}
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg text-foreground">Votre code de parrainage</h3>
              <p className="mt-1 text-sm text-muted-foreground">À partager autour de vous.</p>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex-1 rounded-full border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 text-center font-mono text-base font-semibold text-brand-orange">
                  {MOCK_CODE}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copié" : "Copier le lien"}
                </button>
              </div>
              <p className="mt-3 break-all text-xs text-muted-foreground">{url}</p>
            </div>

            <form
              className="rounded-2xl border border-border bg-card p-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return;
                // TODO Claude : POST /parrainage/envoyer
                setFilleuls((prev) => [{ email, status: "Invitation envoyée" }, ...prev]);
                setEmail("");
              }}
            >
              <h3 className="font-display text-lg text-foreground">Inviter directement</h3>
              <p className="mt-1 text-sm text-muted-foreground">On envoie un email d'invitation personnalisé.</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="email du filleul"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-orange/60"
                />
                <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep">
                  Envoyer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Tableau filleuls */}
          <div className="mx-auto mt-8 max-w-5xl px-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg text-foreground">Vos filleuls</h3>
              <ul className="mt-4 divide-y divide-border">
                {filleuls.map((f, i) => (
                  <li key={i} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-foreground">{f.email}</span>
                    <span className="text-muted-foreground">{f.status}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Cagnotte totale créditée : <strong className="text-brand-orange">50 €</strong> · prochain palier à 200 €
              </p>
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 text-sm text-muted-foreground">
            <h2 className="font-display text-2xl text-foreground">Conditions</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Le bonus de 50 € est crédité dès la signature du devis par votre filleul avec un artisan partenaire Parqueto.</li>
              <li>La cagnotte est utilisable sur votre prochain entretien parquet, ou reversée par virement à partir de 100 €.</li>
              <li>Programme réservé aux particuliers, sans limite de filleuls.</li>
              <li>Parqueto se réserve le droit de modifier les conditions avec un préavis de 30 jours.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/estimation" className="inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep">
                Faire une estimation
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-brand-orange/40 hover:text-brand-orange">
                Une question ? Contactez-nous
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
