/**
 * Contenu des emails J+2 (conseil complémentaire) et J+7 (CTA estimation).
 * Adapté au segment du lead (particulier / pro / artisan).
 */
import { buildUnsubscribeUrl } from "@/lib/guide-unsubscribe";

export type Segment = "particulier" | "pro" | "artisan";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}



function shell(title: string, kicker: string, bodyHtml: string, ctaHref: string, ctaLabel: string, email: string) {
  const unsubUrl = buildUnsubscribeUrl(email);
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f5f0e6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#2d2724;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e6;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px -16px rgba(60,40,20,0.18);">
<tr><td style="background:linear-gradient(135deg,#d97a3d 0%,#b85a23 100%);padding:24px 32px;">
<div style="font-family:Georgia,serif;color:#fff;font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:0.85;">Parqueto · ${esc(kicker)}</div>
<div style="font-family:Georgia,serif;color:#fff;font-size:24px;line-height:1.25;margin-top:8px;">${esc(title)}</div>
</td></tr>
<tr><td style="padding:32px;">${bodyHtml}
<div style="margin-top:28px;"><a href="${ctaHref}" style="display:inline-block;background:#d97a3d;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 28px;border-radius:999px;">${esc(ctaLabel)} →</a></div>
</td></tr>
<tr><td style="background:#2d2724;padding:20px 32px;text-align:center;">
<div style="font-family:Georgia,serif;color:#f5f0e6;font-size:13px;letter-spacing:2px;">PARQUETO</div>
<div style="color:#a89684;font-size:11px;margin-top:4px;font-style:italic;">Le parquet, sans détour.</div>
</td></tr></table>
<div style="max-width:560px;color:#a89684;font-size:11px;text-align:center;margin-top:18px;line-height:1.6;">
Vous recevez cet email car vous avez téléchargé notre guide.<br>
<a href="${unsubUrl}" style="color:#a89684;text-decoration:underline;">Me désinscrire en 1 clic</a> · ou répondez "STOP".
</div>
</td></tr></table></body></html>`;
}


export function buildJ2Email(name: string | null, segment: Segment | null, email: string) {
  const hello = name ? `Bonjour ${esc(name)},` : "Bonjour,";
  let tip = "";
  if (segment === "pro") {
    tip = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Le geste qui sauve un chantier : faire respirer le bois <strong>48 h dans la pièce</strong> avant la pose. Carton ouvert, palette à plat, loin des murs et des sources de chaleur. C'est gratuit, ça évite 80&nbsp;% des litiges saisonniers.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Mesurez l'hygrométrie&nbsp;: idéalement 45–60&nbsp;% en intérieur, 7–9&nbsp;% dans le bois. En-dessous, vous prenez des fentes. Au-dessus, des tuiles.</p>`;
  } else if (segment === "artisan") {
    tip = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Un raccourci de pose qu'on adore&nbsp;: pour les pièces &gt; 40 m², commencez par <strong>tracer le sens des lames depuis la source de lumière principale</strong>, pas depuis le mur le plus long. Visuellement, ça change tout — surtout sur des essences contrastées comme le chêne fumé.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Si vous voulez qu'on relaie vos chantiers, Parqueto met en avant les artisans engagés sur le respect du bois et la transparence client.</p>`;
  } else {
    tip = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Le test qui vaut tous les discours&nbsp;: posez un verre d'eau renversé sur un échantillon de finition pendant 30 minutes. Pas de tache blanche = votre vernis ou huile est correctement appliqué.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Et pour l'entretien quotidien&nbsp;: bannissez vapeur et serpillère trempée. Une lingette à peine humide suffit. Vous gagnez 10 ans sur la durée de vie de votre parquet.</p>`;
  }
  const html = `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${hello}</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3d3531;">On voulait revenir vers vous avec une astuce concrète, pas dans le guide — celle que nos artisans répètent à chaque rendez-vous&nbsp;:</p>
${tip}
<p style="margin:0;font-size:15px;line-height:1.65;color:#3d3531;">Bonne lecture, et à très vite.</p>`;
  return {
    subject: "Une astuce parquet que peu de gens connaissent",
    html: shell("Une astuce qu'on ne met jamais par écrit", "Jour +2 · Conseil offert", html, "https://parqueto.fr/guide", "Relire le guide", email),
  };
}

export function buildJ7Email(name: string | null, segment: Segment | null, email: string) {
  const hello = name ? `Bonjour ${esc(name)},` : "Bonjour,";
  let pitch = "";
  let cta = "Estimer mon projet";
  let href = "https://parqueto.fr/estimation";
  if (segment === "pro") {
    pitch = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Vous gérez plusieurs lots&nbsp;? Parqueto peut vous remettre un <strong>devis multi-essences chiffré au m²</strong>, comparable lot par lot, en moins de 48 h. Pratique pour défendre un budget devant un MOA exigeant.</p>`;
    cta = "Demander un devis pro";
    href = "https://parqueto.fr/contact";
  } else if (segment === "artisan") {
    pitch = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Vous êtes artisan parquetier et le réseau Parqueto vous intéresse&nbsp;? Nous mettons en relation des artisans sélectionnés avec des particuliers déjà qualifiés — pas de pige, pas d'enchères.</p>`;
    cta = "Rejoindre le réseau";
    href = "https://parqueto.fr/devenir-artisan";
  } else {
    pitch = `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Vous avez sans doute fini le guide. La question suivante, c'est presque toujours&nbsp;: <strong>«&nbsp;ça va me coûter combien&nbsp;?&nbsp;»</strong>. Notre estimateur en ligne vous donne une fourchette réaliste en 2 minutes, sans rendez-vous, sans commercial.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3d3531;">Pose comprise, essences comparées, options finitions&nbsp;: vous savez exactement à quoi vous attendre avant le premier devis.</p>`;
  }
  const html = `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${hello}</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3d3531;">Une semaine déjà depuis le téléchargement du guide. On espère qu'il vous a aidé à clarifier quelques pistes.</p>
${pitch}
<p style="margin:0;font-size:14px;line-height:1.65;color:#7a6a5c;">Une question ? Répondez simplement à cet email — un humain vous lira.</p>`;
  return {
    subject: "Et si on chiffrait votre projet parquet ?",
    html: shell("Passons du papier au projet", "Jour +7 · Estimation", html, href, cta, email),
  };
}
