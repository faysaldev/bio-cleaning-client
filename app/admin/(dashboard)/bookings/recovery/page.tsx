"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, Mail, Phone, RotateCcw, Users } from "lucide-react";
import {
  useGetAdminAbandonedBookingsQuery,
  useGetAdminWaitlistQuery,
} from "@/src/redux/features/bookings/bookingsApi";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";

function serviceName(service: string | { _id: string; name: string } | undefined) {
  return typeof service === "object" ? service.name : "Cleaning service";
}

export default function BookingRecoveryPage() {
  const waitlist = useGetAdminWaitlistQuery({ limit: 50 });
  const abandoned = useGetAdminAbandonedBookingsQuery({ limit: 50, hasContact: true });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="editorial-kicker">Booking recovery</span>
          <h2 className="admin-page-heading mt-3 text-brand-dark">Demand that did not become a booking.</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Review customers waiting for capacity and recover identifiable booking sessions that stopped before confirmation.
          </p>
        </div>
        <Link href="/admin/bookings" className="btn-secondary shrink-0"><ArrowLeft className="h-4 w-4" />Back to bookings</Link>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/8 text-brand-green"><CalendarClock className="h-5 w-5" /></span><div><h3 className="text-xl font-extrabold text-brand-dark">Waitlist</h3><p className="text-xs text-muted-foreground">Customers who asked to be notified when capacity opens.</p></div></div>
        {waitlist.isLoading ? <div className="mt-5"><TableSkeleton rows={4} columns={5} /></div> : waitlist.isError ? <div className="mt-5"><ErrorState title="Waitlist unavailable" description="The waitlist could not be loaded." action={<button className="btn-secondary" onClick={() => waitlist.refetch()}>Try again</button>} /></div> : !waitlist.data?.data.length ? <div className="mt-5"><EmptyState icon={Users} title="No customers are waiting" description="Waitlist requests will appear here when a selected date has no live capacity." /></div> : <div className="mt-5 table-shell overflow-x-auto"><table className="data-table min-w-[820px]"><thead><tr><th>Customer</th><th>Service</th><th>Requested</th><th>Frequency</th><th>Status</th></tr></thead><tbody>{waitlist.data.data.map((entry) => <tr key={entry._id}><td><p className="font-bold text-brand-dark">{entry.customer.name}</p><div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground"><a href={`mailto:${entry.customer.email}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Mail className="h-3 w-3" />{entry.customer.email}</a><a href={`tel:${entry.customer.phone}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Phone className="h-3 w-3" />{entry.customer.phone}</a></div></td><td className="font-semibold text-brand-dark">{serviceName(entry.serviceId)}</td><td><p className="font-semibold text-brand-dark">{entry.requestedDate}</p><p className="text-[11px] text-muted-foreground">{entry.preferredTime || "Any available time"}</p></td><td className="text-xs font-semibold text-muted-foreground">{entry.frequency.replaceAll("_", " ")}</td><td><span className="status-badge border-brand-green/20 bg-brand-green/5 text-brand-green">{entry.status}</span></td></tr>)}</tbody></table></div>}
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-yellow/20 text-brand-dark"><RotateCcw className="h-5 w-5" /></span><div><h3 className="text-xl font-extrabold text-brand-dark">Recoverable booking sessions</h3><p className="text-xs text-muted-foreground">Only sessions with an email or phone are shown here.</p></div></div>
        {abandoned.isLoading ? <div className="mt-5"><TableSkeleton rows={5} columns={5} /></div> : abandoned.isError ? <div className="mt-5"><ErrorState title="Recovery queue unavailable" description="Abandoned booking sessions could not be loaded." action={<button className="btn-secondary" onClick={() => abandoned.refetch()}>Try again</button>} /></div> : !abandoned.data?.data.length ? <div className="mt-5"><EmptyState icon={RotateCcw} title="No recoverable sessions" description="Identifiable booking sessions will appear here if customers leave before confirmation." /></div> : <div className="mt-5 table-shell overflow-x-auto"><table className="data-table min-w-[900px]"><thead><tr><th>Customer</th><th>Service</th><th>Stopped at</th><th>Requested slot</th><th>Last activity</th></tr></thead><tbody>{abandoned.data.data.map((entry) => <tr key={entry._id}><td><p className="font-bold text-brand-dark">{entry.customer?.name || "Potential customer"}</p><div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">{entry.customer?.email ? <a href={`mailto:${entry.customer.email}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Mail className="h-3 w-3" />{entry.customer.email}</a> : null}{entry.customer?.phone ? <a href={`tel:${entry.customer.phone}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Phone className="h-3 w-3" />{entry.customer.phone}</a> : null}</div></td><td className="font-semibold text-brand-dark">{serviceName(entry.serviceId)}</td><td><span className="status-badge border-brand-yellow/35 bg-brand-yellow/15 text-brand-dark">{entry.stage.replaceAll("_", " ")}</span></td><td><p className="text-sm font-semibold text-brand-dark">{entry.requestedDate || "Not chosen"}</p><p className="text-[11px] text-muted-foreground">{entry.requestedTime || "No time selected"}</p></td><td className="text-xs text-muted-foreground">{new Date(entry.lastActivityAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
