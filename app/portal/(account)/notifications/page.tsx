"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ErrorState, LoadingState } from "@/src/components/ui/feedback";
import { useGetPortalNotificationsQuery,useMarkAllPortalNotificationsReadMutation,useMarkPortalNotificationReadMutation } from "@/src/redux/features/portal/portalApi";
export default function PortalNotificationsPage() {
  const { data, isLoading, isError, refetch } = useGetPortalNotificationsQuery({ limit: 100 });
  const [markRead] = useMarkPortalNotificationReadMutation();
  const [markAll] = useMarkAllPortalNotificationsReadMutation();

  if (isLoading) return <LoadingState label="Loading updates…" />;
  if (isError || !data) return <ErrorState action={<button className="btn-secondary rounded-full" onClick={() => refetch()}>Try again</button>} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-[#F4FAF5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-green">
            Communication Center
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark">
            Updates & Alerts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Booking confirmations, cleaner notes, payment receipts, and review updates.
          </p>
        </div>
        {data.unread ? (
          <button
            onClick={() => markAll()}
            className="btn-secondary rounded-full px-5 text-xs font-bold"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {data.items.map((n: any) => {
          const isUnread = !n.readAt;
          return (
            <article
              key={n._id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-sm ${
                isUnread
                  ? "border-brand-lime bg-[#F4FAF5] ring-1 ring-brand-lime/50"
                  : "border-brand-green/12 bg-white"
              }`}
            >
              <div className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#0C3629] text-brand-lime shadow-sm">
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-extrabold text-brand-dark text-base">{n.title}</h2>
                    <time className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {n.message}
                  </p>
                  <div className="mt-3.5 flex items-center gap-3">
                    {n.href ? (
                      <Link
                        href={n.href}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-3.5 py-1 text-xs font-bold text-brand-green hover:bg-brand-green hover:text-white transition"
                        onClick={() => !n.readAt && markRead(n._id)}
                      >
                        Open link
                      </Link>
                    ) : null}
                    {isUnread ? (
                      <button
                        onClick={() => markRead(n._id)}
                        className="text-xs font-bold text-muted-foreground hover:text-brand-dark underline"
                      >
                        Mark as read
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {!data.items.length ? (
          <div className="rounded-3xl border border-dashed border-brand-green/20 bg-white p-10 text-center text-sm text-muted-foreground">
            No updates recorded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
