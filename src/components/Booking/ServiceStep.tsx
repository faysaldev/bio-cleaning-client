import { Loader2 } from "lucide-react";
import { CleaningServiceShortDetails } from "../../redux/features/services/types";

interface ServiceStepProps {
  services: CleaningServiceShortDetails[];
  isLoading: boolean;
  error: unknown;
  selectedServiceId: string;
  selectedSize: string;
  onUpdate: (data: Record<string, string>) => void;
}

export function ServiceStep({ services, isLoading, error, selectedServiceId, selectedSize, onUpdate }: ServiceStepProps) {
  const sizes = ["Studio", "1BR", "2BR", "3BR", "4BR+", "Office"];

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Step 1</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-dark">Select your service</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the cleaning package and property size that best match the job.</p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-brand-cream/45" role="status">
          <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
        </div>
      ) : error ? (
        <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">Failed to load services. Please refresh the page.</div>
      ) : services.length === 0 ? (
        <div className="feedback-panel text-muted-foreground">No bookable services are available right now.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const selected = selectedServiceId === service._id;
            return (
              <button
                key={service._id}
                type="button"
                aria-pressed={selected}
                onClick={() => onUpdate({ serviceId: service._id, service: service.name })}
                className={`rounded-xl border p-4 text-left transition ${selected ? "border-brand-green bg-brand-green/5 shadow-sm" : "border-border bg-white hover:border-brand-green/40 hover:bg-brand-cream/30"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-brand-dark">{service.name}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{service.description}</div>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-brand-green">${service.basePrice}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="property-size" className="field-label">Property size</label>
        <select id="property-size" className="field-control" value={selectedSize} onChange={(event) => onUpdate({ size: event.target.value })}>
          {sizes.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
    </div>
  );
}
