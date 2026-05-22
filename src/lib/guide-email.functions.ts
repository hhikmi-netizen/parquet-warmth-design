import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildUnsubscribeUrl } from "@/lib/guide-unsubscribe";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "Parqueto <guide@parqueto.fr>";
const REPLY_TO = "contact@parqueto.fr";

const Input = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).optional().nullable(),
});

function buildHtml(name: string | null) {
  const hello = name ? `Bonjour ${escapeHtml(name)},` : "Bonjour,";
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Votre Guide Ultime du Parquet</title></head>
<body style="margin:0;padding:0;background:#f5f0e6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#2d2724;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px -16px rgba(60,40,20,0.18);">
        <tr><td style="background:linear-gradient(135deg,#d97a3d 0%,#b85a23 100%);padding:28px 32px;">
          <div style="font-family:Georgia,'Times New Roman',serif;color:#fff;font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.85;">Parqueto</div>
          <div style="font-family:Georgia,'Times New Roman',serif;color:#fff;font-size:28px;line-height:1.2;margin-top:8px;">Votre guide est prêt</div>
        </td></tr>
        <tr><td style="padding:36px 32px 8px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${hello}</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3d3531;">
            Merci d'avoir téléchargé <strong>Le Guide Ultime du Parquet</strong>. C'est un vrai plaisir
            de pouvoir partager avec vous ce que nous avons appris au fil des centaines de chantiers,
            des ateliers de pose, et des conversations avec des artisans passionnés.
          </p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3d3531;">
            Que vous soyez en train de rêver votre futur intérieur, de comparer des essences,
            ou de préparer une rénovation délicate — vous trouverez dans ce guide des repères
            clairs, des chiffres concrets, et des astuces de pro pour avancer sereinement.
          </p>
        </td></tr>
        <tr><td style="padding:8px 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;border-left:3px solid #d97a3d;border-radius:8px;">
            <tr><td style="padding:18px 22px;">
              <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b85a23;font-weight:700;margin-bottom:6px;">Au sommaire</div>
              <div style="font-size:14px;line-height:1.7;color:#3d3531;">
                Choisir la bonne essence · Comprendre les finitions<br>
                Préparer le support · Maîtriser la pose<br>
                Entretien quotidien · Rénover sans tout casser
              </div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:12px 32px 36px;">
          <a href="https://parqueto.fr/guide" style="display:inline-block;background:#d97a3d;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:999px;letter-spacing:0.3px;">Relire le guide en ligne →</a>
          <div style="margin-top:14px;font-size:12px;color:#8a7a6e;">Le PDF est déjà dans vos téléchargements.</div>
        </td></tr>
        <tr><td style="padding:0 32px 32px;">
          <div style="border-top:1px solid #ece4d6;padding-top:22px;font-size:14px;line-height:1.65;color:#3d3531;">
            <strong>Une question, un doute, un projet ?</strong><br>
            Répondez simplement à cet email — un conseiller Parqueto vous lira personnellement,
            sans script et sans pression. C'est aussi ça, le parquet sans détour.
          </div>
        </td></tr>
        <tr><td style="background:#2d2724;padding:22px 32px;text-align:center;">
          <div style="font-family:Georgia,serif;color:#f5f0e6;font-size:14px;letter-spacing:2px;">PARQUETO</div>
          <div style="color:#a89684;font-size:11px;margin-top:4px;font-style:italic;">Le parquet, sans détour.</div>
          <div style="color:#7a6a5c;font-size:11px;margin-top:14px;">
            <a href="https://parqueto.fr" style="color:#a89684;text-decoration:none;">parqueto.fr</a>
            &nbsp;·&nbsp; 01 84 60 60 61 &nbsp;·&nbsp;
            <a href="mailto:contact@parqueto.fr" style="color:#a89684;text-decoration:none;">contact@parqueto.fr</a>
          </div>
        </td></tr>
      </table>
      <div style="max-width:560px;color:#a89684;font-size:11px;text-align:center;margin-top:18px;line-height:1.6;">
        Vous recevez cet email car vous avez téléchargé notre guide.<br>
        Pour ne plus recevoir nos conseils, répondez "STOP" à cet email.
      </div>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export const sendGuideEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error("Missing email gateway keys");
      return { sent: false, reason: "config" as const };
    }
    try {
      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: FROM,
          to: [data.email],
          reply_to: REPLY_TO,
          subject: "Votre Guide Ultime du Parquet est arrivé 🌿",
          html: buildHtml(data.name ?? null),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`Resend send failed [${res.status}]: ${body}`);
        return { sent: false, reason: "api" as const };
      }
      return { sent: true };
    } catch (e) {
      console.error("sendGuideEmail error", e);
      return { sent: false, reason: "exception" as const };
    }
  });
