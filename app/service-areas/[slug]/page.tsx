import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, CalendarCheck2, Sparkles, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { publicSlug } from "@/src/lib/publicSlug";

const areaBenefits = [
  { icon: MapPin, title: "Local coverage", copy: "Public coverage is managed centrally so customers see only active service areas." },
  { icon: CalendarCheck2, title: "Live scheduling", copy: "Available dates and times still come from real staff capacity, business hours and blocked slots." },
  { icon: Sparkles, title: "One quality standard", copy: "Every supported area uses the same service scopes, operational checklists and completion workflow." },
];

async function findArea(slug: string) {
  const website = await getPublicWebsiteServer();
  const area = website?.content.serviceAreas.find((item) => item.visible && (item.id === slug || publicSlug(item.name) === slug));
  return { website, area };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { area } = await findArea(slug);
  return area
    ? { title: `Cleaning Services in ${area.name}`, description: area.description || `Professional residential and commercial cleaning in ${area.name}.` }
    : { title: "Service Area" };
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { website, area } = await findArea(slug);

  if (!area) {
    return (
      <SiteLayout website={website || undefined}>
        <div className="container-page py-28 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
            <MapPin className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark">Service area not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn't find active coverage information for this area code.</p>
          <Link href="/service-areas" className="btn-primary inline-flex rounded-full px-8 py-3 text-xs font-extrabold mt-6">
            View all service areas
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const popularServices = [
    { title: "Standard Residential Cleaning", desc: "Weekly, bi-weekly or monthly maintenance to keep your home pristine." },
    { title: "Deep Reset Cleaning", desc: "Detailed edge-to-edge scrubbing for neglected build-up and seasonal resets." },
    { title: "Move-In / Move-Out Service", desc: "Deposit-ready top-to-bottom clean with appliance and cabinet detailing." },
    { title: "Commercial & Office Care", desc: "After-hours sanitization and restroom replenishment for local businesses." },
  ];

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow={`Local Service Area • ${area.name}`}
        title={`Professional cleaning services in ${area.name}.`}
        description={
          area.description ||
          `BIO Cleaning serves supported homes and workplaces across ${area.name} with certified plant-based products, HEPA filtration, and background-checked technicians.`
        }
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-sm font-extrabold shadow-md">
              Check Live Availability <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-sm font-extrabold text-white hover:bg-white/20">
              Request a Quote
            </Link>
          </>
        }
      />

      {/* Local Standard Pillars */}
      <section className="bg-[#F7FAF8] py-20 lg:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="editorial-kicker">Local Standards</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
              The BIO Standard in {area.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every appointment in {area.name} is handled by vetted, direct employees carrying full insurance and eco-certified supplies.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {areaBenefits.map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-3xl border border-brand-green/12 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-brand-dark">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Available Services in Area */}
      <section className="bg-white py-20 lg:py-28 border-y border-brand-green/10">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
            <div>
              <span className="editorial-kicker">Local Offerings</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-dark">
                Popular cleaning plans in {area.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Whether you live in a multi-story home or manage a busy downtown retail office, our crew routes are optimized for prompt arrival and thorough work.
              </p>
              <div className="mt-8">
                <Link href="/services" className="btn-secondary rounded-full px-6 py-2.5 text-xs font-bold">
                  View All Services Menu
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {popularServices.map((srv, idx) => (
                <div key={idx} className="rounded-3xl border border-brand-green/12 bg-[#F7FAF8] p-6 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-green mb-3">
                    Available in {area.name}
                  </div>
                  <h4 className="text-lg font-extrabold text-brand-dark">{srv.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Area Satisfaction Guarantee Banner */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page max-w-4xl">
          <div className="rounded-3xl bg-[#0C3629] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl text-center">
            <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
                <Sparkles className="h-3.5 w-3.5" /> 100% Satisfaction Guarantee
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Ready for a spotless home in {area.name}?
              </h2>
              <p className="mt-3 text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
                Book online in 60 seconds with live availability. If anything isn’t 100% to your liking, we re-clean within 24 hours free of charge.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-xs font-extrabold shadow-md">
                  Book {area.name} Cleaning
                </Link>
                <Link href="/contact" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-xs font-extrabold text-white hover:bg-white/20">
                  Talk to Dispatch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
