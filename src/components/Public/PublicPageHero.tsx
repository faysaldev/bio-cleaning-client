import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function PublicPageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0C3629] py-20 text-white md:py-28">
      {/* Soft atmospheric gradient accents */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-16 h-60 w-60 rounded-full bg-brand-lime/10 blur-[80px]" />

      <div className="container-page relative z-10 max-w-5xl text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/8 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{eyebrow}</span>
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.08] text-white">
          {title}
        </h1>

        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {description}
          </p>
        ) : null}

        {actions ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
