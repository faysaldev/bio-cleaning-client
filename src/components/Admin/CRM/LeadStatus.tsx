import { LEAD_SOURCE_LABELS, LEAD_STAGE_LABELS, type LeadSource, type LeadStatus } from "@/src/redux/features/crm/types";

const stageClass: Record<LeadStatus, string> = {
  NEW: "border-sky-200 bg-sky-50 text-sky-800",
  ATTEMPTED_CONTACT: "border-amber-200 bg-amber-50 text-amber-800",
  CONTACTED: "border-cyan-200 bg-cyan-50 text-cyan-800",
  ESTIMATE_QUOTE_SENT: "border-violet-200 bg-violet-50 text-violet-800",
  FOLLOW_UP: "border-orange-200 bg-orange-50 text-orange-800",
  WON: "border-emerald-200 bg-emerald-50 text-emerald-800",
  LOST: "border-slate-200 bg-slate-100 text-slate-600",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`status-badge ${stageClass[status]}`}>{LEAD_STAGE_LABELS[status]}</span>;
}

export function LeadSourceBadge({ source }: { source: LeadSource }) {
  return <span className="inline-flex rounded-lg border border-border bg-brand-cream/70 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">{LEAD_SOURCE_LABELS[source]}</span>;
}

export function money(value?: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value || 0));
}
