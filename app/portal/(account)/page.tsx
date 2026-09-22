"use client";

import { Bell, CalendarDays, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPortalOverviewQuery } from "@/src/redux/features/portal/portalApi";

const money = (value:number,currency="USD") => new Intl.NumberFormat("en-US",{style:"currency",currency}).format(value||0);
export default function PortalOverviewPage(){
  const {data,isLoading,isError,refetch}=useGetPortalOverviewQuery();
  if(isLoading)return <LoadingState label="Loading your account…"/>;
  if(isError||!data)return <ErrorState action={<button className="btn-secondary" onClick={()=>refetch()}>Try again</button>}/>;
  const due=data.invoices.reduce((sum,i)=>sum+Number(i.amountDue||0),0);
  const paid=data.payments.filter(p=>p.type==="PAYMENT"&&p.status==="SUCCEEDED").reduce((sum,p)=>sum+Number(p.amount||0),0)-data.payments.filter(p=>p.type==="REFUND"&&p.status==="SUCCEEDED").reduce((sum,p)=>sum+Number(p.amount||0),0);
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-[#0C3629] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-lime/15 blur-2xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime">
            Customer Dashboard
          </span>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Hi, {data.customer.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-white/70 max-w-xl leading-relaxed">
            Appointments, billing, receipts and preferences—all in one place.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [CalendarDays, "Upcoming", data.upcoming.length, "/portal/bookings"],
          [Receipt, "Balance due", money(due, data.invoices[0]?.currency || "USD"), "/portal/invoices"],
          [CreditCard, "Recent paid", money(paid, data.payments[0]?.currency || "USD"), "/portal/payments"],
          [Bell, "Unread updates", data.unreadNotifications, "/portal/notifications"],
        ].map(([Icon, label, value, href]: any) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-brand-green/12 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4FAF5] text-brand-green group-hover:bg-[#0C3629] group-hover:text-brand-lime transition-colors">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">View</span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">{value}</p>
          </Link>
        ))}
      </div>

      {/* Next Appointments */}
      <section className="rounded-3xl border border-brand-green/12 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-brand-green/8">
          <div>
            <h2 className="text-xl font-extrabold text-brand-dark">Next Appointments</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your upcoming scheduled cleaning visits.</p>
          </div>
          <Link href="/portal/bookings" className="btn-secondary rounded-full px-5 text-xs font-bold">
            View all appointments
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {data.upcoming.length ? (
            data.upcoming.map((b: any) => (
              <div
                key={b._id}
                className="rounded-2xl border border-brand-green/12 bg-[#F7FAF8] p-4 sm:p-5 transition hover:border-brand-green/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-brand-dark text-base">{b.serviceType}</p>
                      <span className="inline-flex items-center rounded-full bg-brand-lime/20 border border-brand-lime/40 px-2.5 py-0.5 text-[11px] font-bold text-[#0C3629]">
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(b.startAt || b.date).toLocaleString()} · Ref: {b.reference}
                    </p>
                  </div>
                  <Link href="/portal/bookings" className="btn-secondary rounded-full px-4 text-xs font-bold">
                    Manage
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No upcoming visits.{" "}
              <Link href="/book" className="font-bold text-brand-green underline hover:text-brand-dark">
                Book a cleaning
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
