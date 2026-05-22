import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import logo from "@/assets/parqueto-logo.png";

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.3a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.2a2.9 2.9 0 1 0 2 2.7V3h3z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-6.99L4.5 22H1.244l8.02-9.16L1 2h7.02l4.84 6.4L18.244 2zm-1.2 18h1.9L7.05 4H5.05l12 16z" />
    </svg>
  );
}

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
          <div className="mt-5 flex items-center gap-2">
            {[
              { href: "https://instagram.com/parqueto", label: "Instagram", Icon: Instagram },
              { href: "https://linkedin.com/company/parqueto", label: "LinkedIn", Icon: Linkedin },
              { href: "https://tiktok.com/@parqueto", label: "TikTok", Icon: TikTokIcon },
              { href: "https://x.com/parqueto", label: "X", Icon: XIcon },
              { href: "https://facebook.com/parqueto", label: "Facebook", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:-translate-y-0.5 hover:border-brand-orange/50 hover:text-brand-orange"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Plan du site — Découvrir">
          <h4 className="font-display text-base">Découvrir</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-brand-orange">Accueil</Link></li>
            <li><Link to="/realisations" className="hover:text-brand-orange">Réalisations</Link></li>
            <li><Link to="/artisans" className="hover:text-brand-orange">Nos artisans</Link></li>
            <li><Link to="/outils" className="hover:text-brand-orange">Outils</Link></li>
            <li><Link to="/teintes" className="hover:text-brand-orange">Simulateur de teintes</Link></li>
            <li>
              <Link
                to="/guide"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-orange hover:text-brand-orange-deep"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Le guide du parquet
                <span className="ml-1 rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
                  Gratuit
                </span>
              </Link>
            </li>
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
