"use client";

import { SiteLayout } from "../Layouts/SiteLayout";
import { BookingWizard } from "../components/Booking/BookingWizard";
import { BookingFeatures } from "../components/Booking/BookingFeatures";
import { BookingTestimonials } from "../components/Booking/BookingTestimonials";
import { BadgeCheck, Calendar, Clock, Leaf, ShieldCheck, Sparkles } from "lucide-react";

export default function BookPage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-white">
        {/* Spruce Forest Green Hero */}
        <section className="relative overflow-hidden bg-[#0C3629] py-16 text-white md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[110px]" />
          <div className="pointer-events-none absolute right-12 top-10 h-64 w-64 rounded-full bg-brand-lime/10 blur-[80px]" />

          <div className="container-page relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant Capacity Booking</span>
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.08]">
              Book Your Cleaning Online in Under 60 Seconds.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Select your service, customize room details, and pick an exact arrival window matched directly to our live cleaner crew capacity in Aurora and Metro Denver.
            </p>

            {/* Quick Guarantees Pill Bar */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-brand-lime" /> Transparent Flat Pricing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-brand-lime" /> 100% Eco-Friendly Supplies
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-lime" /> Bonded & Insured Crew
              </span>
            </div>
          </div>
        </section>

        {/* Wizard Container */}
        <div className="py-12 lg:py-16 bg-[#f7faf8]">
          <div className="container-page max-w-5xl">
            <BookingWizard mode="public" />
          </div>
        </div>

        {/* Supporting Trust & Features */}
        <BookingFeatures />
        <BookingTestimonials />
      </main>
    </SiteLayout>
  );
}
