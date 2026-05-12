"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Sparkles } from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dr6linfry/image/upload/q_auto/f_auto/v1778514293/logo_fekjaa.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/book", label: "Book" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 px-3 pt-3 pb-2 transition-all duration-500`}
    >
      <div
        className={`container-page rounded-full transition-all duration-500 flex items-center justify-between pl-3 pr-3 py-2 border
        ${
          scrolled
            ? "bg-brand-dark/95 shadow-2xl border-white/10 scale-[0.98]"
            : "bg-brand-dark/80 border-white/10"
        } 
        backdrop-blur-2xl animate-[fade-in_.5s_ease-out]`}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-brand-lime/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={LOGO_URL}
              alt="BIO Cleaning LLC logo"
              width={42}
              height={42}
              className="relative w-10 h-10 rounded-full object-cover ring-2 ring-brand-lime/40 group-hover:ring-brand-lime group-hover:rotate-[12deg] transition-all duration-500"
            />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-display text-base font-bold text-white">
              BIO Cleaning
            </div>
            <div className="text-[9px] tracking-[0.25em] text-brand-lime uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Back In Order
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-1.5 py-1.5 border border-white/10">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="relative text-sm font-medium text-white/75 hover:text-white px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-white/10"
              activeProps={{
                className:
                  "!text-brand-dark !bg-brand-lime hover:!bg-brand-lime hover:!text-brand-dark font-bold shadow-lg shadow-brand-lime/30 scale-105",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+18002462532"
            className="group relative inline-flex items-center gap-2 bg-brand-lime text-brand-dark font-bold px-5 py-2.5 rounded-full text-sm overflow-hidden transition-transform hover:scale-105 shadow-lg shadow-brand-lime/30"
          >
            <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Phone className="w-4 h-4 relative animate-[pulse_2s_ease-in-out_infinite]" />
            <span className="relative">(800) BIO-CLEAN</span>
          </a>
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 container-page bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-2 animate-[fade-in_.3s_ease-out]">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="py-2 px-4 text-base font-medium text-white/90 rounded-full hover:bg-white/10"
              activeProps={{
                className: "!text-brand-dark !bg-brand-lime font-bold",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="tel:+18002462532"
            className="mt-2 inline-flex items-center justify-center gap-2 bg-brand-lime text-brand-dark font-bold px-5 py-3 rounded-full"
          >
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      )}
    </header>
  );
}
