"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Check, Clock, MapPin, Sparkles, Star } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

export default function RecurringPlans({ section }: { section?: WebsiteHomepageSection }) {
  const plans = [
    {
      name: "Weekly Service",
      discount: "Save 20%",
      desc: "For busy households, families, and pet owners who love a perpetually spotless home.",
      popular: false,
    },
    {
      name: "Bi-Weekly Service",
      discount: "Save 15%",
      desc: "Our most requested schedule. Keeps bathrooms, kitchens, and floors fresh year-round.",
      popular: true,
    },
    {
      name: "Monthly Service",
      discount: "Save 10%",
      desc: "Thorough deep maintenance clean every four weeks to tackle heavy grime.",
      popular: false,
    },
    {
      name: "One-Time Deep Clean",
      discount: "Standard Rate",
      desc: "Ideal for special events, seasonal resets, or move-in/move-out readiness.",
      popular: false,
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Styled Street Map Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-brand-green/15 bg-[#f0f7f3] p-6 shadow-xl sm:p-8">
              {/* Map Canvas Illustration */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-green/20 bg-white">
                <svg viewBox="0 0 500 380" className="h-full w-full opacity-85">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0ece3" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Arterial Roads */}
                  <path d="M 0 100 Q 250 80 500 120" fill="none" stroke="#cde5d5" strokeWidth="12" />
                  <path d="M 0 260 L 500 240" fill="none" stroke="#cde5d5" strokeWidth="10" />
                  <path d="M 120 0 L 140 380" fill="none" stroke="#cde5d5" strokeWidth="10" />
                  <path d="M 360 0 L 340 380" fill="none" stroke="#cde5d5" strokeWidth="12" />

                  {/* Highway route */}
                  <path d="M 30 350 L 470 50" fill="none" stroke="#7ce337" strokeWidth="5" strokeDasharray="8,6" opacity="0.8" />

                  {/* Arvada Service Zone Highlight */}
                  <circle cx="240" cy="180" r="110" fill="#7ce337" fillOpacity="0.12" stroke="#22794A" strokeWidth="2" strokeDasharray="6,4" />

                  {/* Service Pins with active pulse */}
                  <g className="animate-bounce">
                    <circle cx="240" cy="180" r="18" fill="#7ce337" fillOpacity="0.4" />
                    <circle cx="240" cy="180" r="8" fill="#0C3629" />
                  </g>
                  <g>
                    <circle cx="160" cy="120" r="14" fill="#7ce337" fillOpacity="0.3" />
                    <circle cx="160" cy="120" r="6" fill="#22794A" />
                  </g>
                  <g>
                    <circle cx="330" cy="220" r="14" fill="#7ce337" fillOpacity="0.3" />
                    <circle cx="330" cy="220" r="6" fill="#22794A" />
                  </g>
                  <g>
                    <circle cx="290" cy="100" r="12" fill="#7ce337" fillOpacity="0.3" />
                    <circle cx="290" cy="100" r="5" fill="#0C3629" />
                  </g>
                </svg>

                {/* Floating Map Label Badge */}
                <div className="absolute left-4 top-4 rounded-xl border border-brand-green/20 bg-white/95 px-4 py-2.5 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-black text-brand-dark">
                    <MapPin className="h-4 w-4 text-brand-green" />
                    <span>Arvada & Metro Service Radius</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Zero travel fees within regular coverage zone
                  </div>
                </div>

                {/* Bottom Route Status Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-[#0C3629] px-4 py-2.5 text-white shadow-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-brand-lime" />
                    <span>Same-day & next-day slots available</span>
                  </div>
                  <span className="rounded-full bg-brand-lime px-2.5 py-0.5 text-[10px] font-black text-brand-dark">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content & 4 Recurring Plans */}
          <div>
            <div className="editorial-kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{section?.eyebrow || "Recurring Clean Plans"}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
              {section?.title || "Recurring Cleaning Services in Arvada, CO"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {section?.subtitle ||
                "Save time and money with automatic recurring cleanings. Enjoy dedicated cleaners assigned to your home, seamless scheduling, and priority calendar booking."}
            </p>

            {/* 4 Plan Cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-4 transition hover:shadow-md ${
                    plan.popular
                      ? "border-brand-lime bg-[#f4faf5] ring-2 ring-brand-lime/50"
                      : "border-brand-green/12 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-brand-dark text-sm">{plan.name}</span>
                    <span className="rounded-full bg-brand-lime px-2.5 py-0.5 text-[10px] font-black text-brand-dark">
                      {plan.discount}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {plan.desc}
                  </p>
                  {plan.popular ? (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-brand-green">
                      <Star className="h-3 w-3 fill-brand-lime text-brand-lime" /> Most Popular in Arvada
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/book" className="btn-primary rounded-full px-7">
                Schedule Recurring Service <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/quote" className="btn-secondary rounded-full px-6">
                Calculate Rate Savings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
