"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Loader2, Mail, Plus, X, Send, ShieldCheck, AlertCircle } from "lucide-react";
import { useCreateQuoteMutation, useGetQuotesQuery, useSendQuoteMutation } from "@/src/redux/features/finance/financeApi";
import { useGetAllServicesAdminQuery } from "@/src/redux/features/services/servicesApi";
import { useGetCustomerQuery, useGetLeadQuery } from "@/src/redux/features/crm/crmApi";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/src/components/ui/form-field";

const statusClass = (s: string) =>
  s === "CONVERTED" || s === "ACCEPTED"
    ? "bg-emerald-100 text-emerald-800"
    : s === "DECLINED" || s === "EXPIRED"
    ? "bg-rose-100 text-rose-800"
    : "bg-slate-100 text-slate-700";

export default function QuotesPage() {
  const [context, setContext] = useState({ leadId: "", customerId: "" });
  const { leadId, customerId } = context;
  const prefilled = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setContext({ leadId: params.get("leadId") || "", customerId: params.get("customerId") || "" });
  }, []);

  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { data, isLoading, isError, refetch } = useGetQuotesQuery({ limit: 100 });
  const { data: serviceResp } = useGetAllServicesAdminQuery({});
  const services: any[] = (serviceResp as any)?.data || (serviceResp as any) || [];
  const leadQuery = useGetLeadQuery(leadId, { skip: !leadId });
  const customerQuery = useGetCustomerQuery(customerId, { skip: !customerId });
  const [createQuote, createState] = useCreateQuoteMutation();
  const [sendQuote, sendState] = useSendQuoteMutation();

  const [form, setForm] = useState<any>({
    serviceId: "",
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    zip: "",
    propertyType: "HOME",
    bedrooms: 2,
    bathrooms: 1,
    frequency: "ONE_TIME",
    extraCodes: [],
    discountType: "FIXED",
    discountValue: "",
    discountLabel: "",
    terms: "Payment is due according to the accepted estimate.\nSchedule changes remain subject to live availability.",
    notes: "",
    expiresInDays: 14,
  });

  const selected = useMemo(() => services.find((s: any) => s._id === form.serviceId), [services, form.serviceId]);

  useEffect(() => {
    if (prefilled.current) return;
    const lead = leadQuery.data?.data?.lead;
    const customer = customerQuery.data?.data?.customer;
    if (leadId && lead) {
      const requestedServiceId = typeof lead.requestedServiceId === "object" ? lead.requestedServiceId?._id : lead.requestedServiceId;
      const linked = typeof lead.customerId === "object" ? lead.customerId : undefined;
      const address = linked?.addresses?.find((a: any) => a.isPrimary) || linked?.addresses?.[0];
      setForm((current: any) => ({
        ...current,
        serviceId: requestedServiceId || current.serviceId,
        name: lead.name || current.name,
        email: lead.email || current.email,
        phone: lead.phone || current.phone,
        line1: address?.line1 || current.line1,
        city: address?.city || current.city,
        zip: address?.zip || current.zip,
        propertyType: address?.propertyType || current.propertyType,
        notes: lead.message || lead.notes || current.notes,
      }));
      prefilled.current = true;
      setOpen(true);
    } else if (customerId && customer) {
      const address = customer.addresses?.find((a: any) => a.isPrimary) || customer.addresses?.[0];
      setForm((current: any) => ({
        ...current,
        name: customer.name || current.name,
        email: customer.email || current.email,
        phone: customer.phone || current.phone,
        line1: address?.line1 || current.line1,
        city: address?.city || current.city,
        zip: address?.zip || current.zip,
        propertyType: address?.propertyType || current.propertyType,
      }));
      prefilled.current = true;
      setOpen(true);
    }
  }, [leadId, customerId, leadQuery.data, customerQuery.data]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createQuote({
        leadId: leadId || undefined,
        customerId: customerId || undefined,
        serviceId: form.serviceId,
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: { line1: form.line1, city: form.city, zip: form.zip },
        },
        bookingDraft: {
          property: {
            propertyType: form.propertyType,
            bedrooms: Number(form.bedrooms || 0),
            bathrooms: Number(form.bathrooms || 0),
          },
          frequency: form.frequency,
          extraCodes: form.extraCodes,
          occurrenceCount: 1,
        },
        discount:
          Number(form.discountValue) > 0
            ? {
                type: form.discountType,
                value: Number(form.discountValue),
                label: form.discountLabel || undefined,
              }
            : undefined,
        terms: String(form.terms).split("\n").map((x: string) => x.trim()).filter(Boolean),
        notes: form.notes || undefined,
        expiresInDays: Number(form.expiresInDays || 14),
      } as any).unwrap();
      setOpen(false);
      setNotice("Estimate created. Send it when you are ready.");
    } catch (err: any) {
      setError(err?.data?.message || "Could not create estimate.");
    }
  };

  const send = async (id: string) => {
    setError("");
    try {
      await sendQuote(id).unwrap();
      setNotice("Estimate emailed with a secure acceptance link.");
    } catch (err: any) {
      setError(err?.data?.message || "Could not send estimate.");
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Estimates are unavailable"
        action={
          <button className="btn-secondary rounded-full" onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Sales Documents
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Quotes & estimates</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Send professional, electronic estimates that customers can review, accept, and automatically convert into a confirmed booking.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 shrink-0"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" /> New estimate
          </button>
        </div>
      </section>

      {notice ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Main Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : data?.data?.length ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Estimate</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {data.data.map((q) => (
                  <tr key={q._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-emerald-700">{q.quoteNumber}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Expires {new Date(q.expiresAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-brand-dark">{q.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{q.customer.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">
                      {typeof q.serviceId === "object" ? q.serviceId.name : "Cleaning service"}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-brand-dark">
                      {q.pricing.currency} {q.pricing.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${statusClass(q.status)}`}>
                        {q.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={sendState.isLoading || ["CONVERTED", "DECLINED", "EXPIRED"].includes(q.status)}
                        onClick={() => send(q._id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40"
                      >
                        <Mail className="h-3 w-3 text-emerald-700" /> Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No estimates yet"
          description="Create an estimate for a lead or customer and send it for electronic acceptance."
          action={
            <button className="btn-primary rounded-full" onClick={() => setOpen(true)}>
              Create estimate
            </button>
          }
        />
      )}

      {/* Build Estimate Modal */}
      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#0C3629]/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-border/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">New estimate</span>
                <h3 className="mt-1 text-2xl font-extrabold text-brand-dark">Build a customer-ready quote</h3>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <FieldLabel>Service</FieldLabel>
                <SelectInput
                  required
                  value={form.serviceId}
                  onChange={(e) => setForm({ ...form, serviceId: e.target.value, extraCodes: [] })}
                >
                  <option value="">Choose service</option>
                  {services
                    .filter((s: any) => s.isActive !== false)
                    .map((s: any) => (
                      <option key={s._id} value={s._id}>
                        {s.name} · from ${s.basePrice}
                      </option>
                    ))}
                </SelectInput>
              </label>

              <label className="block">
                <FieldLabel>Customer name</FieldLabel>
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Email</FieldLabel>
                <TextInput required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Phone</FieldLabel>
                <TextInput required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Property type</FieldLabel>
                <SelectInput value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="OTHER">Other</option>
                </SelectInput>
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Address</FieldLabel>
                <TextInput required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>City</FieldLabel>
                <TextInput required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>ZIP / postal</FieldLabel>
                <TextInput required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Frequency</FieldLabel>
                <SelectInput value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  <option value="ONE_TIME">One time</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BI_WEEKLY">Every 2 weeks</option>
                  <option value="MONTHLY">Monthly</option>
                </SelectInput>
              </label>

              {form.propertyType === "HOME" ? (
                <>
                  <label className="block">
                    <FieldLabel>Bedrooms</FieldLabel>
                    <TextInput
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <FieldLabel>Bathrooms</FieldLabel>
                    <TextInput
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.bathrooms}
                      onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    />
                  </label>
                </>
              ) : null}

              {selected?.pricing?.extras?.filter((x: any) => x.isActive !== false).length ? (
                <div className="sm:col-span-2">
                  <FieldLabel>Add-ons</FieldLabel>
                  <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    {selected.pricing.extras
                      .filter((x: any) => x.isActive !== false)
                      .map((x: any) => (
                        <label
                          key={x.code}
                          className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 p-3 text-sm hover:bg-[#F4FAF5]/40 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                            checked={form.extraCodes.includes(x.code)}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                extraCodes: e.target.checked
                                  ? [...form.extraCodes, x.code]
                                  : form.extraCodes.filter((c: string) => c !== x.code),
                              })
                            }
                          />
                          <span className="flex-1 font-semibold text-brand-dark">{x.name}</span>
                          <span className="font-extrabold text-emerald-700">+${x.price}</span>
                        </label>
                      ))}
                  </div>
                </div>
              ) : null}

              <div className="sm:col-span-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <FieldLabel>Optional estimate discount</FieldLabel>
                <div className="mt-2 grid gap-2.5 sm:grid-cols-[150px_150px_1fr]">
                  <SelectInput value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="FIXED">Fixed amount</option>
                    <option value="PERCENT">Percentage</option>
                  </SelectInput>
                  <TextInput
                    type="number"
                    min="0"
                    max={form.discountType === "PERCENT" ? 100 : undefined}
                    step="0.01"
                    placeholder={form.discountType === "PERCENT" ? "10" : "25.00"}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  />
                  <TextInput
                    maxLength={120}
                    placeholder="Label, e.g. New customer"
                    value={form.discountLabel}
                    onChange={(e) => setForm({ ...form, discountLabel: e.target.value })}
                  />
                </div>
              </div>

              <label className="sm:col-span-2 block">
                <FieldLabel>Terms (one per line)</FieldLabel>
                <TextArea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Optional notes</FieldLabel>
                <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Expires in days</FieldLabel>
                <TextInput
                  type="number"
                  min="1"
                  max="90"
                  value={form.expiresInDays}
                  onChange={(e) => setForm({ ...form, expiresInDays: e.target.value })}
                />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-3 border-t border-border/60 pt-5">
                <button
                  type="button"
                  className="rounded-full border border-emerald-950/15 px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
                  disabled={createState.isLoading}
                >
                  {createState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create estimate
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
