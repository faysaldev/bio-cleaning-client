import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SignaturePackages() {
  const packages = [
    { name: "Fresh Start", price: "$89", copy: "Light reset for tidy homes" },
    { name: "Deep Reset", price: "$149", copy: "Detail-heavy clean for busy weeks", featured: true },
    { name: "Move Ready", price: "$199", copy: "Deposit-focused top-to-bottom clean" },
  ];

  return (
    <section className="py-24">
      <div className="container-page">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div>
            <span className="pill bg-brand-cream text-brand-green">— Signature Packages —</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mt-4">
              Cleaner bundles for real-life mess levels
            </h2>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Choose a starting point, then add any extras. Each package can
              be customized before checkout to perfectly match your space and priorities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`relative rounded-[2rem] p-8 border transition-all duration-500 hover:-translate-y-2 ${
                  pkg.featured
                    ? "bg-brand-dark text-white border-brand-dark shadow-2xl scale-105 z-10"
                    : "bg-white border-border shadow-card hover:shadow-xl"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div
                  className={`text-[10px] uppercase tracking-widest font-bold ${
                    pkg.featured ? "text-brand-lime" : "text-brand-green"
                  }`}
                >
                  Package {i + 1}
                </div>
                <h3 className="text-2xl font-display font-bold mt-2">{pkg.name}</h3>
                <div className="font-display text-5xl font-bold mt-6">
                  {pkg.price}
                </div>
                <p
                  className={`text-sm mt-4 leading-relaxed ${
                    pkg.featured ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {pkg.copy}
                </p>
                <Link
                  href="/book"
                  className={`mt-8 inline-flex items-center gap-2 font-bold transition-all hover:gap-3 ${
                    pkg.featured ? "text-brand-lime" : "text-brand-green"
                  }`}
                >
                  Select <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
