"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [paused, setPaused] = useState(false);
  const r = reviews[idx];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIdx((current) => (current + 1) % reviews.length),
      5200,
    );
    return () => clearInterval(id);
  }, [paused, reviews.length]);

  const go = (dir: number) =>
    setIdx((current) => (current + dir + reviews.length) % reviews.length);

  return (
    <section className="py-24">
      <div className="container-page">
        <div
          className="rounded-[2.5rem] bg-brand-lime p-10 md:p-16 text-center text-brand-dark relative overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Satisfied client reviews"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="absolute inset-0 leaf-bg opacity-20" />
          <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-white/25 blur-3xl" />
          <div className="relative">
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

            <div
              key={idx}
              className="mt-8 max-w-3xl mx-auto rounded-3xl bg-white/35 border border-white/40 p-7 md:p-9 shadow-xl animate-[fade-in_.45s_ease-out]"
              aria-live="polite"
            >
              <div className="flex justify-center gap-0.5 text-brand-dark mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-brand-dark/85 text-lg md:text-xl leading-relaxed">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="mt-6 font-bold text-brand-dark">— {r.name}</div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="w-11 h-11 rounded-full bg-brand-dark text-brand-lime grid place-items-center hover:scale-110 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {reviews.map((review, i) => (
                  <button
                    key={review.name}
                    onClick={() => setIdx(i)}
                    aria-label={`Show review from ${review.name}`}
                    aria-current={i === idx}
                    className={`h-2.5 rounded-full transition-all ${
                      i === idx ? "w-9 bg-brand-dark" : "w-2.5 bg-brand-dark/25"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                aria-label="Next review"
                className="w-11 h-11 rounded-full bg-brand-dark text-brand-lime grid place-items-center hover:scale-110 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 text-xs text-brand-dark/50">
              {paused ? "Paused" : "Auto-playing every 5 seconds"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
