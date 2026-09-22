"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import type { CleaningService } from "@/src/redux/features/services/types";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import cleanerAvatar from "@/src/assets/service-residential.jpeg";
import deepCleanImg from "@/src/assets/service-deep.jpeg";
import commercialImg from "@/src/assets/service-commercial.jpeg";

export default function ServicesCarousel({
  services = [],
  section,
}: {
  services?: CleaningService[];
  section?: WebsiteHomepageSection;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackServices = [
    {
      _id: "res-1",
      name: "Residential House Cleaning",
      slug: "residential-cleaning",
      basePrice: 135,
      duration: "2.5 - 3.5 hrs",
      image: cleanerAvatar,
      description: "Routine upkeep for living rooms, kitchens, bedrooms, and bathrooms.",
      checklist: [
        "Kitchen deep degreasing, microwave inside & exterior appliances polished",
        "Bathrooms fully disinfected, fixtures descaled, mirrors streak-free",
        "Dusting all surfaces, vacuuming carpets, and microfiber mop on hard floors",
      ],
    },
    {
      _id: "deep-1",
      name: "Comprehensive Deep Clean",
      slug: "deep-cleaning",
      basePrice: 220,
      duration: "4.0 - 6.0 hrs",
      image: deepCleanImg,
      description: "Intensive room-by-room reset targeting built-up grime, baseboards, and neglected corners.",
      checklist: [
        "Baseboards, door frames, light switches, and vent covers hand-detailed",
        "Behind and underneath movable furniture thoroughly vacuumed & mopped",
        "Deep scrub of tile grout, shower enclosures, and persistent limescale",
      ],
    },
    {
      _id: "move-1",
      name: "Move-In / Move-Out Turnkey Clean",
      slug: "move-in-move-out",
      basePrice: 260,
      duration: "5.0 - 7.0 hrs",
      image: cleanerAvatar,
      description: "Complete vacancy reset ensuring security deposit returns and clean starts.",
      checklist: [
        "Inside and outside of all kitchen and bathroom cabinets & drawers",
        "Interior refrigerator and oven deep cleaning included",
        "Wall spot-cleaning, window sills, tracks, and closet resets",
      ],
    },
    {
      _id: "com-1",
      name: "Commercial & Office Cleaning",
      slug: "commercial-cleaning",
      basePrice: 180,
      duration: "Custom schedule",
      image: commercialImg,
      description: "Reliable after-hours or daytime office sanitization for healthy workspaces.",
      checklist: [
        "Workstation dusting, keyboard sanitization, and trash removal",
        "Kitchenette disinfection, coffee station care, and refrigerator wipedown",
        "Restroom restocking, mirror polishing, and commercial vacuuming",
      ],
    },
  ];

  const items = services.length
    ? services.map((s, i) => ({
        _id: s._id,
        name: s.name,
        slug: s.slug || s._id,
        basePrice: s.basePrice || 135,
        duration: s.duration || "2.5 - 4.0 hrs",
        image: s.image || cleanerAvatar,
        description: s.description || "Professional cleaning with eco-friendly supplies and satisfaction guaranteed.",
        checklist: [
          "Complete room-by-room cleaning checklist following Bio standards",
          "Eco-friendly supplies safe for people, children, and household pets",
          "Final walkthrough inspection to guarantee 100% satisfaction",
        ],
      }))
    : fallbackServices;

  const current = items[currentIndex] || items[0];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className="bg-[#f7faf8] py-20 lg:py-28">
      <div className="container-page">
        {/* Header & Controls */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end mb-12">
          <div>
            <div className="editorial-kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{section?.eyebrow || "Our Cleaning Services"}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
              {section?.title || "Our Cleaning Services"}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
              {section?.subtitle || "Tailored cleaning protocols designed for homes, apartments, and workspaces across Aurora and Denver."}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous service"
              className="grid h-12 w-12 place-items-center rounded-full border border-brand-green/20 bg-white text-brand-dark shadow-sm transition hover:bg-brand-lime hover:text-brand-dark hover:border-brand-lime"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next service"
              className="grid h-12 w-12 place-items-center rounded-full border border-brand-green/20 bg-white text-brand-dark shadow-sm transition hover:bg-brand-lime hover:text-brand-dark hover:border-brand-lime"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Active Carousel Card */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-green/15 bg-white p-6 shadow-xl sm:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[400px_1fr] lg:gap-14">
            {/* Left: Circular Cleaner Frame */}
            <div className="relative mx-auto flex items-center justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-brand-lime/50 bg-[#eef8f2] shadow-2xl sm:h-80 sm:w-80">
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  unoptimized={typeof current.image === "string" && current.image.startsWith("http")}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-4 rounded-full bg-brand-dark px-4 py-1.5 text-xs font-black text-brand-lime shadow-lg">
                From ${current.basePrice}
              </div>
            </div>

            {/* Right: Details & Checklist */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-lime/30 px-3 py-1 text-xs font-extrabold text-brand-dark">
                  Popular Choice
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  Duration: {current.duration}
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-extrabold text-brand-dark sm:text-3xl lg:text-4xl">
                {current.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {current.description}
              </p>

              {/* Checklist Items */}
              <div className="mt-6 space-y-3">
                {current.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-lime text-brand-dark">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="text-sm font-medium text-foreground/85">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/book"
                  className="btn-primary rounded-full px-7"
                >
                  Book This Service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/services/${current.slug}`}
                  className="btn-secondary rounded-full px-6"
                >
                  View Details & Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to service ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentIndex ? "w-8 bg-brand-lime" : "w-2.5 bg-brand-green/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
