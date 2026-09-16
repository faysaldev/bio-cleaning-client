import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, CalendarCheck2, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { publicSlug } from "@/src/lib/publicSlug";

const areaBenefits = [
  { icon: MapPin, title: "Local coverage", copy: "Public coverage is managed centrally so customers see only active service areas." },
  { icon: CalendarCheck2, title: "Live scheduling", copy: "Available dates and times still come from real staff capacity, business hours and blocked slots." },
  { icon: Sparkles, title: "One quality standard", copy: "Every supported area uses the same service scopes, operational checklists and completion workflow." },
];

async function findArea(slug: string) {
  const website = await getPublicWebsiteServer();
  const area = website?.content.serviceAreas.find((item) => item.visible && (item.id === slug || publicSlug(item.name) === slug));
  return { website, area };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { area } = await findArea(slug);
  return area
    ? { title: `Cleaning Services in ${area.name}`, description: area.description || `Professional residential and commercial cleaning in ${area.name}.` }
    : { title: "Service Area" };
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { website, area } = await findArea(slug);
  if (!area) return <SiteLayout website={website || undefined}><div className="container-page py-28 text-center"><h1 className="text-4xl font-extrabold text-brand-dark">Service area not found</h1><Link href="/service-areas" className="btn-primary mt-6">View all service areas</Link></div></SiteLayout>;
  return <SiteLayout website={website || undefined}>
    <PublicPageHero eyebrow="Local service area" title={`Professional cleaning in ${area.name}`} description={area.description || `BIO Cleaning serves supported homes and workplaces across ${area.name} with the same scheduling, field checklist and quality standards used throughout our network.`} actions={<><Link href="/book" className="btn-primary">Check live availability</Link><Link href="/quote" className="btn-secondary">Request a quote</Link></>}/>
    <section className="py-20"><div className="container-page grid gap-5 md:grid-cols-3">
      {areaBenefits.map(({icon:Icon,title,copy})=><article key={title} className="surface p-6"><Icon className="h-5 w-5 text-brand-green"/><h2 className="mt-4 text-xl font-extrabold text-brand-dark">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
    </div></section>
  </SiteLayout>;
}
