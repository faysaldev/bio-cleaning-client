"use client";
import Image from "next/image";
import { useState } from "react";
import beforeImage from "@/src/assets/service-deep.jpeg";
import afterImage from "@/src/assets/home-interior.jpeg";

export function BeforeAfterShowcase({ compact = false }: { compact?: boolean }) {
  const [position, setPosition] = useState(58);
  return <div className={`relative overflow-hidden rounded-2xl border border-border bg-brand-dark shadow-elevated ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
    <Image src={beforeImage} alt="Room before detailed cleaning" fill className="object-cover" sizes="100vw" />
    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }}><Image src={afterImage} alt="Room after detailed cleaning" fill className="object-cover" sizes="100vw" /></div>
    <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }}><span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-brand-dark text-xs font-extrabold text-white">↔</span></div>
    <div className="absolute left-4 top-4 rounded-lg bg-brand-dark/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.12em] text-white">After</div><div className="absolute right-4 top-4 rounded-lg bg-brand-dark/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.12em] text-white">Before</div>
    <input aria-label="Compare before and after cleaning" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" type="range" min="8" max="92" value={position} onChange={(e)=>setPosition(Number(e.target.value))}/>
  </div>;
}
