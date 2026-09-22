"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
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
      setError(err?.data?.message || "We could not submit your application. Please check your details and try again.");
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-green/20 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-lime text-brand-dark mb-4">
          <CheckCircle2 className="h-8 w-8 text-brand-dark" />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-dark">Application Received!</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thank you for applying to BIO Cleaning. Our hiring team in Aurora will review your credentials and reach out within 1-2 business days for an initial phone screen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl rounded-3xl border border-brand-green/15 bg-white p-8 sm:p-10 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-green pb-4 border-b border-brand-green/10 mb-6">
        <Sparkles className="h-4 w-4 text-brand-lime" />
        <span>Join Our Certified Colorado Field Crew</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label">Full Name</label>
          <input
            required
            className="field-control"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="field-label">Phone Number</label>
          <input
            required
            type="tel"
            className="field-control"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(303) 555-0199"
          />
        </div>

        <div>
          <label className="field-label">Email Address</label>
          <input
            required
            type="email"
            className="field-control"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="field-label">Preferred Service Area</label>
          <input
            className="field-control"
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            placeholder="Aurora, Arvada, Denver, etc."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Cleaning Experience or Certifications</label>
          <textarea
            className="field-control min-h-24 py-3"
            maxLength={1200}
            value={form.experience}
            onChange={(e) => update("experience", e.target.value)}
            placeholder="Tell us about your residential or commercial cleaning background, attention to detail, or references."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Availability & Preferred Weekly Hours</label>
          <textarea
            className="field-control min-h-24 py-3"
            maxLength={600}
            value={form.availability}
            onChange={(e) => update("availability", e.target.value)}
            placeholder="Available days of the week, morning or afternoon preferences, full-time or part-time."
          />
        </div>
      </div>

      {error ? (
        <div className="feedback-panel mt-5 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive text-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary rounded-full px-8 min-h-[48px] text-sm font-extrabold w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting Application…
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
