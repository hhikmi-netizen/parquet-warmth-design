import { toast } from "sonner";

// Single shared id across every auth route so only one auth toast is ever
// visible at a time — emitting a new one replaces the previous one instead of
// stacking duplicates (e.g. "Email invalide" then "Email invalide" again on
// double submit, or a stale error lingering under a fresh success).
const AUTH_TOAST_ID = "auth";

const FR: Array<[RegExp, string]> = [
  [/invalid login credentials|invalid_grant/i, "Email ou mot de passe incorrect."],
  [/email not confirmed|email_not_confirmed/i, "Confirmez votre email pour continuer."],
  [/user already registered|already.*registered/i, "Un compte existe déjà avec cet email."],
  [/rate.?limit|too many requests/i, "Trop de tentatives. Réessayez dans un instant."],
  [/network|fetch failed|failed to fetch/i, "Problème de connexion. Vérifiez votre réseau."],
  [/password should be|password.*weak|weak.?password/i, "Mot de passe trop faible."],
  [/otp.?expired|token.*expired|expired/i, "Lien expiré. Demandez-en un nouveau."],
];

function translate(message: string | undefined): string {
  if (!message) return "Une erreur est survenue.";
  for (const [re, fr] of FR) if (re.test(message)) return fr;
  return message;
}

export const authToast = {
  success(message: string) {
    toast.success(message, { id: AUTH_TOAST_ID });
  },
  error(message: string | undefined) {
    toast.error(translate(message), { id: AUTH_TOAST_ID });
  },
  info(message: string) {
    toast.info(message, { id: AUTH_TOAST_ID });
  },
  dismiss() {
    toast.dismiss(AUTH_TOAST_ID);
  },
};
