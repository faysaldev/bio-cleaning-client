import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Clock, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { cleaningResources } from "@/src/content/resources";

export const metadata: Metadata = {
  title: "Cleaning Tips & Professional Guides | BIO Cleaning",
  description: "Practical home preparation, routine maintenance, and healthy workspace cleaning guidance from the BIO Cleaning team.",
};

export default async function Page() {
  const website = await getPublicWebsiteServer();

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Knowledge & Maintenance"
        title="Useful guidance for cleaner, calmer spaces."
        description="Straightforward advice on preparing your space for service, maintaining results between appointments, and making healthy choices for indoor surfaces."
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-sm font-extrabold shadow-md">
              Book a Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-sm font-extrabold text-white hover:bg-white/20">
              Calculate Quote
            </Link>
          </>
        }
      />

      <section className="bg-[#F7FAF8] py-20 lg:py-28">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-3">
            {cleaningResources.map((item) => (
              <article
                key={item.slug}
                className="group rounded-3xl border border-brand-green/12 bg-white p-7 sm:p-8 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4FAF5] text-brand-green group-hover:bg-[#0C3629] group-hover:text-brand-lime transition-colors">
                      <BookOpenText className="h-5 w-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/15 bg-[#F4FAF5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
                      <Clock className="h-3 w-3" /> {item.readTime} read
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-brand-green/8">
                  <Link
                    href={`/resources/${item.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-green group-hover:text-brand-dark transition-colors"
                  >
                    Read complete guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Need Custom Plan Banner */}
          <div className="mt-16 rounded-3xl bg-[#0C3629] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
                <Sparkles className="h-3.5 w-3.5" /> Personalized Care
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Want a custom cleaning routine tailored to your space?
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/75">
                Our technicians adapt to fragile stone, hardwood finishes, heavy pet traffic, or specific allergy requirements.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-xs font-extrabold shadow-md">
                  Schedule Online
                </Link>
                <Link href="/contact" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-xs font-extrabold text-white hover:bg-white/20">
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
