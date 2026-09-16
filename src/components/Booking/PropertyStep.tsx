import { Building2, Home, Ruler } from "lucide-react";
import type { BookingProperty } from "@/src/redux/features/bookings/types";
import type { CleaningServiceShortDetails } from "@/src/redux/features/services/types";
import { StepHeading } from "./ServiceStep";

export function PropertyStep({ service, property, onChange }: { service?: CleaningServiceShortDetails; property: BookingProperty; onChange: (property: BookingProperty) => void }) {
  const mode = service?.pricing?.propertyPricingMode || "BED_BATH";
  return (
    <div>
      <StepHeading eyebrow="Step 2" title="Tell us about the property" description="These details determine the crew time and server-calculated price for the visit." />
      <div className="grid gap-3 sm:grid-cols-3">
        {(["HOME", "OFFICE", "OTHER"] as const).map((type) => {
          const Icon = type === "HOME" ? Home : type === "OFFICE" ? Building2 : Ruler;
          return <button key={type} type="button" onClick={() => onChange({ ...property, propertyType: type })} className={`rounded-xl border p-4 text-left ${property.propertyType === type ? "border-brand-green bg-brand-green/[0.055]" : "border-border bg-white hover:border-brand-green/30"}`}><Icon className="h-5 w-5 text-brand-green" /><span className="mt-3 block text-sm font-extrabold text-brand-dark">{type === "HOME" ? "Home" : type === "OFFICE" ? "Office" : "Other"}</span></button>;
        })}
      </div>

      {mode === "SQUARE_FOOTAGE" ? (
        <div className="mt-5"><label className="field-label" htmlFor="square-feet">Approximate square footage</label><input id="square-feet" type="number" min={1} max={1000000} className="field-control" value={property.squareFeet ?? ""} onChange={(event) => onChange({ ...property, squareFeet: Number(event.target.value) || undefined })} placeholder="e.g. 1800" /><p className="mt-2 text-xs text-muted-foreground">Your service uses square-footage tiers configured by the business.</p></div>
      ) : mode === "FIXED" ? (
        <div className="mt-5 rounded-xl border border-brand-green/15 bg-brand-green/5 p-4 text-sm text-brand-dark">This service uses fixed property pricing. We only need the property type for scheduling context.</div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><label className="field-label" htmlFor="bedrooms">Bedrooms / primary rooms</label><input id="bedrooms" type="number" min={0} max={30} className="field-control" value={property.bedrooms ?? 1} onChange={(event) => onChange({ ...property, bedrooms: Math.max(0, Number(event.target.value) || 0) })} /></div>
          <div><label className="field-label" htmlFor="bathrooms">Bathrooms</label><input id="bathrooms" type="number" min={0} max={30} step="0.5" className="field-control" value={property.bathrooms ?? 1} onChange={(event) => onChange({ ...property, bathrooms: Math.max(0, Number(event.target.value) || 0) })} /></div>
        </div>
      )}
    </div>
  );
}
