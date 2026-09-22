"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Compass, Menu, Phone, Sparkles, X } from "lucide-react";
import type { WebsitePublicPayload } from "@/src/redux/features/website/types";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import { LOGO_URL } from "./Footer";
import { PageExplorerModal } from "./PageExplorerModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/how-we-clean", label: "How We Clean" },
  { to: "/reviews", label: "Reviews" },
  { to: "/service-areas", label: "Areas" },
  { to: "/contact", label: "Contact" },
  { to: "/quote", label: "Instant Quote" },
];

export function Navbar({ website }: { website?: WebsitePublicPayload }) {
  const { data: fallbackWebsite } = useGetPublicWebsiteQuery(undefined, { skip: Boolean(website) });
  const resolvedWebsite = website || fallbackWebsite?.data;
  const [open, setOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const content = resolvedWebsite?.content;
  const phone = content?.contact.phone || "+1 (800) BIO-CLEAN";
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  const logo = content?.branding.logoUrl || LOGO_URL;

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => setOpen(false), [pathname]);

  return <>
    {/* <PageExplorerModal isOpen={explorerOpen} onClose={() => setExplorerOpen(false)} /> */}
    {content?.announcement.enabled ? <div className="relative z-[60] bg-brand-lime px-4 py-2 text-center text-xs font-bold text-brand-dark">{content.announcement.text}{content.announcement.linkUrl && content.announcement.linkLabel ? <Link href={content.announcement.linkUrl} className="ml-2 underline underline-offset-2">{content.announcement.linkLabel}</Link> : null}</div> : null}
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className={`container-page flex min-h-16 items-center justify-between rounded-full border px-4 py-2 transition-all duration-200 ${scrolled ? "border-white/10 bg-brand-dark/96 shadow-[0_18px_45px_-30px_rgba(7,38,22,.72)] backdrop-blur-xl" : "border-white/10 bg-brand-dark/92 backdrop-blur-lg"}`}>
        <Link href="/" className="flex items-center gap-2.5 rounded-full focus-visible:outline-offset-4">
          <Image src={logo} alt={`${content?.branding.siteName || "BIO Cleaning"} logo`} width={38} height={38} unoptimized={logo.startsWith("http")} className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-lime/30" />
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-extrabold tracking-[-0.025em] text-white">{content?.branding.siteName || "Bio Cleaning"}</div>
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-lime">
              <Sparkles className="h-2.5 w-2.5" /> {content?.branding.tagline || "Back In Order"}
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.to;
            return <Link key={link.to} href={link.to} aria-current={active ? "page" : undefined} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${active ? "bg-white/14 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"}`}>{link.label}</Link>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          {/* Quick Page Explorer Toggle Button */}
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-brand-lime/10 px-3 py-1.5 text-xs font-bold text-brand-lime transition hover:bg-brand-lime hover:text-brand-dark"
            title="Open Directory of All 68 Application Pages"
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Pages</span>
            <span className="rounded-full bg-brand-lime/20 px-1.5 py-0.2 text-[10px] font-black">68</span>
          </button>

          <a href={phoneHref} className="btn-ghost-light hidden min-h-9 px-3.5 text-xs 2xl:inline-flex">
            <Phone className="h-3.5 w-3.5 text-brand-lime" /> Call us
          </a>
          <Link href="/book" className="btn-primary min-h-9 px-4 text-xs font-extrabold">
            Get a Free Quote
          </Link>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/8 xl:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div id="mobile-navigation" className="container-page mt-2 overflow-hidden rounded-3xl border border-white/10 bg-brand-dark/98 p-4 shadow-elevated backdrop-blur-xl xl:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map((link) => {
              const active = pathname === link.to;
              return <Link key={link.to} href={link.to} aria-current={active ? "page" : undefined} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${active ? "bg-brand-lime text-brand-dark" : "text-white/80 hover:bg-white/8 hover:text-white"}`}>{link.label}</Link>;
            })}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/8 pt-3">
            <button type="button" onClick={() => { setOpen(false); setExplorerOpen(true); }} className="btn-ghost-light col-span-2">
              <Compass className="h-4 w-4 text-brand-lime" /> View All 68 Pages Directory
            </button>
            <Link href="/portal/login" className="btn-ghost-light">Client Portal</Link>
            <a href={phoneHref} className="btn-ghost-light"><Phone className="h-4 w-4" /> Call us</a>
            <Link href="/book" className="btn-primary col-span-2">Book Cleaning</Link>
          </div>
        </div>
      ) : null}
    </header>
  </>;
}
