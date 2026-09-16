import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import EquipmentShowcase from "@/src/components/Page/Home/EquipmentShowcase";
export const metadata: Metadata = { title: "Equipment & Products", description: "Professional HEPA, microfiber, steam and low-residue cleaning systems used by BIO Cleaning." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Equipment & products" title="Professional tools matched to the surface." description="We choose equipment and chemistry for consistency, cross-contamination control and a cleaner finish." actions={<Link href="/services" className="btn-primary">Explore services</Link>}/><EquipmentShowcase/></SiteLayout>; }
