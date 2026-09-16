"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarOff, Check, Loader2, Plus, ShieldCheck, Trash2, UserCog, UsersRound, X } from "lucide-react";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { teamManageRoles } from "@/src/lib/roles";
import { useGetShortServicesQuery } from "@/src/redux/features/services/servicesApi";
import {
  useCreateCrewMutation,
  useCreateStaffMutation,
  useDeactivateCrewMutation,
  useDeactivateStaffMutation,
  useGetCrewsQuery,
  useGetStaffQuery,
  useUpdateCrewMutation,
  useUpdateStaffMutation,
} from "@/src/redux/features/team/teamApi";
import type { Crew, StaffProfile, StaffRole } from "@/src/redux/features/team/types";
import { EmptyState, LoadingState } from "@/src/components/ui/feedback";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const roles: StaffRole[] = ["admin", "manager", "dispatcher", "cleaner", "support", "read_only"];
const roleLabel = (role: string) => role.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const defaultHours = () => days.map((_, dayOfWeek) => ({ dayOfWeek, isAvailable: dayOfWeek !== 0, start: dayOfWeek === 6 ? "09:00" : "08:00", end: dayOfWeek === 6 ? "16:00" : "18:00" }));

function apiError(error: any) {
  return error?.data?.message || error?.data?.error || "Something went wrong. Please try again.";
}

