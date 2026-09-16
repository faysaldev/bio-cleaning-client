"use client";

import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
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
  const handleSubmit = async (e: FormEvent) => { e.preventDefault(); setStatus(null); try { const res = await submitContact({ fullName: nameRef.current?.value, email: emailRef.current?.value, phone: phoneRef.current?.value, service: serviceRef.current?.value, message: messageRef.current?.value }).unwrap(); setStatus({ type: "success", msg: res.message || "Thanks! Your message has been sent successfully." }); formRef.current?.reset(); } catch (err: any) { setStatus({ type: "error", msg: err?.data?.message || "Failed to send message. Please try again later." }); } };
  const details = [
    { icon: Phone, label: "Phone", val: content?.contact.phone || "+1 (800) BIO-CLEAN" },
    { icon: Mail, label: "Email", val: content?.contact.email || "hello@biocleaningllc.com" },
    { icon: Clock, label: "Hours", val: content?.contact.hours || "Online booking available" },
    { icon: MapPin, label: "Service Area", val: content?.contact.serviceAreaSummary || "Supported local service areas" },
  ];
  const faqs = content?.faqs.items?.filter((item) => item.visible).sort((a,b)=>a.order-b.order).slice(0,4) || [];

  return <SiteLayout website={website}><div ref={ref}>
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}><div className="absolute inset-0 leaf-bg opacity-50" /><div className="container-page relative py-24 text-center text-white"><span className="pill border border-white/10 bg-white/10 text-brand-mint" data-reveal><MessageCircle className="h-3.5 w-3.5" /> Contact BIO Cleaning</span><h1 className="mt-5 text-5xl font-display md:text-6xl" data-reveal>{content?.contact.heading || "Get In Touch"}</h1><p className="mx-auto mt-3 max-w-2xl text-white/80" data-reveal>{content?.contact.intro || "We'd love to hear from you."}</p></div></section>
    <section className="py-20"><div className="container-page grid gap-10 md:grid-cols-2"><form ref={formRef} onSubmit={handleSubmit} className="card-feature space-y-4" data-reveal><h2 className="text-2xl text-brand-dark">Send a message</h2>{status ? <div role={status.type === "error" ? "alert" : "status"} className={`feedback-panel ${status.type === "success" ? "border-brand-green/20 bg-brand-green/5 text-brand-green" : "border-destructive/20 bg-destructive/5 text-destructive"}`}><div className="flex gap-2">{status.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}{status.msg}</div></div> : null}<Field label="Full Name"><input ref={nameRef} required className="field-control" placeholder="Jane Doe" /></Field><Field label="Email"><input ref={emailRef} required type="email" className="field-control" placeholder="jane@email.com" /></Field><Field label="Phone"><input ref={phoneRef} className="field-control" placeholder="(555) 555-5555" /></Field><Field label="Service Interest"><select ref={serviceRef} className="field-control">{services.length ? services.map((service) => <option key={service._id} value={service.name}>{service.name}</option>) : <option>General cleaning inquiry</option>}</select></Field><Field label="Message"><textarea ref={messageRef} required rows={4} className="field-control min-h-28 resize-y" placeholder="Tell us about your space…" /></Field><button disabled={isLoading} className="btn-primary w-full transition-all disabled:opacity-70">{isLoading ? <>Sending... <Loader2 className="h-4 w-4 animate-spin" /></> : <>Send Message <Send className="h-4 w-4" /></>}</button></form>
    <div className="space-y-5" data-reveal-group><div><h2 className="text-3xl text-brand-dark">Reach us directly</h2><p className="mt-2 text-muted-foreground">Use the contact details published by the business team.</p></div>{details.map(({ icon: Icon, label, val }) => <div key={label} className="flex items-start gap-4 rounded-xl bg-brand-cream p-4 transition hover:shadow-md"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-green text-white"><Icon className="h-5 w-5" /></div><div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="font-semibold text-brand-dark">{val}</div></div></div>)}</div></div></section>
    {content?.contact.mapEmbedUrl ? <section className="bg-brand-cream py-16"><div className="container-page"><div className="mb-10 text-center"><span className="pill" data-reveal>— Our location —</span><h2 className="mt-3 text-4xl text-brand-dark" data-reveal>Find us on the map</h2></div><div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-border shadow-card" data-reveal><iframe title="BIO Cleaning location" src={content.contact.mapEmbedUrl} className="h-full w-full" loading="lazy" /></div></div></section> : null}
    {faqs.length ? <section className="py-20"><div className="container-page max-w-3xl text-center"><span className="pill" data-reveal>— Quick Answers —</span><h2 className="mt-3 text-3xl text-brand-dark md:text-4xl" data-reveal>{content?.faqs.title || "Common questions"}</h2><div className="mt-8 grid gap-4 text-left sm:grid-cols-2" data-reveal-group>{faqs.map((faq) => <div key={faq.id} className="card-feature"><div className="font-semibold text-brand-dark">{faq.question}</div><p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p></div>)}</div></div></section> : null}
  </div></SiteLayout>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="field-label">{label}</span><div>{children}</div></label>; }
