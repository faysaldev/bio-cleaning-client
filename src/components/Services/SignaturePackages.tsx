import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SignaturePackages() {
  const packages = [
    { name: "Fresh Start", price: "$89", copy: "Light reset for tidy homes" },
    { name: "Deep Reset", price: "$149", copy: "Detail-heavy clean for busy weeks", featured: true },
    { name: "Move Ready", price: "$199", copy: "Deposit-focused top-to-bottom clean" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div>
            <span className="editorial-kicker">Signature Packages</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark mt-4">
              Curated bundles for every season of life
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base">
              Choose a starting baseline, then stack custom add-ons like ovens, windows, or pet detail. Each package can be scheduled in under a minute.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-7 sm:p-8 border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${
                  pkg.featured
                    ? "bg-[#0C3629] text-white border-brand-lime/30 shadow-2xl scale-105 z-10"
                    : "bg-[#F7FAF8] border-brand-green/12 shadow-sm hover:shadow-xl hover:border-brand-green/30"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-lime px-4 py-1 text-[10px] font-black uppercase tracking-wider text-brand-dark shadow-md">
                    Most Popular
                  </div>
                )}
                <div>
                  <div
                    className={`text-[10px] uppercase tracking-wider font-extrabold ${
                      pkg.featured ? "text-brand-lime" : "text-brand-green"
                    }`}
                  >
                    Package 0{i + 1}
                  </div>
                  <h3 className="text-2xl font-extrabold mt-2">{pkg.name}</h3>
                  <div className="text-4xl sm:text-5xl font-extrabold mt-5 tracking-tight">
                    {pkg.price}
                  </div>
                  <p
                    className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                      pkg.featured ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {pkg.copy}
                  </p>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/book"
                    className={`inline-flex items-center gap-2 text-xs font-extrabold transition-all hover:gap-3 ${
                      pkg.featured ? "text-brand-lime hover:text-white" : "text-brand-green hover:text-brand-dark"
                    }`}
                  >
                    Select Package <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
