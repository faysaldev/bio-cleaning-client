"use client";

import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRequestPortalLinkMutation } from "@/src/redux/features/portal/portalApi";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [requestLink, { isLoading }] = useRequestPortalLinkMutation();
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    try { await requestLink({ email }).unwrap(); setSent(true); } catch (e:any) { setError(e?.data?.message || "We could not send the portal link. Please try again."); }
  };
  return <main className="min-h-screen bg-brand-cream px-4 py-12 sm:py-20"><div className="mx-auto max-w-md">
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-green"><ArrowLeft className="h-4 w-4" />Back to website</Link>
    <section className="surface p-6 sm:p-8">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-dark text-brand-lime"><ShieldCheck className="h-5 w-5" /></div>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.15em] text-brand-green">Secure customer access</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">Your BIO Cleaning portal</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">We’ll email you a one-time sign-in link. No customer password to remember.</p>
      {sent ? <div className="mt-6 rounded-xl border border-brand-green/20 bg-brand-lime/15 p-4"><p className="font-bold text-brand-dark">Check your inbox</p><p className="mt-1 text-sm text-muted-foreground">If a customer account exists for {email}, a secure sign-in link has been queued for delivery.</p></div> : <form onSubmit={submit} className="mt-7 space-y-4"><div><label className="field-label" htmlFor="portal-email">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input id="portal-email" type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="field-control pl-10" placeholder="you@example.com" /></div></div>{error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}<button disabled={isLoading} className="btn-primary w-full">{isLoading ? "Sending secure link…" : "Email my secure link"}</button></form>}
    </section>
  </div></main>;
}
