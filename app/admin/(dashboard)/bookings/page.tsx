"use client";

import { useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/src/redux/features/bookings/bookingsApi";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const filters: Array<{ value: "" | BookingStatus; label: string }> = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function statusClass(status: string) {
  if (status === "CONFIRMED") return "border-brand-green/25 bg-brand-green/8 text-brand-green";
  if (status === "COMPLETED") return "border-brand-dark/20 bg-brand-dark text-white";
  if (status === "CANCELLED") return "border-destructive/20 bg-destructive/7 text-destructive";
  return "border-brand-yellow/45 bg-brand-yellow/15 text-brand-dark";
}

function bookingId(booking: { _id?: string; id?: string }) {
  return booking._id || booking.id || "";
}

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [actionError, setActionError] = useState("");

  const {
    data: bookingsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllBookingsQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    if (!id) return;
    setActionError("");
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (error: any) {
      setActionError(error?.data?.message || "The booking status could not be updated. Please try again.");
    }
  };

  const submitSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const bookings = bookingsResponse?.data || [];
  const meta = bookingsResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  if (isError) {
    return (
      <ErrorState
        title="Bookings are unavailable"
        description="We couldn’t load reservations from the server. No booking data was changed."
        action={<button type="button" onClick={() => refetch()} className="btn-secondary">Try again</button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="editorial-kicker">Booking desk</span>
          <h2 className="admin-page-heading mt-3 text-brand-dark">Reservations, without the noise.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Search customers, track each job, and move bookings through confirmation and completion from one responsive workspace.
          </p>
        </div>
        <Link href="/admin/bookings/manual" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Manual booking
        </Link>
      </section>

      <section className="surface p-4 sm:p-5" aria-label="Booking filters">
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-end">
          <div>
            <label htmlFor="booking-search" className="field-label">Search bookings</label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="booking-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitSearch();
                  }}
                  placeholder="Reference, customer, email or phone"
                  className="field-control pl-10"
                />
              </div>
              <button type="button" onClick={submitSearch} className="btn-secondary px-4">Search</button>
            </div>
          </div>

          <div>
            <p className="field-label">Status</p>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-brand-cream/55 p-1" role="group" aria-label="Filter bookings by status">
              {filters.map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={statusFilter === value}
                  onClick={() => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${
                    statusFilter === value
                      ? "bg-brand-dark text-white shadow-sm"
                      : "text-muted-foreground hover:bg-white hover:text-brand-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(searchQuery || statusFilter) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
            <span className="font-semibold">Active filters:</span>
            {searchQuery ? <span className="rounded-md border border-border bg-white px-2 py-1 font-semibold text-brand-dark">Search: {searchQuery}</span> : null}
            {statusFilter ? <span className="rounded-md border border-border bg-white px-2 py-1 font-semibold text-brand-dark">{statusFilter}</span> : null}
            <button
              type="button"
              className="font-extrabold text-brand-green hover:text-brand-dark"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setStatusFilter("");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {actionError ? (
        <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          <div><p className="font-bold">Couldn’t update booking</p><p className="mt-0.5 text-xs opacity-80">{actionError}</p></div>
        </div>
      ) : null}

      {isLoading ? (
        <TableSkeleton rows={7} columns={7} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings match this view"
          description={searchQuery || statusFilter ? "Clear or adjust the filters to broaden the result set." : "Online and manual reservations will appear here once customers start booking."}
          action={
            searchQuery || statusFilter ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setStatusFilter("");
                  setPage(1);
                }}
              >
                Reset filters
              </button>
            ) : (
              <Link href="/admin/bookings/manual" className="btn-primary">Create booking</Link>
            )
          }
        />
      ) : (
        <>
          <div className="table-shell hidden overflow-x-auto lg:block" aria-busy={isFetching}>
            <table className="data-table min-w-[980px]">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Reference</th>
                  <th>Service</th>
                  <th>Scheduled</th>
                  <th>Location</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={bookingId(booking)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-cream text-brand-green"><User className="h-3.5 w-3.5" /></span>
                        <div className="min-w-0">
                          <div className="max-w-44 truncate text-sm font-bold text-brand-dark">{booking.customerDetails.name}</div>
                          <div className="max-w-44 truncate text-[11px] text-muted-foreground">{booking.customerDetails.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs font-semibold text-muted-foreground">{booking.reference}</td>
                    <td>
                      <div className="text-sm font-semibold text-brand-dark">{booking.serviceType}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{booking.propertySize} · {booking.frequency.replaceAll("_", " ")}</div>
                    </td>
                    <td>
                      <div className="text-sm font-semibold text-brand-dark">{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{booking.timeSlot}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm text-brand-dark"><MapPin className="h-3.5 w-3.5 text-brand-green" />{booking.customerDetails.address.city}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{booking.customerDetails.address.zip}</div>
                    </td>
                    <td className="text-right text-sm font-extrabold text-brand-dark">${Number(booking.totalAmount).toFixed(2)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <span className={`status-badge ${statusClass(booking.status)}`}>{booking.status}</span>
                        {booking.status === "PENDING" ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(bookingId(booking), "CANCELLED")}
                              disabled={isUpdating}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-white text-muted-foreground hover:border-destructive/30 hover:text-destructive disabled:opacity-50"
                              aria-label={`Cancel booking ${booking.reference}`}
                            ><X className="h-3.5 w-3.5" /></button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(bookingId(booking), "CONFIRMED")}
                              disabled={isUpdating}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green text-white hover:bg-brand-dark disabled:opacity-50"
                              aria-label={`Confirm booking ${booking.reference}`}
                            ><Check className="h-3.5 w-3.5" /></button>
                          </div>
                        ) : null}
                        {booking.status === "CONFIRMED" ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(bookingId(booking), "COMPLETED")}
                            disabled={isUpdating}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-dark px-2.5 text-[11px] font-extrabold text-white hover:bg-brand-green disabled:opacity-50"
                          ><CheckCircle2 className="h-3.5 w-3.5" /> Complete</button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden" aria-busy={isFetching}>
            {bookings.map((booking) => (
              <article key={bookingId(booking)} className="surface p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold text-brand-green">{booking.reference}</p>
                    <h3 className="mt-1 truncate text-base font-bold text-brand-dark">{booking.customerDetails.name}</h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{booking.customerDetails.email}</p>
                  </div>
                  <span className={`status-badge shrink-0 ${statusClass(booking.status)}`}>{booking.status}</span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border/70 py-4 text-xs">
                  <div><dt className="font-bold text-muted-foreground">Service</dt><dd className="mt-1 font-semibold text-brand-dark">{booking.serviceType}</dd></div>
                  <div><dt className="font-bold text-muted-foreground">Amount</dt><dd className="mt-1 font-extrabold text-brand-dark">${Number(booking.totalAmount).toFixed(2)}</dd></div>
                  <div><dt className="font-bold text-muted-foreground">Scheduled</dt><dd className="mt-1 font-semibold text-brand-dark">{new Date(booking.date).toLocaleDateString()} · {booking.timeSlot}</dd></div>
                  <div><dt className="font-bold text-muted-foreground">Location</dt><dd className="mt-1 font-semibold text-brand-dark">{booking.customerDetails.address.city}</dd></div>
                </dl>

                {booking.status === "PENDING" ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => handleUpdateStatus(bookingId(booking), "CANCELLED")} disabled={isUpdating} className="btn-secondary"><X className="h-3.5 w-3.5" /> Cancel</button>
                    <button type="button" onClick={() => handleUpdateStatus(bookingId(booking), "CONFIRMED")} disabled={isUpdating} className="btn-primary"><Check className="h-3.5 w-3.5" /> Confirm</button>
                  </div>
                ) : null}
                {booking.status === "CONFIRMED" ? (
                  <button type="button" onClick={() => handleUpdateStatus(bookingId(booking), "COMPLETED")} disabled={isUpdating} className="btn-primary mt-4 w-full"><CheckCircle2 className="h-4 w-4" /> Mark completed</button>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="surface flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Booking pagination">
          <p className="px-1 text-xs font-semibold text-muted-foreground">
            Showing page <span className="font-extrabold text-brand-dark">{page}</span> of <span className="font-extrabold text-brand-dark">{totalPages}</span>
            {typeof meta.total === "number" ? <> · {meta.total.toLocaleString()} total</> : null}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || isFetching} className="btn-secondary flex-1 px-3 sm:flex-none"><ChevronLeft className="h-4 w-4" /> Previous</button>
            <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || isFetching} className="btn-secondary flex-1 px-3 sm:flex-none">Next <ChevronRight className="h-4 w-4" /></button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
