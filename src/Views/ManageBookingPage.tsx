"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Home,
  Loader2,
  Lock,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import {
  useCancelManagedBookingMutation,
  useGetAvailabilityMutation,
  useLookupManagedBookingMutation,
  useRescheduleManagedBookingMutation,
  useStartManagedPaymentMutation,
} from "@/src/redux/features/bookings/bookingsApi";
import type { AvailabilityResponse, Booking } from "@/src/redux/features/bookings/types";

export default function ManageBookingPage() {
  const [reference, setReference] = useState("");
  const [token, setToken] = useState("");
  const [booking, setBooking] = useState<Booking>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResponse>();

  const [lookup, { isLoading: lookingUp }] = useLookupManagedBookingMutation();
  const [cancelBooking, { isLoading: cancelling }] = useCancelManagedBookingMutation();
  const [rescheduleBooking, { isLoading: rescheduling }] = useRescheduleManagedBookingMutation();
  const [getAvailability, { isLoading: loadingAvailability }] = useGetAvailabilityMutation();
  const [startPayment, { isLoading: startingPayment }] = useStartManagedPaymentMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || "";
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const manageToken = hash.get("token") || "";
    setReference(ref);
    setToken(manageToken);
    if (ref && manageToken) {
      lookup({ reference: ref, manageToken })
        .unwrap()
        .then(setBooking)
        .catch((err: any) => setError(err?.data?.message || "This booking management link is invalid or expired."));
    }
  }, [lookup]);

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setBooking(await lookup({ reference, manageToken: token }).unwrap());
    } catch (err: any) {
      setError(err?.data?.message || "Booking not found with the provided reference and token.");
    }
  };

  useEffect(() => {
    if (!booking?.serviceId || !rescheduleDate) {
      setAvailability(undefined);
      return;
    }
    getAvailability({
      serviceId: booking.serviceId,
      property: booking.property || { propertyType: "HOME" },
      propertySize: booking.propertySize,
      frequency: booking.frequency,
      extraCodes: booking.extras?.map((extra) => extra.code) || [],
      promoCode: booking.promoCode,
      date: rescheduleDate,
    })
      .unwrap()
      .then(setAvailability)
      .catch(() =>
        setAvailability({
          date: rescheduleDate,
          timezone: booking.businessTimezone || "",
          durationMinutes: booking.durationMinutes || 0,
          requiredStaff: booking.requiredStaffSnapshot || 1,
          slots: [],
          closed: false,
        })
      );
  }, [booking, rescheduleDate, getAvailability]);

  const cancel = async () => {
    if (!booking || !window.confirm("Cancel this booking? This will release the crew capacity.")) return;
    setError("");
    try {
      const next = await cancelBooking({ reference, manageToken: token }).unwrap();
      setBooking(next);
      setMessage("Your booking has been cancelled successfully. Confirmation has been emailed.");
    } catch (err: any) {
      setError(err?.data?.message || "This booking could not be cancelled online. Please call support.");
    }
  };

  const reschedule = async () => {
    if (!booking || !rescheduleDate || !rescheduleTime) return;
    setError("");
    try {
      const next = await rescheduleBooking({
        reference,
        manageToken: token,
        date: rescheduleDate,
        timeSlot: rescheduleTime,
      }).unwrap();
      setBooking(next);
      setMessage("Your cleaning appointment has been rescheduled successfully!");
      setRescheduleDate("");
      setRescheduleTime("");
      setAvailability(undefined);
    } catch (err: any) {
      setError(err?.data?.message || "That time slot is no longer available. Please select another slot.");
    }
  };

  const payment = async () => {
    setError("");
    try {
      const result = await startPayment({ reference, manageToken: token }).unwrap();
      if (result.alreadyPaid) {
        setMessage("This deposit has already been paid.");
        return;
      }
      if (result.checkoutUrl) window.location.assign(result.checkoutUrl);
    } catch (err: any) {
      setError(err?.data?.message || "Secure checkout could not be initiated.");
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-[85vh] bg-[#f7faf8]">
        {/* Spruce Header */}
        <section className="relative overflow-hidden bg-[#0C3629] py-16 text-white md:py-20">
          <div className="container-page max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Self-Service Portal</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Manage Your Booking
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              Lookup your appointment using your booking reference and private access token to reschedule, review visit scope, or update payment.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="container-page max-w-4xl py-12">
          {!booking ? (
            /* Lookup Form Card */
            <div className="rounded-3xl border border-brand-green/15 bg-white p-6 sm:p-10 shadow-lg">
              <div className="flex items-center gap-3 pb-6 border-b border-brand-green/10">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime/40 text-brand-dark">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-brand-dark">Enter Booking Credentials</h2>
                  <p className="text-xs text-muted-foreground">Find these in your confirmation email</p>
                </div>
              </div>

              <form onSubmit={handleLookup} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">Booking Reference</label>
                  <div className="relative">
                    <input
                      className="field-control font-mono pl-9"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="BIO-2026-000001"
                      required
                    />
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label className="field-label">Private Management Token</label>
                  <input
                    className="field-control font-mono"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="From confirmation email"
                    required
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={lookingUp}
                    className="btn-primary w-full rounded-full min-h-[48px] text-sm font-extrabold"
                  >
                    {lookingUp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Finding Booking…
                      </>
                    ) : (
                      "Open & Manage Booking"
                    )}
                  </button>
                </div>
              </form>

              {error ? (
                <div className="feedback-panel mt-6 border-destructive/20 bg-destructive/5 text-destructive rounded-2xl">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
            </div>
          ) : (
            /* Active Booking Dashboard */
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                {/* Main Details Card */}
                <div className="rounded-3xl border border-brand-green/15 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-green/10 pb-6">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-green">
                        {booking.reference}
                      </span>
                      <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">
                        {booking.serviceType}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Home className="h-3.5 w-3.5" />
                        <span>{booking.propertySize} • {booking.frequency.replace("_", " ")}</span>
                      </div>
                    </div>

                    <span className="rounded-full bg-brand-lime/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                      {booking.status}
                    </span>
                  </div>

                  {/* 4 Stats Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl bg-[#f7faf8] p-4 border border-brand-green/10">
                      <div className="text-[10px] font-extrabold uppercase text-muted-foreground">Date & Slot</div>
                      <div className="mt-1 text-sm font-bold text-brand-dark">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-brand-green font-semibold">{booking.timeSlot}</div>
                    </div>

                    <div className="rounded-2xl bg-[#f7faf8] p-4 border border-brand-green/10">
                      <div className="text-[10px] font-extrabold uppercase text-muted-foreground">Est. Duration</div>
                      <div className="mt-1 text-sm font-bold text-brand-dark">
                        {booking.durationMinutes || "—"} mins
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f7faf8] p-4 border border-brand-green/10">
                      <div className="text-[10px] font-extrabold uppercase text-muted-foreground">Total Price</div>
                      <div className="mt-1 text-sm font-black text-brand-dark">
                        ${Number(booking.totalAmount).toFixed(2)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f7faf8] p-4 border border-brand-green/10">
                      <div className="text-[10px] font-extrabold uppercase text-muted-foreground">Payment</div>
                      <div className="mt-1 text-xs font-bold capitalize text-brand-dark">
                        {booking.payment?.status || "NOT_REQUIRED"}
                      </div>
                    </div>
                  </div>

                  {/* Reschedule Section */}
                  {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" ? (
                    <div className="mt-8 border-t border-brand-green/10 pt-6">
                      <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4 text-brand-green" /> Reschedule Appointment
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Select a new date to inspect live available crew arrival windows.
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="field-label">New Preferred Date</label>
                          <input
                            type="date"
                            min={new Date().toISOString().slice(0, 10)}
                            className="field-control"
                            value={rescheduleDate}
                            onChange={(e) => {
                              setRescheduleDate(e.target.value);
                              setRescheduleTime("");
                            }}
                          />
                        </div>

                        <div>
                          <label className="field-label">Live Crew Capacity Slot</label>
                          <select
                            className="field-control"
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            disabled={!rescheduleDate || loadingAvailability}
                          >
                            <option value="">
                              {loadingAvailability ? "Loading live slots…" : "Select available arrival window"}
                            </option>
                            {availability?.slots.map((slot) => (
                              <option key={slot.time} value={slot.time}>
                                {slot.label} ({slot.remainingCapacity} crews open)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={reschedule}
                          disabled={!rescheduleTime || rescheduling}
                          className="btn-primary rounded-full px-6 text-xs font-extrabold"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          {rescheduling ? "Rescheduling…" : "Confirm Reschedule"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Feedback Messages */}
                  {message ? (
                    <div className="feedback-panel mt-6 border-brand-green/20 bg-brand-green/5 text-brand-green rounded-2xl">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span>{message}</span>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="feedback-panel mt-6 border-destructive/20 bg-destructive/5 text-destructive rounded-2xl">
                      <XCircle className="h-5 w-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Policy & Actions Sidebar */}
              <aside className="space-y-6">
                <div className="rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark font-black mb-3">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-extrabold">Notice Policies</h3>
                  <div className="mt-3 space-y-2 text-xs text-white/75 leading-relaxed">
                    <div>
                      Cancellation Notice: <strong>{booking.cancellationPolicy?.noticeHours ?? 48} hours</strong>
                    </div>
                    <div>
                      Reschedule Notice: <strong>{booking.cancellationPolicy?.rescheduleNoticeHours ?? 24} hours</strong>
                    </div>
                  </div>

                  {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" ? (
                    <button
                      type="button"
                      onClick={cancel}
                      disabled={cancelling}
                      className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-extrabold text-white transition hover:bg-destructive hover:border-destructive"
                    >
                      <XCircle className="h-4 w-4" />
                      {cancelling ? "Cancelling…" : "Cancel Appointment"}
                    </button>
                  ) : (
                    <div className="mt-5 rounded-xl bg-white/10 p-3 text-center text-xs font-bold text-brand-lime">
                      No active changes available
                    </div>
                  )}
                </div>

                {/* Deposit action if required */}
                {booking.payment?.depositAmount && booking.payment.status !== "PAID" ? (
                  <div className="rounded-3xl border border-brand-green/15 bg-white p-6 shadow-sm">
                    <CreditCard className="h-6 w-6 text-brand-green mb-2" />
                    <h3 className="text-sm font-extrabold text-brand-dark">Deposit Outstanding</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ${booking.payment.depositAmount.toFixed(2)} {booking.payment.currency}
                    </p>
                    <button
                      type="button"
                      onClick={payment}
                      disabled={startingPayment}
                      className="btn-primary mt-4 w-full rounded-full text-xs font-extrabold"
                    >
                      {startingPayment ? "Starting Stripe…" : "Pay Deposit Securely"}
                    </button>
                  </div>
                ) : null}
              </aside>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
