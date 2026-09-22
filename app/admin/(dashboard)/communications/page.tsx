"use client";

import { Bell, CheckCircle2, Clock3, Mail, MessageSquareText, Play, RefreshCw, Save, Send, Star, TriangleAlert, ShieldCheck, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import {
  useGetAdminReviewsQuery,
  useGetCommunicationSummaryQuery,
  useGetDeliveryQueueQuery,
  useGetRetentionSettingsQuery,
  useResendReviewRequestMutation,
  useRetryDeliveryMutation,
  useRunCommunicationAutomationMutation,
  useUpdateRetentionSettingsMutation,
} from "@/src/redux/features/communications/communicationsApi";
import type { RetentionSettings } from "@/src/redux/features/communications/types";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";

const compactDate = (value?: string) => (value ? new Date(value).toLocaleString() : "—");
const idOf = (value: any) => (typeof value === "string" ? value : value?._id || value?.id || "");

export default function CommunicationsPage() {
  const user = useAppSelector(selectCurrentUser);
  const canManage = Boolean(user && ["owner", "admin", "manager"].includes(user.role));
  const canResend = Boolean(user && ["owner", "admin", "manager", "support"].includes(user.role));
  const summary = useGetCommunicationSummaryQuery();
  const settingsQuery = useGetRetentionSettingsQuery();
  const deliveries = useGetDeliveryQueueQuery({ limit: 25 });
  const reviews = useGetAdminReviewsQuery({ limit: 25 });
  const [updateSettings, { isLoading: saving }] = useUpdateRetentionSettingsMutation();
  const [runAutomation, { isLoading: running }] = useRunCommunicationAutomationMutation();
  const [resendReview, { isLoading: resending }] = useResendReviewRequestMutation();
  const [retryDelivery, { isLoading: retrying }] = useRetryDeliveryMutation();
  const [form, setForm] = useState<RetentionSettings>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (settingsQuery.data) {
      setForm({ ...settingsQuery.data, reminderHoursBefore: [...settingsQuery.data.reminderHoursBefore] });
    }
  }, [settingsQuery.data]);

  const busy = summary.isLoading || settingsQuery.isLoading || deliveries.isLoading || reviews.isLoading;
  const failed = summary.isError || settingsQuery.isError || deliveries.isError || reviews.isError;

  const reminderText = useMemo(() => form?.reminderHoursBefore?.join(", ") || "", [form?.reminderHoursBefore]);

  if (busy && !form) return <LoadingState label="Loading communication center…" />;
  if (failed && !form) {
    return (
      <ErrorState
        action={
          <button
            className="btn-secondary rounded-full"
            onClick={() => {
              summary.refetch();
              settingsQuery.refetch();
              deliveries.refetch();
              reviews.refetch();
            }}
          >
            Try again
          </button>
        }
      />
    );
  }
  if (!form) return null;

  const save = async () => {
    setMessage("");
    setError("");
    try {
      const next = await updateSettings(form).unwrap();
      setForm(next);
      setMessage("Communication and retention settings saved.");
      await summary.refetch();
    } catch (e: any) {
      setError(e?.data?.message || "Could not save communication settings.");
    }
  };

  const run = async () => {
    setMessage("");
    setError("");
    try {
      await runAutomation().unwrap();
      setMessage("Automation sweep completed. Eligible reminders, reviews, rebook messages, and win-back events were queued.");
      await Promise.all([summary.refetch(), deliveries.refetch(), reviews.refetch()]);
    } catch (e: any) {
      setError(e?.data?.message || "Could not run automations.");
    }
  };

  const resend = async (bookingId: string) => {
    if (!bookingId) return;
    setMessage("");
    setError("");
    try {
      await resendReview(bookingId).unwrap();
      setMessage("A fresh secure review request was queued.");
      await Promise.all([reviews.refetch(), deliveries.refetch(), summary.refetch()]);
    } catch (e: any) {
      setError(e?.data?.message || "Could not resend the review request.");
    }
  };

  const retry = async (id: string) => {
    setMessage("");
    setError("");
    try {
      await retryDelivery(id).unwrap();
      setMessage("Failed delivery returned to the queue.");
      await Promise.all([deliveries.refetch(), summary.refetch()]);
    } catch (e: any) {
      setError(e?.data?.message || "Could not retry this delivery.");
    }
  };

  const stats = summary.data;

  return (
    <div className="space-y-7">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Customer Communications
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Retention & review operations
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
              Manage lifecycle reminders, review requests, persistent delivery queues, rebooking, and win-back automations.
            </p>
          </div>
          {canManage ? (
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 disabled:opacity-50 shrink-0"
              type="button"
              onClick={run}
              disabled={running}
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Running…" : "Run automations now"}
            </button>
          ) : null}
        </div>
      </section>

      {message ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* 5 KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric icon={Bell} label="Portal events" value={stats?.notificationCount ?? 0} detail={`${stats?.unreadCount ?? 0} unread`} />
        <Metric icon={Clock3} label="Queued deliveries" value={stats?.queue.queued ?? 0} detail="Email / SMS outbox" />
        <Metric icon={CheckCircle2} label="Sent deliveries" value={stats?.queue.sent ?? 0} detail="Successfully delivered" />
        <Metric icon={TriangleAlert} label="Failed deliveries" value={stats?.queue.failed ?? 0} detail="Retry / inspect" />
        <Metric icon={Star} label="Reviews" value={stats?.reviews.submitted ?? 0} detail={`${stats?.reviews.pending ?? 0} pending`} />
      </div>

      {/* Automation Policy Section */}
      <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Rules & Cadence</span>
            <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Automation policy</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              All timing is evaluated by the backend scheduler; dedupe keys prevent repeated messages for the same event window.
            </p>
          </div>
          {canManage ? (
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
              type="button"
              onClick={save}
              disabled={saving}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving…" : "Save policy"}
            </button>
          ) : (
            <span className="rounded-full border border-emerald-950/10 bg-[#F4FAF5] px-3 py-1 text-xs font-bold text-muted-foreground">
              Read only
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ToggleCard
            label="Appointment reminders"
            description="Queue reminders ahead of upcoming confirmed/pending visits."
            checked={form.bookingRemindersEnabled}
            disabled={!canManage}
            onChange={(v) => setForm((c) => c && { ...c, bookingRemindersEnabled: v })}
          >
            <label className="mt-3 block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Hours before visit</span>
              <input
                className="mt-1.5 w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={!canManage}
                value={reminderText}
                onChange={(e) =>
                  setForm(
                    (c) =>
                      c && {
                        ...c,
                        reminderHoursBefore: e.target.value
                          .split(",")
                          .map(Number)
                          .filter((n) => Number.isFinite(n) && n > 0)
                          .slice(0, 8),
                      }
                  )
                }
                placeholder="24, 2"
              />
            </label>
          </ToggleCard>

          <ToggleCard
            label="Review requests"
            description="Generate secure, expiring post-service review links."
            checked={form.reviewRequestsEnabled}
            disabled={!canManage}
            onChange={(v) => setForm((c) => c && { ...c, reviewRequestsEnabled: v })}
          >
            <div className="mt-3 grid grid-cols-2 gap-3">
              <NumberField
                label="Delay (min)"
                value={form.reviewDelayMinutes}
                disabled={!canManage}
                min={0}
                onChange={(v) => setForm((c) => c && { ...c, reviewDelayMinutes: v })}
              />
              <NumberField
                label="Link life (days)"
                value={form.reviewLinkDays}
                disabled={!canManage}
                min={1}
                onChange={(v) => setForm((c) => c && { ...c, reviewLinkDays: v })}
              />
            </div>
          </ToggleCard>

          <ToggleCard
            label="Rebook reminders"
            description="Invite previous customers back after a completed visit if no future booking exists."
            checked={form.rebookRemindersEnabled}
            disabled={!canManage}
            onChange={(v) => setForm((c) => c && { ...c, rebookRemindersEnabled: v })}
          >
            <NumberField
              className="mt-3"
              label="Days after service"
              value={form.rebookReminderDays}
              disabled={!canManage}
              min={1}
              onChange={(v) => setForm((c) => c && { ...c, rebookReminderDays: v })}
            />
          </ToggleCard>

          <ToggleCard
            label="Inactive-customer win-back"
            description="Reach customers whose last activity is beyond the configured inactivity window."
            checked={form.winBackEnabled}
            disabled={!canManage}
            onChange={(v) => setForm((c) => c && { ...c, winBackEnabled: v })}
          >
            <NumberField
              className="mt-3"
              label="Inactive after days"
              value={form.inactiveCustomerDays}
              disabled={!canManage}
              min={7}
              onChange={(v) => setForm((c) => c && { ...c, inactiveCustomerDays: v })}
            />
          </ToggleCard>

          <ToggleCard
            label="SMS channel"
            description="Enable only after an SMS provider is configured on the backend. Email remains the default queue channel."
            checked={form.smsEnabled}
            disabled={!canManage}
            onChange={(v) => setForm((c) => c && { ...c, smsEnabled: v })}
          />

          <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
            <h3 className="font-extrabold text-brand-dark">Public-review handoff</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Customers always submit internally first. Ratings at or above this threshold may receive an optional public-review link.
            </p>
            <div className="mt-3 grid grid-cols-[120px_1fr] gap-3">
              <NumberField
                label="Threshold"
                value={form.publicReviewThreshold}
                disabled={!canManage}
                min={1}
                max={5}
                onChange={(v) => setForm((c) => c && { ...c, publicReviewThreshold: v })}
              />
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Public review URL</span>
                <input
                  type="url"
                  className="mt-1.5 w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  disabled={!canManage}
                  value={form.publicReviewUrl || ""}
                  onChange={(e) => setForm((c) => c && { ...c, publicReviewUrl: e.target.value })}
                  placeholder="https://…"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Tables: Delivery Queue & Post-service Reviews */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Delivery Queue */}
        <section className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="font-extrabold text-brand-dark">Delivery queue</h2>
              <p className="text-xs text-muted-foreground">Persistent asynchronous outbox</p>
            </div>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
              onClick={() => deliveries.refetch()}
              aria-label="Refresh delivery queue"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Channel / recipient</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Attempts</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {deliveries.data?.items.map((item) => (
                  <tr key={item._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-2">
                        {item.channel === "EMAIL" ? (
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        ) : (
                          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        )}
                        <div>
                          <p className="font-bold text-brand-dark">{item.recipient}</p>
                          <p className="max-w-[280px] truncate text-xs text-muted-foreground">
                            {item.subject || item.channel}
                          </p>
                          {item.lastError ? (
                            <p className="mt-1 max-w-[280px] truncate text-xs text-rose-600" title={item.lastError}>
                              {item.lastError}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
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
                    <td className="px-5 py-3.5 font-semibold text-brand-dark">{item.attempts}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{compactDate(item.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      {canResend && item.status === "FAILED" ? (
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-2.5 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
                          disabled={retrying}
                          onClick={() => retry(item._id)}
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
          {!deliveries.data?.items.length ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No delivery records yet.</div>
          ) : null}
        </section>

        {/* Post-service Reviews */}
        <section className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="font-extrabold text-brand-dark">Post-service reviews</h2>
              <p className="text-xs text-muted-foreground">Internal ratings and secure request status</p>
            </div>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
              onClick={() => reviews.refetch()}
              aria-label="Refresh reviews"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-brand-dark">
              <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Customer / booking</th>
                  <th className="px-5 py-3.5">Review</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5">
                {reviews.data?.items.map((item) => {
                  const booking = item.bookingId as any;
                  const customer = item.customerId as any;
                  return (
                    <tr key={item._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-brand-dark">{customer?.name || "Customer"}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking?.reference || "—"} · {booking?.serviceType || "Service"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.rating ? (
                          <>
                            <div className="flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  className={`h-3 w-3 ${
                                    n <= item.rating! ? "fill-[#7CE337] text-emerald-700" : "text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="mt-1 max-w-[240px] truncate text-xs text-muted-foreground">
                              {item.comment || "No comment"}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Awaiting feedback</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                            item.status === "SUBMITTED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {canResend && item.status !== "SUBMITTED" && idOf(booking) ? (
                          <button
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-2.5 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
                            disabled={resending}
                            onClick={() => resend(idOf(booking))}
                          >
                            <Send className="h-3 w-3 text-emerald-700" /> Resend
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">{compactDate(item.submittedAt)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!reviews.data?.items.length ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No review requests yet.</div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: any;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-brand-dark">{value.toLocaleString()}</span>
      </div>
      <p className="mt-3 text-sm font-bold text-brand-dark">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
  disabled,
  children,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-brand-dark text-sm">{label}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
            checked ? "bg-[#7CE337]" : "bg-slate-200"
          } disabled:opacity-50`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              checked ? "translate-x-6 bg-[#0C3629]" : "translate-x-1"
            }`}
          />
          <span className="sr-only">
            {checked ? "Disable" : "Enable"} {label}
          </span>
        </button>
      </div>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
  className = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        className="mt-1.5 w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </label>
  );
}
