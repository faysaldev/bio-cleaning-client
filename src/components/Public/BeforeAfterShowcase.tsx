"use client";

import Image from "next/image";
import { useState } from "react";
import beforeImage from "@/src/assets/service-deep.jpeg";
import afterImage from "@/src/assets/home-interior.jpeg";
import { Sparkles } from "lucide-react";

export function BeforeAfterShowcase({ compact = false }: { compact?: boolean }) {
  const [position, setPosition] = useState(55);

  return (
    <div className={`relative overflow-hidden rounded-3xl border-4 border-white bg-[#0C3629] shadow-2xl ${compact ? "aspect-[16/10]" : "aspect-[16/9] sm:aspect-[21/9]"}`}>
      {/* Before Image (Background) */}
      <Image
        src={beforeImage}
        alt="Room before detailed Bio Cleaning service"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* After Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={afterImage}
          alt="Room after detailed Bio Cleaning service"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Vertical Divider Line with Floating Draggable Handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#0C3629] text-xs font-black text-white shadow-2xl ring-4 ring-brand-lime/40">
          <span className="text-brand-lime font-black tracking-widest text-[11px]">◀ ▶</span>
        </div>
      </div>

      {/* Badges */}
      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#0C3629]/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-lime shadow-lg backdrop-blur-md">
        <Sparkles className="inline h-3 w-3 mr-1" /> After BIO Clean
      </div>
      <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
        Before Service
      </div>

      {/* Interactive Range Input */}
      <input
        aria-label="Drag slider to compare before and after cleaning"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 z-20"
        type="range"
        min="5"
        max="95"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
      />
    </div>
  );
}
