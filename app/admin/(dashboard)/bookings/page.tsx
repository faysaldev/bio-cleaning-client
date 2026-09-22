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
  RotateCcw,
  Search,
  Sparkles,
  User,
  X,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const filters: Array<{ value: "" | BookingStatus; label: string }> = [
  { value: "", label: "All Reservations" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function statusClass(status: string) {
  if (status === "CONFIRMED") return "border-brand-green/30 bg-brand-green/10 text-brand-green";
  if (status === "COMPLETED") return "border-brand-dark/20 bg-brand-dark text-brand-lime";
  if (status === "CANCELLED") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "border-amber-400/40 bg-amber-50 text-amber-800";
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
      setActionError(
        error?.data?.message || "The booking status could not be updated. Please try again."
      );
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
        description="We couldn't load reservations from the server. No booking data was changed."
        action={
          <button type="button" onClick={() => refetch()} className="btn-secondary">
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Booking Desk</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            Customer Reservations
          </h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Search customer records, track scheduled dates, and update statuses from pending to completed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/bookings/recovery"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-extrabold text-brand-dark shadow-xs hover:border-brand-green/40 hover:bg-[#F4FAF5] transition"
          >
            <RotateCcw className="h-4 w-4 text-brand-green" />
            <span>Recovery Queue</span>
          </Link>
          <Link
            href="/admin/bookings/manual"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-5 py-2.5 text-xs font-extrabold text-brand-dark shadow-md hover:bg-brand-lime/90 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Booking</span>
          </Link>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-end">
          <div>
            <label htmlFor="booking-search" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Search Bookings
            </label>
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
                  placeholder="Reference #, customer name, email, or phone…"
                  className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 pl-10 pr-4 py-2.5 text-xs font-medium text-brand-dark focus:border-brand-green focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={submitSearch}
                className="rounded-full bg-brand-green px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-brand-green/90 transition"
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <p className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Filter by Status
            </p>
            <div
              className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-[#F4FAF5] p-1"
              role="group"
              aria-label="Filter bookings by status"
            >
              {filters.map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={statusFilter === value}
                  onClick={() => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                    statusFilter === value
                      ? "bg-[#0C3629] text-brand-lime shadow-sm"
                      : "text-muted-foreground hover:text-brand-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(searchQuery || statusFilter) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-brand-green/10 pt-3 text-xs text-muted-foreground">
            <span className="font-semibold">Active filters:</span>
            {searchQuery ? (
              <span className="rounded-full border border-border bg-[#F4FAF5] px-3 py-0.5 font-bold text-brand-dark">
                Query: &quot;{searchQuery}&quot;
              </span>
            ) : null}
            {statusFilter ? (
              <span className="rounded-full border border-border bg-[#F4FAF5] px-3 py-0.5 font-bold text-brand-dark">
                Status: {statusFilter}
              </span>
            ) : null}
            <button
              type="button"
              className="font-extrabold text-brand-green hover:underline ml-1"
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

      {/* Action Error Alert */}
      {actionError ? (
        <div
          className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive flex items-center gap-2"
          role="alert"
        >
          <X className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      ) : null}

      {/* Bookings Table / List */}
      {isLoading ? (
        <TableSkeleton rows={7} columns={7} />
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-12 text-center">
          <EmptyState
            icon={Calendar}
            title="No reservations found"
            description={
              searchQuery || statusFilter
                ? "Try clearing or adjusting the search term to view all records."
                : "Customer reservations will appear here once bookings are placed."
            }
            action={
              searchQuery || statusFilter ? (
                <button
                  type="button"
                  className="btn-secondary mt-4"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                    setStatusFilter("");
                    setPage(1);
                  }}
                >
                  Reset Filters
                </button>
              ) : (
                <Link href="/admin/bookings/manual" className="btn-primary mt-4">
                  Create Booking
                </Link>
              )
            }
          />
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm hidden lg:block" aria-busy={isFetching}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-brand-green/10 bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Scheduled</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => (
                  <tr key={bookingId(booking)} className="hover:bg-[#F4FAF5]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                          <User className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="max-w-44 truncate text-sm font-extrabold text-brand-dark">
                            {booking.customerDetails.name}
                          </div>
                          <div className="max-w-44 truncate text-xs text-muted-foreground">
                            {booking.customerDetails.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-muted-foreground">
                      {booking.reference}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-brand-dark">{booking.serviceType}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {booking.propertySize} · {booking.frequency.replaceAll("_", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-brand-dark">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{booking.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-brand-dark font-medium">
                        <MapPin className="h-3.5 w-3.5 text-brand-green" />
                        <span>{booking.customerDetails.address.city}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground pl-5">
                        {booking.customerDetails.address.zip}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-brand-dark">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${statusClass(booking.status)}`}>
                          {booking.status}
                        </span>

                        {booking.status === "PENDING" ? (
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(bookingId(booking), "CANCELLED")}
                              disabled={isUpdating}
                              className="grid h-7 w-7 place-items-center rounded-full border border-border bg-white text-muted-foreground hover:border-destructive/40 hover:text-destructive disabled:opacity-50 transition"
                              aria-label={`Cancel booking ${booking.reference}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(bookingId(booking), "CONFIRMED")}
                              disabled={isUpdating}
                              className="grid h-7 w-7 place-items-center rounded-full bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50 transition"
                              aria-label={`Confirm booking ${booking.reference}`}
                            >
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : null}

                        {booking.status === "CONFIRMED" ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(bookingId(booking), "COMPLETED")}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 rounded-full bg-[#0C3629] px-3 py-1 text-[11px] font-extrabold text-brand-lime hover:bg-[#0C3629]/90 disabled:opacity-50 transition"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Complete</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden" aria-busy={isFetching}>
            {bookings.map((booking) => (
              <article key={bookingId(booking)} className="rounded-3xl border border-brand-green/10 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-green">{booking.reference}</span>
                    <h3 className="text-base font-extrabold text-brand-dark mt-0.5">{booking.customerDetails.name}</h3>
                    <p className="text-xs text-muted-foreground">{booking.customerDetails.email}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${statusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-y border-border/70 py-3 text-xs">
                  <div>
                    <span className="font-bold text-muted-foreground">Service</span>
                    <p className="font-semibold text-brand-dark mt-0.5">{booking.serviceType}</p>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground">Total</span>
                    <p className="font-black text-brand-dark mt-0.5">${Number(booking.totalAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground">Scheduled</span>
                    <p className="font-semibold text-brand-dark mt-0.5">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground">City</span>
                    <p className="font-semibold text-brand-dark mt-0.5">{booking.customerDetails.address.city}</p>
                  </div>
                </div>

                {booking.status === "PENDING" ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(bookingId(booking), "CANCELLED")}
                      disabled={isUpdating}
                      className="rounded-full border border-border bg-white py-2 text-xs font-extrabold text-muted-foreground hover:text-destructive"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(bookingId(booking), "CONFIRMED")}
                      disabled={isUpdating}
                      className="rounded-full bg-brand-green py-2 text-xs font-extrabold text-white"
                    >
                      Confirm
                    </button>
                  </div>
                ) : null}

                {booking.status === "CONFIRMED" ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(bookingId(booking), "COMPLETED")}
                    disabled={isUpdating}
                    className="w-full rounded-full bg-[#0C3629] py-2 text-xs font-extrabold text-brand-lime"
                  >
                    Mark Completed
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 ? (
        <nav
          className="rounded-3xl border border-brand-green/10 bg-white flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs"
          aria-label="Booking pagination"
        >
          <p className="text-xs font-semibold text-muted-foreground">
            Showing page <span className="font-extrabold text-brand-dark">{page}</span> of{" "}
            <span className="font-extrabold text-brand-dark">{totalPages}</span>
            {typeof meta.total === "number" ? <> · {meta.total.toLocaleString()} total</> : null}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isFetching}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-xs font-extrabold text-brand-dark hover:bg-[#F4FAF5] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isFetching}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2 text-xs font-extrabold text-brand-dark hover:bg-[#F4FAF5] disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
