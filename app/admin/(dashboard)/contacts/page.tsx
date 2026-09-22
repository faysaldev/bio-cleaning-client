"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  Send,
  ExternalLink,
  User,
  X,
} from "lucide-react";
import {
  useGetAllContactMessagesQuery,
  useReplyToContactMutation,
} from "@/src/redux/features/contact/contactApi";
import { ContactMessage } from "@/src/redux/features/contact/types";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/ui/feedback";

export default function AdminContactsPage() {
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [replyTo, setReplyTo] = useState<ContactMessage | null>(null);
  const [replyError, setReplyError] = useState("");
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, isError, refetch } = useGetAllContactMessagesQuery({
    status,
    page,
    limit: 10,
  });
  const [sendReply, { isLoading: isReplying }] = useReplyToContactMutation();

  const handleReply = async () => {
    const replyText = replyRef.current?.value;
    if (!replyTo || !replyText?.trim()) {
      setReplyError("Write a reply before sending.");
      return;
    }

    setReplyError("");
    try {
      const id = (replyTo as ContactMessage & { _id?: string })._id || replyTo.id;
      await sendReply({ id, reply: replyText.trim() }).unwrap();
      setReplyTo(null);
      if (replyRef.current) replyRef.current.value = "";
    } catch (error: any) {
      setReplyError(error?.data?.message || "The reply could not be sent. Please try again.");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  if (isLoading) return <LoadingState label="Loading customer messages…" />;

  if (isError) {
    return (
      <ErrorState
        title="Messages are unavailable"
        description="We couldn’t load customer inquiries. Your existing replies are unchanged."
        action={
          <button type="button" onClick={() => refetch()} className="btn-secondary rounded-full">
            Try again
          </button>
        }
      />
    );
  }

  const messages = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Spruce Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0C3629] p-6 text-white shadow-xl md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7CE337]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#7CE337]/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7CE337]">
                Customer Inbox
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">Contact messages</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Review customer inquiries, understand the requested service, and respond from a focused message workflow.
            </p>
          </div>

          <div
            className="flex w-fit items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-sm shadow-sm"
            role="group"
            aria-label="Message status filter"
          >
            <div className="hidden items-center gap-1.5 px-3 text-white/70 sm:flex">
              <Filter className="h-3.5 w-3.5 text-[#7CE337]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Status</span>
            </div>
            {["PENDING", "REPLIED"].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => handleStatusChange(value)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  status === value
                    ? "bg-[#7CE337] text-[#0C3629] shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {value === "PENDING" ? "Pending" : "Replied"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={`No ${status.toLowerCase()} messages`}
          description="Messages will appear here as soon as they match this status."
        />
      ) : (
        <section className="space-y-4" aria-label="Customer messages">
          {messages.map((message) => {
            const resolvedStatus =
              message.reply || (message as ContactMessage & { status?: string }).status === "REPLIED" ? "REPLIED" : "PENDING";
            return (
              <article
                key={(message as ContactMessage & { _id?: string })._id || message.id}
                className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-extrabold text-brand-dark">{message.fullName}</h2>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <a href={`mailto:${message.email}`} className="flex items-center gap-1 text-emerald-700 hover:underline">
                          <Mail className="h-3 w-3" /> {message.email}
                        </a>
                        <a href={`tel:${message.phone}`} className="flex items-center gap-1 text-emerald-700 hover:underline">
                          <Phone className="h-3 w-3" /> {message.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-950/10 bg-[#F4FAF5]/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3 text-emerald-700" /> {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
                        resolvedStatus === "REPLIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {resolvedStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-950/5 bg-[#F4FAF5]/50 p-4">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Requested service · {message.service}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-brand-dark/85">{message.message}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {message.leadId ? (
                    <a
                      href={`/admin/leads/${message.leadId}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-700" /> Open CRM lead
                    </a>
                  ) : null}

                  {message.reply ? (
                    <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                        <Reply className="h-3.5 w-3.5" /> Admin reply
                      </div>
                      <p className="mt-2 text-sm leading-6 text-emerald-950/80">{message.reply}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyError("");
                        setReplyTo(message);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#7CE337] px-5 py-2 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all"
                    >
                      <Reply className="h-3.5 w-3.5" /> Reply to message
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 ? (
        <nav
          className="flex flex-col gap-3 rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          aria-label="Message pagination"
        >
          <p className="px-1 text-xs font-semibold text-muted-foreground">
            Showing <span className="font-extrabold text-brand-dark">{(meta.page - 1) * meta.limit + 1}</span>–
            <span className="font-extrabold text-brand-dark">{Math.min(meta.page * meta.limit, meta.total)}</span> of{" "}
            <span className="font-extrabold text-brand-dark">{meta.total}</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
              disabled={page === meta.totalPages}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-950/15 bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-emerald-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      ) : null}

      {/* Reply Slideover Drawer */}
      <div
        className={`fixed inset-0 z-[70] ${replyTo ? "pointer-events-auto visible" : "pointer-events-none invisible"}`}
        aria-hidden={!replyTo}
      >
        <button
          type="button"
          aria-label="Close reply drawer"
          className={`absolute inset-0 bg-[#0C3629]/50 backdrop-blur-sm transition-opacity ${
            replyTo ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setReplyTo(null)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Reply to customer"
          className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
            replyTo ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Customer reply</span>
                <h2 className="mt-1 text-2xl font-extrabold text-brand-dark">Reply to {replyTo?.fullName}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{replyTo?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:bg-emerald-50 hover:text-brand-dark transition-colors"
                aria-label="Close reply drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-950/10 bg-[#F4FAF5]/40 p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Original message</div>
              <p className="mt-2 text-sm leading-6 text-brand-dark/80">{replyTo?.message}</p>
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-50 p-3.5 text-xs font-bold text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              Requested service: {replyTo?.service}
            </div>

            <div className="mt-6">
              <label htmlFor="admin-reply" className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
                Your reply
              </label>
              <textarea
                id="admin-reply"
                ref={replyRef}
                className="mt-2 w-full rounded-2xl border border-emerald-950/15 p-4 text-sm font-medium text-brand-dark placeholder:text-muted-foreground focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-52 resize-y"
                placeholder="Write a clear, helpful response…"
                onChange={() => replyError && setReplyError("")}
              />
              {replyError ? (
                <p className="mt-2 text-xs font-semibold text-rose-600" role="alert">
                  {replyError}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex gap-3 border-t border-border/60 pt-5">
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="flex-1 rounded-full border border-emerald-950/15 py-2.5 text-xs font-bold text-brand-dark hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReply}
                disabled={isReplying}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#7CE337] py-2.5 text-xs font-bold text-[#0C3629] shadow-sm hover:bg-[#8eed49] transition-all disabled:opacity-60"
              >
                {isReplying ? "Sending…" : <><Send className="h-4 w-4" /> Send reply</>}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
