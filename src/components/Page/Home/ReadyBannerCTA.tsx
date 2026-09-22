"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, CheckCircle2 } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import cleanerImg from "@/src/assets/full-services-2.jpeg";

export default function ReadyBannerCTA({
  section,
  phone = "+1 (800) BIO-CLEAN",
}: {
  section?: WebsiteHomepageSection;
  phone?: string;
}) {
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const cta = section?.cta || { label: "Book Cleaning Now", url: "/book" };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-page">
        {/* Vibrant Lime Gradient Curved Banner */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#bdf249] via-[#9fe932] to-[#7be12b] p-8 sm:p-12 lg:p-16 shadow-[0_24px_60px_-18px_rgba(124,227,55,0.5)]">
          {/* Subtle concentric circles background decoration */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full border-8 border-white/20" />
          <div className="pointer-events-none absolute -left-10 -top-10 h-60 w-60 rounded-full border-8 border-white/15" />
          <div className="pointer-events-none absolute right-1/3 -bottom-20 h-80 w-80 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0C3629]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#0C3629] mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{section?.eyebrow || "Instant Online Booking"}</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#0C3629] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                {section?.title || "Ready for Your Cleanest Home Yet?"}
              </h2>

              <p className="mt-4 max-w-xl text-base font-medium text-[#0C3629]/80 sm:text-lg">
                {section?.subtitle ||
                  "Book online in under 60 seconds. Choose your preferred schedule, pick custom add-ons, and leave the chores to our certified crew."}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={cta.url || "/book"}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#0C3629] px-8 text-sm font-extrabold text-white shadow-xl transition-all hover:bg-[#07251c] hover:-translate-y-0.5"
                >
                  {cta.label || "Book Cleaning Now"} <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={phoneHref}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border-2 border-[#0C3629]/25 bg-white/60 px-7 text-sm font-extrabold text-[#0C3629] backdrop-blur-sm transition-all hover:bg-white hover:border-[#0C3629]"
                >
                  <Phone className="h-4 w-4 text-[#0C3629]" />
                  <span>Call {phone}</span>
                </a>
              </div>

              {/* Guarantees below buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#0C3629]/80">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0C3629]" /> No Long-Term Contracts
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0C3629]" /> 100% Satisfaction Re-clean
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0C3629]" /> Bonded & Insured Crew
                </span>
              </div>
            </div>

            {/* Right: Cleaner Image Card Frame */}
            <div className="relative mx-auto flex items-center justify-center lg:justify-end">
              <div className="relative h-72 w-72 overflow-hidden rounded-3xl border-4 border-white/60 bg-white/30 shadow-2xl backdrop-blur-sm sm:h-96 sm:w-96 lg:h-[420px] lg:w-[420px]">
                <Image
                  src={cleanerImg}
                  alt="Cheerful Bio Cleaning technician ready with eco-friendly supplies"
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629]/50 via-transparent to-transparent" />

                {/* Floating pill badge */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 text-center shadow-lg backdrop-blur-md">
                  <div className="text-xs font-black uppercase tracking-wider text-[#0C3629]">
                    Colorado&apos;s #1 Eco-Friendly Cleaners
                  </div>
                  <div className="text-[11px] font-bold text-muted-foreground mt-0.5">
                    Over 5,100 Happy Homes Restored
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
