import Image from "next/image";
import { X, Check, Clock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CleaningService } from "../../redux/features/services/types";

interface ServiceModalProps {
  service: CleaningService | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-elevated animate-in zoom-in-95 duration-200 md:flex-row" role="dialog" aria-modal="true" aria-label={`${service.name} service details`}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-brand-dark/45 text-white backdrop-blur-md transition hover:bg-white hover:text-brand-dark" aria-label="Close service details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full md:w-2/5 min-h-[300px] md:min-h-full">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60 md:hidden" />
          <div className="absolute bottom-6 left-6 text-white md:hidden">
            <h2 className="text-3xl font-display font-bold">{service.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-brand-lime">
              <span className="font-bold">from ${service.basePrice}</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="hidden md:block">
            <span className="pill bg-brand-cream text-brand-green mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Premium Cleaning
            </span>
            <h2 className="text-4xl font-display font-bold text-brand-dark">
              {service.name}
            </h2>
            <div className="flex items-center gap-6 mt-4 pb-6 border-b border-brand-cream">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-cream grid place-items-center">
                  <Clock className="w-4 h-4 text-brand-green" />
                </div>
                <span className="text-sm font-bold text-brand-dark">{service.duration || "2-4h"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-cream grid place-items-center">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                </div>
                <span className="text-sm font-bold text-brand-dark">Insured</span>
              </div>
              <div className="text-2xl font-display font-bold text-brand-green ml-auto">
                ${service.basePrice}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
                Description
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">
                What&apos;s Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.includes?.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-brand-cream bg-brand-cream/50 p-3 transition-colors hover:bg-brand-cream">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-green/10 mt-0.5">
                      <Check className="w-3 h-3 text-brand-green" />
                    </div>
                    <span className="text-sm font-medium text-brand-dark">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {service.tags && service.tags.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
                  Best For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="status-badge border-brand-dark/10 bg-brand-dark/5 text-brand-dark">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <Link 
              href="/book" 
              className="btn-primary flex-1 py-4 text-lg shadow-xl shadow-brand-green/20"
              onClick={onClose}
            >
              Book This Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
