"use client";

import { useState } from "react";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/src/redux/features/bookings/bookingsApi";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  Calendar,
  Clock,
  User,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

function statusClass(status: string) {
  if (status === "CONFIRMED") return "bg-brand-lime text-brand-dark";
  if (status === "COMPLETED") return "bg-brand-green text-white";
  if (status === "CANCELLED") return "bg-destructive/10 text-destructive";
  return "bg-brand-cream text-brand-green";
}

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: bookingsResponse, isLoading, isError } = useGetAllBookingsQuery({
    page,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
      setPage(1);
    }
  };

  const bookings = bookingsResponse?.data || [];
  const meta = bookingsResponse?.meta;
  const totalPages = meta?.totalPage || 1;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-brand-dark p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-green/10 to-transparent" />
        <span className="pill bg-brand-lime text-brand-dark">Booking desk</span>
        <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold">Manage Reservations</h2>
        <p className="mt-3 max-w-2xl text-white/65 text-lg">
          Approve, schedule, and finalize cleaning jobs with real-time status tracking.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="w-full md:max-w-md">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Search Bookings (Press Enter)
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Reference, Customer, or Phone..."
              className="w-full rounded-2xl border border-border bg-brand-cream py-3.5 pl-11 pr-4 outline-none focus:border-brand-green transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 bg-brand-cream p-1.5 rounded-2xl border border-border">
          {["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                  : "hover:bg-white text-muted-foreground"
              }`}
            >
              {s || "ALL"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white border border-border p-20 text-center">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-bold text-brand-dark">No bookings found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={(booking as any)._id || (booking as any).id}
              className="group rounded-3xl bg-white border border-border p-6 hover:shadow-xl hover:border-brand-green/30 transition-all duration-300 overflow-x-auto"
            >
              <div className="grid md:grid-cols-[1fr_auto] gap-6 min-w-[600px] md:min-w-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black tracking-widest text-brand-green bg-brand-green/5 px-3 py-1 rounded-lg uppercase">
                      {booking.reference}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-black px-3 py-1 rounded-full ${statusClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-brand-green" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Customer</div>
                        <div className="font-bold text-brand-dark text-xs leading-none">{booking.customerDetails.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-brand-green" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Date & Time</div>
                        <div className="font-bold text-brand-dark text-xs leading-none">{new Date(booking.date).toLocaleDateString()} · {booking.timeSlot}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-brand-green" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Service</div>
                        <div className="font-bold text-brand-dark text-xs leading-none">{booking.serviceType} · {booking.propertySize}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-brand-green" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Location</div>
                        <div className="font-bold text-brand-dark text-xs leading-none">{booking.customerDetails.address.city}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Amount</div>
                    <div className="text-3xl font-display font-bold text-brand-dark">${booking.totalAmount}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus((booking as any)._id || (booking as any).id, "CANCELLED")}
                          disabled={isUpdating}
                          className="btn-secondary px-4 py-2 text-xs"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStatus((booking as any)._id || (booking as any).id, "CONFIRMED")}
                          disabled={isUpdating}
                          className="btn-primary px-4 py-2 text-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleUpdateStatus((booking as any)._id || (booking as any).id, "COMPLETED")}
                        disabled={isUpdating}
                        className="bg-brand-green text-white font-bold rounded-xl px-5 py-2 text-xs flex items-center gap-2 hover:bg-brand-dark transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] border border-border">
          <div className="text-sm text-muted-foreground pl-2 font-medium">
            Page <span className="text-brand-dark font-bold">{page}</span> of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-3 rounded-xl bg-brand-cream hover:bg-brand-green/10 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-xl bg-brand-cream hover:bg-brand-green/10 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { Sparkles } from "lucide-react";
