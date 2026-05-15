import { CleaningService } from "../../redux/features/services/types";
import { ServiceCard } from "./ServiceCard";
import { Loader2 } from "lucide-react";

interface ServiceGridProps {
  services: CleaningService[];
  isLoading: boolean;
  onPreview: (service: CleaningService) => void;
}

export function ServiceGrid({ services, isLoading, onPreview }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-brand-green" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading premium services...</p>
      </div>
    );
  }

  return (
    <div className="container-page grid md:grid-cols-2 gap-8">
      {services.map((service) => (
        <ServiceCard 
          key={service._id} 
          service={service} 
          onPreview={onPreview} 
        />
      ))}
    </div>
  );
}
