"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, MapPin, ShieldCheck, Sparkles, Clock, Compass } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

export default function LocalHighlights({ section }: { section?: WebsiteHomepageSection }) {
  const highlights = [
    {
      title: "Eco-First Supplies",
      desc: "100% plant-based chemistry safe for kids, pets, and the Colorado environment.",
      icon: Leaf,
    },
    {
      title: "Certified Cleaners",
      desc: "Background-checked, insured, and trained rigorously to Bio standards.",
      icon: ShieldCheck,
    },
    {
      title: "Punctual Arrival",
      desc: "Guaranteed arrival windows with real-time dispatch updates.",
      icon: Clock,
    },
    {
      title: "50-Point Inspection",
      desc: "Every room undergoes our structured quality inspection before handoff.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Styled Map Graphic Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-brand-green/15 bg-gradient-to-br from-[#eef8f2] via-[#f5faf6] to-[#e4f3ea] p-8 shadow-xl sm:p-10">
              {/* Map Illustration Elements */}
              <div className="relative aspect-[4/3] w-full rounded-2xl border border-brand-green/10 bg-white/70 p-6 backdrop-blur-sm">
                <svg viewBox="0 0 400 300" className="h-full w-full opacity-85">
                  <defs>
                    <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c3eed2" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#7ce337" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  {/* Styled Colorado county polygons */}
                  <path d="M 40 40 L 160 30 L 220 70 L 180 140 L 60 120 Z" fill="url(#mapGrad)" opacity="0.4" />
                  <path d="M 180 70 L 320 50 L 360 130 L 250 160 L 190 120 Z" fill="url(#mapGrad)" opacity="0.6" />
                  <path d="M 70 140 L 190 150 L 210 240 L 90 260 Z" fill="url(#mapGrad)" opacity="0.5" />
                  <path d="M 200 160 L 350 140 L 380 230 L 230 250 Z" fill="url(#mapGrad)" opacity="0.7" />

                  {/* Connected Route Lines */}
                  <path d="M 110 90 Q 190 120 280 110 T 310 180" fill="none" stroke="#22794a" strokeWidth="2.5" strokeDasharray="5,5" />
                  <path d="M 190 120 Q 210 190 150 210" fill="none" stroke="#22794a" strokeWidth="2" strokeDasharray="4,4" />

                  {/* Interactive-looking Location Pins */}
                  <g className="animate-pulse">
                    <circle cx="280" cy="110" r="14" fill="#7ce337" fillOpacity="0.4" />
                    <circle cx="280" cy="110" r="7" fill="#0C3629" />
                  </g>
                  <g>
                    <circle cx="190" cy="120" r="18" fill="#7ce337" fillOpacity="0.3" />
                    <circle cx="190" cy="120" r="8" fill="#22794a" />
                  </g>
                  <g>
                    <circle cx="150" cy="210" r="12" fill="#7ce337" fillOpacity="0.4" />
                    <circle cx="150" cy="210" r="6" fill="#0C3629" />
                  </g>
                </svg>

                {/* Overlay floating badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-brand-green/20 bg-white/95 px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-lime text-brand-dark">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-brand-dark">Aurora, CO Service Hub</div>
                      <div className="text-[11px] text-muted-foreground">Active cleaner crews dispatched daily</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-lime/30 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-dark">
                    Live
                  </span>
                </div>
              </div>

              {/* Stat footer inside map card */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                  <div className="text-xl font-extrabold text-[#0C3629]">98%</div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">On-Time</div>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                  <div className="text-xl font-extrabold text-[#0C3629]">5,100+</div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Homes Cleaned</div>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                  <div className="text-xl font-extrabold text-[#0C3629]">4.9 ★</div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content Details */}
          <div>
            <div className="editorial-kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{section?.eyebrow || "Local Aurora Community"}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
              {section?.title || "Things To Do In Aurora, CO"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {section?.subtitle ||
                "Enjoy an afternoon at Cherry Creek State Park, explore Stanley Marketplace, or golf at Murphy Creek while our professional crew restores order, sparkle, and calm to your home."}
            </p>

            {/* 4 Feature Badges */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-brand-green/10 bg-[#f7faf8] p-4 transition hover:border-brand-lime hover:bg-white hover:shadow-md"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-lime/40 text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark text-sm">{item.title}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/book" className="btn-primary rounded-full px-7">
                Book Your Clean Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/service-areas" className="btn-secondary rounded-full px-6">
                Explore Aurora Areas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
