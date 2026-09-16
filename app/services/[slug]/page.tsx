import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { getPublicWebsiteServer } from "@/src/lib/websiteServer";

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

async function getService(identifier: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return null;
  try { const response = await fetch(`${base.replace(/\/$/, "")}/services/${encodeURIComponent(identifier)}`, ({ next: { revalidate: 120 } } satisfies NextFetchInit)); if (!response.ok) return null; return (await response.json())?.data || null; } catch { return null; }
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = await getService(slug);
  return service ? { title: service.name, description: service.description, openGraph: { title: `${service.name} | BIO Cleaning`, description: service.description, images: service.image ? [service.image] : [] } } : { title: "Cleaning Service" };
}
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const [service, website] = await Promise.all([getService(slug), getPublicWebsiteServer()]);
  if (!service) return <SiteLayout website={website || undefined}><div className="container-page py-28 text-center"><h1 className="text-4xl font-extrabold text-brand-dark">Service not found</h1><Link href="/services" className="btn-primary mt-6">Browse services</Link></div></SiteLayout>;
  const prep = service.scheduling?.preparationInstructions || [];
  return <SiteLayout website={website || undefined}><article className="pb-20"><section className="container-page grid gap-8 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-20"><div className="flex flex-col justify-center"><span className="editorial-kicker">Professional cleaning service</span><h1 className="mt-4 text-5xl font-extrabold tracking-[-.055em] text-brand-dark lg:text-7xl">{service.name}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{service.description}</p><div className="mt-7 flex flex-wrap gap-2"><span className="status-badge"><Clock3 className="h-3.5 w-3.5"/> {service.duration || `${service.scheduling?.durationMinutes || 180} min`}</span><span className="status-badge"><UsersRound className="h-3.5 w-3.5"/> {service.scheduling?.requiredStaff || 1}+ cleaner</span><span className="status-badge"><ShieldCheck className="h-3.5 w-3.5"/> Quality checked</span></div><div className="mt-8 flex flex-wrap gap-3"><Link href={`/book?serviceId=${encodeURIComponent(service._id)}`} className="btn-primary">Book from ${service.basePrice}</Link><Link href="/quote" className="btn-secondary">Request custom quote</Link></div></div><div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-brand-cream shadow-elevated"><Image src={service.image} alt={service.name} fill className="object-cover" sizes="(min-width:1024px) 45vw,100vw" /><div className="absolute inset-0 bg-gradient-to-t from-brand-dark/35 to-transparent"/></div></section><section className="border-y border-border bg-brand-cream/35 py-16"><div className="container-page grid gap-8 lg:grid-cols-2"><div className="surface p-7"><span className="editorial-kicker">What’s included</span><h2 className="mt-3 text-3xl font-extrabold text-brand-dark">A defined scope, not guesswork.</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{(service.includes || []).map((item:string)=><li key={item} className="flex gap-2 text-sm"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-green/10 text-brand-green"><Check className="h-3 w-3"/></span>{item}</li>)}</ul></div><div className="surface p-7"><span className="editorial-kicker">Before we arrive</span><h2 className="mt-3 text-3xl font-extrabold text-brand-dark">Prepare for a smooth handoff.</h2><div className="mt-6 space-y-3">{prep.length ? prep.map((item:string)=><div key={item} className="flex gap-3 rounded-xl border border-border bg-white p-4"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"/><p className="text-sm leading-6 text-muted-foreground">{item}</p></div>) : <p className="text-sm leading-6 text-muted-foreground">Your confirmation includes any service-specific preparation. Add access notes, pets, and preferences during booking so the team arrives prepared.</p>}</div></div></div></section></article></SiteLayout>;
}
