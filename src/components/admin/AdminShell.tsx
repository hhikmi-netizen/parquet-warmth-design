import { ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  Hammer,
  ShieldAlert,
  Wallet,
  LifeBuoy,
  ScrollText,
  Bell,
  Settings,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; badge?: string };
const NAV: NavItem[] = [
  { to: "/admin", label: "Vue 360°", icon: LayoutDashboard, exact: true },
  { to: "/admin/clients", label: "Demandes clients", icon: Inbox, badge: "3" },
  { to: "/admin/artisans", label: "Artisans", icon: Hammer },
  { to: "/admin/guide", label: "Guide & leads", icon: ScrollText },
  { to: "/admin/moderation", label: "Modération & qualité", icon: ShieldAlert, badge: "4" },
  { to: "/admin/monetisation", label: "Monétisation", icon: Wallet },
  { to: "/admin/support", label: "Support", icon: LifeBuoy, badge: "2" },
  { to: "/admin/logs", label: "Journal & logs", icon: ScrollText },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, badge: "7" },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border bg-card">
        <Link
          to="/admin"
          className="flex items-center gap-2.5 px-2 py-1.5"
          aria-label="Parqueto Admin"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-primary-foreground shadow-soft">
            <span className="font-display text-base leading-none">P</span>
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm text-foreground">Parqueto</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Espace admin</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pilotage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = isActive(item.to, item.exact);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-orange/10 px-1.5 text-[10px] font-semibold text-brand-orange">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {!collapsed && <span>Voir le site public</span>}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-card/85 px-3 backdrop-blur-md sm:gap-3 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="hidden flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition focus-within:border-brand-orange/40 sm:flex sm:max-w-md">
              <Search className="h-3.5 w-3.5" />
              <input
                placeholder="Rechercher un client, artisan, lead…"
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Rechercher"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange sm:hidden"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 sm:flex-none">
              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-brand-orange/40 hover:text-brand-orange"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-brand-orange ring-2 ring-card" />
              </button>
              <span className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-2 text-xs sm:px-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange/10 text-[10px] font-semibold text-brand-orange">
                  AD
                </span>
                <span className="hidden font-medium sm:inline">Admin Parqueto</span>
              </span>
            </div>
          </header>

          {/* Page header */}
          <div className="border-b border-border bg-background px-4 py-4 sm:px-8 sm:py-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-display text-xl text-foreground sm:text-3xl">{title}</h1>
                {subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 px-3 py-4 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AdminOutletShell() {
  return <Outlet />;
}
