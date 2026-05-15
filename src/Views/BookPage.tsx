"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Leaf,
  Star,
  CalendarDays,
  MapPin,
  HomeIcon,
  CreditCard,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useGetShortServicesQuery } from "../redux/features/services/servicesApi";
import {
  useGetBookedSlotsQuery,
  useCreateBookingMutation,
} from "../redux/features/bookings/bookingsApi";

const STEPS = ["Service", "Date & Time", "Your Details", "Confirm"];

const sizeAdjustments: Record<string, number> = {
  Studio: -30,
  "1BR": 0,
  "2BR": 40,
  "3BR": 85,
  "4BR+": 140,
  Office: 120,
};

function createBookingReference() {
  return `BIO-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export default function BookPage() {
  const [data, setData] = useState<any>({
    service: "", // Initially empty, will be set from services
    size: "1BR",
    time: "Morning 8-12",
    frequency: "One-time",
    date: "", // Default empty date
  });

  const {
    data: servicesResponse,
    isLoading,
    error,
  } = useGetShortServicesQuery();

  const { data: slotsResponse } = useGetBookedSlotsQuery(data.date || "", {
    skip: !data.date,
  });

  console.log(slotsResponse);

  const services = servicesResponse?.data || [];
  const bookedSlots = slotsResponse?.data || [];
  console.log("Booked slots for", data.date, ":", bookedSlots);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState("");
  const ref = useGsapReveal<HTMLDivElement>();

  // Use useEffect to set default service once services are loaded
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
        ((service?.basePrice ?? 149) +
          (sizeAdjustments[currentData.size] ?? 0)) *
          frequencyDiscount,
      ),
    );
  }

  const estimatedTotal = estimateTotal(data);

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const handleConfirm = async () => {
    // Mapping service names to enum-style keys
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
      // You could add a toast or error state here
    }
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="container-page max-w-xl text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-green/10 grid place-items-center">
              <Check className="w-10 h-10 text-brand-green" />
            </div>
            <h1 className="text-4xl mt-6 text-brand-dark">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground mt-3">
              Reference{" "}
              <span className="font-mono font-bold text-brand-dark">
                {reference}
              </span>
              . We&apos;ve sent a confirmation to your email.
            </p>
            <Link href="/" className="btn-primary mt-8 inline-flex">
              Back to Home
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div ref={ref}>
        <section className="relative overflow-hidden bg-brand-dark text-white">
          <div className="absolute inset-0 leaf-bg opacity-40" />
          <div className="container-page relative py-16 md:py-20">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
              <div>
                <span
                  className="pill bg-brand-lime text-brand-dark"
                  data-reveal
                >
                  <Sparkles className="w-3.5 h-3.5" /> 60-second booking
                </span>
                <h1
                  className="text-5xl md:text-6xl font-display mt-5"
                  data-reveal
                >
                  Book a polished clean without the back-and-forth
                </h1>
                <p className="text-white/75 mt-5 max-w-xl" data-reveal>
                  Pick your service, choose a time, add your details, and get a
                  clear estimate before confirmation.
                </p>
              </div>
              <div
                className="rounded-3xl bg-white/10 border border-white/10 p-6 backdrop-blur-md"
                data-reveal-group
              >
                {[
                  { icon: ShieldCheck, text: "Insured teams" },
                  { icon: Leaf, text: "Eco-safe products" },
                  { icon: Clock, text: "Arrival windows" },
                  { icon: BadgeCheck, text: "Re-clean guarantee" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-lime text-brand-dark grid place-items-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-brand-cream">
          <div className="container-page max-w-5xl">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`flex items-center gap-2 ${i <= step ? "text-brand-green" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full grid place-items-center text-sm font-bold transition ${i <= step ? "bg-brand-green text-white shadow-lg shadow-brand-green/20" : "bg-white border border-border"}`}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 mx-3 bg-border overflow-hidden">
                      <div
                        className={`h-full bg-brand-green transition-all ${i < step ? "w-full" : "w-0"}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container-page grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="rounded-3xl bg-white border border-border shadow-card p-6 md:p-8">
              {step === 0 && (
                <div>
                  <h2 className="text-2xl text-brand-dark mb-6">
                    Select your service
                  </h2>
                  {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
                    </div>
                  ) : error ? (
                    <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
                      Failed to load services. Please refresh.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => setData({ ...data, service: s.name })}
                          className={`p-4 rounded-2xl border-2 text-left transition ${data.service === s.name ? "border-brand-green bg-brand-green/5 shadow-card" : "border-border hover:border-brand-green/50"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-brand-dark">
                                {s.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {s.description}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-brand-green">
                              ${s.basePrice}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="block mt-6">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Property Size
                    </span>
                    <select
                      className="mt-2 w-full p-3 rounded-xl border border-border bg-white"
                      value={data.size}
                      onChange={(e) =>
                        setData({ ...data, size: e.target.value })
                      }
                    >
                      {["Studio", "1BR", "2BR", "3BR", "4BR+", "Office"].map(
                        (o) => (
                          <option key={o}>{o}</option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-2xl text-brand-dark mb-2">
                    Choose date & time
                  </h2>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Date
                    </span>
                    <input
                      type="date"
                      value={data.date || ""}
                      className="mt-2 w-full p-3 rounded-xl border border-border bg-white"
                      onChange={(e) =>
                        setData({ ...data, date: e.target.value })
                      }
                    />
                  </label>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Time slot
                    </span>
                    <div className="grid sm:grid-cols-3 gap-2 mt-2">
                      {["Morning 8-12", "Afternoon 12-5", "Evening 5-8"].map(
                        (t) => {
                          const isBooked = bookedSlots.some(
                            (s: any) => s.timeSlot === t,
                          );
                          return (
                            <button
                              key={t}
                              disabled={isBooked}
                              onClick={() => setData({ ...data, time: t })}
                              className={`p-3 rounded-xl border-2 text-sm transition-all ${
                                data.time === t
                                  ? "border-brand-green bg-brand-green/5"
                                  : isBooked
                                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                    : "border-border hover:border-brand-green/50"
                              }`}
                            >
                              {t}
                              {isBooked && (
                                <span className="block text-[10px] uppercase font-bold text-gray-400 mt-0.5">
                                  Booked
                                </span>
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Frequency
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {["One-time", "Weekly", "Bi-weekly", "Monthly"].map(
                        (f) => (
                          <button
                            key={f}
                            onClick={() => setData({ ...data, frequency: f })}
                            className={`p-3 rounded-xl border-2 text-sm ${data.frequency === f ? "border-brand-green bg-brand-green/5" : "border-border"}`}
                          >
                            {f}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl text-brand-dark mb-2">
                    Your details
                  </h2>
                  {[
                    ["name", "Full Name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                    ["addr1", "Address Line 1", "text"],
                    ["addr2", "Address Line 2 (optional)", "text"],
                    ["city", "City", "text"],
                    ["zip", "Zip Code", "text"],
                  ].map(([k, l, t]) => (
                    <label key={k} className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {l}
                      </span>
                      <input
                        type={t}
                        className="mt-1.5 w-full p-3 rounded-xl border border-border"
                        value={data[k] || ""}
                        onChange={(e) =>
                          setData({ ...data, [k]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Special instructions
                    </span>
                    <textarea
                      rows={3}
                      value={data.notes || ""}
                      onChange={(e) =>
                        setData({ ...data, notes: e.target.value })
                      }
                      className="mt-1.5 w-full p-3 rounded-xl border border-border resize-none"
                    />
                  </label>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl text-brand-dark mb-6">
                    Confirm your booking
                  </h2>
                  <div className="rounded-2xl bg-brand-cream p-6 space-y-3">
                    {[
                      ["Service", data.service],
                      ["Property", data.size],
                      ["Date", data.date || "—"],
                      ["Time", data.time],
                      ["Frequency", data.frequency],
                      ["Name", data.name || "—"],
                      [
                        "Address",
                        `${data.addr1 || "—"}, ${data.city || ""} ${data.zip || ""}`,
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between text-sm border-b border-border/50 pb-2"
                      >
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold text-brand-dark">
                          {v}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-muted-foreground">
                        Estimated total
                      </span>
                      <span className="text-3xl font-display font-bold text-brand-green">
                        ${estimatedTotal}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-brand-yellow/20 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-dark" /> 20% off
                    your first cleaning has been applied!
                  </div>
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
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn-primary"
                  >
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
            <aside className="lg:sticky lg:top-28 space-y-4" data-reveal>
              <div className="rounded-3xl bg-brand-dark text-white p-6 shadow-2xl">
                <div className="text-xs uppercase tracking-[0.25em] text-brand-lime">
                  Live Estimate
                </div>
                <div className="font-display text-5xl font-bold mt-3">
                  ${estimatedTotal}
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Final price may adjust after walkthrough for unusual scope.
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { icon: HomeIcon, label: data.service },
                    { icon: CalendarDays, label: data.date || "Pick a date" },
                    { icon: Clock, label: data.time },
                    { icon: MapPin, label: data.city || "Service location" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-2xl bg-white/8 p-3"
                    >
                      <Icon className="w-4 h-4 text-brand-lime" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-brand-lime text-brand-dark p-6">
                <CreditCard className="w-8 h-8" />
                <h3 className="font-display text-2xl mt-3">
                  No payment due today
                </h3>
                <p className="text-sm text-brand-dark/70 mt-2">
                  Your card is only collected after the booking is confirmed by
                  our team.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="py-16 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-10">
              <span className="pill" data-reveal>
                — Why Book With BIO —
              </span>
              <h2
                className="text-3xl md:text-4xl text-brand-dark mt-3"
                data-reveal
              >
                Booked. Insured. Guaranteed.
              </h2>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-reveal-group
            >
              {[
                {
                  icon: ShieldCheck,
                  t: "Insured & Bonded",
                  d: "$2M coverage on every job.",
                },
                {
                  icon: Leaf,
                  t: "100% Eco Products",
                  d: "Plant-based, kid & pet safe.",
                },
                {
                  icon: Clock,
                  t: "On-Time Promise",
                  d: "We arrive in your booked window.",
                },
                {
                  icon: Star,
                  t: "Re-Clean Guarantee",
                  d: "Free re-clean within 24 hours.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="card-feature">
                  <Icon className="w-9 h-9 text-brand-green mb-3" />
                  <h3 className="text-lg text-brand-dark">{t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page max-w-4xl">
            <div className="text-center mb-10">
              <span className="pill" data-reveal>
                — What Clients Say —
              </span>
              <h2
                className="text-3xl md:text-4xl text-brand-dark mt-3"
                data-reveal
              >
                Booked Today, Loved Tomorrow
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5" data-reveal-group>
              {[
                {
                  n: "Lena P.",
                  q: "Booking took less than a minute. Crew arrived early, place looked unreal.",
                },
                {
                  n: "Marcus T.",
                  q: "Friendliest team I've hired. The eco products smell amazing.",
                },
                {
                  n: "Devi R.",
                  q: "Move-out clean got me my full deposit back. Worth every cent.",
                },
              ].map((t) => (
                <div key={t.n} className="card-feature">
                  <div className="flex gap-0.5 text-brand-yellow mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-foreground/80">
                    &ldquo;{t.q}&rdquo;
                  </p>
                  <div className="mt-3 text-xs font-semibold text-brand-dark">
                    — {t.n}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-page">
            <div
              className="rounded-3xl bg-brand-yellow p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between"
              data-reveal
            >
              <div>
                <h3 className="text-2xl md:text-3xl text-brand-dark font-display">
                  Prefer to talk to a human?
                </h3>
                <p className="text-brand-dark/70 mt-2">
                  Call us 7 days a week, 7am – 8pm.
                </p>
              </div>
              <Link
                href="/contact"
                className="bg-brand-dark text-white font-bold px-8 py-4 rounded-full hover:bg-brand-green transition inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
