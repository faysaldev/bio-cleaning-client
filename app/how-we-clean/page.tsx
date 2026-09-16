import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import HowWeCleanStory from "@/src/components/Page/Home/HowWeCleanStory";
import HowItWorks from "@/src/components/Page/Home/HowItWorks";

export const metadata: Metadata = { title: "How We Clean", description: "See BIO Cleaning's assessment, preparation, detail-cleaning and quality-check process." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Our cleaning standard" title="A repeatable process, not a rushed checklist." description="From the first room assessment to the final walkthrough, every clean follows a deliberate operating standard." actions={<><Link href="/book" className="btn-primary">Book cleaning</Link><Link href="/quote" className="btn-secondary border-white/20 bg-white/5 text-white">Get a quote</Link></>}/><HowWeCleanStory/><HowItWorks/></SiteLayout>; }
