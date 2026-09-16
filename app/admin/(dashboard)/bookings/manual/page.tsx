"use client";

import { BookingWizard } from "@/src/components/Booking/BookingWizard";

export default function ManualBookingPage() {
  return (
    <div className="space-y-6">
      <section>
        <span className="editorial-kicker">Admin booking</span>
        <h2 className="admin-page-heading mt-3 text-brand-dark">Create a live reservation</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Manual bookings use the same server-authoritative pricing, duration, recurrence, timezone, and capacity rules as the public website.</p>
      </section>
      <BookingWizard mode="admin" />
    </div>
  );
}
