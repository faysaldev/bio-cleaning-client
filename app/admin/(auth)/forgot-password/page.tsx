"use client";

import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useForgotPasswordMutation } from "@/src/redux/features/auth/authApi";

export default function AdminForgotPasswordPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    const email = emailRef.current?.value;

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      setSuccess(true);
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-cream p-5">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-elevated sm:p-8">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime text-brand-dark"><MailCheck className="h-5 w-5" /></div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter the admin email and we&apos;ll send reset instructions if the account exists.</p>

        <form className="mt-7 space-y-4" onSubmit={handleForgot}>
          {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">{error}</div> : null}
          {success ? (
            <div className="feedback-panel border-brand-green/20 bg-brand-green/5 text-brand-green" role="status">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>If the account exists, reset instructions have been sent.</span>
            </div>
          ) : null}

          <div>
            <label htmlFor="reset-email" className="field-label">Admin email</label>
            <input id="reset-email" required type="email" ref={emailRef} autoComplete="email" className="field-control" placeholder="admin@biocleaningllc.com" />
          </div>

          <button type="submit" disabled={isLoading || success} className="btn-primary w-full disabled:opacity-60">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send reset link"}
          </button>
          <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-green hover:text-brand-dark"><ArrowLeft className="h-4 w-4" /> Back to login</Link>
        </form>
      </section>
    </main>
  );
}
