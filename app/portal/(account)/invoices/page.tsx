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

  return <div className="space-y-6"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-green">Billing</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-.04em] text-brand-dark">Invoices</h1><p className="mt-2 text-sm text-muted-foreground">View balances and pay open invoices securely.</p></div>{error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}<div className="space-y-3">{data.map((invoice:any)=><section key={invoice._id} className="surface p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-cream text-brand-green"><Receipt className="h-4 w-4"/></span><div><p className="font-extrabold text-brand-dark">{invoice.invoiceNumber}</p><p className="text-sm text-muted-foreground">Issued {new Date(invoice.issuedAt).toLocaleDateString()} · Due {new Date(invoice.dueAt).toLocaleDateString()}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-brand-green">{invoice.status.replaceAll("_"," ")}</p></div></div><div className="text-right"><p className="text-xl font-extrabold text-brand-dark">{money(invoice.total,invoice.currency)}</p><p className="text-sm text-muted-foreground">Due {money(invoice.amountDue,invoice.currency)}</p></div></div>{invoice.amountDue>0&&!['VOID','REFUNDED'].includes(invoice.status)?<button disabled={paying} onClick={()=>startPay(invoice._id)} className="btn-primary mt-5">Pay securely <ExternalLink className="h-4 w-4"/></button>:null}</section>)}{!data.length?<div className="surface p-8 text-center text-sm text-muted-foreground">No invoices yet.</div>:null}</div></div>;
}
