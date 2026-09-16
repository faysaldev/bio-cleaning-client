import type { CleaningService } from "@/src/redux/features/services/types";
import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServicesGallery({ services = [], section }: { services?: CleaningService[]; section?: WebsiteHomepageSection }) {
  const visible = services.slice(0, 5);
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="mb-12 text-center">
          <span className="pill" data-reveal>— {section?.eyebrow || "Services"} —</span>
          <h2 className="mt-3 text-4xl font-display text-brand-dark md:text-5xl" data-reveal>{section?.title || "Our range of cleaning services"}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground" data-reveal>{section?.subtitle || "One trusted team for every type of space — handled with the same eco-friendly care."}</p>
        </div>
        {visible.length ? <div className="grid gap-4 md:grid-cols-6" data-reveal-group>
          {visible.map((service, i) => (
            <Link href="/services" key={service._id} data-cinema-mask className={`group relative block min-h-[280px] overflow-hidden rounded-2xl bg-brand-dark ${i === 0 ? "md:col-span-2 md:row-span-2 md:min-h-[580px]" : "md:col-span-2"}`}>
              <Image src={service.image} alt={service.name} fill unoptimized={service.image.startsWith("http")} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/35 to-transparent" />
              <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-brand-lime/95"><Sparkles className="h-5 w-5 text-brand-dark" /></div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-[10px] uppercase tracking-wider text-brand-lime">From ${service.basePrice.toFixed(0)} · {service.duration || "Professional service"}</div>
                <div className={`mt-0.5 font-display ${i === 0 ? "text-3xl" : "text-xl"}`}>{service.name}</div>
                <div className="mt-3 inline-flex translate-y-2 items-center gap-2 text-xs font-bold text-brand-lime opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">Explore service</div>
              </div>
            </Link>
          ))}
        </div> : <div className="surface-subtle p-10 text-center text-sm text-muted-foreground">Services will appear here when they are published from the Services workspace.</div>}
      </div>
    </section>
  );
}
