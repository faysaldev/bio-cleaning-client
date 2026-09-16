"use client";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  DollarSign,
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

  const stats = statsResponse?.data;
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
                  <div key={client.email} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-brand-cream text-xs font-extrabold text-brand-green">
                      {client.name?.charAt(0) || "C"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-brand-dark">{client.name}</h4>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground"><Mail className="h-3 w-3" /> {client.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Client profiles will appear after the first booking.</p>
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
