import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { BeforeAfterShowcase } from "@/src/components/Public/BeforeAfterShowcase";

export const metadata: Metadata = {
  title: "Before & After Gallery | BIO Cleaning",
  description: "Explore the dramatic before and after visual transformations delivered daily by BIO Cleaning technicians.",
};

const transformationHighlights = [
  {
    room: "Kitchen Restoration",
    focus: "Deep Degreasing & Appliance Polish",
    details: "Stovetops, range hoods, baked-on grime, and countertop sanitization returning original factory luster.",
  },
  {
    room: "Bathroom Revival",
    focus: "Limescale & Tile Grout Descaling",
    details: "Glass shower enclosure water stain removal, porcelain descaling, and high-touch surface disinfection.",
  },
  {
    room: "Living Areas & Floors",
    focus: "HEPA Vacuuming & Microfiber Mopping",
    details: "Deep particle extraction, baseboard hand-wiping, and streak-free floor detailing safe for pets.",
  },
  {
    room: "Move-Out Vacancy",
    focus: "Deposit-Guarantee Turnover",
    details: "Inside cabinets, drawers, closet resets, and wall spot-cleaning to meet landlord walkthrough standards.",
  },
];

export default async function Page() {
  const website = await getPublicWebsiteServer();

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Visual Transformations"
        title="See What a Thorough Finishing Pass Changes."
        description="Drag the comparison slider below to inspect our hospital-grade standard. Zero chemical residues, 100% spotless execution."
        actions={
          <>
            <Link className="btn-primary rounded-full px-8" href="/book">
              Book a Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="btn-ghost-light rounded-full px-7" href="/quote">
              Get Instant Quote
            </Link>
          </>
        }
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="container-page max-w-5xl">
          {/* Main Interactive Slider */}
          <div className="mb-16">
            <BeforeAfterShowcase />
            <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
              ◀ Drag the center divider left or right to compare before & after results ▶
            </p>
          </div>

          {/* 4 Transformation Highlight Cards */}
          <div className="mt-16">
            <div className="mb-10 text-center">
              <div className="editorial-kicker mx-auto mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Room-by-Room Standards</span>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
                What Our Technicians Focus On
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {transformationHighlights.map((item) => (
                <div
                  key={item.room}
                  className="rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-7 transition hover:border-brand-lime hover:bg-white hover:shadow-lg"
                >
                  <div className="inline-block rounded-full bg-brand-lime/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-dark mb-3">
                    {item.focus}
                  </div>
                  <h3 className="text-xl font-extrabold text-brand-dark">{item.room}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.details}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-green">
                    <CheckCircle2 className="h-4 w-4 text-brand-lime" />
                    <span>Included in standard checklist</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#0C3629] p-8 text-center text-white sm:p-12 shadow-xl">
            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Ready to give your home this exact transformation?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              Choose your service date and schedule online in under 60 seconds with live crew capacity.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="btn-primary rounded-full px-8">
                Schedule Service Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost-light rounded-full px-7">
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
