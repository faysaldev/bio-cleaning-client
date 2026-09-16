import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="pb-24">
      <div className="container-page">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-2xl bg-brand-dark p-8 text-white shadow-elevated md:grid-cols-2 md:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-lime/10 to-transparent" />
          <div className="relative">
            <span className="editorial-kicker border-brand-lime/30 bg-brand-lime text-brand-dark">Limited offer</span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] md:text-5xl">Ready to bring it back in order?</h2>
            <p className="mt-4 text-base text-white/66 md:text-lg">Get <b className="text-brand-lime">20% off</b> your first cleaning when you book this week.</p>
          </div>
          <div className="relative space-y-3 md:text-right">
            <Link href="/book" className="btn-primary min-h-12 px-6">Book now <ArrowRight className="h-4 w-4" /></Link>
            <div>
              <a href="tel:+18002462532" className="inline-flex items-center gap-2 text-sm font-semibold text-white/64 hover:text-brand-lime">
                <Phone className="h-4 w-4" /> Or call (800) BIO-CLEAN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
