"use client";

import { ArrowLeft, MailCheck, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForgotPasswordMutation } from "@/src/redux/features/auth/authApi";

export default function AdminForgotPasswordPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <main className="min-h-screen bg-brand-cream grid place-items-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="mt-6 text-4xl text-brand-dark">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin email and we&apos;ll send reset instructions.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleForgot}>
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-brand-lime/20 text-brand-green text-sm font-medium border border-brand-lime/30 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-4 h-4" /> Reset link sent to your email!
            </div>
          )}

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Admin email
            </span>
            <input
              required
              type="email"
              ref={emailRef}
              className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green transition"
              placeholder="admin@biocleaningllc.com"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading || success}
            className="btn-primary w-full disabled:opacity-70"
          >
            {isLoading ? (
              <>
                Sending... <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "Send reset link"
            )}
          </button>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </form>
      </section>
    </main>
  );
}
