"use client";

import { Bell, CheckCircle2, Clock3, Mail, MessageSquareText, Play, RefreshCw, Save, Send, Star, TriangleAlert } from "lucide-react";
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

const compactDate = (value?: string) => value ? new Date(value).toLocaleString() : "—";
const idOf = (value: any) => typeof value === "string" ? value : value?._id || value?.id || "";

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

  useEffect(() => { if (settingsQuery.data) setForm({ ...settingsQuery.data, reminderHoursBefore: [...settingsQuery.data.reminderHoursBefore] }); }, [settingsQuery.data]);
  const busy = summary.isLoading || settingsQuery.isLoading || deliveries.isLoading || reviews.isLoading;
  const failed = summary.isError || settingsQuery.isError || deliveries.isError || reviews.isError;

  const reminderText = useMemo(() => form?.reminderHoursBefore?.join(", ") || "", [form?.reminderHoursBefore]);
  if (busy && !form) return <LoadingState label="Loading communication center…" />;
  if (failed && !form) return <ErrorState action={<button className="btn-secondary" onClick={() => { summary.refetch(); settingsQuery.refetch(); deliveries.refetch(); reviews.refetch(); }}>Try again</button>} />;
  if (!form) return null;

  const save = async () => {
    setMessage(""); setError("");
    try { const next = await updateSettings(form).unwrap(); setForm(next); setMessage("Communication and retention settings saved."); await summary.refetch(); }
    catch (e:any) { setError(e?.data?.message || "Could not save communication settings."); }
  };
  const run = async () => {
    setMessage(""); setError("");
    try { await runAutomation().unwrap(); setMessage("Automation sweep completed. Eligible reminders, reviews, rebook messages, and win-back events were queued."); await Promise.all([summary.refetch(), deliveries.refetch(), reviews.refetch()]); }
    catch (e:any) { setError(e?.data?.message || "Could not run automations."); }
  };
  const resend = async (bookingId: string) => {
    if (!bookingId) return;
    setMessage(""); setError("");
    try { await resendReview(bookingId).unwrap(); setMessage("A fresh secure review request was queued."); await Promise.all([reviews.refetch(), deliveries.refetch(), summary.refetch()]); }
    catch (e:any) { setError(e?.data?.message || "Could not resend the review request."); }
  };
  const retry = async (id: string) => {
    setMessage(""); setError("");
    try { await retryDelivery(id).unwrap(); setMessage("Failed delivery returned to the queue."); await Promise.all([deliveries.refetch(), summary.refetch()]); }
    catch (e:any) { setError(e?.data?.message || "Could not retry this delivery."); }
  };

  const stats = summary.data;
  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-green">Customer communications</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-.04em] text-brand-dark">Retention & review operations</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Manage lifecycle reminders, review requests, the persistent delivery queue, rebooking and win-back automations. Email is delivered asynchronously; SMS remains provider-agnostic until enabled.</p></div>{canManage ? <button className="btn-secondary" type="button" onClick={run} disabled={running}><Play className="h-4 w-4"/>{running?"Running…":"Run automations now"}</button> : null}</div>
    {message ? <div className="feedback-panel border-brand-green/20 bg-brand-green/5 text-brand-dark">{message}</div> : null}
    {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Metric icon={Bell} label="Portal events" value={stats?.notificationCount ?? 0} detail={`${stats?.unreadCount ?? 0} unread`} />
      <Metric icon={Clock3} label="Queued deliveries" value={stats?.queue.queued ?? 0} detail="Email / SMS outbox" />
      <Metric icon={CheckCircle2} label="Sent deliveries" value={stats?.queue.sent ?? 0} detail="Successfully delivered" />
      <Metric icon={TriangleAlert} label="Failed deliveries" value={stats?.queue.failed ?? 0} detail="Retry / inspect" />
      <Metric icon={Star} label="Reviews" value={stats?.reviews.submitted ?? 0} detail={`${stats?.reviews.pending ?? 0} pending`} />
    </div>

    <section className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-brand-dark">Automation policy</h2><p className="mt-1 text-sm text-muted-foreground">All timing is evaluated by the backend scheduler; dedupe keys prevent repeated messages for the same event window.</p></div>{canManage ? <button className="btn-primary" type="button" onClick={save} disabled={saving}><Save className="h-4 w-4"/>{saving?"Saving…":"Save policy"}</button> : <span className="status-badge">Read only</span>}</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ToggleCard label="Appointment reminders" description="Queue reminders ahead of upcoming confirmed/pending visits." checked={form.bookingRemindersEnabled} disabled={!canManage} onChange={(v)=>setForm((c)=>c&&({...c,bookingRemindersEnabled:v}))}><label className="field-group mt-3"><span className="field-label">Hours before visit</span><input className="field-control" disabled={!canManage} value={reminderText} onChange={(e)=>setForm((c)=>c&&({...c,reminderHoursBefore:e.target.value.split(",").map(Number).filter((n)=>Number.isFinite(n)&&n>0).slice(0,8)}))} placeholder="24, 2"/></label></ToggleCard>
        <ToggleCard label="Review requests" description="Generate secure, expiring post-service review links." checked={form.reviewRequestsEnabled} disabled={!canManage} onChange={(v)=>setForm((c)=>c&&({...c,reviewRequestsEnabled:v}))}><div className="mt-3 grid grid-cols-2 gap-3"><NumberField label="Delay (min)" value={form.reviewDelayMinutes} disabled={!canManage} min={0} onChange={(v)=>setForm((c)=>c&&({...c,reviewDelayMinutes:v}))}/><NumberField label="Link life (days)" value={form.reviewLinkDays} disabled={!canManage} min={1} onChange={(v)=>setForm((c)=>c&&({...c,reviewLinkDays:v}))}/></div></ToggleCard>
        <ToggleCard label="Rebook reminders" description="Invite previous customers back after a completed visit if no future booking exists." checked={form.rebookRemindersEnabled} disabled={!canManage} onChange={(v)=>setForm((c)=>c&&({...c,rebookRemindersEnabled:v}))}><NumberField className="mt-3" label="Days after service" value={form.rebookReminderDays} disabled={!canManage} min={1} onChange={(v)=>setForm((c)=>c&&({...c,rebookReminderDays:v}))}/></ToggleCard>
        <ToggleCard label="Inactive-customer win-back" description="Reach customers whose last activity is beyond the configured inactivity window." checked={form.winBackEnabled} disabled={!canManage} onChange={(v)=>setForm((c)=>c&&({...c,winBackEnabled:v}))}><NumberField className="mt-3" label="Inactive after days" value={form.inactiveCustomerDays} disabled={!canManage} min={7} onChange={(v)=>setForm((c)=>c&&({...c,inactiveCustomerDays:v}))}/></ToggleCard>
        <ToggleCard label="SMS channel" description="Enable only after an SMS provider is configured on the backend. Email remains the default queue channel." checked={form.smsEnabled} disabled={!canManage} onChange={(v)=>setForm((c)=>c&&({...c,smsEnabled:v}))}/>
        <div className="rounded-2xl border border-border bg-brand-cream/35 p-4"><h3 className="font-extrabold text-brand-dark">Public-review handoff</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Customers always submit internally first. Ratings at or above this threshold may receive an optional public-review link.</p><div className="mt-3 grid grid-cols-[120px_1fr] gap-3"><NumberField label="Threshold" value={form.publicReviewThreshold} disabled={!canManage} min={1} max={5} onChange={(v)=>setForm((c)=>c&&({...c,publicReviewThreshold:v}))}/><label className="field-group"><span className="field-label">Public review URL</span><input type="url" className="field-control" disabled={!canManage} value={form.publicReviewUrl || ""} onChange={(e)=>setForm((c)=>c&&({...c,publicReviewUrl:e.target.value}))} placeholder="https://…"/></label></div></div>
      </div>
    </section>

    <div className="grid gap-6 xl:grid-cols-2">
      <section className="surface overflow-hidden"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-extrabold text-brand-dark">Delivery queue</h2><p className="text-xs text-muted-foreground">Persistent asynchronous outbox</p></div><button className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream hover:text-brand-dark" onClick={()=>deliveries.refetch()} aria-label="Refresh delivery queue"><RefreshCw className="h-4 w-4"/></button></div><div className="overflow-x-auto"><table className="data-table min-w-[780px]"><thead><tr><th>Channel / recipient</th><th>Status</th><th>Attempts</th><th>Created</th><th>Action</th></tr></thead><tbody>{deliveries.data?.items.map((item)=><tr key={item._id}><td><div className="flex items-start gap-2">{item.channel==="EMAIL"?<Mail className="mt-0.5 h-4 w-4 text-brand-green"/>:<MessageSquareText className="mt-0.5 h-4 w-4 text-brand-green"/>}<div><p className="font-bold text-brand-dark">{item.recipient}</p><p className="max-w-[320px] truncate text-xs text-muted-foreground">{item.subject || item.channel}</p>{item.lastError?<p className="mt-1 max-w-[320px] truncate text-xs text-destructive" title={item.lastError}>{item.lastError}</p>:null}</div></div></td><td><span className="status-badge">{item.status}</span></td><td>{item.attempts}</td><td className="text-xs text-muted-foreground">{compactDate(item.createdAt)}</td><td>{canResend && item.status==="FAILED"?<button className="btn-secondary !min-h-9 !px-3 text-xs" disabled={retrying} onClick={()=>retry(item._id)}><RefreshCw className="h-3.5 w-3.5"/>Retry</button>:<span className="text-xs text-muted-foreground">—</span>}</td></tr>)}</tbody></table></div>{!deliveries.data?.items.length?<div className="p-7 text-center text-sm text-muted-foreground">No delivery records yet.</div>:null}</section>

      <section className="surface overflow-hidden"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-extrabold text-brand-dark">Post-service reviews</h2><p className="text-xs text-muted-foreground">Internal ratings and secure request status</p></div><button className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream hover:text-brand-dark" onClick={()=>reviews.refetch()} aria-label="Refresh reviews"><RefreshCw className="h-4 w-4"/></button></div><div className="overflow-x-auto"><table className="data-table min-w-[720px]"><thead><tr><th>Customer / booking</th><th>Review</th><th>Status</th><th>Action</th></tr></thead><tbody>{reviews.data?.items.map((item)=>{const booking=item.bookingId as any;const customer=item.customerId as any;return <tr key={item._id}><td><p className="font-bold text-brand-dark">{customer?.name || "Customer"}</p><p className="text-xs text-muted-foreground">{booking?.reference || "—"} · {booking?.serviceType || "Service"}</p></td><td>{item.rating?<><div className="flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>{[1,2,3,4,5].map(n=><Star key={n} className={`h-3.5 w-3.5 ${n<=item.rating! ? "fill-brand-lime text-brand-green":"text-muted-foreground/30"}`}/>)}</div><p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">{item.comment || "No comment"}</p></>:<span className="text-xs text-muted-foreground">Awaiting feedback</span>}</td><td><span className="status-badge">{item.status}</span></td><td>{canResend && item.status!=="SUBMITTED" && idOf(booking)?<button className="btn-secondary !min-h-9 !px-3 text-xs" disabled={resending} onClick={()=>resend(idOf(booking))}><Send className="h-3.5 w-3.5"/>Resend</button>:<span className="text-xs text-muted-foreground">{compactDate(item.submittedAt)}</span>}</td></tr>})}</tbody></table></div>{!reviews.data?.items.length?<div className="p-7 text-center text-sm text-muted-foreground">No review requests yet.</div>:null}</section>
    </div>
  </div>;
}

