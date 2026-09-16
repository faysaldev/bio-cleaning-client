"use client";

import type { WebsiteFaq, WebsiteHomepageSection } from "@/src/redux/features/website/types";
import { ArrowRight, MessageCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const fallback: WebsiteFaq[] = [
  { id: "supplies", question: "Do you bring your own supplies?", answer: "Yes. Our teams arrive with the equipment and cleaning products needed for the selected service.", visible: true, order: 10 },
  { id: "pets", question: "Are your products pet-safe?", answer: "We prioritize low-residue, surface-appropriate products and can note household sensitivities in your customer preferences.", visible: true, order: 20 },
  { id: "recurring", question: "Can I set up recurring cleaning?", answer: "Yes. Weekly, bi-weekly, and monthly schedules can be booked when available.", visible: true, order: 30 },
];

export default function FAQ({ faqs, section }: { faqs?: WebsiteFaq[]; section?: WebsiteHomepageSection }) {
  const items = useMemo(() => {
    const selected = faqs?.filter((item) => item.visible).sort((a, b) => a.order - b.order) || [];
    return selected.length ? selected : fallback;
  }, [faqs]);
  const [open, setOpen] = useState(0);
  return <section className="py-24"><div className="container-page"><div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr]">
    <div className="lg:sticky lg:top-28"><span className="pill" data-reveal>— {section?.eyebrow || "FAQ"} —</span><h2 className="mt-3 text-4xl font-display text-brand-dark md:text-5xl" data-reveal>{section?.title || "Helpful questions about our services"}</h2><p className="mt-4 text-muted-foreground" data-reveal>{section?.subtitle || "Clear answers before you book, with human support whenever you need it."}</p><div className="mt-8 rounded-2xl bg-brand-dark p-6 text-white" data-reveal><MessageCircle className="h-9 w-9 text-brand-lime" /><h3 className="mt-4 text-2xl font-display">Still deciding?</h3><p className="mt-2 text-sm text-white/65">Send us your service needs and we&apos;ll point you in the right direction.</p></div></div>
    <div><div className="space-y-3" data-reveal-group>{items.map((f, i) => { const isOpen = open === i; return <div key={f.id} className={`rounded-2xl border transition ${isOpen ? "border-brand-green bg-brand-cream" : "border-border bg-white"}`}><button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left" aria-expanded={isOpen}><span className="font-semibold text-brand-dark">{f.question}</span><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? "bg-brand-lime text-brand-dark" : "bg-brand-cream text-brand-green"}`}>{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span></button>{isOpen ? <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.answer}</div> : null}</div>; })}</div><div className="mt-10 text-center"><Link href="/contact" className="btn-primary inline-flex items-center gap-2">Ask a Question <ArrowRight className="h-4 w-4" /></Link></div></div>
  </div></div></section>;
}
