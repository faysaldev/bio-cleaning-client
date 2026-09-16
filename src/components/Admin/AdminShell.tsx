"use client";

import { clearSession, selectCurrentUser, setSession } from "@/src/redux/features/auth/authSlice";
import { useGetSessionQuery, useLogoutSessionMutation } from "@/src/redux/features/auth/authApi";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CreditCard,
  FileText,
  Globe2,
  Receipt,
  LayoutDashboard,
  LogOut,
  Mail,
  MessagesSquare,
  Menu,
  UsersRound,
  UserRoundSearch,
  UserCog,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { LOGO_URL } from "../Footer";
import Image from "next/image";
import { LoadingState } from "@/src/components/ui/feedback";
import { AdminCommandPalette } from "@/src/components/Admin/AdminCommandPalette";
import { adminWorkspaceRoles } from "@/src/lib/roles";
import type { UserRole } from "@/src/redux/features/auth/types";

const navItems: Array<{ href: string; label: string; icon: any; roles: UserRole[] }> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: adminWorkspaceRoles },
  { href: "/admin/dispatch", label: "Dispatch", icon: CalendarDays, roles: ["owner", "admin", "manager", "dispatcher", "support", "read_only"] },
  { href: "/admin/team", label: "Team & crews", icon: UserCog, roles: ["owner", "admin", "manager", "dispatcher", "support", "read_only"] },
  { href: "/admin/leads", label: "Leads", icon: UserRoundSearch, roles: adminWorkspaceRoles },
  { href: "/admin/customers", label: "Customers", icon: UsersRound, roles: adminWorkspaceRoles },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, roles: adminWorkspaceRoles },
  { href: "/admin/quotes", label: "Quotes", icon: FileText, roles: adminWorkspaceRoles },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt, roles: adminWorkspaceRoles },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, roles: adminWorkspaceRoles },
  { href: "/admin/services", label: "Services", icon: Sparkles, roles: adminWorkspaceRoles },
  { href: "/admin/website", label: "Website", icon: Globe2, roles: ["owner", "admin", "manager", "support", "read_only"] },
  { href: "/admin/settings/scheduling", label: "Scheduling", icon: CalendarClock, roles: ["owner", "admin", "manager", "dispatcher", "read_only"] },
  { href: "/admin/contacts", label: "Contacts", icon: Mail, roles: adminWorkspaceRoles },
  { href: "/admin/communications", label: "Communications", icon: MessagesSquare, roles: adminWorkspaceRoles },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: adminWorkspaceRoles },
];

function sectionTitle(pathname: string) {
  if (pathname.startsWith("/admin/dispatch")) return "Dispatch & field operations";
  if (pathname.startsWith("/admin/team")) return "Team & crews";
  if (pathname.startsWith("/admin/leads/follow-ups")) return "Lead follow-ups";
  if (pathname.startsWith("/admin/leads")) return "Leads & pipeline";
  if (pathname.startsWith("/admin/customers")) return "Customers";
  if (pathname.startsWith("/admin/bookings/manual")) return "Create booking";
  if (pathname.startsWith("/admin/quotes")) return "Quotes & estimates";
  if (pathname.startsWith("/admin/invoices")) return "Invoices & collections";
  if (pathname.startsWith("/admin/payments")) return "Payments & refunds";
  if (pathname.startsWith("/admin/bookings")) return "Bookings";
  if (pathname.startsWith("/admin/services")) return "Services";
  if (pathname.startsWith("/admin/website")) return "Website & CMS";
  if (pathname.startsWith("/admin/contacts")) return "Contacts";
  if (pathname.startsWith("/admin/communications")) return "Communications & retention";
  if (pathname.startsWith("/admin/settings/scheduling")) return "Scheduling & capacity";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Operations overview";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { data: session, isLoading, isFetching, isError } = useGetSessionQuery();
  const [logoutSession] = useLogoutSessionMutation();

  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    if (session?.user) {
      if (!adminWorkspaceRoles.includes(session.user.role)) {
        dispatch(clearSession());
        router.replace("/admin/login");
        return;
      }
      dispatch(setSession(session));
      return;
    }

    if (!isLoading && !isFetching && isError) {
      dispatch(clearSession());
      router.replace("/admin/login");
    }
  }, [session, isLoading, isFetching, isError, dispatch, router]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logoutSession().unwrap();
    } catch {
      // Local session state is still cleared if the server session already expired.
    } finally {
      dispatch(clearSession());
      router.replace("/admin/login");
    }
  };

  if (isLoading || isFetching || !user || !adminWorkspaceRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-brand-cream p-5 lg:p-10">
        <div className="mx-auto max-w-xl pt-[24vh]">
          <LoadingState label="Verifying administrative access…" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--brand-cream)_0%,var(--background)_24rem)] text-foreground">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-brand-dark/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/8 bg-sidebar text-sidebar-foreground shadow-[16px_0_50px_-38px_rgba(5,35,20,.65)] transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-offset-4">
              <Image
                src={LOGO_URL}
                alt="BIO Cleaning LLC logo"
                width={46}
                height={46}
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/15"
              />
              <span>
                <span className="block text-sm font-extrabold tracking-[-0.025em] text-white">BIO Cleaning</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Operations</span>
              </span>
            </Link>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/8 hover:text-white lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close admin menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="mt-7 flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-semibold text-white/58 transition hover:border-white/18 hover:bg-white/8 hover:text-white"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">Search workspace</span>
            <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/42">⌘K</kbd>
          </button>

          <nav className="mt-6 space-y-1" aria-label="Admin navigation">
            <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/32">Workspace</p>
            {navItems.filter((item) => item.roles.includes(user.role)).map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-lime text-brand-dark shadow-[0_8px_18px_-14px_rgba(210,239,75,.8)]"
                      : "text-white/62 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/8 pt-4">
            <div className="flex items-center gap-3 px-2 py-2">
              {user.image ? (
                <img src={user.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-lime text-sm font-extrabold text-brand-dark">
                  {user.name?.charAt(0) || "A"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">{user.name || "Admin"}</div>
                <div className="truncate text-[11px] text-white/42">{user.email}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-white/55 transition hover:bg-white/7 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
          <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-white text-brand-dark shadow-sm lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-green">Admin workspace</div>
              <h1 className="truncate text-lg font-bold tracking-[-0.03em] text-brand-dark sm:text-xl">{sectionTitle(pathname)}</h1>
            </div>

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden min-w-52 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-brand-green/40 hover:text-brand-dark md:flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="flex-1 text-left">Search or jump to…</span>
              <kbd className="rounded border border-border bg-brand-cream px-1.5 py-0.5 font-mono text-[9px]">⌘K</kbd>
            </button>

            <Link href="/" className="btn-secondary hidden sm:inline-flex">
              View site
            </Link>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <AdminCommandPalette open={commandOpen} onClose={closeCommand} role={user.role} />
    </div>
  );
}
