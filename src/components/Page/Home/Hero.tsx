"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Phone, Play, Sparkles, X, ShieldCheck, Star } from "lucide-react";
import type { WebsiteSnapshot } from "@/src/redux/features/website/types";
import heroCleaners from "@/src/assets/full-services.jpeg";
import QuoteBar from "@/src/components/Page/Home/QuoteBar";

export default function Hero({ content }: { content?: WebsiteSnapshot }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const hero = content?.hero;
  const phone = content?.contact?.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const primary = hero?.primaryCta || { label: "Get a Free Quote", url: "/book" };
  const secondary = hero?.secondaryCta || { label: "Call Us Now", url: phoneHref };

  const trustItems = hero?.trustItems?.length
    ? hero.trustItems
    : ["5,100+ Happy Clients", "4.9 Google Rating", "100% Eco-Friendly", "Fully Bonded & Insured"];

  const headline = hero?.title || "House Cleaning Services in Aurora, CO";
  const subtitle =
    hero?.description ||
    "Find top-rated local cleaners in Aurora, CO ready to make your home shine. Transparent pricing, eco-friendly supplies, and satisfaction guaranteed.";

  return (
    <section data-cinema-hero className="relative overflow-hidden bg-[#0C3629] pb-16 pt-10 text-white md:pb-24 md:pt-14">
      {/* Soft atmospheric background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-lime/10 blur-[90px]" />

      <div className="container-page relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div data-cinema-intro className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{hero?.eyebrow || "Top Rated Local Cleaners"}</span>
        </div>

        {/* Main Title */}
        <h1
          data-cinema-intro
          className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.06]"
        >
          {headline}
        </h1>

        {/* Subtitle */}
        <p
          data-cinema-intro
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div data-cinema-intro className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primary.url || "/book"}
            className="btn-primary min-h-[50px] rounded-full px-8 text-sm font-extrabold shadow-[0_10px_30px_-8px_rgba(124,227,55,0.6)]"
          >
            {primary.label || "Get a Free Quote"}
          </Link>

          <a
            href={phoneHref}
            className="btn-ghost-light min-h-[50px] rounded-full px-7 text-sm font-bold"
          >
            <Phone className="h-4 w-4 text-brand-lime" />
            <span>{secondary.label === "Call Us Now" ? `Call Us: ${phone}` : secondary.label}</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div
          data-cinema-intro
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/75 sm:text-sm"
        >
          {trustItems.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-brand-lime" /> {item}
            </span>
          ))}
        </div>

        {/* Featured Video / Image Showcase Frame */}
        <div
          data-cinema-intro
          className="group relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border-4 border-white/20 bg-black/40 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.7)]"
        >
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] md:aspect-[16/8]">
            <Image
              src={heroCleaners}
              alt="Professional house cleaning crew in Aurora, CO"
              priority
              fill
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629]/70 via-transparent to-black/20" />

            {/* Centered Play Button */}
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              aria-label="Play cleaning showcase video"
              className="absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#0C3629] shadow-2xl transition hover:scale-110 sm:h-20 sm:w-20"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-lime opacity-30" />
              <Play className="ml-1 h-7 w-7 fill-[#0C3629] text-[#0C3629]" />
            </button>

            {/* Bottom floating badge */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/45 px-5 py-3 text-left backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark font-black">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">Aurora & Metro Denver Premiere Care</div>
                  <div className="text-xs text-white/70">Certified teams • Eco-friendly supplies • 100% Guaranteed</div>
                </div>
              </div>
              <Link
                href="/book"
                className="hidden rounded-full bg-brand-lime px-4 py-2 text-xs font-extrabold text-brand-dark transition hover:bg-white sm:inline-block"
              >
                Instant Booking
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Quote Interactive Bar */}
        <div className="mt-8 max-w-4xl mx-auto">
          <QuoteBar />
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white hover:bg-brand-lime hover:text-brand-dark"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Bio Cleaning Services in action"
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
