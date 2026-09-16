import { CalendarRange, Repeat2 } from "lucide-react";
import type { BookingFrequency } from "@/src/redux/features/bookings/types";
import type { CleaningServiceShortDetails } from "@/src/redux/features/services/types";
import { StepHeading } from "./ServiceStep";

const options: Array<{ value: BookingFrequency; label: string; detail: string }> = [
  { value: "ONE_TIME", label: "One time", detail: "A single cleaning visit" },
  { value: "WEEKLY", label: "Weekly", detail: "Repeat every 7 days" },
  { value: "BI_WEEKLY", label: "Bi-weekly", detail: "Repeat every 14 days" },
  { value: "MONTHLY", label: "Monthly", detail: "Repeat each month" },
];

export function FrequencyStep({ service, frequency, occurrenceCount, maxOccurrences, onChange }: { service?: CleaningServiceShortDetails; frequency: BookingFrequency; occurrenceCount: number; maxOccurrences: number; onChange: (frequency: BookingFrequency, occurrenceCount: number) => void }) {
  const discountFor = (value: BookingFrequency) => service?.pricing?.frequencyDiscounts?.find((item) => item.frequency === value)?.percent || 0;
  const availableOptions = maxOccurrences >= 2 ? options : options.filter((option) => option.value === "ONE_TIME");
  const occurrenceOptions = Array.from({ length: Math.max(0, maxOccurrences - 1) }, (_, index) => index + 2);
  return <div><StepHeading eyebrow="Step 4" title="Choose how often we clean" description="Recurring bookings reserve the same local start time across the selected number of visits, subject to live crew capacity." /><div className="grid gap-3 sm:grid-cols-2">{availableOptions.map((option) => { const discount = discountFor(option.value); const selected = frequency === option.value; return <button key={option.value} type="button" onClick={() => onChange(option.value, option.value === "ONE_TIME" ? 1 : Math.min(maxOccurrences, Math.max(2, occurrenceCount)))} className={`rounded-xl border p-4 text-left ${selected ? "border-brand-green bg-brand-green/[0.055]" : "border-border bg-white hover:border-brand-green/30"}`}><div className="flex items-start gap-3"><span className={`grid h-9 w-9 place-items-center rounded-lg ${selected ? "bg-brand-green text-white" : "bg-brand-cream text-brand-green"}`}>{option.value === "ONE_TIME" ? <CalendarRange className="h-4 w-4" /> : <Repeat2 className="h-4 w-4" />}</span><div><h3 className="text-sm font-extrabold text-brand-dark">{option.label}</h3><p className="mt-0.5 text-xs text-muted-foreground">{option.detail}</p>{discount ? <span className="mt-2 inline-block rounded-md bg-brand-lime px-2 py-1 text-[10px] font-extrabold text-brand-dark">{discount}% recurring discount</span> : null}</div></div></button>; })}</div>{frequency !== "ONE_TIME" && occurrenceOptions.length ? <div className="mt-5 rounded-xl border border-border bg-brand-cream/40 p-4"><label className="field-label" htmlFor="occurrence-count">Number of visits to schedule now</label><select id="occurrence-count" className="field-control" value={Math.min(maxOccurrences, Math.max(2, occurrenceCount))} onChange={(event) => onChange(frequency, Number(event.target.value))}>{occurrenceOptions.map((count) => <option key={count} value={count}>{count} visits</option>)}</select><p className="mt-2 text-xs text-muted-foreground">If any occurrence is unavailable, the series will not be partially created.</p></div> : null}</div>;
}
