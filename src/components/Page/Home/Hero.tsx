import heroInterior from "@/src/assets/home-interior.jpeg";
import QuoteBar from "@/src/components/Page/Home/QuoteBar";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative px-3 pt-4 sm:px-4">
      <div className="relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-2xl border border-brand-dark/10 shadow-[0_34px_90px_-54px_rgba(9,48,28,.75)]">
        <Image src={heroInterior} alt="Luxury home interior" priority sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,63,40,.77)_0%,rgba(18,66,43,.54)_46%,rgba(10,43,27,.88)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-brand-dark/28 to-transparent" />

        <div className="container-page relative z-10 py-24 text-center text-white sm:py-28">
          <div className="editorial-kicker mx-auto border-white/14 bg-white/8 text-brand-lime backdrop-blur-sm" data-reveal>
            Eco · Trusted · Punctual
          </div>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] md:text-7xl lg:text-[5.4rem]" data-reveal>
            Premium cleaning that puts your space back in order.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg" data-reveal>
            Professional home and office cleaning across New York and beyond, delivered with eco-conscious products, trained teams, and a satisfaction guarantee.
          </p>

          <QuoteBar />

          <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-semibold text-white/66 sm:text-sm">
            {["5,100+ happy clients", "4.9 Google rating", "Fully insured", "Same-day booking"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-lime" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
