import { Check } from "lucide-react";

export function PlanComparison() {
  const comparisonData = [
    ["Eco-friendly products", true, true, true],
    ["Inside appliances", false, true, true],
    ["Baseboards & vents", false, true, true],
    ["Cabinet interiors", false, false, true],
    ["Window cleaning", false, true, true],
    ["Re-clean guarantee", true, true, true],
  ];

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container-page">
        <div className="text-center mb-16">
          <span className="pill bg-brand-green/10 text-brand-green">— Compare Plans —</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold text-brand-dark">
            Find Your Perfect Fit
          </h2>
        </div>
        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-dark text-white">
                  <th className="p-8 text-lg font-display">Service Feature</th>
                  <th className="p-8 text-center text-lg font-display">Standard</th>
                  <th className="p-8 text-center text-lg font-display bg-brand-green/90">Deep</th>
                  <th className="p-8 text-center text-lg font-display">Move-In/Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {comparisonData.map(([label, ...vals], i) => (
                  <tr key={i} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="p-6 pl-8 font-semibold text-brand-dark">
                      {label as string}
                    </td>
                    {(vals as boolean[]).map((v, j) => (
                      <td key={j} className="p-6 text-center">
                        <div className="flex justify-center">
                          {v ? (
                            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                              <Check className="w-5 h-5 text-brand-green" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30 font-bold">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
