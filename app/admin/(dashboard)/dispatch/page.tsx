"use client";

import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Loader2,
  UsersRound,
  X,
  Sparkles,
  Clock,
  UserCheck,
} from "lucide-react";
import {
  useGetDispatchJobsQuery,
  useAssignJobMutation,
} from "@/src/redux/features/fieldOps/fieldOpsApi";
import type { FieldJob } from "@/src/redux/features/fieldOps/types";
import {
  useGetStaffQuery,
  useGetCrewsQuery,
} from "@/src/redux/features/team/teamApi";
import { useGetSchedulingSettingsQuery } from "@/src/redux/features/scheduling/schedulingApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { operationsWriteRoles } from "@/src/lib/roles";
import { EmptyState, LoadingState } from "@/src/components/ui/feedback";

const dayMs = 86_400_000;
type View = "day" | "week" | "month";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
const addDays = (date: Date, days: number) =>
  new Date(startOfDay(date).getTime() + days * dayMs);
const startOfWeek = (date: Date) => addDays(date, -date.getDay());
const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

function formatInZone(
  value: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions
) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: timezone, ...options }).format(
      new Date(value)
    );
  } catch {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
  }
}

function jobDay(value: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  return `${map.year}-${map.month}-${map.day}`;
}

function staffId(value: string | { _id: string }) {
  return typeof value === "string" ? value : value._id;
}

