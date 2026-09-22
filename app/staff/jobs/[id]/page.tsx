"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  MessageSquareText,
  Navigation,
  Pause,
  Play,
  Upload,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Send,
} from "lucide-react";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import {
  useAddJobNoteMutation,
  useAddJobPhotoMutation,
  useGetFieldJobQuery,
  useReportJobIssueMutation,
  useResolveJobIssueMutation,
  useUpdateJobChecklistMutation,
  useUpdateJobStatusMutation,
} from "@/src/redux/features/fieldOps/fieldOpsApi";
import type { JobStatus } from "@/src/redux/features/fieldOps/types";
import { LoadingState } from "@/src/components/ui/feedback";

function errorMessage(error: any) {
  return error?.data?.message || error?.data?.error || "Could not update the job.";
}

export default function StaffJobPage() {
  const params = useParams<{ id: string }>();
  const { data: job, isLoading } = useGetFieldJobQuery(params.id);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [updateStatus, { isLoading: statusLoading }] = useUpdateJobStatusMutation();
  const [updateChecklist] = useUpdateJobChecklistMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadFileMutation();
  const [addPhoto] = useAddJobPhotoMutation();
  const [addNote] = useAddJobNoteMutation();
  const [reportIssue] = useReportJobIssueMutation();
  const [resolveIssue] = useResolveJobIssueMutation();

  const progress = useMemo(
    () =>
      job?.checklist.length
        ? Math.round(
            (job.checklist.filter((item) => item.completed).length /
              job.checklist.length) *
              100
          )
        : 100,
    [job]
  );

  if (isLoading || !job) {
    return <LoadingState label="Opening job details…" />;
  }

  const setStatus = async (status: JobStatus) => {
    setError("");
    try {
      await updateStatus({ id: job._id, status }).unwrap();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const uploadEvidence = async (
    event: ChangeEvent<HTMLInputElement>,
    type: "BEFORE" | "AFTER" | "ISSUE"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploaded: any = await uploadFile(form).unwrap();
      const url = uploaded?.data?.url || uploaded?.url;
      if (!url) throw new Error("Upload did not return a URL");
      await addPhoto({ id: job._id, type, url }).unwrap();
      event.target.value = "";
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const submitNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = String(form.get("text") || "");
    if (!text.trim()) return;
    try {
      await addNote({ id: job._id, text }).unwrap();
      event.currentTarget.reset();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const submitIssue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await reportIssue({
        id: job._id,
        title: String(form.get("title")),
        description: String(form.get("description")),
        severity: String(form.get("severity")) as any,
      }).unwrap();
      event.currentTarget.reset();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${job.address.line1}, ${job.address.city} ${job.address.zip}`
  )}`;
  const timezone = job.businessTimezone || "America/New_York";
  const startLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(job.scheduledStart));
  const endLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(job.scheduledEnd));

  const active = !["COMPLETED", "CANCELLED"].includes(job.status);
  const serviceName =
    typeof job.serviceId === "string"
      ? "Cleaning service"
      : job.serviceId?.name || "Cleaning service";

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/staff"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-brand-dark transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Today&apos;s Route</span>
      </Link>

      {/* Top Spruce Job Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-green/20 blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/30 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-lime backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Job #{job.jobNumber}</span>
            </div>

            <span
              className={`rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider ${
                job.status === "ISSUE"
                  ? "border border-red-400/30 bg-red-500/20 text-red-200"
                  : job.status === "COMPLETED"
                  ? "border border-brand-lime/30 bg-brand-lime/20 text-brand-lime"
                  : "border border-white/20 bg-white/10 text-white"
              }`}
            >
              {job.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {job.customerName}
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/70">
              {serviceName}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-xs text-white/90 backdrop-blur-sm transition hover:bg-white/20"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold">
                  {job.address.line1}
                  {job.address.line2 ? `, ${job.address.line2}` : ""},{" "}
                  {job.address.city} {job.address.zip}
                </span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/60" />
            </a>

            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-xs text-white/90 backdrop-blur-sm">
              <Clock3 className="h-4 w-4 shrink-0 text-brand-lime" />
              <span className="font-semibold">
                {startLabel} — {endLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error or Success Feedback */}
      {error ? (
        <div
          className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4 text-xs font-bold text-brand-green">
          {message}
        </div>
      ) : null}

      {/* Field Action Command Bar */}
      {active ? (
        <section className="rounded-3xl border border-brand-green/15 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wider text-brand-green mb-3">
            Status Controls
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {job.status === "SCHEDULED" ? (
              <button
                disabled={statusLoading}
                onClick={() => setStatus("EN_ROUTE")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime py-3 px-4 text-xs font-extrabold text-brand-dark shadow-md transition hover:bg-brand-lime/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="h-4 w-4" />
                <span>On the Way</span>
              </button>
            ) : null}

            {["SCHEDULED", "EN_ROUTE", "PAUSED", "ISSUE"].includes(job.status) ? (
              <button
                disabled={statusLoading}
                onClick={() => setStatus("IN_PROGRESS")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green py-3 px-4 text-xs font-extrabold text-white shadow-md transition hover:bg-brand-green/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start / Resume</span>
              </button>
            ) : null}

            {job.status === "IN_PROGRESS" ? (
              <button
                disabled={statusLoading}
                onClick={() => setStatus("PAUSED")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white py-3 px-4 text-xs font-extrabold text-brand-dark shadow-sm transition hover:bg-[#F4FAF5]"
              >
                <Pause className="h-4 w-4" />
                <span>Pause Job</span>
              </button>
            ) : null}

            {["IN_PROGRESS", "ISSUE"].includes(job.status) ? (
              <button
                disabled={statusLoading}
                onClick={() => setStatus("COMPLETED")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0C3629] py-3 px-4 text-xs font-extrabold text-brand-lime shadow-md transition hover:bg-[#0C3629]/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Complete Job</span>
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Customer & Access Instructions (if present) */}
      {job.customerInstructions ? (
        <section className="rounded-3xl border border-amber-300/40 bg-amber-50/60 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
            <KeyRound className="h-4 w-4 text-amber-700" />
            <span>Customer & Access Instructions</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-amber-950 font-medium">
            {job.customerInstructions}
          </p>
        </section>
      ) : null}

      {/* Service Scope Checklist */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">
              Quality Assurance
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-brand-dark">
              Service Checklist
            </h2>
          </div>
          <span className="rounded-full bg-brand-green/10 px-3.5 py-1 text-xs font-extrabold text-brand-green">
            {progress}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F4FAF5]">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Items */}
        <div className="mt-6 space-y-2.5">
          {job.checklist.map((item) => (
            <label
              key={item.key}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                item.completed
                  ? "border-brand-green/20 bg-brand-green/5"
                  : "border-border bg-white hover:border-brand-green/30"
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded accent-brand-green text-brand-green focus:ring-brand-green"
                checked={item.completed}
                onChange={(e) =>
                  updateChecklist({
                    id: job._id,
                    key: item.key,
                    completed: e.target.checked,
                  })
                }
              />
              <span
                className={`text-sm font-semibold select-none ${
                  item.completed
                    ? "text-brand-green line-through"
                    : "text-brand-dark"
                }`}
              >
                {item.label}
              </span>
              {item.completed ? (
                <Check className="ml-auto h-4 w-4 text-brand-green shrink-0 stroke-[2.5]" />
              ) : null}
            </label>
          ))}
        </div>
      </section>

      {/* Before & After Photo Evidence */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-brand-green" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
            Before & After Photo Evidence
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Capture room conditions upon arrival and after completion for quality verification.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3.5">
          <UploadButton
            label="Upload Before Photo"
            uploading={uploading}
            onChange={(e) => uploadEvidence(e, "BEFORE")}
          />
          <UploadButton
            label="Upload After Photo"
            uploading={uploading}
            onChange={(e) => uploadEvidence(e, "AFTER")}
          />
        </div>

        {job.photos.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {job.photos.map((photo) => (
              <figure
                key={photo.key}
                className="relative overflow-hidden rounded-2xl border border-border bg-[#F4FAF5] shadow-sm"
              >
                <img
                  src={photo.url}
                  alt={`${photo.type.toLowerCase()} cleaning evidence`}
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="absolute bottom-2 left-2 rounded-full bg-brand-dark/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-lime backdrop-blur-sm">
                  {photo.type}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </section>

      {/* Issues & Escalations */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
            Reported Issues
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {job.issues.map((issue) => (
            <article
              key={issue.key}
              className={`rounded-2xl border p-4 ${
                issue.status === "OPEN"
                  ? "border-amber-200 bg-amber-50/70"
                  : "border-brand-green/20 bg-brand-green/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-brand-dark">
                    {issue.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {issue.description}
                  </p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase border border-border">
                  {issue.severity}
                </span>
              </div>
              {issue.status === "OPEN" ? (
                <button
                  onClick={async () => {
                    const resolution = window.prompt("Resolution note");
                    if (resolution)
                      await resolveIssue({
                        id: job._id,
                        issueKey: issue.key,
                        resolution,
                      });
                  }}
                  className="mt-3 inline-flex items-center rounded-full bg-white border border-border px-3.5 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-[#F4FAF5]"
                >
                  Mark as Resolved
                </button>
              ) : (
                <p className="mt-2 text-xs font-bold text-brand-green">
                  Resolved · {issue.resolution}
                </p>
              )}
            </article>
          ))}
        </div>

        {active ? (
          <form
            onSubmit={submitIssue}
            className="mt-5 space-y-3 rounded-2xl border border-dashed border-border bg-[#F4FAF5]/50 p-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Report an Issue or Delay
            </span>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-medium text-brand-dark focus:border-brand-green focus:outline-none"
              placeholder="Brief summary (e.g. Access gate locked)"
            />
            <textarea
              name="description"
              required
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-medium text-brand-dark min-h-[60px] focus:border-brand-green focus:outline-none"
              placeholder="What happened? What assistance is needed?"
            />
            <div className="flex gap-2">
              <select
                name="severity"
                defaultValue="MEDIUM"
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-brand-dark focus:border-brand-green focus:outline-none"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>URGENT</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Submit Issue</span>
              </button>
            </div>
          </form>
        ) : null}
      </section>

      {/* Internal Team Notes */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-brand-green" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
            Internal Team Notes
          </h2>
        </div>

        <div className="mt-4 space-y-2.5">
          {job.internalNotes.map((note, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#F4FAF5] p-3.5 text-xs text-brand-dark"
            >
              <p className="leading-relaxed font-medium">{note.text}</p>
              <div className="mt-1 text-[10px] text-muted-foreground">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submitNote} className="mt-4 flex gap-2">
          <input
            name="text"
            className="flex-1 rounded-full border border-border bg-[#F4FAF5]/50 px-4 py-2.5 text-xs font-medium text-brand-dark placeholder:text-muted-foreground focus:border-brand-green focus:bg-white focus:outline-none"
            placeholder="Add note for team & dispatcher…"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-brand-green/90 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Post</span>
          </button>
        </form>
      </section>
    </div>
  );
}

function UploadButton({
  label,
  uploading,
  onChange,
}: {
  label: string;
  uploading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-green/30 bg-[#F4FAF5] p-5 text-xs font-extrabold text-brand-green transition hover:border-brand-green hover:bg-brand-green/10">
      <input
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        disabled={uploading}
        onChange={onChange}
      />
      {uploading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Upload className="h-5 w-5" />
      )}
      <span>{label}</span>
    </label>
  );
}
