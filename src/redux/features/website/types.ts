import type { CleaningService } from "@/src/redux/features/services/types";

export interface WebsiteLink { label: string; url: string }
export interface WebsiteHomepageSection {
  id: string;
  type: "full_service" | "service_finder" | "how_we_clean" | "equipment" | "before_after" | "services" | "why_choose" | "team" | "process" | "testimonials" | "satisfaction" | "service_areas" | "booking_preview" | "faq" | "cta" | "custom";
  enabled: boolean;
  order: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  mediaUrl?: string;
  cta?: WebsiteLink;
}
export interface WebsiteStat { id: string; value: number; decimals: number; suffix: string; label: string }
export interface WebsiteTeamMember { id: string; name: string; role: string; bio: string; imageUrl: string; visible: boolean; order: number }
export interface WebsiteTestimonial { id: string; name: string; role: string; quote: string; rating: number; imageUrl: string; videoUrl: string; visible: boolean; order: number }
export interface WebsiteFaq { id: string; question: string; answer: string; visible: boolean; order: number }
export interface WebsiteServiceArea { id: string; name: string; description: string; visible: boolean; order: number }
export interface WebsiteSocialLink { platform: string; label: string; url: string }
export interface WebsiteValue { id: string; title: string; description: string }

export interface WebsiteSnapshot {
  branding: { siteName: string; tagline: string; logoUrl: string; faviconUrl: string };
  announcement: { enabled: boolean; text: string; linkLabel: string; linkUrl: string };
  hero: { eyebrow: string; title: string; description: string; mediaUrl: string; mediaAlt: string; primaryCta: WebsiteLink; secondaryCta: WebsiteLink; trustItems: string[] };
  statistics: WebsiteStat[];
  homepageSections: WebsiteHomepageSection[];
  about: { eyebrow: string; title: string; intro: string; storyTitle: string; storyParagraphs: string[]; mission: string; vision: string; mediaUrl: string; values: WebsiteValue[] };
  team: { eyebrow: string; title: string; intro: string; members: WebsiteTeamMember[] };
  testimonials: { eyebrow: string; title: string; intro: string; items: WebsiteTestimonial[] };
  faqs: { eyebrow: string; title: string; intro: string; items: WebsiteFaq[] };
  contact: { heading: string; intro: string; phone: string; email: string; hours: string; address: string; serviceAreaSummary: string; mapEmbedUrl: string };
  socialLinks: WebsiteSocialLink[];
  serviceAreas: WebsiteServiceArea[];
  policies: { privacy: string; terms: string; cancellation: string; accessibility: string };
  seo: { siteTitle: string; titleTemplate: string; defaultDescription: string; keywords: string[]; ogImageUrl: string; robotsIndex: boolean; robotsFollow: boolean };
}

export interface WebsitePublicPayload { content: WebsiteSnapshot; revision: number; publishedAt?: string; preview?: boolean; services: CleaningService[] }
export interface WebsiteAdminPayload { draft: WebsiteSnapshot; published: WebsiteSnapshot; draftRevision: number; publishedRevision: number; publishedAt?: string; updatedAt?: string }
export interface WebsiteRevision { _id: string; revision: number; publishedAt: string; note?: string; publishedBy?: { name?: string; email?: string } }
export interface WebsiteMedia { _id: string; url: string; altText: string; label?: string; kind: "image" | "video" | "document"; createdAt: string }
export interface ApiEnvelope<T> { data: T; message: string; status: string; code: number }
