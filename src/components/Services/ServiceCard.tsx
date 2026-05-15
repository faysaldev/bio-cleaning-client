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
    <div className="group card-primary overflow-hidden p-0 border-none bg-white hover:shadow-2xl transition-all duration-500">
      <div className="aspect-[16/9] overflow-hidden relative">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Floating Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <div className="pill bg-white/95 text-brand-dark font-bold shadow-lg backdrop-blur-sm">
            from ${service.basePrice}
          </div>
          {service.tags?.[0] && (
            <div className="pill bg-brand-green text-white text-[10px] uppercase tracking-widest font-bold">
              {service.tags[0]}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-lime text-brand-dark grid place-items-center shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-2xl font-display font-bold text-brand-dark group-hover:text-brand-green transition-colors">
            {service.name}
          </h3>
          <span className="text-xs font-semibold text-muted-foreground bg-brand-cream px-2 py-1 rounded-lg">
            {service.duration || "2-4h"}
          </span>
        </div>
        
        <p className="mt-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        <ul className="mt-5 space-y-2">
          {service.includes?.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-foreground/70 font-medium">
              <Check className="w-3.5 h-3.5 text-brand-green shrink-0" />
              <span className="truncate">{item}</span>
            </li>
          ))}
          {service.includes?.length > 3 && (
            <li className="text-[10px] text-brand-green font-bold uppercase tracking-wider pl-5">
              + {service.includes.length - 3} more features
            </li>
          )}
        </ul>

        <div className="mt-6 pt-6 border-t border-brand-cream flex items-center justify-between">
          <button
            onClick={() => onPreview(service)}
            className="text-xs font-bold text-brand-dark hover:text-brand-green uppercase tracking-widest transition-colors"
          >
            Quick View
          </button>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-green transition-colors shadow-lg shadow-brand-dark/10"
          >
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
