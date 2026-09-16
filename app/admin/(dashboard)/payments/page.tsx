"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, RotateCcw, XCircle } from "lucide-react";
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

  if (isError) return <ErrorState title="Payments are unavailable" action={<button className="btn-secondary" onClick={() => refetch()}>Retry</button>} />;

  return (
    <div className="space-y-6">
      <section>
        <span className="editorial-kicker">Payment ledger</span>
        <h2 className="admin-page-heading mt-2 text-brand-dark">Payments & refunds</h2>
        <p className="mt-2 text-sm text-muted-foreground">Every deposit, invoice payment, recurring charge, manual payment, and refund remains independently auditable.</p>
      </section>

      {message ? <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark">{message}</div> : null}

      {recurring?.length ? (
        <section className="surface p-5">
          <p className="text-xs font-extrabold uppercase tracking-[.12em] text-brand-green">Recurring billing</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {recurring.map((item) => (
              <article key={item._id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-bold text-brand-dark">{item.serviceName}</p><span className="status-badge status-neutral">{item.status}</span></div>
                <p className="mt-2 text-sm text-muted-foreground">{item.currency} {item.amount.toFixed(2)} every {item.intervalCount > 1 ? `${item.intervalCount} ` : ""}{item.interval}{item.intervalCount > 1 ? "s" : ""}</p>
                {item.maxPayments ? <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.paymentsProcessed || 0} of {item.maxPayments} scheduled recurring payments processed</p> : null}
                {["ACTIVE", "PENDING", "INCOMPLETE"].includes(item.status) ? <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-destructive hover:underline" onClick={() => void stopRecurring(item._id)}><XCircle className="h-3.5 w-3.5" />Cancel recurring billing</button> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {isLoading ? <TableSkeleton rows={7} columns={7} /> : data?.data?.length ? (
        <div className="table-shell overflow-x-auto">
          <table className="data-table min-w-[1020px]">
            <thead><tr><th>Date</th><th>Type</th><th>Purpose</th><th>Provider</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {data.data.map((payment) => (
                <tr key={payment._id}>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td>{payment.type}</td><td>{payment.purpose}</td><td>{payment.provider}</td>
                  <td className="font-extrabold text-brand-dark">{payment.currency} {payment.amount.toFixed(2)}</td>
                  <td><span className={`status-badge ${payment.status === "SUCCEEDED" ? "status-success" : payment.status === "FAILED" ? "status-danger" : "status-warning"}`}>{payment.status}</span></td>
                  <td>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {payment.receiptUrl ? <a className="btn-secondary !h-8 !px-3" href={payment.receiptUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" />Receipt</a> : null}
                      {payment.type === "PAYMENT" && payment.status === "SUCCEEDED" && payment.provider === "STRIPE" ? (
                        selected === payment._id ? <div className="flex gap-2"><TextInput className="!h-8 w-24" type="number" min="0.01" step="0.01" max={payment.amount} value={amount} onChange={(event) => setAmount(event.target.value)} /><button disabled={refundState.isLoading || Number(amount) <= 0} className="btn-primary !h-8 !px-3" onClick={() => void doRefund(payment._id)}>Refund</button><button className="btn-secondary !h-8 !px-2" onClick={() => setSelected(null)}>Cancel</button></div>
                        : <button className="btn-secondary !h-8 !px-3" onClick={() => { setSelected(payment._id); setAmount(String(payment.amount)); }}><RotateCcw className="h-3.5 w-3.5" />Refund</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState icon={CreditCard} title="No payment activity" description="Transactions will appear after the first deposit or invoice payment." />}
    </div>
  );
}
