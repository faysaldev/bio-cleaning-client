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

  const boardQuery = useGetLeadBoardQuery(ownerId ? { ownerId } : undefined, { skip: view !== "pipeline" });
  const pipelineQuery = useGetPipelineQuery(ownerId ? { ownerId } : undefined);
  const listQuery = useGetLeadsQuery(
    { page, limit: 25, search: search || undefined, status: status || undefined, source: source || undefined, ownerId: ownerId || undefined },
    { skip: view !== "list" },
  );
  const ownersQuery = useGetLeadOwnersQuery();
  const [createLead, createState] = useCreateLeadMutation();
  const [updateLead, updateState] = useUpdateLeadMutation();
  const [importLeads, importState] = useImportLeadsMutation();

  const pipeline = pipelineQuery.data?.data;
  const totalLeads = pipeline?.stages.reduce((sum, stage) => sum + stage.count, 0) || 0;
  const wonValue = pipeline?.stages.find((item) => item.status === "WON")?.value || 0;
  const list = listQuery.data?.data || [];
  const board = boardQuery.data?.data;
  const meta = listQuery.data?.meta;

  const ownerOptions = ownersQuery.data?.data || [];
  const importBusy = importState.isLoading;

  const resetForm = () => setForm({ name: "", email: "", phone: "", source: "MANUAL", requestedServiceName: "", value: "", ownerId: "", tags: "", notes: "", referredBy: "" });

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
        referral: form.source === "REFERRAL" && form.referredBy ? { referredBy: form.referredBy } : undefined,
      }).unwrap();
      resetForm();
      setCreateOpen(false);
      setFeedback("Lead created and added to the pipeline.");
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
    const payload = rows.slice(1).map((row) => ({
      name: get(row, "name"),
      email: get(row, "email") || undefined,
      phone: get(row, "phone") || undefined,
      requestedServiceName: get(row, "requestedservicename") || get(row, "service") || undefined,
      value: Number(get(row, "value") || 0),
      tags: (get(row, "tags") || "").split(/[;,]/).map((tag) => tag.trim()).filter(Boolean),
      notes: get(row, "notes") || undefined,
      referral: get(row, "referral") ? { referredBy: get(row, "referral") } : undefined,
      source: "IMPORT",
    })).filter((row) => row.name && (row.email || row.phone));
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
      setFeedback(`Import complete: ${totals.imported} new, ${totals.merged} merged, ${totals.failed} failed.`);
      setImportOpen(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The lead import failed. Completed batches remain safely imported; retrying the file will merge them instead of duplicating them.");
    }
  };

  if (pipelineQuery.isLoading) return <LoadingState label="Loading the sales pipeline…" />;
  if (pipelineQuery.isError) return <ErrorState title="CRM is unavailable" description="The lead pipeline could not be loaded." action={<button className="btn-secondary" onClick={() => pipelineQuery.refetch()}>Try again</button>} />;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <span className="editorial-kicker">Sales workspace</span>
          <h1 className="admin-page-heading mt-3 text-brand-dark">Leads & pipeline</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Capture every inquiry, keep ownership clear, schedule the next action, and convert customers without duplicating their history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/leads/follow-ups" className="btn-secondary"><UserRoundSearch className="h-4 w-4" /> Follow-ups</Link>
          <button type="button" onClick={() => setImportOpen(true)} className="btn-secondary"><Upload className="h-4 w-4" /> Import CSV</button>
          <button type="button" onClick={() => setCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add lead</button>
        </div>
      </section>

      {feedback ? <div className="rounded-xl border border-brand-green/20 bg-brand-green/6 px-4 py-3 text-sm font-semibold text-brand-green" role="status">{feedback}</div> : null}
      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive" role="alert">{error}</div> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total leads", totalLeads.toLocaleString(), "Across every stage"],
          ["Open pipeline", pipeline?.openLeads.toLocaleString() || "0", money(pipeline?.openValue)],
          ["Won value", money(wonValue), `${pipeline?.stages.find((item) => item.status === "WON")?.count || 0} converted`],
          ["Follow-up", String(pipeline?.stages.find((item) => item.status === "FOLLOW_UP")?.count || 0), "Requires a next action"],
        ].map(([label, value, detail]) => (
          <article key={label} className="surface p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">{value}</p>
            <p className="mt-1 text-xs font-semibold text-brand-green">{detail}</p>
          </article>
        ))}
      </section>

      <section className="surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-fit items-center rounded-xl border border-border bg-brand-cream/60 p-1">
            <button type="button" onClick={() => setView("pipeline")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold ${view === "pipeline" ? "bg-brand-dark text-white" : "text-muted-foreground"}`}><Columns3 className="h-3.5 w-3.5" /> Pipeline</button>
            <button type="button" onClick={() => setView("list")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold ${view === "list" ? "bg-brand-dark text-white" : "text-muted-foreground"}`}><List className="h-3.5 w-3.5" /> List</button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:flex">
            {view === "list" ? (
              <label className="relative min-w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field-control pl-9" placeholder="Search name, email, phone…" />
              </label>
            ) : null}
            <select value={ownerId} onChange={(event) => { setOwnerId(event.target.value); setPage(1); }} className="field-control min-w-44">
              <option value="">All owners</option>
              {ownerOptions.map((owner) => <option key={owner._id} value={owner._id}>{owner.name}</option>)}
            </select>
            {view === "list" ? (
              <>
                <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="field-control min-w-44"><option value="">All stages</option>{stages.map((item) => <option value={item} key={item}>{LEAD_STAGE_LABELS[item]}</option>)}</select>
                <select value={source} onChange={(event) => { setSource(event.target.value); setPage(1); }} className="field-control min-w-44"><option value="">All sources</option>{sources.map((item) => <option value={item} key={item}>{LEAD_SOURCE_LABELS[item]}</option>)}</select>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {view === "pipeline" ? (
        boardQuery.isLoading ? <LoadingState label="Building the pipeline board…" /> : boardQuery.isError ? <ErrorState title="Pipeline board unavailable" description="Try refreshing the board." /> : (
          <section className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" aria-label="Lead pipeline board">
            <div className="grid min-w-[1480px] grid-cols-7 gap-3">
              {stages.map((stage) => {
                const column = board?.stages.find((item) => item.status === stage);
                const stageSummary = pipeline?.stages.find((item) => item.status === stage);
                return (
                  <div key={stage} className="rounded-2xl border border-border bg-brand-cream/45 p-2.5">
                    <div className="flex items-start justify-between gap-2 px-1 py-2">
                      <div><p className="text-xs font-extrabold text-brand-dark">{LEAD_STAGE_LABELS[stage]}</p><p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">{column?.total || 0} leads · {money(stageSummary?.value)}</p></div>
                      <span className="grid min-w-7 place-items-center rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold text-brand-dark shadow-sm">{column?.total || 0}</span>
                    </div>
                    <div className="mt-1 space-y-2">
                      {(column?.items || []).map((lead) => (
                        <article key={lead._id} className="rounded-xl border border-border bg-white p-3 shadow-[0_8px_22px_-20px_rgba(7,38,22,.5)]">
                          <div className="flex items-start justify-between gap-2"><LeadSourceBadge source={lead.source} /><span className="text-xs font-extrabold text-brand-dark">{money(lead.value)}</span></div>
                          <Link href={`/admin/leads/${lead._id}`} className="mt-3 block text-sm font-extrabold leading-5 text-brand-dark hover:text-brand-green">{lead.name}</Link>
                          <p className="mt-1 truncate text-[11px] text-muted-foreground">{lead.requestedServiceName || lead.email || lead.phone || "General inquiry"}</p>
                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/70 pt-2.5">
                            <span className="truncate text-[10px] font-semibold text-muted-foreground">{ownerName(lead)}</span>
                            <select aria-label={`Move ${lead.name} to stage`} value={lead.status} onChange={(event) => handleStageChange(lead, event.target.value as LeadStatus)} className="max-w-28 rounded-lg border border-border bg-brand-cream px-2 py-1 text-[10px] font-bold text-brand-dark outline-none focus:border-brand-green">
                              {stages.map((item) => <option key={item} value={item}>{LEAD_STAGE_LABELS[item]}</option>)}
                            </select>
                          </div>
                        </article>
                      ))}
                      {(column?.total || 0) > (column?.items.length || 0) ? <button type="button" onClick={() => { setView("list"); setStatus(stage); }} className="w-full rounded-xl border border-dashed border-border px-3 py-2 text-[11px] font-bold text-muted-foreground hover:border-brand-green/40 hover:text-brand-green">View all {column?.total}</button> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )
      ) : listQuery.isLoading ? <LoadingState label="Loading leads…" /> : listQuery.isError ? <ErrorState title="Lead list unavailable" description="The filtered list could not be loaded." /> : list.length === 0 ? <EmptyState icon={Filter} title="No matching leads" description="Adjust the filters or add a new lead." action={<button className="btn-primary" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add lead</button>} /> : (
        <section className="space-y-3">
          <div className="table-shell hidden overflow-x-auto lg:block">
            <table className="data-table min-w-[980px]">
              <thead><tr><th>Lead</th><th>Stage</th><th>Source</th><th>Service</th><th>Owner</th><th>Next follow-up</th><th className="text-right">Value</th><th /></tr></thead>
              <tbody>{list.map((lead) => <tr key={lead._id}>
                <td><div className="font-bold text-brand-dark">{lead.name}</div><div className="mt-1 text-[11px] text-muted-foreground">{lead.email || lead.phone || "No secondary contact"}</div></td>
                <td><LeadStatusBadge status={lead.status} /></td>
                <td><LeadSourceBadge source={lead.source} /></td>
                <td className="text-sm font-semibold text-brand-dark">{lead.requestedServiceName || "—"}</td>
                <td className="text-sm text-muted-foreground">{ownerName(lead)}</td>
                <td className="text-xs font-semibold text-muted-foreground">{lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString() : "Not scheduled"}</td>
                <td className="text-right text-sm font-extrabold text-brand-dark">{money(lead.value)}</td>
                <td className="text-right"><Link className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-[11px] font-extrabold text-brand-dark hover:border-brand-green/40 hover:text-brand-green" href={`/admin/leads/${lead._id}`}>Open <ArrowRight className="h-3 w-3" /></Link></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="space-y-3 lg:hidden">{list.map((lead) => <Link key={lead._id} href={`/admin/leads/${lead._id}`} className="surface block p-4"><div className="flex items-start justify-between gap-3"><div><LeadSourceBadge source={lead.source} /><h2 className="mt-2 font-extrabold text-brand-dark">{lead.name}</h2><p className="mt-1 text-xs text-muted-foreground">{lead.requestedServiceName || lead.email || lead.phone}</p></div><p className="font-extrabold text-brand-dark">{money(lead.value)}</p></div><div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3"><LeadStatusBadge status={lead.status} /><span className="text-[11px] font-semibold text-muted-foreground">{ownerName(lead)}</span></div></Link>)}</div>
          {meta && meta.totalPages > 1 ? <nav className="surface flex items-center justify-between p-3"><p className="text-xs font-semibold text-muted-foreground">Page {meta.page} of {meta.totalPages} · {meta.total} leads</p><div className="flex gap-2"><button className="btn-secondary px-3" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><button className="btn-secondary px-3" disabled={page >= meta.totalPages} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))}>Next</button></div></nav> : null}
        </section>
      )}

      <div className={`fixed inset-0 z-[75] ${createOpen ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!createOpen}>
        <button type="button" aria-label="Close add lead drawer" onClick={() => setCreateOpen(false)} className={`absolute inset-0 bg-brand-dark/45 backdrop-blur-[2px] transition-opacity ${createOpen ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-white shadow-elevated transition-transform ${createOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Add lead">
          <form onSubmit={handleCreate} className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><span className="editorial-kicker">New opportunity</span><h2 className="mt-3 text-2xl font-extrabold text-brand-dark">Add a lead</h2><p className="mt-1 text-sm text-muted-foreground">Phone, referral, manual and other sales opportunities all enter the same pipeline.</p></div><button type="button" onClick={() => setCreateOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-border"><X className="h-4 w-4" /></button></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><FieldLabel>Name</FieldLabel><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label><FieldLabel>Email</FieldLabel><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label><FieldLabel>Phone</FieldLabel><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label><FieldLabel>Source</FieldLabel><SelectInput value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>{sources.filter((item) => !["CONTACT", "BOOKING_ABANDONMENT", "ONLINE_BOOKING", "IMPORT"].includes(item)).map((item) => <option key={item} value={item}>{LEAD_SOURCE_LABELS[item]}</option>)}</SelectInput></label>
              <label><FieldLabel>Owner</FieldLabel><SelectInput value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}><option value="">Assign to me / default</option>{ownerOptions.map((owner) => <option key={owner._id} value={owner._id}>{owner.name}</option>)}</SelectInput></label>
              <label><FieldLabel>Requested service</FieldLabel><TextInput value={form.requestedServiceName} onChange={(e) => setForm({ ...form, requestedServiceName: e.target.value })} placeholder="Deep cleaning" /></label>
              <label><FieldLabel>Estimated value</FieldLabel><TextInput type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></label>
              {form.source === "REFERRAL" ? <label className="sm:col-span-2"><FieldLabel>Referred by</FieldLabel><TextInput value={form.referredBy} onChange={(e) => setForm({ ...form, referredBy: e.target.value })} /></label> : null}
              <label className="sm:col-span-2"><FieldLabel>Tags</FieldLabel><TextInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, move-in, commercial" /></label>
              <label className="sm:col-span-2"><FieldLabel>Notes</FieldLabel><TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>
            {!form.email && !form.phone ? <p className="mt-3 text-xs font-semibold text-amber-700">Add an email or phone before saving.</p> : null}
            <div className="mt-7 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit" disabled={createState.isLoading || (!form.email && !form.phone)} className="btn-primary">{createState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add lead</button></div>
          </form>
        </aside>
      </div>

      <div className={`fixed inset-0 z-[75] ${importOpen ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!importOpen}>
        <button type="button" aria-label="Close import dialog" onClick={() => setImportOpen(false)} className={`absolute inset-0 bg-brand-dark/45 backdrop-blur-[2px] transition-opacity ${importOpen ? "opacity-100" : "opacity-0"}`} />
        <section className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-white p-6 shadow-elevated transition-all ${importOpen ? "-translate-y-1/2 opacity-100" : "-translate-y-[45%] opacity-0"}`} role="dialog" aria-modal="true" aria-label="Import leads">
          <div className="flex items-start justify-between gap-4"><div><span className="editorial-kicker">Bulk intake</span><h2 className="mt-3 text-2xl font-extrabold text-brand-dark">Import CSV leads</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Existing open leads are merged by email or phone instead of duplicated. Large files are processed safely in batches of 500 rows.</p></div><button type="button" onClick={() => setImportOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border"><X className="h-4 w-4" /></button></div>
          <button type="button" onClick={downloadImportTemplate} className="btn-secondary mt-5"><Download className="h-4 w-4" /> Download template</button>
          <label className="mt-5 grid min-h-40 cursor-pointer place-items-center rounded-xl border border-dashed border-brand-green/35 bg-brand-green/5 p-6 text-center hover:bg-brand-green/8">
            {importBusy ? <Loader2 className="h-6 w-6 animate-spin text-brand-green" /> : <Upload className="h-6 w-6 text-brand-green" />}
            <span className="mt-3 block text-sm font-extrabold text-brand-dark">Choose a CSV file</span><span className="mt-1 block text-xs text-muted-foreground">Required: name + email or phone</span>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" disabled={importBusy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); }} />
          </label>
        </section>
      </div>
    </div>
  );
}
