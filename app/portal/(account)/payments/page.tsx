"use client";
import { ExternalLink } from "lucide-react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPortalPaymentsQuery } from "@/src/redux/features/portal/portalApi";
const money=(v:number,c:string)=>new Intl.NumberFormat("en-US",{style:"currency",currency:c||"USD"}).format(v||0);
export default function PortalPaymentsPage() {
  const { data, isLoading, isError, refetch } = useGetPortalPaymentsQuery();

  if (isLoading) return <LoadingState label="Loading payments…" />;
  if (isError || !data) return <ErrorState action={<button className="btn-secondary rounded-full" onClick={() => refetch()}>Try again</button>} />;

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
          Financial Ledger
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
          Payments & Receipts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your complete transaction history and payment receipts.
        </p>
      </div>

      <div className="rounded-3xl border border-brand-green/12 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-brand-green/10 bg-[#F4FAF5] text-[11px] uppercase tracking-wider font-extrabold text-brand-dark/75">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 pr-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-green/8">
              {data.map((p: any) => (
                <tr key={p._id} className="transition hover:bg-[#F7FAF8]/70">
                  <td className="p-4 pl-6 text-muted-foreground">
                    {new Date(p.processedAt || p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-brand-dark">{p.purpose}</td>
                  <td className="p-4 text-muted-foreground">{p.provider}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full bg-brand-lime/20 border border-brand-lime/40 px-2.5 py-0.5 text-[11px] font-bold text-[#0C3629]">
                      {p.status}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-right font-extrabold ${
                      p.type === "REFUND" ? "text-destructive" : "text-brand-dark"
                    }`}
                  >
                    {p.type === "REFUND" ? "-" : ""}
                    {money(p.amount, p.currency)}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {p.receiptUrl ? (
                      <a
                        href={p.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-brand-green hover:text-brand-dark transition"
                      >
                        Download <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!data.length ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No payment transactions recorded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
