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
  return <div className="space-y-6">
    <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">Welcome back</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">Hi, {data.customer.name.split(" ")[0]}</h1><p className="mt-2 text-sm text-muted-foreground">Appointments, billing, receipts and preferences—all in one place.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      [CalendarDays,"Upcoming",data.upcoming.length,"/portal/bookings"],[Receipt,"Balance due",money(due,data.invoices[0]?.currency||"USD"),"/portal/invoices"],[CreditCard,"Recent paid",money(paid,data.payments[0]?.currency||"USD"),"/portal/payments"],[Bell,"Unread updates",data.unreadNotifications,"/portal/notifications"]
    ].map(([Icon,label,value,href]:any)=><Link key={label} href={href} className="surface p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><Icon className="h-5 w-5 text-brand-green"/><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-extrabold text-brand-dark">{value}</p></Link>)}</div>
    <section className="surface p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-extrabold text-brand-dark">Next appointments</h2><p className="text-sm text-muted-foreground">Your upcoming cleaning visits.</p></div><Link href="/portal/bookings" className="btn-secondary">View all</Link></div><div className="mt-5 space-y-3">{data.upcoming.length?data.upcoming.map((b:any)=><div key={b._id} className="rounded-xl border border-border bg-brand-cream/40 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-brand-dark">{b.serviceType}</p><p className="text-sm text-muted-foreground">{new Date(b.startAt||b.date).toLocaleString()} · {b.reference}</p></div><span className="status-badge">{b.status}</span></div></div>):<p className="py-6 text-sm text-muted-foreground">No upcoming visits. <Link href="/book" className="font-bold text-brand-green">Book a cleaning</Link>.</p>}</div></section>
  </div>;
}
