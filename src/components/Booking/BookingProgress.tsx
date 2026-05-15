import { Check } from "lucide-react";

interface BookingProgressProps {
  steps: string[];
  currentStep: number;
}

export function BookingProgress({ steps, currentStep }: BookingProgressProps) {
  return (
    <section className="py-10 bg-brand-cream">
      <div className="container-page max-w-5xl">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`flex items-center gap-2 ${
                  i <= currentStep ? "text-brand-green" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full grid place-items-center text-sm font-bold transition ${
                    i <= currentStep
                      ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                      : "bg-white border border-border"
                  }`}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-0.5 flex-1 mx-3 bg-border overflow-hidden">
                  <div
                    className={`h-full bg-brand-green transition-all ${
                      i < currentStep ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
