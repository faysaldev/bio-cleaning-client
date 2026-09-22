"use client";

import { BookingWizard } from "@/src/components/Booking/BookingWizard";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManualBookingPage() {
  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Admin Reservation</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            Create Live Booking
          </h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Manual bookings enforce the same server-authoritative rates, real-time crew capacity, and duration rules as customer bookings.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-extrabold text-brand-dark shadow-xs hover:border-brand-green/40 hover:bg-[#F4FAF5] transition shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      {/* Booking Wizard Container */}
      <div className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <BookingWizard mode="admin" />
      </div>
    </div>
  );
}
