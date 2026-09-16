import ContactPage from "@/src/Views/ContactPage";
import type { Metadata } from "next";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
export async function generateMetadata(): Promise<Metadata>{ const website=await getPublicWebsiteServer(); return { title: "Contact", description: website?.content.contact.intro || website?.content.seo.defaultDescription }; }
export default function Page(){ return <ContactPage />; }
