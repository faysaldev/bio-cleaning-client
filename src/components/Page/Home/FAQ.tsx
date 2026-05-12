"use client";

import { ArrowRight, MessageCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      q: "How do you price your cleaning services?",
      a: "We use transparent flat pricing based on home size, service type, and frequency. You'll get a quote in under 60 seconds — no surprises later.",
    },
    {
      q: "What products do you use? Are they pet-safe?",
      a: "All BIO products are plant-based, biodegradable, and 100% safe for kids and pets. We never use ammonia or harsh bleach unless requested.",
    },
    {
      q: "Are your cleaners insured and background-checked?",
      a: "Yes. Every BIO team member is background-checked, professionally trained, and we're fully insured for your peace of mind.",
    },
    {
      q: "What's included in a deep clean?",
      a: "Baseboards, inside appliances, vents, behind furniture, scale removal in bathrooms, detail dusting, and more — see our 50-point checklist on the Services page.",
    },
    {
      q: "Can I book recurring service?",
      a: "Absolutely. Weekly, bi-weekly, and monthly plans get a discount. You can pause or skip anytime from your dashboard.",
    },
    {
      q: "What if I'm not satisfied?",
      a: "We offer a 100% satisfaction guarantee. Tell us within 24 hours and we'll re-clean the space free of charge.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28">
            <span className="pill" data-reveal>
              — FAQ —
            </span>
            <h2
              className="mt-3 text-4xl md:text-5xl text-brand-dark font-display"
              data-reveal
            >
              Helpful questions about our services
            </h2>
            <p className="text-muted-foreground mt-4" data-reveal>
              Clear answers before you book, with human support whenever you
              need it.
            </p>
            <div
              className="mt-8 rounded-3xl bg-brand-dark text-white p-6"
              data-reveal
            >
              <MessageCircle className="w-9 h-9 text-brand-lime" />
              <h3 className="font-display text-2xl mt-4">Still deciding?</h3>
              <p className="text-white/65 text-sm mt-2">
                Send your ZIP code and room count. We&apos;ll recommend the best
                package.
              </p>
            </div>
          </div>
          <div>
            <div className="space-y-3" data-reveal-group>
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={f.q}
                    className={`rounded-2xl border transition ${isOpen ? "border-brand-green bg-brand-cream" : "border-border bg-white"}`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="font-semibold text-brand-dark">
                        {f.q}
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition ${isOpen ? "bg-brand-lime text-brand-dark" : "bg-brand-cream text-brand-green"}`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/contact"
                className="bg-brand-lime text-brand-dark font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:scale-[1.02] transition"
              >
                Ask a Question <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
