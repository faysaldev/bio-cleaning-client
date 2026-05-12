import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";

export default function AdminForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-brand-cream grid place-items-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="mt-6 text-4xl text-brand-dark">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin email and we&apos;ll send reset instructions.
        </p>
        <form className="mt-7 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Admin email
            </span>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green"
              placeholder="admin@biocleaningllc.com"
            />
          </label>
          <button className="btn-primary w-full">Send reset link</button>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-green"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </form>
      </section>
    </main>
  );
}
