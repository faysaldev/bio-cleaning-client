import residential from "@/src/assets/service-residential.jpeg";
import commercial from "@/src/assets/service-commercial.jpeg";
import deepClean from "@/src/assets/service-deep.jpeg";
import { Building2, HomeIcon, Sparkles, Truck, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServicesGallery() {
  const services = [
    {
      img: residential,
      title: "Residential",
      subtitle: "Homes & Apartments",
      icon: HomeIcon,
    },
    {
      img: commercial,
      title: "Commercial",
      subtitle: "Offices & Retail",
      icon: Building2,
    },
    {
      img: deepClean,
      title: "Deep Cleaning",
      subtitle: "Top-to-bottom reset",
      icon: Sparkles,
    },
    {
      img: residential,
      title: "Move-In/Out",
      subtitle: "Get your deposit back",
      icon: Truck,
    },
    {
      img: commercial,
      title: "Post-Construction",
      subtitle: "Dust & debris removal",
      icon: Wrench,
    },
  ];
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="pill" data-reveal>
            — Services —
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl text-brand-dark font-display"
            data-reveal
          >
            Our range of cleaning services
          </h2>
          <p
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
            data-reveal
          >
            One trusted team for every type of space — handled with the same
            eco-friendly care.
          </p>
        </div>
        <div className="grid md:grid-cols-6 gap-4" data-reveal-group>
          {services.map((s, i) => (
            <Link
              href="/services"
              key={s.title}
              className={`group relative rounded-3xl overflow-hidden block min-h-[280px] ${
                i === 0 ? "md:col-span-2 md:row-span-2 md:min-h-[580px]" : "md:col-span-2"
              }`}
            >
              <Image
                src={s.img}
                alt={s.title}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/35 to-transparent" />
              <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-brand-lime/95 grid place-items-center">
                <s.icon className="w-5 h-5 text-brand-dark" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="text-[10px] uppercase tracking-wider text-brand-lime">
                  {s.subtitle}
                </div>
                <div className={`font-display mt-0.5 ${i === 0 ? "text-3xl" : "text-xl"}`}>
                  {s.title}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-brand-lime opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  Explore service
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
