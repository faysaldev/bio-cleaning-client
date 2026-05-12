import { BadgeCheck, KeyRound, Mail, Phone, ShieldCheck, User } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl bg-brand-dark p-6 text-white shadow-card">
        <span className="pill bg-brand-lime text-brand-dark">
          Admin profile
        </span>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-brand-lime text-brand-dark grid place-items-center">
            <User className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-3xl">Faysal Mridha</h2>
            <p className="text-white/60">Owner / Administrator</p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {[
            { icon: Mail, label: "admin@biocleaningllc.com" },
            { icon: Phone, label: "+1 (800) BIO-CLEAN" },
            { icon: BadgeCheck, label: "Full access permissions" },
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
        <div className="mt-6 space-y-4">
          {["Current password", "New password", "Confirm new password"].map(
            (label) => (
              <label key={label} className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <input
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green"
                />
              </label>
            ),
          )}
          <button className="btn-primary">Update password</button>
        </div>
        <div className="mt-8 rounded-3xl bg-brand-cream p-5">
          <ShieldCheck className="w-8 h-8 text-brand-green" />
          <h3 className="mt-3 text-xl text-brand-dark">Security note</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Password changes are UI-ready. Connect this form to your auth
            provider when backend authentication is added.
          </p>
        </div>
      </section>
    </div>
  );
}
