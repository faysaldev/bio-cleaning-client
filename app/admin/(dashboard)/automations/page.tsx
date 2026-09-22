"use client";

import { Play, Save, Workflow, ShieldCheck, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetRetentionSettingsQuery,
  useRunCommunicationAutomationMutation,
  useUpdateRetentionSettingsMutation,
} from "@/src/redux/features/communications/communicationsApi";
import type { RetentionSettings } from "@/src/redux/features/communications/types";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";

export default function AutomationsPage() {
  const q = useGetRetentionSettingsQuery();
  const [form, setForm] = useState<RetentionSettings>();
  const [save, { isLoading: saving }] = useUpdateRetentionSettingsMutation();
  const [run, { isLoading: running }] = useRunCommunicationAutomationMutation();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (q.data) {
      setForm({ ...q.data, reminderHoursBefore: [...q.data.reminderHoursBefore] });
    }
  }, [q.data]);

  if (q.isLoading && !form) return <LoadingState label="Loading automations…" />;
  if (q.isError || !form) {
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

  const toggles: [keyof RetentionSettings, string, string][] = [
    ["bookingRemindersEnabled", "Booking reminders", "Notify customers automatically ahead of confirmed visits."],
    ["reviewRequestsEnabled", "Review requests", "Generate secure post-service review links after completed visits."],
    ["rebookRemindersEnabled", "Rebook reminders", "Invite completed customers back if no future booking is scheduled."],
    ["winBackEnabled", "Win-back campaign", "Reach dormant customers after the configured inactivity threshold."],
    ["smsEnabled", "SMS channel", "Enable only after an SMS provider (e.g. Twilio) is configured on the backend."],
  ];

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Lifecycle Automation
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Automations</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Rules run safely in background workers with deduplication keys, so customer web requests never wait on message delivery.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 disabled:opacity-50 shrink-0"
            disabled={running}
            onClick={async () => {
              await run().unwrap();
              setNotice("Automation sweep completed and eligible events were queued.");
            }}
          >
            <Play className="h-3.5 w-3.5" />
            {running ? "Running…" : "Run automations now"}
          </button>
        </div>
      </section>

      {notice ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      ) : null}

      {/* Main Form Section */}
      <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Trigger Conditions</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Active automation rules</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {toggles.map(([key, title, copy]) => (
            <label
              key={String(key)}
              className="flex cursor-pointer items-start gap-4 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4 hover:border-emerald-600/30 transition-all"
            >
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-extrabold text-brand-dark text-sm">
                  <Workflow className="h-4 w-4 text-emerald-700" />
                  {title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{copy}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-8 border-t border-border/60 pt-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Timing & Schedule</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Cadence settings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Reminder hours (csv)
              </span>
              <input
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={form.reminderHoursBefore.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reminderHoursBefore: e.target.value
                      .split(",")
                      .map(Number)
                      .filter((n) => Number.isFinite(n) && n > 0),
                  })
                }
              />
            </label>
            <Num
              label="Review delay (min)"
              value={form.reviewDelayMinutes}
              onChange={(v) => setForm({ ...form, reviewDelayMinutes: v })}
            />
            <Num
              label="Rebook after days"
              value={form.rebookReminderDays}
              onChange={(v) => setForm({ ...form, rebookReminderDays: v })}
            />
            <Num
              label="Inactive after days"
              value={form.inactiveCustomerDays}
              onChange={(v) => setForm({ ...form, inactiveCustomerDays: v })}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-border/60 pt-6">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
            disabled={saving}
            onClick={async () => {
              const next = await save(form).unwrap();
              setForm(next);
              setNotice("Automation policy saved successfully.");
            }}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save policy"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <input
        className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}
