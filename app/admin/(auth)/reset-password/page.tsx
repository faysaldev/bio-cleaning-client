"use client";

import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
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
      setError("This reset link is missing its security token. Request a new link.");
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
    <main className="grid min-h-screen place-items-center bg-brand-cream p-5">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-elevated sm:p-8">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime text-brand-dark"><LockKeyhole className="h-5 w-5" /></div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">This reset link can be used once and expires after one hour.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">{error}</div> : null}

          <div>
            <label htmlFor="new-password" className="field-label">New password</label>
            <div className="relative">
              <input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required autoComplete="new-password" className="field-control pr-12" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="field-label">Confirm password</label>
            <input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required autoComplete="new-password" className="field-control" />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update password"}
          </button>
        </form>

        <Link href="/admin/login" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-brand-green hover:text-brand-dark"><ArrowLeft className="h-4 w-4" /> Back to login</Link>
      </section>
    </main>
  );
}
