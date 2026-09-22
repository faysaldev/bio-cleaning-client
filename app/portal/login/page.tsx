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
  return (
    <main className="min-h-screen bg-[#F7FAF8] px-4 py-12 sm:py-20 relative overflow-hidden flex items-center justify-center">
      {/* Background soft glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-brand-green/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-left">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white px-4 py-1.5 text-xs font-bold text-brand-dark hover:bg-brand-cream transition">
            <ArrowLeft className="h-3.5 w-3.5 text-brand-green" />
            Back to website
          </Link>
        </div>

        <section className="rounded-3xl border border-brand-green/15 bg-white p-8 sm:p-10 shadow-xl">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
            Secure Customer Access
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Your BIO Cleaning Portal
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We’ll email you a one-time sign-in link. No password to memorize or reset.
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-brand-green/20 bg-brand-lime/15 p-5">
              <p className="font-bold text-brand-dark text-sm">Check your inbox</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                If a customer account exists for <strong className="text-brand-dark">{email}</strong>, a secure sign-in link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="field-label text-xs font-bold text-brand-dark" htmlFor="portal-email">
                  Email address
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="portal-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-control pl-10 rounded-xl"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-semibold text-destructive">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full rounded-full py-3 text-sm font-extrabold shadow-md"
              >
                {isLoading ? "Sending secure link…" : "Email my secure link"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
