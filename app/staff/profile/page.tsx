"use client";

import { CalendarOff, Clock, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useGetMyStaffProfileQuery } from "@/src/redux/features/team/teamApi";
import { useGetPublicSchedulingConfigQuery } from "@/src/redux/features/scheduling/schedulingApi";
import { LoadingState } from "@/src/components/ui/feedback";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StaffProfilePage() {
  const { data, isLoading } = useGetMyStaffProfileQuery();
  const { data: config } = useGetPublicSchedulingConfigQuery();

  const timezone = config?.timezone || "America/New_York";
  const formatTime = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));

  if (isLoading || !data) {
    return <LoadingState label="Loading staff profile…" />;
  }

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Profile Spruce Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-green/20 blur-[90px]" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar Initials Badge */}
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-brand-lime text-2xl font-black text-brand-dark shadow-lg">
            {initials}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/30 bg-white/10 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-sm">
                <UserCheck className="h-3 w-3" />
                Verified Field Cleaner
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-white/70">
                Code: {data.employeeCode || "CREW"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {data.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/70">
              {data.jobTitle || "Cleaning Specialist"} · {data.email}
            </p>
          </div>
        </div>

        {/* Certified Skills */}
        {data.skills?.length > 0 ? (
          <div className="relative z-10 mt-6 pt-6 border-t border-white/15">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-white/60 mb-2.5">
              Certified Skills & Specialties
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Regular Availability Grid */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-green" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
            Weekly Schedule & Availability
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Your regular weekly working hours configured for dispatch routing.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {data.weeklyHours.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                day.isAvailable
                  ? "border-brand-green/20 bg-[#F4FAF5]/60"
                  : "border-border bg-white text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    day.isAvailable ? "bg-brand-green" : "bg-neutral-300"
                  }`}
                />
                <span className="text-xs font-extrabold text-brand-dark">
                  {days[day.dayOfWeek]}
                </span>
              </div>
              <span
                className={`text-xs font-bold ${
                  day.isAvailable ? "text-brand-green" : "text-muted-foreground"
                }`}
              >
                {day.isAvailable ? `${day.start} – ${day.end}` : "Off / Unavailable"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Time Off Blocks */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarOff className="h-5 w-5 text-brand-green" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
            Scheduled Time Off
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Approved holidays, personal days, and planned absences.
        </p>

        <div className="mt-6 space-y-2.5">
          {data.timeOff.map((entry, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border bg-[#F4FAF5]/40 p-4 text-xs"
            >
              <div>
                <span className="font-extrabold text-brand-dark">
                  {formatTime(entry.startAt)} → {formatTime(entry.endAt)}
                </span>
                {entry.reason ? (
                  <p className="mt-0.5 text-muted-foreground">{entry.reason}</p>
                ) : null}
              </div>
              <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-green w-fit">
                Approved Leave
              </span>
            </div>
          ))}

          {!data.timeOff.length ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No upcoming time-off blocks scheduled.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
