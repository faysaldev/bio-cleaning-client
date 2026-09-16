import { CalendarDays, Clock3, CreditCard, Repeat2, Sparkles } from "lucide-react";
import type { BookingQuote } from "@/src/redux/features/bookings/types";
import type { CleaningServiceShortDetails } from "@/src/redux/features/services/types";
import type { BookingDraft } from "./types";

export function BookingSummary({ data, service, quote }: { data: BookingDraft; service?: CleaningServiceShortDetails; quote?: BookingQuote }) {
  const total = quote?.totalAmount ?? service?.basePrice ?? 0;
  const selectedExtras = service?.pricing?.extras?.filter((extra) => data.extraCodes.includes(extra.code)) || [];
  return <aside className="space-y-4 lg:sticky lg:top-24"><div className="rounded-2xl bg-brand-dark p-5 text-white shadow-card sm:p-6"><div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-lime">Live server estimate</div><div className="mt-2 text-4xl font-extrabold tracking-[-0.05em]">${total.toFixed(2)}</div><p className="mt-2 text-xs leading-5 text-white/52">Per visit. Final booking creation rechecks pricing and crew capacity atomically.</p><div className="mt-5 divide-y divide-white/8 rounded-xl border border-white/8 bg-white/[0.035]">{[
    { icon: Sparkles, label: service?.name || "Choose a service" },
    { icon: Clock3, label: quote ? `${quote.durationMinutes} min · ${quote.requiredStaff} crew unit${quote.requiredStaff === 1 ? "" : "s"}` : "Duration calculated after selection" },
    { icon: CalendarDays, label: data.date && data.timeSlot ? `${data.date} · ${data.timeSlot}` : "Choose date & time" },
    { icon: Repeat2, label: data.frequency === "ONE_TIME" ? "One-time service" : `${data.frequency.replaceAll("_", " ")} · ${data.occurrenceCount} visits` },
  ].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 px-3 py-3 text-sm text-white/76"><Icon className="h-4 w-4 shrink-0 text-brand-lime" /><span className="truncate">{label}</span></div>)}</div>{selectedExtras.length ? <div className="mt-4"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/35">Extras</p><p className="mt-1 text-xs text-white/65">{selectedExtras.map((extra) => extra.name).join(" · ")}</p></div> : null}</div><div className="rounded-2xl border border-brand-lime/55 bg-brand-lime p-5 text-brand-dark"><CreditCard className="h-6 w-6" /><h3 className="mt-3 text-lg font-bold">{quote?.payment.depositPolicy === "REQUIRED" ? "Deposit required" : quote?.payment.depositPolicy === "OPTIONAL" ? "Flexible payment" : "Pay after service"}</h3><p className="mt-1 text-xs leading-5 text-brand-dark/68">{quote?.payment.depositPolicy === "NONE" ? "No online payment is required to reserve." : `Deposit due now: $${((quote?.payment.depositAmount || 0) * Math.max(1, data.occurrenceCount)).toFixed(2)} ${quote?.payment.currency || "USD"}${data.occurrenceCount > 1 ? ` for ${data.occurrenceCount} visits` : ""}.`}</p></div></aside>;
}
