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
    <main className="min-h-screen bg-brand-cream grid place-items-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <h1 className="mt-6 text-4xl text-brand-dark">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This reset link can be used once and expires after one hour.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              New password
            </span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-border px-4 py-3 pr-12 outline-none focus:border-brand-green transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Confirm password
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green transition"
            />
          </label>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <Link href="/admin/login" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-green">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </section>
    </main>
  );
}
