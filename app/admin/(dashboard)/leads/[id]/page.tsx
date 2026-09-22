"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  UserCheck,
  ShieldCheck,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  useAddLeadActivityMutation,
  useConvertLeadMutation,
  useCreateLeadTaskMutation,
  useGetLeadOwnersQuery,
  useGetLeadQuery,
  useUpdateLeadMutation,
  useUpdateLeadTaskMutation,
} from "@/src/redux/features/crm/crmApi";
import { LEAD_STAGE_LABELS, type LeadStatus } from "@/src/redux/features/crm/types";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { LeadSourceBadge, LeadStatusBadge, money } from "@/src/components/Admin/CRM/LeadStatus";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/src/components/ui/form-field";

const stages = Object.keys(LEAD_STAGE_LABELS) as LeadStatus[];

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const query = useGetLeadQuery(id);
  const ownersQuery = useGetLeadOwnersQuery();
  const [updateLead, updateState] = useUpdateLeadMutation();
  const [convertLead, convertState] = useConvertLeadMutation();
  const [addActivity, activityState] = useAddLeadActivityMutation();
  const [createTask, taskState] = useCreateLeadTaskMutation();
  const [updateTask, taskUpdateState] = useUpdateLeadTaskMutation();
  const [activityType, setActivityType] = useState<"NOTE" | "CALL" | "EMAIL" | "SMS" | "QUOTE">("NOTE");
  const [activityBody, setActivityBody] = useState("");
  const [taskTitle, setTaskTitle] = useState("Follow up");
  const [taskDueLocal, setTaskDueLocal] = useState("");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [lostReason, setLostReason] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const detail = query.data?.data;
  const lead = detail?.lead;
  const openTasks = useMemo(() => detail?.tasks.filter((task) => task.status === "PENDING") || [], [detail?.tasks]);

  if (query.isLoading) return <LoadingState label="Loading lead workspace…" />;
  if (query.isError || !lead || !detail) {
    return (
      <ErrorState
        title="Lead not found"
        description="This lead may have been removed or the CRM request failed."
        action={
          <button className="btn-secondary rounded-full" onClick={() => router.push("/admin/leads")}>
            Back to leads
          </button>
        }
      />
    );
  }

  const ownerId = typeof lead.ownerId === "object" ? lead.ownerId?._id : lead.ownerId || "";
  const customerId = typeof lead.customerId === "object" ? lead.customerId?._id : lead.customerId;

  const changeStatus = async (nextStatus: LeadStatus) => {
    if (nextStatus === lead.status) return;
    setError("");
    setNotice("");
    if (nextStatus === "LOST" && !lostReason.trim()) {
      setError("Add a lost reason before closing this lead as lost.");
      return;
    }
    try {
      if (nextStatus === "WON") {
        const result = await convertLead({ id }).unwrap();
        setNotice(`Lead converted and linked to ${result.data.customer.name}.`);
      } else {
        await updateLead({ id, body: { status: nextStatus, lostReason: nextStatus === "LOST" ? lostReason : undefined } }).unwrap();
        setNotice(`Pipeline stage changed to ${LEAD_STAGE_LABELS[nextStatus]}.`);
      }
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The lead could not be updated.");
    }
  };

  const changeOwner = async (nextOwner: string) => {
    setError("");
    try {
      await updateLead({ id, body: { ownerId: nextOwner || "" } }).unwrap();
    } catch (requestError: any) {
      setError(requestError?.data?.message || "Owner assignment failed.");
    }
  };

  const recordActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityBody.trim()) return;
    setError("");
    try {
      await addActivity({
        id,
        body: {
          type: activityType,
          title: activityType === "NOTE" ? "Internal note" : `${activityType.charAt(0)}${activityType.slice(1).toLowerCase()} activity`,
          body: activityBody.trim(),
          direction: activityType === "NOTE" ? "INTERNAL" : "OUTBOUND",
        },
      }).unwrap();
      setActivityBody("");
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The activity could not be recorded.");
    }
  };

  const scheduleTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!taskDueLocal) {
      setError("Choose the business-local follow-up date and time.");
      return;
    }
    setError("");
    try {
      await createTask({ id, body: { title: taskTitle, dueLocal: taskDueLocal, priority: taskPriority, assignedTo: ownerId || undefined } }).unwrap();
      setTaskTitle("Follow up");
      setTaskDueLocal("");
      setNotice("Follow-up scheduled using the business timezone.");
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The follow-up could not be scheduled.");
    }
  };

  const completeTask = async (taskId: string) => {
    setError("");
    try {
      await updateTask({ id, taskId, body: { status: "COMPLETED" } }).unwrap();
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The task could not be completed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to pipeline
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <LeadSourceBadge source={lead.source} />
              <LeadStatusBadge status={lead.status} />
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {lead.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-emerald-100/80">
              {lead.email ? (
                <a className="inline-flex items-center gap-1.5 hover:text-[#7CE337] transition-colors" href={`mailto:${lead.email}`}>
                  <Mail className="h-3.5 w-3.5" /> {lead.email}
                </a>
              ) : null}
              {lead.phone ? (
                <a className="inline-flex items-center gap-1.5 hover:text-[#7CE337] transition-colors" href={`tel:${lead.phone}`}>
                  <Phone className="h-3.5 w-3.5" /> {lead.phone}
                </a>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              href={`/admin/quotes?leadId=${id}`}
            >
              <FileText className="h-3.5 w-3.5 text-[#7CE337]" /> Create estimate
            </Link>
            {customerId ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                href={`/admin/customers/${customerId}`}
              >
                <UserCheck className="h-3.5 w-3.5 text-[#7CE337]" /> Open customer
              </Link>
            ) : (
              <button
                type="button"
                disabled={convertState.isLoading}
                onClick={() => void changeStatus("WON")}
                className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-4 py-2 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="h-3.5 w-3.5" /> Convert to customer
              </button>
            )}
          </div>
        </div>
      </section>

      {notice ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm" role="status">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 shadow-sm" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Opportunity value</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{money(lead.value)}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">{lead.requestedServiceName || "General cleaning"}</p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Next follow-up</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-base font-extrabold text-brand-dark">{formatDate(lead.nextFollowUpAt)}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">{openTasks.length} open task{openTasks.length === 1 ? "" : "s"}</p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Last contact</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-base font-extrabold text-brand-dark">{formatDate(lead.lastContactAt)}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Activity updated {formatDate(lead.lastActivityAt)}</p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Captured</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-base font-extrabold text-brand-dark">{new Date(lead.createdAt).toLocaleDateString()}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">{lead.sourceHistory?.length || 1} captured touchpoint{(lead.sourceHistory?.length || 1) === 1 ? "" : "s"}</p>
        </article>
      </section>

      {/* Main Grid: Activity & Controls */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {/* Timeline */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Relationship history</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Activity timeline</h2>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>

            {detail.activities.length ? (
              <ol className="mt-6 space-y-0">
                {detail.activities.map((item, index) => (
                  <li key={item._id} className="relative grid grid-cols-[28px_1fr] gap-3 pb-6 last:pb-0">
                    {index !== detail.activities.length - 1 ? (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-10px)] w-px bg-border" />
                    ) : null}
                    <span className="relative z-10 mt-1 grid h-7 w-7 place-items-center rounded-full border border-emerald-950/10 bg-emerald-50 text-emerald-700">
                      <Clock3 className="h-3.5 w-3.5" />
                    </span>
                    <div className="rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-extrabold text-brand-dark">{item.title}</p>
                        <span className="rounded-full border border-emerald-950/10 bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                          {item.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      {item.body ? (
                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-brand-dark/80">{item.body}</p>
                      ) : null}
                      <p className="mt-2 text-[10px] font-semibold text-muted-foreground">
                        {formatDate(item.occurredAt)}{item.createdBy?.name ? ` · ${item.createdBy.name}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState className="mt-5" title="No activity yet" description="Notes, calls, emails and pipeline changes will appear here." />
            )}
          </section>

          {/* Record Interaction */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Communication</span>
            <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Record an interaction</h2>
            <form className="mt-5" onSubmit={recordActivity}>
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <SelectInput value={activityType} onChange={(event) => setActivityType(event.target.value as any)}>
                  <option value="NOTE">Internal note</option>
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="QUOTE">Quote update</option>
                </SelectInput>
                <TextArea
                  value={activityBody}
                  onChange={(event) => setActivityBody(event.target.value)}
                  placeholder="What happened? Add context the next teammate will need…"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm transition-all hover:bg-[#8eed49] active:scale-95 disabled:opacity-50"
                  disabled={activityState.isLoading || !activityBody.trim()}
                >
                  <Send className="h-3.5 w-3.5" /> Save activity
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Ownership & Stage */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Pipeline control</span>
            <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Ownership & stage</h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <FieldLabel>Owner</FieldLabel>
                <SelectInput value={ownerId || ""} onChange={(event) => void changeOwner(event.target.value)} disabled={updateState.isLoading}>
                  <option value="">Unassigned</option>
                  {(ownersQuery.data?.data || []).map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name}
                    </option>
                  ))}
                </SelectInput>
              </label>

              <label className="block">
                <FieldLabel>Stage</FieldLabel>
                <SelectInput
                  value={lead.status}
                  onChange={(event) => void changeStatus(event.target.value as LeadStatus)}
                  disabled={updateState.isLoading || convertState.isLoading}
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {LEAD_STAGE_LABELS[stage]}
                    </option>
                  ))}
                </SelectInput>
              </label>

              {lead.status !== "WON" ? (
                <label className="block">
                  <FieldLabel>Lost reason (required before Lost)</FieldLabel>
                  <TextArea
                    className="min-h-20"
                    value={lostReason}
                    onChange={(event) => setLostReason(event.target.value)}
                    placeholder="Budget, timing, no response…"
                  />
                </label>
              ) : null}
            </div>
          </section>

          {/* Follow-ups */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Next actions</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Follow-ups</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <CalendarClock className="h-4 w-4" />
              </div>
            </div>

            <form className="mt-4 space-y-3" onSubmit={scheduleTask}>
              <label className="block">
                <FieldLabel>Task</FieldLabel>
                <TextInput value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
              </label>
              <label className="block">
                <FieldLabel>Business-local date & time</FieldLabel>
                <TextInput type="datetime-local" value={taskDueLocal} onChange={(event) => setTaskDueLocal(event.target.value)} />
              </label>
              <label className="block">
                <FieldLabel>Priority</FieldLabel>
                <SelectInput value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as any)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </SelectInput>
              </label>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-xs font-bold text-brand-dark shadow-sm transition-all hover:bg-emerald-50 active:scale-95 disabled:opacity-50"
                disabled={taskState.isLoading || !taskDueLocal}
              >
                <Plus className="h-3.5 w-3.5 text-emerald-700" /> Schedule follow-up
              </button>
            </form>

            <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
              {openTasks.length ? (
                openTasks.map((task) => (
                  <div key={task._id} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-brand-dark">{task.title}</p>
                        <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                          {formatDate(task.dueAt)} · {task.priority}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={taskUpdateState.isLoading}
                        onClick={() => void completeTask(task._id)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-emerald-500/20 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        aria-label={`Complete ${task.title}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No open follow-ups.</p>
              )}
            </div>
          </section>

          {/* Context Details */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Lead context</span>
            <dl className="mt-4 space-y-3.5 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Requested service</dt>
                <dd className="mt-1 font-semibold text-brand-dark">{lead.requestedServiceName || "Not specified"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Tags</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {lead.tags?.length ? (
                    lead.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-emerald-950/10 bg-emerald-50/70 px-2.5 py-0.5 text-[10px] font-bold text-brand-dark">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </dd>
              </div>
              {lead.referral?.referredBy ? (
                <div>
                  <dt className="text-xs font-bold text-muted-foreground">Referred by</dt>
                  <dd className="mt-1 font-semibold text-brand-dark">{lead.referral.referredBy}</dd>
                </div>
              ) : null}
              {lead.message ? (
                <div>
                  <dt className="text-xs font-bold text-muted-foreground">Initial message</dt>
                  <dd className="mt-1 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-3 whitespace-pre-wrap text-xs leading-5 text-brand-dark/80">
                    {lead.message}
                  </dd>
                </div>
              ) : null}
              {lead.notes ? (
                <div>
                  <dt className="text-xs font-bold text-muted-foreground">Notes</dt>
                  <dd className="mt-1 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-3 whitespace-pre-wrap text-xs leading-5 text-brand-dark/80">
                    {lead.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
