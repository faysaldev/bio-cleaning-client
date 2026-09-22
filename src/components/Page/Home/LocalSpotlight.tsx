"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, HeartHandshake, UserCheck } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import familyCleanImg from "@/src/assets/why-choose.jpeg";

export default function LocalSpotlight({ section }: { section?: WebsiteHomepageSection }) {
  const features = [
    {
      title: "Experienced Staff",
      desc: "Fully background-checked, insured, and trained to hospital-grade sanitation standards.",
      icon: UserCheck,
    },
    {
      title: "100% Satisfaction",
      desc: "If any spot doesn't meet your expectations, we return to re-clean within 24 hours.",
      icon: HeartHandshake,
    },
    {
      title: "Custom Checklist",
      desc: "Add specific instructions for pets, fragile decor, or focus areas via your client portal.",
      icon: CheckCircle2,
    },
    {
      title: "Bonded & Insured",
      desc: "Full comprehensive general liability insurance coverage on every single appointment.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Text & Features */}
          <div>
            <div className="editorial-kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{section?.eyebrow || "Local Neighborhood Care"}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
              {section?.title || "Arvada, CO House Cleaning Near Me"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {section?.subtitle ||
                "Whether you need regular bi-weekly upkeep, a spring deep clean, or move-out turnaround, our certified Arvada cleaning teams bring all the equipment, green supplies, and meticulous care your home deserves."}
            </p>

            {/* 4 Feature Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-brand-green/12 bg-[#f7faf8] p-5 transition hover:border-brand-lime hover:bg-white hover:shadow-md"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime/40 text-brand-dark mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-brand-dark">{f.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/book" className="btn-primary rounded-full px-7">
                Get An Instant Estimate <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-secondary rounded-full px-6">
                Learn About Our Standards
              </Link>
            </div>
          </div>

          {/* Right Column: Rounded Family / Clean Home Photo */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white shadow-2xl sm:aspect-[1/1] lg:aspect-[4/3]">
              <Image
                src={familyCleanImg}
                alt="Happy family in clean Arvada home"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629]/75 via-transparent to-transparent" />

              {/* Floating review snippet on bottom */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/95 p-5 text-brand-dark shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-green">
                  <Sparkles className="h-4 w-4 text-brand-lime" />
                  <span>The Bio Cleaning Difference</span>
                </div>
                <p className="mt-1 text-sm font-bold text-brand-dark">
                  &ldquo;Coming home on cleaning days is our family&apos;s favorite feeling. Everything smells clean and fresh without chemical fumes!&rdquo;
                </p>
                <div className="mt-2 text-xs text-muted-foreground font-semibold">
                  — Sarah & Dave M., Arvada Homeowners
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
