"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, FileText, HelpCircle, Mail, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";

type PolicyKey = "privacy" | "terms" | "cancellation" | "accessibility";

const policyLinks = [
  { href: "/cancellation-policy", label: "Cancellation & Reschedule" },
  { href: "/accessibility", label: "Accessibility Statement" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function PolicyPage({ policy, title }: { policy: PolicyKey; title: string }) {
  const pathname = usePathname();
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const content = website?.content;
  const phone = content?.contact.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const text =
    content?.policies[policy] ||
    "This policy is being maintained in accordance with BIO Cleaning LLC operating standards and Colorado consumer protection regulations. Please contact us directly if you have specific accommodation or policy questions.";

  return (
    <SiteLayout website={website}>
      <div className="bg-white">
        {/* Spruce Hero */}
        <section className="relative overflow-hidden bg-[#0C3629] py-16 text-white md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[100px]" />

          <div className="container-page relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Policies & Standards</span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Clear guidelines, transparent expectations, and customer protection standards for every service visit.
            </p>
          </div>
        </section>

        {/* Content Body with Sticky Policy Nav Sidebar */}
        <section className="py-16 lg:py-24">
          <div className="container-page max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
              {/* Navigation Sidebar */}
              <aside className="space-y-6">
                <div className="rounded-3xl border border-brand-green/15 bg-[#f7faf8] p-5 shadow-sm">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-brand-dark mb-3">
                    All Policy Documents
                  </div>
                  <nav className="flex flex-col gap-1.5">
                    {policyLinks.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                            isActive
                              ? "bg-[#0C3629] text-white shadow-sm"
                              : "text-muted-foreground hover:bg-white hover:text-brand-dark"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" /> : null}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Direct Help Callout Box */}
                <div className="rounded-3xl bg-[#0C3629] p-6 text-white shadow-lg">
                  <HelpCircle className="h-6 w-6 text-brand-lime mb-3" />
                  <div className="text-sm font-extrabold">Need assistance?</div>
                  <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                    Our local customer support team in Aurora is available Monday through Saturday.
                  </p>
                  <a
                    href={phoneHref}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-lime hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" /> {phone}
                  </a>
                </div>
              </aside>

              {/* Main Policy Content Container */}
              <main>
                <div className="rounded-3xl border border-brand-green/12 bg-white p-8 sm:p-10 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-green pb-4 border-b border-brand-green/10 mb-6">
                    <CheckCircle2 className="h-4 w-4 text-brand-lime" />
                    <span>Effective: 2026 • Verified BIO Standard</span>
                  </div>

                  <article className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {text}
                  </article>

                  <div className="mt-10 rounded-2xl border border-brand-green/15 bg-[#f7faf8] p-6 text-xs text-muted-foreground leading-relaxed">
                    <strong>Questions or accommodations:</strong> If you require alternate format documents or have specific cancellation circumstances, please contact our team at{" "}
                    <a href={`mailto:${content?.contact.email || "support@biocleaningllc.com"}`} className="font-bold text-brand-dark underline">
                      {content?.contact.email || "support@biocleaningllc.com"}
                    </a>
                    .
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
