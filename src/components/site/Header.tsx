import { useState } from "react";
import logo from "@/assets/parqueto-logo.png";
import { Menu, X } from "lucide-react";

const nav = [
  { label: "Comment ça marche", href: "#process" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Blog", href: "#blog" },
  { label: "Vous êtes artisan", href: "#artisan" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Parqueto" className="h-12 w-auto" width={48} height={48} />
          <span className="sr-only">Parqueto</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-foreground/75 transition hover:text-brand-orange">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <a href="#estimate" className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-brand-orange-deep">
            Estimer mon projet
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="py-2 text-sm font-medium">{n.label}</a>
            ))}
            <a href="#estimate" className="mt-2 rounded-full bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-primary-foreground">
              Estimer mon projet
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
