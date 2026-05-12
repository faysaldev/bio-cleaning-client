import Hero from "../components/Page/Home/Hero";
import FullService from "../components/Page/Home/FullService";
import ClientsSay from "../components/Page/Home/ClientsSay";
import WhyChooseUs from "../components/Page/Home/WhyChooseUs";
import HowItWorks from "../components/Page/Home/HowItWorks";
import ServicesGallery from "../components/Page/Home/ServicesGallery";
import SatisfiedClients from "../components/Page/Home/SatisfiedClients";
import ServiceNetwork from "../components/Page/Home/ServiceNetwork";
import FAQ from "../components/Page/Home/FAQ";
import FinalCTA from "../components/Page/Home/FinalCTA";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useGsapReveal } from "../hooks/useGsapReveal";

const HomePage = () => {
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <SiteLayout>
      <div ref={ref}>
        <Hero />
        <FullService />
        <ClientsSay />
        <WhyChooseUs />
        <HowItWorks />
        <ServicesGallery />
        <SatisfiedClients />
        <ServiceNetwork />
        <FAQ />
        <FinalCTA />
      </div>
    </SiteLayout>
  );
};

export default HomePage;
