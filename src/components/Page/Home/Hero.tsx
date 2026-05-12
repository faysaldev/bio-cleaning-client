import heroInterior from "@/src/assets/home-interior.jpeg";
import QuoteBar from "@/src/components/Page/Home/QuoteBar";
import { BadgeCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-3 pt-4">
      <div className="relative rounded-[2rem] overflow-hidden min-h-[640px] flex items-center justify-center">
        <img
          src={heroInterior}
          alt="Luxury home interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/55 to-brand-dark/85" />

        <div className="relative z-10 container-page text-center text-white py-24">
          <div
            className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-brand-lime mb-6"
            data-reveal
          >
            <span className="w-8 h-px bg-brand-lime" /> Eco · Trusted · Punctual{" "}
            <span className="w-8 h-px bg-brand-lime" />
          </div>
          <h1
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.05] max-w-5xl mx-auto"
            data-reveal
          >
            Premium Cleaning Services
            <br /> in <span className="italic text-brand-lime">New York</span> &
            Beyond
          </h1>
          <p
            className="mt-6 text-lg text-white/80 max-w-2xl mx-auto"
            data-reveal
          >
            Bringing your home and office back in order with eco-friendly
            products, trained professionals, and a satisfaction guarantee.
          </p>

          {/* Quote bar with real selects */}
          <QuoteBar />

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            {[
              "5,100+ Happy Clients",
              "4.9 ★ Google Rating",
              "Fully Insured",
              "Same-Day Booking",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-brand-lime" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
