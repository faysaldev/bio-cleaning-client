"use client";

import { SiteLayout } from "../Layouts/SiteLayout";
import { BookingWizard } from "../components/Booking/BookingWizard";
import { BookingFeatures } from "../components/Booking/BookingFeatures";
import { BookingTestimonials } from "../components/Booking/BookingTestimonials";

export default function BookPage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-white">
        <section className="border-b border-border bg-[linear-gradient(135deg,var(--brand-dark),#174b34)] px-4 py-14 text-white sm:py-18">
          <div className="container-page max-w-5xl">
            <span className="editorial-kicker !text-brand-lime">Live booking engine</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">Book around real crew capacity, not a fake calendar.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">Choose a service, property scope, extras, recurrence, and an exact slot generated from BIO Cleaning&apos;s live business hours and team availability.</p>
          </div>
        </section>
        <BookingWizard mode="public" />
        <BookingFeatures />
        <BookingTestimonials />
      </main>
    </SiteLayout>
  );
}
