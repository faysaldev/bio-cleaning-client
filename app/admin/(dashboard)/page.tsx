"use client";

import {
  ArrowRight,
  BadgeCheck,
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  Loader2,
  Mail,
  Phone,
  User,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  useGetDashboardStatsQuery,
  useGetRecentBookingsQuery,
} from "@/src/redux/features/dashboard/dashboardApi";

export default function AdminDashboardPage() {
  const { data: recentBookingsResponse, isLoading: isBookingsLoading } =
    useGetRecentBookingsQuery();
  const { data: statsResponse, isLoading: isStatsLoading } =
    useGetDashboardStatsQuery();

  const stats = statsResponse?.data;
  const recentBookings = recentBookingsResponse?.data || [];

  if (isStatsLoading || isBookingsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats?.revenue.value || 0}`,
      change: `+${stats?.revenue.change || 0}%`,
      icon: DollarSign,
      color: "bg-brand-green/10 text-brand-green",
    },
    {
      label: "Total Bookings",
      value: stats?.bookings.value || 0,
      change: `+${stats?.bookings.change || 0}%`,
      icon: CalendarCheck,
      color: "bg-brand-yellow/10 text-brand-dark",
    },
    {
      label: "Completed Jobs",
      value: stats?.completed.value || 0,
      change: `+${stats?.completed.change || 0}%`,
      icon: BadgeCheck,
      color: "bg-brand-lime text-brand-dark",
    },
    {
      label: "Total Clients",
      value: stats?.clients.value || 0,
      change: `+${stats?.clients.change || 0}%`,
      icon: Users,
      color: "bg-brand-cream text-brand-green",
    },
  ];

  function statusClass(status: string) {
    if (status === "CONFIRMED") return "bg-brand-lime text-brand-dark";
    if (status === "COMPLETED") return "bg-brand-green text-white";
    if (status === "CANCELLED") return "bg-destructive/10 text-destructive";
    return "bg-brand-cream text-brand-green";
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Stats */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, change, icon: Icon, color }) => (
          <div
            key={label}
            className="group rounded-[2rem] border border-border bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl p-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-brand-green bg-brand-green/5 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> {change}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <h3 className="mt-1 text-4xl font-display font-bold text-brand-dark">
                {value}
              </h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Recent Bookings */}
        <section className="rounded-[2.5rem] border border-border bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="pill bg-brand-cream text-brand-green">
                Activity Log
              </span>
              <h2 className="mt-3 text-3xl font-display font-bold text-brand-dark">
                Recent bookings
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark text-white hover:bg-brand-green transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="py-20 text-center">
                <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No recent bookings found.
                </p>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div
                  key={booking.reference}
                  className="group flex items-center justify-between rounded-3xl border border-border p-5 hover:border-brand-green/30 hover:bg-brand-cream/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brand-cream flex items-center justify-center">
                      <User className="h-6 w-6 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark leading-tight">
                        {booking.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-bold text-brand-green uppercase tracking-tighter">
                          {booking.reference}
                        </span>
                        <span>•</span>
                        <span>{booking.type.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">
                        Scheduled
                      </div>
                      <div className="text-xs font-bold text-brand-dark">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${statusClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Side Panel: Top Clients & Tasks */}
        <aside className="space-y-8">
          {/* Recent Clients */}
          <section className="rounded-[2.5rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-brand-dark">
                Recent Clients
              </h3>
              <Users className="w-5 h-5 text-brand-green" />
            </div>
            <div className="space-y-5">
              {stats?.clientList?.map((client: any) => (
                <div key={client.email} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-cream flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-brand-green">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-brand-dark truncate">
                      {client.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <Mail className="w-2.5 h-2.5" /> {client.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-[2.5rem] bg-brand-lime p-8 text-brand-dark">
            <Sparkles className="w-10 h-10" />
            <h3 className="mt-4 text-2xl font-display font-bold">
              Operational Sync
            </h3>
            <p className="mt-2 text-sm text-brand-dark/70 italic">
              "Your performance is the best marketing tool we have."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
