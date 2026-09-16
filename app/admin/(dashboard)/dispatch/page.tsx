"use client";

import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, GripVertical, Loader2, UsersRound, X } from "lucide-react";
import { useGetDispatchJobsQuery, useAssignJobMutation } from "@/src/redux/features/fieldOps/fieldOpsApi";
import type { FieldJob } from "@/src/redux/features/fieldOps/types";
import { useGetStaffQuery, useGetCrewsQuery } from "@/src/redux/features/team/teamApi";
import { useGetSchedulingSettingsQuery } from "@/src/redux/features/scheduling/schedulingApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { operationsWriteRoles } from "@/src/lib/roles";
import { EmptyState, LoadingState } from "@/src/components/ui/feedback";

const dayMs = 86_400_000;
type View = "day" | "week" | "month";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const addDays = (date: Date, days: number) => new Date(startOfDay(date).getTime() + days * dayMs);
const startOfWeek = (date: Date) => addDays(date, -date.getDay());
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth()+1, 0, 23, 59, 59, 999);

function formatInZone(value: string, timezone: string, options: Intl.DateTimeFormatOptions) {
  try { return new Intl.DateTimeFormat("en-US", { timeZone: timezone, ...options }).format(new Date(value)); }
  catch { return new Intl.DateTimeFormat("en-US", options).format(new Date(value)); }
}
function jobDay(value: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.filter((part)=>part.type!=="literal").map((part)=>[part.type,part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}
function staffId(value: string | { _id: string }) { return typeof value === "string" ? value : value._id; }
function bookingRequired(job: FieldJob) { return typeof job.bookingId === "string" ? 1 : Number(job.bookingId.requiredStaffSnapshot || 1); }

export default function DispatchPage() {
  const user = useAppSelector(selectCurrentUser);
  const canAssign = Boolean(user && operationsWriteRoles.includes(user.role));
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(startOfDay(new Date()));
  const [selected, setSelected] = useState<FieldJob | null>(null);
  const [error, setError] = useState("");
  const { data: settings } = useGetSchedulingSettingsQuery();
  const timezone = settings?.timezone || "America/New_York";
  const range = useMemo(() => {
    if (view === "day") return { from: startOfDay(anchor), to: new Date(startOfDay(anchor).getTime() + dayMs - 1) };
    if (view === "week") { const from=startOfWeek(anchor); return { from, to:new Date(from.getTime()+7*dayMs-1) }; }
    return { from:startOfMonth(anchor), to:endOfMonth(anchor) };
  }, [view, anchor]);
  const queryRange = useMemo(() => ({ from: new Date(range.from.getTime()-dayMs).toISOString(), to: new Date(range.to.getTime()+dayMs).toISOString() }), [range]);
  const { data: jobs = [], isLoading, isFetching } = useGetDispatchJobsQuery(queryRange);
  const { data: staff = [] } = useGetStaffQuery({ active: "true" });
  const { data: crews = [] } = useGetCrewsQuery();
  const [assignJob, { isLoading: assigning }] = useAssignJobMutation();
  const cleaners = staff.filter((member)=>member.role === "cleaner" && member.isActive);

  const calendarDays = useMemo(() => {
    if (view === "day") return [startOfDay(anchor)];
    if (view === "week") return Array.from({length:7},(_,index)=>addDays(startOfWeek(anchor),index));
    const monthStart = startOfMonth(anchor); const gridStart=startOfWeek(monthStart); return Array.from({length:42},(_,index)=>addDays(gridStart,index));
  },[view,anchor]);
  const jobsByDay = useMemo(() => {
    const grouped: Record<string,FieldJob[]> = {};
    jobs.forEach((job)=>{ const key=jobDay(job.scheduledStart,timezone); (grouped[key] ||= []).push(job); });
    return grouped;
  },[jobs,timezone]);

  const move = (direction:number) => setAnchor((current)=> view==="day"?addDays(current,direction):view==="week"?addDays(current,direction*7):new Date(current.getFullYear(),current.getMonth()+direction,1));
  const assignToStaff = async (job: FieldJob, targetId: string) => {
    if (!canAssign) return;
    setError("");
    const current = job.assignedStaffIds.map(staffId);
    const staffIds = current.includes(targetId) ? current : [...current,targetId];
    try { const updated=await assignJob({id:job._id,staffIds,crewId:job.crewId ? (typeof job.crewId==="string"?job.crewId:job.crewId._id) : null}).unwrap(); setSelected(updated); }
    catch(err:any){ setError(err?.data?.message||"Could not assign this job."); }
  };
  const assignToCrew = async (job: FieldJob, crewId: string) => {
    if (!canAssign) return; setError("");
    try { const updated=await assignJob({id:job._id,crewId,staffIds:[]}).unwrap(); setSelected(updated); }
    catch(err:any){ setError(err?.data?.message||"Could not assign this crew."); }
  };
  const onDrop = (event: DragEvent, target: {type:"staff"|"crew";id:string}) => {
    event.preventDefault(); const id=event.dataTransfer.getData("text/job-id"); const job=jobs.find((item)=>item._id===id); if(!job)return;
    if(target.type==="staff") void assignToStaff(job,target.id); else void assignToCrew(job,target.id);
  };

  if (isLoading) return <LoadingState label="Building dispatch calendar…" />;

  return <div className="mx-auto max-w-[1700px] space-y-5">
    <section className="surface p-5 sm:p-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><span className="editorial-kicker">Live dispatch</span><h2 className="mt-3 text-3xl font-extrabold tracking-[-.045em] text-brand-dark">Day, week and month field operations.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Bookings become operational jobs automatically. Drag a job onto a cleaner or crew to assign it; overlapping assignments and unavailable staff are rejected by the server.</p></div><div className="flex flex-wrap items-center gap-2"><button className="btn-secondary" onClick={()=>move(-1)} aria-label="Previous period"><ChevronLeft className="h-4 w-4"/></button><button className="btn-secondary" onClick={()=>setAnchor(startOfDay(new Date()))}>Today</button><button className="btn-secondary" onClick={()=>move(1)} aria-label="Next period"><ChevronRight className="h-4 w-4"/></button><div className="flex rounded-xl border border-border bg-white p-1">{(["day","week","month"] as View[]).map((item)=><button key={item} className={`rounded-lg px-3 py-2 text-xs font-extrabold capitalize ${view===item?"bg-brand-dark text-white":"text-muted-foreground hover:text-brand-dark"}`} onClick={()=>setView(item)}>{item}</button>)}</div></div></div></section>
    {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">{error}</div> : null}

    <div className="grid gap-5 2xl:grid-cols-[1fr_310px]">
      <section className="surface overflow-hidden"><div className="flex items-center justify-between border-b border-border p-4"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-green"/><span className="text-sm font-extrabold text-brand-dark">{range.from.toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}{view!=="day"?` — ${range.to.toLocaleDateString(undefined,{month:"short",day:"numeric"})}`:""}</span></div>{isFetching?<Loader2 className="h-4 w-4 animate-spin text-brand-green"/>:null}</div>
        <div className={`grid ${view==="day"?"grid-cols-1":view==="week"?"grid-cols-7":"grid-cols-7"}`}>
          {calendarDays.map((day)=>{const key=dateKey(day);const items=jobsByDay[key]||[];const outside=view==="month"&&day.getMonth()!==anchor.getMonth();return <div key={key} className={`${view === "month" ? "min-h-[150px]" : "min-h-[360px]"} border-b border-r border-border p-2 ${outside?"bg-muted/30":"bg-white"}`}><div className="mb-2 flex items-center justify-between"><span className={`text-xs font-extrabold ${dateKey(new Date())===key?"grid h-7 w-7 place-items-center rounded-lg bg-brand-lime text-brand-dark":"text-brand-dark"}`}>{view==="month"?day.getDate():day.toLocaleDateString(undefined,{weekday:"short",day:"numeric"})}</span><span className="text-[10px] text-muted-foreground">{items.length}</span></div><div className="space-y-2">{items.map((job)=><JobCard key={job._id} job={job} timezone={timezone} draggable={canAssign} onSelect={()=>setSelected(job)}/>)}</div></div>;})}
        </div>
        {!jobs.length ? <EmptyState title="No jobs in this period" description="Bookings scheduled in this range will appear here automatically."/>:null}
      </section>

      <aside className="space-y-5"><section className="surface p-4"><div className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-brand-green"/><h3 className="font-extrabold text-brand-dark">Assignment board</h3></div><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Drag job cards onto a person or crew. Drop multiple cleaners onto a job when it requires more than one person.</p><div className="mt-4 space-y-2">{cleaners.map((member)=><div key={member._id} onDragOver={(e)=>canAssign&&e.preventDefault()} onDrop={(e)=>onDrop(e,{type:"staff",id:member._id})} className="rounded-xl border border-dashed border-border bg-brand-cream/35 p-3 transition hover:border-brand-green/40"><div className="text-sm font-bold text-brand-dark">{member.name}</div><div className="text-[10px] text-muted-foreground">{member.jobTitle||"Cleaner"} · {member.skills.slice(0,2).join(", ")||"General cleaning"}</div></div>)}</div></section>
        <section className="surface p-4"><h3 className="font-extrabold text-brand-dark">Crews</h3><div className="mt-3 space-y-2">{crews.filter((crew)=>crew.isActive).map((crew)=><div key={crew._id} onDragOver={(e)=>canAssign&&e.preventDefault()} onDrop={(e)=>onDrop(e,{type:"crew",id:crew._id})} className="rounded-xl border border-dashed border-border p-3"><div className="text-sm font-bold text-brand-dark">{crew.name}</div><div className="text-[10px] text-muted-foreground">{crew.memberIds.length} members</div></div>)}</div></section></aside>
    </div>

    {selected ? <AssignmentDrawer job={selected} staff={cleaners} crews={crews.filter((crew)=>crew.isActive)} timezone={timezone} canAssign={canAssign} assigning={assigning} onClose={()=>setSelected(null)} onSave={async(staffIds,crewId)=>{try{const updated=await assignJob({id:selected._id,staffIds,crewId}).unwrap();setSelected(updated);setError("");}catch(err:any){setError(err?.data?.message||"Could not update assignment.");}}}/> : null}
  </div>;
}

function JobCard({job,timezone,draggable,onSelect}:{job:FieldJob;timezone:string;draggable:boolean;onSelect:()=>void}) {
  const assigned=job.assignedStaffIds.length;const required=bookingRequired(job);const service=typeof job.serviceId==="string"?"Cleaning":job.serviceId?.name||"Cleaning";
  return <button type="button" draggable={draggable} onDragStart={(e)=>{e.dataTransfer.setData("text/job-id",job._id);e.dataTransfer.effectAllowed="move";}} onClick={onSelect} className="w-full rounded-xl border border-border bg-brand-cream/45 p-2.5 text-left shadow-sm transition hover:border-brand-green/35 hover:bg-white"><div className="flex gap-2"><GripVertical className="mt-.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"/><div className="min-w-0 flex-1"><div className="truncate text-xs font-extrabold text-brand-dark">{job.customerName}</div><div className="mt-0.5 truncate text-[10px] text-muted-foreground">{formatInZone(job.scheduledStart,timezone,{hour:"numeric",minute:"2-digit"})} · {service}</div><div className="mt-2 flex items-center justify-between gap-2"><span className={`status-badge text-[9px] ${job.status==="ISSUE"?"border-destructive/20 bg-destructive/5 text-destructive":"border-brand-green/15 bg-brand-green/5 text-brand-green"}`}>{job.status.replace("_"," ")}</span><span className={`text-[9px] font-bold ${assigned<required?"text-amber-700":"text-muted-foreground"}`}>{assigned}/{required} staff</span></div></div></div></button>;
}

function AssignmentDrawer({job,staff,crews,timezone,canAssign,assigning,onClose,onSave}:{job:FieldJob;staff:any[];crews:any[];timezone:string;canAssign:boolean;assigning:boolean;onClose:()=>void;onSave:(ids:string[],crewId:string|null)=>void}) {
  const [ids,setIds]=useState(job.assignedStaffIds.map(staffId));const [crewId,setCrewId]=useState(job.crewId?(typeof job.crewId==="string"?job.crewId:job.crewId._id):"");const required=bookingRequired(job);
  return <div className="fixed inset-0 z-[90] bg-brand-dark/35 backdrop-blur-sm"><aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-border bg-white p-5"><div><span className="editorial-kicker">Dispatch job</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">{job.jobNumber}</h3></div><button onClick={onClose}><X className="h-4 w-4"/></button></div><div className="space-y-5 p-5"><div className="rounded-xl bg-brand-cream p-4"><div className="font-extrabold text-brand-dark">{job.customerName}</div><div className="mt-1 text-xs text-muted-foreground">{formatInZone(job.scheduledStart,timezone,{dateStyle:"medium",timeStyle:"short"})}</div><div className="mt-1 text-xs text-muted-foreground">{job.address.line1}, {job.address.city}</div></div><div><p className="field-label">Crew</p><select disabled={!canAssign} className="field-control" value={crewId} onChange={(e)=>setCrewId(e.target.value)}><option value="">No crew</option>{crews.map((crew)=><option key={crew._id} value={crew._id}>{crew.name}</option>)}</select></div><div><div className="flex items-center justify-between"><p className="field-label">Assigned cleaners</p><span className={`text-xs font-bold ${ids.length<required?"text-amber-700":"text-brand-green"}`}>{ids.length}/{required} required</span></div><div className="mt-2 space-y-2">{staff.map((member)=><label key={member._id} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-semibold text-brand-dark"><input disabled={!canAssign} type="checkbox" checked={ids.includes(member._id)} onChange={()=>setIds((current)=>current.includes(member._id)?current.filter((id)=>id!==member._id):[...current,member._id])}/><span className="flex-1">{member.name}</span><span className="text-[10px] text-muted-foreground">{member.skills?.slice(0,2).join(", ")}</span></label>)}</div></div>{canAssign?<button disabled={assigning} className="btn-primary w-full" onClick={()=>onSave(ids,crewId||null)}>{assigning?<Loader2 className="h-4 w-4 animate-spin"/>:null}Save assignment</button>:<p className="rounded-xl border border-border bg-brand-cream p-3 text-xs text-muted-foreground">Read-only dispatch access.</p>}</div></aside></div>;
}
