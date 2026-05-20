import logo from "@/assets/parqueto-logo.png";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="Parqueto" className="h-12 w-auto" width={48} height={48} />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Parqueto, l'estimation parquet en ligne et la mise en relation avec des artisans vérifiés. Le parquet, sans détour.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#process" className="hover:text-brand-orange">Comment ça marche</a></li>
            <li><a href="#realisations" className="hover:text-brand-orange">Réalisations</a></li>
            <li><a href="#blog" className="hover:text-brand-orange">Blog</a></li>
            <li><a href="#artisan" className="hover:text-brand-orange">Vous êtes artisan</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>contact@parqueto.fr</li>
            <li>Paris · France</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Parqueto. Tous droits réservés.</p>
          <p>Mentions légales · Confidentialité · CGU</p>
        </div>
      </div>
    </footer>
  );
}
