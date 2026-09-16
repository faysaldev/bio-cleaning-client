import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";
import { PublicPageHero } from "@/src/components/Public/PublicPageHero";
import { cleaningResources } from "@/src/content/resources";
export const metadata: Metadata = { title: "Cleaning Tips & Resources", description: "Practical cleaning, preparation and maintenance guidance from BIO Cleaning." };
export default async function Page(){ const website=await getPublicWebsiteServer(); return <SiteLayout website={website || undefined}><PublicPageHero eyebrow="Cleaning resources" title="Useful guidance for cleaner, calmer spaces." description="Straightforward advice on choosing services, preparing for a visit and maintaining a professional clean between appointments."/><section className="py-20"><div className="container-page grid gap-5 md:grid-cols-3">{cleaningResources.map(item=><article key={item.slug} className="surface flex min-h-64 flex-col p-6"><BookOpenText className="h-5 w-5 text-brand-green"/><p className="mt-5 text-xs font-extrabold uppercase tracking-[.12em] text-muted-foreground">{item.readTime} read</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.035em] text-brand-dark">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.excerpt}</p><Link href={`/resources/${item.slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-brand-green">Read guide <ArrowRight className="h-4 w-4"/></Link></article>)}</div></section></SiteLayout>; }
