import { CalendarDays, Clock3, Home, Repeat2, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { BookingQuote } from "@/src/redux/features/bookings/types";
import type { CleaningServiceShortDetails } from "@/src/redux/features/services/types";
import type { BookingDraft } from "./types";
import { StepHeading } from "./ServiceStep";

export function ConfirmStep({ data, service, quote }: { data: BookingDraft; service?: CleaningServiceShortDetails; quote?: BookingQuote }) {
  const items = [
    { icon: Sparkles, label: "Service", value: service?.name || "—" },
    { icon: Home, label: "Property", value: quote?.propertyLabel || "—" },
    { icon: CalendarDays, label: "Date", value: data.date || "—" },
    { icon: Clock3, label: "Time", value: data.timeSlot || "—" },
    { icon: Repeat2, label: "Frequency", value: data.frequency === "ONE_TIME" ? "One time" : `${data.frequency.replaceAll("_", " ")} · ${data.occurrenceCount} visits` },
    { icon: Users, label: "Crew requirement", value: quote ? `${quote.requiredStaff} unit${quote.requiredStaff === 1 ? "" : "s"}` : "—" },
  ];
  return <div><StepHeading eyebrow="Step 8" title="Review and confirm" description="Nothing is sent until you confirm. Price, duration, and availability will be verified by the server again at submission." /><div className="grid gap-3 sm:grid-cols-2">{items.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-xl border border-border bg-white p-4"><Icon className="h-4 w-4 text-brand-green" /><div className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 text-sm font-extrabold capitalize text-brand-dark">{value}</div></div>)}</div><div className="mt-5 rounded-xl border border-brand-green/15 bg-brand-green/5 p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-green" /><h3 className="text-sm font-extrabold text-brand-dark">Booking policies</h3></div><p className="mt-2 text-xs leading-5 text-muted-foreground">You’ll receive a private management link by email for eligible rescheduling, cancellation, and deposit retry. Recurring bookings are created atomically, so you won’t get a partial series.</p></div>{quote?.preparationInstructions?.length ? <div className="mt-5"><h3 className="text-sm font-extrabold text-brand-dark">Before we arrive</h3><ul className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground">{quote.preparationInstructions.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />{item}</li>)}</ul></div> : null}</div>;
}
