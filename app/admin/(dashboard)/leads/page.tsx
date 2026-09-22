"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Columns3,
  Download,
  Filter,
  List,
  Loader2,
  Plus,
  Search,
  Upload,
  UserRoundSearch,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  useCreateLeadMutation,
  useGetLeadBoardQuery,
  useGetLeadOwnersQuery,
  useGetLeadsQuery,
  useGetPipelineQuery,
  useImportLeadsMutation,
  useUpdateLeadMutation,
} from "@/src/redux/features/crm/crmApi";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STAGE_LABELS,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/src/redux/features/crm/types";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { LeadSourceBadge, LeadStatusBadge, money } from "@/src/components/Admin/CRM/LeadStatus";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/src/components/ui/form-field";

const stages = Object.keys(LEAD_STAGE_LABELS) as LeadStatus[];
const sources = Object.keys(LEAD_SOURCE_LABELS) as LeadSource[];

function ownerName(lead: Lead) {
  return typeof lead.ownerId === "object" ? lead.ownerId?.name : "Unassigned";
}

function csvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function downloadImportTemplate() {
  const csv = [
    "name,email,phone,requestedServiceName,value,tags,notes,referral",
    'Jane Doe,jane@example.com,+12025550123,Deep Cleaning,240,"vip;spring","Asked for a Friday visit",',
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "bio-cleaning-lead-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminLeadsPage() {
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "MANUAL" as LeadSource,
    requestedServiceName: "",
    value: "",
    ownerId: "",
    tags: "",
    notes: "",
    referredBy: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const boardQuery = useGetLeadBoardQuery(
    ownerId ? { ownerId } : undefined,
    { skip: view !== "pipeline" }
  );
  const pipelineQuery = useGetPipelineQuery(ownerId ? { ownerId } : undefined);
  const listQuery = useGetLeadsQuery(
    {
      page,
      limit: 25,
      search: search || undefined,
      status: status || undefined,
      source: source || undefined,
      ownerId: ownerId || undefined,
    },
    { skip: view !== "list" }
  );
  const ownersQuery = useGetLeadOwnersQuery();
  const [createLead, createState] = useCreateLeadMutation();
  const [updateLead, updateState] = useUpdateLeadMutation();
  const [importLeads, importState] = useImportLeadsMutation();

  const pipeline = pipelineQuery.data?.data;
  const totalLeads =
    pipeline?.stages.reduce((sum, stage) => sum + stage.count, 0) || 0;
  const wonValue = pipeline?.stages.find((item) => item.status === "WON")?.value || 0;
  const list = listQuery.data?.data || [];
  const board = boardQuery.data?.data;
  const meta = listQuery.data?.meta;

  const ownerOptions = ownersQuery.data?.data || [];
  const importBusy = importState.isLoading;

  const resetForm = () =>
    setForm({
      name: "",
      email: "",
      phone: "",
      source: "MANUAL",
      requestedServiceName: "",
      value: "",
      ownerId: "",
      tags: "",
      notes: "",
      referredBy: "",
    });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setFeedback("");
    try {
      await createLead({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        source: form.source,
        requestedServiceName: form.requestedServiceName || undefined,
        value: Number(form.value || 0),
        ownerId: form.ownerId || undefined,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        notes: form.notes || undefined,
        referral:
          form.source === "REFERRAL" && form.referredBy
            ? { referredBy: form.referredBy }
            : undefined,
      }).unwrap();
      resetForm();
      setCreateOpen(false);
      setFeedback("Lead created and added to the sales pipeline.");
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The lead could not be created.");
    }
  };

  const handleStageChange = async (lead: Lead, next: LeadStatus) => {
    if (next === lead.status || updateState.isLoading) return;
    setError("");
    try {
      await updateLead({ id: lead._id, body: { status: next } }).unwrap();
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The pipeline stage could not be changed.");
    }
  };

  const handleImport = async (file: File) => {
    setError("");
    setFeedback("");
    const text = await file.text();
    const rows = csvRows(text);
    if (rows.length < 2) {
      setError("The CSV needs a header row and at least one lead.");
      return;
    }
    const headers = rows[0].map((value) => value.trim().toLowerCase());
    const requiredName = headers.indexOf("name");
    if (requiredName === -1) {
      setError("The CSV must include a name column.");
      return;
    }
    const get = (row: string[], key: string) => {
      const index = headers.indexOf(key.toLowerCase());
      return index >= 0 ? String(row[index] || "").trim() : "";
    };
    const payload = rows
      .slice(1)
      .map((row) => ({
        name: get(row, "name"),
        email: get(row, "email") || undefined,
        phone: get(row, "phone") || undefined,
        requestedServiceName:
          get(row, "requestedservicename") || get(row, "service") || undefined,
        value: Number(get(row, "value") || 0),
        tags: (get(row, "tags") || "")
          .split(/[;,]/)
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes: get(row, "notes") || undefined,
        referral: get(row, "referral")
          ? { referredBy: get(row, "referral") }
          : undefined,
        source: "IMPORT" as LeadSource,
      }))
      .filter((row) => row.name && (row.email || row.phone));

    if (!payload.length) {
      setError("No importable rows were found. Each lead needs a name and an email or phone.");
      return;
    }
    try {
      const totals = { imported: 0, merged: 0, failed: 0 };
      for (let start = 0; start < payload.length; start += 500) {
        const chunk = payload.slice(start, start + 500);
        const result = await importLeads({ leads: chunk }).unwrap();
        totals.imported += result.data.imported;
        totals.merged += result.data.merged;
        totals.failed += result.data.failed;
      }
      setFeedback(
        `Import complete: ${totals.imported} new, ${totals.merged} merged, ${totals.failed} failed.`
      );
      setImportOpen(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch (requestError: any) {
      setError(
        requestError?.data?.message ||
          "The lead import failed. Completed batches remain safely imported."
      );
    }
  };

  if (pipelineQuery.isLoading) return <LoadingState label="Loading the sales pipeline…" />;
  if (pipelineQuery.isError)
    return (
      <ErrorState
        title="CRM is unavailable"
        description="The lead pipeline could not be loaded."
        action={
          <button className="btn-secondary" onClick={() => pipelineQuery.refetch()}>
            Try again
          </button>
        }
      />
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sales & Inquiries</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark">
            Leads & Pipeline
          </h1>
          <p className="mt-1 max-w-3xl text-xs sm:text-sm text-muted-foreground">
            Track inquiries, assign staff owners, schedule follow-ups, and convert leads into verified customer bookings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/leads/follow-ups"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-extrabold text-brand-dark shadow-xs hover:border-brand-green/40 hover:bg-[#F4FAF5] transition"
          >
            <UserRoundSearch className="h-4 w-4 text-brand-green" />
            <span>Follow-ups Queue</span>
          </Link>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-extrabold text-brand-dark shadow-xs hover:border-brand-green/40 hover:bg-[#F4FAF5] transition"
          >
            <Upload className="h-4 w-4 text-brand-green" />
            <span>Import CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-5 py-2.5 text-xs font-extrabold text-brand-dark shadow-md hover:bg-brand-lime/90 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </section>

      {feedback ? (
        <div
          className="rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4 text-xs font-bold text-brand-green"
          role="status"
        >
          {feedback}
        </div>
      ) : null}
      {error ? (
        <div
          className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-bold text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* KPI Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Leads", totalLeads.toLocaleString(), "Across all stages"],
          ["Open Pipeline", pipeline?.openLeads.toLocaleString() || "0", money(pipeline?.openValue)],
          ["Won Conversions", money(wonValue), `${pipeline?.stages.find((item) => item.status === "WON")?.count || 0} converted`],
          ["Pending Follow-ups", String(pipeline?.stages.find((item) => item.status === "FOLLOW_UP")?.count || 0), "Requires next action"],
        ].map(([label, value, detail]) => (
          <article
            key={label}
            className="rounded-3xl border border-brand-green/10 bg-white p-6 shadow-sm transition hover:border-brand-green/30"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-brand-dark">
              {value}
            </p>
            <p className="mt-1 text-xs font-bold text-brand-green">{detail}</p>
          </article>
        ))}
      </section>

      {/* Controls: View Switcher & Filters */}
      <section className="rounded-3xl border border-brand-green/10 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-fit items-center rounded-full border border-border bg-[#F4FAF5] p-1">
            <button
              type="button"
              onClick={() => setView("pipeline")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                view === "pipeline"
                  ? "bg-[#0C3629] text-brand-lime shadow-sm"
                  : "text-muted-foreground hover:text-brand-dark"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" /> Pipeline Board
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold transition-all ${
                view === "list"
                  ? "bg-[#0C3629] text-brand-lime shadow-sm"
                  : "text-muted-foreground hover:text-brand-dark"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List View
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:flex">
            {view === "list" ? (
              <label className="relative min-w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-2xl border border-border bg-[#F4FAF5]/50 pl-10 pr-4 py-2 text-xs font-medium text-brand-dark focus:border-brand-green focus:bg-white focus:outline-none"
                  placeholder="Search name, email, phone…"
                />
              </label>
            ) : null}

            <select
              value={ownerId}
              onChange={(event) => {
                setOwnerId(event.target.value);
                setPage(1);
              }}
              className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-dark focus:border-brand-green focus:outline-none"
            >
              <option value="">All Owners</option>
              {ownerOptions.map((owner) => (
                <option key={owner._id} value={owner._id}>
                  {owner.name}
                </option>
              ))}
            </select>

            {view === "list" ? (
              <>
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-dark focus:border-brand-green focus:outline-none"
                >
                  <option value="">All Stages</option>
                  {stages.map((item) => (
                    <option value={item} key={item}>
                      {LEAD_STAGE_LABELS[item]}
                    </option>
                  ))}
                </select>

                <select
                  value={source}
                  onChange={(event) => {
                    setSource(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-dark focus:border-brand-green focus:outline-none"
                >
                  <option value="">All Sources</option>
                  {sources.map((item) => (
                    <option value={item} key={item}>
                      {LEAD_SOURCE_LABELS[item]}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Board View or List View */}
      {view === "pipeline" ? (
        boardQuery.isLoading ? (
          <LoadingState label="Building the pipeline board…" />
        ) : boardQuery.isError ? (
          <ErrorState
            title="Pipeline board unavailable"
            description="Try refreshing the pipeline view."
          />
        ) : (
          <section
            className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            aria-label="Lead pipeline board"
          >
            <div className="grid min-w-[1540px] grid-cols-7 gap-3.5">
              {stages.map((stage) => {
                const column = board?.stages.find((item) => item.status === stage);
                const stageSummary = pipeline?.stages.find(
                  (item) => item.status === stage
                );
                return (
                  <div
                    key={stage}
                    className="rounded-3xl border border-brand-green/10 bg-[#F4FAF5] p-3.5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 px-1 py-2 border-b border-brand-green/10 mb-2">
                      <div>
                        <p className="text-xs font-extrabold text-brand-dark">
                          {LEAD_STAGE_LABELS[stage]}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold text-muted-foreground">
                          {money(stageSummary?.value)}
                        </p>
                      </div>
                      <span className="grid min-w-7 place-items-center rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-brand-dark shadow-xs border border-brand-green/10">
                        {column?.total || 0}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {(column?.items || []).map((lead) => (
                        <article
                          key={lead._id}
                          className="rounded-2xl border border-brand-green/10 bg-white p-3.5 shadow-xs transition hover:border-brand-green hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <LeadSourceBadge source={lead.source} />
                            <span className="text-xs font-black text-brand-dark">
                              {money(lead.value)}
                            </span>
                          </div>

                          <Link
                            href={`/admin/leads/${lead._id}`}
                            className="mt-2.5 block text-sm font-extrabold text-brand-dark hover:text-brand-green transition-colors"
                          >
                            {lead.name}
                          </Link>

                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {lead.requestedServiceName ||
                              lead.email ||
                              lead.phone ||
                              "General inquiry"}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/70 pt-2 text-[10px]">
                            <span className="truncate font-semibold text-muted-foreground">
                              {ownerName(lead)}
                            </span>
                            <select
                              aria-label={`Move ${lead.name} to stage`}
                              value={lead.status}
                              onChange={(event) =>
                                handleStageChange(lead, event.target.value as LeadStatus)
                              }
                              className="rounded-full border border-border bg-[#F4FAF5] px-2 py-0.5 font-bold text-brand-dark outline-none focus:border-brand-green"
                            >
                              {stages.map((item) => (
                                <option key={item} value={item}>
                                  {LEAD_STAGE_LABELS[item]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </article>
                      ))}

                      {(column?.total || 0) > (column?.items.length || 0) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setView("list");
                            setStatus(stage);
                          }}
                          className="w-full rounded-2xl border border-dashed border-border bg-white/60 px-3 py-2 text-xs font-bold text-muted-foreground hover:border-brand-green hover:text-brand-green transition"
                        >
                          View all {column?.total} leads
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )
      ) : listQuery.isLoading ? (
        <LoadingState label="Loading leads…" />
      ) : listQuery.isError ? (
        <ErrorState
          title="Lead list unavailable"
          description="The filtered list could not be loaded."
        />
      ) : list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-12 text-center">
          <EmptyState
            icon={Filter}
            title="No matching leads"
            description="Adjust your search filters or record a new lead."
            action={
              <button className="btn-primary mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Add Lead
              </button>
            }
          />
        </div>
      ) : (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-brand-green/10 bg-white shadow-sm hidden lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-brand-green/10 bg-[#F4FAF5] text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Next Follow-up</th>
                  <th className="px-6 py-4 text-right">Value</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((lead) => (
                  <tr key={lead._id} className="hover:bg-[#F4FAF5]/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      <div className="text-sm font-extrabold">{lead.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {lead.email || lead.phone || "No direct contact"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4">
                      <LeadSourceBadge source={lead.source} />
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brand-dark">
                      {lead.requestedServiceName || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {ownerName(lead)}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {lead.nextFollowUpAt
                        ? new Date(lead.nextFollowUpAt).toLocaleString()
                        : "Not scheduled"}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-brand-dark">
                      {money(lead.value)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-extrabold text-brand-dark hover:border-brand-green hover:text-brand-green shadow-xs transition"
                        href={`/admin/leads/${lead._id}`}
                      >
                        <span>Open</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 ? (
            <nav
              className="rounded-3xl border border-brand-green/10 bg-white flex items-center justify-between p-4 shadow-xs"
              aria-label="Lead pagination"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                Page <span className="font-extrabold text-brand-dark">{meta.page}</span> of{" "}
                <span className="font-extrabold text-brand-dark">{meta.totalPages}</span> ·{" "}
                {meta.total} total leads
              </p>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-extrabold text-brand-dark hover:bg-[#F4FAF5] disabled:opacity-40"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </button>
                <button
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-extrabold text-brand-dark hover:bg-[#F4FAF5] disabled:opacity-40"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))}
                >
                  Next
                </button>
              </div>
            </nav>
          ) : null}
        </section>
      )}

      {/* Add Lead Slideover Drawer */}
      <div
        className={`fixed inset-0 z-[75] ${
          createOpen ? "visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!createOpen}
      >
        <button
          type="button"
          aria-label="Close add lead drawer"
          onClick={() => setCreateOpen(false)}
          className={`absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity ${
            createOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            createOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Add lead"
        >
          {/* Drawer Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-green/10 bg-[#0C3629] p-6 text-white">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-lime/30 bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
                Opportunity
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">
                Add New Sales Lead
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="p-6 sm:p-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <FieldLabel>Full Name</FieldLabel>
                <TextInput
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label>
                <FieldLabel>Email Address</FieldLabel>
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label>
                <FieldLabel>Phone Number</FieldLabel>
                <TextInput
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>

              <label>
                <FieldLabel>Lead Source</FieldLabel>
                <SelectInput
                  value={form.source}
                  onChange={(e) =>
                    setForm({ ...form, source: e.target.value as LeadSource })
                  }
                >
                  {sources
                    .filter(
                      (item) =>
                        ![
                          "CONTACT",
                          "BOOKING_ABANDONMENT",
                          "ONLINE_BOOKING",
                          "IMPORT",
                        ].includes(item)
                    )
                    .map((item) => (
                      <option key={item} value={item}>
                        {LEAD_SOURCE_LABELS[item]}
                      </option>
                    ))}
                </SelectInput>
              </label>

              <label>
                <FieldLabel>Assigned Owner</FieldLabel>
                <SelectInput
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                >
                  <option value="">Assign to me / default</option>
                  {ownerOptions.map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name}
                    </option>
                  ))}
                </SelectInput>
              </label>

              <label>
                <FieldLabel>Requested Service</FieldLabel>
                <TextInput
                  value={form.requestedServiceName}
                  onChange={(e) =>
                    setForm({ ...form, requestedServiceName: e.target.value })
                  }
                  placeholder="Deep Cleaning, Move-In…"
                />
              </label>

              <label>
                <FieldLabel>Estimated Value ($)</FieldLabel>
                <TextInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </label>

              {form.source === "REFERRAL" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>Referred By</FieldLabel>
                  <TextInput
                    value={form.referredBy}
                    onChange={(e) => setForm({ ...form, referredBy: e.target.value })}
                  />
                </label>
              ) : null}

              <label className="sm:col-span-2">
                <FieldLabel>Tags (comma-separated)</FieldLabel>
                <TextInput
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="vip, move-in, commercial"
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Notes & Instructions</FieldLabel>
                <TextArea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
            </div>

            {!form.email && !form.phone ? (
              <p className="text-xs font-bold text-amber-700">
                Please enter at least an email address or phone number before saving.
              </p>
            ) : null}

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <button
                type="button"
                className="rounded-full border border-border bg-white px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-[#F4FAF5]"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createState.isLoading || (!form.email && !form.phone)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-2.5 text-xs font-extrabold text-brand-dark shadow-md hover:bg-brand-lime/90 disabled:opacity-50"
              >
                {createState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Save Lead</span>
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* Import CSV Modal */}
      <div
        className={`fixed inset-0 z-[75] ${
          importOpen ? "visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!importOpen}
      >
        <button
          type="button"
          aria-label="Close import dialog"
          onClick={() => setImportOpen(false)}
          className={`absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity ${
            importOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <section
          className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-3xl border border-brand-green/10 bg-white p-7 sm:p-8 shadow-2xl transition-all ${
            importOpen
              ? "-translate-y-1/2 opacity-100"
              : "-translate-y-[45%] opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Import leads"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
                Bulk Intake
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-brand-dark">
                Import CSV Leads
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Existing leads are merged by email or phone. Batches of 500 records are processed securely.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setImportOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-[#F4FAF5]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={downloadImportTemplate}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-[#F4FAF5] mt-5 shadow-xs"
          >
            <Download className="h-4 w-4 text-brand-green" />
            <span>Download CSV Template</span>
          </button>

          <label className="mt-5 grid min-h-40 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-brand-green/30 bg-[#F4FAF5]/70 p-6 text-center hover:border-brand-green hover:bg-[#F4FAF5] transition">
            {importBusy ? (
              <Loader2 className="h-7 w-7 animate-spin text-brand-green" />
            ) : (
              <Upload className="h-7 w-7 text-brand-green" />
            )}
            <span className="mt-3 block text-sm font-extrabold text-brand-dark">
              Upload Lead CSV File
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Required columns: name, and email or phone
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              disabled={importBusy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleImport(file);
              }}
            />
          </label>
        </section>
      </div>
    </div>
  );
}