function Metric({ icon:Icon,label,value,detail }:{icon:any;label:string;value:number;detail:string}){return <div className="surface p-4"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-green/8 text-brand-green"><Icon className="h-4 w-4"/></span><span className="text-2xl font-extrabold tracking-[-.04em] text-brand-dark">{value.toLocaleString()}</span></div><p className="mt-3 text-sm font-bold text-brand-dark">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>}
function ToggleCard({label,description,checked,onChange,disabled,children}:{label:string;description:string;checked:boolean;onChange:(v:boolean)=>void;disabled?:boolean;children?:ReactNode}){return <div className="rounded-2xl border border-border bg-brand-cream/35 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-brand-dark">{label}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div><button type="button" disabled={disabled} aria-pressed={checked} onClick={()=>onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked?"bg-brand-green":"bg-muted"} disabled:opacity-50`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked?"translate-x-6":"translate-x-1"}`}/><span className="sr-only">{checked?"Disable":"Enable"} {label}</span></button></div>{children}</div>}
function NumberField({label,value,onChange,min,max,disabled,className=""}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;disabled?:boolean;className?:string}){return <label className={`field-group ${className}`}><span className="field-label">{label}</span><input type="number" className="field-control" value={value} min={min} max={max} disabled={disabled} onChange={(e)=>{const next=Number(e.target.value);if(Number.isFinite(next))onChange(next)}}/></label>}
