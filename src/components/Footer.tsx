import { Camera, Mail, MapPin, MessagesSquare, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const LOGO_URL =
  "https://res.cloudinary.com/dr6linfry/image/upload/q_auto/f_auto/v1778514293/logo_fekjaa.jpg";

const socialLinks = [
  { href: "#", label: "Messages", icon: MessagesSquare },
  { href: "#", label: "Instagram", icon: Camera },
  { href: "#", label: "Share", icon: Share2 },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-dark text-white/68">
      <div className="container-page relative z-10 grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src={LOGO_URL} alt="BIO Cleaning logo" width={44} height={44} className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/16" />
            <div>
              <div className="text-base font-extrabold tracking-[-0.025em] text-white">BIO Cleaning</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-lime">Back In Order</div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6">Eco-friendly, professional cleaning that restores order to every space.</p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} aria-label={label} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-brand-lime/35 hover:bg-brand-lime hover:text-brand-dark" href={href}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-brand-lime">Home</Link></li>
            <li><Link href="/services" className="hover:text-brand-lime">Services</Link></li>
            <li><Link href="/about" className="hover:text-brand-lime">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-lime">Contact</Link></li>
            <li><Link href="/book" className="font-bold text-brand-lime hover:text-white">Book now</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li>Residential cleaning</li>
            <li>Commercial cleaning</li>
            <li>Deep cleaning</li>
            <li>Move-in / move-out</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-brand-lime" /><a href="tel:+18002462532" className="hover:text-white">+1 (800) BIO-CLEAN</a></li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-brand-lime" /><a href="mailto:hello@biocleaningllc.com" className="truncate hover:text-white">hello@biocleaningllc.com</a></li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" /><span>Serving New York, New Jersey & Boston</span></li>
            <li className="text-white/42">Mon–Fri 7am–8pm · Sat 8am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-y border-white/8 bg-white/[0.035]">
        <div className="container-page flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-lime">Toll free</div>
            <a href="tel:+18002462532" className="mt-1 block text-2xl font-extrabold tracking-[-0.04em] text-white transition hover:text-brand-lime sm:text-3xl">(800) BIO-CLEAN</a>
          </div>
          <Link href="/book" className="btn-primary w-fit">Book your cleaning</Link>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 py-5 text-[11px] text-white/40 md:flex-row md:justify-between">
        <span>© 2026 BIO Cleaning LLC. All rights reserved.</span>
        <span>Back In Order — restoring spaces, restoring peace of mind.</span>
      </div>
    </footer>
  );
}
