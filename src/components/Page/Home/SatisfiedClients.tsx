"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

export default function SatisfiedClients() {
  const reviews = [
    {
      name: "Donald W.",
      quote:
        "We had the pleasure of working with the BIO team to deep clean our brownstone — couldn't be happier. Thank you for going above and beyond.",
    },
    {
      name: "Maya P.",
      quote:
        "Reliable, fast, and friendly. Our office never looked better and the team is now a regular fixture.",
    },
    {
      name: "Ben K.",
      quote:
        "Move-out clean got us our full deposit. Best money we spent during the move.",
    },
  ];
  const [idx, setIdx] = useState(0);
  const r = reviews[idx];
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="rounded-[2.5rem] bg-brand-lime p-10 md:p-16 text-center text-brand-dark relative overflow-hidden">
          <span className="pill bg-brand-dark text-brand-lime" data-reveal>
            ★ Our Satisfied Clients
          </span>
          <h2
            className="mt-4 text-3xl md:text-4xl font-display max-w-3xl mx-auto"
            data-reveal
          >
            Thousands of homes & businesses trust BIO Cleaning to bring order
            back.
          </h2>
          <p
            className="mt-6 text-brand-dark/80 max-w-2xl mx-auto text-lg"
            data-reveal
          >
            "{r.quote}"
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() =>
                setIdx((idx + reviews.length - 1) % reviews.length)
              }
              className="w-10 h-10 rounded-full bg-brand-dark text-brand-lime grid place-items-center hover:scale-110 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex -space-x-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full border-4 border-brand-lime ${i === idx % 5 ? "scale-110 z-10" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, oklch(0.7 0.1 ${100 + i * 40}), oklch(0.5 0.15 ${120 + i * 40}))`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx((idx + 1) % reviews.length)}
              className="w-10 h-10 rounded-full bg-brand-dark text-brand-lime grid place-items-center hover:scale-110 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-5 font-bold text-brand-dark">— {r.name}</div>
          <div className="mt-2 flex justify-center gap-0.5 text-brand-dark">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
