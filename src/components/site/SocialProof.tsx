import { Clock, BadgeCheck, Gift, PhoneOff, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

const promises = [
  { icon: Clock, title: "Estimation claire et rapide", body: "Décrivez votre projet en 3 minutes. Fourchette de prix immédiate, sans démarchage." },
  { icon: BadgeCheck, title: "Artisans partenaires vérifiés", body: "Décennale, SIRET et RC Pro contrôlés chaque année. Vous recevez les justificatifs avant le devis." },
  { icon: ShieldCheck, title: "Devis détaillé et comparable", body: "Pas de chiffre d'accroche : chaque poste est détaillé (main d'œuvre, matériaux, finition)." },
  { icon: PhoneOff, title: "Aucun démarchage téléphonique", body: "Un seul artisan vous recontacte. Pas de relance, pas de vente agressive, pas de spam." },
];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Nos engagements
          </p>
          <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
            Des projets cadrés, <span className="italic text-brand-orange">des clients sereins.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Parqueto ne promet pas des chiffres d'audience. Nous promettons un parcours clair,
            un artisan vérifié et un devis honnête. Découvrez notre{" "}
            <Link to="/charte-qualite" className="font-medium text-brand-orange hover:underline">
              charte qualité
            </Link>
            .
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <article
              key={p.title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

