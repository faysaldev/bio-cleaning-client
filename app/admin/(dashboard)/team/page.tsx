"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarOff, Check, Loader2, Plus, ShieldCheck, Trash2, UserCog, UsersRound, X, AlertCircle } from "lucide-react";
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

const defaultHours = () =>
  days.map((_, dayOfWeek) => ({
    dayOfWeek,
    isAvailable: dayOfWeek !== 0,
    start: dayOfWeek === 6 ? "09:00" : "08:00",
    end: dayOfWeek === 6 ? "16:00" : "18:00",
  }));

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
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await createStaff({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || "") || undefined,
        role: String(form.get("role") || "cleaner") as StaffRole,
        jobTitle: String(form.get("jobTitle") || "") || undefined,
        skills: String(form.get("skills") || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        capacityUnits: Number(form.get("capacityUnits") || 1),
        weeklyHours: defaultHours(),
      }).unwrap();
      event.currentTarget.reset();
      setSuccess(
        result.temporaryPassword
          ? `Team member created. Temporary password: ${result.temporaryPassword}`
          : "Team member created and invitation sent."
      );
    } catch (err) {
      setError(apiError(err));
    }
  };

  const saveStaff = async () => {
    if (!staffEditor) return;
    setError("");
    setSuccess("");
    try {
      await updateStaff({
        id: staffEditor._id,
        data: {
          name: staffEditor.name,
          email: staffEditor.email,
          phone: staffEditor.phone,
          role: staffEditor.role,
          jobTitle: staffEditor.jobTitle,
          skills: staffEditor.skills,
          capacityUnits: staffEditor.capacityUnits,
          serviceIds: staffEditor.serviceIds.map((service) => (typeof service === "string" ? service : service._id)),
          weeklyHours: staffEditor.weeklyHours,
          timeOff: staffEditor.timeOff,
          notes: staffEditor.notes,
          isActive: staffEditor.isActive,
        },
      }).unwrap();
      setSuccess("Team member saved.");
      setStaffEditor(null);
    } catch (err) {
      setError(apiError(err));
    }
  };

  const submitCrew = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const memberIds = form.getAll("memberIds").map(String);
    const leadStaffId = String(form.get("leadStaffId") || "") || undefined;
    try {
      await createCrew({
        name: String(form.get("name") || ""),
        description: String(form.get("description") || "") || undefined,
        memberIds,
        leadStaffId,
      }).unwrap();
      event.currentTarget.reset();
      setSuccess("Crew created.");
    } catch (err) {
      setError(apiError(err));
    }
  };

  const saveCrew = async () => {
    if (!crewEditor) return;
    try {
      await updateCrew({
        id: crewEditor._id,
        data: {
          name: crewEditor.name,
          description: crewEditor.description,
          isActive: crewEditor.isActive,
          memberIds: crewEditor.memberIds.map((member) => (typeof member === "string" ? member : member._id)),
          leadStaffId: crewEditor.leadStaffId
            ? typeof crewEditor.leadStaffId === "string"
              ? crewEditor.leadStaffId
              : crewEditor.leadStaffId._id
            : null,
          serviceIds: crewEditor.serviceIds.map((service) => (typeof service === "string" ? service : service._id)),
        },
      }).unwrap();
      setCrewEditor(null);
      setSuccess("Crew saved.");
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (staffLoading || crewsLoading) return <LoadingState label="Loading team operations…" />;

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                People Operations
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Team, credentials & crews
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
              Manage secure staff logins, skills, service qualifications, weekly availability, time off and crew membership. Cleaner accounts only see jobs assigned to them.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Metric label="Active" value={staff.filter((item) => item.isActive).length} />
            <Metric label="Cleaners" value={activeCleaners.length} />
            <Metric label="Crews" value={crews.filter((item) => item.isActive).length} />
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 shadow-sm" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm" role="status">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      ) : null}

      {/* Row 1: Team Directory & Add Staff */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Staff Profiles</span>
              <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Team directory</h2>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UserCog className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-950/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-dark">
                <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3.5">Person</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Skills</th>
                    <th className="px-4 py-3.5">Availability</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/5">
                  {staff.map((member) => (
                    <tr key={member._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-brand-dark">{member.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.email} {member.employeeCode ? `· ${member.employeeCode}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          {roleLabel(member.role)}
                        </span>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{member.jobTitle || "—"}</div>
                      </td>
                      <td className="px-4 py-3.5 max-w-60">
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-emerald-950/10 bg-[#F4FAF5] px-2 py-0.5 text-[10px] font-bold text-brand-dark"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 ? (
                            <span className="text-[10px] text-muted-foreground">+{member.skills.length - 3}</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold text-brand-dark">
                          {member.weeklyHours.filter((day) => day.isAvailable).length} days/week
                        </span>
                        <div className="text-[11px] text-muted-foreground">{member.timeOff.length} time-off blocks</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                            member.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {canManage ? (
                          <button
                            type="button"
                            onClick={() => setStaffEditor(member)}
                            className="inline-flex items-center rounded-full border border-emerald-950/15 bg-white px-3 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                          >
                            Manage
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!staff.length ? (
            <EmptyState
              title="No team members yet"
              description="Create the first staff login to start assigning field work."
            />
          ) : null}
        </section>

        {/* Add Staff Account Form */}
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Secure access</span>
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Add team member</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Creates a login-linked profile and sends an email invitation.
          </p>

          {canManage ? (
            <form onSubmit={submitStaff} className="mt-5 space-y-3">
              <input
                name="name"
                required
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="Full name"
              />
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="name@example.com"
              />
              <input
                name="phone"
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="Phone"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="role"
                  className="rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                  defaultValue="cleaner"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabel(role)}
                    </option>
                  ))}
                </select>
                <input
                  name="capacityUnits"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="1"
                  className="rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                  aria-label="Capacity units"
                />
              </div>
              <input
                name="jobTitle"
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="Job title, e.g. Lead Cleaner"
              />
              <input
                name="skills"
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="Skills, comma separated"
              />
              <button
                disabled={creatingStaff}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#7CE337] py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
              >
                {creatingStaff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create staff account
              </button>
            </form>
          ) : (
            <p className="mt-5 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/50 p-4 text-xs text-muted-foreground">
              Your role can view team operations but cannot create or modify staff accounts.
            </p>
          )}
        </section>
      </div>

      {/* Row 2: Crew Builder & Active Crews */}
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Crew builder</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Create a crew</h2>

          {canManage ? (
            <form onSubmit={submitCrew} className="mt-5 space-y-3">
              <input
                name="name"
                required
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                placeholder="Northside Crew"
              />
              <textarea
                name="description"
                className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none min-h-20"
                placeholder="Crew focus or notes"
              />
              <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Members</p>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {activeCleaners.map((member) => (
                    <label key={member._id} className="flex items-center gap-2 text-xs font-semibold text-brand-dark">
                      <input
                        name="memberIds"
                        type="checkbox"
                        value={member._id}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      {member.name}
                    </label>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Crew lead
                </span>
                <select
                  name="leadStaffId"
                  className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                >
                  <option value="">No designated lead</option>
                  {activeCleaners.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                disabled={creatingCrew}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#7CE337] py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
              >
                {creatingCrew ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create crew
              </button>
            </form>
          ) : null}
        </section>

        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Dispatch units</span>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Active crews</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {crews.map((crew) => (
              <article key={crew._id} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-brand-dark">{crew.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {crew.memberIds.length} member{crew.memberIds.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        crew.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {crew.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {crew.memberIds.map((member) => (
                      <span
                        key={typeof member === "string" ? member : member._id}
                        className="rounded-full border border-emerald-950/10 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark"
                      >
                        {typeof member === "string" ? "Staff" : member.name}
                      </span>
                    ))}
                  </div>
                </div>

                {canManage ? (
                  <div className="mt-4 flex gap-2 border-t border-border/40 pt-3">
                    <button
                      type="button"
                      onClick={() => setCrewEditor(crew)}
                      className="flex-1 rounded-full border border-emerald-950/15 bg-white py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deactivateCrew(crew._id)}
                      className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label={`Deactivate ${crew.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Staff Editor Slideover Drawer */}
      {staffEditor ? (
        <StaffEditor
          member={staffEditor}
          services={services}
          onChange={setStaffEditor}
          onClose={() => setStaffEditor(null)}
          onSave={saveStaff}
          onDeactivate={async () => {
            await deactivateStaff(staffEditor._id);
            setStaffEditor(null);
          }}
          saving={updatingStaff}
          timeOffDraft={timeOffDraft}
          setTimeOffDraft={setTimeOffDraft}
        />
      ) : null}

      {/* Crew Editor Modal */}
      {crewEditor ? (
        <CrewEditor
          crew={crewEditor}
          staff={activeCleaners}
          services={services}
          onChange={setCrewEditor}
          onClose={() => setCrewEditor(null)}
          onSave={saveCrew}
        />
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm shadow-sm">
      <div className="text-xl font-extrabold text-white">{value}</div>
      <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-100">{label}</div>
    </div>
  );
}

function StaffEditor({
  member,
  services,
  onChange,
  onClose,
  onSave,
  onDeactivate,
  saving,
  timeOffDraft,
  setTimeOffDraft,
}: {
  member: StaffProfile;
  services: any[];
  onChange: (v: StaffProfile) => void;
  onClose: () => void;
  onSave: () => void;
  onDeactivate: () => void;
  saving: boolean;
  timeOffDraft: any;
  setTimeOffDraft: (v: any) => void;
}) {
  const toggleService = (id: string) => {
    const ids = member.serviceIds.map((service) => (typeof service === "string" ? service : service._id));
    onChange({ ...member, serviceIds: ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id] });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#0C3629]/50 backdrop-blur-sm">
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 p-6 backdrop-blur">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Staff profile</span>
            <h3 className="mt-1 text-xl font-extrabold text-brand-dark">{member.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name</span>
              <input
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.name}
                onChange={(e) => onChange({ ...member, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Role</span>
              <select
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.role}
                onChange={(e) => onChange({ ...member, role: e.target.value as StaffRole })}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</span>
              <input
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.email || ""}
                onChange={(e) => onChange({ ...member, email: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Phone</span>
              <input
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.phone || ""}
                onChange={(e) => onChange({ ...member, phone: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Job title</span>
              <input
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.jobTitle || ""}
                onChange={(e) => onChange({ ...member, jobTitle: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Capacity units
              </span>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={member.capacityUnits}
                onChange={(e) => onChange({ ...member, capacityUnits: Number(e.target.value) })}
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Skills</span>
            <input
              className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
              value={member.skills.join(", ")}
              onChange={(e) =>
                onChange({
                  ...member,
                  skills: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Qualified services</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <label
                  key={service._id}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-2.5 text-xs font-semibold"
                >
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                    checked={member.serviceIds.some(
                      (item) => (typeof item === "string" ? item : item._id) === service._id
                    )}
                    onChange={() => toggleService(service._id)}
                  />
                  {service.name}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              No selected services means the cleaner can cover any service.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Weekly availability</p>
            <div className="overflow-hidden rounded-2xl border border-emerald-950/10">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-3 py-2">Available</th>
                    <th className="px-3 py-2">Start</th>
                    <th className="px-3 py-2">End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/5">
                  {member.weeklyHours.map((day, index) => (
                    <tr key={day.dayOfWeek}>
                      <td className="px-3 py-2 font-bold text-brand-dark">{days[day.dayOfWeek]}</td>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                          checked={day.isAvailable}
                          onChange={(e) => {
                            const weekly = [...member.weeklyHours];
                            weekly[index] = { ...day, isAvailable: e.target.checked };
                            onChange({ ...member, weeklyHours: weekly });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          className="rounded-xl border border-emerald-950/15 px-2 py-1 text-xs"
                          disabled={!day.isAvailable}
                          value={day.start}
                          onChange={(e) => {
                            const weekly = [...member.weeklyHours];
                            weekly[index] = { ...day, start: e.target.value };
                            onChange({ ...member, weeklyHours: weekly });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          className="rounded-xl border border-emerald-950/15 px-2 py-1 text-xs"
                          disabled={!day.isAvailable}
                          value={day.end}
                          onChange={(e) => {
                            const weekly = [...member.weeklyHours];
                            weekly[index] = { ...day, end: e.target.value };
                            onChange({ ...member, weeklyHours: weekly });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Time off</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                type="datetime-local"
                className="rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs"
                value={timeOffDraft.startLocal}
                onChange={(e) => setTimeOffDraft({ ...timeOffDraft, startLocal: e.target.value })}
              />
              <input
                type="datetime-local"
                className="rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs"
                value={timeOffDraft.endLocal}
                onChange={(e) => setTimeOffDraft({ ...timeOffDraft, endLocal: e.target.value })}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                onClick={() => {
                  if (!timeOffDraft.startLocal || !timeOffDraft.endLocal) return;
                  onChange({ ...member, timeOff: [...member.timeOff, { ...timeOffDraft }] as any });
                  setTimeOffDraft({ startLocal: "", endLocal: "", reason: "" });
                }}
              >
                <CalendarOff className="h-3.5 w-3.5 text-emerald-700" /> Add
              </button>
            </div>
            <div className="mt-2.5 space-y-2">
              {member.timeOff.map((entry: any, index) => (
                <div
                  key={`${entry.startAt || entry.startLocal}-${index}`}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-2.5 text-xs"
                >
                  <span className="flex-1 text-brand-dark">
                    {entry.startLocal ? entry.startLocal.replace("T", " ") : new Date(entry.startAt).toLocaleString()}{" "}
                    →{" "}
                    {entry.endLocal ? entry.endLocal.replace("T", " ") : new Date(entry.endAt).toLocaleString()}{" "}
                    {entry.reason ? `· ${entry.reason}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ ...member, timeOff: member.timeOff.filter((_, i) => i !== index) })}
                    className="rounded-full p-1 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Internal staff notes
            </span>
            <textarea
              className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none min-h-24"
              value={member.notes || ""}
              onChange={(e) => onChange({ ...member, notes: e.target.value })}
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
            <button
              type="button"
              onClick={onDeactivate}
              className="rounded-full border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Deactivate account
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-emerald-950/15 px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7CE337] px-5 py-2 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save profile
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CrewEditor({
  crew,
  staff,
  services,
  onChange,
  onClose,
  onSave,
}: {
  crew: Crew;
  staff: StaffProfile[];
  services: any[];
  onChange: (v: Crew) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const ids = crew.memberIds.map((member) => (typeof member === "string" ? member : member._id));
  const serviceIds = crew.serviceIds.map((service) => (typeof service === "string" ? service : service._id));

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#0C3629]/50 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h3 className="text-xl font-extrabold text-brand-dark">Edit crew</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <input
            className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
            value={crew.name}
            onChange={(e) => onChange({ ...crew, name: e.target.value })}
          />
          <textarea
            className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none min-h-20"
            value={crew.description || ""}
            onChange={(e) => onChange({ ...crew, description: e.target.value })}
          />
          <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Members</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {staff.map((member) => (
                <label key={member._id} className="flex items-center gap-2 text-xs font-semibold text-brand-dark">
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                    checked={ids.includes(member._id)}
                    onChange={() =>
                      onChange({
                        ...crew,
                        memberIds: ids.includes(member._id)
                          ? ids.filter((id) => id !== member._id)
                          : [...ids, member._id],
                      })
                    }
                  />
                  {member.name}
                </label>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Crew lead
            </span>
            <select
              className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
              value={
                crew.leadStaffId
                  ? typeof crew.leadStaffId === "string"
                    ? crew.leadStaffId
                    : crew.leadStaffId._id
                  : ""
              }
              onChange={(e) => onChange({ ...crew, leadStaffId: e.target.value || undefined })}
            >
              <option value="">No lead</option>
              {staff
                .filter((member) => ids.includes(member._id))
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
            </select>
          </label>
          <div className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Qualified services</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service._id} className="flex items-center gap-2 text-xs font-semibold text-brand-dark">
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                    checked={serviceIds.includes(service._id)}
                    onChange={() =>
                      onChange({
                        ...crew,
                        serviceIds: serviceIds.includes(service._id)
                          ? serviceIds.filter((id) => id !== service._id)
                          : [...serviceIds, service._id],
                      })
                    }
                  />
                  {service.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-border/60 pt-4">
          <button
            onClick={onClose}
            className="rounded-full border border-emerald-950/15 px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-full bg-[#7CE337] px-5 py-2 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49]"
          >
            Save crew
          </button>
        </div>
      </section>
    </div>
  );
}
