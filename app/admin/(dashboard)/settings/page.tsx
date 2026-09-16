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
      setMessage({ type: "error", text: error?.data?.message || "Failed to change password. Check your current password and try again." });
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <span className="editorial-kicker">Account settings</span>
        <h2 className="admin-page-heading mt-3 text-brand-dark">Profile & security</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Keep account information clear and security controls easy to understand.</p>
      </section>

      <Link href="/admin/settings/scheduling" className="surface flex items-center justify-between gap-5 p-5 transition hover:border-brand-green/35 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-green/8 text-brand-green"><CalendarClock className="h-5 w-5" /></span>
          <div><h3 className="text-base font-extrabold text-brand-dark">Scheduling & capacity</h3><p className="mt-1 text-xs text-muted-foreground">Business timezone, opening hours, crew availability, deposits, cancellation rules and blocked time.</p></div>
        </div>
        <span className="text-xs font-extrabold text-brand-green">Open →</span>
      </Link>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="overflow-hidden rounded-2xl bg-brand-dark p-5 text-white shadow-card sm:p-6">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-lime">Admin profile</div>
          <div className="mt-7 flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-lime text-brand-dark">
              {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-bold capitalize">{user?.name || "Administrator"}</h3>
              <p className="mt-1 text-sm capitalize text-white/50">{user?.role} · System user</p>
            </div>
          </div>
          <div className="mt-7 divide-y divide-white/8 rounded-xl border border-white/8 bg-white/[0.035]">
            {[
              { icon: Mail, label: user?.email || "admin@biocleaning.com" },
              { icon: Phone, label: "+1 (800) BIO-CLEAN" },
              { icon: BadgeCheck, label: "Full administrative access" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                <Icon className="h-4 w-4 shrink-0 text-brand-lime" />
                <span className="truncate text-sm text-white/72">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green"><KeyRound className="h-3.5 w-3.5" /> Security</div>
              <h3 className="mt-2 text-2xl font-bold text-brand-dark">Change password</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-cream text-brand-green"><ShieldCheck className="h-4 w-4" /></div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
            <PasswordField id="old-password" name="oldPassword" label="Current password" shown={showOld} onToggle={() => setShowOld((value) => !value)} autoComplete="current-password" />
            <PasswordField id="new-password" name="newPassword" label="New password" shown={showNew} onToggle={() => setShowNew((value) => !value)} autoComplete="new-password" minLength={8} />
            <PasswordField id="confirm-password" name="confirmPassword" label="Confirm new password" shown={showConfirm} onToggle={() => setShowConfirm((value) => !value)} autoComplete="new-password" minLength={8} />

            {message ? (
              <div className={`feedback-panel ${message.type === "success" ? "border-brand-green/20 bg-brand-green/5 text-brand-green" : "border-destructive/20 bg-destructive/5 text-destructive"}`} role={message.type === "error" ? "alert" : "status"}>
                {message.text}
              </div>
            ) : null}

            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update password"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-brand-cream/55 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
              <div>
                <h4 className="text-sm font-bold text-brand-dark">Security note</h4>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Use a unique password with at least eight characters. Changing it signs this browser out so the new credentials take effect cleanly.</p>
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
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <input id={id} name={name} type={shown ? "text" : "password"} required minLength={minLength} autoComplete={autoComplete} className="field-control pr-12" />
        <button type="button" onClick={onToggle} className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream hover:text-brand-green" aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
