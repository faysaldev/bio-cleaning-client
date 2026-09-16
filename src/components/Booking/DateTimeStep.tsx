import { CalendarDays, Clock3, Loader2, Users } from "lucide-react";
import type { AvailabilityResponse, BookingFrequency, BookingProperty } from "@/src/redux/features/bookings/types";
import { useJoinWaitlistMutation } from "@/src/redux/features/bookings/bookingsApi";
import { FormEvent, useState } from "react";
import { StepHeading } from "./ServiceStep";

export function DateTimeStep({
  serviceId,
  property,
  extraCodes,
  frequency,
  date,
  timeSlot,
  availability,
  isLoading,
  timezone,
  bookingHorizonDays,
  onDateChange,
  onTimeChange,
}: {
  serviceId: string;
  property: BookingProperty;
  extraCodes: string[];
  frequency: BookingFrequency;
  date: string;
  timeSlot: string;
  availability?: AvailabilityResponse;
  isLoading: boolean;
  timezone?: string;
  bookingHorizonDays?: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const zone = timezone || availability?.timezone || "UTC";
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  const minDate = `${part("year")}-${part("month")}-${part("day")}`;
  const maxDateValue = new Date(`${minDate}T12:00:00.000Z`);
  maxDateValue.setUTCDate(maxDateValue.getUTCDate() + Math.max(1, bookingHorizonDays || 90));
  const maxDate = maxDateValue.toISOString().slice(0, 10);
  return (
    <div>
      <StepHeading eyebrow="Step 5" title="Choose a live appointment time" description="Slots are generated from business hours, service duration, crew schedules, travel buffers, blocks, and current capacity." />
      <div className="max-w-sm"><label className="field-label" htmlFor="booking-date">Cleaning date</label><input id="booking-date" type="date" min={minDate} max={maxDate} value={date} onChange={(event) => onDateChange(event.target.value)} className="field-control" /></div>
      {!date ? <div className="mt-5 rounded-xl border border-dashed border-border bg-brand-cream/40 p-7 text-center"><CalendarDays className="mx-auto h-6 w-6 text-brand-green" /><p className="mt-2 text-sm font-bold text-brand-dark">Select a date to load live availability.</p></div> : isLoading ? <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-border bg-brand-cream/40"><Loader2 className="h-5 w-5 animate-spin text-brand-green" /></div> : availability?.slots?.length ? <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{availability.slots.map((slot) => <button key={slot.time} type="button" onClick={() => onTimeChange(slot.time)} className={`rounded-xl border p-3 text-left transition ${timeSlot === slot.time ? "border-brand-green bg-brand-green text-white" : "border-border bg-white hover:border-brand-green/35"}`}><span className="flex items-center gap-2 text-sm font-extrabold"><Clock3 className="h-4 w-4" /> {slot.label}</span><span className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${timeSlot === slot.time ? "text-white/70" : "text-muted-foreground"}`}><Users className="h-3 w-3" /> {slot.remainingCapacity} crew unit{slot.remainingCapacity === 1 ? "" : "s"} left</span></button>)}</div> : <WaitlistPanel serviceId={serviceId} requestedDate={date} property={property} extraCodes={extraCodes} frequency={frequency} />}
      {availability?.timezone ? <p className="mt-4 text-xs text-muted-foreground">All appointment times are shown in <strong className="text-brand-dark">{availability.timezone}</strong>. Estimated duration: {availability.durationMinutes} minutes.</p> : null}
    </div>
  );
}

function WaitlistPanel({ serviceId, requestedDate, property, extraCodes, frequency }: { serviceId: string; requestedDate: string; property: BookingProperty; extraCodes: string[]; frequency: BookingFrequency }) {
  const [joinWaitlist, { isLoading }] = useJoinWaitlistMutation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      await joinWaitlist({ serviceId, requestedDate, property, extraCodes, frequency, customer: { name: String(form.get("name") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || "") } }).unwrap();
      setMessage("You’re on the waitlist. We’ll email you when capacity opens for this date.");
    } catch (err: any) {
      setError(err?.data?.message || "We couldn’t add you to the waitlist.");
    }
  };
  if (message) return <div className="mt-5 rounded-xl border border-brand-green/20 bg-brand-green/5 p-5 text-sm font-semibold text-brand-green">{message}</div>;
  return <div className="mt-5 rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-5"><h3 className="text-base font-extrabold text-brand-dark">No live slots on this date</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Join the waitlist and we’ll alert you if a cancellation or capacity change creates an opening.</p><form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-3"><input name="name" required className="field-control" placeholder="Name" /><input name="email" required type="email" className="field-control" placeholder="Email" /><input name="phone" required className="field-control" placeholder="Phone" /><div className="sm:col-span-3 flex items-center justify-between gap-3">{error ? <p className="text-xs font-semibold text-destructive">{error}</p> : <span />}<button type="submit" disabled={isLoading} className="btn-secondary">{isLoading ? "Joining…" : "Join waitlist"}</button></div></form></div>;
}
