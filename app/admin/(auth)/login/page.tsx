"use client";

import commercial from "@/src/assets/service-commercial.jpeg";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="grid min-h-screen bg-[#0C3629] text-white lg:grid-cols-2">
      {/* Visual Showcase Panel */}
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={commercial}
          alt="Commercial cleaning operations"
          priority
          sizes="50vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C3629]/95 via-[#0C3629]/80 to-[#0C3629]/40 backdrop-blur-[2px]" />
        
        {/* Ambient glows */}
        <div className="pointer-events-none absolute left-10 top-20 h-72 w-72 rounded-full bg-brand-green/30 blur-[100px]" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-64 w-64 rounded-full bg-brand-lime/15 blur-[90px]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md transition hover:bg-white/20">
            <Image
              src={LOGO_URL}
              alt="BIO Cleaning LLC logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20"
            />
            <span className="text-base font-extrabold tracking-tight text-white">
              BIO Cleaning
            </span>
          </Link>

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Administrative Workspace
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-white leading-[1.08]">
              Manage the work behind every spotless space.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              A high-precision command center for bookings, schedules, field dispatches, invoicing, and real-time customer messaging.
            </p>
          </div>

          <div className="max-w-md rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-lime">
              <ShieldCheck className="h-4 w-4" />
              <span>Role-Based Secure Operations</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Protected authentication, audited transactions, and an eco-focused operations suite built for scale.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form Panel */}
      <section className="flex items-center justify-center bg-[#F4FAF5] p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md rounded-3xl border border-brand-green/10 bg-white p-7 sm:p-10 text-foreground shadow-xl">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime text-brand-dark shadow-md">
              <LockKeyhole className="h-6 w-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
              Operations Login
            </span>
          </div>

          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Admin Sign In
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Sign in with authorized staff credentials to continue.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            {error ? (
              <div
                className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                Email Address
              </label>
              <input
                id="admin-email"
                required
                type="email"
                ref={emailRef}
                autoComplete="email"
                className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                placeholder="admin@biocleaningllc.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  required
                  type={showPassword ? "text" : "password"}
                  ref={passwordRef}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 pr-12 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between gap-3 text-xs pt-1">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-border accent-brand-green text-brand-green focus:ring-brand-green"
                />
                Remember me
              </label>
              <Link
                href="/admin/forgot-password"
                className="font-extrabold text-brand-green hover:text-brand-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3.5 px-6 text-sm font-extrabold text-brand-dark shadow-lg transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Control Center</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
