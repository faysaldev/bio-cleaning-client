import type { Metadata } from "next";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import ServiceNetwork from "@/src/components/Page/Home/ServiceNetwork";
export const metadata: Metadata = { title: "Service Areas", description: "Explore the communities and areas served by BIO Cleaning." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Service areas" title="Local teams, one operating standard." description={website?.content.contact.serviceAreaSummary || "Explore the areas where our teams currently provide professional cleaning."}/><ServiceNetwork areas={website?.content.serviceAreas} contact={website?.content.contact}/></SiteLayout>; }
