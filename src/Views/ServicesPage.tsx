"use client";

import { useState } from "react";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useGetAllServicesQuery } from "@/src/redux/features/services/servicesApi";
import { CTASection } from "@/src/components/Global/CTASection";

// Components
import { ServiceStats } from "../components/Services/ServiceStats";
import { ServiceGrid } from "../components/Services/ServiceGrid";
import { ServiceModal } from "../components/Services/ServiceModal";
import { ServiceOperatingSystem } from "../components/Services/ServiceOperatingSystem";
import { PlanComparison } from "../components/Services/PlanComparison";
import { SignaturePackages } from "../components/Services/SignaturePackages";
import { ServiceAddons } from "../components/Services/ServiceAddons";
import { CleaningService } from "../redux/features/services/types";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";

const serviceStats: [string, string][] = [
  ["24/7", "Online booking"],
  ["Eco-friendly", "Certified products"],
  ["100%", "Plant-based supplies"],
  ["5.1K+", "Spaces restored"],
];

const addons = [
  { name: "Window Cleaning", price: "+$25" },
  { name: "Carpet Shampooing", price: "+$45" },
  { name: "Oven Deep Clean", price: "+$30" },
  { name: "Fridge Clean", price: "+$25" },
  { name: "Laundry Folding", price: "+$20" },
  { name: "Pet-Hair Removal", price: "+$15" },
];

export default function ServicesPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  const { data: servicesResponse, isLoading, isError, refetch } = useGetAllServicesQuery({});
  const { data: websiteResponse } = useGetPublicWebsiteQuery();
  const [previewService, setPreviewService] = useState<CleaningService | null>(
    null,
  );

  const services = servicesResponse?.data || [];

  return (
    <SiteLayout website={websiteResponse?.data}>
      <div ref={ref}>
        <PublicPageHero
          eyebrow="Certified Eco-Friendly Cleaning"
          title="Professional Care for Every Space"
          description="From routine maintenance to full-property restoration — transparent pricing, dedicated vetted crews, and non-toxic hospital-grade supplies."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-extrabold text-brand-dark shadow-md transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Book a Cleaning
              </a>
              <a
                href="/quote"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Request Custom Quote
              </a>
            </div>
          }
        />

        <section className="py-20 md:py-24 bg-[#F4FAF5]/70">
          <ServiceStats stats={serviceStats} />

          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
              Tailored Cleaning Solutions
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-brand-dark mt-3">
              Choose the Perfect Clean for Your Property
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent, flat-rate pricing with zero hidden surcharges. All equipment and eco-safe supplies included.
            </p>
          </div>

          <ServiceGrid
            services={services}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onPreview={setPreviewService}
          />
        </section>

        <ServiceOperatingSystem />

        <PlanComparison />

        <SignaturePackages />

        <ServiceAddons addons={addons} />

        <CTASection
          title="Don't see exactly what you need?"
          subtitle="We offer custom commercial and residential quotes for unique properties."
        />

        {/* Preview Modal */}
        <ServiceModal
          service={previewService}
          onClose={() => setPreviewService(null)}
        />
      </div>
    </SiteLayout>
  );
}
