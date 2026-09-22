"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Sparkles,
  Calendar,
  CheckSquare,
  ArrowRight,
} from "lucide-react";
import { useGetMyFieldOverviewQuery } from "@/src/redux/features/fieldOps/fieldOpsApi";
import { LoadingState, EmptyState } from "@/src/components/ui/feedback";

export default function StaffDashboard() {
  const { data, isLoading, isError } = useGetMyFieldOverviewQuery();

  if (isLoading) {
    return <LoadingState label="Loading today’s field assignments…" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Could not load field workspace"
        description="Please check your internet connection or contact dispatch support."
      />
    );
  }

  const firstName = data.staff.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Top Spruce Overview Card */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-green/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-brand-lime/10 blur-[80px]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5" />
            <span>Today · {data.date}</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready for a clean day, {firstName}.
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-xl">
            Times are scheduled in <strong className="text-white">{data.timezone}</strong>. Review access codes and specific service checklists prior to arrival.
          </p>

          {/* KPI Summary Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Assigned Jobs", value: data.summary.total },
              { label: "Scheduled", value: data.summary.scheduled },
              { label: "In Progress", value: data.summary.active },
              { label: "Completed", value: data.summary.completed },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
              >
                <div className="text-2xl sm:text-3xl font-black text-brand-lime">
                  {value}
                </div>
                <div className="mt-1 text-[11px] font-extrabold uppercase tracking-wider text-white/60">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assigned Route Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-green">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Assigned Route</span>
            </div>
            <h2 className="mt-0.5 text-2xl font-extrabold text-brand-dark">
              Today&apos;s Visits ({data.jobs.length})
            </h2>
          </div>
        </div>

        {data.jobs.length > 0 ? (
          <div className="space-y-3.5">
            {data.jobs.map((job) => {
              const completedTasks = job.checklist.filter((item) => item.completed).length;
              const totalTasks = job.checklist.length;
              const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 100;

              const startTime = new Intl.DateTimeFormat("en-US", {
                timeZone: data.timezone,
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(job.scheduledStart));

              const endTime = new Intl.DateTimeFormat("en-US", {
                timeZone: data.timezone,
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(job.scheduledEnd));

              return (
                <Link
                  key={job._id}
                  href={`/staff/jobs/${job._id}`}
                  className="group block rounded-3xl border border-brand-green/10 bg-white p-5 sm:p-6 shadow-sm transition hover:border-brand-green/30 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Status Icon */}
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                        job.status === "COMPLETED"
                          ? "bg-brand-green/15 text-brand-green"
                          : job.status === "ISSUE"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-brand-lime text-brand-dark shadow-sm"
                      }`}
                    >
                      {job.status === "COMPLETED" ? (
                        <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
                      ) : job.status === "ISSUE" ? (
                        <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
                      ) : (
                        <Clock3 className="h-6 w-6 stroke-[2.2]" />
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg font-extrabold text-brand-dark group-hover:text-brand-green transition-colors">
                            {job.customerName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs font-bold text-brand-green">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>
                              {startTime} — {endTime}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                            job.status === "COMPLETED"
                              ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                              : job.status === "IN_PROGRESS"
                              ? "bg-brand-lime text-brand-dark border border-brand-lime"
                              : job.status === "ISSUE"
                              ? "bg-destructive/10 text-destructive border border-destructive/20"
                              : "bg-[#F4FAF5] text-brand-dark border border-brand-green/15"
                          }`}
                        >
                          {job.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Address */}
                      <p className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                        <span>
                          {job.address.line1}
                          {job.address.line2 ? `, ${job.address.line2}` : ""},{" "}
                          {job.address.city} {job.address.zip}
                        </span>
                      </p>

                      {/* Checklist Progress Bar & Action */}
                      <div className="pt-2 border-t border-brand-green/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold text-muted-foreground">
                            {completedTasks}/{totalTasks} checklist items completed
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime/20 px-3 py-1 text-xs font-extrabold text-brand-green group-hover:bg-brand-lime group-hover:text-brand-dark transition-all">
                          <span>View Job Details</span>
                          <Navigation className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-12 text-center">
            <EmptyState
              title="No Jobs Assigned for Today"
              description="Your schedule is clear right now. Any newly dispatched visits will appear here automatically."
            />
          </div>
        )}
      </section>
    </div>
  );
}
