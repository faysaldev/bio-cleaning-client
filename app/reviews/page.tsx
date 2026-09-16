import type { Metadata } from "next";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import ClientsSay from "@/src/components/Page/Home/ClientsSay";
import type { WebsiteTestimonial } from "@/src/redux/features/website/types";

export const metadata: Metadata = { title: "Reviews", description: "Verified customer stories and testimonials from BIO Cleaning." };

type VerifiedReview = { id: string; name: string; service: string; rating: number; comment: string; submittedAt?: string; verified: true };

async function getVerifiedReviews(): Promise<VerifiedReview[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return [];
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/reviews/testimonials`);
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export default async function Page(){
  const [website, verified] = await Promise.all([getPublicWebsiteServer(), getVerifiedReviews()]);
  const verifiedTestimonials: WebsiteTestimonial[] = verified.map((item, index) => ({
    id: `verified-${item.id}`,
    name: item.name,
    role: `${item.service} · Verified customer`,
    quote: item.comment,
    rating: item.rating,
    imageUrl: "",
    videoUrl: "",
    visible: true,
    order: index,
  }));
  const curated = (website?.content.testimonials.items || []).filter((item) => item.visible);
  const testimonials = [...verifiedTestimonials, ...curated].slice(0, 24);
  return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Verified customer stories" title="Trust is built after the final walkthrough." description={website?.content.testimonials.intro || "Read experiences from customers who trusted our team with their homes and workplaces."}/><ClientsSay testimonials={testimonials}/></SiteLayout>;
}
