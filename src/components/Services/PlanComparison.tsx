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
    <section className="py-24 bg-[#F4FAF5]">
      <div className="container-page">
        <div className="text-center mb-16">
          <span className="editorial-kicker">Transparent Scope</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
            Find Your Perfect Clean Level
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Compare included checklist items across our standard maintenance, deep reset, and move-in/out packages.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-brand-green/15 bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0C3629] text-white">
                  <th className="p-6 sm:p-7 text-sm font-extrabold tracking-tight">Service Feature</th>
                  <th className="p-6 sm:p-7 text-center text-sm font-extrabold tracking-tight">Standard</th>
                  <th className="p-6 sm:p-7 text-center text-sm font-extrabold tracking-tight bg-brand-lime text-brand-dark font-black">
                    Deep Reset ★
                  </th>
                  <th className="p-6 sm:p-7 text-center text-sm font-extrabold tracking-tight">Move-In/Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-green/8">
                {comparisonData.map(([label, ...vals], i) => (
                  <tr key={i} className="hover:bg-[#F7FAF8] transition-colors">
                    <td className="p-5 sm:p-6 pl-8 text-xs sm:text-sm font-bold text-brand-dark">
                      {label as string}
                    </td>
                    {(vals as boolean[]).map((v, j) => (
                      <td key={j} className="p-5 sm:p-6 text-center">
                        <div className="flex justify-center">
                          {v ? (
                            <div className="w-7 h-7 rounded-full bg-brand-lime/20 border border-brand-lime/50 flex items-center justify-center text-[#0C3629]">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30 font-bold text-base">—</span>
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
