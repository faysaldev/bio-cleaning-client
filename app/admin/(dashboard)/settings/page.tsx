"use client";

import { useChangePasswordMutation } from "@/src/redux/features/auth/authApi";
import { clearSession, selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";

export default function AdminSettingsPage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      formRef.current.reset();
      dispatch(clearSession());
      router.replace("/admin/login");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.data?.message || "Failed to change password. Check your current password and try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
              Account Settings
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Profile & security</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
            Keep account credentials safe, review permissions, and configure global booking parameters.
          </p>
        </div>
      </section>

      {/* Scheduling Quick Link */}
      <Link
        href="/admin/settings/scheduling"
        className="flex items-center justify-between gap-5 rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm transition-all hover:border-emerald-600/30 hover:shadow-md sm:p-6"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-brand-dark">Scheduling & capacity settings</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Business timezone, opening hours, crew availability, deposit policy, cancellation rules, and blocked dates.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 shrink-0">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {/* 2-Column Grid: Admin Profile & Password Form */}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Admin Profile Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">Admin profile</span>
            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#7CE337] text-[#0C3629]">
                {user?.image ? (
                  <img src={user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-xl font-extrabold capitalize text-white md:text-2xl">
                  {user?.name || "Administrator"}
                </h3>
                <p className="mt-0.5 text-xs capitalize text-emerald-100/70">{user?.role} · System user</p>
              </div>
            </div>

            <div className="mt-7 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04]">
              {[
                { icon: Mail, label: user?.email || "admin@biocleaning.com" },
                { icon: Phone, label: "+1 (800) BIO-CLEAN" },
                { icon: BadgeCheck, label: "Full administrative access" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                  <Icon className="h-4 w-4 shrink-0 text-[#7CE337]" />
                  <span className="truncate text-xs font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Change Password Form */}
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Security</span>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">Change password</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <KeyRound className="h-5 w-5" />
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordField
              id="old-password"
              name="oldPassword"
              label="Current password"
              shown={showOld}
              onToggle={() => setShowOld((value) => !value)}
              autoComplete="current-password"
            />
            <PasswordField
              id="new-password"
              name="newPassword"
              label="New password"
              shown={showNew}
              onToggle={() => setShowNew((value) => !value)}
              autoComplete="new-password"
              minLength={8}
            />
            <PasswordField
              id="confirm-password"
              name="confirmPassword"
              label="Confirm new password"
              shown={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              autoComplete="new-password"
              minLength={8}
            />

            {message ? (
              <div
                className={`flex items-center gap-2 rounded-2xl p-3.5 text-xs font-semibold ${
                  message.type === "success"
                    ? "border border-emerald-500/20 bg-emerald-50 text-emerald-900"
                    : "border border-rose-500/20 bg-rose-50 text-rose-900"
                }`}
                role={message.type === "error" ? "alert" : "status"}
              >
                {message.type === "success" ? (
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                )}
                <span>{message.text}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#7CE337] py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <div>
                <h4 className="text-xs font-bold text-brand-dark">Security notice</h4>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  Use a unique password with at least eight characters. Changing your password signs out this browser session so the new credentials take effect cleanly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  name,
  label,
  shown,
  onToggle,
  minLength,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  shown: boolean;
  onToggle: () => void;
  minLength?: number;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 pr-12 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark"
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
