"use client";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  DollarSign,
  FileText,
  Receipt,
  Mail,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  useGetDashboardStatsQuery,
  useGetRecentBookingsQuery,
} from "@/src/redux/features/dashboard/dashboardApi";
import { EmptyState, ErrorState, TableSkeleton } from "@/src/components/ui/feedback";
import { useGetReportsQuery } from "@/src/redux/features/reporting/reportingApi";

function statusClass(status: string) {
  if (status === "CONFIRMED") return "border-brand-green/30 bg-brand-green/10 text-brand-green";
  if (status === "COMPLETED") return "border-brand-dark/20 bg-brand-dark text-brand-lime";
  if (status === "CANCELLED") return "border-destructive/30 bg-destructive/10 text-destructive";
  return "border-amber-400/40 bg-amber-50 text-amber-800";
}

export default function AdminDashboardPage() {
  const {
    data: recentBookingsResponse,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
  } = useGetRecentBookingsQuery();
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery();

  const reports = useGetReportsQuery();
  const stats = statsResponse?.data;
  const reportSummary = reports.data?.summary;
  const recentBookings = recentBookingsResponse?.data || [];

  if (isStatsError || isBookingsError) {
    return (
      <ErrorState
        title="Dashboard data is unavailable"
        description="Your workspace is still safe. Refresh the dashboard data and try again."
        action={
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              refetchStats();
              refetchBookings();
            }}
          >
            Try again
          </button>
        }
      />
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${Number(stats?.revenue.value || 0).toLocaleString()}`,
      change: Number(stats?.revenue.change || 0),
      icon: DollarSign,
    },
    {
      label: "Total Bookings",
      value: Number(stats?.bookings.value || 0).toLocaleString(),
      change: Number(stats?.bookings.change || 0),
      icon: CalendarCheck,
    },
    {
      label: "Completed Jobs",
      value: Number(stats?.completed.value || 0).toLocaleString(),
      change: Number(stats?.completed.change || 0),
      icon: BadgeCheck,
    },
    {
      label: "Active Clients",
      value: Number(stats?.clients.value || 0).toLocaleString(),
      change: Number(stats?.clients.change || 0),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Spruce Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-green/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-brand-lime/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Operations Command</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Operations Overview
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/70">
              Live telemetry on client bookings, team dispatch readiness, revenue generation, and quality delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/bookings/manual"
              className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-xs font-extrabold text-brand-dark shadow-md transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Create Booking</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span>View Bookings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Primary KPI Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Business statistics">
        {isStatsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm">
                <div className="skeleton h-12 w-12 rounded-2xl" />
                <div className="skeleton mt-6 h-3 w-24 rounded-md" />
                <div className="skeleton mt-3 h-8 w-28 rounded-md" />
              </div>
            ))
          : statCards.map(({ label, value, change, icon: Icon }) => (
              <article
                key={label}
                className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm transition duration-300 hover:border-brand-green/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-green/15 bg-[#F4FAF5] text-brand-green">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/25 px-2.5 py-1 text-xs font-extrabold text-brand-dark">
                    <TrendingUp className="h-3.5 w-3.5 text-brand-green" aria-hidden="true" />
                    {change >= 0 ? "+" : ""}{change}%
                  </span>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand-dark">{value}</p>
              </article>
            ))}
      </section>

      {/* Operational Analytics Quick Grid */}
      {reportSummary ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">
              Operational Metrics
            </span>
            <Link href="/admin/reports" className="text-xs font-bold text-brand-green hover:underline">
              View Detailed Reports →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Operational analytics">
            {[
              ["Lead conversion", `${reportSummary.leadConversionRate.toFixed(1)}%`],
              ["Quote acceptance", `${reportSummary.quoteAcceptanceRate.toFixed(1)}%`],
              ["Cleaner utilization", `${reportSummary.cleanerUtilization.toFixed(1)}%`],
              ["Customer retention", `${reportSummary.customerRetentionRate.toFixed(1)}%`],
              ["Cancellation rate", `${reportSummary.cancellationRate.toFixed(1)}%`],
              ["Recurring revenue", `$${Number(reportSummary.recurringRevenue || 0).toLocaleString()}`],
              ["Unpaid invoices", `$${Number(reportSummary.unpaidInvoices || 0).toLocaleString()}`],
              ["Review score", `${Number(reportSummary.reviewScore || 0).toFixed(2)} / 5`],
            ].map(([label, value]) => (
              <Link
                key={label}
                href="/admin/reports"
                className="group rounded-2xl border border-brand-green/10 bg-white p-4 shadow-xs transition hover:border-brand-green/30 hover:shadow-sm"
              >
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-brand-green transition-colors">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand-dark">
                  {value}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Finance Summary */}
      {stats?.finance ? (
        <section className="grid gap-4 md:grid-cols-3" aria-label="Finance summary">
          <Link
            href="/admin/invoices"
            className="group rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm transition hover:border-brand-green/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <Receipt className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-green transition-colors" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Outstanding Invoices</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">
              ${Number(stats.finance.outstandingInvoices || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Link>

          <Link
            href="/admin/payments"
            className="group rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm transition hover:border-brand-green/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <DollarSign className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-green transition-colors" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Collected Revenue</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">
              ${Number(stats.finance.paidRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Link>

          <Link
            href="/admin/quotes"
            className="group rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm transition hover:border-brand-green/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                <FileText className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-green transition-colors" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Average Booking Value</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">
              ${Number(stats.finance.averageBookingValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Link>
        </section>
      ) : null}

      {/* Main Grid: Latest Bookings & Recent Clients */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Bookings Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">
                Recent Activity
              </span>
              <h3 className="text-xl font-extrabold text-brand-dark">
                Latest Customer Bookings
              </h3>
            </div>
            <Link
              href="/admin/bookings"
              className="rounded-full border border-brand-green/20 bg-white px-3.5 py-1.5 text-xs font-extrabold text-brand-green hover:bg-[#F4FAF5] transition-colors"
            >
              See All Bookings
            </Link>
          </div>

          {isBookingsLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : recentBookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-10 text-center">
              <EmptyState
                icon={CalendarCheck}
                title="No bookings recorded yet"
                description="New customer bookings will appear here as soon as they are scheduled online."
                action={
                  <Link className="btn-primary mt-4" href="/admin/bookings/manual">
                    Create First Booking
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-brand-green/10 bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking.reference} className="hover:bg-[#F4FAF5]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-dark">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                            <User className="h-4 w-4" />
                          </span>
                          <span>{booking.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-muted-foreground">
                        {booking.reference}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-brand-dark">
                        {String(booking.type || "").replaceAll("_", " ")}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${statusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sidebar Cards */}
        <aside className="space-y-6">
          {/* Recent Clients */}
          <section className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-brand-green/10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">
                  Client Directory
                </span>
                <h3 className="text-lg font-extrabold text-brand-dark">
                  Recent Clients
                </h3>
              </div>
              <Users className="h-4 w-4 text-brand-green" aria-hidden="true" />
            </div>

            <div className="mt-5 space-y-4">
              {stats?.clientList?.length ? (
                stats.clientList.slice(0, 5).map((client: any) => (
                  <div key={client._id || client.email || client.phone} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F4FAF5] text-xs font-extrabold text-brand-green border border-brand-green/10">
                      {client.name?.charAt(0) || "C"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-extrabold text-brand-dark">{client.name}</h4>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /> {client.email || client.phone || "No contact detail"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Client profiles will appear automatically after their first booking.</p>
              )}
            </div>
          </section>

          {/* Operational Standard Card */}
          <section className="overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-lime text-brand-dark">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-white">
              Built for precision operations.
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Clear schedules, automated dispatching, verified eco supplies, and real-time field visibility keep BIO Cleaning running smoothly.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
