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
        action={<button type="button" onClick={() => refetch()} className="btn-secondary">Try again</button>}
      />
    );
  }

  const messages = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="editorial-kicker">Customer inbox</span>
          <h1 className="admin-page-heading mt-3 text-brand-dark">Contact messages</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Review inquiries, understand the requested service, and respond from a focused message workflow.
          </p>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm" role="group" aria-label="Message status filter">
          <div className="hidden items-center gap-2 px-2 text-muted-foreground sm:flex">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.12em]">Status</span>
          </div>
          {["PENDING", "REPLIED"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => handleStatusChange(value)}
              className={`rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${
                status === value ? "bg-brand-dark text-white" : "text-muted-foreground hover:bg-brand-cream hover:text-brand-dark"
              }`}
            >
              {value === "PENDING" ? "Pending" : "Replied"}
            </button>
          ))}
        </div>
      </section>

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={`No ${status.toLowerCase()} messages`}
          description="Messages will appear here as soon as they match this status."
        />
      ) : (
        <section className="space-y-3" aria-label="Customer messages">
          {messages.map((message) => {
            const resolvedStatus = message.reply || (message as ContactMessage & { status?: string }).status === "REPLIED" ? "REPLIED" : "PENDING";
            return (
              <article key={(message as ContactMessage & { _id?: string })._id || message.id} className="surface p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-cream text-brand-green">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-brand-dark">{message.fullName}</h2>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-brand-green"><Mail className="h-3 w-3" /> {message.email}</a>
                        <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-brand-green"><Phone className="h-3 w-3" /> {message.phone}</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-brand-cream/60 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3" /> {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`status-badge ${resolvedStatus === "REPLIED" ? "border-brand-green/25 bg-brand-green/8 text-brand-green" : "border-brand-yellow/40 bg-brand-yellow/14 text-brand-dark"}`}>
                      {resolvedStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border/70 bg-brand-cream/45 p-4">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-green">Requested service · {message.service}</div>
                  <p className="mt-2 text-sm leading-6 text-brand-dark/78">{message.message}</p>
                </div>

                {message.leadId ? (
                  <a href={`/admin/leads/${message.leadId}`} className="btn-secondary mt-4 w-fit">
                    <ExternalLink className="h-4 w-4" /> Open CRM lead
                  </a>
                ) : null}

                {message.reply ? (
                  <div className="mt-3 rounded-xl border border-brand-green/14 bg-brand-green/5 p-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-green"><Reply className="h-3 w-3" /> Admin reply</div>
                    <p className="mt-2 text-sm leading-6 text-brand-dark/72">{message.reply}</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setReplyError(""); setReplyTo(message); }} className="btn-secondary mt-4">
                    <Reply className="h-4 w-4" /> Reply to message
                  </button>
                )}
              </article>
            );
          })}
        </section>
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="surface flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Message pagination">
          <p className="px-1 text-xs font-semibold text-muted-foreground">
            Showing <span className="font-extrabold text-brand-dark">{(meta.page - 1) * meta.limit + 1}</span>–<span className="font-extrabold text-brand-dark">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-extrabold text-brand-dark">{meta.total}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-secondary flex-1 px-3 sm:flex-none"><ChevronLeft className="h-4 w-4" /> Previous</button>
            <button type="button" onClick={() => setPage(Math.min(meta.totalPages, page + 1))} disabled={page === meta.totalPages} className="btn-secondary flex-1 px-3 sm:flex-none">Next <ChevronRight className="h-4 w-4" /></button>
          </div>
        </nav>
      ) : null}

      <div className={`fixed inset-0 z-[70] ${replyTo ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!replyTo}>
        <button type="button" aria-label="Close reply drawer" className={`absolute inset-0 bg-brand-dark/42 backdrop-blur-[2px] transition-opacity ${replyTo ? "opacity-100" : "opacity-0"}`} onClick={() => setReplyTo(null)} />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Reply to customer"
          className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-border bg-white shadow-elevated transition-transform duration-200 ${replyTo ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="editorial-kicker">Customer reply</span>
                <h2 className="mt-3 text-2xl font-bold text-brand-dark">Reply to {replyTo?.fullName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{replyTo?.email}</p>
              </div>
              <button type="button" onClick={() => setReplyTo(null)} className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-brand-cream hover:text-brand-dark" aria-label="Close reply drawer"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-7 rounded-xl border border-border bg-brand-cream/45 p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-green">Original message</div>
              <p className="mt-2 text-sm leading-6 text-brand-dark/72">{replyTo?.message}</p>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-yellow/25 bg-brand-yellow/10 p-3 text-xs font-bold text-brand-dark">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Requested service: {replyTo?.service}
            </div>

            <div className="mt-6">
              <label htmlFor="admin-reply" className="field-label">Your reply</label>
              <textarea id="admin-reply" ref={replyRef} className="field-control min-h-52 resize-y" placeholder="Write a clear, helpful response…" onChange={() => replyError && setReplyError("")} />
              {replyError ? <p className="mt-2 text-xs font-semibold text-destructive" role="alert">{replyError}</p> : null}
            </div>

            <div className="mt-6 flex gap-2 border-t border-border pt-5">
              <button type="button" onClick={() => setReplyTo(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleReply} disabled={isReplying} className="btn-primary flex-1 disabled:opacity-60">
                {isReplying ? "Sending…" : <><Send className="h-4 w-4" /> Send reply</>}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
