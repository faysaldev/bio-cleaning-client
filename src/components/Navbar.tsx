"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, Sparkles, X } from "lucide-react";
import { LOGO_URL } from "./Footer";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`container-page flex min-h-16 items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-200 ${
          scrolled
            ? "border-white/10 bg-brand-dark/96 shadow-[0_18px_45px_-30px_rgba(7,38,22,.72)] backdrop-blur-xl"
            : "border-white/10 bg-brand-dark/88 backdrop-blur-lg"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4">
          <Image
            src={LOGO_URL}
            alt="BIO Cleaning LLC logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/16"
          />
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-extrabold tracking-[-0.025em] text-white">BIO Cleaning</div>
            <div className="mt-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-lime">
              <Sparkles className="h-2.5 w-2.5" /> Back In Order
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                href={link.to}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/62 hover:bg-white/6 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="tel:+18002462532" className="btn-ghost-light min-h-10 px-3 text-xs">
            <Phone className="h-3.5 w-3.5" /> Call us
          </a>
          <Link href="/book" className="btn-primary min-h-10 px-4 text-xs">Book cleaning</Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/8 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-navigation" className="container-page mt-2 overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/98 p-2 shadow-elevated backdrop-blur-xl md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 text-sm font-bold ${active ? "bg-brand-lime text-brand-dark" : "text-white/78 hover:bg-white/8 hover:text-white"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/8 pt-2">
            <a href="tel:+18002462532" className="btn-ghost-light"><Phone className="h-4 w-4" /> Call us</a>
            <Link href="/book" className="btn-primary">Book now</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