function bookingRequired(job: FieldJob) {
  return typeof job.bookingId === "string"
    ? 1
    : Number(job.bookingId.requiredStaffSnapshot || 1);
}

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
    if (view === "day")
      return {
        from: startOfDay(anchor),
        to: new Date(startOfDay(anchor).getTime() + dayMs - 1),
      };
    if (view === "week") {
      const from = startOfWeek(anchor);
      return { from, to: new Date(from.getTime() + 7 * dayMs - 1) };
    }
    return { from: startOfMonth(anchor), to: endOfMonth(anchor) };
  }, [view, anchor]);

  const queryRange = useMemo(
    () => ({
      from: new Date(range.from.getTime() - dayMs).toISOString(),
      to: new Date(range.to.getTime() + dayMs).toISOString(),
    }),
    [range]
  );

  const { data: jobs = [], isLoading, isFetching } = useGetDispatchJobsQuery(queryRange);
  const { data: staff = [] } = useGetStaffQuery({ active: "true" });
  const { data: crews = [] } = useGetCrewsQuery();
  const [assignJob, { isLoading: assigning }] = useAssignJobMutation();
  const cleaners = staff.filter(
    (member) => member.role === "cleaner" && member.isActive
  );

  const calendarDays = useMemo(() => {
    if (view === "day") return [startOfDay(anchor)];
    if (view === "week")
      return Array.from({ length: 7 }, (_, index) =>
        addDays(startOfWeek(anchor), index)
      );
    const monthStart = startOfMonth(anchor);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [view, anchor]);

  const jobsByDay = useMemo(() => {
    const grouped: Record<string, FieldJob[]> = {};
    jobs.forEach((job) => {
      const key = jobDay(job.scheduledStart, timezone);
      (grouped[key] ||= []).push(job);
    });
    return grouped;
  }, [jobs, timezone]);

  const move = (direction: number) =>
    setAnchor((current) =>
      view === "day"
        ? addDays(current, direction)
        : view === "week"
        ? addDays(current, direction * 7)
        : new Date(current.getFullYear(), current.getMonth() + direction, 1)
    );

  const assignToStaff = async (job: FieldJob, targetId: string) => {
    if (!canAssign) return;
    setError("");
    const current = job.assignedStaffIds.map(staffId);
    const staffIds = current.includes(targetId) ? current : [...current, targetId];
    try {
      const updated = await assignJob({
        id: job._id,
        staffIds,
        crewId: job.crewId
          ? typeof job.crewId === "string"
            ? job.crewId
            : job.crewId._id
          : null,
      }).unwrap();
      setSelected(updated);
    } catch (err: any) {
      setError(err?.data?.message || "Could not assign this job.");
    }
  };

  const assignToCrew = async (job: FieldJob, crewId: string) => {
    if (!canAssign) return;
    setError("");
    try {
      const updated = await assignJob({
        id: job._id,
        crewId,
        staffIds: [],
      }).unwrap();
      setSelected(updated);
    } catch (err: any) {
      setError(err?.data?.message || "Could not assign this crew.");
    }
  };

  const onDrop = (
    event: DragEvent,
    target: { type: "staff" | "crew"; id: string }
  ) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/job-id");
    const job = jobs.find((item) => item._id === id);
    if (!job) return;
    if (target.type === "staff") void assignToStaff(job, target.id);
    else void assignToCrew(job, target.id);
  };

  if (isLoading) return <LoadingState label="Building dispatch calendar…" />;

  return (
    <div className="mx-auto max-w-[1700px] space-y-6">
      {/* Top Header Controls */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Dispatch</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
              Field Operations Calendar
            </h2>
            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
              Drag assignments onto staff members or crews. Overlapping bookings and capacity constraints are automatically enforced.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border bg-[#F4FAF5] p-1">
              <button
                className="grid h-8 w-8 place-items-center rounded-full text-brand-dark hover:bg-white transition"
                onClick={() => move(-1)}
                aria-label="Previous period"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="rounded-full bg-white px-3.5 py-1 text-xs font-extrabold text-brand-dark shadow-xs"
                onClick={() => setAnchor(startOfDay(new Date()))}
              >
                Today
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-full text-brand-dark hover:bg-white transition"
                onClick={() => move(1)}
                aria-label="Next period"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex rounded-full border border-border bg-[#F4FAF5] p-1">
              {(["day", "week", "month"] as View[]).map((item) => (
                <button
                  key={item}
                  className={`rounded-full px-4 py-1.5 text-xs font-extrabold capitalize transition-all ${
                    view === item
                      ? "bg-[#0C3629] text-brand-lime shadow-sm"
                      : "text-muted-foreground hover:text-brand-dark"
                  }`}
                  onClick={() => setView(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div
          className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* Main Grid: Calendar View & Assignment Boards */}
      <div className="grid gap-6 2xl:grid-cols-[1fr_320px]">
        {/* Calendar Grid Container */}
        <section className="overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-green/10 bg-[#F4FAF5] px-6 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-green" />
              <span className="text-sm font-extrabold text-brand-dark">
                {range.from.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {view !== "day"
                  ? ` — ${range.to.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}`
                  : ""}
              </span>
            </div>
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-green" />
            ) : null}
          </div>

          <div
            className={`grid divide-y divide-border ${
              view === "day"
                ? "grid-cols-1"
                : view === "week"
                ? "grid-cols-7 divide-x divide-border"
                : "grid-cols-7 divide-x divide-border"
            }`}
          >
            {calendarDays.map((day) => {
              const key = dateKey(day);
              const items = jobsByDay[key] || [];
              const isToday = dateKey(new Date()) === key;
              const outside =
                view === "month" && day.getMonth() !== anchor.getMonth();

              return (
                <div
                  key={key}
                  className={`${
                    view === "month" ? "min-h-[140px]" : "min-h-[380px]"
                  } p-3 transition-colors ${
                    outside ? "bg-neutral-50/50" : "bg-white"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold ${
                        isToday
                          ? "grid h-7 w-7 place-items-center rounded-xl bg-brand-lime text-brand-dark shadow-sm"
                          : "text-brand-dark"
                      }`}
                    >
                      {view === "month"
                        ? day.getDate()
                        : day.toLocaleDateString(undefined, {
                            weekday: "short",
                            day: "numeric",
                          })}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {items.length > 0 ? `${items.length} jobs` : ""}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {items.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        timezone={timezone}
                        draggable={canAssign}
                        onSelect={() => setSelected(job)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!jobs.length ? (
            <div className="p-12 text-center">
              <EmptyState
                title="No jobs scheduled in this period"
                description="Bookings scheduled in this range will appear on the dispatch calendar automatically."
              />
            </div>
          ) : null}
        </section>

        {/* Assignment Side Panel */}
        <aside className="space-y-6">
          {/* Individual Cleaners */}
          <section className="rounded-3xl border border-brand-green/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-green/10">
              <UsersRound className="h-4 w-4 text-brand-green" />
              <h3 className="font-extrabold text-brand-dark text-sm">
                Cleaners & Technicians
              </h3>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Drag jobs directly onto a staff card to assign.
            </p>

            <div className="mt-4 space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {cleaners.map((member) => (
                <div
                  key={member._id}
                  onDragOver={(e) => canAssign && e.preventDefault()}
                  onDrop={(e) => onDrop(e, { type: "staff", id: member._id })}
                  className="rounded-2xl border border-dashed border-brand-green/20 bg-[#F4FAF5]/60 p-3 transition hover:border-brand-green hover:bg-[#F4FAF5]"
                >
                  <div className="text-xs font-extrabold text-brand-dark">
                    {member.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {member.jobTitle || "Cleaner"} ·{" "}
                    {member.skills.slice(0, 2).join(", ") || "General Cleaning"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Crews */}
          <section className="rounded-3xl border border-brand-green/10 bg-white p-5 shadow-sm">
            <h3 className="font-extrabold text-brand-dark text-sm pb-3 border-b border-brand-green/10">
              Assigned Crews
            </h3>
            <div className="mt-3 space-y-2">
              {crews
                .filter((crew) => crew.isActive)
                .map((crew) => (
                  <div
                    key={crew._id}
                    onDragOver={(e) => canAssign && e.preventDefault()}
                    onDrop={(e) => onDrop(e, { type: "crew", id: crew._id })}
                    className="rounded-2xl border border-dashed border-brand-green/20 bg-[#F4FAF5]/60 p-3 transition hover:border-brand-green hover:bg-[#F4FAF5]"
                  >
                    <div className="text-xs font-extrabold text-brand-dark">
                      {crew.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {crew.memberIds.length} active cleaners
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Assignment Slideover Drawer */}
      {selected ? (
        <AssignmentDrawer
          job={selected}
          staff={cleaners}
          crews={crews.filter((crew) => crew.isActive)}
          timezone={timezone}
          canAssign={canAssign}
          assigning={assigning}
          onClose={() => setSelected(null)}
          onSave={async (staffIds, crewId) => {
            try {
              const updated = await assignJob({
                id: selected._id,
                staffIds,
                crewId,
              }).unwrap();
              setSelected(updated);
              setError("");
            } catch (err: any) {
              setError(err?.data?.message || "Could not update assignment.");
            }
          }}
        />
      ) : null}
    </div>
  );
}

function JobCard({
  job,
  timezone,
  draggable,
  onSelect,
}: {
  job: FieldJob;
  timezone: string;
  draggable: boolean;
  onSelect: () => void;
}) {
  const assigned = job.assignedStaffIds.length;
  const required = bookingRequired(job);
  const service =
    typeof job.serviceId === "string" ? "Cleaning" : job.serviceId?.name || "Cleaning";

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/job-id", job._id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onSelect}
      className="w-full rounded-2xl border border-brand-green/10 bg-[#F4FAF5]/80 p-2.5 text-left shadow-xs transition hover:border-brand-green hover:bg-white"
    >
      <div className="flex gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-extrabold text-brand-dark">
            {job.customerName}
          </div>
          <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {formatInZone(job.scheduledStart, timezone, {
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            · {service}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                job.status === "ISSUE"
                  ? "border border-destructive/20 bg-destructive/10 text-destructive"
                  : "border border-brand-green/20 bg-brand-green/10 text-brand-green"
              }`}
            >
              {job.status.replace("_", " ")}
            </span>
            <span
              className={`text-[9px] font-extrabold ${
                assigned < required ? "text-amber-700" : "text-brand-green"
              }`}
            >
              {assigned}/{required} staff
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function AssignmentDrawer({
  job,
  staff,
  crews,
  timezone,
  canAssign,
  assigning,
  onClose,
  onSave,
}: {
  job: FieldJob;
  staff: any[];
  crews: any[];
  timezone: string;
  canAssign: boolean;
  assigning: boolean;
  onClose: () => void;
  onSave: (ids: string[], crewId: string | null) => void;
}) {
  const [ids, setIds] = useState(job.assignedStaffIds.map(staffId));
  const [crewId, setCrewId] = useState(
    job.crewId ? (typeof job.crewId === "string" ? job.crewId : job.crewId._id) : ""
  );
  const required = bookingRequired(job);

  return (
    <div className="fixed inset-0 z-[90] bg-brand-dark/40 backdrop-blur-sm">
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-green/10 bg-[#0C3629] p-6 text-white">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-lime/30 bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
              Job Dispatch
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-white">
              {job.jobNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-2xl border border-brand-green/15 bg-[#F4FAF5] p-4">
            <div className="font-extrabold text-brand-dark text-sm">
              {job.customerName}
            </div>
            <div className="mt-1 text-xs text-brand-green font-semibold">
              {formatInZone(job.scheduledStart, timezone, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {job.address.line1}, {job.address.city}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
              Assigned Crew
            </label>
            <select
              disabled={!canAssign}
              className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 px-4 py-2.5 text-xs font-bold text-brand-dark focus:border-brand-green focus:bg-white focus:outline-none"
              value={crewId}
              onChange={(e) => setCrewId(e.target.value)}
            >
              <option value="">No crew assigned</option>
              {crews.map((crew) => (
                <option key={crew._id} value={crew._id}>
                  {crew.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Assigned Cleaners
              </span>
              <span
                className={`text-xs font-extrabold ${
                  ids.length < required ? "text-amber-700" : "text-brand-green"
                }`}
              >
                {ids.length}/{required} required
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {staff.map((member) => (
                <label
                  key={member._id}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-bold cursor-pointer transition ${
                    ids.includes(member._id)
                      ? "border-brand-green/20 bg-brand-green/5 text-brand-dark"
                      : "border-border bg-white text-muted-foreground hover:border-brand-green/30"
                  }`}
                >
                  <input
                    disabled={!canAssign}
                    type="checkbox"
                    checked={ids.includes(member._id)}
                    onChange={() =>
                      setIds((current) =>
                        current.includes(member._id)
                          ? current.filter((id) => id !== member._id)
                          : [...current, member._id]
                      )
                    }
                    className="h-4 w-4 rounded accent-brand-green text-brand-green focus:ring-brand-green"
                  />
                  <span className="flex-1 text-brand-dark">{member.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {member.skills?.slice(0, 2).join(", ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {canAssign ? (
            <button
              disabled={assigning}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3.5 px-6 text-xs font-extrabold text-brand-dark shadow-md hover:bg-brand-lime/90 transition hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => onSave(ids, crewId || null)}
            >
              {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>Save Assignment</span>
            </button>
          ) : (
            <p className="rounded-2xl border border-border bg-[#F4FAF5] p-3 text-xs text-muted-foreground text-center">
              Read-only dispatch access.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
