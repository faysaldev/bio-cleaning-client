"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, DollarSign, HeartHandshake, Leaf, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

export default function WhyChooseUs({ section }: { section?: WebsiteHomepageSection }) {
  const cards = [
    {
      icon: UserCheck,
      title: "Experienced Cleaners",
      desc: "Every cleaner passes rigorous background checks, reference verifications, and BIO practical training.",
      dark: false,
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Products",
      desc: "Plant-derived detergents, EPA-registered disinfectants, and zero volatile organic compounds (VOCs).",
      dark: false,
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      desc: "Book online in 60 seconds. Choose morning or afternoon arrival windows that fit your life.",
      dark: false,
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      desc: "Flat-rate quotes based on your home size with no hidden add-ons or unexpected post-service surprises.",
      dark: false,
    },
    {
      icon: ShieldCheck,
      title: "Bonded & Insured",
      desc: "Full comprehensive liability and bonding protection on every team member who enters your home.",
      dark: false,
    },
    {
      icon: HeartHandshake,
      title: "100% Satisfaction Guarantee",
      desc: "Not 100% thrilled with any spot? Contact us within 24 hours and we will dispatch a crew to re-clean for free.",
      dark: true, // The standout dark forest green card from the design image!
    },
  ];

  return (
    <section className="bg-[#f7faf8] py-20 lg:py-28">
      <div className="container-page">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="editorial-kicker mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{section?.eyebrow || "Why Us"}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
            {section?.title || "Why Choose Our House Cleaning Services?"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {section?.subtitle ||
              "We combine hospital-level sanitation standards with a friendly, five-star hospitality touch you can rely on every visit."}
          </p>
        </div>

        {/* 6-Card Grid (3 columns x 2 rows) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            if (card.dark) {
              // Standout Dark Spruce Green Card
              return (
                <div
                  key={card.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#0C3629] p-8 text-white shadow-2xl transition hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(12,54,41,0.4)]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-lime/15 blur-2xl" />

                  <div>
                    <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-brand-lime text-brand-dark font-black shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="inline-block rounded-full bg-brand-lime/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime mb-3">
                      BIO Promise
                    </div>

                    <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/15 pt-5">
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-lime transition hover:text-white"
                    >
                      Book With Full Confidence <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            }

            // Standard Light Feature Card
            return (
              <div
                key={card.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-brand-green/12 bg-white p-8 shadow-sm transition hover:-translate-y-1.5 hover:border-brand-lime hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf6ed] text-[#22794A] transition group-hover:bg-brand-lime group-hover:text-brand-dark">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-extrabold text-brand-dark">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-green">
                  <BadgeCheck className="h-4 w-4 text-brand-lime" />
                  <span>Guaranteed BIO Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
