"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, RotateCcw, XCircle, ShieldCheck, AlertCircle } from "lucide-react";
import {
  useCancelRecurringAgreementMutation,
  useGetPaymentsQuery,
  useGetRecurringBillingQuery,
  useRefundPaymentMutation,
} from "@/src/redux/features/finance/financeApi";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";
import { TextInput } from "@/src/components/ui/form-field";

export default function PaymentsPage() {
  const { data, isLoading, isError, refetch } = useGetPaymentsQuery({ limit: 100 });
  const { data: recurring } = useGetRecurringBillingQuery();
  const [refund, refundState] = useRefundPaymentMutation();
  const [cancelRecurring] = useCancelRecurringAgreementMutation();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const doRefund = async (id: string) => {
    try {
      await refund({ id, amount: Number(amount) }).unwrap();
      setMessage("Refund submitted to Stripe and recorded in the payment ledger.");
      setSelected(null);
    } catch (error: any) {
      setMessage(error?.data?.message || "Refund failed.");
    }
  };

  const stopRecurring = async (id: string) => {
    try {
      await cancelRecurring(id).unwrap();
      setMessage("Recurring billing canceled.");
    } catch (error: any) {
      setMessage(error?.data?.message || "Could not cancel recurring billing.");
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Payments are unavailable"
        action={
          <button className="btn-secondary rounded-full" onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
              Payment Ledger
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Payments & refunds</h1>
          <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
            Every customer deposit, final invoice charge, recurring subscription billing, manual payment, and refund remains independently recorded and auditable.
          </p>
        </div>
      </section>

      {message ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      ) : null}

      {/* Recurring Billing Section */}
      {recurring?.length ? (
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Automated Billing</span>
          <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Recurring billing agreements</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recurring.map((item) => (
              <article key={item._id} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-extrabold text-brand-dark">{item.serviceName}</p>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-brand-dark border border-emerald-950/10">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-emerald-800">
                  {item.currency} {item.amount.toFixed(2)} every {item.intervalCount > 1 ? `${item.intervalCount} ` : ""}
                  {item.interval}
                  {item.intervalCount > 1 ? "s" : ""}
                </p>
                {item.maxPayments ? (
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.paymentsProcessed || 0} of {item.maxPayments} scheduled recurring payments processed
                  </p>
                ) : null}
                {["ACTIVE", "PENDING", "INCOMPLETE"].includes(item.status) ? (
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 hover:underline"
                    onClick={() => void stopRecurring(item._id)}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel recurring billing
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Main Payments Table */}
      {isLoading ? (
        <TableSkeleton rows={7} columns={7} />
      ) : data?.data?.length ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {data.data.map((payment) => (
                  <tr key={payment._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">{payment.type}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{payment.purpose}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-emerald-950/10 bg-[#F4FAF5] px-2.5 py-0.5 text-xs font-medium text-brand-dark">
                        {payment.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-brand-dark">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          payment.status === "SUCCEEDED"
                            ? "bg-emerald-100 text-emerald-800"
                            : payment.status === "FAILED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {payment.receiptUrl ? (
                          <a
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 text-emerald-700" /> Receipt
                          </a>
                        ) : null}
                        {payment.type === "PAYMENT" && payment.status === "SUCCEEDED" && payment.provider === "STRIPE" ? (
                          selected === payment._id ? (
                            <div className="flex items-center gap-2">
                              <TextInput
                                className="!h-8 w-24 text-xs"
                                type="number"
                                min="0.01"
                                step="0.01"
                                max={payment.amount}
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                              />
                              <button
                                disabled={refundState.isLoading || Number(amount) <= 0}
                                className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
                                onClick={() => void doRefund(payment._id)}
                              >
                                Refund
                              </button>
                              <button
                                className="rounded-full border border-emerald-950/15 px-2.5 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                                onClick={() => setSelected(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                              onClick={() => {
                                setSelected(payment._id);
                                setAmount(String(payment.amount));
                              }}
                            >
                              <RotateCcw className="h-3 w-3 text-emerald-700" /> Refund
                            </button>
                          )
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No payment activity"
          description="Transactions will appear after the first deposit or invoice payment."
        />
      )}
    </div>
  );
}
