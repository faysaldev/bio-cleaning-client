"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CreditCard, FileCheck2, Loader2, Repeat2, ShieldCheck } from "lucide-react";
import {
  useGetPublicInvoiceQuery,
  usePayPublicInvoiceMutation,
  useStartPublicRecurringBillingMutation,
} from "@/src/redux/features/finance/financeApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { LOGO_URL } from "@/src/components/Footer";

export default function PublicInvoicePage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token || "");
  const { data: invoice, isLoading, isError, refetch } = useGetPublicInvoiceQuery(token, { skip: !token });
  const [pay, payState] = usePayPublicInvoiceMutation();
  const [startRecurring, recurringState] = useStartPublicRecurringBillingMutation();
  const [notice, setNotice] = useState("");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7FAF8] p-5 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-brand-green/15 bg-white p-10 text-center shadow-lg">
          <LoadingState label="Opening your secure invoice…" />
        </div>
      </main>
    );
  }

  if (isError || !invoice) {
    return (
      <main className="min-h-screen bg-[#F7FAF8] p-5 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-brand-green/15 bg-white p-10 text-center shadow-lg">
          <ErrorState
            title="This invoice link is unavailable"
            action={
              <button className="btn-secondary rounded-full" onClick={() => refetch()}>
                Retry
              </button>
            }
          />
        </div>
      </main>
    );
  }

  const paid = invoice.amountDue <= 0 || invoice.status === "PAID";
  const canEnableRecurring = paid && Boolean(invoice.recurrenceGroupId) && !["REFUNDED", "VOID"].includes(invoice.status);

  const payNow = async () => {
    setNotice("");
    try {
      const result: any = await pay(token).unwrap();
      if (result?.url) window.location.assign(result.url);
    } catch (error: any) {
      setNotice(error?.data?.message || "Secure payment could not be started.");
    }
  };

  const enableRecurring = async () => {
    setNotice("");
    try {
      const result: any = await startRecurring(token).unwrap();
      if (result?.alreadyActive) {
        setNotice("Recurring billing is already active for this cleaning series.");
      } else if (result?.url) {
        window.location.assign(result.url);
      }
    } catch (error: any) {
      setNotice(error?.data?.message || "Recurring billing could not be started.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F7FAF8] px-4 py-8 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img src={LOGO_URL} alt="BIO Cleaning" className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-green/20" />
            <div>
              <p className="font-extrabold text-brand-dark text-base group-hover:text-brand-green transition-colors">BIO Cleaning</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">Secure Customer Billing</p>
            </div>
          </Link>
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider ${
              paid
                ? "bg-brand-lime text-brand-dark shadow-sm"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {invoice.status.replaceAll("_", " ")}
          </span>
        </div>

        {notice ? (
          <div className="mb-4 rounded-2xl border border-brand-green/20 bg-white p-4 text-xs font-semibold text-brand-dark shadow-sm">
            {notice}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-brand-green/15 bg-white shadow-xl">
          {/* Spruce Top Banner */}
          <div className="relative overflow-hidden bg-[#0C3629] p-6 sm:p-9 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-lime/15 blur-2xl" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full border border-brand-lime/30 bg-white/10 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime">
                  Invoice {invoice.invoiceNumber}
                </span>
                <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {invoice.customer.name}
                </h1>
                <p className="mt-1 text-xs text-white/70">
                  Issued: {new Date(invoice.issuedAt).toLocaleDateString()} · Due: {new Date(invoice.dueAt).toLocaleDateString()}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brand-lime shadow-sm">
                <FileCheck2 className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            {/* Line items table */}
            <div className="rounded-2xl border border-brand-green/12 bg-[#F7FAF8] divide-y divide-brand-green/8 overflow-hidden">
              {invoice.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="font-extrabold text-brand-dark text-sm">{item.name}</p>
                    {item.description ? (
                      <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    ) : null}
                  </div>
                  <p className={`font-extrabold text-sm sm:text-base ${item.amount < 0 ? "text-brand-green" : "text-brand-dark"}`}>
                    {invoice.currency} {item.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="ml-auto mt-6 max-w-sm space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 ? (
                <div className="flex justify-between text-brand-green font-semibold">
                  <span>Discounts applied</span>
                  <span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-muted-foreground">
                <span>Sales Tax</span>
                <span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payments received</span>
                <span>-{invoice.currency} {invoice.amountPaid.toFixed(2)}</span>
              </div>
              {invoice.amountRefunded > 0 ? (
                <div className="flex justify-between text-destructive">
                  <span>Refunded</span>
                  <span>{invoice.currency} {invoice.amountRefunded.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-brand-green/15 pt-3 text-lg sm:text-xl font-extrabold text-brand-dark">
                <span>Balance due</span>
                <span className={invoice.amountDue > 0 ? "text-brand-dark" : "text-brand-green"}>
                  {invoice.currency} {invoice.amountDue.toFixed(2)}
                </span>
              </div>
            </div>

            {paid ? (
              <div className="mt-8 flex items-center gap-3.5 rounded-2xl border border-brand-green/20 bg-[#F4FAF5] p-5 text-brand-dark">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0C3629] text-brand-lime">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-brand-dark">Paid in Full</p>
                  <p className="text-xs text-muted-foreground">No balance is currently outstanding for this invoice.</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-brand-green/15 bg-[#F4FAF5] p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0C3629] text-brand-lime shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-brand-dark text-sm">Secure Online Payment</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Pay the remaining balance through Stripe. All card transactions are encrypted with 256-bit bank-level security.
                    </p>
                  </div>
                </div>
                <button
                  disabled={payState.isLoading}
                  className="btn-primary mt-5 w-full rounded-full py-3.5 text-xs font-extrabold shadow-md"
                  onClick={payNow}
                >
                  {payState.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Pay {invoice.currency} {invoice.amountDue.toFixed(2)} via Stripe
                </button>
              </div>
            )}

            {canEnableRecurring ? (
              <div className="mt-5 rounded-2xl border border-brand-green/15 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0C3629] text-brand-lime shrink-0 mt-0.5">
                    <Repeat2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-brand-dark text-sm">Autopay for Recurring Visits</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Enable hassle-free automatic billing for the remaining scheduled visits in this recurring plan. The authorization automatically stops at the end of the term.
                    </p>
                  </div>
                </div>
                <button
                  disabled={recurringState.isLoading}
                  className="btn-secondary rounded-full mt-4 text-xs font-extrabold"
                  onClick={enableRecurring}
                >
                  {recurringState.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Repeat2 className="h-4 w-4" />
                  )}
                  Enable Recurring Autopay
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
