"use client";

import Link from "next/link";
import { Mail, MessageSquareText, RefreshCw, Send, CheckCircle2, Clock } from "lucide-react";
import { useGetDeliveryQueueQuery, useRetryDeliveryMutation } from "@/src/redux/features/communications/communicationsApi";
import { ErrorState, LoadingState, EmptyState } from "@/src/components/ui/feedback";

export default function MessagesPage() {
  const q = useGetDeliveryQueueQuery({ limit: 50 });
  const [retry, { isLoading }] = useRetryDeliveryMutation();

  if (q.isLoading && !q.data) return <LoadingState label="Loading customer messages…" />;
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

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Customer Communication
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Messages & delivery queue
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Persistent email and SMS delivery records. Sensitive message contents are protected and masked here.
            </p>
          </div>
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 shrink-0"
          >
            Open inbound contact inbox
          </Link>
        </div>
      </section>

      {/* Main Delivery Queue Table */}
      {items.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No delivery records"
          description="Outgoing customer messages will appear in this delivery queue as transactions occur."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Attempts</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-dark">{item.recipient}</td>
                    <td className="px-6 py-4 max-w-[260px] truncate text-muted-foreground">
                      {item.subject || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {item.channel === "EMAIL" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          <Mail className="h-3.5 w-3.5 text-emerald-700" /> Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          <MessageSquareText className="h-3.5 w-3.5 text-emerald-700" /> SMS
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          item.status === "SENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "FAILED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-dark">{item.attempts}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "FAILED" ? (
                        <button
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40"
                          onClick={async () => {
                            await retry(item._id);
                            q.refetch();
                          }}
                        >
                          <RefreshCw className="h-3 w-3 text-emerald-700" /> Retry
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
