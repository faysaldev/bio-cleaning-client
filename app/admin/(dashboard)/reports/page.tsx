"use client";

import { useMemo, useState } from "react";
import { BarChart3, DollarSign, RefreshCcw, Star, TrendingUp, UsersRound, WalletCards } from "lucide-react";
import { useGetReportsQuery } from "@/src/redux/features/reporting/reportingApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";

const money = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

const pct = (n: number) => `${Number(n || 0).toFixed(1)}%`;

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#F4FAF5]">
      <div
        className="h-full rounded-full bg-[#7CE337] transition-all duration-500"
        style={{ width: `${Math.max(2, Math.min(100, max ? (value / max) * 100 : 0))}%` }}
      />
    </div>
  );
}

export default function ReportsPage() {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 29 * 86400000);
  const [from, setFrom] = useState(monthAgo.toISOString().slice(0, 10));
  const [to, setTo] = useState(now.toISOString().slice(0, 10));
  const params = useMemo(() => ({ from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` }), [from, to]);
  const { data, isLoading, isError, refetch } = useGetReportsQuery(params);

  if (isLoading && !data) return <LoadingState label="Building operational report…" />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Reports are unavailable"
        description="Try the report again."
        action={
          <button className="btn-secondary rounded-full" onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  const s = data.summary;
  const maxSource = Math.max(1, ...data.leadsBySource.map((x) => x.count));
  const maxRevenue = Math.max(1, ...data.revenueTrend.map((x) => Math.max(0, x.revenue)));

  const kpis = [
    ["Net revenue", money(s.revenue), DollarSign],
    ["Recurring revenue", money(s.recurringRevenue), RefreshCcw],
    ["Unpaid invoices", money(s.unpaidInvoices), WalletCards],
    ["Average order", money(s.averageOrderValue), TrendingUp],
    ["Lead conversion", pct(s.leadConversionRate), UsersRound],
    ["Quote acceptance", pct(s.quoteAcceptanceRate), BarChart3],
    ["Cleaner utilization", pct(s.cleanerUtilization), UsersRound],
    ["Review score", `${s.reviewScore.toFixed(2)} / 5`, Star],
  ] as const;

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Business Intelligence
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Reports that connect sales, operations & cash
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Metrics are derived directly from live CRM records, bookings, dispatch jobs, invoices, payments, and reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm shadow-sm shrink-0">
            <label className="text-xs font-bold text-white/80">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block rounded-xl border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              />
            </label>
            <label className="text-xs font-bold text-white/80">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block rounded-xl border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      {/* 8 KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, Icon]) => (
          <article key={label} className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{value}</p>
          </article>
        ))}
      </section>

      {/* Leads by Source & Revenue Trend */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Acquisition</span>
          <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Leads by source</h2>
          <div className="mt-5 space-y-4">
            {data.leadsBySource.length ? (
              data.leadsBySource.map((row) => (
                <div key={row.source}>
                  <div className="mb-1.5 flex justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-brand-dark">{String(row.source || "Unknown").replaceAll("_", " ")}</span>
                    <span className="text-muted-foreground">
                      {row.count} · {money(row.value)}
                    </span>
                  </div>
                  <Bar value={row.count} max={maxSource} />
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No lead activity in this range.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Revenue Flow</span>
            <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Revenue trend</h2>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2 overflow-x-auto pb-2">
            {data.revenueTrend.length ? (
              data.revenueTrend.map((row) => (
                <div
                  key={row.date}
                  className="group flex min-w-4 flex-1 flex-col justify-end items-center"
                  title={`${row.date}: ${money(row.revenue)}`}
                >
                  <div
                    className="w-full rounded-t-lg bg-[#7CE337] transition-all group-hover:bg-[#0C3629]"
                    style={{ height: `${Math.max(4, (Math.max(0, row.revenue) / maxRevenue) * 100)}%` }}
                  />
                  <span className="mt-1 text-[9px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {row.date.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <p className="self-center text-xs text-muted-foreground">No successful payments in this range.</p>
            )}
          </div>
        </section>
      </div>

      {/* Service Performance Table & Conversion/Retention */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 px-6 py-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Productivity</span>
            <h2 className="mt-0.5 text-lg font-extrabold text-brand-dark">Service performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/40 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Bookings</th>
                  <th className="px-5 py-3">Completed</th>
                  <th className="px-5 py-3">Cancelled</th>
                  <th className="px-5 py-3">Completion</th>
                  <th className="px-5 py-3 text-right">Booked value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {data.servicePerformance.map((row) => (
                  <tr key={row.serviceId || row.service} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-brand-dark">{row.service}</td>
                    <td className="px-5 py-3.5 font-medium">{row.bookings}</td>
                    <td className="px-5 py-3.5 font-medium">{row.completed}</td>
                    <td className="px-5 py-3.5 font-medium text-rose-600">{row.cancelled}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        {pct(row.completionRate)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-brand-dark">{money(row.bookedValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Health Indicators</span>
          <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Conversion & retention</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Booking completion</dt>
              <dd className="font-extrabold text-brand-dark">{pct(s.bookingCompletionRate)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Cancellation rate</dt>
              <dd className="font-extrabold text-rose-600">{pct(s.cancellationRate)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Customer retention</dt>
              <dd className="font-extrabold text-brand-dark">{pct(s.customerRetentionRate)}</dd>
            </div>
            <div className="flex items-center justify-between pt-1">
              <dt className="text-muted-foreground">Review satisfaction</dt>
              <dd className="font-extrabold text-emerald-700">{pct(data.reviews.satisfactionRate)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
