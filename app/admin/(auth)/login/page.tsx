"use client";

import commercial from "@/src/assets/service-commercial.jpeg";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/redux/features/auth/authApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setSession } from "@/src/redux/features/auth/authSlice";
import { LOGO_URL } from "@/src/components/Footer";
import { adminWorkspaceRoles } from "@/src/lib/roles";

export default function AdminLoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await login({ email, password, rememberMe }).unwrap();
      dispatch(setSession(res.data));
      if (res.data.user.role === "cleaner") router.push("/staff");
      else if (adminWorkspaceRoles.includes(res.data.user.role)) router.push("/admin");
      else setError("This account does not have administrative access.");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="grid min-h-screen bg-brand-dark text-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <Image src={commercial} alt="Commercial cleaning workspace" priority sizes="50vw" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/94 via-brand-dark/74 to-brand-dark/38" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline-offset-4">
            <Image src={LOGO_URL} alt="BIO Cleaning LLC logo" width={48} height={48} className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/16" />
            <span className="text-lg font-extrabold tracking-[-0.03em]">BIO Cleaning</span>
          </Link>

          <div className="max-w-xl">
            <span className="editorial-kicker border-brand-lime/30 bg-brand-lime text-brand-dark">Admin portal</span>
            <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.055em] xl:text-6xl">Manage the work behind every spotless room.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/62">
              A calm, focused workspace for bookings, services, customer messages, and day-to-day cleaning operations.
            </p>
          </div>

          <div className="max-w-md rounded-2xl border border-white/10 bg-white/7 p-5 backdrop-blur-md">
            <div className="text-xs font-extrabold uppercase tracking-[0.13em] text-brand-lime">Secure operations</div>
            <p className="mt-2 text-sm leading-6 text-white/62">Protected sessions, focused workflows, and one consistent design system across the control center.</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-brand-cream p-5 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 text-foreground shadow-elevated sm:p-8">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime text-brand-dark">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark sm:text-4xl">Admin login</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to the BIO control center.</p>

          <form className="mt-7 space-y-4" onSubmit={handleLogin}>
            {error ? (
              <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">{error}</div>
            ) : null}

            <div>
              <label htmlFor="admin-email" className="field-label">Email</label>
              <input id="admin-email" required type="email" ref={emailRef} autoComplete="email" className="field-control" placeholder="admin@biocleaningllc.com" />
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">Password</label>
              <div className="relative">
                <input id="admin-password" required type={showPassword ? "text" : "password"} ref={passwordRef} autoComplete="current-password" className="field-control pr-12" placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream hover:text-brand-green"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-border accent-brand-green" />
                Remember me
              </label>
              <Link href="/admin/forgot-password" className="font-extrabold text-brand-green hover:text-brand-dark">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
