import { createFileRoute } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { CITIES } from "@/lib/cities";
import { PRESTATIONS } from "@/lib/prestations";

const BASE = "https://parqueto.fr";

const STATIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/guide-parquet", priority: 0.95, changefreq: "monthly" },
  { path: "/guide", priority: 0.9, changefreq: "monthly" },
  { path: "/estimation", priority: 0.9, changefreq: "monthly" },
  { path: "/artisans", priority: 0.8, changefreq: "weekly" },
  { path: "/realisations", priority: 0.7, changefreq: "monthly" },
  { path: "/renovation-sinistre", priority: 0.9, changefreq: "monthly" },
  { path: "/parquet-qui-gondole", priority: 0.95, changefreq: "monthly" },
  { path: "/artisan-verifie", priority: 0.7, changefreq: "monthly" },
  { path: "/confrerie-du-parquet", priority: 0.65, changefreq: "monthly" },
  { path: "/confrerie-du-parquet/candidater", priority: 0.55, changefreq: "monthly" },
  { path: "/teintes", priority: 0.7, changefreq: "monthly" },
  { path: "/outils", priority: 0.6, changefreq: "monthly" },
  { path: "/assistant", priority: 0.75, changefreq: "monthly" },
  { path: "/blog", priority: 0.7, changefreq: "weekly" },
  { path: "/devenir-artisan", priority: 0.6, changefreq: "monthly" },
  { path: "/partenaires", priority: 0.5, changefreq: "monthly" },
  { path: "/a-propos", priority: 0.5, changefreq: "yearly" },
  { path: "/charte-qualite", priority: 0.4, changefreq: "yearly" },
  { path: "/contact", priority: 0.5, changefreq: "yearly" },
  { path: "/parrainage", priority: 0.6, changefreq: "monthly" },
  { path: "/newsletter", priority: 0.6, changefreq: "monthly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const urls: string[] = [];
        for (const r of STATIC_ROUTES) {
          urls.push(`<url><loc>${BASE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(2)}</priority></url>`);
        }
        for (const p of BLOG_POSTS) {
          urls.push(`<url><loc>${BASE}/blog/${p.slug}</loc><lastmod>${p.date.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>`);
        }
        for (const c of CITIES) {
          urls.push(`<url><loc>${BASE}/parqueteur/${c.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`);
          for (const p of PRESTATIONS) {
            urls.push(`<url><loc>${BASE}/parqueteur/${c.slug}/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.78</priority></url>`);
          }
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
