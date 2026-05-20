import { useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/parqueto-logo.png";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { label: "Comment ça marche", href: "#process" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Nos artisans", href: "#nos-artisans" },
  { label: "Outils", href: "#outils" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  const accountLink = user ? { to: "/historique" as const, label: "Mon espace" } : { to: "/login" as const, label: "Connexion" };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 sm:h-28">
        <a href="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Parqueto"
            className="h-16 w-auto sm:h-20 lg:h-24"
            width={96}
            height={96}
          />
          <span className="sr-only">Parqueto</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-foreground/75 transition hover:text-brand-orange">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {!loading && (
            <Link
              to={accountLink.to}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <User className="h-4 w-4" /> {accountLink.label}
            </Link>
          )}
          <a href="#estimate" className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft ring-1 ring-brand-orange-deep/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-deep hover:shadow-warm">
            Estimer gratuitement
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
              <a key={n.href} href={n.href} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>{n.label}</a>
            ))}
            {!loading && (
              <Link
                to={accountLink.to}
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium"
              >
                <User className="h-4 w-4" /> {accountLink.label}
              </Link>
            )}
            <a href="#estimate" className="mt-2 rounded-full bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-primary-foreground" onClick={() => setOpen(false)}>
              Estimer gratuitement
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
