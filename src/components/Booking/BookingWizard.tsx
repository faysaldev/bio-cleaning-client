"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useGetShortServicesQuery } from "@/src/redux/features/services/servicesApi";
import {
  useCaptureAbandonmentMutation,
  useCreateAdminBookingMutation,
  useCreateBookingMutation,
  useGetAvailabilityMutation,
  useGetBookingQuoteMutation,
} from "@/src/redux/features/bookings/bookingsApi";
import { useGetPublicSchedulingConfigQuery } from "@/src/redux/features/scheduling/schedulingApi";
import type { BookingQuote } from "@/src/redux/features/bookings/types";
import { BookingProgress } from "./BookingProgress";
import { ServiceStep } from "./ServiceStep";
import { PropertyStep } from "./PropertyStep";
import { ExtrasStep } from "./ExtrasStep";
import { FrequencyStep } from "./FrequencyStep";
import { DateTimeStep } from "./DateTimeStep";
import { DetailsStep } from "./DetailsStep";
import { PaymentStep } from "./PaymentStep";
import { ConfirmStep } from "./ConfirmStep";
import { BookingSummary } from "./BookingSummary";
import { BookingSuccess } from "./BookingSuccess";
import type { BookingDraft } from "./types";

const STEPS = ["Service", "Property", "Extras", "Frequency", "Schedule", "Details", "Payment", "Confirm"];
const initialDraft: BookingDraft = {
  serviceId: "",
  property: { propertyType: "HOME", bedrooms: 1, bathrooms: 1 },
  extraCodes: [],
  frequency: "ONE_TIME",
  occurrenceCount: 1,
  date: "",
  timeSlot: "",
  customerDetails: { name: "", email: "", phone: "", address: { line1: "", line2: "", city: "", zip: "" } },
  notes: "",
  paymentOption: "PAY_LATER",
};

