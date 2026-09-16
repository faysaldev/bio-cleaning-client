"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useGetShortServicesQuery } from "@/src/redux/features/services/servicesApi";
import {
  useCreateBookingMutation,
  useGetBookedSlotsQuery,
  useGetBookingQuoteMutation,
} from "@/src/redux/features/bookings/bookingsApi";
import type { BookingFrequency } from "@/src/redux/features/bookings/types";
import { BookingProgress } from "@/src/components/Booking/BookingProgress";
import { ServiceStep } from "@/src/components/Booking/ServiceStep";
import { DateTimeStep } from "@/src/components/Booking/DateTimeStep";
import { DetailsStep } from "@/src/components/Booking/DetailsStep";
import { ConfirmStep } from "@/src/components/Booking/ConfirmStep";
import { BookingSummary } from "@/src/components/Booking/BookingSummary";
import { BookingSuccess } from "@/src/components/Booking/BookingSuccess";

const STEPS = ["Service", "Date & Time", "Details", "Review"];

const frequencyMap: Record<string, BookingFrequency> = {
  "One-time": "ONE_TIME",
  Weekly: "WEEKLY",
  "Bi-weekly": "BI_WEEKLY",
  Monthly: "MONTHLY",
};

export default function ManualBookingPage() {
  const [data, setData] = useState<any>({
    serviceId: "",
    service: "",
    size: "1BR",
    time: "Morning 8-12",
    frequency: "One-time",
    date: "",
  });
  const [quoteTotal, setQuoteTotal] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    error,
  } = useGetShortServicesQuery();
  const services = servicesResponse?.data || [];

  const { data: slotsResponse } = useGetBookedSlotsQuery(data.date || "", {
    skip: !data.date,
  });
  const bookedSlots = slotsResponse?.data || [];

  const [getBookingQuote] = useGetBookingQuoteMutation();
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState("");
  const detailsRef = useRef<any>(null);
  const ref = useGsapReveal<HTMLDivElement>();

  useEffect(() => {
    if (services.length > 0 && !data.serviceId) {
      setData((previous: any) => ({
        ...previous,
        serviceId: services[0]._id,
        service: services[0].name,
      }));
    }
  }, [services, data.serviceId]);

  useEffect(() => {
    if (!data.serviceId) return;
    let active = true;
    setQuoteTotal(null);

    getBookingQuote({
      serviceId: data.serviceId,
      propertySize: data.size,
      frequency: frequencyMap[data.frequency] || "ONE_TIME",
      extraCodes: [],
    })
      .unwrap()
      .then((quote) => {
        if (active) setQuoteTotal(quote.totalAmount);
      })
      .catch(() => {
        if (active) setQuoteTotal(null);
      });

    return () => {
      active = false;
    };
  }, [data.serviceId, data.size, data.frequency, getBookingQuote]);

  const selectedService = services.find((service) => service._id === data.serviceId);
  const estimatedTotal = quoteTotal ?? selectedService?.basePrice ?? 0;

  const handleUpdate = (updates: any) => {
    setSubmitError("");
    setData((previous: any) => ({ ...previous, ...updates }));
  };

  const handleNext = () => {
    if (step === 2 && detailsRef.current) {
      const detailsData = detailsRef.current.getData();
      setData((previous: any) => ({ ...previous, ...detailsData }));
    }
    setStep((current) => current + 1);
  };

  const handleConfirm = async () => {
    setSubmitError("");
    if (!data.serviceId) {
      setSubmitError("Please select an available service.");
      return;
    }

    try {
      const booking = await createBooking({
        serviceId: data.serviceId,
        propertySize: data.size,
        date: data.date,
        timeSlot: data.time,
        frequency: frequencyMap[data.frequency] || "ONE_TIME",
        extraCodes: [],
        customerDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: {
            line1: data.addr1,
            city: data.city,
            zip: data.zip,
          },
        },
      }).unwrap();
      setReference(booking.reference);
      setDone(true);
    } catch (err: any) {
      setSubmitError(err?.data?.message || "The booking could not be created. Please choose another slot.");
    }
  };

  if (done) {
    return (
      <div className="p-6">
        <BookingSuccess reference={reference} />
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={ref}>
      <div className="rounded-3xl bg-brand-dark p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-green/10 to-transparent" />
        <span className="pill bg-brand-lime text-brand-dark">Admin Actions</span>
        <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold">Manual Booking</h2>
        <p className="mt-3 max-w-2xl text-white/65 text-lg">
          Create a new reservation for a customer directly from the dashboard.
        </p>
      </div>

      <BookingProgress steps={STEPS} currentStep={step} />

      <section className="pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="card-primary p-8 md:p-12 bg-white">
            {step === 0 && (
              <ServiceStep
                services={services}
                isLoading={isServicesLoading}
                error={error}
                selectedServiceId={data.serviceId}
                selectedSize={data.size}
                onUpdate={handleUpdate}
              />
            )}

            {step === 1 && (
              <DateTimeStep
                date={data.date}
                time={data.time}
                frequency={data.frequency}
                bookedSlots={bookedSlots}
                onUpdate={handleUpdate}
              />
            )}

            {step === 2 && <DetailsStep ref={detailsRef} initialData={data} />}
            {step === 3 && <ConfirmStep data={data} estimatedTotal={estimatedTotal} />}

            {submitError && (
              <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex justify-between mt-12 pt-8 border-t border-border">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} className="btn-primary">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={isBooking || quoteTotal === null}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {isBooking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isBooking ? "Creating..." : "Create Booking"}
                </button>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <BookingSummary data={data} estimatedTotal={estimatedTotal} />
            <div className="p-6 rounded-3xl bg-brand-yellow/10 border border-brand-yellow/20">
              <div className="flex items-center gap-2 text-brand-dark font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4" /> Admin booking
              </div>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                The same server-side pricing and slot reservation rules apply to manual bookings, preventing accidental double-booking or price drift.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
