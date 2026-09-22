"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Edit3,
  FileText,
  Home,
  Mail,
  MapPin,
  NotebookPen,
  PawPrint,
  Phone,
  Plus,
  ReceiptText,
  Star,
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  useAddCustomerNoteMutation,
  useAddCustomerReviewMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} from "@/src/redux/features/crm/crmApi";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { money } from "@/src/components/Admin/CRM/LeadStatus";
import { FieldLabel, SelectInput, TextArea, TextInput } from "@/src/components/ui/form-field";
import type { CustomerAddress } from "@/src/redux/features/crm/types";

function fmt(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const query = useGetCustomerQuery(id);
  const [updateCustomer, updateState] = useUpdateCustomerMutation();
  const [addNote, noteState] = useAddCustomerNoteMutation();
  const [addReview, reviewState] = useAddCustomerReviewMutation();
  const [editOpen, setEditOpen] = useState(false);
  const [note, setNote] = useState("");
  const [review, setReview] = useState({ rating: "5", comment: "", source: "Internal" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const data = query.data?.data;
  const customer = data?.customer;
  const [edit, setEdit] = useState({
    name: "",
    email: "",
    phone: "",
    contactMethod: "EMAIL",
    preferredContactWindow: "",
    serviceNotes: "",
    accessInstructions: "",
    tags: "",
    status: "ACTIVE",
    addresses: [] as CustomerAddress[],
    pets: [] as Array<{ name?: string; type: string; notes?: string }>,
  });

  const upcoming = useMemo(() => data?.upcomingWork || [], [data?.upcomingWork]);

  if (query.isLoading) return <LoadingState label="Loading customer 360 profile…" />;
  if (query.isError || !data || !customer) {
    return (
      <ErrorState
        title="Customer not found"
        description="This customer record could not be loaded."
        action={
          <button className="btn-secondary rounded-full" onClick={() => router.push("/admin/customers")}>
            Back to customers
          </button>
        }
      />
    );
  }

  const openEdit = () => {
    setEdit({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      contactMethod: customer.preferences?.contactMethod || "EMAIL",
      preferredContactWindow: customer.preferences?.preferredContactWindow || "",
      serviceNotes: customer.preferences?.serviceNotes || "",
      accessInstructions: customer.accessInstructions || "",
      tags: customer.tags?.join(", ") || "",
      status: customer.status,
      addresses: (customer.addresses || []).map((address) => ({ ...address })),
      pets: (customer.pets || []).map((pet) => ({ name: pet.name, type: pet.type, notes: pet.notes })),
    });
    setEditOpen(true);
  };

  const saveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await updateCustomer({
        id,
        body: {
          name: edit.name,
          email: edit.email || "",
          phone: edit.phone || "",
          status: edit.status,
          preferences: {
            contactMethod: edit.contactMethod,
            preferredContactWindow: edit.preferredContactWindow || undefined,
            serviceNotes: edit.serviceNotes || undefined,
          },
          accessInstructions: edit.accessInstructions || undefined,
          tags: edit.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          addresses: edit.addresses,
          pets: edit.pets.filter((pet) => pet.type.trim()),
        },
      }).unwrap();
      setEditOpen(false);
      setNotice("Customer profile updated.");
    } catch (requestError: any) {
      setError(requestError?.data?.message || "Customer update failed.");
    }
  };

  const saveNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!note.trim()) return;
    setError("");
    try {
      await addNote({ id, body: note.trim() }).unwrap();
      setNote("");
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The note could not be saved.");
    }
  };

  const saveReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await addReview({
        id,
        body: { rating: Number(review.rating), comment: review.comment || undefined, source: review.source || undefined },
      }).unwrap();
      setReview({ rating: "5", comment: "", source: "Internal" });
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The review could not be added.");
    }
  };

  const primary = customer.addresses?.find((address) => address.isPrimary) || customer.addresses?.[0];

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to customers
            </Link>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-0.5 text-xs font-bold ${
                  customer.status === "ACTIVE"
                    ? "bg-[#7CE337] text-[#0C3629]"
                    : "bg-white/20 text-white"
                }`}
              >
                {customer.status}
              </span>
              {customer.createdSource ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
                  {customer.createdSource.replace(/_/g, " ")}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">{customer.name}</h1>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-emerald-100/80">
              {customer.email ? (
                <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1.5 hover:text-[#7CE337] transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  {customer.email}
                </a>
              ) : null}
              {customer.phone ? (
                <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#7CE337] transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </a>
              ) : null}
              {primary ? (
                <span className="inline-flex items-center gap-1.5 text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-[#7CE337]" />
                  {primary.city}
                  {primary.state ? `, ${primary.state}` : ""}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/admin/quotes?customerId=${id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2.5 text-xs font-bold text-[#0C3629] shadow-md transition-all hover:bg-[#8eed49] active:scale-95"
            >
              <FileText className="h-3.5 w-3.5" /> Create estimate
            </Link>
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#7CE337]" /> Edit profile
            </button>
          </div>
        </div>
      </section>

      {notice ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm" role="status">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900 shadow-sm" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Lifetime value</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{money(data.lifetimeValue)}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {data.completedBookings} completed booking{data.completedBookings === 1 ? "" : "s"}
          </p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Outstanding</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ReceiptText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{money(data.outstandingBalance)}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Open invoice balances</p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Upcoming work</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{upcoming.length}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Next: {upcoming[0] ? fmt(upcoming[0].startAt || upcoming[0].date) : "none scheduled"}
          </p>
        </article>

        <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Reviews</p>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{data.reviews.length}</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {data.reviews.length
              ? `${(data.reviews.reduce((sum, item) => sum + item.rating, 0) / data.reviews.length).toFixed(1)} average rating`
              : "No recorded reviews yet"}
          </p>
        </article>
      </section>

      {/* Main Grid: Details, History & Sidebar */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          {/* Upcoming Work */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Operations</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Upcoming work</h2>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>

            {upcoming.length ? (
              <div className="mt-5 space-y-3">
                {upcoming.map((booking: any) => (
                  <article key={booking._id} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-extrabold text-brand-dark">{booking.serviceType}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.reference} · {fmt(booking.startAt || booking.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-brand-dark">{money(booking.totalAmount)}</p>
                        <span className="mt-1 inline-flex rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-950/10">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">No future work is scheduled.</p>
            )}
          </section>

          {/* Booking History */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">History</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Booking history</h2>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ClipboardList className="h-4 w-4" />
              </div>
            </div>

            {data.bookings.length ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-950/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-brand-dark">
                    <thead className="border-b border-emerald-950/10 bg-[#F4FAF5]/70 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Reference</th>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Payment</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/5">
                      {data.bookings.map((booking: any) => (
                        <tr key={booking._id} className="hover:bg-[#F4FAF5]/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-700">{booking.reference}</td>
                          <td className="px-4 py-3 font-semibold text-brand-dark">{booking.serviceType}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(booking.startAt || booking.date)}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-emerald-950/10 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-dark">
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                            {booking.payment?.status || "NOT_REQUIRED"}
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-brand-dark">{money(booking.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">No bookings are linked yet.</p>
            )}
          </section>

          {/* Invoices & Balances */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Billing context</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Invoices & balances</h2>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ReceiptText className="h-4 w-4" />
              </div>
            </div>

            {data.invoices.length ? (
              <div className="mt-5 space-y-2.5">
                {data.invoices.map((invoice) => (
                  <Link
                    href="/admin/invoices"
                    key={invoice._id}
                    className="flex flex-col gap-2 rounded-2xl border border-emerald-950/10 p-4 transition-all hover:border-emerald-600/30 hover:bg-[#F4FAF5]/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-brand-dark">{invoice.invoiceNumber}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Issued {fmt(invoice.issuedAt)} · due {new Date(invoice.dueAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          invoice.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : invoice.status === "REFUNDED"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {invoice.status.replace(/_/g, " ")}
                      </span>
                      <div className="text-right">
                        <p className="font-extrabold text-brand-dark">
                          {invoice.currency} {invoice.total.toFixed(2)}
                        </p>
                        {invoice.amountDue > 0 ? (
                          <p className="text-[10px] font-bold text-rose-600">
                            {invoice.currency} {invoice.amountDue.toFixed(2)} due
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">No invoices have been generated for completed work yet.</p>
            )}
          </section>

          {/* Linked Leads */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Sales history</span>
            <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Linked leads</h2>
            {data.leads.length ? (
              <div className="mt-5 space-y-2.5">
                {data.leads.map((lead) => (
                  <Link
                    key={lead._id}
                    href={`/admin/leads/${lead._id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-950/10 p-4 hover:border-emerald-600/30 hover:bg-[#F4FAF5]/30 transition-all"
                  >
                    <div>
                      <p className="font-extrabold text-brand-dark">{lead.requestedServiceName || lead.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {lead.source.replace(/_/g, " ")} · {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      {lead.status.replace(/_/g, " ")}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">No lead history is linked.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile & Preferences */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Customer details</span>
            <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Profile & preferences</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Preferred contact</dt>
                <dd className="mt-1 font-semibold text-brand-dark">
                  {customer.preferences?.contactMethod || "EMAIL"}
                  {customer.preferences?.preferredContactWindow ? ` · ${customer.preferences.preferredContactWindow}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Service preferences</dt>
                <dd className="mt-1 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-3 whitespace-pre-wrap text-xs leading-5 text-brand-dark/80">
                  {customer.preferences?.serviceNotes || "No special service preferences recorded."}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Access instructions</dt>
                <dd className="mt-1 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/40 p-3 whitespace-pre-wrap text-xs leading-5 text-brand-dark/80">
                  {customer.accessInstructions || "No access instructions recorded."}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">Tags</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {customer.tags?.length ? (
                    customer.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-emerald-950/10 bg-emerald-50/70 px-2.5 py-0.5 text-[10px] font-bold text-brand-dark">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {/* Properties / Addresses */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Properties</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Addresses</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Home className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {customer.addresses?.length ? (
                customer.addresses.map((address) => (
                  <div key={address._id || `${address.line1}-${address.zip}`} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-extrabold text-brand-dark">
                        {address.label || (address.isPrimary ? "Primary" : "Property")}
                      </p>
                      {address.propertyType ? (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground border border-emerald-950/10">
                          {address.propertyType}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}
                      <br />
                      {address.city}
                      {address.state ? `, ${address.state}` : ""} {address.zip}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No addresses recorded.</p>
              )}
            </div>
          </section>

          {/* Household / Pets */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Household</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Pets</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <PawPrint className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {customer.pets?.length ? (
                customer.pets.map((pet) => (
                  <div key={pet._id || `${pet.name}-${pet.type}`} className="rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-3.5">
                    <p className="text-sm font-extrabold text-brand-dark">
                      {pet.name || pet.type} <span className="font-semibold text-muted-foreground">· {pet.type}</span>
                    </p>
                    {pet.notes ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{pet.notes}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No pets recorded.</p>
              )}
            </div>
          </section>

          {/* Internal Context / Notes */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Internal context</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Notes</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <NotebookPen className="h-4 w-4" />
              </div>
            </div>
            <form className="mt-4" onSubmit={saveNote}>
              <TextArea
                className="min-h-24"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add context for the team…"
              />
              <button
                type="submit"
                className="mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors disabled:opacity-50"
                disabled={noteState.isLoading || !note.trim()}
              >
                <Plus className="h-3.5 w-3.5 text-emerald-700" /> Add note
              </button>
            </form>
            <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
              {customer.notes?.length ? (
                [...customer.notes].reverse().map((item) => (
                  <div key={item._id || item.createdAt} className="rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/50 p-3">
                    <p className="whitespace-pre-wrap text-xs leading-5 text-brand-dark/80">{item.body}</p>
                    <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">{fmt(item.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
            </div>
          </section>

          {/* Reputation / Reviews */}
          <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">Reputation</span>
                <h2 className="mt-1 text-lg font-extrabold text-brand-dark">Reviews</h2>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <form className="mt-4 space-y-3" onSubmit={saveReview}>
              <label className="block">
                <FieldLabel>Rating</FieldLabel>
                <SelectInput value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} star{rating === 1 ? "" : "s"}
                    </option>
                  ))}
                </SelectInput>
              </label>
              <label className="block">
                <FieldLabel>Source</FieldLabel>
                <TextInput value={review.source} onChange={(event) => setReview({ ...review, source: event.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Comment</FieldLabel>
                <TextArea className="min-h-20" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} />
              </label>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors disabled:opacity-50"
                disabled={reviewState.isLoading}
              >
                <Plus className="h-3.5 w-3.5 text-emerald-700" /> Record review
              </button>
            </form>
            <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
              {data.reviews.length ? (
                [...data.reviews]
                  .reverse()
                  .slice(0, 8)
                  .map((item) => (
                    <div key={item._id || item.createdAt} className="rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/50 p-3">
                      <p className="font-extrabold text-brand-dark text-xs">
                        {"★".repeat(item.rating)}
                        <span className="text-muted-foreground/40">{"☆".repeat(5 - item.rating)}</span>
                      </p>
                      {item.comment ? <p className="mt-1 text-xs leading-5 text-brand-dark/75">{item.comment}</p> : null}
                      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                        {item.source || "Recorded review"} · {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-muted-foreground">No reviews recorded.</p>
              )}
            </div>
          </section>
        </aside>
      </div>

      {/* Slideover Modal: Edit Profile */}
      <div className={`fixed inset-0 z-[75] ${editOpen ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!editOpen}>
        <button
          type="button"
          aria-label="Close edit drawer"
          onClick={() => setEditOpen(false)}
          className={`absolute inset-0 bg-[#0C3629]/50 backdrop-blur-sm transition-opacity ${editOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
            editOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Edit customer"
        >
          <form className="p-6 sm:p-8" onSubmit={saveEdit}>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Customer record</span>
                <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">Edit profile</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <FieldLabel>Name</FieldLabel>
                <TextInput required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Email</FieldLabel>
                <TextInput type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Phone</FieldLabel>
                <TextInput value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
              </label>
              <label className="block">
                <FieldLabel>Status</FieldLabel>
                <SelectInput value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </SelectInput>
              </label>
              <label className="block">
                <FieldLabel>Preferred contact</FieldLabel>
                <SelectInput value={edit.contactMethod} onChange={(e) => setEdit({ ...edit, contactMethod: e.target.value })}>
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Phone</option>
                  <option value="SMS">SMS</option>
                </SelectInput>
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Preferred contact window</FieldLabel>
                <TextInput
                  value={edit.preferredContactWindow}
                  onChange={(e) => setEdit({ ...edit, preferredContactWindow: e.target.value })}
                  placeholder="Weekdays after 4 PM"
                />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Service preferences</FieldLabel>
                <TextArea value={edit.serviceNotes} onChange={(e) => setEdit({ ...edit, serviceNotes: e.target.value })} />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Access instructions</FieldLabel>
                <TextArea value={edit.accessInstructions} onChange={(e) => setEdit({ ...edit, accessInstructions: e.target.value })} />
              </label>
              <label className="sm:col-span-2 block">
                <FieldLabel>Tags</FieldLabel>
                <TextInput value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} />
              </label>

              {/* Addresses Editor */}
              <div className="sm:col-span-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel>Addresses</FieldLabel>
                    <p className="text-xs text-muted-foreground">Keep property and access context attached to the customer.</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        addresses: [
                          ...edit.addresses,
                          { label: "", line1: "", city: "", zip: "", state: "", country: "", propertyType: "HOME", isPrimary: edit.addresses.length === 0 },
                        ],
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-700" /> Address
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {edit.addresses.map((address, index) => (
                    <div key={address._id || index} className="grid gap-2.5 rounded-2xl border border-emerald-950/10 bg-white p-3.5 sm:grid-cols-2">
                      <TextInput
                        placeholder="Label (Home, Office)"
                        value={address.label || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)),
                          })
                        }
                      />
                      <SelectInput
                        value={address.propertyType || "HOME"}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) =>
                              i === index ? { ...item, propertyType: e.target.value as CustomerAddress["propertyType"] } : item
                            ),
                          })
                        }
                      >
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                        <option value="OTHER">Other</option>
                      </SelectInput>
                      <TextInput
                        className="sm:col-span-2"
                        required
                        placeholder="Address line 1"
                        value={address.line1}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, line1: e.target.value } : item)),
                          })
                        }
                      />
                      <TextInput
                        placeholder="City"
                        required
                        value={address.city}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, city: e.target.value } : item)),
                          })
                        }
                      />
                      <TextInput
                        placeholder="ZIP / postal code"
                        required
                        value={address.zip}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, zip: e.target.value } : item)),
                          })
                        }
                      />
                      <TextInput
                        placeholder="State / region"
                        value={address.state || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, state: e.target.value } : item)),
                          })
                        }
                      />
                      <TextInput
                        placeholder="Country"
                        value={address.country || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            addresses: edit.addresses.map((item, i) => (i === index ? { ...item, country: e.target.value } : item)),
                          })
                        }
                      />
                      <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-1">
                        <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark">
                          <input
                            type="radio"
                            name="primary-address"
                            checked={Boolean(address.isPrimary)}
                            onChange={() =>
                              setEdit({
                                ...edit,
                                addresses: edit.addresses.map((item, i) => ({ ...item, isPrimary: i === index })),
                              })
                            }
                          />
                          Primary address
                        </label>
                        <button
                          type="button"
                          className="text-xs font-bold text-rose-600 hover:underline"
                          onClick={() =>
                            setEdit({
                              ...edit,
                              addresses: edit.addresses
                                .filter((_, i) => i !== index)
                                .map((item, i) => ({ ...item, isPrimary: i === 0 ? true : item.isPrimary })),
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pets Editor */}
              <div className="sm:col-span-2 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel>Pets</FieldLabel>
                    <p className="text-xs text-muted-foreground">Record safety and cleaner instructions for pets in the property.</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                    onClick={() => setEdit({ ...edit, pets: [...edit.pets, { name: "", type: "", notes: "" }] })}
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-700" /> Pet
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {edit.pets.map((pet, index) => (
                    <div key={index} className="grid gap-2.5 rounded-2xl border border-emerald-950/10 bg-white p-3.5 sm:grid-cols-2">
                      <TextInput
                        placeholder="Pet name"
                        value={pet.name || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            pets: edit.pets.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)),
                          })
                        }
                      />
                      <TextInput
                        required
                        placeholder="Type (dog, cat...)"
                        value={pet.type}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            pets: edit.pets.map((item, i) => (i === index ? { ...item, type: e.target.value } : item)),
                          })
                        }
                      />
                      <TextArea
                        className="sm:col-span-2 min-h-20"
                        placeholder="Notes for the cleaning team"
                        value={pet.notes || ""}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            pets: edit.pets.map((item, i) => (i === index ? { ...item, notes: e.target.value } : item)),
                          })
                        }
                      />
                      <div className="sm:col-span-2 text-right">
                        <button
                          type="button"
                          className="text-xs font-bold text-rose-600 hover:underline"
                          onClick={() => setEdit({ ...edit, pets: edit.pets.filter((_, i) => i !== index) })}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-border/60 pt-5">
              <button
                type="button"
                className="rounded-full border border-emerald-950/15 px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-6 py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-50"
                disabled={updateState.isLoading}
              >
                <Edit3 className="h-4 w-4" /> Save changes
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
