"use client";

import {
  CalendarCheck,
  ExternalLink,
  LayoutDashboard,
  Mail,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const commands = [
  { href: "/admin", label: "Dashboard", detail: "Operations overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", detail: "Search and manage reservations", icon: CalendarCheck },
  { href: "/admin/bookings/manual", label: "Create booking", detail: "Add a reservation manually", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", detail: "Pricing, availability and publishing", icon: Sparkles },
  { href: "/admin/contacts", label: "Contacts", detail: "Customer messages and replies", icon: Mail },
  { href: "/admin/settings", label: "Settings", detail: "Profile and security", icon: Settings },
  { href: "/", label: "View website", detail: "Open the public site", icon: ExternalLink },
];

export function AdminCommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return commands;
    return commands.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(value));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-start bg-brand-dark/45 px-4 pt-[12vh] backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <section
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_32px_90px_-30px_rgba(8,37,23,.55)]"
        role="dialog"
        aria-modal="true"
        aria-label="Admin command menu"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && filtered[0]) go(filtered[0].href);
            }}
            className="h-14 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            placeholder="Search pages or actions…"
            aria-label="Search admin pages and actions"
          />
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-brand-cream hover:text-brand-dark" aria-label="Close command menu">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {filtered.length ? (
            filtered.map(({ href, label, detail, icon: Icon }) => (
              <button
                key={`${href}-${label}`}
                type="button"
                onClick={() => go(href)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-brand-cream/70 focus-visible:bg-brand-cream"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-white text-brand-green shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-brand-dark">{label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{detail}</span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-bold text-brand-dark">No matching actions</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a page name such as bookings, contacts or settings.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-brand-cream/45 px-4 py-2.5 text-[11px] font-semibold text-muted-foreground">
          <span>Press Enter to open the first result</span>
          <span>Esc to close</span>
        </div>
      </section>
    </div>
  );
}
