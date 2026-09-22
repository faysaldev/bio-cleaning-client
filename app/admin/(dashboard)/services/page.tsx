"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Clock3, Image as ImageIcon, Loader2, Pencil, Plus, Sparkles, Trash2, Upload, Users, X, ShieldCheck } from "lucide-react";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetAllServicesAdminQuery,
  useUpdateServiceMutation,
} from "@/src/redux/features/services/servicesApi";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import type { CleaningService, ServiceExtra, ServicePromotion } from "@/src/redux/features/services/types";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";

const frequencyDefaults = [
  { frequency: "ONE_TIME" as const, percent: 0 },
  { frequency: "WEEKLY" as const, percent: 15 },
  { frequency: "BI_WEEKLY" as const, percent: 10 },
  { frequency: "MONTHLY" as const, percent: 5 },
];

function blankService(): Partial<CleaningService> {
  return {
    name: "",
    description: "",
    basePrice: 0,
    includes: [],
    image: "",
    duration: "180 min",
    tags: [],
    isActive: true,
    pricing: {
      minimumPrice: 89,
      taxRate: 0,
      propertyPricingMode: "BED_BATH",
      includedBedrooms: 1,
      includedBathrooms: 1,
      additionalBedroomPrice: 40,
      additionalBathroomPrice: 25,
      additionalBedroomMinutes: 30,
      additionalBathroomMinutes: 20,
      squareFootageTiers: [],
      frequencyDiscounts: frequencyDefaults,
      extras: [],
      promotions: [],
    },
    scheduling: {
      durationMinutes: 180,
      requiredStaff: 1,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      preparationInstructions: [],
    },
  };
}

