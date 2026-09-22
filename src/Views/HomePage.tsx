"use client";

import Hero from "../components/Page/Home/Hero";
import CinematicStats from "../components/Page/Home/CinematicStats";
import LocalHighlights from "../components/Page/Home/LocalHighlights";
import ServicesCarousel from "../components/Page/Home/ServicesCarousel";
import LocalSpotlight from "../components/Page/Home/LocalSpotlight";
import WhyChooseUs from "../components/Page/Home/WhyChooseUs";
import RecurringPlans from "../components/Page/Home/RecurringPlans";
import ProjectsGallery from "../components/Page/Home/ProjectsGallery";
import TestimonialsWave from "../components/Page/Home/TestimonialsWave";
import RecentBlogs from "../components/Page/Home/RecentBlogs";
import ReadyBannerCTA from "../components/Page/Home/ReadyBannerCTA";
import FAQ from "../components/Page/Home/FAQ";

// Legacy and CMS-extensible section components
import FullService from "../components/Page/Home/FullService";
import HowWeCleanStory from "../components/Page/Home/HowWeCleanStory";
import EquipmentShowcase from "../components/Page/Home/EquipmentShowcase";
import BeforeAfterSection from "../components/Page/Home/BeforeAfterSection";
import TeamPreview from "../components/Page/Home/TeamPreview";
import HowItWorks from "../components/Page/Home/HowItWorks";
import BookingPreview from "../components/Page/Home/BookingPreview";
import ServiceNetwork from "../components/Page/Home/ServiceNetwork";

import { SiteLayout } from "../Layouts/SiteLayout";
import { useHomeCinematic } from "../hooks/useHomeCinematic";
import { useGetPublicWebsiteQuery, useGetWebsitePreviewQuery } from "@/src/redux/features/website/websiteApi";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

export default function HomePage({ previewToken }: { previewToken?: string }) {
  const ref = useHomeCinematic<HTMLDivElement>();
  const publicQuery = useGetPublicWebsiteQuery(undefined, { skip: Boolean(previewToken) });
  const previewQuery = useGetWebsitePreviewQuery(previewToken || "", { skip: !previewToken });
  const payload = (previewToken ? previewQuery.data : publicQuery.data)?.data;
  const content = payload?.content;
  const services = payload?.services || [];

  return (
    <SiteLayout website={payload}>
      {previewToken ? (
        <div className="sticky top-0 z-[70] border-b border-brand-lime/30 bg-[#0C3629] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-brand-lime">
          Draft CMS Preview Mode · Unsaved Changes
        </div>
      ) : null}

      <div ref={ref} className="cinematic-home overflow-clip bg-white">
        {/* 1. Hero Section (House Cleaning Services in Aurora, CO with Video Showcase) */}
        <Hero content={content} />

        {/* 2. Key Cinematic Numbers / Trust Highlights */}
        <CinematicStats stats={content?.statistics} />

        {/* 3. "Things To Do In Aurora, CO" Local Community & Colorado Region Map */}
        <LocalHighlights
          section={content?.homepageSections?.find((s) => s.type === "service_areas")}
        />

        {/* 4. "Our Cleaning Services" Interactive Carousel Showcase */}
        <ServicesCarousel
          services={services}
          section={content?.homepageSections?.find((s) => s.type === "services")}
        />

        {/* 5. "Arvada, CO House Cleaning Near Me" Local Feature Spotlight */}
        <LocalSpotlight
          section={content?.homepageSections?.find((s) => s.type === "full_service")}
        />

        {/* 6. "Why Choose Our House Cleaning Services?" 6-Card Grid with 100% Guarantee Card */}
        <WhyChooseUs
          section={content?.homepageSections?.find((s) => s.type === "why_choose")}
        />

        {/* 7. "Recurring Cleaning Services in Arvada, CO" Map & Frequency Discount Plans */}
        <RecurringPlans
          section={content?.homepageSections?.find((s) => s.type === "process")}
        />

        {/* 8. "Our Projects" 6-Card Transformation Gallery */}
        <ProjectsGallery
          section={content?.homepageSections?.find((s) => s.type === "before_after")}
        />

        {/* 9. "Testimonials" Flowing Wave Ribbon with Circular Avatars & Dark Featured Card */}
        <TestimonialsWave
          testimonials={content?.testimonials?.items}
          section={content?.homepageSections?.find((s) => s.type === "testimonials")}
        />

        {/* 10. "Recent Blog Posts" Cleaning Advice & Checklists */}
        <RecentBlogs />

        {/* 11. "Ready for Your Cleanest Home Yet?" Energetic Lime CTA Banner */}
        <ReadyBannerCTA
          phone={content?.contact?.phone}
          section={content?.homepageSections?.find((s) => s.type === "cta")}
        />

        {/* 12. FAQ Section */}
        <FAQ
          faqs={content?.faqs?.items}
          section={content?.homepageSections?.find((s) => s.type === "faq")}
        />
      </div>
    </SiteLayout>
  );
}
