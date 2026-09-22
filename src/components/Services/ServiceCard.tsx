import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { CleaningService } from "../../redux/features/services/types";

interface ServiceCardProps {
  service: CleaningService;
  onPreview: (service: CleaningService) => void;
}

export function ServiceCard({ service, onPreview }: ServiceCardProps) {
  return (
    <div className="group rounded-3xl border border-brand-green/12 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-lime/50 hover:shadow-xl flex flex-col justify-between">
      <div>
        <div className="aspect-[16/9] overflow-hidden relative">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C3629]/80 via-[#0C3629]/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

          {/* Floating Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
            <div className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-brand-dark shadow-sm backdrop-blur-md">
              from ${service.basePrice}
            </div>
            {service.tags?.[0] && (
              <div className="inline-flex items-center rounded-full bg-brand-lime px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-dark shadow-sm">
                {service.tags[0]}
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <div className="w-10 h-10 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center shadow-lg font-black">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-2xl font-extrabold text-brand-dark group-hover:text-brand-green transition-colors">
              {service.name}
            </h3>
            <span className="text-[11px] font-bold text-brand-green bg-[#F4FAF5] border border-brand-green/15 px-2.5 py-1 rounded-full">
              {service.duration || "2–4h"}
            </span>
          </div>

          <p className="mt-3 text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          <ul className="mt-5 space-y-2.5">
            {service.includes?.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-foreground/80 font-medium">
                <Check className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
            {service.includes?.length > 3 && (
              <li className="text-[10px] text-brand-green font-extrabold uppercase tracking-wider pl-5">
                + {service.includes.length - 3} more included tasks
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-brand-green/8 flex items-center justify-between mt-auto">
        <button
          onClick={() => onPreview(service)}
          className="text-xs font-extrabold text-brand-dark hover:text-brand-green uppercase tracking-wider transition-colors"
        >
          Quick View
        </button>
        <div className="flex items-center gap-2 pt-4">
          <Link
            href={`/services/${service.slug || service._id}`}
            className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-white px-3.5 py-2 text-xs font-bold text-brand-dark hover:border-brand-green hover:text-brand-green transition"
          >
            Details
          </Link>
          <Link
            href={`/book?serviceId=${encodeURIComponent(service._id)}`}
            className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-extrabold shadow-sm"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
