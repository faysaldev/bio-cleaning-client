"use client";

import { SiteLayout } from "@/src/Layouts/SiteLayout";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useRef, useState } from "react";
import { useSubmitContactFormMutation } from "@/src/redux/features/contact/contactApi";

export default function ContactPage() {
  const ref = useGsapReveal<HTMLDivElement>();

  // Refs for uncontrolled form collection
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [submitContact, { isLoading }] = useSubmitContactFormMutation();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const formData = {
      fullName: nameRef.current?.value,
      email: emailRef.current?.value,
      phone: phoneRef.current?.value,
      service: serviceRef.current?.value,
      message: messageRef.current?.value,
    };

    try {
      const res = await submitContact(formData).unwrap();
      setStatus({
        type: "success",
        msg: res.message || "Thanks! Your message has been sent successfully.",
      });
      // Reliable form reset
      formRef.current?.reset();
    } catch (err: any) {
      setStatus({
        type: "error",
        msg:
          err?.data?.message ||
          "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <SiteLayout>
      <div ref={ref}>
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 leaf-bg opacity-50" />
          <div className="container-page relative py-24 text-white text-center">
            <span
              className="pill bg-white/10 text-brand-mint border border-white/10"
              data-reveal
            >
              <MessageCircle className="w-3.5 h-3.5" /> We reply within 1 hour
            </span>
            <h1 className="text-5xl md:text-6xl font-display mt-5" data-reveal>
              Get In Touch
            </h1>
            <p className="mt-3 text-white/80" data-reveal>
              We&apos;d love to hear from you
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page grid md:grid-cols-2 gap-10">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="card-feature space-y-4"
              data-reveal
            >
              <h2 className="text-2xl text-brand-dark">Send a message</h2>

              {status && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${
                    status.type === "success"
                      ? "bg-brand-lime/20 text-brand-green border-brand-lime/30"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  <div className="flex gap-2">
                    {status.type === "success" && (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    {status.msg}
                  </div>
                </div>
              )}

              <Field label="Full Name">
                <input
                  ref={nameRef}
                  required
                  className="input"
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email">
                <input
                  ref={emailRef}
                  required
                  type="email"
                  className="input"
                  placeholder="jane@email.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  ref={phoneRef}
                  className="input"
                  placeholder="(555) 555-5555"
                />
              </Field>
              <Field label="Service Interest">
                <select ref={serviceRef} className="input">
                  <option>Residential Cleaning</option>
                  <option>Commercial Cleaning</option>
                  <option>Deep Cleaning</option>
                  <option>Move-In / Move-Out</option>
                </select>
              </Field>
              <Field label="Message">
                <textarea
                  ref={messageRef}
                  required
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell us about your space…"
                />
              </Field>
              <button
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-70 transition-all"
              >
                {isLoading ? (
                  <>
                    Sending... <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
              <style>{`.input{width:100%;padding:0.7rem 0.9rem;border:1px solid var(--color-border);border-radius:0.6rem;font-size:0.9rem;background:white;outline:none;transition:border .15s}.input:focus{border-color:var(--brand-green);box-shadow:0 0 0 3px color-mix(in oklab, var(--brand-green) 15%, transparent)}`}</style>
            </form>

            <div className="space-y-5" data-reveal-group>
              <div>
                <h2 className="text-3xl text-brand-dark">Reach us directly</h2>
                <p className="text-muted-foreground mt-2">
                  Our team is available 7 days a week to answer your questions
                  and book services.
                </p>
              </div>
              {[
                { icon: Phone, label: "Phone", val: "+1 (800) BIO-CLEAN" },
                { icon: Mail, label: "Email", val: "hello@biocleaningllc.com" },
                {
                  icon: Clock,
                  label: "Hours",
                  val: "Mon–Fri 7am–8pm · Sat 8am–6pm",
                },
                {
                  icon: MapPin,
                  label: "Service Area",
                  val: "Greater metro area",
                },
              ].map(({ icon: Icon, label, val }) => (
                <div
                  key={label}
                  className="flex gap-4 items-start p-4 rounded-xl bg-brand-cream hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green text-white grid place-items-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {label}
                    </div>
                    <div className="font-semibold text-brand-dark">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-10">
              <span className="pill" data-reveal>
                — Our HQ —
              </span>
              <h2 className="mt-3 text-4xl text-brand-dark" data-reveal>
                Find Us On The Map
              </h2>
            </div>
            <div
              className="rounded-3xl overflow-hidden border border-border shadow-card aspect-[16/7] relative"
              data-reveal
            >
              <iframe
                title="BIO Cleaning location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.020%2C40.700%2C-73.960%2C40.760&amp;layer=mapnik"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page max-w-3xl text-center">
            <span className="pill" data-reveal>
              — Quick Answers —
            </span>
            <h2
              className="text-3xl md:text-4xl text-brand-dark mt-3"
              data-reveal
            >
              Common Questions
            </h2>
            <div
              className="mt-8 grid sm:grid-cols-2 gap-4 text-left"
              data-reveal-group
            >
              {[
                {
                  q: "Do you serve my area?",
                  a: "We cover the greater metro area. Send us your zip code and we'll confirm in minutes.",
                },
                {
                  q: "How fast can you book me?",
                  a: "Most clients are scheduled within 24–48 hours. Same-day options available for premium plans.",
                },
                {
                  q: "Do you offer commercial contracts?",
                  a: "Yes — call us for custom recurring contract pricing for offices, gyms, clinics, and retail.",
                },
                {
                  q: "What payment methods?",
                  a: "All major cards, ACH, Apple Pay, and invoicing for commercial clients.",
                },
              ].map((f) => (
                <div key={f.q} className="card-feature">
                  <div className="font-semibold text-brand-dark">{f.q}</div>
                  <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
