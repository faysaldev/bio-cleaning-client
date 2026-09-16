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

function Queue({ title, description, tasks, tone, onComplete, busy }: { title: string; description: string; tasks: LeadTask[]; tone: "danger" | "today" | "upcoming"; onComplete: (task: LeadTask) => void; busy: boolean }) {
  const icon = tone === "danger" ? TriangleAlert : tone === "today" ? Clock3 : CalendarClock;
  const Icon = icon;
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div><div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${tone === "danger" ? "text-destructive" : "text-brand-green"}`} /><h2 className="font-extrabold text-brand-dark">{title}</h2></div><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>
        <span className="rounded-lg bg-brand-cream px-2 py-1 text-xs font-extrabold text-brand-dark">{tasks.length}</span>
      </div>
      {tasks.length ? <div className="divide-y divide-border">{tasks.map((task) => {
        const lead = leadOf(task);
        return <article key={task._id} className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <button type="button" disabled={busy} onClick={() => onComplete(task)} className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand-green/25 bg-brand-green/5 text-brand-green hover:bg-brand-green hover:text-white disabled:opacity-50" aria-label={`Complete ${task.title}`}><Check className="h-3.5 w-3.5" /></button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-extrabold text-brand-dark">{task.title}</p>{lead ? <Link href={`/admin/leads/${lead._id}`} className="mt-1 block text-sm font-bold text-brand-green hover:underline">{lead.name}</Link> : null}</div><div className="text-right"><p className={`text-xs font-extrabold ${tone === "danger" ? "text-destructive" : "text-brand-dark"}`}>{new Date(task.dueAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{task.priority} priority</p></div></div>
              {lead ? <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><LeadStatusBadge status={lead.status} />{lead.requestedServiceName ? <span>{lead.requestedServiceName}</span> : null}<span className="font-extrabold text-brand-dark">{money(lead.value)}</span>{lead.email ? <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Mail className="h-3 w-3" /> Email</a> : null}{lead.phone ? <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 hover:text-brand-green"><Phone className="h-3 w-3" /> Call</a> : null}</div> : null}
              {task.description ? <p className="mt-3 text-sm leading-6 text-brand-dark/70">{task.description}</p> : null}
            </div>
          </div>
        </article>;
      })}</div> : <EmptyState title={`No ${title.toLowerCase()} follow-ups`} description="Nothing in this queue needs attention right now." className="m-4 min-h-40" />}
    </section>
  );
}

export default function FollowUpsPage() {
  const query = useGetFollowUpsQuery({ days: 21 });
  const [updateTask, updateState] = useUpdateLeadTaskMutation();
  if (query.isLoading) return <LoadingState label="Loading follow-up queues…" />;
  if (query.isError || !query.data?.data) return <ErrorState title="Follow-ups are unavailable" description="The follow-up queue could not be loaded." />;
  const data = query.data.data;
  const complete = async (task: LeadTask) => {
    const lead = leadOf(task);
    if (!lead) return;
    await updateTask({ id: lead._id, taskId: task._id, body: { status: "COMPLETED" } });
  };
  return <div className="space-y-6">
    <section><Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-brand-green"><ArrowLeft className="h-3.5 w-3.5" /> Back to pipeline</Link><span className="editorial-kicker mt-4 block">Daily sales queue</span><h1 className="admin-page-heading mt-3 text-brand-dark">Follow-ups</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">Today is calculated in <strong className="text-brand-dark">{data.timezone}</strong>, so the team shares one business-day definition regardless of browser location.</p></section>
    <div className="grid gap-6 xl:grid-cols-3"><Queue title="Overdue" description="Past-due actions that need recovery first." tasks={data.overdue} tone="danger" onComplete={complete} busy={updateState.isLoading} /><Queue title="Today" description={`Due on ${data.date} in the business timezone.`} tasks={data.today} tone="today" onComplete={complete} busy={updateState.isLoading} /><Queue title="Upcoming" description="Scheduled actions across the next three weeks." tasks={data.upcoming} tone="upcoming" onComplete={complete} busy={updateState.isLoading} /></div>
  </div>;
}
