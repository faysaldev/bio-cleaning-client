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
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-brand-dark transition-all grid place-items-center"
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
                  <div key={item} className="flex items-start gap-3 p-3 rounded-2xl bg-brand-cream/50 border border-brand-cream transition-colors hover:bg-brand-cream">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
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
                    <span key={tag} className="px-3 py-1 rounded-full bg-brand-dark/5 text-[10px] font-bold uppercase tracking-wider text-brand-dark">
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
