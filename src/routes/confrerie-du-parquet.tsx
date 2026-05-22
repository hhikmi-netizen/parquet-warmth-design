import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/confrerie-du-parquet")({
  component: () => <Outlet />,
});
