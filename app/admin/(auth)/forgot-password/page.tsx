"use client";

import { ArrowLeft, CheckCircle2, Loader2, MailCheck, ShieldCheck } from "lucide-react";
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
      setError("Please enter your admin email address.");
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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0C3629] p-4 sm:p-6 text-foreground">
      {/* Soft atmospheric gradient accents */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-brand-lime/10 blur-[90px]" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-white p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime text-brand-dark shadow-md">
            <MailCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security
          </span>
        </div>

        <div className="mt-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-green">
            Password Recovery
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Reset Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Enter your admin email and we&apos;ll send recovery instructions if your account is registered.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleForgot}>
          {error ? (
            <div
              className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {success ? (
            <div
              className="flex items-start gap-2.5 rounded-2xl border border-brand-green/20 bg-brand-green/10 p-3.5 text-xs font-bold text-brand-green"
              role="status"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              <span>If the account exists, secure reset instructions have been dispatched to your inbox.</span>
            </div>
          ) : null}

          <div>
            <label htmlFor="reset-email" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Admin Email
            </label>
            <input
              id="reset-email"
              required
              type="email"
              ref={emailRef}
              autoComplete="email"
              className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              placeholder="admin@biocleaningllc.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3.5 px-6 text-sm font-extrabold text-brand-dark shadow-lg transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Instructions…</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="pt-2 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-green hover:text-brand-dark transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Admin Login</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
