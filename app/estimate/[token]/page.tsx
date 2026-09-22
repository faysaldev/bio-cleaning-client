"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Clock3,
  FileText,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import {
  useAcceptPublicQuoteMutation,
  useConvertPublicQuoteMutation,
  useDeclinePublicQuoteMutation,
  useGetPublicQuoteQuery,
} from "@/src/redux/features/finance/financeApi";
import { useGetAvailabilityMutation } from "@/src/redux/features/bookings/bookingsApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { FieldLabel, TextInput } from "@/src/components/ui/form-field";
import { LOGO_URL } from "@/src/components/Footer";

export default function EstimateAcceptancePage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token || "");
  const { data: quote, isLoading, isError, refetch } = useGetPublicQuoteQuery(token, { skip: !token });
  const [accept, acceptState] = useAcceptPublicQuoteMutation();
  const [decline] = useDeclinePublicQuoteMutation();
  const [convert, convertState] = useConvertPublicQuoteMutation();
  const [availability, availabilityState] = useGetAvailabilityMutation();

  const [accepted, setAccepted] = useState(false);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const serviceId = useMemo(
    () =>
      quote
        ? String(
            (quote.bookingDraft as any)?.serviceId ||
              (typeof quote.serviceId === "object" ? quote.serviceId._id : quote.serviceId)
          )
        : "",
    [quote]
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7faf8] p-6">
        <div className="mx-auto max-w-3xl pt-[18vh]">
          <LoadingState label="Opening your verified estimate…" />
        </div>
      </main>
    );
  }

  if (isError || !quote) {
    return (
      <main className="min-h-screen bg-[#f7faf8] p-6">
        <div className="mx-auto max-w-3xl pt-[18vh]">
          <ErrorState
            title="This estimate link is unavailable"
            description="The link may be expired, already converted, or invalid."
            action={
              <button className="btn-secondary rounded-full px-6" onClick={() => refetch()}>
                Try Reloading
              </button>
            }
          />
        </div>
      </main>
    );
  }

  const status = quote.status;
  const canAccept = !["DECLINED", "EXPIRED", "CONVERTED"].includes(status);
  const isAccepted = accepted || ["ACCEPTED", "CONVERTED"].includes(status);

  const loadSlots = async (nextDate: string) => {
    setDate(nextDate);
    setTime("");
    setSlots([]);
    setMessage("");
    if (!nextDate) return;
    try {
      const r = await availability({
        serviceId,
        property: quote.bookingDraft.property,
        propertySize: quote.bookingDraft.propertySize,
        frequency: quote.bookingDraft.frequency,
        extraCodes: quote.bookingDraft.extraCodes,
        promoCode: quote.bookingDraft.promoCode,
        date: nextDate,
      }).unwrap();
      setSlots(r.slots || []);
      if (r.closed || !r.slots?.length) {
        setMessage("No live cleaner crews are available on this date. Please select another day.");
      }
    } catch (e: any) {
      setMessage(e?.data?.message || "Availability could not be loaded.");
    }
  };

  const acceptNow = async () => {
    setMessage("");
    try {
      await accept({ token, name: quote.customer.name, email: quote.customer.email, agreed: true }).unwrap();
      setAccepted(true);
    } catch (e: any) {
      setMessage(e?.data?.message || "Estimate could not be accepted.");
    }
  };

  const schedule = async () => {
    if (!date || !time) return;
    setMessage("");
    try {
      const r = await convert({ token, body: { date, timeSlot: time, paymentOption: "PAY_LATER" } }).unwrap();
      setBookingRef(r.booking.reference);
      if (r.checkoutUrl) {
        window.location.assign(r.checkoutUrl);
      }
    } catch (e: any) {
      setMessage(e?.data?.message || "That time slot was just booked. Please pick another available slot.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Brand Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="BIO Cleaning" className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-lime/40" />
            <div>
              <p className="font-extrabold text-brand-dark text-base">BIO Cleaning</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">Secure Customer Estimate</p>
            </div>
          </Link>
          <span className="rounded-full bg-brand-lime/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-dark">
            {status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Estimate Card */}
        <section className="overflow-hidden rounded-3xl border border-brand-green/15 bg-white shadow-xl">
          {/* Spruce Header Banner */}
          <div className="bg-[#0C3629] p-6 text-white sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-dark">
                  <FileText className="h-3 w-3" /> Estimate {quote.quoteNumber}
                </span>
                <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
                  A Clear, Transparent Cleaning Scope.
                </h1>
                <p className="mt-2 text-xs text-white/70 sm:text-sm">
                  Prepared for <strong>{quote.customer.name}</strong> • Valid through{" "}
                  {new Date(quote.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Estimate Details & Sidebar */}
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_300px]">
            {/* Left Column: Scope & Line items */}
            <div>
              <h2 className="text-lg font-extrabold text-brand-dark pb-3 border-b border-brand-green/10">
                Itemized Service Breakdown
              </h2>

              <div className="mt-4 divide-y divide-brand-green/10 rounded-2xl border border-brand-green/12 bg-[#f7faf8]">
                {quote.lineItems.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="flex items-start justify-between gap-4 p-4">
                    <div>
                      <p className="font-extrabold text-brand-dark text-sm">{item.name}</p>
                      {item.description ? (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                      ) : null}
                    </div>
                    <p className="font-black text-brand-dark text-sm whitespace-nowrap">
                      {quote.pricing.currency} {item.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Service Terms */}
              {quote.terms?.length ? (
                <div className="mt-8">
                  <h3 className="text-sm font-extrabold text-brand-dark">Included Guarantees & Terms</h3>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {quote.terms.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Notes */}
              {quote.notes ? (
                <div className="mt-6 rounded-2xl border border-brand-green/15 bg-white p-4 text-xs leading-relaxed text-muted-foreground">
                  <strong>Special Instructions:</strong> {quote.notes}
                </div>
              ) : null}
            </div>

            {/* Right Column: Pricing Summary Sidebar */}
            <aside className="rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-6 shadow-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Estimate Total
              </p>
              <p className="mt-1 text-3xl font-black text-brand-dark sm:text-4xl">
                {quote.pricing.currency} {quote.pricing.total.toFixed(2)}
              </p>

              <div className="mt-6 space-y-2.5 border-t border-brand-green/10 pt-4 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-dark">
                    {quote.pricing.currency} {quote.pricing.subtotal.toFixed(2)}
                  </span>
                </div>
                {quote.pricing.discountAmount > 0 ? (
                  <div className="flex justify-between text-brand-green font-bold">
                    <span>Discount</span>
                    <span>-{quote.pricing.discountAmount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{quote.pricing.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-brand-green/8 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Duration
                  </span>
                  <span className="font-bold text-brand-dark">{quote.estimatedDurationMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> Required Crew
                  </span>
                  <span className="font-bold text-brand-dark">{quote.requiredStaff} technicians</span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-2xl bg-white p-3 border border-brand-green/10 text-[11px] leading-relaxed text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-green mt-0.5" />
                <span>Backed by BIO Cleaning 100% Satisfaction Re-clean Guarantee.</span>
              </div>
            </aside>
          </div>
        </section>

        {/* Confirmation or Acceptance Section */}
        {bookingRef ? (
          <section className="mt-8 rounded-3xl border border-brand-green/20 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-lime text-brand-dark mb-4">
              <CheckCircle2 className="h-7 w-7 text-brand-dark" />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-dark">Booking Confirmed!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your appointment is locked in with reference <strong>{bookingRef}</strong>. Check your email for full management and arrival instructions.
            </p>
            <div className="mt-6">
              <Link href="/" className="btn-primary rounded-full px-8">
                Return to Homepage
              </Link>
            </div>
          </section>
        ) : isAccepted ? (
          <section className="mt-8 rounded-3xl border border-brand-green/15 bg-white p-6 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 pb-6 border-b border-brand-green/10">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark font-black">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-brand-dark">Pick Your Arrival Time Slot</h2>
                <p className="text-xs text-muted-foreground">Estimate is approved. Lock in an exact crew arrival window.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-[240px_1fr]">
              <div>
                <FieldLabel>Select Date</FieldLabel>
                <TextInput
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={(e) => loadSlots(e.target.value)}
                />
              </div>

              <div>
                <FieldLabel>Available Arrival Windows</FieldLabel>
                <div className="mt-2 flex min-h-12 flex-wrap gap-2">
                  {availabilityState.isLoading ? (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking live capacity in your area…
                    </span>
                  ) : slots.length ? (
                    slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setTime(slot.time)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                          time === slot.time
                            ? "bg-[#0C3629] text-white shadow-md ring-2 ring-brand-lime"
                            : "border border-brand-green/20 bg-white text-brand-dark hover:border-brand-lime hover:bg-[#f7faf8]"
                        }`}
                      >
                        <Clock3 className="mr-1.5 inline h-3 w-3 text-brand-green" />
                        {slot.label}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {date ? "No slots available for this day. Please select another date." : "Pick a date first."}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-green/10">
              <button
                disabled={!date || !time || convertState.isLoading}
                className="btn-primary rounded-full px-8 min-h-[48px] text-sm font-extrabold"
                onClick={schedule}
              >
                {convertState.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Reserving Crew…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm & Convert to Booking
                  </>
                )}
              </button>
            </div>
          </section>
        ) : canAccept ? (
          <section className="mt-8 rounded-3xl border border-brand-green/15 bg-white p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-extrabold text-brand-dark">Accept This Estimate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              By accepting, you agree to the quoted scope and terms above. You will choose a live appointment time next.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                className="btn-primary rounded-full px-8 text-sm font-extrabold"
                disabled={acceptState.isLoading}
                onClick={acceptNow}
              >
                {acceptState.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Accepting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Estimate
                  </>
                )}
              </button>
              <button
                className="btn-secondary rounded-full px-7 text-sm font-bold"
                onClick={async () => {
                  await decline(token);
                  window.location.reload();
                }}
              >
                <XCircle className="h-4 w-4 mr-1 text-destructive" /> Decline
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-brand-green/12 bg-white p-8 text-center shadow-sm">
            <XCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-3 text-xl font-extrabold text-brand-dark">
              This estimate is currently {status.toLowerCase()}.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please contact BIO Cleaning at +1 (800) BIO-CLEAN if you need a revised estimate.
            </p>
          </section>
        )}

        {message ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs font-bold text-amber-800">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  );
}
