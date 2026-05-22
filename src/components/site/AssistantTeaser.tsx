import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Eye, Lock, Cpu } from "lucide-react";

export function AssistantTeaser() {
  return (
    <section className="border-y border-border bg-secondary/30 py-20 sm:py-24" aria-labelledby="assistant-teaser-title">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-deep">
              <Sparkles className="ai-twinkle h-3 w-3" aria-hidden />
              Première IA française dédiée au parquet
            </span>
            <h2 id="assistant-teaser-title" className="mt-5 font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
              Analysez votre parquet en photo,
              <span className="block italic text-brand-orange">avec l'Assistant IA Parqueto.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Une photo suffit : notre assistant identifie l'essence probable, la finition, les signaux
              d'usure, et vous oriente vers la bonne intervention (ponçage, vitrification, rénovation
              après dégât des eaux). Outil métier, lecture prudente, photo non conservée.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-3">
              <Mini icon={Eye} label="Lecture visuelle" />
              <Mini icon={Cpu} label="Modèle spécialisé parquet" />
              <Mini icon={Lock} label="Photo non conservée" />
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/assistant"
                className="ai-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-deep px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
              >
                <Sparkles className="ai-twinkle h-4 w-4" aria-hidden />
                Essayer l'Assistant IA
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/estimation"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                Estimer mon projet
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-state-success" />
                  Analyse · simulation
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                  IA
                </span>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <Row k="Essence probable" v="Chêne européen" />
                <Row k="Finition détectée" v="Vitrifiée mate" />
                <Row k="État général" v="Usure modérée" tone="warn" />
                <Row k="Reco principale" v="Ponçage + vitrification" />
              </dl>
              <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
                Lecture indicative. Confirmation sur place par un parqueteur vérifié.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ icon: Icon, label }: { icon: typeof Eye; label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground/80">
      <Icon className="h-3.5 w-3.5 text-foreground/60" aria-hidden />
      {label}
    </li>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "warn" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd
        className={`font-display text-foreground ${tone === "warn" ? "text-brand-orange-deep" : ""}`}
      >
        {v}
      </dd>
    </div>
  );
}
