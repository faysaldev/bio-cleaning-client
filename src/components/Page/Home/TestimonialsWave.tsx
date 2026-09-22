"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Sparkles, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import type { WebsiteHomepageSection, WebsiteTestimonial } from "@/src/redux/features/website/types";

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatarInitial: string;
  avatarColor: string;
}

export default function TestimonialsWave({
  testimonials = [],
  section,
}: {
  testimonials?: WebsiteTestimonial[];
  section?: WebsiteHomepageSection;
}) {
  const fallbackReviews: ReviewItem[] = [
    {
      id: "1",
      name: "Jessica Miller",
      location: "Aurora, CO",
      rating: 5,
      text: "The best cleaning crew we've ever hired! They transformed our home in 3 hours flat. Every baseboard, shower tile, and kitchen corner was immaculate. Truly hospitality-level service.",
      avatarInitial: "JM",
      avatarColor: "bg-emerald-600",
    },
    {
      id: "2",
      name: "Marcus Vance",
      location: "Arvada, CO",
      rating: 5,
      text: "We switched to Bio Cleaning for our bi-weekly cleanings 6 months ago and will never go back. Eco-friendly supplies that don't trigger my dog's allergies, plus punctuality you can set a clock to.",
      avatarInitial: "MV",
      avatarColor: "bg-teal-600",
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      location: "Denver, CO",
      rating: 5,
      text: "Booked their move-out clean and got 100% of my deposit back from our landlord. The refrigerator and oven looked brand new. Super friendly and professional team!",
      avatarInitial: "SR",
      avatarColor: "bg-lime-600",
    },
    {
      id: "4",
      name: "David Kim",
      location: "Centennial, CO",
      rating: 5,
      text: "Flawless attention to detail. I love the online booking and client portal where I can leave notes for our cleaner. Highly recommend to anyone in the Denver metro area.",
      avatarInitial: "DK",
      avatarColor: "bg-green-700",
    },
    {
      id: "5",
      name: "Amanda Brooks",
      location: "Lakewood, CO",
      rating: 5,
      text: "Between work and two toddlers, our house gets chaotic quickly. Bio Cleaning gives us our weekends back. Clean, calm, and completely handled every single visit.",
      avatarInitial: "AB",
      avatarColor: "bg-emerald-700",
    },
    {
      id: "6",
      name: "Brian O'Connor",
      location: "Aurora, CO",
      rating: 5,
      text: "Top-tier reliability. Their 50-point inspection protocol is genuine—we checked everywhere and found zero dust. Worth every single penny.",
      avatarInitial: "BO",
      avatarColor: "bg-teal-700",
    },
  ];

  const items: ReviewItem[] = testimonials?.length
    ? testimonials.map((t, idx) => ({
        id: t.id || String(idx),
        name: t.name || "Happy Client",
        location: t.role || "Aurora, CO",
        rating: t.rating || 5,
        text: t.quote || "Outstanding service from start to finish. Highly recommended!",
        avatarInitial: t.name ? t.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "BC",
        avatarColor: "bg-emerald-600",
      }))
    : fallbackReviews;

  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] || items[0];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="editorial-kicker mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{section?.eyebrow || "Testimonials"}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
            {section?.title || "Real Stories From Colorado Homes"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {section?.subtitle ||
              "Hear what our verified recurring and one-time clients say about our cleaning crews and service quality."}
          </p>
        </div>

        {/* The Wave Ribbon with Floating Client Avatars */}
        <div className="relative mx-auto max-w-4xl py-8">
          {/* Smooth S-curve SVG Line */}
          <div className="relative w-full overflow-visible">
            <svg viewBox="0 0 900 140" className="w-full overflow-visible">
              <path
                d="M 20 70 Q 220 10 450 70 T 880 70"
                fill="none"
                stroke="#cde9d6"
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              <path
                d="M 20 70 Q 220 10 450 70 T 880 70"
                fill="none"
                stroke="#7ce337"
                strokeWidth="2"
                opacity="0.7"
              />
            </svg>

            {/* Circular Avatars positioned across the wave */}
            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-12">
              {items.slice(0, 6).map((item, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`group relative flex flex-col items-center transition-transform duration-300 ${
                      isSelected ? "scale-125 z-20" : "scale-100 hover:scale-110 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full text-white font-extrabold text-sm shadow-lg transition-all ${
                        item.avatarColor
                      } ${
                        isSelected
                          ? "ring-4 ring-brand-lime ring-offset-2 shadow-[0_0_20px_rgba(124,227,55,0.7)]"
                          : "ring-2 ring-white"
                      }`}
                    >
                      {item.avatarInitial}
                    </div>
                    <span className="mt-1 hidden sm:block text-[11px] font-bold text-brand-dark bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                      {item.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Review Card (Dark Forest Green like in reference image!) */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-8 sm:p-10 text-white shadow-2xl">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-brand-lime/15 blur-2xl" />

            <div className="flex items-center justify-between">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-brand-lime">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-xs font-black text-white/90">5.0 Out of 5.0</span>
              </div>

              <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime">
                Verified Client
              </div>
            </div>

            {/* Testimonial Quote */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/90 italic font-medium">
              &ldquo;{active.text}&rdquo;
            </p>

            {/* Client Signature & Controls */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full text-white font-black text-xs ${active.avatarColor}`}>
                  {active.avatarInitial}
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">{active.name}</div>
                  <div className="text-xs text-white/60">{active.location}</div>
                </div>
              </div>

              {/* Next / Prev Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-brand-lime hover:text-brand-dark transition"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-brand-lime hover:text-brand-dark transition"
                  aria-label="Next review"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
