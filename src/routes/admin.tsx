import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Parqueto" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
