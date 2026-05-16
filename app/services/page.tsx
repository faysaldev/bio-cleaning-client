import ServicesPage from "@/src/Views/ServicesPage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bio-cleaning-llc.vercel.app/api/v1";
  
  try {
    const res = await fetch(`${baseUrl}/services`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const services = data?.data || [];
    
    const serviceNames = services.map((s: any) => s.name).join(", ");
    const serviceTags = Array.from(new Set(services.flatMap((s: any) => s.tags || []))).join(", ");
    
    return {
      title: "Our Services",
      description: `Explore our wide range of professional cleaning services: ${serviceNames}. Expert care for homes and offices.`,
      keywords: [
        "cleaning services", "residential cleaning", "commercial cleaning", 
        "deep cleaning", "move-in cleaning", ...serviceNames.split(", "), 
        ...serviceTags.split(", ")
      ],
    };
  } catch (error) {
    return {
      title: "Our Services",
      description: "Explore our wide range of professional cleaning services including residential, commercial, deep cleaning, and more.",
    };
  }
}

export default function Home() {
  return <ServicesPage />;
}
