"use client";

import { Booking, recentBookings } from "@/src/utils/adminData";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

function statusClass(status: Booking["status"]) {
  if (status === "Confirmed") return "bg-brand-lime text-brand-dark";
  if (status === "Completed") return "bg-brand-green text-white";
  if (status === "Cancelled") return "bg-destructive/10 text-destructive";
  return "bg-brand-cream text-brand-green";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(recentBookings);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      bookings.filter((booking) =>
        `${booking.customer} ${booking.service} ${booking.id} ${booking.location}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [bookings, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageBookings = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmBooking = (id: string) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status: "Confirmed" } : booking,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-brand-dark p-6 text-white">
        <span className="pill bg-brand-lime text-brand-dark">
          Booking desk
        </span>
        <h2 className="mt-4 text-4xl">Review, paginate, and confirm jobs</h2>
        <p className="mt-3 max-w-2xl text-white/65">
          Keep incoming cleaning requests organized before the team is assigned.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-white p-5 shadow-card">
        <label className="relative block max-w-md">
          <Search className="absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search booking, customer, service..."
            className="w-full rounded-2xl border border-border bg-brand-cream py-3 pl-11 pr-4 outline-none focus:border-brand-green"
          />
        </label>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Booking</th>
                <th className="p-3">Service</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-bold text-brand-dark">
                      {booking.customer}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {booking.id} · {booking.location}
                    </div>
                  </td>
                  <td className="p-3">{booking.service}</td>
                  <td className="p-3">
                    {booking.date}
                    <div className="text-xs text-muted-foreground">
                      {booking.time}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => confirmBooking(booking.id)}
                      disabled={booking.status === "Confirmed"}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-green disabled:opacity-40"
                    >
                      <Check className="w-3.5 h-3.5" /> Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-full border border-border p-2 disabled:opacity-40"
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded-full border border-border p-2 disabled:opacity-40"
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
