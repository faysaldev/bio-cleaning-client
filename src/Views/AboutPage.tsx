"use client";

import { Award, CheckCircle2, HeartHandshake, Leaf, ShieldCheck, Sparkles, ArrowRight, Phone } from "lucide-react";
import residential from "@/src/assets/service-residential.jpeg";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import Image from "next/image";
import Link from "next/link";

const icons = [Leaf, ShieldCheck, HeartHandshake, Award];

export default function AboutPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const content = website?.content;
  const about = content?.about;
  const team = content?.team.members?.filter((member) => member.visible).sort((a, b) => a.order - b.order) || [];
  const media = about?.mediaUrl || residential;
  const phone = content?.contact?.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;

  return (
    <SiteLayout website={website}>
      <div ref={ref} className="bg-white">
        {/* Spruce Hero */}
        <section className="relative overflow-hidden bg-[#0C3629] py-20 text-white md:py-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
          <div className="pointer-events-none absolute right-10 top-20 h-64 w-64 rounded-full bg-brand-lime/10 blur-[80px]" />

          <div className="container-page relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md" data-reveal>
              <Leaf className="h-3.5 w-3.5" />
              <span>{about?.eyebrow || "About BIO Cleaning"}</span>
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.08]" data-reveal>
              {about?.title || "We Are BIO Cleaning"}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg" data-reveal>
              {about?.intro || "Back In Order — restoring your space, protecting your health, and giving you peace of mind."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4" data-reveal>
              <Link href="/book" className="btn-primary rounded-full px-8">
                Book a Cleaning <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={phoneHref} className="btn-ghost-light rounded-full px-7">
                <Phone className="h-4 w-4 text-brand-lime" /> Call {phone}
              </a>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 lg:py-28">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative" data-reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                <Image
                  src={media}
                  alt="BIO Cleaning team in Colorado"
                  fill
                  unoptimized={typeof media === "string" && media.startsWith("http")}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block rounded-2xl bg-[#0C3629] p-5 text-white shadow-xl">
                <div className="text-2xl font-black text-brand-lime">100%</div>
                <div className="text-xs font-bold text-white/70">Eco-Friendly & Non-Toxic</div>
              </div>
            </div>

            <div>
              <div className="editorial-kicker mb-3" data-reveal>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Our Heritage</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl" data-reveal>
                {about?.storyTitle || "A Simple Belief: Every Space Deserves to Be Spotless"}
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base" data-reveal>
                {(about?.storyParagraphs?.length
                  ? about.storyParagraphs
                  : [
                      "BIO Cleaning was built to elevate residential and commercial cleaning into a reliable, hospitable, and eco-conscious science.",
                      "We train our certified technicians on specific room-by-room workflows, use only non-toxic plant-based chemistry, and verify every corner before handing the space back to you.",
                    ]
                ).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4" data-reveal>
                <div className="flex items-center gap-2 rounded-xl bg-[#f7faf8] px-4 py-2 text-xs font-bold text-brand-dark border border-brand-green/10">
                  <CheckCircle2 className="h-4 w-4 text-brand-green" /> 50-Point Standard Checklist
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#f7faf8] px-4 py-2 text-xs font-bold text-brand-dark border border-brand-green/10">
                  <CheckCircle2 className="h-4 w-4 text-brand-green" /> Bonded & Insured Staff
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-[#f7faf8] py-20 lg:py-28">
          <div className="container-page text-center">
            <div className="editorial-kicker mx-auto mb-3" data-reveal>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Purpose & Direction</span>
            </div>

            <h2 className="mb-14 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl" data-reveal>
              What Drives Us Forward
            </h2>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2" data-reveal-group>
              <div className="rounded-3xl border border-brand-green/15 bg-white p-8 text-left shadow-md transition hover:border-brand-lime hover:shadow-xl">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-lime/40 text-brand-dark font-black">
                  <Leaf className="h-7 w-7 text-[#0C3629]" />
                </div>
                <h3 className="text-2xl font-extrabold text-brand-dark">Our Mission</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {about?.mission ||
                    "To make professional cleaning easier to book, easier to trust, and consistently superior, using supplies that protect people, pets, and the Colorado environment."}
                </p>
              </div>

              <div className="rounded-3xl border border-brand-green/15 bg-[#0C3629] p-8 text-left text-white shadow-xl">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-lime text-brand-dark font-black">
                  <Award className="h-7 w-7 text-brand-dark" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Our Vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {about?.vision ||
                    "To be the gold standard in modern cleaning hospitality—delivering calmer households and spotless commercial spaces through continuous training and transparent service."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 lg:py-28">
          <div className="container-page text-center">
            <div className="editorial-kicker mx-auto mb-3" data-reveal>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Core Values</span>
            </div>

            <h2 className="mb-14 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl md:text-5xl" data-reveal>
              The Standards We Live By
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
              {(about?.values || [
                { id: "1", title: "Eco-First Mindset", description: "Zero hazardous fumes, plant-derived formulas, and microfiber reusability." },
                { id: "2", title: "Punctual & Dependable", description: "Guaranteed arrival windows with real-time route updates for every booking." },
                { id: "3", title: "Hospital-Grade Hygiene", description: "Color-coded microfibers preventing cross-contamination between rooms." },
                { id: "4", title: "Satisfaction Guaranteed", description: "24-hour complimentary re-clean if any room falls short of expectations." },
              ]).map((val, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={val.id}
                    className="flex flex-col justify-between rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-6 text-left transition hover:border-brand-lime hover:bg-white hover:shadow-lg"
                  >
                    <div>
                      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime/40 text-brand-dark">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-extrabold text-brand-dark">{val.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{val.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Showcase */}
        <section className="bg-[#0C3629] py-20 text-white lg:py-28">
          <div className="container-page">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="editorial-kicker border-brand-lime/30 bg-brand-lime text-brand-dark" data-reveal>
                  {content?.team.eyebrow || "Our Professionals"}
                </div>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl" data-reveal>
                  {content?.team.title || "The People Behind the Sparkle"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  {content?.team.intro || "Meet our vetted, background-checked, and insured cleaning professionals."}
                </p>
              </div>
              <Link href="/team" className="btn-primary rounded-full px-7 text-xs font-black">
                Meet the Full Team <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {team.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
                {team.slice(0, 4).map((member) => (
                  <article
                    key={member.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-brand-lime/40 hover:bg-white/10"
                  >
                    <div className="relative aspect-[4/3] bg-white/5">
                      {member.imageUrl ? (
                        <Image src={member.imageUrl} alt={member.name} fill unoptimized className="object-cover" />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-white">{member.name}</h3>
                      <div className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-lime">
                        {member.role}
                      </div>
                      <p className="mt-2 text-xs text-white/65 leading-relaxed">{member.bio}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                Team profiles are dynamically populated from your Admin Website settings.
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
