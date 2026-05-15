interface Addon {
  name: string;
  price: string;
}

interface ServiceAddonsProps {
  addons: Addon[];
}

export function ServiceAddons({ addons }: ServiceAddonsProps) {
  return (
    <section className="py-24">
      <div className="container-page text-center">
        <span className="pill bg-brand-cream text-brand-green">— Add-ons —</span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mt-4">
          Customize Any Clean
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Stack any of these targeted extras with your primary service for a truly bespoke cleaning experience.
        </p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto">
          {addons.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between px-8 py-5 bg-white rounded-2xl border border-border hover:border-brand-green hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <span className="font-bold text-brand-dark group-hover:text-brand-green transition-colors">{a.name}</span>
              <span className="bg-brand-cream text-brand-green font-black px-3 py-1 rounded-lg text-sm">{a.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