export default function AdminServicesPage() {
  const { data, isLoading, isError, refetch } = useGetAllServicesAdminQuery({});
  const services = ((data as any)?.data || []) as CleaningService[];
  const [createService, { isLoading: creating }] = useCreateServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadFileMutation();
  const [editing, setEditing] = useState<string>();
  const [form, setForm] = useState<Partial<CleaningService>>(blankService());
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const current = useMemo(() => services.find((service) => service._id === editing), [services, editing]);

  const startAdd = () => {
    setEditing(undefined);
    setForm(blankService());
    setError("");
    setOpen(true);
  };

  const startEdit = (service: CleaningService) => {
    setEditing(service._id);
    setForm({
      ...blankService(),
      ...JSON.parse(JSON.stringify(service)),
      pricing: { ...blankService().pricing, ...JSON.parse(JSON.stringify(service.pricing || {})) },
      scheduling: { ...blankService().scheduling, ...JSON.parse(JSON.stringify(service.scheduling || {})) },
    });
    setError("");
    setOpen(true);
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    try {
      const result: any = await uploadFile(body).unwrap();
      const url = result?.data?.url || result?.url;
      if (url) setForm((prev) => ({ ...prev, image: url }));
    } catch {
      setError("Image upload failed.");
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const durationMinutes = Math.max(15, Number(form.scheduling?.durationMinutes || 180));
    const payload = {
      ...form,
      basePrice: Number(form.basePrice || 0),
      duration: `${durationMinutes} min`,
      includes: form.includes || [],
      tags: form.tags || [],
      image: form.image || "",
      pricing: form.pricing,
      scheduling: { ...form.scheduling, durationMinutes },
    };
    try {
      if (editing) await updateService({ id: editing, data: payload }).unwrap();
      else await createService(payload).unwrap();
      setOpen(false);
    } catch (err: any) {
      setError(err?.data?.message || "Service could not be saved. Check all pricing and scheduling fields.");
    }
  };

  if (isLoading) return <LoadingState label="Loading cleaning services…" />;
  if (isError) {
    return (
      <ErrorState
        title="Services are unavailable"
        description="We couldn’t load your service catalog."
        action={
          <button onClick={() => refetch()} className="btn-secondary rounded-full">
            Try again
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
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Bookable Catalog
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Services, pricing & duration
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Configure the real service definitions used by backend pricing and live scheduling: duration, required staff, bedroom/bathroom rules, add-ons, recurrence discounts, and promo codes.
            </p>
          </div>
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add service
          </button>
        </div>
      </section>

      {/* Services Grid */}
      {services.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No services yet"
          description="Create the first live service for public booking."
          action={
            <button onClick={startAdd} className="btn-primary rounded-full">
              Add service
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4">
                  {service.image ? (
                    <img src={service.image} alt="" className="h-20 w-20 rounded-2xl object-cover border border-emerald-950/10 shrink-0" />
                  ) : (
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        service.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {service.isActive ? "Published" : "Draft"}
                    </span>
                    <h3 className="mt-1.5 truncate text-lg font-extrabold text-brand-dark">{service.name}</h3>
                    <p className="mt-0.5 text-sm font-extrabold text-emerald-700">From ${service.basePrice}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-2.5 py-1">
                    <Clock3 className="h-3 w-3 text-emerald-700" />
                    {service.scheduling?.durationMinutes || service.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-2.5 py-1">
                    <Users className="h-3 w-3 text-emerald-700" />
                    {service.scheduling?.requiredStaff || 1} staff
                  </span>
                  <span className="rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-2.5 py-1">
                    {service.pricing?.extras?.length || 0} extras
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(service)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-emerald-950/15 text-brand-dark hover:bg-emerald-50 transition-colors"
                    aria-label={`Edit ${service.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5 text-emerald-700" />
                  </button>
                  <button
                    disabled={deleting}
                    onClick={() => window.confirm("Delete this service?") && deleteService(service._id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => updateService({ id: service._id, data: { isActive: !service.isActive } })}
                  className="rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                >
                  {service.isActive ? "Unpublish" : "Publish"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Service Editor Drawer */}
      {open ? (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Close editor"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0C3629]/50 backdrop-blur-sm transition-opacity"
          />
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-white p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                  {editing ? "Edit service" : "New service"}
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">
                  {current?.name || form.name || "Service configuration"}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
                {error}
              </div>
            ) : null}

            <form onSubmit={save} className="mt-6 space-y-7">
              <Section title="Core service">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Service name">
                    <input
                      required
                      className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Base price">
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={form.basePrice || 0}
                      onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <textarea
                        required
                        className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-24"
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Includes (one per line)">
                    <textarea
                      className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-24"
                      value={(form.includes || []).join("\n")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          includes: e.target.value
                            .split("\n")
                            .map((v) => v.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>
                  <Field label="Tags (comma separated)">
                    <textarea
                      className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-24"
                      value={(form.tags || []).join(", ")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          tags: e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>
                </div>
                <Field label="Service image">
                  {form.image ? (
                    <div className="mb-2 overflow-hidden rounded-2xl border border-border">
                      <img src={form.image} alt="" className="h-36 w-full object-cover" />
                    </div>
                  ) : null}
                  <label className="inline-flex items-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 cursor-pointer">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-emerald-700" />}
                    Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={upload} />
                  </label>
                </Field>
              </Section>

              <Section title="Duration & crew">
                <div className="grid gap-4 sm:grid-cols-4">
                  <NumberField
                    label="Duration (min)"
                    value={form.scheduling?.durationMinutes || 180}
                    onChange={(v) => setForm({ ...form, scheduling: { ...form.scheduling, durationMinutes: v } })}
                  />
                  <NumberField
                    label="Required staff"
                    value={form.scheduling?.requiredStaff || 1}
                    onChange={(v) => setForm({ ...form, scheduling: { ...form.scheduling, requiredStaff: v } })}
                  />
                  <NumberField
                    label="Buffer before"
                    value={form.scheduling?.bufferBeforeMinutes || 0}
                    onChange={(v) => setForm({ ...form, scheduling: { ...form.scheduling, bufferBeforeMinutes: v } })}
                  />
                  <NumberField
                    label="Buffer after"
                    value={form.scheduling?.bufferAfterMinutes || 0}
                    onChange={(v) => setForm({ ...form, scheduling: { ...form.scheduling, bufferAfterMinutes: v } })}
                  />
                </div>
                <Field label="Preparation instructions (one per line)">
                  <textarea
                    className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-24"
                    value={(form.scheduling?.preparationInstructions || []).join("\n")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        scheduling: {
                          ...form.scheduling,
                          preparationInstructions: e.target.value
                            .split("\n")
                            .map((v) => v.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                  />
                </Field>
              </Section>

              <Section title="Property pricing">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Pricing mode">
                    <select
                      className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                      value={form.pricing?.propertyPricingMode || "BED_BATH"}
                      onChange={(e) =>
                        setForm({ ...form, pricing: { ...form.pricing, propertyPricingMode: e.target.value as any } })
                      }
                    >
                      <option value="FIXED">Fixed</option>
                      <option value="BED_BATH">Bedroom / bathroom</option>
                      <option value="SQUARE_FOOTAGE">Square footage</option>
                    </select>
                  </Field>
                  <NumberField
                    label="Minimum price"
                    value={form.pricing?.minimumPrice || 0}
                    onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, minimumPrice: v } })}
                  />
                  <NumberField
                    label="Tax %"
                    value={form.pricing?.taxRate || 0}
                    onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, taxRate: v } })}
                  />
                </div>

                {form.pricing?.propertyPricingMode === "BED_BATH" ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <NumberField
                      label="Bedrooms included"
                      value={form.pricing?.includedBedrooms ?? 1}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, includedBedrooms: v } })}
                    />
                    <NumberField
                      label="Extra bedroom $"
                      value={form.pricing?.additionalBedroomPrice || 0}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, additionalBedroomPrice: v } })}
                    />
                    <NumberField
                      label="Extra bedroom min"
                      value={form.pricing?.additionalBedroomMinutes || 0}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, additionalBedroomMinutes: v } })}
                    />
                    <NumberField
                      label="Bathrooms included"
                      value={form.pricing?.includedBathrooms ?? 1}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, includedBathrooms: v } })}
                    />
                    <NumberField
                      label="Extra bathroom $"
                      value={form.pricing?.additionalBathroomPrice || 0}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, additionalBathroomPrice: v } })}
                    />
                    <NumberField
                      label="Extra bathroom min"
                      value={form.pricing?.additionalBathroomMinutes || 0}
                      onChange={(v) => setForm({ ...form, pricing: { ...form.pricing, additionalBathroomMinutes: v } })}
                    />
                  </div>
                ) : null}

                {form.pricing?.propertyPricingMode === "SQUARE_FOOTAGE" ? (
                  <Repeater
                    title="Square-footage tiers"
                    onAdd={() =>
                      setForm({
                        ...form,
                        pricing: {
                          ...form.pricing,
                          squareFootageTiers: [
                            ...(form.pricing?.squareFootageTiers || []),
                            { minSqFt: 0, maxSqFt: undefined, priceAdjustment: 0, durationAdjustmentMinutes: 0 },
                          ],
                        },
                      })
                    }
                  >
                    {(form.pricing?.squareFootageTiers || []).map((tier, i) => (
                      <div key={i} className="grid gap-2 rounded-2xl border border-emerald-950/10 bg-white p-3.5 sm:grid-cols-5">
                        <TinyNumber label="Min sq ft" value={tier.minSqFt} onChange={(v) => patchTier(i, { minSqFt: v }, form, setForm)} />
                        <TinyNumber
                          label="Max sq ft"
                          value={tier.maxSqFt || 0}
                          onChange={(v) => patchTier(i, { maxSqFt: v || undefined }, form, setForm)}
                        />
                        <TinyNumber label="Price +/-" value={tier.priceAdjustment} onChange={(v) => patchTier(i, { priceAdjustment: v }, form, setForm)} />
                        <TinyNumber
                          label="Minutes +"
                          value={tier.durationAdjustmentMinutes}
                          onChange={(v) => patchTier(i, { durationAdjustmentMinutes: v }, form, setForm)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              pricing: {
                                ...form.pricing,
                                squareFootageTiers: form.pricing?.squareFootageTiers?.filter((_, index) => index !== i),
                              },
                            })
                          }
                          className="self-end rounded-full border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </Repeater>
                ) : null}
              </Section>

              <Section title="Recurrence discounts">
                <div className="grid gap-3 sm:grid-cols-4">
                  {(form.pricing?.frequencyDiscounts || frequencyDefaults).map((item, i) => (
                    <TinyNumber
                      key={item.frequency}
                      label={item.frequency.replaceAll("_", " ")}
                      value={item.percent}
                      onChange={(value) => {
                        const list = [...(form.pricing?.frequencyDiscounts || frequencyDefaults)];
                        list[i] = { ...item, percent: value };
                        setForm({ ...form, pricing: { ...form.pricing, frequencyDiscounts: list } });
                      }}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Add-ons">
                <Repeater
                  title="Extras"
                  onAdd={() =>
                    setForm({
                      ...form,
                      pricing: {
                        ...form.pricing,
                        extras: [
                          ...(form.pricing?.extras || []),
                          {
                            code: `EXTRA${(form.pricing?.extras?.length || 0) + 1}`,
                            name: "New extra",
                            price: 0,
                            durationMinutes: 0,
                            additionalStaff: 0,
                            isActive: true,
                          },
                        ],
                      },
                    })
                  }
                >
                  {(form.pricing?.extras || []).map((extra, i) => (
                    <ExtraRow
                      key={`${extra.code}-${i}`}
                      extra={extra}
                      onChange={(patch) => patchExtra(i, patch, form, setForm)}
                      onDelete={() =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            extras: form.pricing?.extras?.filter((_, index) => index !== i),
                          },
                        })
                      }
                    />
                  ))}
                </Repeater>
              </Section>

              <Section title="Promo codes">
                <Repeater
                  title="Promotions"
                  onAdd={() =>
                    setForm({
                      ...form,
                      pricing: {
                        ...form.pricing,
                        promotions: [
                          ...(form.pricing?.promotions || []),
                          {
                            code: `PROMO${(form.pricing?.promotions?.length || 0) + 1}`,
                            type: "PERCENT",
                            value: 10,
                            isActive: true,
                          },
                        ],
                      },
                    })
                  }
                >
                  {(form.pricing?.promotions || []).map((promo, i) => (
                    <PromoRow
                      key={`${promo.code}-${i}`}
                      promo={promo}
                      onChange={(patch) => patchPromo(i, patch, form, setForm)}
                      onDelete={() =>
                        setForm({
                          ...form,
                          pricing: {
                            ...form.pricing,
                            promotions: form.pricing?.promotions?.filter((_, index) => index !== i),
                          },
                        })
                      }
                    />
                  ))}
                </Repeater>
              </Section>

              <label className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4 text-sm font-bold text-brand-dark">
                <input
                  type="checkbox"
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                  checked={form.isActive ?? true}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Publish this service for live online booking
              </label>

              <div className="flex justify-end gap-3 border-t border-border/60 pt-5">
                <button
                  type="button"
                  className="rounded-full border border-emerald-950/15 px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating || uploading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
                >
                  {creating || updating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editing ? "Save service" : "Create service"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-emerald-800">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        step="0.01"
        className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

function TinyNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <input
        type="number"
        className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Repeater({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-700" /> Add
        </button>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function ExtraRow({
  extra,
  onChange,
  onDelete,
}: {
  extra: ServiceExtra;
  onChange: (patch: Partial<ServiceExtra>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-emerald-950/10 bg-white p-3 sm:grid-cols-8">
      <input
        aria-label="Extra code"
        className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs uppercase focus:outline-none"
        value={extra.code}
        onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
      />
      <input
        aria-label="Extra name"
        className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none sm:col-span-2"
        value={extra.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <input
        aria-label="Extra price"
        type="number"
        min="0"
        step="0.01"
        className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
        value={extra.price}
        onChange={(e) => onChange({ price: Number(e.target.value) })}
      />
      <input
        aria-label="Added minutes"
        type="number"
        min="0"
        className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
        title="Added minutes"
        value={extra.durationMinutes}
        onChange={(e) => onChange({ durationMinutes: Number(e.target.value) })}
      />
      <input
        aria-label="Additional staff"
        type="number"
        min="0"
        max="20"
        className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
        title="Additional staff"
        value={extra.additionalStaff}
        onChange={(e) => onChange({ additionalStaff: Number(e.target.value) })}
      />
      <label className="flex items-center gap-1.5 px-2 text-xs font-bold text-brand-dark">
        <input
          type="checkbox"
          checked={extra.isActive}
          onChange={(e) => onChange({ isActive: e.target.checked })}
        />
        Active
      </label>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-full border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
        aria-label={`Delete ${extra.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function PromoRow({
  promo,
  onChange,
  onDelete,
}: {
  promo: ServicePromotion;
  onChange: (patch: Partial<ServicePromotion>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-white p-3.5">
      <div className="grid gap-2 sm:grid-cols-6">
        <input
          aria-label="Promo code"
          className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs uppercase focus:outline-none"
          value={promo.code}
          onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
        />
        <select
          aria-label="Promo type"
          className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
          value={promo.type}
          onChange={(e) => onChange({ type: e.target.value as ServicePromotion["type"] })}
        >
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed</option>
        </select>
        <input
          aria-label="Promo value"
          type="number"
          min="0"
          className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
          value={promo.value}
          onChange={(e) => onChange({ value: Number(e.target.value) })}
        />
        <input
          aria-label="Maximum redemptions"
          type="number"
          min="1"
          className="rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
          placeholder="Max uses"
          value={promo.maxRedemptions || ""}
          onChange={(e) => onChange({ maxRedemptions: e.target.value ? Number(e.target.value) : undefined })}
        />
        <label className="flex items-center gap-1.5 px-2 text-xs font-bold text-brand-dark">
          <input
            type="checkbox"
            checked={promo.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          />
          Active
        </label>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
          aria-label={`Delete ${promo.code}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        <label>
          <span className="mb-1 block text-[10px] font-bold text-muted-foreground uppercase">Starts (optional)</span>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
            value={promo.startsAt ? promo.startsAt.slice(0, 16) : ""}
            onChange={(e) => onChange({ startsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </label>
        <label>
          <span className="mb-1 block text-[10px] font-bold text-muted-foreground uppercase">Ends (optional)</span>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-emerald-950/15 px-2.5 py-1 text-xs focus:outline-none"
            value={promo.endsAt ? promo.endsAt.slice(0, 16) : ""}
            onChange={(e) => onChange({ endsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </label>
      </div>
      {promo.redemptionCount ? (
        <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
          Used {promo.redemptionCount} time{promo.redemptionCount === 1 ? "" : "s"}.
        </p>
      ) : null}
    </div>
  );
}

function patchExtra(
  index: number,
  patch: Partial<ServiceExtra>,
  form: Partial<CleaningService>,
  setForm: (value: Partial<CleaningService>) => void
) {
  const list = [...(form.pricing?.extras || [])];
  list[index] = { ...list[index], ...patch };
  setForm({ ...form, pricing: { ...form.pricing, extras: list } });
}

function patchPromo(
  index: number,
  patch: Partial<ServicePromotion>,
  form: Partial<CleaningService>,
  setForm: (value: Partial<CleaningService>) => void
) {
  const list = [...(form.pricing?.promotions || [])];
  list[index] = { ...list[index], ...patch };
  setForm({ ...form, pricing: { ...form.pricing, promotions: list } });
}

function patchTier(
  index: number,
  patch: Record<string, any>,
  form: Partial<CleaningService>,
  setForm: (value: Partial<CleaningService>) => void
) {
  const list = [...(form.pricing?.squareFootageTiers || [])];
  list[index] = { ...list[index], ...patch };
  setForm({ ...form, pricing: { ...form.pricing, squareFootageTiers: list } });
}
