import fullService2 from "@/src/assets/full-services-2.jpeg";
import fullService from "@/src/assets/full-services.jpeg";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FullService() {
  const points = [
    "Residential & commercial cleaning crews on call",
    "Eco-certified, pet- and child-safe products only",
    "Transparent flat pricing — no hidden fees",
    "100% satisfaction guarantee or we re-clean free",
  ];
  return (
    <section className="py-24">
      <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-4" data-reveal-group>
          <img
            src={fullService}
            alt="Cleaning team at work"
            loading="lazy"
            className="rounded-3xl object-cover w-full h-72 md:h-96"
          />
          <img
            src={fullService2}
            alt="Professional cleaner"
            loading="lazy"
            className="rounded-3xl object-cover w-full h-72 md:h-96 mt-10"
          />
        </div>
        <div data-reveal>
          <span className="pill">
            <Sparkles className="w-3.5 h-3.5" /> Full Service
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl text-brand-dark font-display">
            Full-Service Cleaning Across New York, New Jersey & Boston
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            From routine tidy-ups to full deep cleans and post-construction
            restoration — our trained teams handle every space with the same
            level of care and detail.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 rounded-full bg-brand-lime grid place-items-center shrink-0">
                  <Check className="w-3 h-3 text-brand-dark" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="bg-brand-lime text-brand-dark font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:scale-[1.02] transition"
            >
              Schedule a Cleaning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn-secondary">
              All Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