export function BookingWizard({ mode = "public" }: { mode?: "public" | "admin" }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingDraft>(initialDraft);
  const [quote, setQuote] = useState<BookingQuote>();
  const [quoteError, setQuoteError] = useState("");
  const [availability, setAvailability] = useState<any>();
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<{ reference: string; manageToken?: string; occurrenceCount: number; paymentMessage?: string }>();
  const [sessionId] = useState(() => crypto.randomUUID());
  const [rebookApplied, setRebookApplied] = useState(mode !== "public");

  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError } = useGetShortServicesQuery();
  const services = servicesResponse?.data || [];
  const selectedService = useMemo(() => services.find((service) => service._id === data.serviceId), [services, data.serviceId]);
  const { data: schedulingConfig } = useGetPublicSchedulingConfigQuery();
  const [getQuote] = useGetBookingQuoteMutation();
  const [getAvailability, { isLoading: availabilityLoading }] = useGetAvailabilityMutation();
  const [createBooking, { isLoading: creatingPublic }] = useCreateBookingMutation();
  const [createAdminBooking, { isLoading: creatingAdmin }] = useCreateAdminBookingMutation();
  const [captureAbandonment] = useCaptureAbandonmentMutation();
  const creating = mode === "admin" ? creatingAdmin : creatingPublic;

  const quoteInput = useMemo(() => data.serviceId ? ({ serviceId: data.serviceId, property: data.property, frequency: data.frequency, extraCodes: data.extraCodes, promoCode: data.promoCode }) : null, [data.serviceId, data.property, data.frequency, data.extraCodes, data.promoCode]);

  useEffect(() => {
    if (mode !== "public" || rebookApplied) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("rebook") !== "1") { setRebookApplied(true); return; }
    try {
      const raw = sessionStorage.getItem("bio-rebook-draft");
      if (raw) {
        const draft = JSON.parse(raw);
        setData((current) => ({
          ...current,
          serviceId: draft.serviceId || current.serviceId,
          property: draft.property || current.property,
          extraCodes: Array.isArray(draft.extraCodes) ? draft.extraCodes : [],
          frequency: draft.frequency || current.frequency,
          occurrenceCount: 1,
          date: "",
          timeSlot: "",
          customerDetails: {
            ...current.customerDetails,
            ...(draft.customerDetails || {}),
            address: { ...current.customerDetails.address, ...(draft.customerDetails?.address || {}) },
          },
          notes: draft.notes || "",
          promoCode: undefined,
          paymentOption: "PAY_LATER",
        }));
        sessionStorage.removeItem("bio-rebook-draft");
      }
    } catch {
      sessionStorage.removeItem("bio-rebook-draft");
    } finally {
      setRebookApplied(true);
    }
  }, [mode, rebookApplied]);

  useEffect(() => {
    if (services.length && !data.serviceId) setData((current) => ({ ...current, serviceId: services[0]._id }));
  }, [services, data.serviceId]);

  useEffect(() => {
    if (!quoteInput) return;
    const timer = window.setTimeout(() => {
      setQuoteError("");
      getQuote(quoteInput).unwrap().then((next) => {
        setQuote(next);
        setData((current) => ({ ...current, paymentOption: next.payment.depositPolicy === "REQUIRED" ? "DEPOSIT" : next.payment.depositPolicy === "NONE" ? "PAY_LATER" : current.paymentOption }));
      }).catch((error: any) => { setQuote(undefined); setQuoteError(error?.data?.message || "We couldn’t calculate this selection."); });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [quoteInput, getQuote]);

  useEffect(() => {
    if (!quoteInput || !data.date) { setAvailability(undefined); return; }
    setData((current) => ({ ...current, timeSlot: "" }));
    getAvailability({ ...quoteInput, date: data.date }).unwrap().then(setAvailability).catch(() => setAvailability({ slots: [], closed: false }));
  }, [quoteInput, data.date, getAvailability]);

  useEffect(() => {
    if (mode !== "public" || !data.serviceId) return;
    const timer = window.setTimeout(() => {
      const email = data.customerDetails.email.includes("@") ? data.customerDetails.email : undefined;
      captureAbandonment({ sessionId, state: "ACTIVE", stage: STEPS[step].toUpperCase(), serviceId: data.serviceId, property: data.property, extraCodes: data.extraCodes, frequency: data.frequency, requestedDate: data.date || undefined, requestedTime: data.timeSlot || undefined, customer: { name: data.customerDetails.name || undefined, email, phone: data.customerDetails.phone || undefined } });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [mode, data, step, sessionId, captureAbandonment]);

  useEffect(() => {
    if (mode !== "public") return;
    const handler = () => {
      if (!data.serviceId || success) return;
      const base = process.env.NEXT_PUBLIC_BASE_URL;
      if (!base) return;
      const email = data.customerDetails.email.includes("@") ? data.customerDetails.email : undefined;
      fetch(`${base}/bookings/abandonment`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", keepalive: true, body: JSON.stringify({ sessionId, state: "ABANDONED", stage: STEPS[step].toUpperCase(), serviceId: data.serviceId, property: data.property, extraCodes: data.extraCodes, frequency: data.frequency, requestedDate: data.date || undefined, requestedTime: data.timeSlot || undefined, customer: { name: data.customerDetails.name || undefined, email, phone: data.customerDetails.phone || undefined } }) }).catch(() => undefined);
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [mode, data, step, sessionId, success]);

  useEffect(() => {
    if (mode !== "public") return;
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get("payment");
    if (!paymentState) return;
    const reference = params.get("reference") || "Booking";
    let manageToken: string | undefined;
    let occurrenceCount = 1;
    try {
      const stored = JSON.parse(sessionStorage.getItem("bio-booking-manage") || "null");
      if (stored?.reference === reference) {
        manageToken = stored.manageToken;
        occurrenceCount = Number(stored.occurrenceCount) || 1;
      }
    } catch {}
    if (paymentState === "cancelled") {
      if (manageToken) {
        window.location.replace(`/booking/manage?reference=${encodeURIComponent(reference)}#token=${manageToken}`);
      } else {
        setSubmitError("The deposit checkout was cancelled. Use the private management link from your booking email to retry payment.");
      }
      return;
    }
    if (paymentState === "success") {
      setSuccess({ reference, manageToken, occurrenceCount, paymentMessage: "Deposit payment completed. We’ll confirm it by email." });
    }
  }, [mode]);

  const validateStep = () => {
    setSubmitError("");
    if (step === 0 && !data.serviceId) return "Choose a service to continue.";
    if (step === 1 && selectedService?.pricing?.propertyPricingMode === "SQUARE_FOOTAGE" && !data.property.squareFeet) return "Enter the property square footage to continue.";
    if (step === 4 && (!data.date || !data.timeSlot)) return "Choose an available date and time.";
    if (step === 5) {
      const c = data.customerDetails;
      if (!c.name.trim() || !c.phone.trim() || !c.email.includes("@") || !c.address.line1.trim() || !c.address.city.trim() || !c.address.zip.trim()) return "Complete your contact and service address details.";
    }
    if (quoteError) return quoteError;
    return "";
  };

  const next = () => { const error = validateStep(); if (error) { setSubmitError(error); return; } setStep((current) => Math.min(STEPS.length - 1, current + 1)); };
  const updateService = (serviceId: string) => setData((current) => ({ ...current, serviceId, extraCodes: [], date: "", timeSlot: "", promoCode: undefined }));

  const confirm = async () => {
    if (!quoteInput || !data.date || !data.timeSlot) return;
    setSubmitError("");
    try {
      const create = mode === "admin" ? createAdminBooking : createBooking;
      const result = await create({ ...quoteInput, date: data.date, timeSlot: data.timeSlot, occurrenceCount: data.occurrenceCount, customerDetails: data.customerDetails, notes: data.notes || undefined, paymentOption: mode === "admin" ? "PAY_LATER" : data.paymentOption, bookingSessionId: sessionId }).unwrap();
      const payload = { reference: result.booking.reference, manageToken: result.manageToken, occurrenceCount: result.occurrences.length, paymentMessage: result.paymentError ? result.paymentError : undefined };
      if (result.checkoutUrl && mode === "public") {
        sessionStorage.setItem("bio-booking-manage", JSON.stringify({ reference: result.booking.reference, manageToken: result.manageToken, occurrenceCount: result.occurrences.length }));
        window.location.assign(result.checkoutUrl);
        return;
      }
      setSuccess(payload);
    } catch (error: any) {
      setSubmitError(error?.data?.message || "We could not create this booking. Please choose another slot and try again.");
    }
  };

  if (success) return <BookingSuccess {...success} />;

  return <div className="space-y-6"><BookingProgress steps={STEPS} currentStep={step} /><section className={mode === "public" ? "bg-brand-cream py-10" : "pb-16"}><div className={mode === "public" ? "container-page max-w-6xl" : ""}><div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="card-primary bg-white p-5 sm:p-6 md:p-8">
    {step === 0 ? <ServiceStep services={services} isLoading={servicesLoading} error={servicesError} selectedServiceId={data.serviceId} onSelect={updateService} /> : null}
    {step === 1 ? <PropertyStep service={selectedService} property={data.property} onChange={(property) => setData((current) => ({ ...current, property, date: "", timeSlot: "" }))} /> : null}
    {step === 2 ? <ExtrasStep service={selectedService} selectedCodes={data.extraCodes} onChange={(extraCodes) => setData((current) => ({ ...current, extraCodes, date: "", timeSlot: "" }))} /> : null}
    {step === 3 ? <FrequencyStep service={selectedService} frequency={data.frequency} occurrenceCount={data.occurrenceCount} maxOccurrences={schedulingConfig?.recurrenceMaxOccurrences || 12} onChange={(frequency, occurrenceCount) => setData((current) => ({ ...current, frequency, occurrenceCount, date: "", timeSlot: "" }))} /> : null}
    {step === 4 ? <DateTimeStep serviceId={data.serviceId} property={data.property} extraCodes={data.extraCodes} frequency={data.frequency} date={data.date} timeSlot={data.timeSlot} availability={availability} isLoading={availabilityLoading} timezone={schedulingConfig?.timezone} bookingHorizonDays={schedulingConfig?.bookingHorizonDays} onDateChange={(date) => setData((current) => ({ ...current, date, timeSlot: "" }))} onTimeChange={(timeSlot) => setData((current) => ({ ...current, timeSlot }))} /> : null}
    {step === 5 ? <DetailsStep data={data.customerDetails} onChange={(customerDetails) => setData((current) => ({ ...current, customerDetails }))} /> : null}
    {step === 6 ? <PaymentStep quote={quote} paymentOption={data.paymentOption} promoCode={data.promoCode} occurrenceCount={data.occurrenceCount} onPaymentOption={(paymentOption) => setData((current) => ({ ...current, paymentOption }))} onApplyPromo={(promoCode) => setData((current) => ({ ...current, promoCode }))} /> : null}
    {step === 7 ? <ConfirmStep data={data} service={selectedService} quote={quote} /> : null}
    {quoteError ? <div className="feedback-panel mt-5 border-destructive/20 bg-destructive/5 text-destructive">{quoteError}</div> : null}{submitError ? <div className="feedback-panel mt-5 border-destructive/20 bg-destructive/5 text-destructive">{submitError}</div> : null}
    <div className="mt-8 flex justify-between border-t border-border pt-6"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-30"><ArrowLeft className="h-4 w-4" /> Back</button>{step < STEPS.length - 1 ? <button type="button" onClick={next} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={confirm} disabled={creating || !quote} className="btn-primary disabled:opacity-60">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{creating ? "Reserving…" : mode === "admin" ? "Create booking" : "Confirm booking"}</button>}</div>
  </div><BookingSummary data={data} service={selectedService} quote={quote} /></div></div></section></div>;
}
