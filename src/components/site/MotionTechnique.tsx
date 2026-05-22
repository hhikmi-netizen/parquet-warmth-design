import { motion } from "framer-motion";
import { useState } from "react";

type Topic = "couches" | "humidite" | "dilatation" | "chauffage";

const TOPICS: { id: Topic; label: string; title: string; desc: string }[] = [
  {
    id: "couches",
    label: "Couches du parquet",
    title: "Anatomie d'un parquet contrecollé",
    desc:
      "Trois couches travaillent ensemble : parement noble, âme contre-balancée, contre-parement. C'est la stabilité dans le temps.",
  },
  {
    id: "humidite",
    label: "Humidité & bois",
    title: "Le bois respire — il faut l'écouter",
    desc:
      "Entre 8 et 12 % d'humidité, le bois reste stable. Au-delà, il gonfle ; en-dessous, il se rétracte et craque. L'acclimatation, c'est 8 jours sur site.",
  },
  {
    id: "dilatation",
    label: "Dilatation",
    title: "Joint périphérique : 8 mm de respiration",
    desc:
      "Un parquet pose sans joint en périphérie finit par tuiler ou se soulever. 8 mm tout autour, c'est la règle.",
  },
  {
    id: "chauffage",
    label: "Chauffage au sol",
    title: "Résistance thermique ≤ 0,15 m²·K/W",
    desc:
      "Sur plancher chauffant, choisir un parquet à faible résistance thermique. Essences stables (chêne, merbau) et collage en plein.",
  },
];

/**
 * Animations pédagogiques techniques en SVG.
 * Style architectural, minimaliste, sobre — pas de cartoon.
 */
