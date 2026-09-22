import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Droplets, ShieldCheck, Sparkles, Wind } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import HowWeCleanStory from "@/src/components/Page/Home/HowWeCleanStory";
import HowItWorks from "@/src/components/Page/Home/HowItWorks";

export const metadata: Metadata = {
  title: "How We Clean | 50-Point Standard & Eco Protocol",
  description: "See BIO Cleaning's assessment, preparation, detail-cleaning, eco chemistry, and 50-point quality check process.",
};

const checklistZones = [
  {
    room: "Kitchens",
    badge: "Food Prep Sanitation",
    items: [
      "Stovetops, range hoods & control knobs degreased",
      "Exterior of all appliances polished (fridge, oven, dishwasher)",
      "Microwave cleaned inside and out",
      "Countertops sanitized with food-safe botanical cleaners",
      "Sinks scrubbed, limescale removed & chrome polished",
      "Cabinet fronts wiped and high-touch handles sanitized",
      "Backsplashes wiped down and grease splatters removed",
      "Floors vacuumed with HEPA filter and damp-mopped",
    ],
  },
  {
    room: "Bathrooms",
    badge: "Disinfection Focus",
    items: [
      "Toilets scrubbed, disinfected inside and around base",
      "Showers, glass doors and tile grout cleaned of soap scum",
      "Bathtubs scrubbed and sanitized thoroughly",
      "Vanity countertops, sinks and chrome fixtures polished",
      "Mirrors streak-free polished edge-to-edge",
      "Cabinet exteriors wiped and towel bars sanitized",
      "Trash emptied and bin wiped clean",
      "Floors sanitized and hand-wiped into corners",
    ],
  },
  {
    room: "Bedrooms & Living",
    badge: "Allergen Reduction",
    items: [
      "All horizontal surfaces, shelves and tables dusted",
      "Ceiling fans and light fixtures dusted (up to reachable height)",
      "Baseboards and door frames wiped clean",
      "Light switches, door knobs and high-touch zones disinfected",
      "Beds made with crisp corners (linens changed if left out)",
      "Upholstered furniture vacuumed with brush attachment",
      "HEPA vacuuming under reachable beds and furniture",
      "Hardwood and tile floors damp-mopped with pH-neutral solution",
    ],
  },
  {
    room: "Whole-Home Details",
    badge: "The BIO Standard",
    items: [
      "Color-coded microfiber prevents cross-contamination across zones",
      "Zero harsh ammonia, artificial perfumes or chlorine bleach",
      "HEPA 0.3-micron filtration capturing pollen, dust mites & pet dander",
      "Trash emptied from all rooms and relined",
      "Window sills and tracks wiped down",
      "Air circulation and post-clean freshness check",
      "Supervised team lead final walkthrough verification",
      "Satisfaction guarantee re-clean promise within 24 hours",
    ],
  },
];

export default async function Page() {
  const website = await getPublicWebsiteServer();

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Our Cleaning Standard"
        title="A repeatable process, not a rushed checklist."
        description="From the first room assessment to the final walkthrough, every clean follows an uncompromising operating standard engineered for health, safety, and pristine surfaces."
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8 py-3 font-extrabold text-sm shadow-md">
              Book Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 font-extrabold text-sm text-white hover:bg-white/20">
              Calculate Quote
            </Link>
          </>
        }
      />

      {/* Story Process */}
      <HowWeCleanStory />

      {/* 50-Point Room-by-Room Standards Grid */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <span className="editorial-kicker">Comprehensive Scope</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
              Our 50-Point Cleaning Standard
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Every room has dedicated critical control points. Here is what our technicians inspect, clean, and verify before handing the space back to you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {checklistZones.map((zone) => (
              <div
                key={zone.room}
                className="rounded-3xl border border-brand-green/12 bg-[#F7FAF8] p-6 sm:p-7 shadow-sm flex flex-col transition hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md"
              >
                <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-brand-green/20 bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
                  {zone.badge}
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-brand-dark">{zone.room}</h3>
                <ul className="mt-5 space-y-3 text-xs leading-relaxed text-foreground/80 flex-1">
                  {zone.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eco Equipment & Cross-Contamination Standard */}
      <section className="bg-[#F4FAF5] py-20 lg:py-28 border-y border-brand-green/10">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3 items-stretch">
            <div className="rounded-3xl border border-brand-green/15 bg-white p-8 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-brand-dark">Color-Coded Microfiber</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Red cloths never enter kitchens; blue cloths stay dedicated to glass and mirrors; green cloths handle living zones. Zero bacterial transfer between rooms.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-green/15 bg-white p-8 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                <Wind className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-brand-dark">Commercial HEPA Filtration</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Our vacuums trap 99.97% of particulates down to 0.3 microns, preventing allergen kick-back into your home’s breathing air.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-green/15 bg-white p-8 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-brand-dark">100% Plant-Based Cleaners</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Non-toxic, cruelty-free formulas powered by plant extracts, thymol, and citric acid. Safe for crawling infants, curious puppies, and sensitive lungs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works workflow */}
      <HowItWorks />

      {/* Guarantee Spruce Banner */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <div className="rounded-3xl bg-[#0C3629] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-lime/15 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
                <Sparkles className="h-3.5 w-3.5" /> 100% Satisfaction Guarantee
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Not thrilled with an area? We’ll re-clean it free.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
                If any room or surface fails to meet your expectations, let us know within 24 hours of service completion and we will dispatch a team member to make it right.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary rounded-full px-8 py-3 font-extrabold text-sm shadow-md">
                  Book Your Service Now
                </Link>
                <Link href="/faq" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 font-extrabold text-sm text-white hover:bg-white/20">
                  Read FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
