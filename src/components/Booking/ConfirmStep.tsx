import { Sparkles } from "lucide-react";

interface ConfirmStepProps {
  data: any;
  estimatedTotal: number;
}

export function ConfirmStep({ data, estimatedTotal }: ConfirmStepProps) {
  const summaryItems = [
    ["Service", data.service],
    ["Property", data.size],
    ["Date", data.date || "—"],
    ["Time", data.time],
    ["Frequency", data.frequency],
    ["Name", data.name || "—"],
    [
      "Address",
      `${data.addr1 || "—"}, ${data.city || ""} ${data.zip || ""}`,
    ],
  ];

  return (
    <div>
      <h2 className="text-2xl text-brand-dark mb-6">Confirm your booking</h2>
      <div className="rounded-2xl bg-brand-cream p-6 space-y-3">
        {summaryItems.map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between text-sm border-b border-border/50 pb-2"
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="font-semibold text-brand-dark">{v}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="text-3xl font-display font-bold text-brand-green">
            ${estimatedTotal}
          </span>
        </div>
      </div>
      <div className="mt-4 p-3 rounded-xl bg-brand-yellow/20 text-sm flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-dark" /> 20% off your first
        cleaning has been applied!
      </div>
    </div>
  );
}
