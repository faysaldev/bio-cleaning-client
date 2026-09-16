import { CleaningService } from "../../redux/features/services/types";
import { ServiceCard } from "./ServiceCard";
import { Sparkles } from "lucide-react";
import { EmptyState, ErrorState } from "@/src/components/ui/feedback";

interface ServiceGridProps {
  services: CleaningService[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPreview: (service: CleaningService) => void;
}

export function ServiceGrid({ services, isLoading, isError = false, onRetry, onPreview }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="container-page grid gap-5 md:grid-cols-2" role="status" aria-label="Loading services">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface overflow-hidden">
            <div className="skeleton aspect-[16/9] w-full" />
            <div className="p-5">
              <div className="skeleton h-6 w-2/3 rounded-md" />
              <div className="skeleton mt-3 h-4 w-full rounded-md" />
              <div className="skeleton mt-2 h-4 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page">
        <ErrorState
          title="Services are temporarily unavailable"
          description="Please retry to load the current service catalog."
          action={onRetry ? <button type="button" onClick={onRetry} className="btn-secondary">Try again</button> : undefined}
        />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="container-page">
        <EmptyState icon={Sparkles} title="Services are being prepared" description="There are no published cleaning services available to book right now." />
      </div>
    );
  }

  return (
    <div className="container-page grid gap-5 md:grid-cols-2">
      {services.map((service) => <ServiceCard key={service._id} service={service} onPreview={onPreview} />)}
    </div>
  );
}
