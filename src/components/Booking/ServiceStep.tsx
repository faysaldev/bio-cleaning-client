import { Clock3, Loader2, Sparkles, Users } from "lucide-react";
import type { CleaningServiceShortDetails } from "../../redux/features/services/types";

interface ServiceStepProps {
  services: CleaningServiceShortDetails[];
  isLoading: boolean;
  error: unknown;
  selectedServiceId: string;
  onSelect: (serviceId: string) => void;
}

export function ServiceStep({ services, isLoading, error, selectedServiceId, onSelect }: ServiceStepProps) {
  return (
    <div>
      <StepHeading eyebrow="Step 1" title="Choose a cleaning service" description="Every option below is a real bookable service from the live catalog." />
      {isLoading ? (
        <div className="flex h-44 items-center justify-center rounded-xl border border-border bg-brand-cream/45" role="status"><Loader2 className="h-6 w-6 animate-spin text-brand-green" /></div>
      ) : error ? (
        <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">Services could not be loaded. Please refresh and try again.</div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-brand-cream/45 p-8 text-center"><Sparkles className="mx-auto h-6 w-6 text-brand-green" /><p className="mt-3 text-sm font-bold text-brand-dark">No services are currently bookable.</p></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const selected = selectedServiceId === service._id;
            return (
              <button key={service._id} type="button" onClick={() => onSelect(service._id)} className={`group rounded-2xl border p-4 text-left transition ${selected ? "border-brand-green bg-brand-green/[0.055] shadow-card" : "border-border bg-white hover:border-brand-green/35 hover:bg-brand-cream/35"}`} aria-pressed={selected}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0"><h3 className="text-base font-extrabold text-brand-dark">{service.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{service.description}</p></div>
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-brand-green bg-brand-green" : "border-border bg-white"}`}>{selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-muted-foreground">
                  <span className="rounded-lg bg-brand-cream px-2.5 py-1.5 text-brand-dark">From ${service.basePrice}</span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5"><Clock3 className="h-3 w-3" /> {service.scheduling?.durationMinutes ? `${service.scheduling.durationMinutes} min` : service.duration || "Custom"}</span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5"><Users className="h-3 w-3" /> {service.scheduling?.requiredStaff || 1}+ cleaner</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StepHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">{eyebrow}</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.035em] text-brand-dark">{title}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>;
}
