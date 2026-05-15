"use client";

import { useState } from "react";
import { PageHero } from "@/src/components/Global/PageHero";
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
  const { data: servicesResponse, isLoading } = useGetAllServicesQuery({});
  const [previewService, setPreviewService] = useState<CleaningService | null>(
    null,
  );

  const services = servicesResponse?.data || [];

  return (
    <SiteLayout>
      <div ref={ref}>
        <PageHero
          title="Our Cleaning Services"
          crumb="Home / Services"
          subtitle="From a quick refresh to a full-property reset — pick the perfect plan."
        />

        <section className="py-24 bg-brand-cream/30">
          <ServiceStats stats={serviceStats} />

          <div className="text-center mb-16 px-4">
            <span className="pill bg-brand-green/10 text-brand-green">
              — Service Menu —
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mt-4">
              Professional Care for Every Space
            </h2>
          </div>

          <ServiceGrid
            services={services}
            isLoading={isLoading}
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
