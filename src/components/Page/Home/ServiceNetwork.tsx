import { ArrowRight, Clock, MapPin, Navigation } from "lucide-react";
import Link from "next/link";

export default function ServiceNetwork() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="pill" data-reveal>
            — Coverage —
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl text-brand-dark font-display"
            data-reveal
          >
            Our service network
          </h2>
          <p
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
            data-reveal
          >
            Serving New York, New Jersey, and Greater Boston — with same-day
            availability in most ZIPs.
          </p>
        </div>
        <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-stretch" data-reveal>
        <div className="relative rounded-3xl overflow-hidden border border-border shadow-xl bg-white min-h-[420px]">
          <iframe
            title="Service area map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.5%2C40.5%2C-71.0%2C42.5&layer=mapnik"
            className="w-full h-[420px]"
            loading="lazy"
          />
          <div className="absolute top-6 left-6 bg-white rounded-2xl p-4 shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 text-brand-green text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> BIO HQ
            </div>
            <div className="font-display text-lg text-brand-dark mt-1">
              Brooklyn, NY
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Mon–Sat · Same-day booking
            </div>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-green"
            >
              Get directions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-brand-dark text-white p-7 flex flex-col justify-between">
          <div>
            <span className="pill bg-brand-lime text-brand-dark">
              <Navigation className="w-3.5 h-3.5" /> Active Routes
            </span>
            <h3 className="font-display text-3xl mt-5">
              Same-day availability in most service zones
            </h3>
            <p className="text-white/65 mt-3 text-sm">
              Our teams are routed by neighborhood, job type, and time window so
              arrival feels smooth.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {["New York", "New Jersey", "Greater Boston"].map((zone) => (
              <div
                key={zone}
                className="rounded-2xl bg-white/8 p-4 flex items-center justify-between"
              >
                <span>{zone}</span>
                <span className="text-brand-lime text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Open
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
