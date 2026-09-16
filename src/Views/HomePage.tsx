"use client";

import Hero from "../components/Page/Home/Hero";
import CinematicStats from "../components/Page/Home/CinematicStats";
import FullService from "../components/Page/Home/FullService";
import HowWeCleanStory from "../components/Page/Home/HowWeCleanStory";
import EquipmentShowcase from "../components/Page/Home/EquipmentShowcase";
import ServicesGallery from "../components/Page/Home/ServicesGallery";
import WhyChooseUs from "../components/Page/Home/WhyChooseUs";
import HowItWorks from "../components/Page/Home/HowItWorks";
import ClientsSay from "../components/Page/Home/ClientsSay";
import SatisfiedClients from "../components/Page/Home/SatisfiedClients";
import ServiceNetwork from "../components/Page/Home/ServiceNetwork";
import FAQ from "../components/Page/Home/FAQ";
import FinalCTA from "../components/Page/Home/FinalCTA";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useHomeCinematic } from "../hooks/useHomeCinematic";
import { useGetPublicWebsiteQuery, useGetWebsitePreviewQuery } from "@/src/redux/features/website/websiteApi";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";

const fallbackSections: WebsiteHomepageSection[] = [
  { id: "full-service", type: "full_service", enabled: true, order: 10 },
  { id: "how-we-clean", type: "how_we_clean", enabled: true, order: 20 },
  { id: "equipment", type: "equipment", enabled: true, order: 30 },
  { id: "services", type: "services", enabled: true, order: 40 },
  { id: "why-choose", type: "why_choose", enabled: true, order: 50 },
  { id: "process", type: "process", enabled: true, order: 60 },
  { id: "testimonials", type: "testimonials", enabled: true, order: 70 },
  { id: "satisfaction", type: "satisfaction", enabled: true, order: 80 },
  { id: "service-areas", type: "service_areas", enabled: true, order: 90 },
  { id: "faq", type: "faq", enabled: true, order: 100 },
  { id: "cta", type: "cta", enabled: true, order: 110 },
];

function CustomSection({ section }: { section: WebsiteHomepageSection }) {
  return <section className="py-24"><div className="container-page max-w-4xl text-center" data-cinema-reveal>{section.eyebrow ? <span className="pill">— {section.eyebrow} —</span> : null}<h2 className="mt-4 text-4xl text-brand-dark md:text-5xl">{section.title || "Website section"}</h2>{section.subtitle ? <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{section.subtitle}</p> : null}{section.body ? <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line leading-8 text-foreground/75">{section.body}</p> : null}</div></section>;
}

export default function HomePage({ previewToken }: { previewToken?: string }) {
  const ref = useHomeCinematic<HTMLDivElement>();
  const publicQuery = useGetPublicWebsiteQuery(undefined, { skip: Boolean(previewToken) });
  const previewQuery = useGetWebsitePreviewQuery(previewToken || "", { skip: !previewToken });
  const payload = (previewToken ? previewQuery.data : publicQuery.data)?.data;
  const content = payload?.content;
  const services = payload?.services || [];
  const sections = (content?.homepageSections?.length ? content.homepageSections : fallbackSections)
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: WebsiteHomepageSection) => {
    switch (section.type) {
      case "full_service": return <FullService key={section.id} section={section} />;
      case "how_we_clean": return <HowWeCleanStory key={section.id} section={section} />;
      case "equipment": return <EquipmentShowcase key={section.id} section={section} />;
      case "services": return <ServicesGallery key={section.id} services={services} section={section} />;
      case "why_choose": return <WhyChooseUs key={section.id} section={section} />;
      case "process": return <HowItWorks key={section.id} section={section} />;
      case "testimonials": return <ClientsSay key={section.id} testimonials={content?.testimonials.items} section={section} />;
      case "satisfaction": return <SatisfiedClients key={section.id} section={section} />;
      case "service_areas": return <ServiceNetwork key={section.id} areas={content?.serviceAreas} contact={content?.contact} section={section} />;
      case "faq": return <FAQ key={section.id} faqs={content?.faqs.items} section={section} />;
      case "cta": return <FinalCTA key={section.id} section={section} phone={content?.contact.phone} />;
      default: return <CustomSection key={section.id} section={section} />;
    }
  };

  return (
    <SiteLayout website={payload}>
      {previewToken ? <div className="sticky top-0 z-[70] border-b border-brand-lime/30 bg-brand-dark px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-brand-lime">Draft preview · not published</div> : null}
      <div ref={ref} className="cinematic-home overflow-clip">
        <Hero content={content} />
        <CinematicStats stats={content?.statistics} />
        <div id="story">{sections.map(renderSection)}</div>
      </div>
    </SiteLayout>
  );
}