export default function TeamPage() {
  const user = useAppSelector(selectCurrentUser);
  const canManage = Boolean(user && teamManageRoles.includes(user.role));
  const { data: staff = [], isLoading: staffLoading } = useGetStaffQuery();
  const { data: crews = [], isLoading: crewsLoading } = useGetCrewsQuery();
  const { data: servicesResponse } = useGetShortServicesQuery();
  const services = servicesResponse?.data || [];
  const [createStaff, { isLoading: creatingStaff }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: updatingStaff }] = useUpdateStaffMutation();
  const [deactivateStaff] = useDeactivateStaffMutation();
  const [createCrew, { isLoading: creatingCrew }] = useCreateCrewMutation();
  const [updateCrew] = useUpdateCrewMutation();
  const [deactivateCrew] = useDeactivateCrewMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [staffEditor, setStaffEditor] = useState<StaffProfile | null>(null);
  const [crewEditor, setCrewEditor] = useState<Crew | null>(null);
  const [timeOffDraft, setTimeOffDraft] = useState({ startLocal: "", endLocal: "", reason: "" });

  const activeCleaners = useMemo(() => staff.filter((member) => member.isActive && member.role === "cleaner"), [staff]);

  const submitStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setSuccess("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await createStaff({
        name: String(form.get("name") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || "") || undefined,
        role: String(form.get("role") || "cleaner") as StaffRole,
        jobTitle: String(form.get("jobTitle") || "") || undefined,
        skills: String(form.get("skills") || "").split(",").map((item) => item.trim()).filter(Boolean),
        capacityUnits: Number(form.get("capacityUnits") || 1), weeklyHours: defaultHours(),
      }).unwrap();
      event.currentTarget.reset();
      setSuccess(result.temporaryPassword ? `Team member created. Temporary password: ${result.temporaryPassword}` : "Team member created and invitation sent.");
    } catch (err) { setError(apiError(err)); }
  };

  const saveStaff = async () => {
    if (!staffEditor) return;
    setError(""); setSuccess("");
    try {
      await updateStaff({ id: staffEditor._id, data: {
        name: staffEditor.name, email: staffEditor.email, phone: staffEditor.phone, role: staffEditor.role, jobTitle: staffEditor.jobTitle,
        skills: staffEditor.skills, capacityUnits: staffEditor.capacityUnits,
        serviceIds: staffEditor.serviceIds.map((service) => typeof service === "string" ? service : service._id),
        weeklyHours: staffEditor.weeklyHours, timeOff: staffEditor.timeOff,
        notes: staffEditor.notes, isActive: staffEditor.isActive,
      } }).unwrap();
      setSuccess("Team member saved."); setStaffEditor(null);
    } catch (err) { setError(apiError(err)); }
  };

  const submitCrew = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSuccess("");
    const form = new FormData(event.currentTarget);
    const memberIds = form.getAll("memberIds").map(String);
    const leadStaffId = String(form.get("leadStaffId") || "") || undefined;
    try {
      await createCrew({ name: String(form.get("name") || ""), description: String(form.get("description") || "") || undefined, memberIds, leadStaffId }).unwrap();
      event.currentTarget.reset(); setSuccess("Crew created.");
    } catch (err) { setError(apiError(err)); }
  };

  const saveCrew = async () => {
    if (!crewEditor) return;
    try {
      await updateCrew({ id: crewEditor._id, data: {
        name: crewEditor.name, description: crewEditor.description, isActive: crewEditor.isActive,
        memberIds: crewEditor.memberIds.map((member) => typeof member === "string" ? member : member._id),
        leadStaffId: crewEditor.leadStaffId ? (typeof crewEditor.leadStaffId === "string" ? crewEditor.leadStaffId : crewEditor.leadStaffId._id) : null,
        serviceIds: crewEditor.serviceIds.map((service) => typeof service === "string" ? service : service._id),
      } }).unwrap();
      setCrewEditor(null); setSuccess("Crew saved.");
    } catch (err) { setError(apiError(err)); }
  };

  if (staffLoading || crewsLoading) return <LoadingState label="Loading team operations…" />;

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <section className="surface overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><span className="editorial-kicker">People operations</span><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-brand-dark">One team, clear roles, dispatch-ready crews.</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Manage secure staff logins, skills, service qualifications, weekly availability, time off and crew membership. Cleaner accounts only see jobs assigned to them.</p></div>
        <div className="grid grid-cols-3 gap-2 text-center"><Metric label="Active" value={staff.filter((item) => item.isActive).length} /><Metric label="Cleaners" value={activeCleaners.length} /><Metric label="Crews" value={crews.filter((item) => item.isActive).length} /></div>
      </div>
    </section>

    {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive" role="alert">{error}</div> : null}
    {success ? <div className="feedback-panel border-brand-green/20 bg-brand-green/5 text-brand-green" role="status">{success}</div> : null}

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <section className="surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-brand-green"><UserCog className="h-3.5 w-3.5"/> Staff profiles</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">Team directory</h3></div></div>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="data-table min-w-[780px]"><thead><tr><th>Person</th><th>Role</th><th>Skills</th><th>Availability</th><th>Status</th><th></th></tr></thead><tbody>
            {staff.map((member) => <tr key={member._id}>
              <td><div className="font-bold text-brand-dark">{member.name}</div><div className="text-[11px] text-muted-foreground">{member.email} {member.employeeCode ? `· ${member.employeeCode}` : ""}</div></td>
              <td><span className="status-badge border-brand-green/15 bg-brand-green/5 text-brand-green">{roleLabel(member.role)}</span><div className="mt-1 text-[11px] text-muted-foreground">{member.jobTitle || "—"}</div></td>
              <td className="max-w-60"><div className="flex flex-wrap gap-1">{member.skills.slice(0,3).map((skill) => <span key={skill} className="rounded-md bg-brand-cream px-2 py-1 text-[10px] font-bold text-brand-dark">{skill}</span>)}{member.skills.length > 3 ? <span className="text-[10px] text-muted-foreground">+{member.skills.length-3}</span> : null}</div></td>
              <td><span className="text-xs font-semibold text-brand-dark">{member.weeklyHours.filter((day) => day.isAvailable).length} days/week</span><div className="text-[11px] text-muted-foreground">{member.timeOff.length} time-off blocks</div></td>
              <td><span className={`status-badge ${member.isActive ? "border-brand-green/20 bg-brand-green/5 text-brand-green" : "border-border bg-muted text-muted-foreground"}`}>{member.isActive ? "Active" : "Inactive"}</span></td>
              <td className="text-right">{canManage ? <button type="button" onClick={() => setStaffEditor(member)} className="btn-secondary px-3 py-2">Manage</button> : null}</td>
            </tr>)}
          </tbody></table>
        </div>
        {!staff.length ? <EmptyState title="No team members yet" description="Create the first staff login to start assigning field work." /> : null}
      </section>

      <section className="surface p-5 sm:p-6">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-brand-green"><ShieldCheck className="h-3.5 w-3.5"/> Secure access</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">Add team member</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Creates a login-linked staff profile and emails the credentials. Role permissions are enforced by the API.</p>
        {canManage ? <form onSubmit={submitStaff} className="mt-5 space-y-3">
          <input name="name" required className="field-control" placeholder="Full name"/><input name="email" type="email" required className="field-control" placeholder="name@example.com"/><input name="phone" className="field-control" placeholder="Phone"/>
          <div className="grid grid-cols-2 gap-3"><select name="role" className="field-control" defaultValue="cleaner">{roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}</select><input name="capacityUnits" type="number" min="1" max="10" defaultValue="1" className="field-control" aria-label="Capacity units"/></div>
          <input name="jobTitle" className="field-control" placeholder="Job title, e.g. Lead Cleaner"/><input name="skills" className="field-control" placeholder="Skills, comma separated"/>
          <button disabled={creatingStaff} className="btn-primary w-full">{creatingStaff ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>}Create staff account</button>
        </form> : <p className="mt-5 rounded-xl border border-border bg-brand-cream/50 p-4 text-xs text-muted-foreground">Your role can view team operations but cannot create or modify staff accounts.</p>}
      </section>
    </div>

    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <section className="surface p-5 sm:p-6"><span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-brand-green"><UsersRound className="h-3.5 w-3.5"/> Crew builder</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">Create a crew</h3>
        {canManage ? <form onSubmit={submitCrew} className="mt-5 space-y-3"><input name="name" required className="field-control" placeholder="Northside Crew"/><textarea name="description" className="field-control min-h-20" placeholder="Crew focus or notes"/>
          <div className="rounded-xl border border-border p-3"><p className="field-label">Members</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{activeCleaners.map((member) => <label key={member._id} className="flex items-center gap-2 text-xs font-semibold text-brand-dark"><input name="memberIds" type="checkbox" value={member._id}/>{member.name}</label>)}</div></div>
          <label><span className="field-label">Crew lead</span><select name="leadStaffId" className="field-control"><option value="">No designated lead</option>{activeCleaners.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}</select></label>
          <button disabled={creatingCrew} className="btn-primary w-full">{creatingCrew ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>}Create crew</button></form> : null}
      </section>
      <section className="surface p-5 sm:p-6"><h3 className="text-xl font-extrabold text-brand-dark">Active crews</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{crews.map((crew) => <article key={crew._id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-extrabold text-brand-dark">{crew.name}</p><p className="mt-1 text-xs text-muted-foreground">{crew.memberIds.length} member{crew.memberIds.length===1?"":"s"}</p></div><span className={`status-badge ${crew.isActive ? "border-brand-green/20 bg-brand-green/5 text-brand-green":"border-border bg-muted text-muted-foreground"}`}>{crew.isActive?"Active":"Inactive"}</span></div><div className="mt-3 flex flex-wrap gap-1">{crew.memberIds.map((member) => <span key={typeof member === "string" ? member : member._id} className="rounded-md bg-brand-cream px-2 py-1 text-[10px] font-bold text-brand-dark">{typeof member === "string" ? "Staff" : member.name}</span>)}</div>{canManage ? <div className="mt-4 flex gap-2"><button type="button" onClick={()=>setCrewEditor(crew)} className="btn-secondary flex-1">Edit</button><button type="button" onClick={()=>deactivateCrew(crew._id)} className="grid h-10 w-10 place-items-center rounded-lg border border-border text-destructive" aria-label={`Deactivate ${crew.name}`}><Trash2 className="h-4 w-4"/></button></div>:null}</article>)}</div></section>
    </div>

    {staffEditor ? <StaffEditor member={staffEditor} services={services} onChange={setStaffEditor} onClose={()=>setStaffEditor(null)} onSave={saveStaff} onDeactivate={async()=>{await deactivateStaff(staffEditor._id); setStaffEditor(null);}} saving={updatingStaff} timeOffDraft={timeOffDraft} setTimeOffDraft={setTimeOffDraft}/> : null}
    {crewEditor ? <CrewEditor crew={crewEditor} staff={activeCleaners} services={services} onChange={setCrewEditor} onClose={()=>setCrewEditor(null)} onSave={saveCrew}/> : null}
  </div>;
}

function Metric({label,value}:{label:string;value:number}) { return <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm"><div className="text-xl font-extrabold text-brand-dark">{value}</div><div className="text-[9px] font-extrabold uppercase tracking-[.12em] text-muted-foreground">{label}</div></div>; }

function StaffEditor({member,services,onChange,onClose,onSave,onDeactivate,saving,timeOffDraft,setTimeOffDraft}:{member:StaffProfile;services:any[];onChange:(v:StaffProfile)=>void;onClose:()=>void;onSave:()=>void;onDeactivate:()=>void;saving:boolean;timeOffDraft:any;setTimeOffDraft:(v:any)=>void}) {
  const toggleService=(id:string)=>{const ids=member.serviceIds.map((service)=>typeof service==="string"?service:service._id); onChange({...member,serviceIds:ids.includes(id)?ids.filter((item)=>item!==id):[...ids,id]});};
  return <div className="fixed inset-0 z-[90] bg-brand-dark/40 backdrop-blur-sm"><aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 p-5 backdrop-blur"><div><span className="editorial-kicker">Staff profile</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">{member.name}</h3></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-border"><X className="h-4 w-4"/></button></div><div className="space-y-6 p-5">
    <div className="grid gap-3 sm:grid-cols-2"><label><span className="field-label">Name</span><input className="field-control" value={member.name} onChange={(e)=>onChange({...member,name:e.target.value})}/></label><label><span className="field-label">Role</span><select className="field-control" value={member.role} onChange={(e)=>onChange({...member,role:e.target.value as StaffRole})}>{roles.map((role)=><option key={role} value={role}>{roleLabel(role)}</option>)}</select></label><label><span className="field-label">Email</span><input className="field-control" value={member.email||""} onChange={(e)=>onChange({...member,email:e.target.value})}/></label><label><span className="field-label">Phone</span><input className="field-control" value={member.phone||""} onChange={(e)=>onChange({...member,phone:e.target.value})}/></label><label><span className="field-label">Job title</span><input className="field-control" value={member.jobTitle||""} onChange={(e)=>onChange({...member,jobTitle:e.target.value})}/></label><label><span className="field-label">Capacity units</span><input type="number" min="1" max="10" className="field-control" value={member.capacityUnits} onChange={(e)=>onChange({...member,capacityUnits:Number(e.target.value)})}/></label></div>
    <label><span className="field-label">Skills</span><input className="field-control" value={member.skills.join(", ")} onChange={(e)=>onChange({...member,skills:e.target.value.split(",").map(v=>v.trim()).filter(Boolean)})}/></label>
    <div><p className="field-label">Qualified services</p><div className="grid gap-2 sm:grid-cols-2">{services.map((service)=><label key={service._id} className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs font-semibold"><input type="checkbox" checked={member.serviceIds.some((item)=> (typeof item==="string"?item:item._id)===service._id)} onChange={()=>toggleService(service._id)}/>{service.name}</label>)}</div><p className="mt-2 text-[11px] text-muted-foreground">No selected services means the cleaner can cover any service.</p></div>
    <div><p className="field-label">Weekly availability</p><div className="mt-2 overflow-x-auto rounded-xl border border-border"><table className="data-table min-w-[560px]"><thead><tr><th>Day</th><th>Available</th><th>Start</th><th>End</th></tr></thead><tbody>{member.weeklyHours.map((day,index)=><tr key={day.dayOfWeek}><td className="font-bold">{days[day.dayOfWeek]}</td><td><input type="checkbox" checked={day.isAvailable} onChange={(e)=>{const weekly=[...member.weeklyHours];weekly[index]={...day,isAvailable:e.target.checked};onChange({...member,weeklyHours:weekly});}}/></td><td><input type="time" className="field-control max-w-36" disabled={!day.isAvailable} value={day.start} onChange={(e)=>{const weekly=[...member.weeklyHours];weekly[index]={...day,start:e.target.value};onChange({...member,weeklyHours:weekly});}}/></td><td><input type="time" className="field-control max-w-36" disabled={!day.isAvailable} value={day.end} onChange={(e)=>{const weekly=[...member.weeklyHours];weekly[index]={...day,end:e.target.value};onChange({...member,weeklyHours:weekly});}}/></td></tr>)}</tbody></table></div></div>
    <div><p className="field-label">Time off</p><div className="grid gap-2 sm:grid-cols-3"><input type="datetime-local" className="field-control" value={timeOffDraft.startLocal} onChange={(e)=>setTimeOffDraft({...timeOffDraft,startLocal:e.target.value})}/><input type="datetime-local" className="field-control" value={timeOffDraft.endLocal} onChange={(e)=>setTimeOffDraft({...timeOffDraft,endLocal:e.target.value})}/><button type="button" className="btn-secondary" onClick={()=>{if(!timeOffDraft.startLocal||!timeOffDraft.endLocal)return;onChange({...member,timeOff:[...member.timeOff,{...timeOffDraft}] as any});setTimeOffDraft({startLocal:"",endLocal:"",reason:""});}}><CalendarOff className="h-4 w-4"/>Add</button></div><div className="mt-2 space-y-2">{member.timeOff.map((entry:any,index)=><div key={`${entry.startAt || entry.startLocal}-${index}`} className="flex items-center gap-2 rounded-lg bg-brand-cream p-2 text-xs"><span className="flex-1">{entry.startLocal ? entry.startLocal.replace("T", " ") : new Date(entry.startAt).toLocaleString()} → {entry.endLocal ? entry.endLocal.replace("T", " ") : new Date(entry.endAt).toLocaleString()} {entry.reason?`· ${entry.reason}`:""}</span><button type="button" onClick={()=>onChange({...member,timeOff:member.timeOff.filter((_,i)=>i!==index)})}><Trash2 className="h-3.5 w-3.5 text-destructive"/></button></div>)}</div></div>
    <label><span className="field-label">Internal staff notes</span><textarea className="field-control min-h-24" value={member.notes||""} onChange={(e)=>onChange({...member,notes:e.target.value})}/></label>
    <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-5"><button type="button" onClick={onDeactivate} className="btn-secondary text-destructive">Deactivate account</button><div className="flex gap-2"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="button" onClick={onSave} disabled={saving} className="btn-primary">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<Check className="h-4 w-4"/>}Save profile</button></div></div>
  </div></aside></div>;
}

function CrewEditor({crew,staff,services,onChange,onClose,onSave}:{crew:Crew;staff:StaffProfile[];services:any[];onChange:(v:Crew)=>void;onClose:()=>void;onSave:()=>void}) {
  const ids=crew.memberIds.map((member)=>typeof member==="string"?member:member._id); const serviceIds=crew.serviceIds.map((service)=>typeof service==="string"?service:service._id);
  return <div className="fixed inset-0 z-[90] grid place-items-center bg-brand-dark/40 p-4 backdrop-blur-sm"><section className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-extrabold text-brand-dark">Edit crew</h3><button onClick={onClose}><X className="h-4 w-4"/></button></div><div className="mt-5 space-y-4"><input className="field-control" value={crew.name} onChange={(e)=>onChange({...crew,name:e.target.value})}/><textarea className="field-control min-h-20" value={crew.description||""} onChange={(e)=>onChange({...crew,description:e.target.value})}/><div><p className="field-label">Members</p><div className="grid gap-2 sm:grid-cols-2">{staff.map((member)=><label key={member._id} className="flex gap-2 text-xs"><input type="checkbox" checked={ids.includes(member._id)} onChange={()=>onChange({...crew,memberIds:ids.includes(member._id)?ids.filter((id)=>id!==member._id):[...ids,member._id]})}/>{member.name}</label>)}</div></div><label><span className="field-label">Crew lead</span><select className="field-control" value={crew.leadStaffId ? (typeof crew.leadStaffId==="string"?crew.leadStaffId:crew.leadStaffId._id):""} onChange={(e)=>onChange({...crew,leadStaffId:e.target.value||undefined})}><option value="">No lead</option>{staff.filter((member)=>ids.includes(member._id)).map((member)=><option key={member._id} value={member._id}>{member.name}</option>)}</select></label><div><p className="field-label">Qualified services</p><div className="grid gap-2 sm:grid-cols-2">{services.map((service)=><label key={service._id} className="flex gap-2 text-xs"><input type="checkbox" checked={serviceIds.includes(service._id)} onChange={()=>onChange({...crew,serviceIds:serviceIds.includes(service._id)?serviceIds.filter((id)=>id!==service._id):[...serviceIds,service._id]})}/>{service.name}</label>)}</div></div><div className="flex justify-end gap-2 border-t border-border pt-4"><button onClick={onClose} className="btn-secondary">Cancel</button><button onClick={onSave} className="btn-primary">Save crew</button></div></div></section></div>;
}
