interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumb: string;
}

export function PageHero({ title, subtitle, crumb }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-dark pb-16 pt-28 sm:pb-20 sm:pt-32">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-green/10 to-transparent" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-green/7 blur-3xl" />
      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <span className="editorial-kicker border-white/12 bg-white/7 text-brand-lime">{crumb}</span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] text-white md:text-7xl">{title}</h1>
          {subtitle ? <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 md:text-lg">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  );
}
