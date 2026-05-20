import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-background shadow-warm sm:px-16 sm:py-20">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl text-balance text-background sm:text-5xl">
              Prêt à estimer votre projet parquet ?
            </h2>
            <p className="mt-4 text-background/70">
              Quelques minutes suffisent. Une estimation honnête, sans engagement, et un artisan vérifié au bout du chemin.
            </p>
          </div>
          <a href="#estimate" className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-4 text-sm font-semibold text-primary-foreground transition hover:bg-brand-orange-deep">
            Estimer mon projet
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
