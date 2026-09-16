import { Sparkles } from "lucide-react";

interface ConfirmStepProps {
  data: Record<string, any>;
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
    ["Address", `${data.addr1 || "—"}${data.city ? `, ${data.city}` : ""}${data.zip ? ` ${data.zip}` : ""}`],
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Final step</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-dark">Confirm your booking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review the request before it is submitted.</p>
      </div>
      <div className="rounded-xl border border-border bg-brand-cream/45 p-4 sm:p-5">
        <dl className="divide-y divide-border/70">
          {summaryItems.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="max-w-[65%] text-right font-bold text-brand-dark">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-border pt-4">
          <span className="text-sm font-semibold text-muted-foreground">Estimated total</span>
          <span className="text-3xl font-extrabold tracking-[-0.045em] text-brand-green">${estimatedTotal}</span>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-yellow/25 bg-brand-yellow/10 p-3 text-xs font-semibold leading-5 text-brand-dark">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" /> This total is calculated from the live service pricing on our secure server.
      </div>
    </div>
  );
}
