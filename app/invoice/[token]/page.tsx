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

  if (isLoading) return <main className="min-h-screen bg-brand-cream p-5"><div className="mx-auto max-w-3xl pt-[20vh]"><LoadingState label="Opening your invoice…" /></div></main>;
  if (isError || !invoice) return <main className="min-h-screen bg-brand-cream p-5"><div className="mx-auto max-w-3xl pt-[20vh]"><ErrorState title="This invoice link is unavailable" action={<button className="btn-secondary" onClick={() => refetch()}>Retry</button>} /></div></main>;

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
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--brand-cream),white_36rem)] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="BIO Cleaning" className="h-11 w-11 rounded-xl object-cover" />
            <div><p className="font-extrabold text-brand-dark">BIO Cleaning</p><p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Secure invoice</p></div>
          </Link>
          <span className={`status-badge ${paid ? "status-success" : "status-warning"}`}>{invoice.status.replaceAll("_", " ")}</span>
        </div>

        {notice ? <div className="mb-4 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-dark">{notice}</div> : null}

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="bg-brand-dark p-6 text-white sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-lime">Invoice {invoice.invoiceNumber}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div><h1 className="text-3xl font-extrabold tracking-[-.04em]">{invoice.customer.name}</h1><p className="mt-2 text-sm text-white/60">Issued {new Date(invoice.issuedAt).toLocaleDateString()} · Due {new Date(invoice.dueAt).toLocaleDateString()}</p></div>
              <FileCheck2 className="h-7 w-7 text-brand-lime" />
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="divide-y divide-border rounded-xl border border-border">
              {invoice.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 p-4">
                  <div><p className="font-bold text-brand-dark">{item.name}</p>{item.description ? <p className="mt-1 text-xs text-muted-foreground">{item.description}</p> : null}</div>
                  <p className={`font-extrabold ${item.amount < 0 ? "text-brand-green" : "text-brand-dark"}`}>{invoice.currency} {item.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span></div>
              {invoice.discountAmount > 0 ? <div className="flex justify-between text-muted-foreground"><span>Discounts</span><span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span></div> : null}
              <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{invoice.currency} {invoice.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Payments received</span><span>-{invoice.currency} {invoice.amountPaid.toFixed(2)}</span></div>
              {invoice.amountRefunded > 0 ? <div className="flex justify-between text-muted-foreground"><span>Refunded</span><span>{invoice.currency} {invoice.amountRefunded.toFixed(2)}</span></div> : null}
              <div className="flex justify-between border-t border-border pt-3 text-lg font-extrabold text-brand-dark"><span>Balance due</span><span>{invoice.currency} {invoice.amountDue.toFixed(2)}</span></div>
            </div>

            {paid ? (
              <div className="mt-7 flex items-center gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 p-4 text-brand-green">
                <CheckCircle2 className="h-5 w-5" /><div><p className="font-extrabold">Paid</p><p className="text-xs opacity-80">No balance is currently due.</p></div>
              </div>
            ) : (
              <div className="mt-7 rounded-xl bg-brand-cream/55 p-5">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-brand-green" /><div><p className="font-extrabold text-brand-dark">Secure online payment</p><p className="mt-1 text-sm text-muted-foreground">Pay the remaining balance through Stripe Checkout. Eligible cards can be saved securely for future cleaning payments.</p></div></div>
                <button disabled={payState.isLoading} className="btn-primary mt-4 w-full" onClick={payNow}>{payState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}Pay {invoice.currency} {invoice.amountDue.toFixed(2)}</button>
              </div>
            )}

            {canEnableRecurring ? (
              <div className="mt-4 rounded-xl border border-border bg-white p-5">
                <div className="flex items-start gap-3"><Repeat2 className="mt-0.5 h-5 w-5 text-brand-green" /><div><p className="font-extrabold text-brand-dark">Autopay for recurring visits</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Use Stripe recurring billing for the remaining scheduled visits in this cleaning series. The first recurring charge is collected toward the next scheduled visit, and the subscription automatically stops after the remaining series payments.</p></div></div>
                <button disabled={recurringState.isLoading} className="btn-secondary mt-4" onClick={enableRecurring}>{recurringState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat2 className="h-4 w-4" />}Enable recurring autopay</button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
