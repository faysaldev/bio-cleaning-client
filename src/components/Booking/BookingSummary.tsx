import {
  HomeIcon,
  CalendarDays,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";

interface BookingSummaryProps {
  data: any;
  estimatedTotal: number;
}

export function BookingSummary({ data, estimatedTotal }: BookingSummaryProps) {
  const summaryItems = [
    { icon: HomeIcon, label: data.service || "Select service" },
    { icon: CalendarDays, label: data.date || "Pick a date" },
    { icon: Clock, label: data.time },
    { icon: MapPin, label: data.city || "Service location" },
  ];

  return (
    <aside className="lg:sticky lg:top-28 space-y-4">
      <div className="rounded-3xl bg-brand-dark text-white p-6 shadow-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-brand-lime">
          Live Estimate
        </div>
        <div className="font-display text-5xl font-bold mt-3">
          ${estimatedTotal}
        </div>
        <p className="text-white/60 text-sm mt-2">
          Final price may adjust after walkthrough for unusual scope.
        </p>
        <div className="mt-6 space-y-3 text-sm">
          {summaryItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/8 p-3"
            >
              <Icon className="w-4 h-4 text-brand-lime" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-brand-lime text-brand-dark p-6">
        <CreditCard className="w-8 h-8" />
        <h3 className="font-display text-2xl mt-3">No payment due today</h3>
        <p className="text-sm text-brand-dark/70 mt-2">
          Your card is only collected after the booking is confirmed by our
          team.
        </p>
      </div>
    </aside>
  );
}
