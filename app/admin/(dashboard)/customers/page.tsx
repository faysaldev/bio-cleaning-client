"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Plus, Search, UserRound, X, ChevronLeft, ChevronRight, Users } from "lucide-react";
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
  if (query.isError) {
    return (
      <ErrorState
        title="Customers are unavailable"
        description="The customer directory could not be loaded."
        action={
          <button className="btn-secondary rounded-full" onClick={() => query.refetch()}>
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Customer CRM
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Customers</h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
              One unified profile for every customer relationship, including addresses, past bookings, preferences, financial context, and linked sales history.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95 shrink-0"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add customer
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive">
          {error}
        </div>
      ) : null}

      {/* Filter and Search Bar */}
      <section className="rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-full border border-emerald-950/15 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-brand-dark placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, phone, or tag…"
            />
          </div>
          <select
            className="rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-medium text-brand-dark focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All customers</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </section>

      {customers.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No matching customers"
          description="Customers are automatically created when leads convert or bookings are placed. You can also add one manually."
          action={
            <button className="btn-primary rounded-full" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add customer
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-dark">
                <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Primary location</th>
                    <th className="px-6 py-4">Bookings</th>
                    <th className="px-6 py-4">Completed</th>
                    <th className="px-6 py-4">Next work</th>
                    <th className="px-6 py-4 text-right">Lifetime value</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/5">
                  {customers.map((customer) => {
                    const primary = customer.addresses?.find((address) => address.isPrimary) || customer.addresses?.[0];
                    return (
                      <tr key={customer._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-brand-dark">{customer.name}</div>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {customer.email ? (
                              <span className="inline-flex items-center gap-1">
                                <Mail className="h-3 w-3 text-emerald-700" />
                                {customer.email}
                              </span>
                            ) : null}
                            {customer.phone ? (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3 w-3 text-emerald-700" />
                                {customer.phone}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-dark">
                          {primary ? (
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                              {primary.city}
                              {primary.state ? `, ${primary.state}` : ""}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                          {customer.summary?.bookings || 0}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                          {customer.summary?.completed || 0}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                          {customer.summary?.nextBookingAt
                            ? new Date(customer.summary.nextBookingAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                            : "None scheduled"}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-extrabold text-brand-dark">
                          {money(customer.summary?.lifetimeValue)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/customers/${customer._id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            Open <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 lg:hidden">
            {customers.map((customer) => (
              <Link
                key={customer._id}
                href={`/admin/customers/${customer._id}`}
                className="block rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm hover:border-emerald-600/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold text-brand-dark">{customer.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {customer.email || customer.phone || "No contact method"}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-brand-dark">{money(customer.summary?.lifetimeValue)}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
                  <div>
                    <p className="text-base font-extrabold text-brand-dark">{customer.summary?.bookings || 0}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Bookings</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-brand-dark">{customer.summary?.completed || 0}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Done</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-brand-dark">{customer.tags?.length || 0}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Tags</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 ? (
        <nav className="flex items-center justify-between rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground">
            Page <span className="font-bold text-brand-dark">{meta.page}</span> of{" "}
            <span className="font-bold text-brand-dark">{meta.totalPages}</span> · {meta.total} customers
          </p>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))}
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      ) : null}

      {/* Slideover Modal: Add Customer */}
      <div className={`fixed inset-0 z-[75] ${open ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
        <button
          type="button"
          aria-label="Close customer drawer"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#0C3629]/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Add customer"
        >
          <form className="p-6 sm:p-8" onSubmit={create}>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Customer record</span>
                <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">Add customer</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use this for existing customers who did not originate from a lead or online booking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <FieldLabel>Name</FieldLabel>
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Email</FieldLabel>
                <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Phone</FieldLabel>
                <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Address</FieldLabel>
                <TextInput value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>City</FieldLabel>
                <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>State</FieldLabel>
                <TextInput value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>ZIP</FieldLabel>
                <TextInput value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Tags</FieldLabel>
                <TextInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, recurring" />
              </label>
            </div>

            {!form.email && !form.phone ? (
              <p className="mt-3 text-xs font-semibold text-amber-700">Email or phone is required.</p>
            ) : null}

            <div className="mt-8 flex justify-end gap-3 border-t border-border/60 pt-5">
              <button
                type="button"
                className="rounded-full border border-emerald-950/15 px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
                disabled={createState.isLoading || (!form.email && !form.phone)}
              >
                <Plus className="h-4 w-4" /> Add customer
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
