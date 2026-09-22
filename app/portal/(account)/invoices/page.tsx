"use client";

import { ExternalLink, Receipt } from "lucide-react";
import { useState } from "react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPortalInvoicesQuery, usePayPortalInvoiceMutation } from "@/src/redux/features/portal/portalApi";

const money = (value: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(value || 0);

export default function PortalInvoicesPage() {
  const { data, isLoading, isError, refetch } = useGetPortalInvoicesQuery();
  const [pay, { isLoading: paying }] = usePayPortalInvoiceMutation();
  const [error, setError] = useState("");
  if (isLoading) return <LoadingState label="Loading invoices…" />;
  if (isError || !data) return <ErrorState action={<button className="btn-secondary" onClick={() => refetch()}>Try again</button>} />;

  const startPay = async (id: string) => {
    setError("");
    try {
      const result = await pay(id).unwrap();
      if (result.url) window.location.assign(result.url);
      else await refetch();
    } catch (e: any) { setError(e?.data?.message || "Could not start the secure payment checkout."); }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
          Billing & Invoices
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View balances, payment history, and pay open invoices securely.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
          {error}
        </div>
      ) : null}

      <div className="space-y-3.5">
        {data.map((invoice: any) => {
          const isPaid = invoice.amountDue <= 0 || invoice.status === "PAID";
          return (
            <section
              key={invoice._id}
              className="rounded-3xl border border-brand-green/12 bg-white p-6 shadow-sm transition hover:border-brand-green/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                    <Receipt className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-brand-dark text-base">{invoice.invoiceNumber}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isPaid
                            ? "bg-brand-lime/20 text-[#0C3629] border border-brand-lime/40"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {invoice.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Issued {new Date(invoice.issuedAt).toLocaleDateString()} · Due {new Date(invoice.dueAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-extrabold text-brand-dark">
                    {money(invoice.total, invoice.currency)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Due: <strong className={invoice.amountDue > 0 ? "text-amber-800" : "text-brand-green"}>{money(invoice.amountDue, invoice.currency)}</strong>
                  </p>
                </div>
              </div>

              {invoice.amountDue > 0 && !["VOID", "REFUNDED"].includes(invoice.status) ? (
                <div className="mt-5 pt-4 border-t border-brand-green/8 flex justify-end">
                  <button
                    disabled={paying}
                    onClick={() => startPay(invoice._id)}
                    className="btn-primary rounded-full px-6 py-2.5 text-xs font-extrabold shadow-sm"
                  >
                    Pay securely <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null}
            </section>
          );
        })}

        {!data.length ? (
          <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-10 text-center text-sm text-muted-foreground">
            No invoices recorded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
