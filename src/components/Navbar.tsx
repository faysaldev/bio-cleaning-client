"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, Sparkles, X } from "lucide-react";
import type { WebsitePublicPayload } from "@/src/redux/features/website/types";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import { LOGO_URL } from "./Footer";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/how-we-clean", label: "How We Clean" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
  { to: "/resources", label: "Resources" },
  { to: "/quote", label: "Get Quote" },
];

export function Navbar({ website }: { website?: WebsitePublicPayload }) {
  const { data: fallbackWebsite } = useGetPublicWebsiteQuery(undefined, { skip: Boolean(website) });
  const resolvedWebsite = website || fallbackWebsite?.data;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const content = resolvedWebsite?.content;
  const phone = content?.contact.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const logo = content?.branding.logoUrl || LOGO_URL;

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => setOpen(false), [pathname]);

  return <>
    {content?.announcement.enabled ? <div className="relative z-[60] bg-brand-lime px-4 py-2 text-center text-xs font-bold text-brand-dark">{content.announcement.text}{content.announcement.linkUrl && content.announcement.linkLabel ? <Link href={content.announcement.linkUrl} className="ml-2 underline underline-offset-2">{content.announcement.linkLabel}</Link> : null}</div> : null}
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className={`container-page flex min-h-16 items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-200 ${scrolled ? "border-white/10 bg-brand-dark/96 shadow-[0_18px_45px_-30px_rgba(7,38,22,.72)] backdrop-blur-xl" : "border-white/10 bg-brand-dark/88 backdrop-blur-lg"}`}>
        <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4"><Image src={logo} alt={`${content?.branding.siteName || "BIO Cleaning"} logo`} width={40} height={40} unoptimized={logo.startsWith("http")} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/16" /><div className="hidden leading-tight sm:block"><div className="text-sm font-extrabold tracking-[-0.025em] text-white">{content?.branding.siteName || "BIO Cleaning"}</div><div className="mt-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-lime"><Sparkles className="h-2.5 w-2.5" /> {content?.branding.tagline || "Back In Order"}</div></div></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">{links.map((link) => { const active = pathname === link.to; return <Link key={link.to} href={link.to} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${active ? "bg-white/10 text-white" : "text-white/62 hover:bg-white/6 hover:text-white"}`}>{link.label}</Link>; })}</nav>
        <div className="hidden items-center gap-2 xl:flex"><Link href="/portal/login" className="btn-ghost-light hidden min-h-10 px-3 text-xs 2xl:inline-flex">My account</Link><a href={phoneHref} className="btn-ghost-light hidden min-h-10 px-3 text-xs 2xl:inline-flex"><Phone className="h-3.5 w-3.5" /> Call us</a><Link href="/book" className="btn-primary min-h-10 px-4 text-xs">Book cleaning</Link></div>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/8 xl:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open ? <div id="mobile-navigation" className="container-page mt-2 overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/98 p-2 shadow-elevated backdrop-blur-xl xl:hidden"><nav className="grid gap-1" aria-label="Mobile navigation">{links.map((link) => { const active = pathname === link.to; return <Link key={link.to} href={link.to} aria-current={active ? "page" : undefined} className={`rounded-xl px-3 py-3 text-sm font-bold ${active ? "bg-brand-lime text-brand-dark" : "text-white/78 hover:bg-white/8 hover:text-white"}`}>{link.label}</Link>; })}</nav><div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/8 pt-2"><Link href="/portal/login" className="btn-ghost-light">My account</Link><a href={phoneHref} className="btn-ghost-light"><Phone className="h-4 w-4" /> Call us</a><Link href="/book" className="btn-primary col-span-2">Book now</Link></div></div> : null}
    </header>
  </>;
}
