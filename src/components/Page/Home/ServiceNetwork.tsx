import { ArrowRight, MapPin } from "lucide-react";
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
        <div
          className="relative rounded-3xl overflow-hidden border border-border shadow-xl bg-white"
          data-reveal
        >
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
      </div>
    </section>
  );
}
