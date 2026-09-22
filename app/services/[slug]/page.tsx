import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Clock3,
  ShieldCheck,
  Sparkles,
  UsersRound,
  ArrowRight,
  Leaf,
  CalendarCheck,
  Award,
  ChevronRight,
} from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

async function getService(identifier: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return null;
  try {
    const response = await fetch(
      `${base.replace(/\/$/, "")}/services/${encodeURIComponent(identifier)}`,
      { next: { revalidate: 120 } } satisfies NextFetchInit
    );
    if (!response.ok) return null;
    return (await response.json())?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  return service
    ? {
        title: service.name,
        description: service.description,
        openGraph: {
          title: `${service.name} | BIO Cleaning`,
          description: service.description,
          images: service.image ? [service.image] : [],
        },
      }
    : { title: "Cleaning Service | BIO Cleaning" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, website] = await Promise.all([
    getService(slug),
    getPublicWebsiteServer(),
  ]);

  if (!service) {
    return (
      <SiteLayout website={website || undefined}>
        <div className="container-page py-32 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green mb-6">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark">
            Service Not Found
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            The cleaning service you are looking for is either unavailable or has been relocated.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-green/90"
          >
            Browse All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const prep = service.scheduling?.preparationInstructions || [];

  return (
    <SiteLayout website={website || undefined}>
      {/* Spruce Hero Banner */}
      <section className="relative overflow-hidden bg-[#0C3629] py-20 text-white md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-16 h-60 w-60 rounded-full bg-brand-lime/10 blur-[80px]" />

        <div className="container-page relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
            <Link href="/" className="hover:text-brand-lime transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-brand-lime transition-colors">
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-brand-lime truncate max-w-xs">{service.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Professional Cleaning Plan</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.08] text-white">
                {service.name}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {service.description}
              </p>

              {/* Service Badges */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <Clock3 className="h-4 w-4 text-brand-lime" />
                  {service.duration || `${service.scheduling?.durationMinutes || 180} min`}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <UsersRound className="h-4 w-4 text-brand-lime" />
                  {service.scheduling?.requiredStaff || 1}+ Dedicated Cleaners
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-brand-lime" />
                  Quality Checked & Insured
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <Leaf className="h-4 w-4 text-brand-lime" />
                  100% Eco-Safe
                </span>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href={`/book?serviceId=${encodeURIComponent(service._id)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-8 py-4 text-base font-extrabold text-brand-dark shadow-xl transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book from ${service.basePrice}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Request Custom Quote
                </Link>
              </div>
            </div>

            {/* Showcase Image Card */}
            <div className="relative min-h-[380px] lg:min-h-[460px] overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width:1024px) 45vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Floating Base Price Pill */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/20 bg-brand-dark/70 p-4 backdrop-blur-md text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    Standard Starting Rate
                  </p>
                  <p className="text-2xl font-black text-brand-lime">
                    ${service.basePrice}
                  </p>
                </div>
                <Link
                  href={`/book?serviceId=${encodeURIComponent(service._id)}`}
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-brand-dark transition hover:bg-brand-lime"
                >
                  Select Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-[#F4FAF5] py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          {/* What's Included */}
          <div className="rounded-3xl border border-brand-green/10 bg-white p-8 md:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
              Defined Checklist
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-dark">
              What&apos;s Included
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A comprehensive scope carried out with surgical precision and eco-certified materials.
            </p>

            <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
              {(service.includes || []).map((item: string) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-brand-green/10 bg-[#F4FAF5]/70 p-3.5 text-sm font-semibold text-brand-dark"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-lime text-brand-dark">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Before We Arrive / Preparation */}
          <div className="rounded-3xl border border-brand-green/10 bg-white p-8 md:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
                Preparation Guidelines
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-dark">
                Before We Arrive
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Easy handoff steps to maximize cleaning efficiency and space transformation.
              </p>

              <div className="mt-8 space-y-3.5">
                {prep.length > 0 ? (
                  prep.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-[#F4FAF5]/50 p-4"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <p className="text-sm font-medium leading-relaxed text-foreground/80">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 rounded-2xl border border-border bg-[#F4FAF5]/50 p-4">
                      <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <p className="text-sm font-medium leading-relaxed text-foreground/80">
                        Secure any sensitive belongings or documents prior to crew arrival.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-border bg-[#F4FAF5]/50 p-4">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <p className="text-sm font-medium leading-relaxed text-foreground/80">
                        Ensure easy access to electricity and water supplies for specialized equipment.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-border bg-[#F4FAF5]/50 p-4">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <p className="text-sm font-medium leading-relaxed text-foreground/80">
                        Mention any pets, special surfaces, or access instructions during checkout.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Standard Callout */}
            <div className="mt-8 rounded-2xl bg-brand-dark p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    100% Satisfaction Guarantee
                  </h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    If any spot isn&apos;t spotless, we return within 24 hours to re-clean for free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="bg-[#0C3629] py-16 text-white border-t border-white/10">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
              Instant Scheduling
            </span>
            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-white">
              Ready to book {service.name}?
            </h3>
            <p className="mt-1 text-sm md:text-base text-white/70">
              Pick your date, add any extra services, and receive instant confirmation.
            </p>
          </div>
          <Link
            href={`/book?serviceId=${encodeURIComponent(service._id)}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-8 py-4 text-sm font-extrabold text-brand-dark shadow-xl transition hover:bg-brand-lime/90 hover:scale-105 active:scale-95"
          >
            Schedule Now from ${service.basePrice}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
