import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  title: string;
  subtitle: string;
}

export function CTASection({ title, subtitle }: CTASectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-brand-green p-8 shadow-elevated sm:p-12 md:p-16">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/8 to-transparent" />
          <Sparkles className="absolute right-8 top-8 h-10 w-10 text-white/14" aria-hidden="true" />
          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] md:text-6xl">{title}</h2>
            <p className="mt-5 text-base leading-7 text-white/78 md:text-lg">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-dark px-5 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black/70">
                Book your clean <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-white/40 bg-white px-5 font-extrabold text-brand-green transition hover:bg-brand-cream">
                Get custom quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
