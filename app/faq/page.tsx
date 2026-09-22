import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, Mail, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import FAQ from "@/src/components/Page/Home/FAQ";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | BIO Cleaning",
  description: "Clear answers about booking, eco supplies, recurring cleaning discounts, home access, and the BIO Cleaning 100% satisfaction guarantee.",
};

export default async function Page() {
  const website = await getPublicWebsiteServer();
  const phone = website?.content.contact.phone || "+1 (800) BIO-CLEAN";
  const email = website?.content.contact.email || "support@biocleaningllc.com";

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Help & Frequently Asked Questions"
        title="Clear answers before the clean starts."
        description={
          website?.content.faqs.intro ||
          "Find fast answers to questions about booking, technician preparation, pet safety, recurring discounts, and our 100% satisfaction guarantee."
        }
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8 py-3 text-sm font-extrabold shadow-md">
              Book a Cleaning <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="btn-secondary rounded-full border-white/20 bg-white/10 px-8 py-3 text-sm font-extrabold text-white hover:bg-white/20"
            >
              Call {phone}
            </a>
          </>
        }
      />

      {/* Main FAQ Accordion Component */}
      <FAQ faqs={website?.content.faqs.items} />

      {/* Need more help contact banner */}
      <section className="bg-[#F4FAF5] py-16 sm:py-24 border-t border-brand-green/10">
        <div className="container-page max-w-5xl">
          <div className="rounded-3xl bg-white border border-brand-green/15 p-8 sm:p-12 shadow-sm">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
                  <HelpCircle className="h-3.5 w-3.5" /> Direct Client Support
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                  Didn’t find what you were looking for?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our client coordination team in Aurora is standing by to help with custom access notes, specific surface chemistry, or large commercial requests.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row justify-end">
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="btn-secondary rounded-full px-6 py-3 text-xs font-bold text-center inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 text-brand-green" />
                  <span>Call {phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="btn-primary rounded-full px-6 py-3 text-xs font-bold text-center inline-flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
