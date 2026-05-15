"use client";

import { useState, useRef } from "react";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Clock,
  Reply,
  Loader2,
  AlertCircle,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetAllContactMessagesQuery,
  useReplyToContactMutation,
} from "@/src/redux/features/contact/contactApi";
import { ContactMessage } from "@/src/redux/features/contact/types";

export default function AdminContactsPage() {
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllContactMessagesQuery({ 
    status, 
    page, 
    limit: 10 
  });
  const [replyTo, setReplyTo] = useState<ContactMessage | null>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const [sendReply, { isLoading: isReplying }] = useReplyToContactMutation();

  const handleReply = async () => {
    const replyText = replyRef.current?.value;
    if (!replyTo || !replyText?.trim()) return;

    try {
      const id = (replyTo as any)._id || replyTo.id;
      await sendReply({ id, reply: replyText }).unwrap();
      setReplyTo(null);
      if (replyRef.current) replyRef.current.value = "";
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page on filter change
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-900">
          Failed to load messages
        </h3>
        <p className="text-red-700">Please try refreshing the page.</p>
      </div>
    );
  }

  const messages = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">
            Contact Messages
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to customer inquiries.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-3 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Status:</span>
          </div>
          <div className="flex gap-1">
            {["PENDING", "REPLIED"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  status === s
                    ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                    : "hover:bg-brand-cream text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white border border-border p-20 text-center shadow-sm">
          <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-xl font-bold text-brand-dark">No {status.toLowerCase()} messages</h3>
          <p className="text-muted-foreground">
            Items will appear here once they match your filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div
              key={(msg as any)._id || msg.id}
              className="group rounded-3xl bg-white border border-border p-6 hover:shadow-xl hover:border-brand-green/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-cream flex items-center justify-center">
                    <User className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">
                      {msg.fullName}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {msg.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {msg.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground bg-brand-cream px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" />{" "}
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    msg.reply || (msg as any).status === "REPLIED"
                      ? "bg-brand-green/10 text-brand-green"
                      : "bg-brand-yellow/10 text-brand-dark"
                  }`}>
                    {(msg as any).status || "PENDING"}
                  </span>
                </div>
              </div>

              <div className="bg-brand-cream/50 rounded-2xl p-4 mb-4">
                <div className="text-[10px] uppercase tracking-widest font-black text-brand-green mb-2">
                  Subject: {msg.service}
                </div>
                <p className="text-brand-dark/80 italic">
                  &ldquo;{msg.message}&rdquo;
                </p>
              </div>

              {msg.reply ? (
                <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-brand-green mb-2">
                    <Reply className="h-3 w-3" /> Admin Reply
                  </div>
                  <p className="text-brand-dark/70">{msg.reply}</p>
                </div>
              ) : (
                <button
                  onClick={() => setReplyTo(msg)}
                  className="btn-secondary w-full md:w-auto"
                >
                  <Reply className="h-4 w-4 mr-2" /> Reply to message
                </button>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          {meta && meta.totalPage > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-border mt-6">
              <div className="text-sm text-muted-foreground pl-2">
                Showing <span className="font-bold text-brand-dark">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-bold text-brand-dark">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-bold text-brand-dark">{meta.total}</span> messages
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {[...Array(meta.totalPage)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                        : "hover:bg-brand-cream text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(meta.totalPage, page + 1))}
                  disabled={page === meta.totalPage}
                  className="p-2 rounded-xl hover:bg-brand-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reply Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${replyTo ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px] transition-opacity duration-500 ${replyTo ? "opacity-100" : "opacity-0"}`}
          onClick={() => setReplyTo(null)}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] shadow-2xl transition-transform duration-500 transform ${replyTo ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-brand-dark">
                  Send Reply
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-brand-green" />
                  </div>
                  <span className="text-sm font-bold text-brand-dark">
                    {replyTo?.fullName}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {replyTo?.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="h-12 w-12 rounded-full hover:bg-brand-cream grid place-items-center transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
              <div className="space-y-4">
                <div className="bg-brand-cream/50 rounded-[2rem] p-6">
                  <div className="text-[10px] uppercase tracking-widest font-black text-brand-green mb-3">
                    Original Message
                  </div>
                  <p className="text-brand-dark/70 text-sm italic leading-relaxed">
                    &ldquo;{replyTo?.message}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2 p-4 bg-brand-yellow/10 rounded-2xl border border-brand-yellow/20">
                  <AlertCircle className="h-4 w-4 text-brand-dark" />
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                    Client requested: {replyTo?.service}
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  ref={replyRef}
                  className="w-full h-48 p-6 rounded-[2rem] border border-border focus:ring-4 focus:ring-brand-green/10 outline-none resize-none transition-all duration-300"
                  placeholder="Type your response here..."
                />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setReplyTo(null)}
                    className="btn-secondary flex-1 py-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={isReplying}
                    className="btn-primary flex-1 py-4 disabled:opacity-50 shadow-xl shadow-brand-green/20"
                  >
                    {isReplying ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Send Professional Reply"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
