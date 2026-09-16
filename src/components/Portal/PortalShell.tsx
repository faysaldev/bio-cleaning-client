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
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--brand-cream)_0%,var(--background)_24rem)] text-foreground">
      <header className="border-b border-border/80 bg-white/92 backdrop-blur-xl">
        <div className="container-page flex min-h-[76px] items-center gap-4 py-3">
          <Link href="/portal" className="inline-flex items-center gap-3">
            <Image src={LOGO_URL} alt="BIO Cleaning LLC" width={44} height={44} className="h-11 w-11 rounded-xl object-cover" />
            <span>
              <span className="block text-sm font-extrabold tracking-[-0.025em] text-brand-dark">BIO Cleaning</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green">Customer portal</span>
            </span>
          </Link>
          <div className="ml-auto hidden text-right sm:block">
            <p className="text-sm font-bold text-brand-dark">{data.customer.name}</p>
            <p className="text-xs text-muted-foreground">{data.customer.email}</p>
          </div>
          <button type="button" onClick={signOut} className="btn-secondary !px-3" aria-label="Sign out"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>
        </div>
      </header>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-8">
        <aside>
          <nav className="surface flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1" aria-label="Customer portal navigation">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/portal" && pathname.startsWith(href));
              return <Link key={href} href={href} className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-brand-dark text-white" : "text-muted-foreground hover:bg-brand-cream hover:text-brand-dark"}`}><Icon className="h-4 w-4" />{label}</Link>;
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
