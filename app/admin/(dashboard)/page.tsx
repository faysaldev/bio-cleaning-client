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
  if (status === "CONFIRMED") return "border-brand-green/25 bg-brand-green/8 text-brand-green";
  if (status === "COMPLETED") return "border-brand-dark/20 bg-brand-dark text-white";
  if (status === "CANCELLED") return "border-destructive/20 bg-destructive/7 text-destructive";
  return "border-brand-yellow/45 bg-brand-yellow/15 text-brand-dark";
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
      label: "Total revenue",
      value: `$${Number(stats?.revenue.value || 0).toLocaleString()}`,
      change: Number(stats?.revenue.change || 0),
      icon: DollarSign,
    },
    {
      label: "Total bookings",
      value: Number(stats?.bookings.value || 0).toLocaleString(),
      change: Number(stats?.bookings.change || 0),
      icon: CalendarCheck,
    },
    {
      label: "Completed jobs",
      value: Number(stats?.completed.value || 0).toLocaleString(),
      change: Number(stats?.completed.change || 0),
      icon: BadgeCheck,
    },
    {
      label: "Total clients",
      value: Number(stats?.clients.value || 0).toLocaleString(),
      change: Number(stats?.clients.change || 0),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="editorial-kicker">Live operations</span>
          <h2 className="admin-page-heading mt-3 text-brand-dark">A clear view of today&apos;s business.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Bookings, revenue, client activity, and the work that needs attention—without dashboard clutter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/bookings/manual" className="btn-primary">
            <CalendarCheck className="h-4 w-4" /> Create booking
          </Link>
          <Link href="/admin/bookings" className="btn-secondary">
            View bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Business statistics">
        {isStatsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface p-5">
                <div className="skeleton h-10 w-10 rounded-xl" />
                <div className="skeleton mt-6 h-3 w-24 rounded-md" />
                <div className="skeleton mt-3 h-8 w-28 rounded-md" />
              </div>
            ))
          : statCards.map(({ label, value, change, icon: Icon }) => (
              <article key={label} className="surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-brand-green/12 bg-brand-cream text-brand-green">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-brand-green/7 px-2 py-1 text-[11px] font-extrabold text-brand-green">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    {change >= 0 ? "+" : ""}{change}%
                  </span>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark">{value}</p>
              </article>
            ))}
      </section>


      {reportSummary ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Operational analytics">
          {[
            ["Lead conversion", `${reportSummary.leadConversionRate.toFixed(1)}%`],
            ["Quote acceptance", `${reportSummary.quoteAcceptanceRate.toFixed(1)}%`],
            ["Cleaner utilization", `${reportSummary.cleanerUtilization.toFixed(1)}%`],
            ["Customer retention", `${reportSummary.customerRetentionRate.toFixed(1)}%`],
            ["Cancellation rate", `${reportSummary.cancellationRate.toFixed(1)}%`],
            ["Recurring revenue", `$${Number(reportSummary.recurringRevenue || 0).toLocaleString()}`],
            ["Unpaid invoices", `$${Number(reportSummary.unpaidInvoices || 0).toLocaleString()}`],
            ["Review score", `${Number(reportSummary.reviewScore || 0).toFixed(2)} / 5`],
          ].map(([label,value]) => <Link key={label} href="/admin/reports" className="surface p-4 transition hover:-translate-y-0.5 hover:border-brand-green/25"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-extrabold tracking-[-.04em] text-brand-dark">{value}</p></Link>)}
        </section>
      ) : null}

      {stats?.finance ? (
        <section className="grid gap-3 md:grid-cols-3" aria-label="Finance summary">
          <Link href="/admin/invoices" className="surface p-5 transition hover:-translate-y-0.5 hover:border-brand-green/25">
            <div className="flex items-center justify-between"><Receipt className="h-5 w-5 text-brand-green"/><ArrowRight className="h-4 w-4 text-muted-foreground"/></div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">Outstanding invoices</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">${Number(stats.finance.outstandingInvoices || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          </Link>
          <Link href="/admin/payments" className="surface p-5 transition hover:-translate-y-0.5 hover:border-brand-green/25">
            <div className="flex items-center justify-between"><DollarSign className="h-5 w-5 text-brand-green"/><ArrowRight className="h-4 w-4 text-muted-foreground"/></div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">Paid revenue</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">${Number(stats.finance.paidRevenue || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          </Link>
          <Link href="/admin/quotes" className="surface p-5 transition hover:-translate-y-0.5 hover:border-brand-green/25">
            <div className="flex items-center justify-between"><FileText className="h-5 w-5 text-brand-green"/><ArrowRight className="h-4 w-4 text-muted-foreground"/></div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">Average booking value</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">${Number(stats.finance.averageBookingValue || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          </Link>
        </section>
      ) : null}

      {stats?.finance?.paymentStatus?.length ? (
        <section className="surface p-5" aria-label="Invoice payment status">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Accounts receivable</p><h3 className="mt-1 text-lg font-bold text-brand-dark">Invoice status</h3></div><Link href="/admin/invoices" className="text-xs font-extrabold text-brand-green">Open invoices</Link></div>
          <div className="mt-4 flex flex-wrap gap-2">{stats.finance.paymentStatus.map((item) => <div key={item.status} className="rounded-xl border border-border bg-brand-cream/35 px-3 py-2"><div className="flex items-center gap-2"><span className="text-xs font-extrabold text-brand-dark">{item.status.replaceAll("_"," ")}</span><span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-muted-foreground">{item.count}</span></div><p className="mt-1 text-xs font-bold text-muted-foreground">${Number(item.amount || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p></div>)}</div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Recent activity</p>
              <h3 className="mt-1 text-xl font-bold text-brand-dark">Latest bookings</h3>
            </div>
            <Link href="/admin/bookings" className="text-xs font-extrabold text-brand-green hover:text-brand-dark">
              See all
            </Link>
          </div>

          {isBookingsLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : recentBookings.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="New online and manual bookings will appear here as soon as they are created."
              action={<Link className="btn-primary" href="/admin/bookings/manual">Create first booking</Link>}
            />
          ) : (
            <>
              <div className="table-shell hidden overflow-x-auto md:block">
                <table className="data-table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Reference</th>
                      <th>Service</th>
                      <th>Scheduled</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking: any) => (
                      <tr key={booking.reference}>
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-cream text-brand-green">
                              <User className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-bold text-brand-dark">{booking.name}</span>
                          </div>
                        </td>
                        <td className="font-mono text-xs font-semibold text-muted-foreground">{booking.reference}</td>
                        <td className="text-sm text-brand-dark">{String(booking.type || "").replaceAll("_", " ")}</td>
                        <td className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</td>
                        <td><span className={`status-badge ${statusClass(booking.status)}`}>{booking.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 md:hidden">
                {recentBookings.map((booking: any) => (
                  <article key={booking.reference} className="surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-brand-dark">{booking.name}</h4>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{booking.reference}</p>
                      </div>
                      <span className={`status-badge shrink-0 ${statusClass(booking.status)}`}>{booking.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-xs">
                      <div><p className="font-bold text-brand-dark">Service</p><p className="mt-0.5 text-muted-foreground">{String(booking.type || "").replaceAll("_", " ")}</p></div>
                      <div><p className="font-bold text-brand-dark">Scheduled</p><p className="mt-0.5 text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p></div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <section className="surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Customers</p>
                <h3 className="mt-1 text-lg font-bold text-brand-dark">Recent clients</h3>
              </div>
              <Users className="h-4 w-4 text-brand-green" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-4">
              {stats?.clientList?.length ? (
                stats.clientList.slice(0, 5).map((client: any) => (
                  <div key={client._id || client.email || client.phone} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-brand-cream text-xs font-extrabold text-brand-green">
                      {client.name?.charAt(0) || "C"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-brand-dark">{client.name}</h4>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground"><Mail className="h-3 w-3" /> {client.email || client.phone || "No contact detail"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Customer profiles will appear after the first conversion or booking.</p>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-brand-dark p-5 text-white shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="mt-5 text-xl font-bold">Built for calm operations.</h3>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Fast actions, clear status, and fewer decorative distractions keep the admin workspace focused on the work.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
