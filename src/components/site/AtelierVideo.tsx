import { motion } from "framer-motion";
import { Camera, Sparkles, Ruler, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Atelier Parqueto — section "outils intelligents".
 * Mockups d'interface animés (pas de vidéo lourde), restitue l'esthétique
 * d'un produit logiciel premium : estimation, assistant IA, analyse photo.
 */
export function AtelierVideo() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.985_0.005_85)] py-24 sm:py-32 dark:bg-background">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12 lg:gap-12">
        {/* Intro */}
        <div className="lg:col-span-5 lg:pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            L'atelier Parqueto
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            Des outils précis,
            <span className="block italic text-brand-orange">au service du geste.</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Estimation en ligne, lecture photo, assistant IA spécialisé parquet : nos outils
            servent le métier — pas l'inverse. Sobres, exacts, vérifiables.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-foreground/85">
            {[
              { icon: Ruler, label: "Estimateur surface · 4 étapes guidées" },
              { icon: Camera, label: "Analyse photo · essence + état du parquet" },
              { icon: Sparkles, label: "Assistant IA · première IA française parquet" },
              { icon: MessageSquare, label: "Mise en relation artisan vérifié, sans démarchage" },
            ].map((it) => (
              <li key={it.label} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-brand-orange">
                  <it.icon className="h-4 w-4" />
                </span>
                {it.label}
              </li>
            ))}
          </ul>

          <Link
            to="/assistant"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Découvrir l'assistant IA
          </Link>
        </div>

        {/* Mockups */}
        <div className="lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <MockupAnalyse />
            <MockupEstimation />
            <MockupAssistant className="sm:col-span-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------- Mockups (animations CSS/framer-motion légères) ------------- */

function CardShell({
  title,
  badge,
  children,
  className = "",
}: {
  title: string;
  badge: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </span>
        <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
          {badge}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function MockupAnalyse() {
  return (
    <CardShell title="Analyse photo" badge="IA">
      <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-foreground/5">
        {/* texture parquet */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(110deg, #d2b58a 0 22px, #c39e6e 22px 23px, #d2b58a 23px 64px), repeating-linear-gradient(110deg, transparent 0 80px, rgba(0,0,0,0.08) 80px 81px, transparent 81px 200px)",
          }}
        />
        {/* scan line */}
        <motion.div
          initial={{ y: "0%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
          className="absolute inset-x-0 top-0 h-[2px] bg-brand-orange/70 shadow-[0_0_18px_2px_rgba(224,138,46,0.4)]"
        />
        {/* detection box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute left-[18%] top-[28%] h-[44%] w-[58%] rounded-md border border-brand-orange/80"
        >
          <span className="absolute -top-6 left-0 rounded bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
            Chêne · usure modérée
          </span>
        </motion.div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          ["Essence", "Chêne"],
          ["État", "73 %"],
          ["Action", "Ponçage"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-foreground/5 px-2 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className="mt-1 font-display text-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}

function MockupEstimation() {
  return (
    <CardShell title="Estimation" badge="4 étapes">
      <div className="space-y-3">
        {[
          { label: "Surface", v: 72, max: 100, txt: "72 m²" },
          { label: "Essence", v: 65, max: 100, txt: "Chêne européen" },
          { label: "Finition", v: 80, max: 100, txt: "Huile dure" },
        ].map((row, i) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.txt}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${row.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-brand-orange"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-border/70 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Fourchette indicative
          </p>
          <p className="font-display text-2xl text-foreground">
            3 240 – 4 680 €
          </p>
        </div>
        <span className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">
          Sous 24 h
        </span>
      </div>
    </CardShell>
  );
}

function MockupAssistant({ className = "" }: { className?: string }) {
  const messages = [
    { from: "user", text: "Mon parquet chêne grince et a perdu son éclat — que faire ?" },
    {
      from: "ai",
      text:
        "D'après votre photo : chêne massif, usure modérée. Recommandation : ponçage léger (grain 100/120) + huile dure mate. Fourchette : 38–52 € / m².",
    },
  ];
  return (
    <CardShell title="Assistant IA parquet" badge="Conversationnel" className={className}>
      <div className="space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.4, duration: 0.5 }}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "user"
                  ? "bg-foreground text-background"
                  : "bg-foreground/5 text-foreground"
              }`}
            >
              {m.text}
            </p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-1.5 pl-2 pt-1"
        >
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </motion.div>
      </div>
    </CardShell>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity, delay }}
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
    />
  );
}
