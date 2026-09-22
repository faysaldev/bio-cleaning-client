"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, Check, Clock3, Mail, Phone, TriangleAlert } from "lucide-react";
import { useGetFollowUpsQuery, useUpdateLeadTaskMutation } from "@/src/redux/features/crm/crmApi";
import type { LeadTask } from "@/src/redux/features/crm/types";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { LeadStatusBadge, money } from "@/src/components/Admin/CRM/LeadStatus";

function leadOf(task: LeadTask) {
  return typeof task.leadId === "object" ? task.leadId : null;
}

function Queue({
  title,
  description,
  tasks,
  tone,
  onComplete,
  busy,
}: {
  title: string;
  description: string;
  tasks: LeadTask[];
  tone: "danger" | "today" | "upcoming";
  onComplete: (task: LeadTask) => void;
  busy: boolean;
}) {
  const icon = tone === "danger" ? TriangleAlert : tone === "today" ? Clock3 : CalendarClock;
  const Icon = icon;

  const toneHeaderStyles =
    tone === "danger"
      ? "bg-rose-50/70 border-rose-200/50 text-rose-900"
      : tone === "today"
      ? "bg-emerald-50/70 border-emerald-200/50 text-emerald-950"
      : "bg-slate-50/70 border-slate-200/50 text-slate-900";

  const badgeStyles =
    tone === "danger"
      ? "bg-rose-100 text-rose-800"
      : tone === "today"
      ? "bg-[#7CE337] text-[#0C3629]"
      : "bg-slate-200/70 text-slate-800";

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm flex flex-col">
      <div className={`flex items-start justify-between gap-3 border-b px-5 py-4 ${toneHeaderStyles}`}>
        <div>
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${tone === "danger" ? "text-rose-600" : "text-emerald-700"}`} />
            <h2 className="font-extrabold tracking-tight">{title}</h2>
          </div>
          <p className="mt-1 text-xs opacity-80">{description}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${badgeStyles}`}>
          {tasks.length}
        </span>
      </div>

      {tasks.length ? (
        <div className="divide-y divide-border/60">
          {tasks.map((task) => {
            const lead = leadOf(task);
            return (
              <article key={task._id} className="p-4 sm:p-5 hover:bg-[#F4FAF5]/30 transition-colors">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onComplete(task)}
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-50"
                    aria-label={`Complete ${task.title}`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-brand-dark">{task.title}</p>
                        {lead ? (
                          <Link href={`/admin/leads/${lead._id}`} className="mt-0.5 block text-xs font-bold text-emerald-700 hover:underline">
                            {lead.name}
                          </Link>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-extrabold ${tone === "danger" ? "text-rose-600" : "text-brand-dark"}`}>
                          {new Date(task.dueAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                          {task.priority} priority
                        </p>
                      </div>
                    </div>

                    {lead ? (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <LeadStatusBadge status={lead.status} />
                        {lead.requestedServiceName ? <span className="font-medium text-brand-dark/70">{lead.requestedServiceName}</span> : null}
                        <span className="font-extrabold text-brand-dark">{money(lead.value)}</span>
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-emerald-700 hover:underline">
                            <Mail className="h-3 w-3" /> Email
                          </a>
                        ) : null}
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 text-emerald-700 hover:underline">
                            <Phone className="h-3 w-3" /> Call
                          </a>
                        ) : null}
                      </div>
                    ) : null}

                    {task.description ? (
                      <p className="mt-2.5 rounded-xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-2.5 text-xs leading-5 text-brand-dark/75">
                        {task.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()} follow-ups`}
          description="Nothing in this queue needs attention right now."
          className="m-4 min-h-40"
        />
      )}
    </section>
  );
}

export default function FollowUpsPage() {
  const query = useGetFollowUpsQuery({ days: 21 });
  const [updateTask, updateState] = useUpdateLeadTaskMutation();

  if (query.isLoading) return <LoadingState label="Loading follow-up queues…" />;
  if (query.isError || !query.data?.data) {
    return (
      <ErrorState
        title="Follow-ups are unavailable"
        description="The follow-up queue could not be loaded."
        action={
          <button className="btn-secondary rounded-full" onClick={() => query.refetch()}>
            Try again
          </button>
        }
      />
    );
  }

  const data = query.data.data;

  const complete = async (task: LeadTask) => {
    const lead = leadOf(task);
    if (!lead) return;
    await updateTask({ id: lead._id, taskId: task._id, body: { status: "COMPLETED" } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to pipeline
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
              Daily Sales Queue
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Follow-ups</h1>
          <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
            Today is calculated in <strong className="text-[#7CE337]">{data.timezone}</strong>, so the team shares one business-day definition regardless of browser location.
          </p>
        </div>
      </section>

      {/* 3 Queue Columns */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Queue
          title="Overdue"
          description="Past-due actions that need recovery first."
          tasks={data.overdue}
          tone="danger"
          onComplete={complete}
          busy={updateState.isLoading}
        />
        <Queue
          title="Today"
          description={`Due on ${data.date} in the business timezone.`}
          tasks={data.today}
          tone="today"
          onComplete={complete}
          busy={updateState.isLoading}
        />
        <Queue
          title="Upcoming"
          description="Scheduled actions across the next three weeks."
          tasks={data.upcoming}
          tone="upcoming"
          onComplete={complete}
          busy={updateState.isLoading}
        />
      </div>
    </div>
  );
}
