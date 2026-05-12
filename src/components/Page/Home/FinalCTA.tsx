import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

function FinalCTA() {
  return (
    <section className="pb-24">
      <div className="container-page">
        <div className="rounded-[2.5rem] bg-brand-dark text-white p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-brand-lime/15 blur-2xl" />
          <div className="relative">
            <span className="pill bg-brand-lime text-brand-dark">
              Limited offer
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display">
              Ready to bring it back in order?
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Get <b className="text-brand-lime">20% off</b> your first cleaning
              when you book this week.
            </p>
          </div>
          <div className="relative md:text-right space-y-3">
            <Link
              href="/book"
              className="bg-brand-lime text-brand-dark font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:scale-105 transition"
            >
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <a
                href="tel:+18002462532"
                className="inline-flex items-center gap-2 text-white/80 hover:text-brand-lime"
              >
                <Phone className="w-4 h-4" /> Or call (800) BIO-CLEAN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
