"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetAllServicesQuery } from "@/src/redux/features/services/servicesApi";
import { useGetBookingQuoteMutation } from "@/src/redux/features/bookings/bookingsApi";
import { useCapturePublicLeadMutation } from "@/src/redux/features/crm/crmApi";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/src/components/ui/form-field";

export default function QuotePage() {
  const servicesQuery = useGetAllServicesQuery({ limit: 100 });
  const services = servicesQuery.data?.data || [];
  const [getQuote, quoteState] = useGetBookingQuoteMutation();
  const [captureLead, captureState] = useCapturePublicLeadMutation();
  const [serviceId, setServiceId] = useState("");
  const [propertyType, setPropertyType] = useState<"HOME" | "OFFICE" | "OTHER">("HOME");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [squareFeet, setSquareFeet] = useState("");
  const [frequency, setFrequency] = useState<"ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY">("ONE_TIME");
  const [estimate, setEstimate] = useState<any>(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(() => services.find((service) => service._id === serviceId), [services, serviceId]);
  const property = propertyType === "HOME"
    ? { propertyType, bedrooms: Number(bedrooms || 0), bathrooms: Number(bathrooms || 0), ...(squareFeet ? { squareFeet: Number(squareFeet) } : {}) }
    : { propertyType, ...(squareFeet ? { squareFeet: Number(squareFeet) } : {}) };

  const calculate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setEstimate(null);
    try {
      const result = await getQuote({ serviceId, property, frequency, extraCodes: [] }).unwrap();
      setEstimate(result);
    } catch (requestError: any) {
      setError(requestError?.data?.message || "We could not calculate this estimate. Try another service or property scope.");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!estimate) return;
    setError("");
    try {
      await captureLead({
        name: contact.name,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        source: "GET_QUOTE",
        requestedServiceId: serviceId,
        requestedServiceName: estimate.serviceName || selectedService?.name,
        value: Number(estimate.totalAmount || 0),
        message: [
          `Instant estimate: $${Number(estimate.totalAmount || 0).toFixed(2)}.`,
          `${propertyType} · ${frequency.replace(/_/g, " ")}.`,
          contact.message,
        ].filter(Boolean).join(" "),
      }).unwrap();
      setSent(true);
    } catch (requestError: any) {
      setError(requestError?.data?.message || "We could not save your quote request. Please try again.");
    }
  };

  return <SiteLayout>
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0 leaf-bg opacity-35" />
      <div className="container-page relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/7 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-lime"><Calculator className="h-4 w-4" /> Instant estimate</span><h1 className="mt-6 text-5xl font-extrabold tracking-[-0.055em] sm:text-6xl lg:text-7xl">Know the scope before you schedule.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">Build a server-calculated cleaning estimate, then send it to our team for a fast follow-up. Your request lands directly in our sales pipeline—no lost inbox messages.</p></div>
      </div>
    </section>

    <section className="bg-brand-cream/55 py-14 sm:py-20">
      <div className="container-page grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="surface p-5 sm:p-7">
          {!sent ? <>
            <div><span className="editorial-kicker">Step 1</span><h2 className="mt-2 text-2xl font-extrabold text-brand-dark">Build your estimate</h2></div>
            <form onSubmit={calculate} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><FieldLabel>Cleaning service</FieldLabel><SelectInput required value={serviceId} onChange={(event) => { setServiceId(event.target.value); setEstimate(null); }}><option value="">Choose a service</option>{services.map((service) => <option key={service._id} value={service._id}>{service.name} · from ${service.basePrice}</option>)}</SelectInput></label>
              <label><FieldLabel>Property type</FieldLabel><SelectInput value={propertyType} onChange={(event) => { setPropertyType(event.target.value as any); setEstimate(null); }}><option value="HOME">Home</option><option value="OFFICE">Office / commercial</option><option value="OTHER">Other</option></SelectInput></label>
              <label><FieldLabel>Frequency</FieldLabel><SelectInput value={frequency} onChange={(event) => { setFrequency(event.target.value as any); setEstimate(null); }}><option value="ONE_TIME">One time</option><option value="WEEKLY">Weekly</option><option value="BI_WEEKLY">Every 2 weeks</option><option value="MONTHLY">Monthly</option></SelectInput></label>
              {propertyType === "HOME" ? <><label><FieldLabel>Bedrooms</FieldLabel><TextInput type="number" min="0" max="30" value={bedrooms} onChange={(event) => { setBedrooms(event.target.value); setEstimate(null); }} /></label><label><FieldLabel>Bathrooms</FieldLabel><TextInput type="number" min="0" max="30" step="0.5" value={bathrooms} onChange={(event) => { setBathrooms(event.target.value); setEstimate(null); }} /></label></> : null}
              <label className="sm:col-span-2"><FieldLabel>Approx. square footage {propertyType === "HOME" ? "(optional)" : ""}</FieldLabel><TextInput type="number" min="1" value={squareFeet} onChange={(event) => { setSquareFeet(event.target.value); setEstimate(null); }} placeholder="1800" /></label>
              <button type="submit" disabled={!serviceId || quoteState.isLoading} className="btn-primary sm:col-span-2">{quoteState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />} Calculate estimate</button>
            </form>

            {estimate ? <div className="mt-7 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Estimated visit total</p><p className="mt-2 text-4xl font-extrabold tracking-[-0.04em] text-brand-dark">${Number(estimate.totalAmount).toFixed(2)}</p><p className="mt-1 text-sm text-muted-foreground">About {estimate.durationMinutes} minutes · {estimate.requiredStaff} staff required</p></div><Link href="/book" className="btn-secondary">Book exact time <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-5 grid gap-2 border-t border-brand-green/15 pt-4 text-xs text-muted-foreground sm:grid-cols-2"><span>Service: <strong className="text-brand-dark">{estimate.serviceName}</strong></span><span>Property: <strong className="text-brand-dark">{estimate.propertyLabel}</strong></span><span>Service subtotal: <strong className="text-brand-dark">${Number(estimate.priceBreakdown.serviceSubtotal).toFixed(2)}</strong></span><span>Discounts: <strong className="text-brand-dark">-${Number(estimate.priceBreakdown.frequencyDiscountAmount + estimate.priceBreakdown.promotionDiscount).toFixed(2)}</strong></span></div></div> : null}

            {estimate ? <form onSubmit={submit} className="mt-8 border-t border-border pt-7"><span className="editorial-kicker">Step 2</span><h2 className="mt-2 text-2xl font-extrabold text-brand-dark">Send this quote request</h2><p className="mt-2 text-sm text-muted-foreground">We’ll keep this estimate with your inquiry so the team can follow up with context.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><FieldLabel>Name</FieldLabel><TextInput required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label><label><FieldLabel>Email</FieldLabel><TextInput type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label><label><FieldLabel>Phone</FieldLabel><TextInput value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label><label className="sm:col-span-2"><FieldLabel>Anything else we should know?</FieldLabel><TextArea value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} /></label></div>{!contact.email && !contact.phone ? <p className="mt-2 text-xs font-semibold text-amber-700">Add an email or phone so we can follow up.</p> : null}<button className="btn-primary mt-5 w-full" disabled={captureState.isLoading || (!contact.email && !contact.phone)}>{captureState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Request follow-up</button></form> : null}
          </> : <div className="grid min-h-96 place-items-center text-center"><div className="max-w-lg"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-green text-white"><CheckCircle2 className="h-6 w-6" /></div><h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">Your estimate is with our team.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">We saved the service, estimated value, property scope and your contact details together so the next conversation starts with context.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><Link href="/book" className="btn-primary">Book online now</Link><Link href="/" className="btn-secondary">Back home</Link></div></div></div>}
            {error ? <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive" role="alert">{error}</div> : null}
        </div>

        <aside className="space-y-4"><div className="surface p-5"><ShieldCheck className="h-5 w-5 text-brand-green" /><h3 className="mt-4 text-lg font-extrabold text-brand-dark">Server-calculated pricing</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The estimate uses the same pricing rules as online booking: service configuration, property scope, recurrence discounts, minimums and tax.</p></div><div className="surface p-5"><Sparkles className="h-5 w-5 text-brand-green" /><h3 className="mt-4 text-lg font-extrabold text-brand-dark">Need exact availability?</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Online booking checks live crew capacity, business hours, buffers and blocked dates before reserving a slot.</p><Link href="/book" className="btn-secondary mt-4 w-full">Open booking <ArrowRight className="h-4 w-4" /></Link></div></aside>
      </div>
    </section>
  </SiteLayout>;
}
