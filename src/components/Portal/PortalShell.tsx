"use client";

import { Bell, CalendarDays, CreditCard, Home, LogOut, Receipt, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { LOGO_URL } from "../Footer";
import { LoadingState } from "../ui/feedback";
import { useGetPortalSessionQuery, useLogoutPortalMutation } from "@/src/redux/features/portal/portalApi";

const nav = [
  { href: "/portal", label: "Overview", icon: Home },
  { href: "/portal/bookings", label: "Appointments", icon: CalendarDays },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
  { href: "/portal/payments", label: "Payments", icon: CreditCard },
  { href: "/portal/notifications", label: "Updates", icon: Bell },
  { href: "/portal/profile", label: "Profile", icon: UserRound },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isFetching, isError } = useGetPortalSessionQuery();
  const [logout] = useLogoutPortalMutation();

  useEffect(() => {
    if (data?.csrfToken) sessionStorage.setItem("bio_portal_csrf", data.csrfToken);
    if (!isLoading && !isFetching && isError) {
      sessionStorage.removeItem("bio_portal_csrf");
      router.replace("/portal/login");
    }
  }, [data, isLoading, isFetching, isError, router]);

  const signOut = async () => {
    try { await logout().unwrap(); } catch {}
    sessionStorage.removeItem("bio_portal_csrf");
    router.replace("/portal/login");
  };

  if (isLoading || isFetching || !data?.customer) {
    return <div className="min-h-screen bg-brand-cream p-6"><div className="mx-auto max-w-xl pt-[24vh]"><LoadingState label="Opening your customer portal…" /></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-foreground">
      {/* Portal Top Bar */}
      <header className="sticky top-0 z-40 border-b border-brand-green/12 bg-[#0C3629] text-white shadow-sm backdrop-blur-xl">
        <div className="container-page flex min-h-[72px] items-center justify-between gap-4 py-3">
          <Link href="/portal" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <Image src={LOGO_URL} alt="BIO Cleaning LLC" width={42} height={42} className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-lime/30" />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-brand-lime ring-2 ring-[#0C3629]" />
            </div>
            <span>
              <span className="block text-base font-extrabold tracking-tight text-white group-hover:text-brand-lime transition-colors">BIO Cleaning</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-brand-lime">Customer Portal</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-white">{data.customer.name}</p>
              <p className="text-xs text-white/60">{data.customer.email}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-lime text-brand-dark font-extrabold text-sm shadow-sm">
              {data.customer.name?.charAt(0) || "U"}
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Portal Body */}
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-8">
        <aside>
          <nav className="rounded-3xl border border-brand-green/12 bg-white p-3 shadow-sm flex gap-1 overflow-x-auto lg:block lg:space-y-1.5" aria-label="Customer portal navigation">
            <div className="hidden lg:block px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
              Account Menu
            </div>
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/portal" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-w-max items-center gap-2.5 rounded-full px-4 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#0C3629] text-white shadow-md ring-1 ring-brand-lime/30"
                      : "text-muted-foreground hover:bg-[#F4FAF5] hover:text-brand-dark"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-brand-lime" : "text-muted-foreground"}`} />
                  {label}
                  {active ? <span className="ml-auto hidden lg:inline-block h-1.5 w-1.5 rounded-full bg-brand-lime" /> : null}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
