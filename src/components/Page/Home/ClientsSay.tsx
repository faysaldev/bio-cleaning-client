"use client";

import { useEffect, useMemo, useState } from "react";
import { useInViewport } from "@/src/hooks/useInViewport";
import fullService2 from "@/src/assets/full-services-2.jpeg";
import type { WebsiteHomepageSection, WebsiteTestimonial } from "@/src/redux/features/website/types";
import { ChevronLeft, ChevronRight, Play, Star, X } from "lucide-react";
import Image from "next/image";

const fallback: WebsiteTestimonial[] = [
  { id: "sarah", name: "Sarah Mitchell", role: "Homeowner", quote: "After BIO's first deep clean, our home felt brand new. Detail-obsessed and easy to work with.", rating: 5, imageUrl: "", videoUrl: "", visible: true, order: 10 },
  { id: "marcus", name: "Marcus Lee", role: "Office Manager", quote: "Reliable team, clear communication, and a consistently spotless office.", rating: 5, imageUrl: "", videoUrl: "", visible: true, order: 20 },
  { id: "priya", name: "Priya Shah", role: "Move-In Client", quote: "They handled the full move-in reset and made the apartment feel ready from day one.", rating: 5, imageUrl: "", videoUrl: "", visible: true, order: 30 },
];

export default function ClientsSay({ testimonials, section }: { testimonials?: WebsiteTestimonial[]; section?: WebsiteHomepageSection }) {
  const items = useMemo(() => {
    const selected = testimonials?.filter((item) => item.visible).sort((a, b) => a.order - b.order) || [];
    return selected.length ? selected : fallback;
  }, [testimonials]);
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const { ref: viewportRef, isInViewport } = useInViewport<HTMLElement>();
  useEffect(() => { if (idx >= items.length) setIdx(0); }, [items.length, idx]);
  const t = items[idx] || items[0];

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (modal || paused || !isInViewport || items.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [modal, paused, isInViewport, items.length]);

  if (!t) return null;
  const go = (dir: number) => setIdx((i) => (i + dir + items.length) % items.length);
  const videoUrl = t.videoUrl?.trim();
  const imageUrl = t.imageUrl?.trim();

  return (
    <section ref={viewportRef} className="overflow-hidden bg-brand-dark py-24 text-white">
      <div className="container-page text-center">
        <span className="pill bg-brand-lime text-brand-dark" data-reveal>— {section?.eyebrow || "Testimonials"} —</span>
        <h2 className="mt-3 text-4xl font-display md:text-5xl" data-reveal>{section?.title || "Real reactions after the final walkthrough"}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/65" data-reveal>{section?.subtitle || "Stories from clients who trusted BIO Cleaning with homes, offices, and moving days."}</p>

        <div className="relative mx-auto mt-14 max-w-3xl" data-reveal role="region" aria-roledescription="carousel" aria-label="Client testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="absolute -inset-4 rotate-2 rounded-2xl bg-brand-lime/25 shadow-xl" />
          <div className="absolute -inset-4 -rotate-1 rounded-2xl bg-white/10 shadow-xl" />
          <div key={t.id} className="relative overflow-hidden rounded-2xl bg-white shadow-2xl animate-[fade-in_.6s_ease-out]" aria-live="polite">
            <div className="relative grid aspect-video place-items-center bg-gradient-to-br from-brand-dark to-brand-green">
              <Image src={imageUrl || fullService2} alt={`${t.name} testimonial`} fill unoptimized={Boolean(imageUrl?.startsWith("http"))} sizes="(min-width: 768px) 768px, 100vw" className="object-cover opacity-60" />
              {videoUrl ? <button onClick={() => setModal(true)} aria-label="Play testimonial video" className="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-brand-lime shadow-2xl transition hover:scale-110"><span className="absolute inset-0 animate-ping rounded-full bg-brand-lime opacity-40" /><Play className="relative ml-1 h-8 w-8 fill-brand-dark text-brand-dark" /></button> : null}
            </div>
            <div className="p-8">
              <p className="text-lg italic text-foreground/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-mint to-brand-green font-extrabold text-white">{t.name.charAt(0)}</div>
                <div className="text-left"><div className="font-semibold text-brand-dark">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div><div className="mt-0.5 flex gap-0.5 text-brand-yellow">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div></div>
              </div>
            </div>
          </div>
          {items.length > 1 ? <><button onClick={() => go(-1)} aria-label="Previous testimonial" className="absolute -left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg transition hover:bg-brand-lime md:-left-12"><ChevronLeft className="h-5 w-5 text-brand-dark" /></button><button onClick={() => go(1)} aria-label="Next testimonial" className="absolute -right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg transition hover:bg-brand-lime md:-right-12"><ChevronRight className="h-5 w-5 text-brand-dark" /></button></> : null}
          <div className="mt-6 flex justify-center gap-2">{items.map((item, i) => <button key={item.id} onClick={() => setIdx(i)} aria-label={`Show testimonial ${i + 1}`} aria-current={i === idx} className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-brand-lime" : "w-2 bg-white/30"}`} />)}</div>
        </div>
      </div>
      {modal && videoUrl ? <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setModal(false)}><div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}><button onClick={() => setModal(false)} aria-label="Close" className="absolute right-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white"><X className="h-5 w-5" /></button><iframe src={videoUrl} title={`${t.name} testimonial`} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></div> : null}
    </section>
  );
}
