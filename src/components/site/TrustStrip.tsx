/**
 * Fine bande de confiance — presse + KPI clés.
 * Posée juste après le Hero, elle ancre la crédibilité sans alourdir.
 * Style éditorial : typographie sobre, séparateurs fins, zéro saturation.
 */
export function TrustStrip() {
  const press = [
    "Côté Maison",
    "Maison & Travaux",
    "Le Figaro Immo",
    "Art & Décoration",
  ];

  const kpis = [
    { value: "4,9/5", label: "247 avis clients" },
    { value: "98 %", label: "projets aboutis" },
    { value: "< 24 h", label: "premier retour artisan" },
  ];

  return (
    <section
      aria-label="Ils parlent de Parqueto"
      className="border-y border-border/60 bg-[#f6efe4]"
    >
      <div className="mx-auto grid max-w-7xl gap-y-6 px-6 py-6 sm:py-7 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        {/* Presse */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Ils en parlent
            </span>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {press.map((name) => (
                <li
                  key={name}
                  className="font-display text-sm tracking-tight text-foreground/70 sm:text-base"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* KPIs */}
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:col-span-5 lg:justify-end">
          {kpis.map((k, i) => (
            <li key={k.label} className="flex items-center gap-8">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-6 w-px bg-border sm:inline-block"
                />
              )}
              <div>
                <div className="font-display text-lg font-semibold text-foreground sm:text-xl">
                  {k.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {k.label}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
