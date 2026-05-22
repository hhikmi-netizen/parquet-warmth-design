import { Eye, Lock, MessageCircle, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import clientImg from "@/assets/experience-client.png";

const points = [
  {
    icon: Eye,
    title: "Visibilité totale",
    body: "Suivez l'avancement de votre chantier en temps réel, photos à l'appui.",
  },
  {
    icon: Lock,
    title: "Transparence & confiance",
    body: "Devis détaillés, prix justes, documents accessibles à tout moment.",
  },
  {
    icon: MessageCircle,
    title: "Échanges simplifiés",
    body: "Communiquez avec votre artisan, notifications à chaque étape clé.",
  },
  {
    icon: Award,
    title: "Qualité garantie",
    body: "Artisans vérifiés, matériaux sélectionnés, finitions irréprochables.",
  },
];

/**
 * Section client — "Suivez votre projet en toute sérénité"
 * Mise en page éditoriale, sobre. L'illustration porte l'émotion ; le texte
 * reste pédagogique et factuel.
 */
export function ClientExperience() {
  const { user } = useAuth();
  return (
    <section className="relative bg-background py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Côté client
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            Suivez votre projet
            <span className="block italic text-brand-orange">en toute sérénité.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
            Du devis à la réception, vous gardez la main. Une interface claire,
            un interlocuteur unique, et la certitude d'un travail bien fait.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/estimation"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:bg-foreground/90"
            >
              Estimer mon projet
            </Link>
            {user && (
              <Link
                to="/mon-projet"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Suivre mon projet
              </Link>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <figure className="overflow-hidden rounded-2xl border border-border bg-brand-cream/40 shadow-soft">
            <img
              src={clientImg}
              alt="Interface Parqueto — suivi de projet parquet par le client : avancement, photos, messages avec l'artisan"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
