import { useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/parqueto-logo.png";
import { Menu, X, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type NavItem = { label: string; to: string };

const nav: NavItem[] = [
  { label: "Comment ça marche", to: "/comment-ca-marche" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Nos artisans", to: "/artisans" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
];

// No hash items currently in the nav — kept for future flexibility.
const isHashItem = (_to: string) => false;
const hashHref = (to: string) => to;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  const accountLink = user
    ? { to: "/pro" as const, label: "Mon espace Pro" }
    : { to: "/login" as const, label: "Connexion" };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 sm:h-28">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Parqueto" className="h-16 w-auto sm:h-20 lg:h-24" width={96} height={96} />
          <span className="sr-only">Parqueto</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) =>
            isHashItem(n.to) ? (
              <a
                key={n.to}
                href={hashHref(n.to)}
                className="text-sm font-medium text-foreground/75 transition hover:text-brand-orange"
              >
                {n.label}
              </a>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-foreground/75 transition hover:text-brand-orange"
              >
                {n.label}
              </Link>
            )
          )}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/assistant"
            aria-label="Assistant Parqueto — IA d'analyse parquet"
            className="ai-glow group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-deep px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <Sparkles className="ai-twinkle h-3.5 w-3.5" aria-hidden />
            Assistant
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              IA
            </span>
          </Link>

          {!loading && (
            <Link
              to={accountLink.to}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <User className="h-4 w-4" /> {accountLink.label}
            </Link>
          )}
          <Link
            to="/estimation"
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            Estimer gratuitement
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {nav.map((n) =>
              isHashItem(n.to) ? (
                <a key={n.to} href={hashHref(n.to)} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              ) : (
                <Link key={n.to} to={n.to} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              )
            )}
            {!loading && (
              <Link
                to={accountLink.to}
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium"
              >
                <User className="h-4 w-4" /> {accountLink.label}
              </Link>
            )}
            <Link
              to="/assistant"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-deep px-5 py-3 text-sm font-semibold text-primary-foreground shadow-warm"
            >
              <Sparkles className="h-4 w-4" /> Assistant
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">IA</span>
            </Link>
            <Link
              to="/estimation"
              className="mt-2 rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background"
              onClick={() => setOpen(false)}
            >
              Estimer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
