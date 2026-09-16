import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { BeforeAfterShowcase } from "@/src/components/Public/BeforeAfterShowcase";
export const metadata: Metadata = { title: "Before & After", description: "Compare the visual reset delivered by BIO Cleaning's detail-focused cleaning standard." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Before + after" title="See what a finishing pass changes." description="Use the comparison control below to explore the visual reset, then book a service matched to your space."/><section className="py-20"><div className="container-page"><BeforeAfterShowcase/><div className="mt-8 flex justify-center gap-3"><Link className="btn-primary" href="/book">Book cleaning</Link><Link className="btn-secondary" href="/how-we-clean">See our process</Link></div></div></section></SiteLayout>; }
