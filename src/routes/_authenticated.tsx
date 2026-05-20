import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    // OAuth users have email_confirmed_at set automatically.
    // Email/password users without confirmation must verify first.
    const user = session.user;
    const confirmed =
      !!user.email_confirmed_at || !!user.confirmed_at || user.app_metadata?.provider !== "email";
    if (!confirmed) {
      throw redirect({
        to: "/verify-email",
        search: { email: user.email ?? undefined },
      });
    }
  },
  component: () => <Outlet />,
});
