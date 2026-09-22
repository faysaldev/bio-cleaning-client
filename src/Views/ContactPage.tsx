"use client";

import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSubmitContactFormMutation } from "@/src/redux/features/contact/contactApi";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";

export default function ContactPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const content = website?.content;
  const services = website?.services || [];
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [submitContact, { isLoading }] = useSubmitContactFormMutation();
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await submitContact({
        fullName: nameRef.current?.value,
        email: emailRef.current?.value,
        phone: phoneRef.current?.value,
        service: serviceRef.current?.value,
        message: messageRef.current?.value,
      }).unwrap();
      setStatus({ type: "success", msg: res.message || "Thanks! Your message has been sent successfully. We will reply promptly." });
      formRef.current?.reset();
    } catch (err: any) {
      setStatus({ type: "error", msg: err?.data?.message || "Failed to send message. Please try again or call us directly." });
    }
  };

  const details = [
    { icon: Phone, label: "Phone", val: content?.contact.phone || "+1 (800) BIO-CLEAN", href: `tel:${(content?.contact.phone || "8002462532").replace(/[^+\d]/g, "")}` },
    { icon: Mail, label: "Email", val: content?.contact.email || "hello@biocleaningllc.com", href: `mailto:${content?.contact.email || "hello@biocleaningllc.com"}` },
    { icon: Clock, label: "Hours", val: content?.contact.hours || "Mon - Sat: 8:00 AM – 7:00 PM • Online 24/7" },
    { icon: MapPin, label: "Service Area", val: content?.contact.serviceAreaSummary || "Aurora, Arvada, Denver & surrounding metro" },
  ];

  const faqs = content?.faqs.items?.filter((item) => item.visible).sort((a, b) => a.order - b.order).slice(0, 4) || [];

  return (
    <SiteLayout website={website}>
      <div ref={ref} className="bg-white">
        {/* Spruce Hero */}
        <section className="relative overflow-hidden bg-[#0C3629] py-20 text-white md:py-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
          <div className="pointer-events-none absolute right-12 top-10 h-64 w-64 rounded-full bg-brand-lime/10 blur-[80px]" />

          <div className="container-page relative z-10 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md" data-reveal>
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Direct Customer Support</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white" data-reveal>
              {content?.contact.heading || "Get In Touch With BIO Cleaning"}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg" data-reveal>
              {content?.contact.intro || "Have a question about our cleaning standards, need a custom estimate, or want to speak with our Aurora operations team? We are here to help."}
            </p>
          </div>
        </section>

        {/* Contact Form & Direct Details Grid */}
        <section className="py-20 lg:py-28">
          <div className="container-page">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* Left Column: Form */}
              <div className="rounded-3xl border border-brand-green/15 bg-white p-8 sm:p-10 shadow-lg" data-reveal>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-green pb-4 border-b border-brand-green/10 mb-6">
                  <Sparkles className="h-4 w-4 text-brand-lime" />
                  <span>Send an Instant Inquiry</span>
                </div>

                {status ? (
                  <div
                    role={status.type === "error" ? "alert" : "status"}
                    className={`feedback-panel mb-6 rounded-2xl ${
                      status.type === "success"
                        ? "border-brand-green/20 bg-brand-green/5 text-brand-green"
                        : "border-destructive/20 bg-destructive/5 text-destructive"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : null}
                      <span>{status.msg}</span>
                    </div>
                  </div>
                ) : null}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <input ref={nameRef} required className="field-control" placeholder="Jane Doe" />
                    </Field>
                    <Field label="Email Address">
                      <input ref={emailRef} required type="email" className="field-control" placeholder="jane@example.com" />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone Number">
                      <input ref={phoneRef} className="field-control" placeholder="(303) 555-0199" />
                    </Field>
                    <Field label="Service Interest">
                      <select ref={serviceRef} className="field-control">
                        {services.length ? (
                          services.map((service) => (
                            <option key={service._id} value={service.name}>
                              {service.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Residential Cleaning">Residential House Cleaning</option>
                            <option value="Deep Cleaning">Comprehensive Deep Clean</option>
                            <option value="Move-In/Move-Out">Move-In / Move-Out Clean</option>
                            <option value="Commercial Cleaning">Commercial & Office</option>
                          </>
                        )}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message & Home Details">
                    <textarea
                      ref={messageRef}
                      required
                      rows={4}
                      className="field-control min-h-28 resize-y"
                      placeholder="Tell us about your home, number of bedrooms/bathrooms, pet details, or specific focus areas…"
                    />
                  </Field>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary rounded-full px-8 min-h-[48px] text-sm font-extrabold w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Direct Details */}
              <div className="space-y-6" data-reveal-group>
                <div>
                  <div className="editorial-kicker mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Quick Connections</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-brand-dark">Reach Us Directly</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Connect with our certified dispatch and customer care specialists through any preferred channel.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {details.map(({ icon: Icon, label, val, href }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-5 transition hover:border-brand-lime hover:bg-white hover:shadow-md"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-lime/40 text-brand-dark font-black">
                        <Icon className="h-6 w-6 text-[#0C3629]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </div>
                        {href ? (
                          <a href={href} className="font-extrabold text-brand-dark hover:text-brand-green transition-colors text-base">
                            {val}
                          </a>
                        ) : (
                          <div className="font-bold text-brand-dark text-sm mt-0.5">{val}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Map Section */}
        {content?.contact.mapEmbedUrl ? (
          <section className="bg-[#f7faf8] py-16 lg:py-20 border-t border-brand-green/10">
            <div className="container-page">
              <div className="mb-10 text-center">
                <div className="editorial-kicker mx-auto mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Our Service Hub</span>
                </div>
                <h2 className="text-3xl font-extrabold text-brand-dark">Serving Aurora & Metro Denver</h2>
              </div>
              <div className="relative aspect-[16/7] overflow-hidden rounded-3xl border border-brand-green/15 shadow-xl">
                <iframe title="BIO Cleaning location map" src={content.contact.mapEmbedUrl} className="h-full w-full" loading="lazy" />
              </div>
            </div>
          </section>
        ) : null}

        {/* Quick FAQs */}
        {faqs.length ? (
          <section className="py-20 lg:py-28 bg-white border-t border-brand-green/10">
            <div className="container-page max-w-4xl text-center">
              <div className="editorial-kicker mx-auto mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Quick Answers</span>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">Common Questions</h2>

              <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
                {faqs.map((faq) => (
                  <div key={faq.id} className="rounded-3xl border border-brand-green/12 bg-[#f7faf8] p-6">
                    <div className="font-extrabold text-brand-dark text-base">{faq.question}</div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div>{children}</div>
    </label>
  );
}
