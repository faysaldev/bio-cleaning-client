"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, CreditCard, Loader2, RefreshCcw, XCircle } from "lucide-react";
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
      lookup({ reference: ref, manageToken }).unwrap().then(setBooking).catch((err: any) => setError(err?.data?.message || "This booking management link is invalid."));
    }
  }, [lookup]);

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage("");
    try { setBooking(await lookup({ reference, manageToken: token }).unwrap()); }
    catch (err: any) { setError(err?.data?.message || "Booking not found."); }
  };

  useEffect(() => {
    if (!booking?.serviceId || !rescheduleDate) { setAvailability(undefined); return; }
    getAvailability({ serviceId: booking.serviceId, property: booking.property || { propertyType: "HOME" }, propertySize: booking.propertySize, frequency: booking.frequency, extraCodes: booking.extras?.map((extra) => extra.code) || [], promoCode: booking.promoCode, date: rescheduleDate })
      .unwrap().then(setAvailability).catch(() => setAvailability({ date: rescheduleDate, timezone: booking.businessTimezone || "", durationMinutes: booking.durationMinutes || 0, requiredStaff: booking.requiredStaffSnapshot || 1, slots: [], closed: false }));
  }, [booking, rescheduleDate, getAvailability]);

  const cancel = async () => {
    if (!booking || !window.confirm("Cancel this booking? This action releases its crew capacity.")) return;
    setError("");
    try { const next = await cancelBooking({ reference, manageToken: token }).unwrap(); setBooking(next); setMessage("Booking cancelled. Any matching waitlist customers can now be notified of the opening."); }
    catch (err: any) { setError(err?.data?.message || "This booking could not be cancelled online."); }
  };

  const reschedule = async () => {
    if (!booking || !rescheduleDate || !rescheduleTime) return;
    setError("");
    try { const next = await rescheduleBooking({ reference, manageToken: token, date: rescheduleDate, timeSlot: rescheduleTime }).unwrap(); setBooking(next); setMessage("Booking rescheduled successfully."); setRescheduleDate(""); setRescheduleTime(""); setAvailability(undefined); }
    catch (err: any) { setError(err?.data?.message || "That time is no longer available."); }
  };

  const payment = async () => {
    setError("");
    try { const result = await startPayment({ reference, manageToken: token }).unwrap(); if (result.alreadyPaid) { setMessage("This deposit is already paid."); return; } if (result.checkoutUrl) window.location.assign(result.checkoutUrl); }
    catch (err: any) { setError(err?.data?.message || "Secure checkout could not be started."); }
  };

  return <SiteLayout><main className="min-h-[80vh] bg-brand-cream/55 py-14"><div className="container-page max-w-4xl"><div className="mb-8"><span className="editorial-kicker">Customer booking portal</span><h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-brand-dark sm:text-5xl">Manage your booking</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Use the private token from your confirmation email to view policy-aware cancellation, rescheduling, and deposit options.</p></div>
    {!booking ? <form onSubmit={handleLookup} className="surface grid gap-4 p-5 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end sm:p-6"><label><span className="field-label">Booking reference</span><input className="field-control font-mono" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="BIO-2026-000001" required /></label><label><span className="field-label">Private management token</span><input className="field-control font-mono" value={token} onChange={(event) => setToken(event.target.value)} placeholder="From your booking email" required /></label><button className="btn-primary h-12" disabled={lookingUp}>{lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Open booking"}</button></form> : <div className="grid gap-6 lg:grid-cols-[1fr_300px]"><section className="surface p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-brand-green">{booking.reference}</p><h2 className="mt-1 text-2xl font-extrabold text-brand-dark">{booking.serviceType}</h2><p className="mt-1 text-sm text-muted-foreground">{booking.propertySize}</p></div><span className="status-badge border-brand-green/20 bg-brand-green/5 text-brand-green">{booking.status}</span></div><dl className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-2"><Info label="Scheduled" value={`${new Date(booking.date).toLocaleDateString()} · ${booking.timeSlot}`} /><Info label="Duration" value={`${booking.durationMinutes || "—"} minutes`} /><Info label="Total" value={`$${Number(booking.totalAmount).toFixed(2)}`} /><Info label="Payment" value={booking.payment?.status || "NOT_REQUIRED"} /></dl>
      {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" ? <div className="mt-6"><h3 className="text-sm font-extrabold text-brand-dark">Reschedule</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><input type="date" min={new Date().toISOString().slice(0,10)} className="field-control" value={rescheduleDate} onChange={(event) => { setRescheduleDate(event.target.value); setRescheduleTime(""); }} /><select className="field-control" value={rescheduleTime} onChange={(event) => setRescheduleTime(event.target.value)} disabled={!rescheduleDate || loadingAvailability}><option value="">{loadingAvailability ? "Loading live times…" : "Choose a new time"}</option>{availability?.slots.map((slot) => <option key={slot.time} value={slot.time}>{slot.label} · {slot.remainingCapacity} capacity left</option>)}</select></div><button type="button" onClick={reschedule} disabled={!rescheduleTime || rescheduling} className="btn-secondary mt-3"><RefreshCcw className="h-4 w-4" />{rescheduling ? "Rescheduling…" : "Reschedule booking"}</button></div> : null}
      {message ? <div className="feedback-panel mt-5 border-brand-green/20 bg-brand-green/5 text-brand-green">{message}</div> : null}{error ? <div className="feedback-panel mt-5 border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}
    </section><aside className="space-y-4"><div className="rounded-2xl bg-brand-dark p-5 text-white"><CalendarClock className="h-5 w-5 text-brand-lime" /><h3 className="mt-3 text-lg font-extrabold">Policy controls</h3><p className="mt-2 text-xs leading-5 text-white/60">Cancel notice: {booking.cancellationPolicy?.noticeHours ?? "—"}h<br />Reschedule notice: {booking.cancellationPolicy?.rescheduleNoticeHours ?? "—"}h</p>{booking.status !== "CANCELLED" && booking.status !== "COMPLETED" ? <button type="button" onClick={cancel} disabled={cancelling} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 text-xs font-extrabold text-white hover:bg-white/8"><XCircle className="h-4 w-4" />{cancelling ? "Cancelling…" : "Cancel booking"}</button> : <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-lime"><CheckCircle2 className="h-4 w-4" /> No active changes available</div>}</div>{booking.payment?.depositAmount && booking.payment.status !== "PAID" ? <div className="surface p-5"><CreditCard className="h-5 w-5 text-brand-green" /><h3 className="mt-3 text-sm font-extrabold text-brand-dark">Deposit outstanding</h3><p className="mt-1 text-xs text-muted-foreground">${booking.payment.depositAmount.toFixed(2)} {booking.payment.currency}</p><button type="button" onClick={payment} disabled={startingPayment} className="btn-primary mt-4 w-full">{startingPayment ? "Opening…" : "Pay securely"}</button></div> : null}</aside></div>}
    {error && !booking ? <div className="feedback-panel mt-4 border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}
  </div></main></SiteLayout>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-bold capitalize text-brand-dark">{value}</dd></div>; }
