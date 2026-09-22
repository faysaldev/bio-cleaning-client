"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

import carpetImg from "@/src/assets/full-services.jpeg";
import bedroomImg from "@/src/assets/home-interior.jpeg";
import ovenImg from "@/src/assets/service-deep.jpeg";
import windowImg from "@/src/assets/full-services-2.jpeg";
import moveOutImg from "@/src/assets/why-choose.jpeg";
import sofaImg from "@/src/assets/service-residential.jpeg";

export default function ProjectsGallery({ section }: { section?: WebsiteHomepageSection }) {
  const projects = [
    {
      title: "Carpet Cleaning",
      category: "Steam Extraction",
      image: carpetImg,
      desc: "Deep fiber shampooing and allergen removal restoring plush softness.",
    },
    {
      title: "Bedroom Cleaning",
      category: "Hotel-Grade Reset",
      image: bedroomImg,
      desc: "Fresh linen change, under-bed vacuuming, and complete dust elimination.",
    },
    {
      title: "Oven & Appliance Detail",
      category: "Degreasing & Polish",
      image: ovenImg,
      desc: "Burnt carbon removal and non-toxic interior bake element detailing.",
    },
    {
      title: "Window & Glass Detailing",
      category: "Streak-Free Clarity",
      image: windowImg,
      desc: "Interior pane wiping, sill sanitization, and track grime removal.",
    },
    {
      title: "Move In / Move Out Reset",
      category: "Full Vacancy Turnover",
      image: moveOutImg,
      desc: "Wall spot cleaning, interior cabinets, baseboards, and deposit protection.",
    },
    {
      title: "Upholstery & Sofa Care",
      category: "Fabric Sanitization",
      image: sofaImg,
      desc: "Low-moisture foam cleaning safe for delicate velvet, linen, and leather.",
    },
  ];

  return (
    <section className="bg-[#f7faf8] py-20 lg:py-28">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="editorial-kicker mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{section?.eyebrow || "Proven Results"}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
            {section?.title || "Our Projects"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {section?.subtitle ||
              "Take a look at the sparkling results our certified technicians deliver daily across homes and apartments."}
          </p>
        </div>

        {/* 6-Photo Grid (3 columns x 2 rows) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-brand-green/12 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-lime hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-dark/10">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629]/80 via-[#0C3629]/15 to-transparent" />

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-dark shadow-sm backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-extrabold text-brand-dark transition-colors group-hover:text-[#22794A]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-brand-green/10 pt-3 text-xs font-bold text-brand-dark">
                  <span>BIO Certified Protocol</span>
                  <span className="inline-flex items-center gap-1 text-brand-green group-hover:underline">
                    View scope <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/before-after"
            className="btn-secondary rounded-full px-8 font-bold"
          >
            Explore Before & After Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
