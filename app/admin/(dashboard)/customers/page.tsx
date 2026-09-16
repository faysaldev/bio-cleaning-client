"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Plus, Search, UserRound, X } from "lucide-react";
import { useCreateCustomerMutation, useGetCustomersQuery } from "@/src/redux/features/crm/crmApi";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { FieldLabel, SelectInput, TextInput } from "@/src/components/ui/form-field";
import { money } from "@/src/components/Admin/CRM/LeadStatus";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", line1: "", city: "", state: "", zip: "", tags: "" });
  const query = useGetCustomersQuery({ page, limit: 25, search: search || undefined, status: status || undefined });
  const [createCustomer, createState] = useCreateCustomerMutation();
  const customers = query.data?.data || [];
  const meta = query.data?.meta;

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await createCustomer({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        addresses: form.line1 && form.city && form.zip ? [{ line1: form.line1, city: form.city, state: form.state || undefined, zip: form.zip, isPrimary: true }] : [],
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        createdSource: "MANUAL",
      }).unwrap();
      setForm({ name: "", email: "", phone: "", line1: "", city: "", state: "", zip: "", tags: "" });
      setOpen(false);
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The customer could not be created.");
    }
  };

  if (query.isLoading) return <LoadingState label="Loading customer records…" />;
  if (query.isError) return <ErrorState title="Customers are unavailable" description="The customer directory could not be loaded." action={<button className="btn-secondary" onClick={() => query.refetch()}>Try again</button>} />;

  return <div className="space-y-6">
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><span className="editorial-kicker">Customer CRM</span><h1 className="admin-page-heading mt-3 text-brand-dark">Customers</h1><p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">One record for every customer relationship, including addresses, bookings, preferences, financial context, reviews and linked sales history.</p></div><button type="button" className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add customer</button></section>
    {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive">{error}</div> : null}
    <section className="surface p-3 sm:p-4"><div className="grid gap-2 sm:grid-cols-[1fr_180px]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className="field-control pl-9" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, phone or tag…" /></label><select className="field-control" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">All customers</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></div></section>
    {customers.length === 0 ? <EmptyState icon={UserRound} title="No matching customers" description="Customers are automatically created when leads convert or bookings are placed. You can also add one manually." action={<button className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add customer</button>} /> : <>
      <div className="table-shell hidden overflow-x-auto lg:block"><table className="data-table min-w-[940px]"><thead><tr><th>Customer</th><th>Primary location</th><th>Bookings</th><th>Completed</th><th>Next work</th><th className="text-right">Lifetime value</th><th /></tr></thead><tbody>{customers.map((customer) => { const primary = customer.addresses?.find((address) => address.isPrimary) || customer.addresses?.[0]; return <tr key={customer._id}><td><div className="font-extrabold text-brand-dark">{customer.name}</div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">{customer.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span> : null}{customer.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span> : null}</div></td><td className="text-sm text-brand-dark">{primary ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-green" />{primary.city}{primary.state ? `, ${primary.state}` : ""}</span> : "—"}</td><td className="text-sm font-bold text-brand-dark">{customer.summary?.bookings || 0}</td><td className="text-sm font-bold text-brand-dark">{customer.summary?.completed || 0}</td><td className="text-xs font-semibold text-muted-foreground">{customer.summary?.nextBookingAt ? new Date(customer.summary.nextBookingAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "None scheduled"}</td><td className="text-right text-sm font-extrabold text-brand-dark">{money(customer.summary?.lifetimeValue)}</td><td className="text-right"><Link href={`/admin/customers/${customer._id}`} className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-[11px] font-extrabold text-brand-dark hover:border-brand-green/40 hover:text-brand-green">Open <ArrowRight className="h-3 w-3" /></Link></td></tr>; })}</tbody></table></div>
      <div className="space-y-3 lg:hidden">{customers.map((customer) => <Link key={customer._id} href={`/admin/customers/${customer._id}`} className="surface block p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-extrabold text-brand-dark">{customer.name}</h2><p className="mt-1 text-xs text-muted-foreground">{customer.email || customer.phone || "No contact method"}</p></div><p className="text-sm font-extrabold text-brand-dark">{money(customer.summary?.lifetimeValue)}</p></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center"><div><p className="text-lg font-extrabold text-brand-dark">{customer.summary?.bookings || 0}</p><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Bookings</p></div><div><p className="text-lg font-extrabold text-brand-dark">{customer.summary?.completed || 0}</p><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Done</p></div><div><p className="text-lg font-extrabold text-brand-dark">{customer.tags?.length || 0}</p><p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Tags</p></div></div></Link>)}</div>
    </>}
    {meta && meta.totalPages > 1 ? <nav className="surface flex items-center justify-between p-3"><p className="text-xs font-semibold text-muted-foreground">Page {meta.page} of {meta.totalPages} · {meta.total} customers</p><div className="flex gap-2"><button className="btn-secondary px-3" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><button className="btn-secondary px-3" disabled={page >= meta.totalPages} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))}>Next</button></div></nav> : null}

    <div className={`fixed inset-0 z-[75] ${open ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!open}><button type="button" aria-label="Close customer drawer" onClick={() => setOpen(false)} className={`absolute inset-0 bg-brand-dark/45 backdrop-blur-[2px] transition-opacity ${open ? "opacity-100" : "opacity-0"}`} /><aside className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-white shadow-elevated transition-transform ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Add customer"><form className="p-5 sm:p-7" onSubmit={create}><div className="flex items-start justify-between gap-4"><div><span className="editorial-kicker">Customer record</span><h2 className="mt-3 text-2xl font-extrabold text-brand-dark">Add customer</h2><p className="mt-1 text-sm text-muted-foreground">Use this for existing customers who did not originate from a lead or online booking.</p></div><button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-border"><X className="h-4 w-4" /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><FieldLabel>Name</FieldLabel><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label><FieldLabel>Email</FieldLabel><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label><FieldLabel>Phone</FieldLabel><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label className="sm:col-span-2"><FieldLabel>Address</FieldLabel><TextInput value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></label><label><FieldLabel>City</FieldLabel><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label><label><FieldLabel>State</FieldLabel><TextInput value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></label><label><FieldLabel>ZIP</FieldLabel><TextInput value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} /></label><label><FieldLabel>Tags</FieldLabel><TextInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, recurring" /></label></div>{!form.email && !form.phone ? <p className="mt-3 text-xs font-semibold text-amber-700">Email or phone is required.</p> : null}<div className="mt-7 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" disabled={createState.isLoading || (!form.email && !form.phone)}><Plus className="h-4 w-4" /> Add customer</button></div></form></aside></div>
  </div>;
}
