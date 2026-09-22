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

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-[#0C3629] text-white py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-16 h-60 w-60 rounded-full bg-brand-lime/10 blur-[80px]" />

        <div className="container-page relative z-10 max-w-4xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
            <Calculator className="h-3.5 w-3.5" />
            <span>Instant Quote Calculator</span>
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Know the scope before you schedule.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Build a server-calculated cleaning estimate, then send it directly to our dispatch team for fast follow-up with zero sales pressure.
          </p>
        </div>
      </section>

      <section className="bg-[#F7FAF8] py-14 sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-brand-green/12 bg-white p-6 sm:p-9 shadow-sm">
            {!sent ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full bg-brand-lime px-3 py-1 text-xs font-extrabold text-brand-dark">
                    Step 1
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">Build your estimate</h2>
                </div>

                <form onSubmit={calculate} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <FieldLabel>Cleaning service</FieldLabel>
                    <SelectInput
                      required
                      value={serviceId}
                      onChange={(event) => {
                        setServiceId(event.target.value);
                        setEstimate(null);
                      }}
                      className="rounded-xl"
                    >
                      <option value="">Choose a service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} · from ${service.basePrice}
                        </option>
                      ))}
                    </SelectInput>
                  </label>

                  <label>
                    <FieldLabel>Property type</FieldLabel>
                    <SelectInput
                      value={propertyType}
                      onChange={(event) => {
                        setPropertyType(event.target.value as any);
                        setEstimate(null);
                      }}
                      className="rounded-xl"
                    >
                      <option value="HOME">Single Family Home</option>
                      <option value="OFFICE">Office / Commercial</option>
                      <option value="OTHER">Other / Apartment</option>
                    </SelectInput>
                  </label>

                  <label>
                    <FieldLabel>Frequency</FieldLabel>
                    <SelectInput
                      value={frequency}
                      onChange={(event) => {
                        setFrequency(event.target.value as any);
                        setEstimate(null);
                      }}
                      className="rounded-xl"
                    >
                      <option value="ONE_TIME">One time</option>
                      <option value="WEEKLY">Weekly (Save 20%)</option>
                      <option value="BI_WEEKLY">Every 2 weeks (Save 15%)</option>
                      <option value="MONTHLY">Monthly (Save 10%)</option>
                    </SelectInput>
                  </label>

                  {propertyType === "HOME" ? (
                    <>
                      <label>
                        <FieldLabel>Bedrooms</FieldLabel>
                        <TextInput
                          type="number"
                          min="0"
                          max="30"
                          value={bedrooms}
                          onChange={(event) => {
                            setBedrooms(event.target.value);
                            setEstimate(null);
                          }}
                          className="rounded-xl"
                        />
                      </label>
                      <label>
                        <FieldLabel>Bathrooms</FieldLabel>
                        <TextInput
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          value={bathrooms}
                          onChange={(event) => {
                            setBathrooms(event.target.value);
                            setEstimate(null);
                          }}
                          className="rounded-xl"
                        />
                      </label>
                    </>
                  ) : null}

                  <label className="sm:col-span-2">
                    <FieldLabel>Approx. square footage {propertyType === "HOME" ? "(optional)" : ""}</FieldLabel>
                    <TextInput
                      type="number"
                      min="1"
                      value={squareFeet}
                      onChange={(event) => {
                        setSquareFeet(event.target.value);
                        setEstimate(null);
                      }}
                      placeholder="e.g. 1800"
                      className="rounded-xl"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!serviceId || quoteState.isLoading}
                    className="btn-primary sm:col-span-2 rounded-full py-3.5 text-xs font-extrabold shadow-md"
                  >
                    {quoteState.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="h-4 w-4" />
                    )}
                    Calculate estimate
                  </button>
                </form>

                {estimate ? (
                  <div className="mt-8 rounded-3xl border border-brand-green/20 bg-[#F4FAF5] p-6 sm:p-7 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="inline-flex items-center rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
                          Estimated Visit Total
                        </span>
                        <p className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
                          ${Number(estimate.totalAmount).toFixed(2)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Approx. {estimate.durationMinutes} minutes · {estimate.requiredStaff} staff member{estimate.requiredStaff > 1 ? "s" : ""}
                        </p>
                      </div>
                      <Link href="/book" className="btn-primary rounded-full px-6 py-2.5 text-xs font-extrabold shadow-sm">
                        Book exact time <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-2 border-t border-brand-green/15 pt-4 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>Service: <strong className="text-brand-dark">{estimate.serviceName}</strong></span>
                      <span>Property: <strong className="text-brand-dark">{estimate.propertyLabel}</strong></span>
                      <span>Service subtotal: <strong className="text-brand-dark">${Number(estimate.priceBreakdown.serviceSubtotal).toFixed(2)}</strong></span>
                      <span>Discounts: <strong className="text-brand-green">-${Number(estimate.priceBreakdown.frequencyDiscountAmount + estimate.priceBreakdown.promotionDiscount).toFixed(2)}</strong></span>
                    </div>
                  </div>
                ) : null}

                {estimate ? (
                  <form onSubmit={submit} className="mt-9 border-t border-brand-green/10 pt-8">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full bg-brand-lime px-3 py-1 text-xs font-extrabold text-brand-dark">
                        Step 2
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">Send this quote request</h2>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We’ll save this calculation with your notes so our team can follow up with full context.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <FieldLabel>Name</FieldLabel>
                        <TextInput
                          required
                          value={contact.name}
                          onChange={(event) => setContact({ ...contact, name: event.target.value })}
                          className="rounded-xl"
                        />
                      </label>
                      <label>
                        <FieldLabel>Email</FieldLabel>
                        <TextInput
                          type="email"
                          value={contact.email}
                          onChange={(event) => setContact({ ...contact, email: event.target.value })}
                          className="rounded-xl"
                        />
                      </label>
                      <label>
                        <FieldLabel>Phone</FieldLabel>
                        <TextInput
                          value={contact.phone}
                          onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                          className="rounded-xl"
                        />
                      </label>
                      <label className="sm:col-span-2">
                        <FieldLabel>Any details or specific rooms we should know about?</FieldLabel>
                        <TextArea
                          value={contact.message}
                          onChange={(event) => setContact({ ...contact, message: event.target.value })}
                          className="rounded-xl"
                        />
                      </label>
                    </div>

                    {!contact.email && !contact.phone ? (
                      <p className="mt-2 text-xs font-semibold text-amber-700">Please provide an email or phone so our dispatch team can reach you.</p>
                    ) : null}

                    <button
                      className="btn-primary mt-6 w-full rounded-full py-3.5 text-xs font-extrabold shadow-md"
                      disabled={captureState.isLoading || (!contact.email && !contact.phone)}
                    >
                      {captureState.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      Request Follow-Up
                    </button>
                  </form>
                ) : null}
              </>
            ) : (
              <div className="grid min-h-96 place-items-center text-center py-8">
                <div className="max-w-md">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-md">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
                    Your estimate is with our team!
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    We saved your selected service, scope, and contact details together so the next conversation starts with context.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/book" className="btn-primary rounded-full px-6 py-2.5 text-xs font-extrabold shadow-sm">
                      Book online now
                    </Link>
                    <Link href="/" className="btn-secondary rounded-full px-6 py-2.5 text-xs font-extrabold">
                      Back to home
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {error ? (
              <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive" role="alert">
                {error}
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-brand-green/12 bg-white p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-brand-dark">Real Pricing Rules</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                This estimate uses the same mathematical calculation as our online booking engine: base rates, bedroom & bath counts, square footage, and recurrence discounts.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-green/12 bg-white p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-brand-dark">Ready to pick a date?</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Our online scheduler checks live team availability in your ZIP code and locks in your preferred arrival window instantly.
              </p>
              <Link href="/book" className="btn-secondary rounded-full mt-4 w-full justify-center text-xs font-extrabold">
                Open booking engine <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
