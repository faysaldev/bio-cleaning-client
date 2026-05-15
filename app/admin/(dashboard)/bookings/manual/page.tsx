"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useGetShortServicesQuery } from "@/src/redux/features/services/servicesApi";
import {
  useGetBookedSlotsQuery,
  useCreateBookingMutation,
} from "@/src/redux/features/bookings/bookingsApi";

// Components
import { BookingProgress } from "@/src/components/Booking/BookingProgress";
import { ServiceStep } from "@/src/components/Booking/ServiceStep";
import { DateTimeStep } from "@/src/components/Booking/DateTimeStep";
import { DetailsStep } from "@/src/components/Booking/DetailsStep";
import { ConfirmStep } from "@/src/components/Booking/ConfirmStep";
import { BookingSummary } from "@/src/components/Booking/BookingSummary";
import { BookingSuccess } from "@/src/components/Booking/BookingSuccess";

const STEPS = ["Service", "Date & Time", "Details", "Review"];

const sizeAdjustments: Record<string, number> = {
  Studio: -30,
  "1BR": 0,
  "2BR": 40,
  "3BR": 85,
  "4BR+": 140,
  Office: 120,
};

export default function ManualBookingPage() {
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
                  disabled={isBooking}
                  className="btn-primary flex items-center gap-2"
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
                <Sparkles className="w-4 h-4" /> Admin Override
              </div>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                As an administrator, you are creating this booking on behalf of the client. Ensure all contact details are verified.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
