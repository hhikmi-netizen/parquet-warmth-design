import poncage from "@/assets/artisan.jpg";
import vitrif from "@/assets/vitrification.jpg";
import pose from "@/assets/pose.jpg";
import ancien from "@/assets/parquet-ancien.jpg";
import detail from "@/assets/detail-wood.jpg";

const items = [
  { img: poncage, title: "Ponçage", body: "Mise à nu du bois, ratissage des aspérités, reprise des bouchages." },
  { img: vitrif, title: "Vitrification", body: "Finition mate, satinée ou brillante. Protection durable du bois." },
  { img: pose, title: "Pose", body: "Pose clouée, collée ou flottante. À l'anglaise, en chevron ou Versailles." },
  { img: ancien, title: "Parquet ancien", body: "Restauration patrimoniale, respect des essences et des assemblages." },
  { img: detail, title: "Massif & contrecollé", body: "Conseil sur le choix de l'essence et le format adapté à votre pièce." },
];

export function Expertise() {
  return (
    <section id="realisations" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Le métier</p>
            <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">
              Tout le savoir-faire du parquet, sous un même toit.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Du diagnostic à la finition, nos artisans partenaires maîtrisent l'ensemble des techniques traditionnelles et contemporaines.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`group relative overflow-hidden rounded-2xl shadow-soft ${i === 0 ? "lg:row-span-2 lg:aspect-auto" : ""}`}
            >
              <img
                src={it.img}
                alt={it.title}
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i === 0 ? "h-full min-h-[28rem]" : "aspect-[4/3]"}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                <h3 className="font-display text-2xl">{it.title}</h3>
                <p className="mt-1 max-w-sm text-sm text-background/80">{it.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
