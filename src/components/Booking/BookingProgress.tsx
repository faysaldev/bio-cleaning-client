import { Check } from "lucide-react";

interface BookingProgressProps {
  steps: string[];
  currentStep: number;
}

export function BookingProgress({ steps, currentStep }: BookingProgressProps) {
  return (
    <section className="border-y border-border bg-brand-cream/60 py-6 sm:py-7">
      <div className="container-page max-w-5xl">
        <ol className="flex items-center justify-between" aria-label="Booking progress">
          {steps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;
            return (
              <li key={step} className="flex flex-1 items-center" aria-current={active ? "step" : undefined}>
                <div className={`flex items-center gap-2 ${index <= currentStep ? "text-brand-green" : "text-muted-foreground"}`}>
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-xs font-extrabold transition ${
                    index <= currentStep
                      ? "border-brand-green bg-brand-green text-white"
                      : "border-border bg-white text-muted-foreground"
                  }`}>
                    {completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </div>
                  <span className="hidden text-xs font-bold sm:block">{step}</span>
                </div>
                {index < steps.length - 1 ? (
                  <div className="mx-2 h-px flex-1 overflow-hidden bg-border sm:mx-3">
                    <div className={`h-full bg-brand-green transition-all ${completed ? "w-full" : "w-0"}`} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
