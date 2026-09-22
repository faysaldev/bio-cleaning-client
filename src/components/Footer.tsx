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
  return (
    <footer className="relative mt-24 overflow-hidden bg-[#09281e] text-white/70">
      <div className="container-page relative z-10 grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand & Tagline */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={logo}
              alt={`${content?.branding.siteName || "BIO Cleaning"} logo`}
              width={44}
              height={44}
              unoptimized={logo.startsWith("http")}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-lime/40"
            />
            <div>
              <div className="text-lg font-extrabold tracking-[-0.025em] text-white">
                {content?.branding.siteName || "Bio Cleaning"}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-lime">
                {content?.branding.tagline || "Back In Order"}
              </div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            {content?.seo.defaultDescription || "Top-rated eco-friendly cleaning services tailored for homes, apartments, and commercial spaces."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(content?.socialLinks || []).map((social) => (
              <a
                key={`${social.platform}-${social.url}`}
                aria-label={social.label || social.platform}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/6 transition hover:border-brand-lime hover:bg-brand-lime hover:text-brand-dark"
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Company Navigation */}
        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-brand-lime transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-brand-lime transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-brand-lime transition-colors">About Us</Link></li>
            <li><Link href="/how-we-clean" className="hover:text-brand-lime transition-colors">How We Clean</Link></li>
            <li><Link href="/before-after" className="hover:text-brand-lime transition-colors">Before & After</Link></li>
            <li><Link href="/reviews" className="hover:text-brand-lime transition-colors">Customer Reviews</Link></li>
            <li><Link href="/service-areas" className="hover:text-brand-lime transition-colors">Service Areas</Link></li>
            <li><Link href="/faq" className="hover:text-brand-lime transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-brand-lime transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Col 3: Popular Services */}
        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white">Our Services</h4>
          <ul className="space-y-2.5 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service._id}>
                <Link href={`/services/${service.slug || service._id}`} className="hover:text-brand-lime transition-colors">
                  {service.name}
                </Link>
              </li>
            ))}
            {!services.length ? (
              <>
                <li><Link href="/services" className="hover:text-brand-lime">Residential House Cleaning</Link></li>
                <li><Link href="/services" className="hover:text-brand-lime">Deep Cleaning Service</Link></li>
                <li><Link href="/services" className="hover:text-brand-lime">Move-In / Move-Out Clean</Link></li>
                <li><Link href="/services" className="hover:text-brand-lime">Commercial Office Cleaning</Link></li>
                <li><Link href="/services" className="hover:text-brand-lime">Carpet & Upholstery Care</Link></li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Col 4: Get in Touch */}
        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white">Get In Touch</h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-lime" />
              <a href={phoneHref} className="font-bold text-white hover:text-brand-lime transition-colors">{phone}</a>
            </li>
            {content?.contact.email ? (
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-lime" />
                <a href={`mailto:${content.contact.email}`} className="truncate text-white/80 hover:text-white transition-colors">
                  {content.contact.email}
                </a>
              </li>
            ) : null}
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-lime" />
              <span className="text-white/80">{content?.contact.serviceAreaSummary || "Aurora, Arvada, Denver & surrounding areas"}</span>
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
              {content?.contact.hours || "Mon - Sat: 8:00 AM – 7:00 PM • Instant Online Booking 24/7"}
            </li>
          </ul>
        </div>
      </div>

      {/* Call to action contact banner */}
      <div className="border-y border-white/10 bg-white/[0.04]">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-lime">Ready for sparkling clean?</div>
            <a href={phoneHref} className="mt-1 block text-2xl font-extrabold tracking-tight text-white transition hover:text-brand-lime sm:text-3xl">
              {phone}
            </a>
          </div>
          <Link href="/book" className="btn-primary rounded-full px-7">
            Book Your Cleaning Today
          </Link>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {content?.branding.siteName || "BIO Cleaning LLC"}. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/cancellation-policy" className="hover:text-white">Cancellation</Link>
        </div>
      </div>
    </footer>
  );
}
