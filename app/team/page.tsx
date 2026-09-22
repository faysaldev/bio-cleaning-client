"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import {
  UsersRound,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";

export default function TeamPage() {
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const team = website?.content.team;
  const members =
    team?.members?.filter((m) => m.visible).sort((a, b) => a.order - b.order) ||
    [];

  return (
    <SiteLayout website={website}>
      {/* Spruce Hero Banner */}
      <PublicPageHero
        eyebrow={team?.eyebrow || "Our Cleaning Specialists"}
        title={team?.title || "The Dedicated Team Behind the Sparkle"}
        description={
          team?.intro ||
          "Every cleaner is background-checked, bonded, and certified in eco-friendly hospital-grade sanitization standards. Meet the people who treat your home like their own."
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-extrabold text-brand-dark shadow-md transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Join Our Crew
            </Link>
          </div>
        }
      />

      {/* Trust Standards Bar */}
      <section className="border-b border-brand-green/10 bg-[#F4FAF5] py-8">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  100% Vetted
                </h4>
                <p className="text-xs text-muted-foreground">Rigorous background checks</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  Certified Training
                </h4>
                <p className="text-xs text-muted-foreground">40+ hours eco-protocol</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  Insured & Bonded
                </h4>
                <p className="text-xs text-muted-foreground">Complete peace of mind</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  Eco-Certified
                </h4>
                <p className="text-xs text-muted-foreground">Plant-based non-toxic care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-page">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
              <UsersRound className="h-3.5 w-3.5" />
              Field Specialists & Leadership
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-brand-dark">
              Passionate About Cleaner Spaces
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet our trusted cleaning technicians and customer care professionals.
            </p>
          </div>

          {members.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Photo Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4FAF5]">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                        />
                      ) : (
                        <div className="grid h-full place-items-center bg-[#0C3629]/5 text-5xl font-black text-brand-green/40">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Member Info */}
                    <div className="p-6">
                      <span className="inline-flex items-center rounded-full bg-brand-lime/20 px-3 py-1 text-xs font-extrabold text-brand-green">
                        {member.role}
                      </span>
                      <h3 className="mt-3 text-xl font-extrabold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors">
                        {member.name}
                      </h3>
                      {member.bio ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {member.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-brand-green/5 flex items-center gap-1.5 text-xs font-bold text-brand-green">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>BIO Certified Cleaner</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-brand-green/20 bg-[#F4FAF5] p-12 text-center text-muted-foreground">
              Public team member profiles are being prepared.
            </div>
          )}
        </div>
      </section>

      {/* Careers Banner */}
      <section className="bg-[#0C3629] py-16 text-white border-t border-white/10">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
              We&apos;re Hiring
            </span>
            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-white">
              Want to join our certified green cleaning team?
            </h3>
            <p className="mt-1 text-sm md:text-base text-white/70">
              Competitive pay, eco-friendly supplies provided, flexible scheduling, and growth opportunities.
            </p>
          </div>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-8 py-4 text-sm font-extrabold text-brand-dark shadow-xl transition hover:bg-brand-lime/90 hover:scale-105 active:scale-95"
          >
            Apply for Careers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
