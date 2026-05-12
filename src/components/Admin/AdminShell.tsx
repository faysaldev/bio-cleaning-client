"use client";

import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
            <div className="text-sm font-semibold">Faysal Mridha</div>
            <div className="text-xs text-white/55">Administrator</div>
            <Link
              href="/admin/login"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-lime"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </Link>
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
