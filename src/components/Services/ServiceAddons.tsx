interface Addon {
  name: string;
  price: string;
}

interface ServiceAddonsProps {
  addons: Addon[];
}

export function ServiceAddons({ addons }: ServiceAddonsProps) {
  return (
    <section className="py-24 bg-[#F7FAF8]">
      <div className="container-page text-center">
        <span className="editorial-kicker">Targeted Add-Ons</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark mt-4">
          Customize Any Clean
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
          Stack any of these targeted extras with your primary service for a truly bespoke cleaning experience.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14 max-w-4xl mx-auto">
          {addons.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between px-6 py-5 bg-white rounded-3xl border border-brand-green/12 hover:border-brand-lime/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <span className="font-extrabold text-sm text-brand-dark group-hover:text-brand-green transition-colors">
                {a.name}
              </span>
              <span className="bg-brand-lime/20 border border-brand-lime/40 text-[#0C3629] font-black px-3 py-1 rounded-full text-xs">
                {a.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
