import { Link } from "@tanstack/react-router";
import logo from "@/assets/parqueto-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="Parqueto" className="h-12 w-auto" width={48} height={48} />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Parqueto, l'estimation parquet en ligne et l'accompagnement par un artisan partenaire vérifié. Le parquet, sans détour ni démarchage.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base">Découvrir</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/realisations" className="hover:text-brand-orange">Réalisations</Link></li>
            <li><Link to="/artisans" className="hover:text-brand-orange">Nos artisans</Link></li>
            <li><Link to="/outils" className="hover:text-brand-orange">Outils</Link></li>
            <li><Link to="/blog" className="hover:text-brand-orange">Blog</Link></li>
            <li><Link to="/partenaires" className="hover:text-brand-orange">Partenaires</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Parqueto</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/a-propos" className="hover:text-brand-orange">À propos</Link></li>
            <li><Link to="/devenir-artisan" className="hover:text-brand-orange">Devenir artisan partenaire</Link></li>
            <li><Link to="/contact" className="hover:text-brand-orange">Contact</Link></li>
            <li>contact@parqueto.fr</li>
            <li>Paris · France</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-orange/70" />
              Estimation non contractuelle
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-orange/70" />
              Sans engagement
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand-orange/70" />
              Aucun paiement demandé
            </li>
          </ul>
          <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Parqueto. Tous droits réservés.</p>
            <p>Mentions légales · Confidentialité · CGU</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
