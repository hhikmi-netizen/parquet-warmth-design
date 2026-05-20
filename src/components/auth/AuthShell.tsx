import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/parqueto-logo.png";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <img src={logo} alt="Parqueto" className="h-10 w-auto" />
          <span className="sr-only">Parqueto</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
        {footer ? <div className="pt-8 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </main>
  );
}

export function SocialButtons({ onProvider, loading }: { onProvider: (p: "google" | "apple") => void; loading?: string | null }) {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => onProvider("google")}
        disabled={!!loading}
        className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-background text-sm font-medium transition hover:bg-accent disabled:opacity-60"
      >
        <GoogleIcon /> {loading === "google" ? "Connexion…" : "Continuer avec Google"}
      </button>
      <button
        type="button"
        onClick={() => onProvider("apple")}
        disabled={!!loading}
        className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-border bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-60"
      >
        <AppleIcon /> {loading === "apple" ? "Connexion…" : "Continuer avec Apple"}
      </button>
    </div>
  );
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span>{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.5 6.7 28.9 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c10.5 0 19-8.5 19-19 0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.5 6.7 28.9 5 24 5 16.3 5 9.7 9.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.2 2-6.9 2-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 38.6 16.3 43 24 43z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6 5C40.9 35.2 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM236.3 100.5c20.7-24.6 18.8-47.1 18.2-55.2-18.3 1.1-39.5 12.5-51.6 26.5-13.3 15-21.1 33.6-19.4 54.8 19.8 1.5 37.9-8.7 52.8-26.1z" />
    </svg>
  );
}
