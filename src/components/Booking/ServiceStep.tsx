import { Loader2 } from "lucide-react";
import { CleaningServiceShortDetails } from "../../redux/features/services/types";

interface ServiceStepProps {
  services: CleaningServiceShortDetails[];
  isLoading: boolean;
  error: any;
  selectedService: string;
  selectedSize: string;
  onUpdate: (data: any) => void;
}

export function ServiceStep({
  services,
  isLoading,
  error,
  selectedService,
  selectedSize,
  onUpdate,
}: ServiceStepProps) {
  const sizes = ["Studio", "1BR", "2BR", "3BR", "4BR+", "Office"];

  return (
    <div>
      <h2 className="text-2xl text-brand-dark mb-6">Select your service</h2>
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
          Failed to load services. Please refresh.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <button
              key={s._id}
              onClick={() => onUpdate({ service: s.name })}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                selectedService === s.name
                  ? "border-brand-green bg-brand-green/5 shadow-card"
                  : "border-border hover:border-brand-green/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-brand-dark">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {s.description}
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-green">
                  ${s.basePrice}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      <label className="block mt-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Property Size
        </span>
        <select
          className="mt-2 w-full p-3 rounded-xl border border-border bg-white"
          value={selectedSize}
          onChange={(e) => onUpdate({ size: e.target.value })}
        >
          {sizes.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
