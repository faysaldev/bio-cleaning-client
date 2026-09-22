"use client";

import { Send, Star, CheckCircle, Clock } from "lucide-react";
import { useGetAdminReviewsQuery, useResendReviewRequestMutation } from "@/src/redux/features/communications/communicationsApi";
import { ErrorState, LoadingState, EmptyState } from "@/src/components/ui/feedback";

const idOf = (v: any) => (typeof v === "string" ? v : v?._id || "");

export default function ReviewsPage() {
  const q = useGetAdminReviewsQuery({ limit: 75 });
  const [resend, { isLoading }] = useResendReviewRequestMutation();

  if (q.isLoading && !q.data) return <LoadingState label="Loading customer reviews…" />;
  if (q.isError) {
    return (
      <ErrorState
        action={
          <button className="btn-secondary rounded-full" onClick={() => q.refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  const items = q.data?.items || [];
  const submitted = items.filter((x) => x.status === "SUBMITTED" && x.rating);
  const avg = submitted.length ? submitted.reduce((s, x) => s + (x.rating || 0), 0) / submitted.length : 0;

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
              Customer Trust & Reputation
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Reviews & feedback</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
            Secure post-service review requests, internal ratings, and customer testimonial consent records.
          </p>
        </div>
      </section>

      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Average rating</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Star className="h-4 w-4 fill-[#7CE337] text-emerald-700" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">{avg.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {submitted.length} completed reviews</p>
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Submitted</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle className="h-4 w-4 text-emerald-700" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">{submitted.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Feedback recorded</p>
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Pending</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="h-4 w-4 text-emerald-700" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            {items.filter((x) => x.status !== "SUBMITTED").length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting customer response</p>
        </div>
      </div>

      {/* Main Reviews Table */}
      {items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Customer reviews will appear here as post-service follow-up links are dispatched and submitted."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {items.map((item) => {
                  const customer = item.customerId as any;
                  const booking = item.bookingId as any;
                  return (
                    <tr key={item._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-dark">{customer?.name || "Customer"}</td>
                      <td className="px-6 py-4 font-mono text-xs text-emerald-700">{booking?.reference || "—"}</td>
                      <td className="px-6 py-4">
                        {item.rating ? (
                          <span className="inline-flex items-center gap-1 font-extrabold text-brand-dark">
                            <Star className="h-3.5 w-3.5 fill-[#7CE337] text-emerald-700" />
                            {item.rating}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[280px] truncate text-xs text-brand-dark/80">
                        {item.comment || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {item.publishConsent ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            Consented
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                            item.status === "SUBMITTED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status !== "SUBMITTED" && idOf(booking) ? (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-emerald-50 disabled:opacity-40"
                            disabled={isLoading}
                            onClick={async () => {
                              await resend(idOf(booking));
                              q.refetch();
                            }}
                          >
                            <Send className="h-3 w-3 text-emerald-700" /> Resend
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
