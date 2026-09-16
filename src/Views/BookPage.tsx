"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useGetShortServicesQuery } from "../redux/features/services/servicesApi";
import {
  useCreateBookingMutation,
  useGetBookedSlotsQuery,
  useGetBookingQuoteMutation,
} from "../redux/features/bookings/bookingsApi";
import type { BookingFrequency } from "../redux/features/bookings/types";
import { BookingProgress } from "../components/Booking/BookingProgress";
import { ServiceStep } from "../components/Booking/ServiceStep";
import { DateTimeStep } from "../components/Booking/DateTimeStep";
import { DetailsStep } from "../components/Booking/DetailsStep";
import { ConfirmStep } from "../components/Booking/ConfirmStep";
import { BookingSummary } from "../components/Booking/BookingSummary";
import { BookingSuccess } from "../components/Booking/BookingSuccess";
import { BookingFeatures } from "../components/Booking/BookingFeatures";
import { BookingTestimonials } from "../components/Booking/BookingTestimonials";

const STEPS = ["Service", "Date & Time", "Your Details", "Confirm"];

const frequencyMap: Record<string, BookingFrequency> = {
  "One-time": "ONE_TIME",
  Weekly: "WEEKLY",
  "Bi-weekly": "BI_WEEKLY",
  Monthly: "MONTHLY",
};

export default function BookPage() {
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
      setSubmitError(err?.data?.message || "We could not create this booking. Please try another time slot.");
    }
  };

  if (done) return <BookingSuccess reference={reference} />;

  return (
    <SiteLayout>
      <main className="bg-white overflow-hidden" ref={ref}>
        <BookingProgress steps={STEPS} currentStep={step} />

        <section className="py-10 bg-brand-cream">
          <div className="container-page max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 card-primary p-6 md:p-10">
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

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
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
                      {isBooking ? "Processing..." : "Confirm Booking"}
                    </button>
                  )}
                </div>
              </div>

              <BookingSummary data={data} estimatedTotal={estimatedTotal} />
            </div>
          </div>
        </section>

        <BookingFeatures />
        <BookingTestimonials />

        <section className="pb-20">
          <div className="container-page">
            <div className="rounded-3xl bg-brand-yellow p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-brand-dark">
                  Ready for a clean break?
                </h2>
                <p className="text-brand-dark/70 mt-2">
                  Our professional team is standing by to transform your space.
                </p>
              </div>
              <button onClick={() => setStep(0)} className="btn-dark px-10 py-4 text-lg">
                Start Over
              </button>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
