"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useGetShortServicesQuery } from "../redux/features/services/servicesApi";
import {
  useGetBookedSlotsQuery,
  useCreateBookingMutation,
} from "../redux/features/bookings/bookingsApi";

// Components
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

const sizeAdjustments: Record<string, number> = {
  Studio: -30,
  "1BR": 0,
  "2BR": 40,
  "3BR": 85,
  "4BR+": 140,
  Office: 120,
};

export default function BookPage() {
  const [data, setData] = useState<any>({
    service: "",
    size: "1BR",
    time: "Morning 8-12",
    frequency: "One-time",
    date: "",
  });

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    error,
  } = useGetShortServicesQuery();

  const { data: slotsResponse } = useGetBookedSlotsQuery(data.date || "", {
    skip: !data.date,
  });

  const services = servicesResponse?.data || [];
  const bookedSlots = slotsResponse?.data || [];
  
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState("");
  const detailsRef = useRef<any>(null);
  const ref = useGsapReveal<HTMLDivElement>();

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  useEffect(() => {
    if (services.length > 0 && !data.service) {
      setData((prev: any) => ({ ...prev, service: services[0].name }));
    }
  }, [services, data.service]);

  function estimateTotal(currentData: any) {
    const service = services.find((item) => item.name === currentData.service);
    const frequencyDiscount =
      currentData.frequency === "Weekly"
        ? 0.85
        : currentData.frequency === "Bi-weekly"
          ? 0.9
          : currentData.frequency === "Monthly"
            ? 0.95
            : 1;

    return Math.max(
      89,
      Math.round(
        ((service?.basePrice ?? 149) + (sizeAdjustments[currentData.size] ?? 0)) *
          frequencyDiscount,
      ),
    );
  }

  const estimatedTotal = estimateTotal(data);

  const handleUpdate = (updates: any) => {
    setData((prev: any) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step === 2 && detailsRef.current) {
      const detailsData = detailsRef.current.getData();
      setData((prev: any) => ({ ...prev, ...detailsData }));
    }
    setStep(step + 1);
  };

  const handleConfirm = async () => {
    const serviceMap: Record<string, string> = {
      "Residential": "RESIDENTIAL",
      "Commercial": "COMMERCIAL",
      "Deep Clean": "DEEP_CLEAN",
      "Deep Cleans": "DEEP_CLEAN",
      "Move-In/Out": "MOVE_IN_OUT",
    };

    const frequencyMap: Record<string, string> = {
      "One-time": "ONE_TIME",
      "Weekly": "WEEKLY",
      "Bi-weekly": "BI_WEEKLY",
      "Monthly": "MONTHLY",
    };

    const payload = {
      serviceType: serviceMap[data.service] || "RESIDENTIAL",
      propertySize: data.size,
      date: data.date,
      timeSlot: data.time,
      frequency: frequencyMap[data.frequency] || "ONE_TIME",
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
      totalAmount: estimatedTotal,
    };

    try {
      const res = await createBooking(payload as any).unwrap();
      setReference(res.reference);
      setDone(true);
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  if (done) {
    return <BookingSuccess reference={reference} />;
  }

  return (
    <SiteLayout>
      <main className="bg-white overflow-hidden" ref={ref}>
        {/* Progress Header */}
        <BookingProgress steps={STEPS} currentStep={step} />

        {/* Step Content */}
        <section className="py-10 bg-brand-cream">
          <div className="container-page max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 card-primary p-6 md:p-10">
                
                {step === 0 && (
                  <ServiceStep
                    services={services}
                    isLoading={isServicesLoading}
                    error={error}
                    selectedService={data.service}
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

                {step === 2 && (
                  <DetailsStep ref={detailsRef} initialData={data} />
                )}

                {step === 3 && (
                  <ConfirmStep data={data} estimatedTotal={estimatedTotal} />
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
                      disabled={isBooking}
                      className="btn-primary flex items-center gap-2"
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

              {/* Sidebar Summary */}
              <BookingSummary data={data} estimatedTotal={estimatedTotal} />
            </div>
          </div>
        </section>

        {/* Trust Sections */}
        <BookingFeatures />
        <BookingTestimonials />

        {/* CTA Section */}
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
              <button
                onClick={() => setStep(0)}
                className="btn-dark px-10 py-4 text-lg"
              >
                Start Over
              </button>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
