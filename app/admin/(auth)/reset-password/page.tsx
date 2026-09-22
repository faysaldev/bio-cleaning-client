"use client";

import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its security token. Please request a new link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      router.replace("/admin/login");
    } catch (err: any) {
      setError(err?.data?.message || "The reset link is invalid or expired.");
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
            <LockKeyhole className="h-6 w-6 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security
          </span>
        </div>

        <div className="mt-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-green">
            Account Security
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Choose New Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            This reset link is single-use and expires one hour after issuance.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div
              className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div>
            <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 pr-12 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-brand-dark transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3.5 px-6 text-sm font-extrabold text-brand-dark shadow-lg transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating Password…</span>
              </>
            ) : (
              "Update Password"
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
