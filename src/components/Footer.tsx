"use client";

import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { WebsitePublicPayload } from "@/src/redux/features/website/types";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";

export const LOGO_URL = "https://res.cloudinary.com/dr6linfry/image/upload/q_auto/f_auto/v1778514293/logo_fekjaa.jpg";

export function Footer({ website }: { website?: WebsitePublicPayload }) {
  const { data: fallbackWebsite } = useGetPublicWebsiteQuery(undefined, { skip: Boolean(website) });
  const resolvedWebsite = website || fallbackWebsite?.data;
  const content = resolvedWebsite?.content;
  const services = resolvedWebsite?.services || [];
  const logo = content?.branding.logoUrl || LOGO_URL;
  const phone = content?.contact.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  return <footer className="relative mt-20 overflow-hidden bg-brand-dark text-white/68">
    <div className="container-page relative z-10 grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
      <div><div className="mb-4 flex items-center gap-3"><Image src={logo} alt={`${content?.branding.siteName || "BIO Cleaning"} logo`} width={44} height={44} unoptimized={logo.startsWith("http")} className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/16" /><div><div className="text-base font-extrabold tracking-[-0.025em] text-white">{content?.branding.siteName || "BIO Cleaning"}</div><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-lime">{content?.branding.tagline || "Back In Order"}</div></div></div><p className="max-w-xs text-sm leading-6">{content?.seo.defaultDescription || "Eco-friendly, professional cleaning that restores order to every space."}</p><div className="mt-5 flex flex-wrap gap-2">{(content?.socialLinks || []).map((social) => <a key={`${social.platform}-${social.url}`} aria-label={social.label || social.platform} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-brand-lime/35 hover:bg-brand-lime hover:text-brand-dark" href={social.url} target="_blank" rel="noreferrer"><Share2 className="h-4 w-4" /></a>)}</div></div>
      <div><h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Company</h4><ul className="space-y-2.5 text-sm"><li><Link href="/" className="hover:text-brand-lime">Home</Link></li><li><Link href="/services" className="hover:text-brand-lime">Services</Link></li><li><Link href="/about" className="hover:text-brand-lime">About</Link></li><li><Link href="/team" className="hover:text-brand-lime">Team</Link></li><li><Link href="/how-we-clean" className="hover:text-brand-lime">How we clean</Link></li><li><Link href="/equipment" className="hover:text-brand-lime">Equipment</Link></li><li><Link href="/before-after" className="hover:text-brand-lime">Before & after</Link></li><li><Link href="/reviews" className="hover:text-brand-lime">Reviews</Link></li><li><Link href="/service-areas" className="hover:text-brand-lime">Service areas</Link></li><li><Link href="/faq" className="hover:text-brand-lime">FAQ</Link></li><li><Link href="/careers" className="hover:text-brand-lime">Careers</Link></li><li><Link href="/resources" className="hover:text-brand-lime">Resources</Link></li><li><Link href="/contact" className="hover:text-brand-lime">Contact</Link></li><li><Link href="/privacy-policy" className="hover:text-brand-lime">Privacy</Link></li><li><Link href="/terms" className="hover:text-brand-lime">Terms</Link></li></ul></div>
      <div><h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Services</h4><ul className="space-y-2.5 text-sm">{services.slice(0, 6).map((service) => <li key={service._id}><Link href={`/services/${service.slug || service._id}`} className="hover:text-brand-lime">{service.name}</Link></li>)}{!services.length ? <><li>Residential cleaning</li><li>Commercial cleaning</li><li>Deep cleaning</li></> : null}</ul></div>
      <div><h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Get in touch</h4><ul className="space-y-3 text-sm"><li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-brand-lime" /><a href={phoneHref} className="hover:text-white">{phone}</a></li>{content?.contact.email ? <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-brand-lime" /><a href={`mailto:${content.contact.email}`} className="truncate hover:text-white">{content.contact.email}</a></li> : null}<li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" /><span>{content?.contact.serviceAreaSummary || "Serving supported local service areas"}</span></li><li className="text-white/42">{content?.contact.hours || "Online booking available"}</li></ul></div>
    </div>
    <div className="border-y border-white/8 bg-white/[0.035]"><div className="container-page flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-lime">Contact</div><a href={phoneHref} className="mt-1 block text-2xl font-extrabold tracking-[-0.04em] text-white transition hover:text-brand-lime sm:text-3xl">{phone}</a></div><Link href="/book" className="btn-primary w-fit">Book your cleaning</Link></div></div>
    <div className="container-page flex flex-col gap-2 py-5 text-[11px] text-white/40 md:flex-row md:justify-between"><span>© 2026 {content?.branding.siteName || "BIO Cleaning LLC"}. All rights reserved.</span><span>{content?.branding.tagline || "Back In Order"} — restoring spaces, restoring peace of mind.</span></div>
  </footer>;
}
