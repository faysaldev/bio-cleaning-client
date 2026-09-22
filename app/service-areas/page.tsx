import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import ServiceNetwork from "@/src/components/Page/Home/ServiceNetwork";
import { publicSlug } from "@/src/lib/publicSlug";

export const metadata: Metadata = {
  title: "Service Areas & Coverage Network | BIO Cleaning",
  description: "Explore the communities and neighborhoods served by BIO Cleaning across the Denver metro area, Aurora, Lakewood, and beyond.",
};

export default async function Page() {
  const website = await getPublicWebsiteServer();
  const areas = (website?.content.serviceAreas || []).filter((a) => a.visible).sort((a, b) => a.order - b.order);

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Coverage Network"
        title="Local cleaning teams, one operating standard."
        description={
          website?.content.contact.serviceAreaSummary ||
          "Explore the communities where our background-checked technicians deliver professional residential and commercial cleaning."
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

      {/* Interactive Coverage Cards Grid */}
      <section className="bg-[#F7FAF8] py-20 lg:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="editorial-kicker">Regional Hubs</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
              Active Coverage Communities
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Select your city or neighborhood to view local service schedules, available booking windows, and verified customer reviews.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const slug = publicSlug(area.name);
              return (
                <Link
                  key={area.id}
                  href={`/service-areas/${slug}`}
                  className="group rounded-3xl border border-brand-green/12 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0C3629]">
                        <CheckCircle2 className="h-3 w-3" /> Active Daily Route
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-brand-dark group-hover:text-brand-green transition-colors">
                      {area.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {area.description || `Professional home, deep clean, and office cleaning services throughout ${area.name}.`}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-brand-green/8 flex items-center justify-between text-xs font-bold text-brand-green group-hover:text-brand-dark transition-colors">
                    <span>View area details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Map & Route Section */}
      <ServiceNetwork areas={website?.content.serviceAreas} contact={website?.content.contact} />

      {/* Outside our current area callout */}
      <section className="bg-white py-16 lg:py-24 border-t border-brand-green/10">
        <div className="container-page max-w-4xl">
          <div className="rounded-3xl bg-[#0C3629] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl text-center">
            <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
                <Sparkles className="h-3.5 w-3.5" /> Don’t see your city?
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                We frequently expand our service routes.
              </h2>
              <p className="mt-3 text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
                Contact our customer coordination team to check upcoming route additions or inquire about scheduling for adjacent Colorado neighborhoods.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary rounded-full px-8 py-3 text-xs font-extrabold shadow-md">
                  Contact Team
                </Link>
                <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-xs font-extrabold text-white hover:bg-white/20">
                  Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
