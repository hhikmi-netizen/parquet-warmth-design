import { createFileRoute } from "@tanstack/react-router";
import { verifyUnsubscribeToken } from "@/lib/guide-unsubscribe";

/**
 * Désinscription 1 clic depuis les emails de la séquence guide.
 * URL : /api/public/guide-unsubscribe?e=<email>&t=<token>
 * Renvoie une page HTML de confirmation, marque guide_downloads.unsubscribed_at.
 */

function page(title: string, body: string, ok: boolean) {
  const color = ok ? "#0d7a5f" : "#b85a23";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Parqueto</title>
<style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f5f0e6;color:#2d2724;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{max-width:480px;background:#fff;border-radius:20px;padding:36px;box-shadow:0 12px 40px -16px rgba(60,40,20,.18);text-align:center}
h1{font-family:Georgia,serif;font-size:22px;margin:0 0 12px;color:${color}}
p{margin:0 0 18px;line-height:1.6;color:#3d3531;font-size:15px}
a{display:inline-block;background:#d97a3d;color:#fff;text-decoration:none;font-weight:600;padding:11px 22px;border-radius:999px;font-size:14px}
.brand{margin-top:24px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;color:#a89684}</style></head>
<body><div class="card"><h1>${title}</h1><p>${body}</p><a href="https://parqueto.fr">Retour à parqueto.fr</a><div class="brand">PARQUETO · Le parquet, sans détour.</div></div></body></html>`;
}

export const Route = createFileRoute("/api/public/guide-unsubscribe")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});

async function handle(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("e") ?? "").trim().toLowerCase();
  const token = (url.searchParams.get("t") ?? "").trim();

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new Response(
      page("Lien invalide", "Ce lien de désinscription n'est pas reconnu. Si vous souhaitez ne plus recevoir nos emails, répondez simplement « STOP » à l'un d'eux.", false),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("guide_downloads" as never)
      .update({ unsubscribed_at: new Date().toISOString(), opt_in: false } as never)
      .eq("email", email);
    if (error) {
      console.error("[unsubscribe] update failed", error);
      return new Response(
        page("Oups", "Une erreur technique nous empêche de traiter votre demande. Réessayez dans quelques minutes ou écrivez à contact@parqueto.fr.", false),
        { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  } catch (e) {
    console.error("[unsubscribe] exception", e);
    return new Response(
      page("Oups", "Une erreur technique est survenue. Écrivez-nous à contact@parqueto.fr et nous vous retirons manuellement.", false),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return new Response(
    page(
      "C'est fait, vous êtes désinscrit",
      "Vous ne recevrez plus aucun email de la séquence guide. Aucune action complémentaire n'est nécessaire de votre part. Merci d'avoir laissé sa chance à Parqueto.",
      true
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
