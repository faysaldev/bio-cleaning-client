"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarOff,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useCreateScheduleBlockMutation,
  useCreateStaffScheduleMutation,
  useDeleteScheduleBlockMutation,
  useDeleteStaffScheduleMutation,
  useGetScheduleBlocksQuery,
  useGetSchedulingSettingsQuery,
  useGetStaffSchedulesQuery,
  useUpdateSchedulingSettingsMutation,
  useUpdateStaffScheduleMutation,
} from "@/src/redux/features/scheduling/schedulingApi";
import type {
  SchedulingSettings,
  StaffSchedule,
  StaffTimeOffInput,
} from "@/src/redux/features/scheduling/types";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type StaffEditorDraft = Omit<StaffSchedule, "timeOff"> & { timeOff: StaffTimeOffInput[] };

function formatBusinessDateTime(value: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return new Date(value).toLocaleString();
  }
}

export default function SchedulingSettingsPage() {
  const { data: settings, isLoading } = useGetSchedulingSettingsQuery();
  const { data: staff = [] } = useGetStaffSchedulesQuery();
  const { data: blocks = [] } = useGetScheduleBlocksQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSchedulingSettingsMutation();
  const [createStaff, { isLoading: addingStaff }] = useCreateStaffScheduleMutation();
  const [updateStaff, { isLoading: updatingStaff }] = useUpdateStaffScheduleMutation();
  const [deleteStaff] = useDeleteStaffScheduleMutation();
  const [createBlock, { isLoading: addingBlock }] = useCreateScheduleBlockMutation();
  const [deleteBlock] = useDeleteScheduleBlockMutation();
  const [draft, setDraft] = useState<SchedulingSettings>();
  const [staffEditor, setStaffEditor] = useState<StaffEditorDraft>();
  const [timeOffDraft, setTimeOffDraft] = useState({ startLocal: "", endLocal: "", reason: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings) setDraft(JSON.parse(JSON.stringify(settings)));
  }, [settings]);

  const staffCapacity = useMemo(
    () => staff.filter((member) => member.isActive).reduce((sum, member) => sum + member.capacityUnits, 0),
    [staff],
  );

  if (isLoading || !draft) {
    return (
      <div className="surface p-8 text-sm font-semibold text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading scheduling configuration…
      </div>
    );
  }

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await updateSettings(draft).unwrap();
      setMessage("Scheduling rules saved. New availability requests use them immediately.");
    } catch (err: any) {
      setError(err?.data?.message || "Scheduling settings could not be saved.");
    }
  };

  const addStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      await createStaff({
        name: String(form.get("name")),
        email: String(form.get("email") || "") || undefined,
        capacityUnits: Number(form.get("capacityUnits") || 1),
        isActive: true,
        serviceIds: [],
        weeklyHours: draft.weeklyHours.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          isAvailable: day.isOpen,
          start: day.start,
          end: day.end,
        })),
        timeOff: [],
      }).unwrap();
      event.currentTarget.reset();
      setMessage("Cleaner capacity added. You can now customize that employee’s schedule.");
    } catch (err: any) {
      setError(err?.data?.message || "Staff capacity member could not be added.");
    }
  };

  const openStaffEditor = (member: StaffSchedule) => {
    setStaffEditor({ ...JSON.parse(JSON.stringify(member)), timeOff: member.timeOff.map((item) => ({ ...item })) });
    setTimeOffDraft({ startLocal: "", endLocal: "", reason: "" });
  };

  const saveStaffSchedule = async () => {
    if (!staffEditor) return;
    setError("");
    try {
      await updateStaff({
        id: staffEditor._id,
        data: {
          name: staffEditor.name,
          email: staffEditor.email || undefined,
          isActive: staffEditor.isActive,
          capacityUnits: staffEditor.capacityUnits,
          serviceIds: staffEditor.serviceIds,
          weeklyHours: staffEditor.weeklyHours,
          timeOff: staffEditor.timeOff,
        },
      }).unwrap();
      setStaffEditor(undefined);
      setMessage("Employee availability saved and live booking capacity recalculated.");
    } catch (err: any) {
      setError(err?.data?.message || "Employee schedule could not be saved.");
    }
  };

  const addTimeOff = () => {
    if (!staffEditor || !timeOffDraft.startLocal || !timeOffDraft.endLocal) return;
    setStaffEditor({
      ...staffEditor,
      timeOff: [
        ...staffEditor.timeOff,
        {
          startLocal: timeOffDraft.startLocal,
          endLocal: timeOffDraft.endLocal,
          reason: timeOffDraft.reason.trim() || undefined,
        },
      ],
    });
    setTimeOffDraft({ startLocal: "", endLocal: "", reason: "" });
  };

  const addBlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    const startLocal = String(form.get("startLocal"));
    const endLocal = String(form.get("endLocal"));
    try {
      await createBlock({
        title: String(form.get("title")),
        startLocal,
        endLocal,
        capacityReduction: Number(form.get("capacityReduction") || 999),
      }).unwrap();
      event.currentTarget.reset();
      setMessage("Operational capacity block added in the business timezone.");
    } catch (err: any) {
      setError(err?.data?.message || "Block could not be created.");
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <span className="editorial-kicker">Scheduling engine</span>
        <h2 className="admin-page-heading mt-3 text-brand-dark">Availability & capacity</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Control the business timezone, opening hours, booking horizon, travel buffers, crew capacity,
          cancellation policy, deposits, employee availability, closed dates, and operational blocks that power public booking.
        </p>
      </section>

      {message ? <div className="feedback-panel border-brand-green/20 bg-brand-green/5 text-brand-green">{message}</div> : null}
      {error ? <div className="feedback-panel border-destructive/20 bg-destructive/5 text-destructive">{error}</div> : null}

      <form onSubmit={save} className="surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-brand-dark">Business scheduling rules</h3>
            <p className="mt-1 text-xs text-muted-foreground">All weekly hours and local blocks are interpreted in the configured IANA timezone.</p>
          </div>
          <button className="btn-primary" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save rules
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NumberField label="Slot interval (min)" value={draft.slotIntervalMinutes} onChange={(value) => setDraft({ ...draft, slotIntervalMinutes: value })} />
          <NumberField label="Lead time (hours)" value={draft.bookingLeadTimeHours} onChange={(value) => setDraft({ ...draft, bookingLeadTimeHours: value })} />
          <NumberField label="Booking horizon (days)" value={draft.bookingHorizonDays} onChange={(value) => setDraft({ ...draft, bookingHorizonDays: value })} />
          <NumberField label="Travel buffer (min)" value={draft.defaultTravelBufferMinutes} onChange={(value) => setDraft({ ...draft, defaultTravelBufferMinutes: value })} />
          <NumberField label="Fallback crew capacity" value={draft.defaultCrewCapacity} onChange={(value) => setDraft({ ...draft, defaultCrewCapacity: value })} />
          <NumberField label="Cancel notice (hours)" value={draft.cancellationNoticeHours} onChange={(value) => setDraft({ ...draft, cancellationNoticeHours: value })} />
          <NumberField label="Reschedule notice (hours)" value={draft.rescheduleNoticeHours} onChange={(value) => setDraft({ ...draft, rescheduleNoticeHours: value })} />
          <NumberField label="Max recurring visits" value={draft.recurrenceMaxOccurrences} onChange={(value) => setDraft({ ...draft, recurrenceMaxOccurrences: value })} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label>
            <span className="field-label">Business timezone</span>
            <input className="field-control" value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })} placeholder="America/New_York" />
          </label>
          <label>
            <span className="field-label">Deposit policy</span>
            <select className="field-control" value={draft.depositPolicy} onChange={(event) => setDraft({ ...draft, depositPolicy: event.target.value as SchedulingSettings["depositPolicy"] })}>
              <option value="NONE">No deposit</option>
              <option value="OPTIONAL">Optional deposit</option>
              <option value="REQUIRED">Required deposit</option>
            </select>
          </label>
          <label>
            <span className="field-label">Deposit value</span>
            <div className="flex gap-2">
              <select className="field-control max-w-32" value={draft.depositType} onChange={(event) => setDraft({ ...draft, depositType: event.target.value as SchedulingSettings["depositType"] })}>
                <option value="PERCENT">%</option>
                <option value="FIXED">Fixed</option>
              </select>
              <input type="number" min="0" className="field-control" value={draft.depositValue} onChange={(event) => setDraft({ ...draft, depositValue: Number(event.target.value) })} />
            </div>
          </label>
        </div>

        <div className="mt-4 grid gap-4 rounded-xl border border-border bg-brand-cream/35 p-4 md:grid-cols-[1fr_220px] md:items-center">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={draft.allowLateCancellation} onChange={(event) => setDraft({ ...draft, allowLateCancellation: event.target.checked })} />
            <span>
              <span className="block text-sm font-extrabold text-brand-dark">Allow late online cancellation</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">When disabled, customers inside the notice window must contact the business instead.</span>
            </span>
          </label>
          <NumberField label="Late cancellation fee (%)" value={draft.lateCancellationFeePercent} onChange={(value) => setDraft({ ...draft, lateCancellationFeePercent: Math.min(100, value) })} />
        </div>

        <div className="mt-7">
          <h4 className="text-sm font-extrabold text-brand-dark">Weekly opening hours</h4>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border">
            <table className="data-table min-w-[680px]">
              <thead><tr><th>Day</th><th>Open</th><th>Start</th><th>End</th></tr></thead>
              <tbody>
                {draft.weeklyHours.map((day, index) => (
                  <tr key={day.dayOfWeek}>
                    <td className="font-bold text-brand-dark">{days[day.dayOfWeek]}</td>
                    <td><input type="checkbox" checked={day.isOpen} onChange={(event) => { const weeklyHours = [...draft.weeklyHours]; weeklyHours[index] = { ...day, isOpen: event.target.checked }; setDraft({ ...draft, weeklyHours }); }} /></td>
                    <td><input type="time" className="field-control max-w-40" value={day.start} disabled={!day.isOpen} onChange={(event) => { const weeklyHours = [...draft.weeklyHours]; weeklyHours[index] = { ...day, start: event.target.value }; setDraft({ ...draft, weeklyHours }); }} /></td>
                    <td><input type="time" className="field-control max-w-40" value={day.end} disabled={!day.isOpen} onChange={(event) => { const weeklyHours = [...draft.weeklyHours]; weeklyHours[index] = { ...day, end: event.target.value }; setDraft({ ...draft, weeklyHours }); }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <label className="field-label" htmlFor="closedDates">Closed dates</label>
          <textarea
            id="closedDates"
            className="field-control min-h-28 font-mono text-xs"
            value={draft.closedDates.map((item) => `${item.date}${item.reason ? ` | ${item.reason}` : ""}`).join("\n")}
            onChange={(event) => setDraft({
              ...draft,
              closedDates: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
                const [date, reason] = line.split("|").map((part) => part.trim());
                return { date, reason: reason || undefined };
              }),
            })}
            placeholder="2026-12-25 | Christmas Day"
          />
          <p className="mt-2 text-xs text-muted-foreground">One date per line: YYYY-MM-DD | optional reason.</p>
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface p-5 sm:p-6">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green"><Users className="h-3.5 w-3.5" /> Employee capacity</span>
          <h3 className="mt-2 text-xl font-extrabold text-brand-dark">Scheduled cleaners</h3>
          <p className="mt-1 text-xs text-muted-foreground">Active capacity: {staffCapacity || draft.defaultCrewCapacity} units. Once staff records exist, their real schedules replace fallback capacity.</p>

          <form onSubmit={addStaff} className="mt-5 grid gap-3 sm:grid-cols-3">
            <input name="name" required className="field-control" placeholder="Cleaner name" />
            <input name="email" type="email" className="field-control" placeholder="Email (optional)" />
            <div className="flex gap-2"><input name="capacityUnits" type="number" min="1" max="10" defaultValue="1" className="field-control" aria-label="Capacity units" /><button className="btn-primary px-3" disabled={addingStaff}><Plus className="h-4 w-4" /></button></div>
          </form>

          <div className="mt-5 space-y-2">
            {staff.map((member) => (
              <div key={member._id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-brand-dark">{member.name}</p><p className="text-[11px] text-muted-foreground">{member.capacityUnits} capacity unit{member.capacityUnits === 1 ? "" : "s"} · {member.timeOff.length} time-off block{member.timeOff.length === 1 ? "" : "s"}</p></div>
                <button type="button" onClick={() => openStaffEditor(member)} className="btn-secondary px-2.5"><Pencil className="h-3.5 w-3.5" /><span className="hidden sm:inline">Schedule</span></button>
                <button type="button" onClick={() => updateStaff({ id: member._id, data: { isActive: !member.isActive } })} className={`status-badge ${member.isActive ? "border-brand-green/20 bg-brand-green/5 text-brand-green" : "border-border bg-muted text-muted-foreground"}`}>{member.isActive ? "Active" : "Off"}</button>
                <button type="button" onClick={() => deleteStaff(member._id)} className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/5" aria-label={`Delete ${member.name}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5 sm:p-6">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green"><CalendarOff className="h-3.5 w-3.5" /> Capacity blocks</span>
          <h3 className="mt-2 text-xl font-extrabold text-brand-dark">Operational blocks</h3>
          <p className="mt-1 text-xs text-muted-foreground">Block all or part of crew capacity for meetings, maintenance, travel, or private jobs. Enter times in {draft.timezone}.</p>
          <form onSubmit={addBlock} className="mt-5 grid gap-3">
            <input name="title" required className="field-control" placeholder="Team training" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="field-label">Starts</span><input name="startLocal" type="datetime-local" required className="field-control" /></label>
              <label><span className="field-label">Ends</span><input name="endLocal" type="datetime-local" required className="field-control" /></label>
            </div>
            <div className="flex gap-2"><input name="capacityReduction" type="number" min="1" max="999" defaultValue="999" className="field-control" aria-label="Capacity reduction" /><button className="btn-secondary shrink-0" disabled={addingBlock}><Plus className="h-4 w-4" />Add block</button></div>
          </form>
          <div className="mt-5 space-y-2">
            {blocks.map((block) => (
              <div key={block._id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Clock3 className="h-4 w-4 shrink-0 text-brand-green" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-brand-dark">{block.title}</p><p className="text-[11px] text-muted-foreground">{formatBusinessDateTime(block.startAt, draft.timezone)} → {formatBusinessDateTime(block.endAt, draft.timezone)}</p></div>
                <button type="button" onClick={() => deleteBlock(block._id)} className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/5" aria-label={`Delete ${block.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {staffEditor ? (
        <section className="surface overflow-hidden" aria-label={`Edit ${staffEditor.name} schedule`}>
          <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
            <div><span className="editorial-kicker">Employee availability</span><h3 className="mt-2 text-xl font-extrabold text-brand-dark">{staffEditor.name}</h3><p className="mt-1 text-xs text-muted-foreground">Availability is evaluated in {draft.timezone}. Time off immediately removes this cleaner’s capacity from overlapping slots.</p></div>
            <button type="button" onClick={() => setStaffEditor(undefined)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-brand-dark" aria-label="Close employee schedule"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <label><span className="field-label">Name</span><input className="field-control" value={staffEditor.name} onChange={(event) => setStaffEditor({ ...staffEditor, name: event.target.value })} /></label>
              <label><span className="field-label">Email</span><input type="email" className="field-control" value={staffEditor.email || ""} onChange={(event) => setStaffEditor({ ...staffEditor, email: event.target.value })} /></label>
              <label><span className="field-label">Capacity units</span><input type="number" min="1" max="10" className="field-control" value={staffEditor.capacityUnits} onChange={(event) => setStaffEditor({ ...staffEditor, capacityUnits: Number(event.target.value) })} /></label>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="data-table min-w-[680px]">
                <thead><tr><th>Day</th><th>Available</th><th>Start</th><th>End</th></tr></thead>
                <tbody>
                  {staffEditor.weeklyHours.map((day, index) => (
                    <tr key={day.dayOfWeek}>
                      <td className="font-bold text-brand-dark">{days[day.dayOfWeek]}</td>
                      <td><input type="checkbox" checked={day.isAvailable} onChange={(event) => { const weeklyHours = [...staffEditor.weeklyHours]; weeklyHours[index] = { ...day, isAvailable: event.target.checked }; setStaffEditor({ ...staffEditor, weeklyHours }); }} /></td>
                      <td><input type="time" className="field-control max-w-40" value={day.start} disabled={!day.isAvailable} onChange={(event) => { const weeklyHours = [...staffEditor.weeklyHours]; weeklyHours[index] = { ...day, start: event.target.value }; setStaffEditor({ ...staffEditor, weeklyHours }); }} /></td>
                      <td><input type="time" className="field-control max-w-40" value={day.end} disabled={!day.isAvailable} onChange={(event) => { const weeklyHours = [...staffEditor.weeklyHours]; weeklyHours[index] = { ...day, end: event.target.value }; setStaffEditor({ ...staffEditor, weeklyHours }); }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-brand-dark">Time off</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <label><span className="field-label">Starts</span><input type="datetime-local" className="field-control" value={timeOffDraft.startLocal} onChange={(event) => setTimeOffDraft({ ...timeOffDraft, startLocal: event.target.value })} /></label>
                <label><span className="field-label">Ends</span><input type="datetime-local" className="field-control" value={timeOffDraft.endLocal} onChange={(event) => setTimeOffDraft({ ...timeOffDraft, endLocal: event.target.value })} /></label>
                <label><span className="field-label">Reason</span><input className="field-control" value={timeOffDraft.reason} onChange={(event) => setTimeOffDraft({ ...timeOffDraft, reason: event.target.value })} placeholder="Vacation" /></label>
                <div className="flex items-end"><button type="button" onClick={addTimeOff} className="btn-secondary w-full"><Plus className="h-4 w-4" />Add time off</button></div>
              </div>
              <div className="mt-3 space-y-2">
                {staffEditor.timeOff.map((entry, index) => {
                  const local = "startLocal" in entry;
                  const start = local ? entry.startLocal.replace("T", " ") : formatBusinessDateTime(entry.startAt, draft.timezone);
                  const end = local ? entry.endLocal.replace("T", " ") : formatBusinessDateTime(entry.endAt, draft.timezone);
                  return <div key={`${start}-${index}`} className="flex items-center gap-3 rounded-xl border border-border p-3"><CalendarOff className="h-4 w-4 text-brand-green" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-brand-dark">{start} → {end}</p><p className="text-[11px] text-muted-foreground">{entry.reason || "Time off"}</p></div><button type="button" onClick={() => setStaffEditor({ ...staffEditor, timeOff: staffEditor.timeOff.filter((_, itemIndex) => itemIndex !== index) })} className="grid h-8 w-8 place-items-center rounded-lg text-destructive hover:bg-destructive/5" aria-label="Remove time off"><Trash2 className="h-3.5 w-3.5" /></button></div>;
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-5"><button type="button" onClick={() => setStaffEditor(undefined)} className="btn-secondary">Cancel</button><button type="button" onClick={saveStaffSchedule} disabled={updatingStaff} className="btn-primary">{updatingStaff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save employee schedule</button></div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="field-label">{label}</span><input type="number" min="0" className="field-control" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
