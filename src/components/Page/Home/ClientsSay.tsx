"use client";

import { useEffect, useState } from "react";
import fullService2 from "@/src/assets/full-services-2.jpeg";

import { TESTIMONIALS } from "@/src/utils/data";
import { ChevronLeft, ChevronRight, Play, Star, X } from "lucide-react";
import Image from "next/image";

export default function ClientsSay() {
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const t = TESTIMONIALS[idx];

  useEffect(() => {
    if (modal || paused) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      6000,
    );
    return () => clearInterval(id);
  }, [modal, paused]);

  const go = (dir: number) =>
    setIdx((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="container-page text-center">
        <span className="pill bg-brand-lime text-brand-dark" data-reveal>
          — Testimonials —
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl font-display" data-reveal>
          Real reactions after the final walkthrough
        </h2>
        <p className="mt-3 text-white/65 max-w-xl mx-auto" data-reveal>
          Video stories from clients who needed their homes, offices, and moving
          days brought back in order.
        </p>

        <div
          className="relative mt-14 max-w-3xl mx-auto"
          data-reveal
          role="region"
          aria-roledescription="carousel"
          aria-label="Client video testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="absolute -inset-4 bg-brand-lime/25 rounded-3xl shadow-xl rotate-2" />
          <div className="absolute -inset-4 bg-white/10 rounded-3xl shadow-xl -rotate-1" />
          <div
            key={idx}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fade-in_.6s_ease-out]"
            aria-live="polite"
          >
            <div className="relative aspect-video bg-gradient-to-br from-brand-dark to-brand-green grid place-items-center">
              <Image
                src={fullService2}
                alt="Client testimonial"
                sizes="(min-width: 768px) 768px, 100vw"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setModal(true)}
                aria-label="Play testimonial video"
                className="relative z-10 w-20 h-20 rounded-full bg-brand-lime grid place-items-center hover:scale-110 transition shadow-2xl group"
              >
                <span className="absolute inset-0 rounded-full bg-brand-lime animate-ping opacity-40" />
                <Play className="relative w-8 h-8 text-brand-dark fill-brand-dark ml-1" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-lg text-foreground/80 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-mint to-brand-green" />
                <div className="text-left">
                  <div className="font-semibold text-brand-dark">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                  <div className="flex gap-0.5 text-brand-yellow mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:bg-brand-lime transition z-20"
          >
            <ChevronLeft className="w-5 h-5 text-brand-dark" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:bg-brand-lime transition z-20"
          >
            <ChevronRight className="w-5 h-5 text-brand-dark" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === idx}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-8 bg-brand-lime" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 text-xs text-white/45">
            {paused ? "Paused" : "Auto-playing every 6 seconds"}
          </div>
        </div>

        <div
          className="mt-14 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
          data-reveal-group
        >
          {["Trusted by families", "Loved by office teams", "Ready for move-outs"].map(
            (label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold"
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm grid place-items-center p-4 animate-[fade-in_.25s_ease-out]"
          onClick={() => setModal(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-[scale-in_.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(false)}
              aria-label="Close"
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={t.video}
              title={`${t.name} testimonial`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
