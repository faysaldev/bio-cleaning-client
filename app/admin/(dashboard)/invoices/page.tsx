"use client";

import { useState } from "react";
import { CreditCard, DollarSign, FileCheck2, Loader2, Mail, RefreshCcw, Send, ShieldCheck, AlertCircle } from "lucide-react";
import {
  useCreateInvoicePaymentLinkMutation,
  useGetFinanceSummaryQuery,
  useGetInvoicesQuery,
  useRecordManualPaymentMutation,
  useSendInvoiceMutation,
  useStartRecurringBillingMutation,
  useVoidInvoiceMutation,
} from "@/src/redux/features/finance/financeApi";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";
import { TextInput } from "@/src/components/ui/form-field";

const sc = (s: string) =>
  s === "PAID"
    ? "bg-emerald-100 text-emerald-800"
    : s === "OPEN" || s === "PARTIALLY_PAID"
    ? "bg-amber-100 text-amber-800"
    : s === "VOID" || s === "REFUNDED"
    ? "bg-slate-100 text-slate-700"
    : "bg-rose-100 text-rose-800";

export default function InvoicesPage() {
  const { data, isLoading, isError, refetch } = useGetInvoicesQuery({ limit: 100 });
  const { data: summary } = useGetFinanceSummaryQuery();
  const [sendInvoice] = useSendInvoiceMutation();
  const [paymentLink] = useCreateInvoicePaymentLinkMutation();
  const [manual, manualState] = useRecordManualPaymentMutation();
  const [startRecurring] = useStartRecurringBillingMutation();
  const [voidInvoice] = useVoidInvoiceMutation();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const act = async (fn: () => Promise<any>, ok: string) => {
    setMessage("");
    try {
      const r = await fn();
      setMessage(ok);
      return r;
    } catch (e: any) {
      setMessage(e?.data?.message || "Action failed.");
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Invoices are unavailable"
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
              Revenue Operations
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Invoices & collections</h1>
          <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
            Invoices are generated automatically from completed field jobs and reconciled against customer deposits, Stripe card payments, refunds, and manual transactions.
          </p>
        </div>
      </section>

      {/* 4 Finance KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: "Outstanding", v: summary?.outstandingInvoices || 0, i: FileCheck2 },
          { l: "Paid revenue", v: summary?.paidRevenue || 0, i: DollarSign },
          { l: "Avg. booking value", v: summary?.averageBookingValue || 0, i: CreditCard },
          { l: "Invoices", v: summary?.invoiceCount || 0, i: RefreshCcw },
        ].map(({ l, v, i: Icon }) => (
          <article key={l} className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{l}</p>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">
              {l === "Invoices"
                ? Number(v).toLocaleString()
                : `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
          </article>
        ))}
      </section>

      {/* A/R Aging Section */}
      {summary?.aging?.length ? (
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Accounts Receivable</span>
          <h2 className="mt-1 text-lg font-extrabold text-brand-dark">A/R aging schedule</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {summary.aging.map((a) => (
              <div key={a.label} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <p className="text-xs font-bold text-muted-foreground">{a.label}</p>
                <p className="mt-1.5 text-lg font-extrabold text-brand-dark">${a.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {message ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      ) : null}

      {/* Invoices Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={7} />
      ) : data?.data?.length ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Paid</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {data.data.map((inv) => (
                  <tr key={inv._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-emerald-700">{inv.invoiceNumber}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Due {new Date(inv.dueAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-brand-dark">{inv.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.customer.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">
                      {inv.currency} {inv.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">
                      {inv.currency} {inv.amountPaid.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-brand-dark">
                      {inv.currency} {inv.amountDue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${sc(inv.status)}`}>
                        {inv.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                          onClick={() => act(() => sendInvoice(inv._id).unwrap(), "Invoice sent.")}
                        >
                          <Mail className="h-3 w-3 text-emerald-700" /> Send
                        </button>
                        {inv.amountDue > 0 ? (
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                            onClick={async () => {
                              const r: any = await act(() => paymentLink(inv._id).unwrap(), "Payment link created.");
                              if (r?.url) window.open(r.url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            <CreditCard className="h-3 w-3 text-emerald-700" /> Pay link
                          </button>
                        ) : null}
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                          onClick={() => {
                            setSelected(inv._id);
                            setAmount(String(inv.amountDue || ""));
                          }}
                        >
                          Record
                        </button>
                        {inv.recurrenceGroupId && inv.amountDue <= 0 && !["REFUNDED", "VOID"].includes(inv.status) ? (
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                            onClick={async () => {
                              const r: any = await act(() => startRecurring(inv._id).unwrap(), "Recurring billing checkout created.");
                              if (r?.url) window.open(r.url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            Recurring
                          </button>
                        ) : null}
                        {inv.amountPaid === 0 && inv.status !== "VOID" ? (
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                            onClick={() => act(() => voidInvoice(inv._id).unwrap(), "Invoice voided.")}
                          >
                            Void
                          </button>
                        ) : null}
                      </div>
                      {selected === inv._id ? (
                        <div className="mt-2.5 flex items-center justify-end gap-2">
                          <TextInput
                            className="!h-8 w-28 text-xs"
                            type="number"
                            min="0.01"
                            step="0.01"
                            max={inv.amountDue}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <button
                            disabled={manualState.isLoading}
                            className="inline-flex items-center gap-1 rounded-full bg-[#7CE337] px-3 py-1.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
                            onClick={() =>
                              act(async () => {
                                await manual({ id: inv._id, amount: Number(amount) }).unwrap();
                                setSelected(null);
                              }, "Payment recorded.")
                            }
                          >
                            {manualState.isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No invoices yet"
          description="An invoice is generated automatically when a field job is completed."
        />
      )}
    </div>
  );
}
