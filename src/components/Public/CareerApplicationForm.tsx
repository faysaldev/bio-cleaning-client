"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSubmitContactFormMutation } from "@/src/redux/features/contact/contactApi";

export function CareerApplicationForm() {
  const [submitContact, { isLoading }] = useSubmitContactFormMutation();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", experience: "", availability: "", area: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await submitContact({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        service: "Careers / Cleaning Team",
        leadSource: "CAREERS",
        message: `Career application\nExperience: ${form.experience || "Not provided"}\nAvailability: ${form.availability || "Not provided"}\nPreferred area: ${form.area || "Not provided"}`,
      }).unwrap();
      setDone(true);
    } catch (err: any) {
      setError(err?.data?.message || "We could not send your application. Please try again.");
    }
  };

  if (done) return <div className="surface mx-auto max-w-2xl p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-brand-green"/><h2 className="mt-4 text-2xl font-extrabold text-brand-dark">Application received</h2><p className="mt-2 text-sm text-muted-foreground">Your application is now in the same CRM pipeline our operations team uses for follow-up.</p></div>;

  return <form onSubmit={submit} className="surface mx-auto max-w-3xl p-6 sm:p-8">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="field-group"><span className="field-label">Full name</span><input required className="field-control" value={form.fullName} onChange={(e)=>update("fullName",e.target.value)}/></label>
      <label className="field-group"><span className="field-label">Phone</span><input required className="field-control" value={form.phone} onChange={(e)=>update("phone",e.target.value)}/></label>
      <label className="field-group"><span className="field-label">Email</span><input required type="email" className="field-control" value={form.email} onChange={(e)=>update("email",e.target.value)}/></label>
      <label className="field-group"><span className="field-label">Preferred service area</span><input className="field-control" value={form.area} onChange={(e)=>update("area",e.target.value)} placeholder="City / area"/></label>
      <label className="field-group sm:col-span-2"><span className="field-label">Cleaning / field experience</span><textarea className="field-control min-h-28 py-3" maxLength={1200} value={form.experience} onChange={(e)=>update("experience",e.target.value)} placeholder="Tell us about relevant experience, skills or certifications."/></label>
      <label className="field-group sm:col-span-2"><span className="field-label">Availability</span><textarea className="field-control min-h-24 py-3" maxLength={600} value={form.availability} onChange={(e)=>update("availability",e.target.value)} placeholder="Days, times and preferred weekly schedule."/></label>
    </div>
    {error?<div className="feedback-panel mt-4 border-destructive/20 bg-destructive/5 text-destructive">{error}</div>:null}
    <button disabled={isLoading} className="btn-primary mt-6">{isLoading?<Loader2 className="h-4 w-4 animate-spin"/>:<Send className="h-4 w-4"/>}{isLoading?"Sending…":"Submit application"}</button>
  </form>;
}
