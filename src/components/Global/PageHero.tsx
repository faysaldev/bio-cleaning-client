interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumb: string;
}

export function PageHero({ title, subtitle, crumb }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 bg-brand-dark overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-green/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <nav className="flex mb-6 animate-in slide-in-from-left duration-700">
            <span className="text-brand-lime text-xs font-black uppercase tracking-[0.3em]">
              {crumb}
            </span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight animate-in slide-in-from-left duration-700 delay-100">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-white/60 text-lg md:text-xl leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
