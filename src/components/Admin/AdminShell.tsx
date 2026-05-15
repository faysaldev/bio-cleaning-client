"use client";

import { logout, selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Professional auth check
    if (!user || user.role !== "admin") {
      router.replace("/admin/login");
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  const handleSignOut = () => {
    dispatch(logout());
    router.replace("/admin/login");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-brand-cream grid place-items-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-green animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground font-medium">
            Verifying administrative access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center">
                <Sparkles className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-display text-xl font-bold">
                  BIO Admin
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-lime">
                  Control center
                </span>
              </span>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-lime text-brand-dark shadow-lg shadow-brand-lime/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-brand-lime text-brand-dark grid place-items-center font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold truncate max-w-[140px]">
                  {user?.name || "Admin"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  {user?.role || "Staff"}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-brand-lime hover:bg-white/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <button
              className="lg:hidden rounded-xl border border-border p-2"
              onClick={() => setOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-brand-green">
                Admin workspace
              </div>
              <h1 className="font-display text-2xl text-brand-dark">
                Cleaning operations
              </h1>
            </div>
            <Link href="/" className="btn-secondary hidden sm:inline-flex">
              View site
            </Link>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
