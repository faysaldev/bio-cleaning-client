"use client";

import type { WebsiteFaq, WebsiteHomepageSection } from "@/src/redux/features/website/types";
import { ArrowRight, MessageCircle, Minus, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const fallback: WebsiteFaq[] = [
  {
    id: "supplies",
    question: "Do your cleaners bring all their own supplies and equipment?",
    answer: "Yes! Our technicians arrive in fully-equipped vehicles carrying commercial HEPA vacuums, microfiber color-coded systems, and 100% plant-based, pet-safe cleaning solutions. You don't need to supply a thing.",
    visible: true,
    order: 10,
  },
  {
    id: "pets",
    question: "Are your cleaning products safe for my pets and children?",
    answer: "Absolutely. We strictly utilize non-toxic, biodegradable, EPA-registered products free of harsh fumes, ammonia, bleach, and synthetic phthalates. Your floors and furniture are safe for bare paws and hands immediately after cleaning.",
    visible: true,
    order: 20,
  },
  {
    id: "recurring",
    question: "How do recurring cleaning discounts and scheduling work?",
    answer: "When you choose Weekly (20% off), Bi-Weekly (15% off), or Monthly (10% off), your discount is automatically applied to every appointment. You can skip, reschedule, or adjust your service online with 48 hours notice with zero penalty.",
    visible: true,
    order: 30,
  },
  {
    id: "satisfaction",
    question: "What happens if I'm not satisfied with a cleaned area?",
    answer: "We stand behind our 100% Satisfaction Guarantee. If any room or surface doesn't meet your standards, notify us within 24 hours of completion and we will dispatch a team member to re-clean the area free of charge.",
    visible: true,
    order: 40,
  },
  {
    id: "insurance",
    question: "Are your cleaners background-checked, bonded, and insured?",
    answer: "Yes, 100%. Every employee undergoes a comprehensive federal background check, identity verification, and structured training. We carry full general liability and bonding insurance for complete peace of mind.",
    visible: true,
    order: 50,
  },
];

export default function FAQ({
  faqs,
  section,
}: {
  faqs?: WebsiteFaq[];
  section?: WebsiteHomepageSection;
}) {
  const items = useMemo(() => {
    const selected = faqs?.filter((item) => item.visible).sort((a, b) => a.order - b.order) || [];
    return selected.length ? selected : fallback;
  }, [faqs]);

  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Column: Info card */}
          <div className="lg:sticky lg:top-28">
            <div className="editorial-kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{section?.eyebrow || "Common Inquiries"}</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
              {section?.title || "Frequently Asked Questions"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {section?.subtitle ||
                "Everything you need to know about our cleaning processes, eco-friendly supplies, pricing, and 100% satisfaction guarantee."}
            </p>

            <div className="mt-8 rounded-3xl bg-[#0C3629] p-8 text-white shadow-xl">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime text-brand-dark font-black">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-white">Have a special request?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Have specific allergies, delicate surfaces, or post-renovation cleanup needs? Our client specialists are ready to tailor a custom plan.
              </p>
              <div className="mt-6">
                <Link href="/contact" className="btn-primary rounded-full px-6 text-xs font-black">
                  Contact Client Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="space-y-3.5">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.id}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-brand-lime bg-[#f5faf6] shadow-sm ring-1 ring-brand-lime/50"
                      : "border-brand-green/12 bg-white hover:border-brand-green/30"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-extrabold text-brand-dark text-base">{f.question}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors ${
                        isOpen ? "bg-brand-lime text-brand-dark" : "bg-[#eaf6ed] text-brand-dark"
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground border-t border-brand-green/8 pt-3">
                      {f.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="pt-6 text-center">
              <Link href="/contact" className="btn-secondary rounded-full px-7 font-bold">
                Have more questions? Reach out <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
