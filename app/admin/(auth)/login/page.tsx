import commercial from "@/src/assets/service-commercial.jpeg";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LOGO_URL =
  "https://res.cloudinary.com/dr6linfry/image/upload/q_auto/f_auto/v1778514293/logo_fekjaa.jpg";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={commercial}
          alt="Commercial cleaning workspace"
          priority
          sizes="50vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/90 via-brand-dark/72 to-brand-dark/35" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src={LOGO_URL}
              alt="BIO Cleaning LLC logo"
              width={52}
              height={52}
              className="h-13 w-13 rounded-2xl object-cover ring-2 ring-brand-lime/50"
            />
            <span className="font-display text-2xl font-bold">
              BIO Cleaning
            </span>
          </Link>
          <div>
            <span className="pill bg-brand-lime text-brand-dark">
              Admin portal
            </span>
            <h1 className="mt-5 max-w-xl text-5xl">
              Manage bookings, services, and cleaning operations.
            </h1>
            <p className="mt-4 max-w-md text-white/65">
              A focused workspace for the team behind every spotless room.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md max-w-md">
            <div className="text-sm font-semibold text-brand-lime">
              Operations overview
            </div>
            <p className="mt-2 text-sm text-white/70">
              Review bookings, publish services, and keep the cleaning schedule
              moving from one calm dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-foreground shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h2 className="mt-6 text-4xl text-brand-dark">Admin login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to the BIO control center.
          </p>
          <form className="mt-7 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green"
                placeholder="admin@biocleaningllc.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-brand-green"
                placeholder="••••••••"
              />
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" /> Remember me
              </label>
              <Link
                href="/admin/forgot-password"
                className="font-bold text-brand-green"
              >
                Forgot?
              </Link>
            </div>
            <Link href="/admin" className="btn-primary w-full">
              Sign in <ArrowRight className="w-4 h-4" />
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
