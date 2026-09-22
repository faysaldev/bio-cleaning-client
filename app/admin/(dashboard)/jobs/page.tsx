"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  RefreshCw,
  Sparkles,
  CalendarDays,
  User,
  UsersRound,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";
import { useGetDispatchJobsQuery } from "@/src/redux/features/fieldOps/fieldOpsApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";

function statusBadgeClass(status: string) {
  if (status === "COMPLETED") return "border-brand-green/30 bg-brand-green/10 text-brand-green";
  if (status === "IN_PROGRESS") return "border-brand-lime bg-brand-lime text-brand-dark";
  if (status === "ISSUE") return "border-destructive/30 bg-destructive/10 text-destructive";
  if (status === "SCHEDULED") return "border-blue-300 bg-blue-50 text-blue-700";
  return "border-border bg-[#F4FAF5] text-brand-dark";
}

export default function JobsPage() {
  const [status, setStatus] = useState("");
  const query = useGetDispatchJobsQuery(status ? { status } : undefined);

  if (query.isLoading && !query.data) {
    return <LoadingState label="Loading field jobs…" />;
  }

  if (query.isError) {
    return (
      <ErrorState
        title="Jobs could not be loaded"
        description="Please check your connection and retry loading the field jobs."
        action={
          <button className="btn-secondary" onClick={() => query.refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  const jobs = query.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Field Operations</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            Cleaning Jobs & Execution
          </h2>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground">
            Execution records automatically generated from customer bookings with live technician assignments, checklists, and field issues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-dark focus:border-brand-green focus:outline-none shadow-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Job Statuses</option>
            {[
              "SCHEDULED",
              "EN_ROUTE",
              "IN_PROGRESS",
              "PAUSED",
              "ISSUE",
              "COMPLETED",
              "CANCELLED",
            ].map((x) => (
              <option key={x} value={x}>
                {x.replace("_", " ")}
              </option>
            ))}
          </select>

          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-extrabold text-brand-dark hover:bg-[#F4FAF5] shadow-xs transition"
            onClick={() => query.refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 text-brand-green" />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/dispatch"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-5 py-2 text-xs font-extrabold text-brand-dark shadow-md hover:bg-brand-lime/90 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Open Dispatch Board</span>
          </Link>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-green/10 bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
            <tr>
              <th className="px-6 py-4">Job #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Scheduled Date</th>
              <th className="px-6 py-4">Staff Assignment</th>
              <th className="px-6 py-4">Checklist</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              const service =
                typeof job.serviceId === "object"
                  ? job.serviceId?.name
                  : "Cleaning Service";
              const staffCount = job.assignedStaffIds?.length || 0;
              const completedTasks = job.checklist.filter((x) => x.completed).length;

              return (
                <tr key={job._id} className="hover:bg-[#F4FAF5]/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-extrabold text-brand-green">
                    {job.jobNumber}
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-dark">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-green/10 text-brand-green">
                        <User className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-extrabold text-brand-dark">
                          {job.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.address.city} {job.address.zip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-brand-dark">
                    {service || "General Cleaning"}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(job.scheduledStart).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-brand-dark">
                    <div className="flex items-center gap-1.5">
                      <UsersRound className="h-3.5 w-3.5 text-brand-green" />
                      <span>
                        {staffCount} cleaner{staffCount === 1 ? "" : "s"}
                        {job.crewId ? " · Crew" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckSquare className="h-3.5 w-3.5 text-brand-green" />
                      <span className="font-extrabold text-brand-dark">
                        {completedTasks}/{job.checklist.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${statusBadgeClass(
                        job.status
                      )}`}
                    >
                      {job.status.replaceAll("_", " ")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!jobs.length ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <ClipboardCheck className="mx-auto mb-3 h-8 w-8 text-brand-green/40" />
            <p className="font-bold text-brand-dark">No field jobs match this filter.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adjust your status filter or create a new booking to generate jobs.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
