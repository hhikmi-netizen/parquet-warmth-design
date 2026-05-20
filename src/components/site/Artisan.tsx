import artisan from "@/assets/artisan.jpg";
import { ArrowRight } from "lucide-react";

export function Artisan() {
  return (
    <section id="artisan" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl shadow-warm">
            <img src={artisan} alt="Artisan parqueteur au travail" className="aspect-[4/5] w-full object-cover" width={1200} height={1500} loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Vous êtes artisan ?</p>
            <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
              Rejoignez un réseau qui respecte le métier.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Parqueto met en relation des particuliers sérieux avec des artisans parqueteurs vérifiés.
              Pas de mises aux enchères, pas de course au prix : seulement des projets qualifiés, près de chez vous.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Projets pré-qualifiés avec budget et délai clairs",
                "Aucun abonnement, aucun engagement",
                "Vous gardez la maîtrise de votre devis",
              ].map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="group mt-8 inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90">
              Devenir artisan partenaire
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
