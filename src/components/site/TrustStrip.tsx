import { Clock, BadgeCheck, Gift, PhoneOff } from "lucide-react";

/**
 * Bande de confiance honnête — promesses concrètes, sans chiffres inventés.
 * Pensée pour ne pas dupliquer la section "Notre engagement" (Promise.tsx).
 */
const items = [
  { icon: Clock, label: "Estimation claire et rapide" },
  { icon: BadgeCheck, label: "Artisans partenaires vérifiés" },
  { icon: Gift, label: "Gratuit et sans engagement" },
  { icon: PhoneOff, label: "Aucun démarchage téléphonique" },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Nos engagements"
      className="border-y border-border/60 bg-surface-warm"
    >
      <div className="mx-auto max-w-7xl px-6 py-5 sm:py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:justify-between">
          {items.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-sm text-foreground/80"
            >
              <Icon className="h-4 w-4 text-brand-orange" aria-hidden />
              <span className="font-medium tracking-tight">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
