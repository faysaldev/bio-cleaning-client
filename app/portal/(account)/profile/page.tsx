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
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-green">Profile & preferences</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-.04em] text-brand-dark">Help us prepare for every visit</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Keep addresses, access notes, pets, and communication preferences current. Your sign-in email is <strong>{data.customer.email}</strong>.</p>
      </div>
      {message ? <div className="feedback-panel border-brand-green/20 bg-brand-green/5 text-brand-dark">{message}</div> : null}
      {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-brand-dark">Contact preferences</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="field-group"><span className="field-label">Name</span><input className="field-control" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} /></label>
          <label className="field-group"><span className="field-label">Phone</span><input className="field-control" value={form.phone || ""} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} inputMode="tel" /></label>
          <label className="field-group"><span className="field-label">Preferred contact method</span><select className="field-control" value={form.preferences?.contactMethod || "EMAIL"} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, contactMethod: e.target.value as "EMAIL"|"PHONE"|"SMS" } }))}><option value="EMAIL">Email</option><option value="PHONE">Phone</option><option value="SMS">SMS (when enabled)</option></select></label>
          <label className="field-group"><span className="field-label">Best time to contact</span><input className="field-control" placeholder="e.g. Weekdays after 4 PM" value={form.preferences?.preferredContactWindow || ""} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, preferredContactWindow: e.target.value } }))} /></label>
        </div>
        <label className="field-group mt-4"><span className="field-label">Cleaning preferences</span><textarea className="field-control min-h-28 py-3" value={form.preferences?.serviceNotes || ""} onChange={(e) => setForm((c) => ({ ...c, preferences: { ...c.preferences, serviceNotes: e.target.value } }))} placeholder="Products to avoid, rooms to prioritize, special surfaces…" /></label>
        <label className="field-group mt-4"><span className="field-label">Access instructions</span><textarea className="field-control min-h-28 py-3" value={form.accessInstructions || ""} onChange={(e) => setForm((c) => ({ ...c, accessInstructions: e.target.value }))} placeholder="Gate, parking, concierge, key or arrival instructions. Avoid storing sensitive alarm codes here." /></label>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-brand-dark">Service addresses</h2><p className="mt-1 text-sm text-muted-foreground">Save up to 20 locations and choose your primary address.</p></div><button className="btn-secondary" type="button" onClick={() => setForm((c) => ({ ...c, addresses: [...c.addresses, { ...emptyAddress(), isPrimary: c.addresses.length === 0 }] }))}><Plus className="h-4 w-4" />Add address</button></div>
        <div className="mt-5 space-y-4">
          {form.addresses.map((address, index) => <div key={address._id || index} className="rounded-2xl border border-border bg-brand-cream/35 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-bold text-brand-dark"><input type="radio" name="primary-address" checked={Boolean(address.isPrimary)} onChange={() => setPrimary(index)} />Primary</label><button type="button" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-white hover:text-destructive" aria-label="Remove address" onClick={() => removeAddress(index)}><Trash2 className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><input className="field-control" placeholder="Label (Home, Office)" value={address.label || ""} onChange={(e) => setAddress(index,{label:e.target.value})}/><select className="field-control" value={address.propertyType || "HOME"} onChange={(e)=>setAddress(index,{propertyType:e.target.value as any})}><option value="HOME">Home</option><option value="OFFICE">Office</option><option value="OTHER">Other</option></select><input className="field-control sm:col-span-2" placeholder="Street address" value={address.line1} onChange={(e)=>setAddress(index,{line1:e.target.value})}/><input className="field-control sm:col-span-2" placeholder="Apt / suite / unit" value={address.line2 || ""} onChange={(e)=>setAddress(index,{line2:e.target.value})}/><input className="field-control" placeholder="City" value={address.city} onChange={(e)=>setAddress(index,{city:e.target.value})}/><input className="field-control" placeholder="State / region" value={address.state || ""} onChange={(e)=>setAddress(index,{state:e.target.value})}/><input className="field-control" placeholder="ZIP / postal code" value={address.zip} onChange={(e)=>setAddress(index,{zip:e.target.value})}/><input className="field-control" placeholder="Country" value={address.country || ""} onChange={(e)=>setAddress(index,{country:e.target.value})}/></div>
          </div>)}
          {!form.addresses.length ? <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No saved addresses yet.</div> : null}
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-brand-dark">Pets</h2><p className="mt-1 text-sm text-muted-foreground">This helps the cleaning team arrive prepared and keep doors/gates secure.</p></div><button className="btn-secondary" type="button" onClick={() => setForm((c) => ({ ...c, pets: [...(c.pets || []), emptyPet()] }))}><Plus className="h-4 w-4" />Add pet</button></div>
        <div className="mt-5 space-y-3">{(form.pets || []).map((pet,index)=><div key={pet._id || index} className="grid gap-3 rounded-2xl border border-border bg-brand-cream/35 p-4 sm:grid-cols-[1fr_1fr_2fr_auto]"><input className="field-control" placeholder="Name" value={pet.name || ""} onChange={(e)=>setPet(index,{name:e.target.value})}/><input className="field-control" placeholder="Type (dog, cat…)" value={pet.type} onChange={(e)=>setPet(index,{type:e.target.value})}/><input className="field-control" placeholder="Notes" value={pet.notes || ""} onChange={(e)=>setPet(index,{notes:e.target.value})}/><button type="button" className="grid h-11 w-11 place-items-center rounded-lg text-muted-foreground hover:bg-white hover:text-destructive" aria-label="Remove pet" onClick={()=>setForm((c)=>({...c,pets:(c.pets||[]).filter((_,i)=>i!==index)}))}><Trash2 className="h-4 w-4"/></button></div>)}</div>
      </section>

      <div className="flex justify-end"><button type="button" className="btn-primary" onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Saving…" : "Save profile"}</button></div>
    </div>
  );
}
