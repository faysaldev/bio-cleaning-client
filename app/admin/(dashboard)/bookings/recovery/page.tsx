"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  Mail,
  Phone,
  RotateCcw,
  Users,
  Sparkles,
} from "lucide-react";
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
    <div className="space-y-8">
      {/* Top Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Demand Recovery</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            Booking Recovery Queue
          </h2>
          <p className="mt-1 max-w-3xl text-xs sm:text-sm text-muted-foreground">
            Review customers waiting for capacity and recover identifiable booking sessions that stopped prior to confirmation.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-extrabold text-brand-dark shadow-xs hover:border-brand-green/40 hover:bg-[#F4FAF5] transition shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bookings</span>
        </Link>
      </section>

      {/* Waitlist Section */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-brand-green/10">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-green/10 text-brand-green">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-extrabold text-brand-dark">Waitlist Requests</h3>
            <p className="text-xs text-muted-foreground">
              Customers who asked to be notified when capacity opens up.
            </p>
          </div>
        </div>

        {waitlist.isLoading ? (
          <div className="mt-6">
            <TableSkeleton rows={4} columns={5} />
          </div>
        ) : waitlist.isError ? (
          <div className="mt-6">
            <ErrorState
              title="Waitlist unavailable"
              description="The waitlist could not be loaded."
              action={
                <button className="btn-secondary" onClick={() => waitlist.refetch()}>
                  Try again
                </button>
              }
            />
          </div>
        ) : !waitlist.data?.data.length ? (
          <div className="mt-6 p-8 text-center">
            <EmptyState
              icon={Users}
              title="No customers on the waitlist"
              description="Waitlist requests will appear here when customers request slots on fully booked days."
            />
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Service</th>
                  <th className="px-5 py-3.5">Requested Date</th>
                  <th className="px-5 py-3.5">Frequency</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {waitlist.data.data.map((entry) => (
                  <tr key={entry._id} className="hover:bg-[#F4FAF5]/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-extrabold text-brand-dark">{entry.customer.name}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <a
                          href={`mailto:${entry.customer.email}`}
                          className="inline-flex items-center gap-1 hover:text-brand-green"
                        >
                          <Mail className="h-3 w-3" />
                          <span>{entry.customer.email}</span>
                        </a>
                        <a
                          href={`tel:${entry.customer.phone}`}
                          className="inline-flex items-center gap-1 hover:text-brand-green"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{entry.customer.phone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-dark">
                      {serviceName(entry.serviceId)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-brand-dark">{entry.requestedDate}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.preferredTime || "Any available time"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                      {entry.frequency.replaceAll("_", " ")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full border border-brand-green/20 bg-brand-green/5 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-brand-green">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recoverable Booking Sessions */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-brand-green/10">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-700">
            <RotateCcw className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-extrabold text-brand-dark">
              Recoverable Booking Sessions
            </h3>
            <p className="text-xs text-muted-foreground">
              Identifiable sessions with an email or phone number where checkout was paused.
            </p>
          </div>
        </div>

        {abandoned.isLoading ? (
          <div className="mt-6">
            <TableSkeleton rows={5} columns={5} />
          </div>
        ) : abandoned.isError ? (
          <div className="mt-6">
            <ErrorState
              title="Recovery queue unavailable"
              description="Abandoned booking sessions could not be loaded."
              action={
                <button className="btn-secondary" onClick={() => abandoned.refetch()}>
                  Try again
                </button>
              }
            />
          </div>
        ) : !abandoned.data?.data.length ? (
          <div className="mt-6 p-8 text-center">
            <EmptyState
              icon={RotateCcw}
              title="No abandoned sessions"
              description="Abandoned booking sessions will appear here automatically if visitors leave mid-checkout."
            />
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Service</th>
                  <th className="px-5 py-3.5">Stopped At</th>
                  <th className="px-5 py-3.5">Requested Slot</th>
                  <th className="px-5 py-3.5">Last Activity</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {abandoned.data.data.map((entry) => (
                  <tr key={entry._id} className="hover:bg-[#F4FAF5]/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-extrabold text-brand-dark">
                        {entry.customer?.name || "Potential Customer"}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {entry.customer?.email ? (
                          <a
                            href={`mailto:${entry.customer.email}`}
                            className="inline-flex items-center gap-1 hover:text-brand-green"
                          >
                            <Mail className="h-3 w-3" />
                            <span>{entry.customer.email}</span>
                          </a>
                        ) : null}
                        {entry.customer?.phone ? (
                          <a
                            href={`tel:${entry.customer.phone}`}
                            className="inline-flex items-center gap-1 hover:text-brand-green"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{entry.customer.phone}</span>
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-dark">
                      {serviceName(entry.serviceId)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-amber-800">
                        {entry.stage.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-brand-dark">
                        {entry.requestedDate || "Not chosen"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.requestedTime || "No time selected"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {new Date(entry.lastActivityAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {entry.leadId ? (
                        <Link
                          href={`/admin/leads/${entry.leadId}`}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3.5 py-1 text-xs font-extrabold text-brand-dark hover:border-brand-green hover:text-brand-green shadow-xs transition"
                        >
                          <span>Open Lead</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
