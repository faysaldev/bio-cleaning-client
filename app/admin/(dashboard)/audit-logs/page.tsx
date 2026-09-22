"use client";

import { useState } from "react";
import {
  ShieldCheck,
  RotateCw,
  Lock,
  Terminal,
  Activity,
  ChevronLeft,
  ChevronRight,
  Database,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useGetAuditLogsQuery } from "@/src/redux/features/audit/auditApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const q = useGetAuditLogsQuery({ page, limit: 40 });

  if (q.isLoading && !q.data) {
    return <LoadingState label="Loading audit trail…" />;
  }

  if (q.isError) {
    return (
      <ErrorState
        action={
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C3629] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#124b3a] transition-colors"
            onClick={() => q.refetch()}
          >
            <RotateCw className="h-4 w-4" />
            Retry Audit Log Fetch
          </button>
        }
      />
    );
  }

  const data = q.data;
  const totalPages = data?.pagination.pages || 1;
  const totalCount = data?.pagination.total || 0;

  const getMethodBadgeClass = (method?: string) => {
    switch (method?.toUpperCase()) {
      case "POST":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "PUT":
      case "PATCH":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "GET":
        return "bg-sky-50 text-sky-800 border-sky-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (code?: number) => {
    if (!code) return <span className="text-slate-400">—</span>;
    if (code >= 200 && code < 300) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          {code}
        </span>
      );
    }
    if (code >= 400 && code < 500) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
          <AlertCircle className="h-3 w-3" />
          {code}
        </span>
      );
    }
    if (code >= 500) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
          <AlertCircle className="h-3 w-3" />
          {code}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
        {code}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Spruce Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#7CE337]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security & Compliance
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">System Audit Logs</h1>
            <p className="max-w-2xl text-sm text-emerald-100/80">
              Immutable, append-only mutation trail with correlated request identifiers. Tokens, credentials,
              passwords, and authorization headers are cryptographically redacted before storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => q.refetch()}
              disabled={q.isFetching}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 ${q.isFetching ? "animate-spin text-[#7CE337]" : ""}`} />
              Refresh Trail
            </button>
            <div className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-emerald-100">
              <span className="text-[#7CE337] font-bold">{totalCount}</span> Actions Logged
            </div>
          </div>
        </div>

        {/* Ambient Decorative Glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#124b3a] blur-2xl" />
      </div>

      {/* Security Architecture KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-950/60">Immutable Store</p>
            <p className="text-lg font-bold text-emerald-950">Append-Only Ledger</p>
            <p className="text-xs text-muted-foreground">Historical records cannot be modified or purged</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0C3629]/5 text-[#0C3629]">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-950/60">Sanitization Policy</p>
            <p className="text-lg font-bold text-emerald-950">Zero-Secret Redaction</p>
            <p className="text-xs text-muted-foreground">Auth headers & payload credentials automatically masked</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-50 text-[#0C3629]">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-950/60">Correlation Scope</p>
            <p className="text-lg font-bold text-emerald-950">Distributed Request IDs</p>
            <p className="text-xs text-muted-foreground">UUIDv4 tracking across gateway, DB, & client</p>
          </div>
        </div>
      </div>

      {/* Audit Log Table Shell */}
      <div className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-emerald-950/10 bg-[#F4FAF5] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-emerald-950">Mutation Activity Stream</h3>
            <span className="rounded-full bg-emerald-950/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-950">
              Page {page} of {totalPages}
            </span>
          </div>
          <div className="text-xs font-medium text-emerald-950/70">
            Showing up to 40 events per page
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-emerald-950/10 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-emerald-950/70">
              <tr>
                <th className="py-3.5 pl-6 pr-4">Timestamp</th>
                <th className="px-4 py-3.5">Actor & Role</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">HTTP Request</th>
                <th className="px-4 py-3.5">Target Entity</th>
                <th className="px-4 py-3.5">Response</th>
                <th className="py-3.5 pl-4 pr-6">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              {!data?.items || data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-emerald-900/30" />
                    No audit log records recorded yet.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-emerald-50/30">
                    <td className="py-4 pl-6 pr-4 whitespace-nowrap text-xs text-muted-foreground">
                      <div className="font-semibold text-emerald-950">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-bold text-emerald-950">
                        {item.actorEmail || item.actorId || "System Daemon"}
                      </p>
                      <div className="mt-1">
                        <span className="inline-block rounded-md bg-emerald-950/5 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
                          {item.actorRole || "SYSTEM"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-950 shadow-2xs">
                        <Terminal className="h-3 w-3 text-emerald-700" />
                        {item.action}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${getMethodBadgeClass(
                            item.method
                          )}`}
                        >
                          {item.method || "N/A"}
                        </span>
                        <span className="font-mono text-xs text-slate-700 max-w-[200px] truncate" title={item.path}>
                          {item.path || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-semibold text-emerald-950">{item.entityType || "—"}</span>
                      {item.entityId ? (
                        <span className="block font-mono text-[11px] text-muted-foreground" title={item.entityId}>
                          {item.entityId.length > 14
                            ? `${item.entityId.slice(0, 8)}...${item.entityId.slice(-6)}`
                            : item.entityId}
                        </span>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(item.statusCode)}
                    </td>

                    <td className="py-4 pl-4 pr-6 whitespace-nowrap">
                      {item.requestId ? (
                        <span
                          className="font-mono text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block max-w-[150px] truncate"
                          title={item.requestId}
                        >
                          {item.requestId}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-emerald-950/10 bg-[#F4FAF5] px-6 py-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-950/70">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            Showing page {page} of {totalPages} ({totalCount} total audited actions)
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-950/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-50/50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-950/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-50/50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!data || page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
