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
  Home,
  Mail,
  MapPin,
  NotebookPen,
  PawPrint,
  Phone,
  Plus,
  ReceiptText,
  Star,
  UserRoundSearch,
  X,
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
    name: "", email: "", phone: "", contactMethod: "EMAIL", preferredContactWindow: "", serviceNotes: "", accessInstructions: "", tags: "", status: "ACTIVE",
    addresses: [] as CustomerAddress[],
    pets: [] as Array<{ name?: string; type: string; notes?: string }>,
  });

  const upcoming = useMemo(() => data?.upcomingWork || [], [data?.upcomingWork]);
  if (query.isLoading) return <LoadingState label="Loading customer 360 profile…" />;
  if (query.isError || !data || !customer) return <ErrorState title="Customer not found" description="This customer record could not be loaded." action={<button className="btn-secondary" onClick={() => router.push("/admin/customers")}>Back to customers</button>} />;

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
      await updateCustomer({ id, body: {
        name: edit.name,
        email: edit.email || "",
        phone: edit.phone || "",
        status: edit.status,
        preferences: { contactMethod: edit.contactMethod, preferredContactWindow: edit.preferredContactWindow || undefined, serviceNotes: edit.serviceNotes || undefined },
        accessInstructions: edit.accessInstructions || undefined,
        tags: edit.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        addresses: edit.addresses,
        pets: edit.pets.filter((pet) => pet.type.trim()),
      } }).unwrap();
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
      await addReview({ id, body: { rating: Number(review.rating), comment: review.comment || undefined, source: review.source || undefined } }).unwrap();
      setReview({ rating: "5", comment: "", source: "Internal" });
    } catch (requestError: any) {
      setError(requestError?.data?.message || "The review could not be added.");
    }
  };

  const primary = customer.addresses?.find((address) => address.isPrimary) || customer.addresses?.[0];

  return <div className="space-y-6">
    <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div><Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-brand-green"><ArrowLeft className="h-3.5 w-3.5" /> Back to customers</Link><div className="mt-4 flex items-center gap-2"><span className={`status-badge ${customer.status === "ACTIVE" ? "border-brand-green/20 bg-brand-green/7 text-brand-green" : "border-border bg-brand-cream text-muted-foreground"}`}>{customer.status}</span>{customer.createdSource ? <span className="rounded-lg border border-border bg-brand-cream px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">{customer.createdSource.replace(/_/g, " ")}</span> : null}</div><h1 className="admin-page-heading mt-3 text-brand-dark">{customer.name}</h1><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">{customer.email ? <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1.5 hover:text-brand-green"><Mail className="h-3.5 w-3.5" />{customer.email}</a> : null}{customer.phone ? <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1.5 hover:text-brand-green"><Phone className="h-3.5 w-3.5" />{customer.phone}</a> : null}{primary ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{primary.city}{primary.state ? `, ${primary.state}` : ""}</span> : null}</div></div>
      <button type="button" onClick={openEdit} className="btn-secondary"><Edit3 className="h-4 w-4" /> Edit profile</button>
    </section>

    {notice ? <div className="rounded-xl border border-brand-green/20 bg-brand-green/6 px-4 py-3 text-sm font-semibold text-brand-green">{notice}</div> : null}
    {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive">{error}</div> : null}

    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article className="surface p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Lifetime value</p><CircleDollarSign className="h-4 w-4 text-brand-green" /></div><p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">{money(data.lifetimeValue)}</p><p className="mt-1 text-xs text-muted-foreground">{data.completedBookings} completed booking{data.completedBookings === 1 ? "" : "s"}</p></article>
      <article className="surface p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Outstanding</p><ReceiptText className="h-4 w-4 text-brand-green" /></div><p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">{money(data.outstandingBalance)}</p><p className="mt-1 text-xs text-muted-foreground">Tracked deposits / payment balances</p></article>
      <article className="surface p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Upcoming work</p><CalendarCheck className="h-4 w-4 text-brand-green" /></div><p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">{upcoming.length}</p><p className="mt-1 text-xs text-muted-foreground">Next: {upcoming[0] ? fmt(upcoming[0].startAt || upcoming[0].date) : "none scheduled"}</p></article>
      <article className="surface p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Reviews</p><Star className="h-4 w-4 text-brand-green" /></div><p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-brand-dark">{data.reviews.length}</p><p className="mt-1 text-xs text-muted-foreground">{data.reviews.length ? `${(data.reviews.reduce((sum, item) => sum + item.rating, 0) / data.reviews.length).toFixed(1)} average rating` : "No recorded reviews yet"}</p></article>
    </section>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-6">
        <section className="surface p-5 sm:p-6"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Operations</span><h2 className="mt-2 text-xl font-extrabold text-brand-dark">Upcoming work</h2></div><CalendarCheck className="h-5 w-5 text-brand-green" /></div>{upcoming.length ? <div className="mt-5 space-y-3">{upcoming.map((booking: any) => <article key={booking._id} className="rounded-xl border border-border bg-brand-cream/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-extrabold text-brand-dark">{booking.serviceType}</p><p className="mt-1 text-xs text-muted-foreground">{booking.reference} · {fmt(booking.startAt || booking.date)}</p></div><div className="text-right"><p className="font-extrabold text-brand-dark">{money(booking.totalAmount)}</p><span className="mt-1 inline-flex rounded-lg bg-white px-2 py-1 text-[10px] font-extrabold text-brand-green">{booking.status}</span></div></div></article>)}</div> : <p className="mt-5 text-sm text-muted-foreground">No future work is scheduled.</p>}</section>

        <section className="surface p-5 sm:p-6"><div className="flex items-center justify-between"><div><span className="editorial-kicker">History</span><h2 className="mt-2 text-xl font-extrabold text-brand-dark">Booking history</h2></div><ClipboardList className="h-5 w-5 text-brand-green" /></div>{data.bookings.length ? <div className="mt-5 overflow-x-auto"><table className="data-table min-w-[720px]"><thead><tr><th>Reference</th><th>Service</th><th>Date</th><th>Status</th><th>Payment</th><th className="text-right">Amount</th></tr></thead><tbody>{data.bookings.map((booking: any) => <tr key={booking._id}><td className="font-mono text-xs font-semibold text-brand-green">{booking.reference}</td><td className="font-semibold text-brand-dark">{booking.serviceType}</td><td className="text-xs text-muted-foreground">{fmt(booking.startAt || booking.date)}</td><td><span className="status-badge border-border bg-brand-cream text-brand-dark">{booking.status}</span></td><td className="text-xs font-semibold text-muted-foreground">{booking.payment?.status || "NOT_REQUIRED"}</td><td className="text-right font-extrabold text-brand-dark">{money(booking.totalAmount)}</td></tr>)}</tbody></table></div> : <p className="mt-5 text-sm text-muted-foreground">No bookings are linked yet.</p>}</section>

        <section className="surface p-5 sm:p-6"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Billing context</span><h2 className="mt-2 text-xl font-extrabold text-brand-dark">Invoices & payment ledger</h2></div><ReceiptText className="h-5 w-5 text-brand-green" /></div>{data.invoices.length ? <div className="mt-5 space-y-2">{data.invoices.map((invoice) => <div key={invoice.id} className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-extrabold text-brand-dark">{invoice.reference} · {invoice.service}</p><p className="mt-1 text-[11px] text-muted-foreground">{fmt(invoice.date)} · {invoice.source.replace(/_/g, " ")}</p></div><div className="flex items-center gap-3"><span className="status-badge border-border bg-brand-cream text-brand-dark">{invoice.paymentStatus}</span><span className="font-extrabold text-brand-dark">{money(invoice.amount)}</span></div></div>)}</div> : <p className="mt-5 text-sm text-muted-foreground">No invoice-like booking ledger entries exist yet.</p>}</section>

        <section className="surface p-5 sm:p-6"><span className="editorial-kicker">Sales history</span><h2 className="mt-2 text-xl font-extrabold text-brand-dark">Linked leads</h2>{data.leads.length ? <div className="mt-5 space-y-2">{data.leads.map((lead) => <Link key={lead._id} href={`/admin/leads/${lead._id}`} className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 hover:border-brand-green/35"><div><p className="font-extrabold text-brand-dark">{lead.requestedServiceName || lead.name}</p><p className="mt-1 text-xs text-muted-foreground">{lead.source.replace(/_/g, " ")} · {new Date(lead.createdAt).toLocaleDateString()}</p></div><span className="status-badge border-brand-green/20 bg-brand-green/6 text-brand-green">{lead.status.replace(/_/g, " ")}</span></Link>)}</div> : <p className="mt-5 text-sm text-muted-foreground">No lead history is linked.</p>}</section>
      </div>

      <aside className="space-y-6">
        <section className="surface p-5"><span className="editorial-kicker">Customer details</span><h2 className="mt-2 text-lg font-extrabold text-brand-dark">Profile & preferences</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-xs font-bold text-muted-foreground">Preferred contact</dt><dd className="mt-1 font-semibold text-brand-dark">{customer.preferences?.contactMethod || "EMAIL"}{customer.preferences?.preferredContactWindow ? ` · ${customer.preferences.preferredContactWindow}` : ""}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Service preferences</dt><dd className="mt-1 whitespace-pre-wrap leading-6 text-brand-dark/75">{customer.preferences?.serviceNotes || "No special service preferences recorded."}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Access instructions</dt><dd className="mt-1 whitespace-pre-wrap leading-6 text-brand-dark/75">{customer.accessInstructions || "No access instructions recorded."}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">Tags</dt><dd className="mt-2 flex flex-wrap gap-1.5">{customer.tags?.length ? customer.tags.map((tag) => <span key={tag} className="rounded-lg border border-border bg-brand-cream px-2 py-1 text-[10px] font-bold text-brand-dark">{tag}</span>) : <span className="text-muted-foreground">None</span>}</dd></div></dl></section>

        <section className="surface p-5"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Properties</span><h2 className="mt-2 text-lg font-extrabold text-brand-dark">Addresses</h2></div><Home className="h-5 w-5 text-brand-green" /></div><div className="mt-4 space-y-2">{customer.addresses?.length ? customer.addresses.map((address) => <div key={address._id || `${address.line1}-${address.zip}`} className="rounded-xl border border-border bg-brand-cream/35 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-extrabold text-brand-dark">{address.label || (address.isPrimary ? "Primary" : "Property")}</p>{address.propertyType ? <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">{address.propertyType}</span> : null}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.city}{address.state ? `, ${address.state}` : ""} {address.zip}</p></div>) : <p className="text-sm text-muted-foreground">No addresses recorded.</p>}</div></section>

        <section className="surface p-5"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Household</span><h2 className="mt-2 text-lg font-extrabold text-brand-dark">Pets</h2></div><PawPrint className="h-5 w-5 text-brand-green" /></div><div className="mt-4 space-y-2">{customer.pets?.length ? customer.pets.map((pet) => <div key={pet._id || `${pet.name}-${pet.type}`} className="rounded-xl border border-border p-3"><p className="text-sm font-extrabold text-brand-dark">{pet.name || pet.type} <span className="font-semibold text-muted-foreground">· {pet.type}</span></p>{pet.notes ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{pet.notes}</p> : null}</div>) : <p className="text-sm text-muted-foreground">No pets recorded.</p>}</div></section>

        <section className="surface p-5"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Internal context</span><h2 className="mt-2 text-lg font-extrabold text-brand-dark">Notes</h2></div><NotebookPen className="h-5 w-5 text-brand-green" /></div><form className="mt-4" onSubmit={saveNote}><TextArea className="min-h-24" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add context for the team…" /><button className="btn-secondary mt-2 w-full" disabled={noteState.isLoading || !note.trim()}><Plus className="h-4 w-4" /> Add note</button></form><div className="mt-4 space-y-2 border-t border-border pt-4">{customer.notes?.length ? [...customer.notes].reverse().map((item) => <div key={item._id || item.createdAt} className="rounded-xl bg-brand-cream/45 p-3"><p className="whitespace-pre-wrap text-sm leading-6 text-brand-dark/75">{item.body}</p><p className="mt-1 text-[10px] font-semibold text-muted-foreground">{fmt(item.createdAt)}</p></div>) : <p className="text-sm text-muted-foreground">No notes yet.</p>}</div></section>

        <section className="surface p-5"><div className="flex items-center justify-between"><div><span className="editorial-kicker">Reputation</span><h2 className="mt-2 text-lg font-extrabold text-brand-dark">Reviews</h2></div><Star className="h-5 w-5 text-brand-green" /></div><form className="mt-4 space-y-3" onSubmit={saveReview}><label><FieldLabel>Rating</FieldLabel><SelectInput value={review.rating} onChange={(event) => setReview({ ...review, rating: event.target.value })}>{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? "" : "s"}</option>)}</SelectInput></label><label><FieldLabel>Source</FieldLabel><TextInput value={review.source} onChange={(event) => setReview({ ...review, source: event.target.value })} /></label><label><FieldLabel>Comment</FieldLabel><TextArea className="min-h-20" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} /></label><button className="btn-secondary w-full" disabled={reviewState.isLoading}><Plus className="h-4 w-4" /> Record review</button></form><div className="mt-4 space-y-2 border-t border-border pt-4">{data.reviews.length ? [...data.reviews].reverse().slice(0, 8).map((item) => <div key={item._id || item.createdAt} className="rounded-xl bg-brand-cream/45 p-3"><p className="font-extrabold text-brand-dark">{"★".repeat(item.rating)}<span className="text-muted-foreground">{"☆".repeat(5-item.rating)}</span></p>{item.comment ? <p className="mt-1 text-sm leading-6 text-brand-dark/70">{item.comment}</p> : null}<p className="mt-1 text-[10px] font-semibold text-muted-foreground">{item.source || "Recorded review"} · {new Date(item.createdAt).toLocaleDateString()}</p></div>) : <p className="text-sm text-muted-foreground">No reviews recorded.</p>}</div></section>
      </aside>
    </div>

    <div className={`fixed inset-0 z-[75] ${editOpen ? "visible" : "pointer-events-none invisible"}`} aria-hidden={!editOpen}><button type="button" aria-label="Close edit drawer" onClick={() => setEditOpen(false)} className={`absolute inset-0 bg-brand-dark/45 backdrop-blur-[2px] transition-opacity ${editOpen ? "opacity-100" : "opacity-0"}`} /><aside className={`absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-white shadow-elevated transition-transform ${editOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Edit customer"><form className="p-5 sm:p-7" onSubmit={saveEdit}><div className="flex items-start justify-between gap-4"><div><span className="editorial-kicker">Customer record</span><h2 className="mt-3 text-2xl font-extrabold text-brand-dark">Edit profile</h2></div><button type="button" onClick={() => setEditOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-border"><X className="h-4 w-4" /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><FieldLabel>Name</FieldLabel><TextInput required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label><label><FieldLabel>Email</FieldLabel><TextInput type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></label><label><FieldLabel>Phone</FieldLabel><TextInput value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></label><label><FieldLabel>Status</FieldLabel><SelectInput value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></SelectInput></label><label><FieldLabel>Preferred contact</FieldLabel><SelectInput value={edit.contactMethod} onChange={(e) => setEdit({ ...edit, contactMethod: e.target.value })}><option value="EMAIL">Email</option><option value="PHONE">Phone</option><option value="SMS">SMS</option></SelectInput></label><label className="sm:col-span-2"><FieldLabel>Preferred contact window</FieldLabel><TextInput value={edit.preferredContactWindow} onChange={(e) => setEdit({ ...edit, preferredContactWindow: e.target.value })} placeholder="Weekdays after 4 PM" /></label><label className="sm:col-span-2"><FieldLabel>Service preferences</FieldLabel><TextArea value={edit.serviceNotes} onChange={(e) => setEdit({ ...edit, serviceNotes: e.target.value })} /></label><label className="sm:col-span-2"><FieldLabel>Access instructions</FieldLabel><TextArea value={edit.accessInstructions} onChange={(e) => setEdit({ ...edit, accessInstructions: e.target.value })} /></label><label className="sm:col-span-2"><FieldLabel>Tags</FieldLabel><TextInput value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} /></label>
<div className="sm:col-span-2 rounded-xl border border-border bg-brand-cream/25 p-4"><div className="flex items-center justify-between gap-3"><div><FieldLabel>Addresses</FieldLabel><p className="text-xs text-muted-foreground">Keep property and access context attached to the customer.</p></div><button type="button" className="btn-secondary" onClick={() => setEdit({ ...edit, addresses: [...edit.addresses, { label: "", line1: "", city: "", zip: "", state: "", country: "", propertyType: "HOME", isPrimary: edit.addresses.length === 0 }] })}><Plus className="h-4 w-4" /> Address</button></div><div className="mt-3 space-y-3">{edit.addresses.map((address, index) => <div key={address._id || index} className="grid gap-2 rounded-xl border border-border bg-white p-3 sm:grid-cols-2"><TextInput placeholder="Label (Home, Office)" value={address.label || ""} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, label: e.target.value } : item) })} /><SelectInput value={address.propertyType || "HOME"} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, propertyType: e.target.value as CustomerAddress["propertyType"] } : item) })}><option value="HOME">Home</option><option value="OFFICE">Office</option><option value="OTHER">Other</option></SelectInput><TextInput className="sm:col-span-2" required placeholder="Address line 1" value={address.line1} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, line1: e.target.value } : item) })} /><TextInput placeholder="City" required value={address.city} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, city: e.target.value } : item) })} /><TextInput placeholder="ZIP / postal code" required value={address.zip} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, zip: e.target.value } : item) })} /><TextInput placeholder="State / region" value={address.state || ""} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, state: e.target.value } : item) })} /><TextInput placeholder="Country" value={address.country || ""} onChange={(e) => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => i === index ? { ...item, country: e.target.value } : item) })} /><div className="sm:col-span-2 flex items-center justify-between gap-3"><label className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark"><input type="radio" name="primary-address" checked={Boolean(address.isPrimary)} onChange={() => setEdit({ ...edit, addresses: edit.addresses.map((item, i) => ({ ...item, isPrimary: i === index })) })} /> Primary address</label><button type="button" className="text-xs font-bold text-destructive" onClick={() => setEdit({ ...edit, addresses: edit.addresses.filter((_, i) => i !== index).map((item, i) => ({ ...item, isPrimary: i === 0 ? true : item.isPrimary })) })}>Remove</button></div></div>)}</div></div>
<div className="sm:col-span-2 rounded-xl border border-border bg-brand-cream/25 p-4"><div className="flex items-center justify-between gap-3"><div><FieldLabel>Pets</FieldLabel><p className="text-xs text-muted-foreground">Record safety and cleaner instructions for pets in the property.</p></div><button type="button" className="btn-secondary" onClick={() => setEdit({ ...edit, pets: [...edit.pets, { name: "", type: "", notes: "" }] })}><Plus className="h-4 w-4" /> Pet</button></div><div className="mt-3 space-y-3">{edit.pets.map((pet, index) => <div key={index} className="grid gap-2 rounded-xl border border-border bg-white p-3 sm:grid-cols-2"><TextInput placeholder="Pet name" value={pet.name || ""} onChange={(e) => setEdit({ ...edit, pets: edit.pets.map((item, i) => i === index ? { ...item, name: e.target.value } : item) })} /><TextInput required placeholder="Type (dog, cat...)" value={pet.type} onChange={(e) => setEdit({ ...edit, pets: edit.pets.map((item, i) => i === index ? { ...item, type: e.target.value } : item) })} /><TextArea className="sm:col-span-2 min-h-20" placeholder="Notes for the cleaning team" value={pet.notes || ""} onChange={(e) => setEdit({ ...edit, pets: edit.pets.map((item, i) => i === index ? { ...item, notes: e.target.value } : item) })} /><div className="sm:col-span-2 text-right"><button type="button" className="text-xs font-bold text-destructive" onClick={() => setEdit({ ...edit, pets: edit.pets.filter((_, i) => i !== index) })}>Remove</button></div></div>)}</div></div>
</div><div className="mt-7 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setEditOpen(false)}>Cancel</button><button className="btn-primary" disabled={updateState.isLoading}><Edit3 className="h-4 w-4" /> Save changes</button></div></form></aside></div>
  </div>;
}
