import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarClock, HeartHandshake, Sparkles, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { CareerApplicationForm } from "@/src/components/Public/CareerApplicationForm";

export const metadata: Metadata = {
  title: "Careers & Team Opportunities | BIO Cleaning",
  description: "Join our professional eco-friendly cleaning crew in Aurora and Denver. Competitive hourly pay, structured schedules, and supportive team culture.",
};

const benefits = [
  {
    icon: CalendarClock,
    title: "Predictable Schedules",
    copy: "Know your daily routes, room checklists, and customer instructions ahead of arrival with zero guessing.",
  },
  {
    icon: DollarSign,
    title: "Competitive Compensation",
    copy: "Industry-leading hourly wages, performance bonuses, client tips, and travel mileage reimbursements.",
  },
  {
    icon: HeartHandshake,
    title: "Respectful Operations",
    copy: "A supportive management culture where cleaners are treated as essential hospitality professionals.",
  },
  {
    icon: Sparkles,
    title: "Career Advancement",
    copy: "Structured paths to progress from technician to Senior Cleaner, Crew Lead, Quality Inspector, or Dispatcher.",
  },
];

export default async function Page() {
  const website = await getPublicWebsiteServer();
  const email = website?.content.contact.email;

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Join Our Crew"
        title="Do Detail-Focused Work With a Team That Values You."
        description="We are looking for dependable, detail-obsessed professionals in Aurora and Denver who take pride in leaving every room genuinely back in order."
        actions={
          <>
            <a
              href="#apply"
              className="btn-primary rounded-full px-8"
            >
              Apply Online Now <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/about"
              className="btn-ghost-light rounded-full px-7"
            >
              Learn About BIO Standards
            </Link>
          </>
        }
      />

      {/* Benefits Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page max-w-5xl">
          <div className="mx-auto mb-14 text-center max-w-2xl">
            <div className="editorial-kicker mx-auto mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Why Work With BIO Cleaning</span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
              Built on Respect, Fair Pay, and Safe Products
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We never use harsh ammonia, bleach, or caustic chemicals. Protect your health while helping local families enjoy spotless homes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-8 transition hover:border-brand-lime hover:bg-white hover:shadow-lg"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime/40 text-brand-dark">
                  <Icon className="h-6 w-6 text-brand-dark" />
                </div>
                <h3 className="text-xl font-extrabold text-brand-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Online Application Section */}
      <section id="apply" className="border-t border-brand-green/10 bg-[#f7faf8] py-20 lg:py-28">
        <div className="container-page max-w-5xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="editorial-kicker mx-auto mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Online Application</span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
              Apply to Join Our Field Team
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Fill out the form below. Applications are reviewed directly by our operations team with prompt callbacks.
            </p>
          </div>

          <CareerApplicationForm />
        </div>
      </section>
    </SiteLayout>
  );
}
