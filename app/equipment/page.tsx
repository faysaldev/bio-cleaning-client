import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Sparkles, Wind } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import EquipmentShowcase from "@/src/components/Page/Home/EquipmentShowcase";

export const metadata: Metadata = {
  title: "Professional Equipment & Eco Supplies | BIO Cleaning",
  description: "Explore the hospital-grade HEPA vacuums, microfiber color systems, and non-toxic supplies used on every BIO Cleaning visit.",
};

const equipmentAdvantages = [
  {
    icon: Wind,
    title: "Zero Airborne Recirculation",
    desc: "Standard vacuums spit fine dust back into your rooms. Our sealed HEPA canisters capture 99.97% of airborne allergens down to 0.3 microns.",
  },
  {
    icon: Leaf,
    title: "Safe for Crawling Babies & Pets",
    desc: "We strictly forbid caustic sodium hypochlorite (bleach), phthalates, and harsh ammonias. Every cleaner uses biodegradable, residue-free formulas.",
  },
  {
    icon: ShieldCheck,
    title: "Surface-Matched Protection",
    desc: "Granite, hardwood, composite quartz, and stainless steel all receive pH-balanced chemistry that cleans without dulling or stripping protective coats.",
  },
];

export default async function Page() {
  const website = await getPublicWebsiteServer();

  return (
    <SiteLayout website={website || undefined}>
      <PublicPageHero
        eyebrow="Equipment & Chemistry"
        title="Professional Tools Matched Intentionally to Every Surface."
        description="We invest in commercial filtration, color-coded microfibers, and non-toxic formulas so your home stays genuinely clean—without harsh chemical smells."
        actions={
          <>
            <Link href="/book" className="btn-primary rounded-full px-8">
              Book a Service <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-we-clean" className="btn-ghost-light rounded-full px-7">
              Explore 50-Point Process
            </Link>
          </>
        }
      />

      <EquipmentShowcase />

      {/* Equipment Advantages Grid */}
      <section className="bg-white py-20 lg:py-28 border-t border-brand-green/10">
        <div className="container-page max-w-5xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="editorial-kicker mx-auto mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Why Our Supplies Matter</span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
              Better Equipment Protects Your Home & Health
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {equipmentAdvantages.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-8 transition hover:border-brand-lime hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime/40 text-brand-dark">
                    <Icon className="h-6 w-6 text-brand-dark" />
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-dark">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="mt-16 rounded-3xl bg-[#0C3629] p-8 text-center text-white sm:p-12 shadow-xl">
            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Ready to experience an eco-friendly clean?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">
              Our teams bring all equipment and green products. You don&apos;t have to lift a finger or supply a thing.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/book" className="btn-primary rounded-full px-8">
                Book With Live Capacity <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
