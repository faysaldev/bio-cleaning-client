import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  title: string;
  subtitle: string;
}

export function CTASection({ title, subtitle }: CTASectionProps) {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative rounded-[3rem] bg-brand-green p-10 md:p-20 overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20 pointer-events-none" />
          <Sparkles className="absolute top-10 right-10 w-12 h-12 text-white/20 animate-pulse" />
          
          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              {title}
            </h2>
            <p className="mt-6 text-white/80 text-lg md:text-xl leading-relaxed">
              {subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-brand-dark text-white font-black px-10 py-5 rounded-2xl inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-dark/20"
              >
                Book Your Clean <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-white text-brand-green font-black px-10 py-5 rounded-2xl inline-flex items-center gap-3 hover:bg-brand-cream transition-all shadow-2xl shadow-white/10"
              >
                Get Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
