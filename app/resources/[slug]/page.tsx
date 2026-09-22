import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { cleaningResources } from "@/src/content/resources";
const bodies: Record<string,string[]> = {
  "prepare-for-professional-cleaning": ["Confirm how the team will enter the property and make sure any alarm, gate or concierge instructions are current.","Clear the surfaces you want cleaned deeply enough that the cleaner can reach them. You do not need to pre-clean; simply remove personal clutter that would slow access.","Secure pets according to their comfort level and add any sensitivities or access notes to your customer profile.","List the two or three areas that matter most. A clear priority list helps the field team use the booked time intentionally."],
  "deep-clean-vs-regular-clean": ["Regular cleaning is designed to maintain a space that is already under control. It works best as a recurring rhythm for kitchens, bathrooms, dusting, floors and the agreed maintenance scope.","Deep cleaning is a reset. It normally allows more time for build-up, edges, detail zones and areas that do not need attention during every visit.","Choose a deep clean when it has been a long time since professional service, before starting recurring visits, after a busy season, or when the home needs a broader reset."],
  "healthy-office-cleaning-routine": ["Start with the areas people touch most often: entrances, shared kitchens, restrooms, meeting rooms and common desks.","Set the cleaning cadence around occupancy rather than a fixed assumption. A lightly used office may need fewer full cleans but still needs reliable high-touch and restroom attention.","Schedule disruptive work such as detailed floor care outside peak collaboration hours, then use a consistent maintenance scope during the normal week."],
};
export function generateStaticParams(){ return cleaningResources.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{ const {slug}=await params; const item=cleaningResources.find(x=>x.slug===slug); return item?{title:item.title,description:item.excerpt}:{}; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = cleaningResources.find((x) => x.slug === slug);
  if (!item) {
    return notFound();
  }
  const website = await getPublicWebsiteServer();

  return (
    <SiteLayout website={website || undefined}>
      {/* Article Header & Hero */}
      <section className="relative overflow-hidden bg-[#0C3629] py-16 sm:py-24 text-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[100px]" />

        <div className="container-page relative z-10 max-w-3xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition mb-6"
          >
            ← All Resources
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md ml-3">
            {item.readTime} read
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {item.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/75">
            {item.excerpt}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-[#F7FAF8] py-16 sm:py-24">
        <div className="container-page max-w-3xl">
          <article className="rounded-3xl border border-brand-green/12 bg-white p-8 sm:p-12 shadow-sm space-y-6">
            <div className="border-b border-brand-green/10 pb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">
                Professional Cleaning Standard • Published 2026
              </span>
            </div>

            {(bodies[slug] || []).map((paragraph, i) => (
              <div key={i} className="rounded-2xl border border-brand-green/10 bg-[#F4FAF5]/60 p-5 sm:p-6 transition hover:border-brand-green/30">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0C3629] text-brand-lime font-black text-xs mt-0.5">
                    0{i + 1}
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-normal">
                    {paragraph}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-8 border-t border-brand-green/10 pt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>Reviewed by BIO Cleaning Quality Assurance</span>
              <Link href="/resources" className="font-extrabold text-brand-green hover:underline">
                Browse more guides →
              </Link>
            </div>
          </article>

          {/* Action Callout */}
          <div className="mt-12 rounded-3xl bg-[#0C3629] p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Want a personalized plan for your space?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed">
                Use our live scheduling engine for standard residential visits or request a customized commercial estimate.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book" className="btn-primary rounded-full px-7 py-3 text-xs font-extrabold shadow-md">
                  Book Online
                </Link>
                <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-7 py-3 text-xs font-extrabold text-white hover:bg-white/20">
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
