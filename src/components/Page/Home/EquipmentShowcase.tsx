"use client";

import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import fullService2 from "@/src/assets/full-services-2.jpeg";
import serviceCommercial from "@/src/assets/service-commercial.jpeg";
import serviceDeep from "@/src/assets/service-deep.jpeg";
import whyChoose from "@/src/assets/why-choose.jpeg";
import { AirVent, Droplets, Leaf, Sparkles, Waves } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

const equipment: Array<{
  index: string;
  title: string;
  copy: string;
  tag: string;
  icon: typeof AirVent;
  image: StaticImageData;
}> = [
  {
    index: "01",
    title: "HEPA 4-Stage Filtration",
    copy: "Commercial multi-stage filtration traps 99.97% of dust mites, pollen, and pet dander down to 0.3 microns without blowing allergens back into your indoor air.",
    tag: "Clean Air Defense",
    icon: AirVent,
    image: serviceCommercial,
  },
  {
    index: "02",
    title: "Color-Coded Microfiber",
    copy: "Strict visual separation: red for bathroom fixtures, blue for glass, green for kitchens, and yellow for living areas to completely eliminate cross-contamination.",
    tag: "Hygiene Control",
    icon: Waves,
    image: fullService2,
  },
  {
    index: "03",
    title: "Plant-Based Chemistry",
    copy: "Biodegradable, EPA-registered solutions tough on grease and soap scum yet safe for bare feet, children, and household pets immediately after wiping.",
    tag: "Non-Toxic & Pet-Safe",
    icon: Leaf,
    image: whyChoose,
  },
  {
    index: "04",
    title: "Precision Detailing Tools",
    copy: "High-temperature steam wands, grout rotary brushes, and crevice scrapers reaching the hidden dirt and calcification regular mops simply miss.",
    tag: "Deep Precision",
    icon: Droplets,
    image: serviceDeep,
  },
];

export default function EquipmentShowcase({ section }: { section?: WebsiteHomepageSection }) {
  return (
    <section data-horizontal-scene className="relative bg-[#f7faf8] py-20 lg:py-0">
      <div data-horizontal-pin className="lg:flex lg:min-h-[calc(100vh-84px)] lg:items-center lg:overflow-hidden">
        <div className="container-page w-full">
          {/* Header */}
          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-end mb-10">
            <div data-cinema-reveal>
              <div className="editorial-kicker mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{section?.eyebrow || "Equipment & Products"}</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
                {section?.title || "Professional Gear Matched to the Surface."}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {section?.subtitle ||
                  "We select commercial-grade tools for repeatability, cross-contamination prevention, and residue-free results."}
              </p>
            </div>
            <div className="hidden items-center justify-end gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-dark/50 lg:flex">
              <span>Scroll horizontally to explore tools</span>
              <span className="h-px w-20 bg-brand-green/30" />
            </div>
          </div>

          {/* Horizontal Track Viewport */}
          <div
            data-horizontal-viewport
            className="cinematic-horizontal-viewport overflow-x-auto pb-4 lg:overflow-hidden"
          >
            <div
              data-horizontal-track
              className="cinematic-horizontal-track flex w-max gap-6 pb-2 pr-[10vw]"
            >
              {equipment.map(({ index, title, copy, tag, icon: Icon, image }) => (
                <article
                  key={title}
                  className="group relative h-[480px] w-[82vw] max-w-[460px] shrink-0 overflow-hidden rounded-3xl border border-white/20 bg-[#0C3629] text-white shadow-2xl sm:w-[440px] lg:h-[540px] lg:w-[480px]"
                >
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 480px, 82vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629] via-[#0C3629]/50 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <div className="flex items-center justify-between border-b border-white/18 pb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-lime">
                      <span>{index}</span>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tag}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
                      {title}
                    </h3>

                    <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-white/75">
                      {copy}
                    </p>
                  </div>
                </article>
              ))}

              {/* Final Highlight Card */}
              <div className="grid h-[480px] w-[75vw] max-w-[400px] shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-[#bdf249] to-[#7be12b] p-8 text-center text-[#0C3629] shadow-2xl sm:w-[380px] lg:h-[540px] lg:w-[420px]">
                <div>
                  <div className="inline-block rounded-full bg-[#0C3629]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0C3629]">
                    The BIO Standard
                  </div>
                  <p className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
                    Better tools make the clean more consistent—not more complicated.
                  </p>
                  <p className="mt-4 text-xs sm:text-sm font-bold text-[#0C3629]/80">
                    Hospital-grade equipment arriving in every vehicle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
