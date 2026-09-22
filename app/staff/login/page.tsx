"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/redux/features/auth/authApi";
import { setSession } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { adminWorkspaceRoles } from "@/src/lib/roles";

export default function StaffLoginPage() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await login({
        email: String(f.get("email")),
        password: String(f.get("password")),
        rememberMe: Boolean(f.get("remember")),
      }).unwrap();

      dispatch(setSession(res.data));
      if (res.data.user.role === "cleaner") {
        router.replace("/staff");
      } else if (adminWorkspaceRoles.includes(res.data.user.role)) {
        router.replace("/admin");
      } else {
        setError("This account does not have staff workspace access.");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0C3629] p-4 sm:p-6">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-brand-lime/10 blur-[100px]" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-white p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Top Insignia & Badge */}
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-lime text-brand-dark shadow-md">
            <Sparkles className="h-6 w-6 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            Field Portal
          </span>
        </div>

        <div className="mt-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-green">
            BIO Cleaning Crew
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Staff Workspace
          </h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Sign in to access today&apos;s assignments, customer access codes, checklists, and field evidence.
          </p>
        </div>

        {error ? (
          <div
            className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-bold text-destructive"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Staff Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="cleaner@biocleaning.com"
              className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-3 pr-12 text-sm font-medium text-brand-dark transition placeholder:text-muted-foreground/60 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-brand-dark transition"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground select-none">
              <input
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded accent-brand-green border-border text-brand-green focus:ring-brand-green"
              />
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3.5 px-6 text-sm font-extrabold text-brand-dark shadow-lg transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Sign In to Field Workspace</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>
      </section>
    </main>
  );
}
