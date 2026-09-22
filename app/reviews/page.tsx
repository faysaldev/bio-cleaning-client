import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareHeart, ShieldCheck, Sparkles, Star } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import ClientsSay from "@/src/components/Page/Home/ClientsSay";
import type { WebsiteTestimonial } from "@/src/redux/features/website/types";

export const metadata: Metadata = {
  title: "Customer Reviews & Ratings | BIO Cleaning",
  description: "Verified customer stories, 5-star reviews, and service feedback from homeowners and office managers across the Denver metro area.",
};

type VerifiedReview = {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  submittedAt?: string;
  verified: true;
};

async function getVerifiedReviews(): Promise<VerifiedReview[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return [];
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/reviews/testimonials`);
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const [website, verified] = await Promise.all([getPublicWebsiteServer(), getVerifiedReviews()]);

  const verifiedTestimonials: WebsiteTestimonial[] = verified.map((item, index) => ({
    id: `verified-${item.id}`,
    name: item.name,
    role: `${item.service} · Verified customer`,
    quote: item.comment,
    rating: item.rating,
    imageUrl: "",
    videoUrl: "",
    visible: true,
    order: index,
  }));

  const curated = (website?.content.testimonials.items || []).filter((item) => item.visible);
  const testimonials = [...verifiedTestimonials, ...curated].slice(0, 24);

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Verified Client Feedback"
        title="Trust is built after the final walkthrough."
        description={
          website?.content.testimonials.intro ||
          "Read genuine reviews and honest feedback from clients who trusted our background-checked team with their homes, offices, and move days."
        }
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-sm font-extrabold shadow-md">
              Book a Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/quote" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-sm font-extrabold text-white hover:bg-white/20">
              Get an Estimate
            </Link>
          </>
        }
      />

      {/* Review Metrics Bar */}
      <section className="border-b border-brand-green/10 bg-white py-10">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto text-center">
            <div className="rounded-3xl border border-brand-green/12 bg-[#F7FAF8] p-6 shadow-sm">
              <div className="flex justify-center gap-1 text-amber-500 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-3xl font-extrabold text-brand-dark">4.9 / 5.0</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Average Customer Rating
              </p>
            </div>

            <div className="rounded-3xl border border-brand-green/12 bg-[#F7FAF8] p-6 shadow-sm">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-[#0C3629] text-brand-lime mb-2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-brand-dark">100%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verified Service Reviews
              </p>
            </div>

            <div className="rounded-3xl border border-brand-green/12 bg-[#F7FAF8] p-6 shadow-sm">
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-[#0C3629] text-brand-lime mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold text-brand-dark">24-Hour</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Re-Clean Guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews Wall Grid */}
      <section className="bg-[#F7FAF8] py-20 lg:py-28">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <span className="editorial-kicker">Honest Experiences</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
              What Our Clients Say
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every review comes from a completed visit. Read about our attention to detail, reliability, and botanical cleaning results.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="rounded-3xl border border-brand-green/12 bg-white p-7 shadow-sm flex flex-col justify-between transition hover:-translate-y-1 hover:border-brand-lime/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0C3629]">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/80 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-brand-green/8 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0C3629] text-brand-lime font-black text-sm shadow-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-dark text-sm">{t.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{t.role || "Homeowner"}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video / Carousel Section */}
      <ClientsSay testimonials={testimonials} />

      {/* Feedback Prompt Banner */}
      <section className="bg-white py-16 lg:py-20 border-t border-brand-green/10">
        <div className="container-page max-w-4xl">
          <div className="rounded-3xl bg-[#0C3629] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl text-center">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
                <MessageSquareHeart className="h-3.5 w-3.5" /> Recent Customer?
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                We value your thoughts after every cleaning.
              </h2>
              <p className="mt-3 text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
                Check your post-service email for your private feedback link, or sign in to your customer portal anytime to review your service history.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link href="/portal" className="btn-primary rounded-full px-8 py-3 text-xs font-extrabold shadow-md">
                  Open Customer Portal
                </Link>
                <Link href="/contact" className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-xs font-extrabold text-white hover:bg-white/20">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
