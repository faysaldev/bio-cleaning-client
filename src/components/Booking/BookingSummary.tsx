import { CalendarDays, Clock, CreditCard, HomeIcon, MapPin } from "lucide-react";

interface BookingSummaryProps {
  data: Record<string, any>;
  estimatedTotal: number;
}

export function BookingSummary({ data, estimatedTotal }: BookingSummaryProps) {
  const summaryItems = [
    { icon: HomeIcon, label: data.service || "Select service" },
    { icon: CalendarDays, label: data.date || "Pick a date" },
    { icon: Clock, label: data.time || "Pick a time" },
    { icon: MapPin, label: data.city || "Service location" },
  ];

  return (
    <aside className="space-y-3 lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-2xl bg-brand-dark p-5 text-white shadow-card sm:p-6">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-lime">Live estimate</div>
        <div className="mt-2 text-4xl font-extrabold tracking-[-0.05em]">${estimatedTotal}</div>
        <p className="mt-2 text-xs leading-5 text-white/52">Final price may adjust after a walkthrough only if the scope materially differs from the booking.</p>
        <div className="mt-5 divide-y divide-white/8 rounded-xl border border-white/8 bg-white/[0.035]">
          {summaryItems.map(({ icon: Icon, label }, index) => (
            <div key={`${label}-${index}`} className="flex items-center gap-3 px-3 py-3 text-sm text-white/76">
              <Icon className="h-4 w-4 shrink-0 text-brand-lime" />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-brand-lime/55 bg-brand-lime p-5 text-brand-dark">
        <CreditCard className="h-6 w-6" />
        <h3 className="mt-3 text-lg font-bold">No payment due today</h3>
        <p className="mt-1 text-xs leading-5 text-brand-dark/68">Payment details are handled only after the booking is confirmed by the team.</p>
      </div>
    </aside>
  );
}
