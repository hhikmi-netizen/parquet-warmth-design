import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GUIDE_COVER, GUIDE_META } from "@/lib/guide-content";

export const Route = createFileRoute("/guide/merci")({
  component: GuideThankYou,
  head: () => ({
    meta: [
      { title: "Merci ! Votre guide est en route · Parqueto" },
      {
        name: "description",
        content:
          "Votre Guide Ultime du Parquet est en cours de téléchargement. Allez plus loin : estimation gratuite, rappel artisan, conseils complémentaires.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Merci ! Votre guide parquet est prêt · Parqueto" },
      { property: "og:image", content: GUIDE_COVER },
    ],
  }),
});

const SHARE_URL = "https://parqueto.fr/guide-parquet";
const SHARE_TEXT =
  "Je viens de recevoir Le Guide Ultime du Parquet par Parqueto — choisir, poser, entretenir. Gratuit :";

function GuideThankYou() {
  const [name, setName] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("parqueto-guide-lead");
      if (raw) {
        const lead = JSON.parse(raw);
        if (typeof lead.name === "string") setName(lead.name);
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background text-foreground focus:outline-none"
    >
      <Header />

      {/* HERO MERCI */}
      <section className="border-b border-border bg-gradient-warm">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-state-success-surface text-state-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Téléchargement lancé
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-balance sm:text-5xl">
            Merci{name ? `, ${name}` : ""} !<br />
            <span className="italic text-brand-orange">Votre guide est à vous.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Le PDF a démarré dans votre navigateur. Vous recevez aussi un email de
            confirmation depuis <strong>guide@parqueto.fr</strong> — pensez à vérifier
            vos courriers indésirables si besoin.
          </p>
        </div>
      </section>

      {/* UPSELL — Aller plus loin */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Aller plus loin
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Maintenant que vous savez, passons à l'action
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Le guide vous donne la théorie. Pour votre projet précis, nos artisans
            sont à votre disposition — gratuitement.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <UpsellCard
              icon={<Sparkles className="h-5 w-5" />}
              kicker="2 minutes"
              title="Estimation gratuite"
              text="Recevez une fourchette de prix réaliste pour votre m², pose comprise."
              cta="Estimer mon projet"
              to="/estimation"
              primary
            />
            <UpsellCard
              icon={<Phone className="h-5 w-5" />}
              kicker="Sans engagement"
              title="Conseil d'un artisan"
              text="Un expert Parqueto vous rappelle pour répondre à vos questions techniques."
              cta="01 84 60 60 61"
              href="tel:+33184606061"
            />
            <UpsellCard
              icon={<MessageCircle className="h-5 w-5" />}
              kicker="Réponse < 24h"
              title="Demande personnalisée"
              text="Décrivez votre cas (essence, surface, état) — on vous oriente précisément."
              cta="Nous écrire"
              to="/contact"
            />
          </div>
        </div>
      </section>

      {/* CONSEILS COMPLEMENTAIRES */}
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            En complément du guide
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Trois lectures qui vont vous servir
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ResourceLink
              to="/blog/$slug"
              params={{ slug: "choisir-parquet-massif-contrecolle" }}
              kicker="Choix"
              title="Massif ou contrecollé&nbsp;?"
              text="La grille de décision claire pour ne pas se tromper."
            />
            <ResourceLink
              to="/blog/$slug"
              params={{ slug: "entretien-parquet-quotidien-erreurs" }}
              kicker="Entretien"
              title="Les erreurs d'entretien à éviter"
              text="La routine simple validée par nos artisans."
            />
            <ResourceLink
              to="/blog/$slug"
              params={{ slug: "renover-parquet-ancien-sans-le-denaturer" }}
              kicker="Rénovation"
              title="Rénover sans dénaturer"
              text="Quand le ponçage suffit, quand il faut tout refaire."
            />
          </div>
        </div>
      </section>

      {/* PARTAGE */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Partagez le guide
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Un proche a un projet parquet&nbsp;?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Le guide est gratuit, sans pub. Un partage et vous lui faites gagner des
            heures de recherche.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ShareBtn
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`}
              icon={<Facebook className="h-4 w-4" />}
              label="Facebook"
            />
            <ShareBtn
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
              icon={<Linkedin className="h-4 w-4" />}
              label="LinkedIn"
            />
            <ShareBtn
              href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`}
              icon={<MessageCircle className="h-4 w-4" />}
              label="WhatsApp"
            />
            <ShareBtn
              href={`mailto:?subject=${encodeURIComponent("Le Guide Ultime du Parquet (gratuit)")}&body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`}
              icon={<Mail className="h-4 w-4" />}
              label="Email"
            />
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>
          </div>
        </div>
      </section>

      {/* RETOUR GUIDE */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-accent"
          >
            Reprendre la lecture en ligne <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            {GUIDE_META.signature}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function UpsellCard({
  icon,
  kicker,
  title,
  text,
  cta,
  to,
  href,
  primary,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  text: string;
  cta: string;
  to?: string;
  href?: string;
  primary?: boolean;
}) {
  const ctaCls = primary
    ? "mt-5 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep"
    : "mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-accent";

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
        {icon}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
        {kicker}
      </p>
      <h3 className="mt-1 font-display text-xl text-brand-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      {to ? (
        <Link to={to} className={ctaCls}>
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <a href={href} className={ctaCls}>
          {cta} <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function ResourceLink({
  to,
  kicker,
  title,
  text,
}: {
  to: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-brand-orange/40 hover:bg-brand-orange/5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
        {kicker}
      </p>
      <h3 className="mt-2 font-display text-lg text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange-deep">
        Lire l'article <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function ShareBtn({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
    >
      {icon}
      {label}
    </a>
  );
}
