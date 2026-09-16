import { Clock3, Plus } from "lucide-react";
import type { CleaningServiceShortDetails } from "@/src/redux/features/services/types";
import { StepHeading } from "./ServiceStep";

export function ExtrasStep({ service, selectedCodes, onChange }: { service?: CleaningServiceShortDetails; selectedCodes: string[]; onChange: (codes: string[]) => void }) {
  const extras = (service?.pricing?.extras || []).filter((extra) => extra.isActive);
  const toggle = (code: string) => onChange(selectedCodes.includes(code) ? selectedCodes.filter((item) => item !== code) : [...selectedCodes, code]);
  return (
    <div>
      <StepHeading eyebrow="Step 3" title="Add any extras" description="Extras update both the price and the amount of time or crew capacity reserved for your visit." />
      {extras.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-brand-cream/45 p-7 text-sm text-muted-foreground">No optional extras are configured for this service. Continue to choose frequency.</div> : <div className="grid gap-3 sm:grid-cols-2">{extras.map((extra) => { const selected = selectedCodes.includes(extra.code); return <button key={extra.code} type="button" onClick={() => toggle(extra.code)} className={`rounded-xl border p-4 text-left transition ${selected ? "border-brand-green bg-brand-green/[0.055]" : "border-border bg-white hover:border-brand-green/30"}`} aria-pressed={selected}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-extrabold text-brand-dark">{extra.name}</h3>{extra.description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{extra.description}</p> : null}</div><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${selected ? "bg-brand-green text-white" : "bg-brand-cream text-brand-green"}`}><Plus className={`h-3.5 w-3.5 transition ${selected ? "rotate-45" : ""}`} /></span></div><div className="mt-4 flex gap-2 text-[11px] font-bold"><span className="rounded-lg bg-brand-cream px-2.5 py-1.5 text-brand-dark">+${extra.price}</span>{extra.durationMinutes ? <span className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-muted-foreground"><Clock3 className="h-3 w-3" /> +{extra.durationMinutes} min</span> : null}</div></button>; })}</div>}
    </div>
  );
}
