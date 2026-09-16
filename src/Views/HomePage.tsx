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

const HomePage = () => {
  const ref = useHomeCinematic<HTMLDivElement>();

  return (
    <SiteLayout>
      <div ref={ref} className="cinematic-home overflow-clip">
        <Hero />
        <CinematicStats />
        <div id="story">
          <FullService />
        </div>
        <HowWeCleanStory />
        <EquipmentShowcase />
        <ServicesGallery />
        <WhyChooseUs />
        <HowItWorks />
        <ClientsSay />
        <SatisfiedClients />
        <ServiceNetwork />
        <FAQ />
        <FinalCTA />
      </div>
    </SiteLayout>
  );
};

export default HomePage;