export function MotionTechnique() {
  const [active, setActive] = useState<Topic>("couches");
  const current = TOPICS.find((t) => t.id === active)!;

  return (
    <section className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
            Comprendre la matière
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-balance sm:text-5xl">
            Le parquet, <span className="italic text-brand-orange">expliqué simplement.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Quelques règles fondamentales pour comprendre — et bien décider.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Onglets */}
          <div className="lg:col-span-4">
            <div role="tablist" aria-label="Sujets techniques" className="flex flex-col gap-1.5">
              {TOPICS.map((t) => {
                const isActive = t.id === active;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(t.id)}
                    className={`group flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "border-brand-orange/40 bg-brand-orange/5 text-foreground"
                        : "border-border bg-card text-foreground/80 hover:border-brand-orange/30 hover:text-foreground"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        isActive ? "bg-brand-orange" : "bg-border group-hover:bg-brand-orange/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scène */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[16/10] w-full bg-[oklch(0.97_0.008_85)]">
                {active === "couches" && <SceneCouches />}
                {active === "humidite" && <SceneHumidite />}
                {active === "dilatation" && <SceneDilatation />}
                {active === "chauffage" && <SceneChauffage />}
              </div>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border-t border-border px-6 py-5"
              >
                <h3 className="font-display text-xl text-foreground">{current.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{current.desc}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Scènes SVG ---------------------------- */

function SceneCouches() {
  const layers = [
    { y: 60, h: 36, label: "Parement noble (≈ 3 mm)", color: "#c39e6e" },
    { y: 100, h: 70, label: "Âme contrecollée", color: "#e6d4b8" },
    { y: 174, h: 24, label: "Contre-parement", color: "#b8966a" },
  ];
  return (
    <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" role="img" aria-label="Couches du parquet contrecollé">
      <defs>
        <pattern id="grainTop" width="40" height="6" patternUnits="userSpaceOnUse">
          <rect width="40" height="6" fill="#c39e6e" />
          <line x1="0" y1="3" x2="40" y2="3" stroke="rgba(0,0,0,0.12)" strokeWidth="0.4" />
        </pattern>
      </defs>
      {layers.map((l, i) => (
        <g key={l.label}>
          <motion.rect
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 80, opacity: 1 }}
            transition={{ delay: 0.15 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            y={l.y}
            width="380"
            height={l.h}
            fill={i === 0 ? "url(#grainTop)" : l.color}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.6"
          />
          <motion.line
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + 0.15 * i }}
            x1="465" y1={l.y + l.h / 2} x2="510" y2={l.y + l.h / 2}
            stroke="#666" strokeWidth="0.6" strokeDasharray="3 3"
          />
          <motion.text
            initial={{ opacity: 0, x: 540 }}
            animate={{ opacity: 1, x: 520 }}
            transition={{ delay: 0.45 + 0.15 * i, duration: 0.5 }}
            y={l.y + l.h / 2 + 4}
            fontSize="11"
            fill="#3a3a3a"
            fontFamily="Inter, sans-serif"
          >
            {l.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

function SceneHumidite() {
  return (
    <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" role="img" aria-label="Humidité et bois">
      <rect x="80" y="160" width="480" height="60" fill="#c39e6e" stroke="rgba(0,0,0,0.15)" />
      {/* lattes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={80 + 96 * (i + 1)} y1="160" x2={80 + 96 * (i + 1)} y2="220" stroke="rgba(0,0,0,0.18)" />
      ))}
      {/* Gouttes */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 100, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, delay: i * 0.6, repeat: Infinity, ease: "easeIn" }}
        >
          <path
            d={`M ${200 + i * 130} 60 C ${192 + i * 130} 78 ${192 + i * 130} 88 ${200 + i * 130} 92 C ${208 + i * 130} 88 ${208 + i * 130} 78 ${200 + i * 130} 60 Z`}
            fill="#6BA4C9"
          />
        </motion.g>
      ))}
      {/* Hygromètre */}
      <g transform="translate(460, 70)">
        <rect width="100" height="60" rx="8" fill="white" stroke="rgba(0,0,0,0.12)" />
        <text x="10" y="20" fontSize="9" fill="#888" fontFamily="Inter, sans-serif">HUMIDITÉ BOIS</text>
        <motion.text
          x="10" y="46" fontSize="22" fontFamily="Fraunces, serif" fill="#E08A2E"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          9,5 %
        </motion.text>
      </g>
      {/* Échelle */}
      <g transform="translate(80, 270)">
        <line x1="0" y1="0" x2="480" y2="0" stroke="#888" strokeWidth="1" />
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <g key={i} transform={`translate(${p * 480}, 0)`}>
            <line y2="6" stroke="#888" />
            <text y="22" fontSize="10" fill="#666" textAnchor="middle" fontFamily="Inter, sans-serif">
              {[6, 8, 10, 12, 14][i]} %
            </text>
          </g>
        ))}
        <motion.rect
          initial={{ width: 0 }}
          animate={{ width: 480 * 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          x={480 * 0.25} y="-3" height="6" fill="#E08A2E" opacity="0.3"
        />
        <text x="240" y="50" fontSize="10" fill="#3a3a3a" textAnchor="middle" fontFamily="Inter, sans-serif">
          Zone de stabilité du bois
        </text>
      </g>
    </svg>
  );
}

function SceneDilatation() {
  return (
    <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" role="img" aria-label="Joint de dilatation">
      {/* murs */}
      <rect x="60" y="80" width="20" height="240" fill="#e5dccd" />
      <rect x="560" y="80" width="20" height="240" fill="#e5dccd" />
      {/* parquet qui respire */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, 8, 0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="100" y="160" width="440" height="80" fill="#c39e6e" stroke="rgba(0,0,0,0.15)" />
        {[100, 220, 340, 460].map((x) => (
          <line key={x} x1={x} y1="160" x2={x} y2="240" stroke="rgba(0,0,0,0.2)" />
        ))}
      </motion.g>
      {/* cotes */}
      {[
        { x1: 80, x2: 100, y: 260 },
        { x1: 540, x2: 560, y: 260 },
      ].map((d, i) => (
        <g key={i}>
          <line x1={d.x1} y1={d.y} x2={d.x2} y2={d.y} stroke="#E08A2E" strokeWidth="1.2" />
          <line x1={d.x1} y1={d.y - 4} x2={d.x1} y2={d.y + 4} stroke="#E08A2E" />
          <line x1={d.x2} y1={d.y - 4} x2={d.x2} y2={d.y + 4} stroke="#E08A2E" />
          <text
            x={(d.x1 + d.x2) / 2} y={d.y + 18}
            fontSize="11" fill="#E08A2E" textAnchor="middle"
            fontFamily="Inter, sans-serif" fontWeight={600}
          >
            8 mm
          </text>
        </g>
      ))}
      <text x="320" y="120" fontSize="12" fill="#666" textAnchor="middle" fontFamily="Inter, sans-serif">
        Joint périphérique — le bois doit pouvoir respirer
      </text>
    </svg>
  );
}

function SceneChauffage() {
  return (
    <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" role="img" aria-label="Parquet sur chauffage au sol">
      {/* chape */}
      <rect x="60" y="240" width="520" height="40" fill="#d9d4c8" />
      {/* tuyaux */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx={100 + i * 88} cy="260" r="9"
          fill="#c44833"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
      {/* parquet */}
      <rect x="60" y="180" width="520" height="50" fill="#c39e6e" stroke="rgba(0,0,0,0.15)" />
      {[60, 190, 320, 450, 580].map((x) => (
        <line key={x} x1={x} y1="180" x2={x} y2="230" stroke="rgba(0,0,0,0.18)" />
      ))}
      {/* ondes chaleur */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M 100 170 Q 200 140 300 170 T 540 170"
          fill="none" stroke="#E08A2E" strokeWidth="1" opacity="0.5"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -50, opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      {/* label */}
      <g transform="translate(360, 70)">
        <rect width="220" height="70" rx="8" fill="white" stroke="rgba(0,0,0,0.12)" />
        <text x="14" y="22" fontSize="9" fill="#888" fontFamily="Inter, sans-serif">RÉSISTANCE THERMIQUE</text>
        <text x="14" y="50" fontSize="20" fontFamily="Fraunces, serif" fill="#3a3a3a">
          R ≤ 0,15 m²·K/W
        </text>
      </g>
    </svg>
  );
}
