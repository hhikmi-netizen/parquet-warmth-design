import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <img src={logo} alt="Parqueto" className="h-12 w-auto" width={48} height={48} />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Parqueto, l'estimation parquet en ligne et l'accompagnement par un artisan partenaire vérifié. Le parquet, sans détour ni démarchage.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">contact@parqueto.fr · Paris, France</p>
        </div>
        <nav aria-label="Plan du site — Découvrir">
          <h4 className="font-display text-base">Découvrir</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-brand-orange">Accueil</Link></li>
            <li><Link to="/realisations" className="hover:text-brand-orange">Réalisations</Link></li>
            <li><Link to="/artisans" className="hover:text-brand-orange">Nos artisans</Link></li>
            <li><Link to="/outils" className="hover:text-brand-orange">Outils</Link></li>
            <li><Link to="/teintes" className="hover:text-brand-orange">Simulateur de teintes</Link></li>
            <li><Link to="/guide" className="hover:text-brand-orange">Le guide du parquet</Link></li>
            <li><Link to="/blog" className="hover:text-brand-orange">Blog</Link></li>
          </ul>
        </nav>
        <nav aria-label="Plan du site — Parqueto">
          <h4 className="font-display text-base">Parqueto</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/a-propos" className="hover:text-brand-orange">À propos</Link></li>
            <li><Link to="/charte-qualite" className="hover:text-brand-orange">Charte qualité</Link></li>
            <li><Link to="/partenaires" className="hover:text-brand-orange">Partenaires</Link></li>
            <li><Link to="/contact" className="hover:text-brand-orange">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Plan du site — Pros & artisans">
          <h4 className="font-display text-base">Pros & artisans</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/estimation" className="hover:text-brand-orange">Estimer un projet</Link></li>
            <li><Link to="/devenir-artisan" className="hover:text-brand-orange">Devenir artisan partenaire</Link></li>
            <li><Link to="/pro" className="hover:text-brand-orange">Espace Pro</Link></li>
            <li><Link to="/login" className="hover:text-brand-orange">Connexion</Link></li>
            <li><Link to="/signup" className="hover:text-brand-orange">Créer un compte</Link></li>
          </ul>
        </nav>
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
