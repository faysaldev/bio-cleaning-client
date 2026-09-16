import type { Metadata } from "next";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import FAQ from "@/src/components/Page/Home/FAQ";
export const metadata: Metadata = { title: "FAQ", description: "Answers about booking, supplies, recurring cleaning, access and BIO Cleaning services." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Frequently asked questions" title="Clear answers before the clean starts." description={website?.content.faqs.intro}/><FAQ faqs={website?.content.faqs.items}/></SiteLayout>; }
