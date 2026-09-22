"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPortalSessionQuery, useUpdatePortalProfileMutation } from "@/src/redux/features/portal/portalApi";
import type { PortalAddress, PortalCustomer } from "@/src/redux/features/portal/types";

const emptyAddress = (): PortalAddress => ({ label: "Home", line1: "", line2: "", city: "", state: "", zip: "", country: "", propertyType: "HOME", isPrimary: false });
const emptyPet = () => ({ name: "", type: "", notes: "" });

type FormState = Pick<PortalCustomer, "name" | "phone" | "addresses" | "preferences" | "accessInstructions" | "pets">;

export default function PortalProfilePage() {
  const { data, isLoading, isError, refetch } = useGetPortalSessionQuery();
  const [updateProfile, { isLoading: saving }] = useUpdatePortalProfileMutation();
  const [form, setForm] = useState<FormState>({ name: "", phone: "", addresses: [], preferences: { contactMethod: "EMAIL" }, accessInstructions: "", pets: [] });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data?.customer) return;
    setForm({
      name: data.customer.name || "",
      phone: data.customer.phone || "",
      addresses: (data.customer.addresses || []).map((address) => ({ ...address })),
      preferences: { contactMethod: "EMAIL", ...(data.customer.preferences || {}) },
      accessInstructions: data.customer.accessInstructions || "",
      pets: (data.customer.pets || []).map((pet) => ({ ...pet })),
    });
  }, [data]);

  if (isLoading) return <LoadingState label="Loading profile…" />;
  if (isError || !data?.customer) return <ErrorState action={<button className="btn-secondary" onClick={() => refetch()}>Try again</button>} />;

  const setAddress = (index: number, patch: Partial<PortalAddress>) => {
    setForm((current) => ({ ...current, addresses: current.addresses.map((item, i) => i === index ? { ...item, ...patch } : item) }));
  };
  const setPrimary = (index: number) => {
    setForm((current) => ({ ...current, addresses: current.addresses.map((item, i) => ({ ...item, isPrimary: i === index })) }));
  };
  const removeAddress = (index: number) => setForm((current) => ({ ...current, addresses: current.addresses.filter((_, i) => i !== index).map((item, i) => ({ ...item, isPrimary: item.isPrimary || i === 0 })) }));
  const setPet = (index: number, patch: Record<string, string>) => setForm((current) => ({ ...current, pets: (current.pets || []).map((item, i) => i === index ? { ...item, ...patch } : item) }));

  const save = async () => {
    setMessage(""); setError("");
    if (!form.name.trim()) { setError("Your name is required."); return; }
    if (form.addresses.some((address) => !address.line1.trim() || !address.city.trim() || !address.zip.trim())) { setError("Every saved address needs a street, city, and ZIP/postal code."); return; }
    if ((form.pets || []).some((pet) => !pet.type.trim())) { setError("Every pet entry needs a type, such as dog or cat."); return; }
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone?.trim() || "",
        addresses: form.addresses.map(({ _id, ...address }) => address),
        preferences: form.preferences,
        accessInstructions: form.accessInstructions?.trim() || "",
        pets: (form.pets || []).map(({ _id, ...pet }) => ({ ...pet, name: pet.name?.trim() || undefined, type: pet.type.trim(), notes: pet.notes?.trim() || undefined })),
      }).unwrap();
      setMessage("Your preferences have been saved.");
      await refetch();
    } catch (e: any) { setError(e?.data?.message || "We could not save your profile."); }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
          Profile & Preferences
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
          Help Us Prepare for Every Visit
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Keep addresses, access notes, pets, and contact preferences current. Your login email is <strong className="text-brand-dark">{data.customer.email}</strong>.
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-brand-green/20 bg-[#F4FAF5] p-4 text-xs font-semibold text-brand-dark">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          {error}
        </div>
      ) : null}

      {/* Contact Preferences */}
      <section className="rounded-3xl border border-brand-green/12 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-brand-dark">Contact Information</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="field-group">
            <span className="field-label text-xs font-bold text-brand-dark">Full Name</span>
            <input className="field-control rounded-xl" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} />
          </label>
          <label className="field-group">
            <span className="field-label text-xs font-bold text-brand-dark">Phone Number</span>
            <input className="field-control rounded-xl" value={form.phone || ""} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} inputMode="tel" />
          </label>
          <label className="field-group">
            <span className="field-label text-xs font-bold text-brand-dark">Preferred Contact Method</span>
            <select className="field-control rounded-xl" value={form.preferences?.contactMethod || "EMAIL"} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, contactMethod: e.target.value as "EMAIL"|"PHONE"|"SMS" } }))}>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone Call</option>
              <option value="SMS">SMS Text Message</option>
            </select>
          </label>
          <label className="field-group">
            <span className="field-label text-xs font-bold text-brand-dark">Best Time to Contact</span>
            <input className="field-control rounded-xl" placeholder="e.g. Weekdays after 3 PM" value={form.preferences?.preferredContactWindow || ""} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, preferredContactWindow: e.target.value } }))} />
          </label>
        </div>
        <label className="field-group mt-4">
          <span className="field-label text-xs font-bold text-brand-dark">Cleaning & Surface Preferences</span>
          <textarea className="field-control rounded-xl min-h-28 py-3" value={form.preferences?.serviceNotes || ""} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, serviceNotes: e.target.value } }))} placeholder="Delicate surfaces, high-priority rooms, fragrance sensitivities, or special instructions…" />
        </label>
        <label className="field-group mt-4">
          <span className="field-label text-xs font-bold text-brand-dark">Entry & Access Instructions</span>
          <textarea className="field-control rounded-xl min-h-28 py-3" value={form.accessInstructions || ""} onChange={(e) => setForm((c) => ({ ...c, accessInstructions: e.target.value }))} placeholder="Key lockbox, front desk / concierge, gate code or parking instructions. (Avoid writing alarm master codes here)." />
        </label>
      </section>

      {/* Service Addresses */}
      <section className="rounded-3xl border border-brand-green/12 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-green/8">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark">Service Locations</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Save multiple addresses and designate your default cleaning location.</p>
          </div>
          <button
            className="btn-secondary rounded-full px-4 text-xs font-bold"
            type="button"
            onClick={() => setForm((c) => ({ ...c, addresses: [...c.addresses, { ...emptyAddress(), isPrimary: c.addresses.length === 0 }] }))}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Address
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {form.addresses.map((address, index) => (
            <div key={address._id || index} className="rounded-2xl border border-brand-green/15 bg-[#F7FAF8] p-5">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-extrabold text-brand-dark cursor-pointer">
                  <input
                    type="radio"
                    name="primary-address"
                    checked={Boolean(address.isPrimary)}
                    onChange={() => setPrimary(index)}
                    className="accent-brand-green h-4 w-4"
                  />
                  <span>Primary Location</span>
                </label>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white hover:text-destructive transition"
                  aria-label="Remove address"
                  onClick={() => removeAddress(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className="field-control rounded-xl" placeholder="Label (Home, Townhouse, Office)" value={address.label || ""} onChange={(e) => setAddress(index, { label: e.target.value })} />
                <select className="field-control rounded-xl" value={address.propertyType || "HOME"} onChange={(e) => setAddress(index, { propertyType: e.target.value as any })}>
                  <option value="HOME">Single Family Home</option>
                  <option value="OFFICE">Office / Commercial</option>
                  <option value="OTHER">Other / Apartment</option>
                </select>
                <input className="field-control rounded-xl sm:col-span-2" placeholder="Street address" value={address.line1} onChange={(e) => setAddress(index, { line1: e.target.value })} />
                <input className="field-control rounded-xl sm:col-span-2" placeholder="Apt / suite / unit (optional)" value={address.line2 || ""} onChange={(e) => setAddress(index, { line2: e.target.value })} />
                <input className="field-control rounded-xl" placeholder="City" value={address.city} onChange={(e) => setAddress(index, { city: e.target.value })} />
                <input className="field-control rounded-xl" placeholder="State (e.g. CO)" value={address.state || ""} onChange={(e) => setAddress(index, { state: e.target.value })} />
                <input className="field-control rounded-xl" placeholder="ZIP code" value={address.zip} onChange={(e) => setAddress(index, { zip: e.target.value })} />
                <input className="field-control rounded-xl" placeholder="Country" value={address.country || "USA"} onChange={(e) => setAddress(index, { country: e.target.value })} />
              </div>
            </div>
          ))}

          {!form.addresses.length ? (
            <div className="rounded-2xl border border-dashed border-brand-green/20 p-8 text-center text-xs text-muted-foreground">
              No service locations saved yet.
            </div>
          ) : null}
        </div>
      </section>

      {/* Pets */}
      <section className="rounded-3xl border border-brand-green/12 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-green/8">
          <div>
            <h2 className="text-lg font-extrabold text-brand-dark">Pets on Premises</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Helps our technicians use pet-safe protocol and secure gates upon arrival.</p>
          </div>
          <button
            className="btn-secondary rounded-full px-4 text-xs font-bold"
            type="button"
            onClick={() => setForm((c) => ({ ...c, pets: [...(c.pets || []), emptyPet()] }))}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Pet
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {(form.pets || []).map((pet, index) => (
            <div key={pet._id || index} className="grid gap-3 rounded-2xl border border-brand-green/15 bg-[#F7FAF8] p-4 sm:grid-cols-[1fr_1fr_2fr_auto] items-center">
              <input className="field-control rounded-xl" placeholder="Pet Name (e.g. Luna)" value={pet.name || ""} onChange={(e) => setPet(index, { name: e.target.value })} />
              <input className="field-control rounded-xl" placeholder="Type (Dog, Cat, Bird…)" value={pet.type} onChange={(e) => setPet(index, { type: e.target.value })} />
              <input className="field-control rounded-xl" placeholder="Notes (Friendly, gated in room…)" value={pet.notes || ""} onChange={(e) => setPet(index, { notes: e.target.value })} />
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-white hover:text-destructive transition"
                aria-label="Remove pet"
                onClick={() => setForm((c) => ({ ...c, pets: (c.pets || []).filter((_, i) => i !== index) }))}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {!form.pets?.length ? (
            <div className="rounded-2xl border border-dashed border-brand-green/20 p-6 text-center text-xs text-muted-foreground">
              No pets registered.
            </div>
          ) : null}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="btn-primary rounded-full px-8 py-3 text-xs font-extrabold shadow-md"
          onClick={save}
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving changes…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
