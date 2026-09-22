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
  ShieldCheck,
  AlertCircle,
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
    [staff]
  );

  if (isLoading || !draft) {
    return (
      <div className="rounded-3xl border border-emerald-950/10 bg-white p-8 text-sm font-semibold text-muted-foreground">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-emerald-700" />
        Loading scheduling configuration…
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
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
              Scheduling Engine
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Availability & capacity</h1>
          <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
            Control the business timezone, opening hours, booking horizon, travel buffers, crew capacity, cancellation rules, deposits, and operational blocks that power live customer booking.
          </p>
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

      {/* Rules Form */}
      <form onSubmit={save} className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Rules Engine</span>
            <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Business scheduling rules</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              All weekly hours and local blocks are interpreted in the configured IANA timezone.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save rules
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NumberField
            label="Slot interval (min)"
            value={draft.slotIntervalMinutes}
            onChange={(value) => setDraft({ ...draft, slotIntervalMinutes: value })}
          />
          <NumberField
            label="Lead time (hours)"
            value={draft.bookingLeadTimeHours}
            onChange={(value) => setDraft({ ...draft, bookingLeadTimeHours: value })}
          />
          <NumberField
            label="Booking horizon (days)"
            value={draft.bookingHorizonDays}
            onChange={(value) => setDraft({ ...draft, bookingHorizonDays: value })}
          />
          <NumberField
            label="Travel buffer (min)"
            value={draft.defaultTravelBufferMinutes}
            onChange={(value) => setDraft({ ...draft, defaultTravelBufferMinutes: value })}
          />
          <NumberField
            label="Fallback crew capacity"
            value={draft.defaultCrewCapacity}
            onChange={(value) => setDraft({ ...draft, defaultCrewCapacity: value })}
          />
          <NumberField
            label="Cancel notice (hours)"
            value={draft.cancellationNoticeHours}
            onChange={(value) => setDraft({ ...draft, cancellationNoticeHours: value })}
          />
          <NumberField
            label="Reschedule notice (hours)"
            value={draft.rescheduleNoticeHours}
            onChange={(value) => setDraft({ ...draft, rescheduleNoticeHours: value })}
          />
          <NumberField
            label="Max recurring visits"
            value={draft.recurrenceMaxOccurrences}
            onChange={(value) => setDraft({ ...draft, recurrenceMaxOccurrences: value })}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Business timezone
            </span>
            <input
              className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
              value={draft.timezone}
              onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}
              placeholder="America/New_York"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Deposit policy
            </span>
            <select
              className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
              value={draft.depositPolicy}
              onChange={(event) =>
                setDraft({ ...draft, depositPolicy: event.target.value as SchedulingSettings["depositPolicy"] })
              }
            >
              <option value="NONE">No deposit</option>
              <option value="OPTIONAL">Optional deposit</option>
              <option value="REQUIRED">Required deposit</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Deposit value
            </span>
            <div className="flex gap-2">
              <select
                className="max-w-28 rounded-2xl border border-emerald-950/15 bg-white px-3 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={draft.depositType}
                onChange={(event) =>
                  setDraft({ ...draft, depositType: event.target.value as SchedulingSettings["depositType"] })
                }
              >
                <option value="PERCENT">%</option>
                <option value="FIXED">Fixed</option>
              </select>
              <input
                type="number"
                min="0"
                className="flex-1 rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
                value={draft.depositValue}
                onChange={(event) => setDraft({ ...draft, depositValue: Number(event.target.value) })}
              />
            </div>
          </label>
        </div>

        <div className="mt-5 grid gap-4 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4 md:grid-cols-[1fr_220px] md:items-center">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              checked={draft.allowLateCancellation}
              onChange={(event) => setDraft({ ...draft, allowLateCancellation: event.target.checked })}
            />
            <span>
              <span className="block text-sm font-extrabold text-brand-dark">Allow late online cancellation</span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                When disabled, customers inside the notice window must contact the office instead.
              </span>
            </span>
          </label>
          <NumberField
            label="Late cancellation fee (%)"
            value={draft.lateCancellationFeePercent}
            onChange={(value) => setDraft({ ...draft, lateCancellationFeePercent: Math.min(100, value) })}
          />
        </div>

        {/* Weekly Opening Hours Table */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Service Hours</span>
          <h3 className="mt-1 text-base font-extrabold text-brand-dark">Weekly opening hours</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-950/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-dark">
                <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Day</th>
                    <th className="px-5 py-3">Open</th>
                    <th className="px-5 py-3">Start</th>
                    <th className="px-5 py-3">End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/5">
                  {draft.weeklyHours.map((day, index) => (
                    <tr key={day.dayOfWeek} className="hover:bg-[#F4FAF5]/30">
                      <td className="px-5 py-3 font-bold text-brand-dark">{days[day.dayOfWeek]}</td>
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                          checked={day.isOpen}
                          onChange={(event) => {
                            const weeklyHours = [...draft.weeklyHours];
                            weeklyHours[index] = { ...day, isOpen: event.target.checked };
                            setDraft({ ...draft, weeklyHours });
                          }}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="time"
                          className="rounded-xl border border-emerald-950/15 px-3 py-1.5 text-xs focus:outline-none"
                          value={day.start}
                          disabled={!day.isOpen}
                          onChange={(event) => {
                            const weeklyHours = [...draft.weeklyHours];
                            weeklyHours[index] = { ...day, start: event.target.value };
                            setDraft({ ...draft, weeklyHours });
                          }}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="time"
                          className="rounded-xl border border-emerald-950/15 px-3 py-1.5 text-xs focus:outline-none"
                          value={day.end}
                          disabled={!day.isOpen}
                          onChange={(event) => {
                            const weeklyHours = [...draft.weeklyHours];
                            weeklyHours[index] = { ...day, end: event.target.value };
                            setDraft({ ...draft, weeklyHours });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Closed Dates */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5" htmlFor="closedDates">
            Closed dates
          </label>
          <textarea
            id="closedDates"
            className="w-full rounded-2xl border border-emerald-950/15 bg-white p-3.5 font-mono text-xs text-brand-dark focus:border-emerald-600 focus:outline-none min-h-24"
            value={draft.closedDates.map((item) => `${item.date}${item.reason ? ` | ${item.reason}` : ""}`).join("\n")}
            onChange={(event) =>
              setDraft({
                ...draft,
                closedDates: event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [date, reason] = line.split("|").map((part) => part.trim());
                    return { date, reason: reason || undefined };
                  }),
              })
            }
            placeholder="2026-12-25 | Christmas Day"
          />
          <p className="mt-1 text-xs text-muted-foreground">One date per line: YYYY-MM-DD | optional reason.</p>
        </div>
      </form>

      {/* Row 2: Scheduled Cleaners & Operational Blocks */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Scheduled Cleaners */}
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Employee Capacity</span>
              <h3 className="mt-0.5 text-xl font-extrabold text-brand-dark">Scheduled cleaners</h3>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Active capacity: {staffCapacity || draft.defaultCrewCapacity} units.
          </p>

          <form onSubmit={addStaff} className="mt-4 grid gap-2.5 sm:grid-cols-3">
            <input
              name="name"
              required
              className="rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs font-medium focus:outline-none"
              placeholder="Cleaner name"
            />
            <input
              name="email"
              type="email"
              className="rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs font-medium focus:outline-none"
              placeholder="Email (optional)"
            />
            <div className="flex gap-2">
              <input
                name="capacityUnits"
                type="number"
                min="1"
                max="10"
                defaultValue="1"
                className="w-16 rounded-2xl border border-emerald-950/15 px-2.5 py-2 text-xs font-medium focus:outline-none"
                aria-label="Capacity units"
              />
              <button
                className="flex-1 inline-flex items-center justify-center rounded-full bg-[#7CE337] px-3 py-2 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49]"
                disabled={addingStaff}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-2.5">
            {staff.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-dark">{member.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {member.capacityUnits} capacity unit{member.capacityUnits === 1 ? "" : "s"} · {member.timeOff.length} time-off block
                    {member.timeOff.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openStaffEditor(member)}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-2.5 py-1 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                >
                  <Pencil className="h-3 w-3 text-emerald-700" />
                  <span className="hidden sm:inline">Schedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStaff({ id: member._id, data: { isActive: !member.isActive } })}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    member.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {member.isActive ? "Active" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteStaff(member._id)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                  aria-label={`Delete ${member.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Operational Capacity Blocks */}
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Capacity Blocks</span>
              <h3 className="mt-0.5 text-xl font-extrabold text-brand-dark">Operational blocks</h3>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarOff className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Block crew capacity for training, maintenance, or holiday shutdowns in {draft.timezone}.
          </p>

          <form onSubmit={addBlock} className="mt-4 grid gap-2.5">
            <input
              name="title"
              required
              className="rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs font-medium focus:outline-none"
              placeholder="Team training"
            />
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Starts</span>
                <input
                  name="startLocal"
                  type="datetime-local"
                  required
                  className="w-full rounded-2xl border border-emerald-950/15 px-3 py-1.5 text-xs font-medium focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Ends</span>
                <input
                  name="endLocal"
                  type="datetime-local"
                  required
                  className="w-full rounded-2xl border border-emerald-950/15 px-3 py-1.5 text-xs font-medium focus:outline-none"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <input
                name="capacityReduction"
                type="number"
                min="1"
                max="999"
                defaultValue="999"
                className="w-24 rounded-2xl border border-emerald-950/15 px-3 py-2 text-xs font-medium focus:outline-none"
                aria-label="Capacity reduction"
              />
              <button
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                disabled={addingBlock}
              >
                <Plus className="h-3.5 w-3.5 text-emerald-700" />
                Add block
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-2.5">
            {blocks.map((block) => (
              <div
                key={block._id}
                className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3"
              >
                <Clock3 className="h-4 w-4 shrink-0 text-emerald-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-dark">{block.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatBusinessDateTime(block.startAt, draft.timezone)} →{" "}
                    {formatBusinessDateTime(block.endAt, draft.timezone)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBlock(block._id)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                  aria-label={`Delete ${block.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Staff Schedule Editor Modal */}
      {staffEditor ? (
        <div className="fixed inset-0 z-[90] bg-[#0C3629]/50 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 p-6 backdrop-blur">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Employee availability</span>
                <h3 className="mt-1 text-xl font-extrabold text-brand-dark">{staffEditor.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Availability evaluated in {draft.timezone}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStaffEditor(undefined)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark"
                aria-label="Close employee schedule"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name</span>
                  <input
                    className="w-full rounded-2xl border border-emerald-950/15 px-3 py-2 text-sm focus:outline-none"
                    value={staffEditor.name}
                    onChange={(event) => setStaffEditor({ ...staffEditor, name: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</span>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-emerald-950/15 px-3 py-2 text-sm focus:outline-none"
                    value={staffEditor.email || ""}
                    onChange={(event) => setStaffEditor({ ...staffEditor, email: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Capacity units</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full rounded-2xl border border-emerald-950/15 px-3 py-2 text-sm focus:outline-none"
                    value={staffEditor.capacityUnits}
                    onChange={(event) => setStaffEditor({ ...staffEditor, capacityUnits: Number(event.target.value) })}
                  />
                </label>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Weekly hours</span>
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
                      {staffEditor.weeklyHours.map((day, index) => (
                        <tr key={day.dayOfWeek}>
                          <td className="px-3 py-2 font-bold text-brand-dark">{days[day.dayOfWeek]}</td>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                              checked={day.isAvailable}
                              onChange={(event) => {
                                const weeklyHours = [...staffEditor.weeklyHours];
                                weeklyHours[index] = { ...day, isAvailable: event.target.checked };
                                setStaffEditor({ ...staffEditor, weeklyHours });
                              }}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="time"
                              className="rounded-xl border border-emerald-950/15 px-2 py-1 text-xs"
                              value={day.start}
                              disabled={!day.isAvailable}
                              onChange={(event) => {
                                const weeklyHours = [...staffEditor.weeklyHours];
                                weeklyHours[index] = { ...day, start: event.target.value };
                                setStaffEditor({ ...staffEditor, weeklyHours });
                              }}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="time"
                              className="rounded-xl border border-emerald-950/15 px-2 py-1 text-xs"
                              value={day.end}
                              disabled={!day.isAvailable}
                              onChange={(event) => {
                                const weeklyHours = [...staffEditor.weeklyHours];
                                weeklyHours[index] = { ...day, end: event.target.value };
                                setStaffEditor({ ...staffEditor, weeklyHours });
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
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Time off</span>
                <div className="grid gap-2 sm:grid-cols-4">
                  <input
                    type="datetime-local"
                    className="rounded-2xl border border-emerald-950/15 px-2.5 py-1.5 text-xs"
                    value={timeOffDraft.startLocal}
                    onChange={(event) => setTimeOffDraft({ ...timeOffDraft, startLocal: event.target.value })}
                  />
                  <input
                    type="datetime-local"
                    className="rounded-2xl border border-emerald-950/15 px-2.5 py-1.5 text-xs"
                    value={timeOffDraft.endLocal}
                    onChange={(event) => setTimeOffDraft({ ...timeOffDraft, endLocal: event.target.value })}
                  />
                  <input
                    className="rounded-2xl border border-emerald-950/15 px-2.5 py-1.5 text-xs"
                    value={timeOffDraft.reason}
                    onChange={(event) => setTimeOffDraft({ ...timeOffDraft, reason: event.target.value })}
                    placeholder="Vacation"
                  />
                  <button
                    type="button"
                    onClick={addTimeOff}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-700" /> Add
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {staffEditor.timeOff.map((entry, index) => {
                    const local = "startLocal" in entry;
                    const start = local ? entry.startLocal.replace("T", " ") : formatBusinessDateTime(entry.startAt, draft.timezone);
                    const end = local ? entry.endLocal.replace("T", " ") : formatBusinessDateTime(entry.endAt, draft.timezone);
                    return (
                      <div
                        key={`${start}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-2.5"
                      >
                        <CalendarOff className="h-4 w-4 text-emerald-700" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-brand-dark">
                            {start} → {end}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{entry.reason || "Time off"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setStaffEditor({
                              ...staffEditor,
                              timeOff: staffEditor.timeOff.filter((_, itemIndex) => itemIndex !== index),
                            })
                          }
                          className="grid h-7 w-7 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                          aria-label="Remove time off"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border/60 pt-5">
                <button
                  type="button"
                  onClick={() => setStaffEditor(undefined)}
                  className="rounded-full border border-emerald-950/15 px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStaffSchedule}
                  disabled={updatingStaff}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#7CE337] px-5 py-2 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49]"
                >
                  {updatingStaff ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save employee schedule
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <input
        type="number"
        min="0"
        className="w-full rounded-2xl border border-emerald-950/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
