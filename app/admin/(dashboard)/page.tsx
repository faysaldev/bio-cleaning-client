import {
  adminStats,
  dashboardTasks,
  recentBookings,
} from "@/src/utils/adminData";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map(({ label, value, change, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-border bg-white p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-brand-mint/30 text-brand-dark grid place-items-center">
                <Icon className="w-6 h-6" />
              </div>
              <span className="rounded-full bg-brand-lime/40 px-3 py-1 text-xs font-bold text-brand-dark">
                {change}
              </span>
            </div>
            <div className="mt-5 font-display text-4xl font-bold text-brand-dark">
              {value}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="pill">Today</span>
              <h2 className="mt-3 text-3xl text-brand-dark">
                Recent bookings
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-green"
            >
              Manage all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 divide-y divide-border">
            {recentBookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold text-brand-dark">
                    {booking.customer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.service} · {booking.date} · {booking.time}
                  </div>
                </div>
                <span className="w-fit rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-green">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {dashboardTasks.map(({ title, detail, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl bg-brand-dark p-6 text-white shadow-card"
            >
              <Icon className="w-9 h-9 text-brand-lime" />
              <h3 className="mt-4 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-white/65">{detail}</p>
            </div>
          ))}
          <div className="rounded-3xl bg-brand-lime p-6 text-brand-dark">
            <BadgeCheck className="w-9 h-9" />
            <h3 className="mt-4 text-2xl font-display">
              Quality score: 98%
            </h3>
            <p className="mt-2 text-sm text-brand-dark/70">
              Client satisfaction stayed above target this week.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
