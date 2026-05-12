import {
  Mail,
  Phone,
  MapPin,
  Camera,
  MessagesSquare,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LOGO_URL =
  "https://res.cloudinary.com/dr6linfry/image/upload/q_auto/f_auto/v1778514293/logo_fekjaa.jpg";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white/80 mt-20 relative overflow-hidden">
      <div className="container-page py-16 grid gap-10 md:grid-cols-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={LOGO_URL}
              alt="BIO Cleaning logo"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-lime/40"
            />
            <div>
              <div className="font-display text-lg font-bold text-white">
                BIO Cleaning
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-brand-lime">
                Back In Order
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Eco-friendly, professional cleaning that restores order to every
            space.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-brand-lime hover:text-brand-dark transition"
              href="#"
            >
              <MessagesSquare className="w-4 h-4" />
            </a>
            <a
              className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-brand-lime hover:text-brand-dark transition"
              href="#"
            >
              <Camera className="w-4 h-4" />
            </a>
            <a
              className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-brand-lime hover:text-brand-dark transition"
              href="#"
            >
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-brand-lime">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-lime">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-lime">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-lime">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-brand-lime">
                Book Now
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
            Services
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Residential Cleaning</li>
            <li>Commercial Cleaning</li>
            <li>Deep Cleaning</li>
            <li>Move-In / Move-Out</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
            Get In Touch
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-lime" />
              <span>+1 (800) BIO-CLEAN</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-lime" />
              <span>hello@biocleaningllc.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-lime mt-0.5" />
              <span>Serving New York, New Jersey & Boston</span>
            </li>
            <li className="text-white/60">Mon–Fri 7am–8pm · Sat 8am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-y border-white/10 bg-white/5">
        <div className="container-page py-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-lime mb-2">
            Toll Free
          </div>
          <a
            href="tel:+18002462532"
            className="font-display text-4xl md:text-5xl font-bold text-white hover:text-brand-lime transition"
          >
            (800) BIO-CLEAN
          </a>
        </div>
      </div>

      <div className="container-page py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
        <span>© 2025 BIO Cleaning LLC. All rights reserved.</span>
        <span>Back In Order — restoring spaces, restoring peace of mind.</span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-0 right-0 text-center font-display font-bold text-[18vw] leading-none text-white/[0.03]"
      >
        BIO CLEAN
      </div>
    </footer>
  );
}
