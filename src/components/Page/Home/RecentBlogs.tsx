"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

import blogImg1 from "@/src/assets/service-residential.jpeg";
import blogImg2 from "@/src/assets/why-choose.jpeg";
import blogImg3 from "@/src/assets/service-deep.jpeg";

export default function RecentBlogs({ section }: { section?: WebsiteHomepageSection }) {
  const posts = [
    {
      title: "10 Eco-Friendly Cleaning Secrets Every Homeowner Should Know",
      category: "Green Living",
      date: "March 15, 2026",
      slug: "eco-friendly-cleaning-secrets",
      image: blogImg1,
      excerpt: "Discover simple, non-toxic plant-based methods that remove tough stains without releasing harsh volatile chemicals into your indoor air.",
    },
    {
      title: "The Ultimate Move-Out Cleaning Checklist for Colorado Renters",
      category: "Moving Guides",
      date: "March 08, 2026",
      slug: "move-out-cleaning-checklist",
      image: blogImg2,
      excerpt: "Ensure 100% of your security deposit returns with our room-by-room guide covering forgotten spots landlords inspect first.",
    },
    {
      title: "Deep Cleaning vs. Regular Maintenance: What Does Your Home Need?",
      category: "Home Maintenance",
      date: "February 27, 2026",
      slug: "deep-cleaning-vs-regular-maintenance",
      image: blogImg3,
      excerpt: "Learn how to choose between routine upkeep and deep seasonal sanitization to optimize your budget and home comfort.",
    },
  ];

  return (
    <section className="bg-[#f7faf8] py-20 lg:py-28">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="editorial-kicker mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{section?.eyebrow || "Expert Cleaning Advice"}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl">
            {section?.title || "Recent Blog Posts"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {section?.subtitle ||
              "Practical home care guides, seasonal checklists, and green cleaning strategies from our certified technicians."}
          </p>
        </div>

        {/* 3-Column Blog Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-brand-green/12 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-lime hover:shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-dark/10">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-dark shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-brand-green" />
                    <span>{post.date}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold text-brand-dark transition-colors group-hover:text-[#22794A] leading-snug">
                    <Link href={`/resources/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="border-t border-brand-green/10 p-6 pt-4">
                <Link
                  href={`/resources/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-dark transition group-hover:text-brand-green"
                >
                  <span>Read Article</span>
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-brand-lime text-brand-dark">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Resources CTA */}
        <div className="mt-12 text-center">
          <Link href="/resources" className="btn-secondary rounded-full px-8 font-bold">
            Explore All Resources & Guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
