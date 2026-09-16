import AboutPage from "@/src/Views/AboutPage";
import type { Metadata } from "next";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
export async function generateMetadata(): Promise<Metadata>{ const website=await getPublicWebsiteServer(); return { title: "About", description: website?.content.about.intro || website?.content.seo.defaultDescription }; }
export default function Page(){ return <AboutPage />; }
