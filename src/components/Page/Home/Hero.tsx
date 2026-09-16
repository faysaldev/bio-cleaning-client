import heroInterior from "@/src/assets/home-interior.jpeg";
import QuoteBar from "@/src/components/Page/Home/QuoteBar";
import type { WebsiteSnapshot } from "@/src/redux/features/website/types";
import { ArrowDown, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero({ content }: { content?: WebsiteSnapshot }) {
  const hero = content?.hero;
  const media = hero?.mediaUrl || heroInterior;
  const primary = hero?.primaryCta || { label: "Book cleaning", url: "/book" };
  const secondary = hero?.secondaryCta || { label: "Get a quote", url: "/quote" };
  const trustItems = hero?.trustItems?.length ? hero.trustItems : ["5,100+ happy clients", "4.9 average rating", "Fully insured", "Same-day booking"];

  return (
    <section data-cinema-hero className="relative px-3 pt-4 sm:px-4">
      <div className="relative flex min-h-[740px] items-center justify-center overflow-hidden rounded-2xl border border-brand-dark/10 shadow-[0_34px_90px_-54px_rgba(9,48,28,.75)] lg:min-h-[calc(100vh-94px)]">
        <div data-cinema-hero-image className="absolute -inset-y-[6%] inset-x-0">
          <Image src={media} alt={hero?.mediaAlt || "Luxury home interior after professional cleaning"} priority fill sizes="100vw" className="object-cover" unoptimized={typeof media === "string" && media.startsWith("http")} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,45,28,.76)_0%,rgba(14,59,37,.48)_42%,rgba(8,35,22,.9)_100%)]" />
        <div className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_50%_42%,rgba(218,247,99,.22),transparent_31%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-brand-dark/30 to-transparent" />

        <div data-cinema-hero-content className="container-page relative z-10 py-24 text-center text-white sm:py-28">
          <div data-cinema-intro className="editorial-kicker mx-auto border-white/14 bg-white/8 text-brand-lime backdrop-blur-sm">{hero?.eyebrow || "Eco · Trusted · Punctual"}</div>
          <h1 data-cinema-intro className="mx-auto mt-6 max-w-6xl whitespace-pre-line text-5xl font-extrabold leading-[0.94] tracking-[-0.06em] md:text-7xl lg:text-[6.3rem]">{hero?.title || "A cleaner space,\nrestored with intention."}</h1>
          <p data-cinema-intro className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/74 sm:text-lg">{hero?.description || "Professional home and office cleaning with trained teams, eco-conscious products, precise scheduling, and a quality check before we leave."}</p>

          <div data-cinema-intro><QuoteBar /></div>
          <div data-cinema-intro className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={primary.url || "/book"} className="btn-primary min-h-11 px-5">{primary.label || "Book cleaning"}</Link>
            <Link href={secondary.url || "/quote"} className="btn-ghost-light min-h-11 px-5">{secondary.label || "Get a quote"}</Link>
          </div>
          <div data-cinema-intro className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-semibold text-white/66 sm:text-sm">
            {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand-lime" /> {item}</span>)}
          </div>
        </div>

        <a href="#story" aria-label="Explore how BIO Cleaning works" className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/56 transition-colors hover:text-brand-lime md:flex">Explore the process <ArrowDown className="h-3.5 w-3.5" /></a>
      </div>
    </section>
  );
}
