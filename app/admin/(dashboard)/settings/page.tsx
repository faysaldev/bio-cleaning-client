"use client";

import { useChangePasswordMutation } from "@/src/redux/features/auth/authApi";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import {
  BadgeCheck,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminSettingsPage() {
  const user = useSelector(selectCurrentUser);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Visibility states for individual password fields
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword }).unwrap();
      setMessage({ type: "success", text: res.message || "Password updated successfully" });
      formRef.current.reset();
    } catch (err: any) {
      setMessage({ 
        type: "error", 
        text: err?.data?.message || "Failed to change password. Please check your current password." 
      });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl bg-brand-dark p-6 text-white shadow-card">
        <span className="pill bg-brand-lime text-brand-dark">
          Admin profile
        </span>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-brand-lime text-brand-dark grid place-items-center overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-9 h-9" />
            )}
          </div>
          <div>
            <h2 className="text-3xl capitalize">{user?.name || "Administrator"}</h2>
            <p className="text-white/60 capitalize">{user?.role} / System User</p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {[
            { icon: Mail, label: user?.email || "admin@biocleaning.com" },
            { icon: Phone, label: "+1 (800) BIO-CLEAN" },
            { icon: BadgeCheck, label: "Full administrative access" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/8 p-4"
            >
              <Icon className="w-4 h-4 text-brand-lime" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <span className="pill">
          <KeyRound className="w-3.5 h-3.5" /> Security
        </span>
        <h2 className="mt-4 text-3xl text-brand-dark">Change password</h2>
        
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current password
              </span>
              <div className="relative mt-2">
                <input
                  name="oldPassword"
                  type={showOld ? "text" : "password"}
                  required
                  className="w-full rounded-2xl border border-border px-4 py-3 pr-12 outline-none focus:border-brand-green transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-green transition-colors"
                >
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                New password
              </span>
              <div className="relative mt-2">
                <input
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-border px-4 py-3 pr-12 outline-none focus:border-brand-green transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-green transition-colors"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm new password
              </span>
              <div className="relative mt-2">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  className="w-full rounded-2xl border border-border px-4 py-3 pr-12 outline-none focus:border-brand-green transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-green transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-2xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
              message.type === "success" ? "bg-brand-lime/20 text-brand-dark" : "bg-red-50 text-red-600"
            }`}>
              {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update password
          </button>
        </form>

        <div className="mt-8 rounded-3xl bg-brand-cream p-5">
          <ShieldCheck className="w-8 h-8 text-brand-green" />
          <h3 className="mt-3 text-xl text-brand-dark">Security note</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            For your security, we recommend using a unique password that you don't use on other websites. 
            All password changes are logged for security auditing.
          </p>
        </div>
      </section>
    </div>
  );
}
