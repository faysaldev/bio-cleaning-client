"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Compass, 
  Search, 
  X, 
  ExternalLink, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  Sparkles,
  LayoutGrid,
  CheckCircle2
} from "lucide-react";

export interface PageRouteItem {
  path: string;
  name: string;
  category: "public" | "portal" | "staff" | "admin";
  description: string;
  badge?: string;
}

export const ALL_APPLICATION_PAGES: PageRouteItem[] = [
  // Public Marketing
  { path: "/", name: "Landing / Home", category: "public", description: "Main conversion landing page with Hero, Services, & Reviews", badge: "Primary" },
  { path: "/services", name: "Services Catalog", category: "public", description: "All cleaning service offerings & pricing packages" },
  { path: "/services/residential-cleaning", name: "Service Details (Sample)", category: "public", description: "In-depth room checklist, specs, and booking trigger" },
  { path: "/about", name: "About Us", category: "public", description: "Company mission, team background, and eco standards" },
  { path: "/how-we-clean", name: "How We Clean", category: "public", description: "The 50-point checklist and professional cleaning protocol" },
  { path: "/equipment", name: "Equipment & Supplies", category: "public", description: "HEPA filtration, microfiber standards, and plant-based chemistry" },
  { path: "/before-after", name: "Before & After", category: "public", description: "Visual transformation showcase with interactive comparison" },
  { path: "/reviews", name: "Client Reviews", category: "public", description: "Verified reviews, testimonials, and customer ratings" },
  { path: "/review/demo-token", name: "Submit Job Review", category: "public", description: "Customer post-service rating and feedback submission form" },
  { path: "/service-areas", name: "Service Areas Directory", category: "public", description: "All serviced cities, zones, and local coverage map" },
  { path: "/service-areas/aurora-co", name: "Service Area (Aurora, CO)", category: "public", description: "Localized city landing page with Aurora specific details" },
  { path: "/team", name: "Our Cleaning Team", category: "public", description: "Meet certified cleaners with background-checked credentials" },
  { path: "/careers", name: "Careers & Hiring", category: "public", description: "Join our professional cleaning staff with online application" },
  { path: "/resources", name: "Blog & Cleaning Resources", category: "public", description: "Helpful cleaning guides, checklists, and home care tips" },
  { path: "/resources/eco-friendly-home-cleaning-guide", name: "Blog Post (Sample)", category: "public", description: "Editorial article layout with tips and author info" },
  { path: "/faq", name: "Frequently Asked Questions", category: "public", description: "Common questions about pricing, safety, and policies" },
  { path: "/contact", name: "Contact Us", category: "public", description: "Direct inquiry form, phone, hours, and map" },
  { path: "/book", name: "Book Cleaning Flow", category: "public", description: "Interactive multi-step online booking & scheduling engine", badge: "Core Funnel" },
  { path: "/booking/manage", name: "Self-Service Booking Manager", category: "public", description: "Manage or reschedule existing appointments without logging in" },
  { path: "/quote", name: "Instant Quote Calculator", category: "public", description: "Square-footage and room calculation for instant rate estimates" },
  { path: "/estimate/demo-token", name: "Customer Estimate Viewer", category: "public", description: "Digital customer estimate approval and invoice overview" },
  { path: "/invoice/demo-token", name: "Public Invoice Payment", category: "public", description: "Stripe-powered checkout for outstanding invoices" },
  { path: "/privacy-policy", name: "Privacy Policy", category: "public", description: "Customer data handling and legal disclosures" },
  { path: "/terms", name: "Terms of Service", category: "public", description: "Standard client agreement and terms of service" },
  { path: "/cancellation-policy", name: "Cancellation Policy", category: "public", description: "Rescheduling guidelines and cancellation fees" },
  { path: "/accessibility", name: "Accessibility Statement", category: "public", description: "WCAG accessibility standards and accommodations" },
  { path: "/preview/draft-token", name: "CMS Live Draft Preview", category: "public", description: "Real-time preview of unsaved website settings" },

  // Customer Account Portal
  { path: "/portal/login", name: "Customer Sign In", category: "portal", description: "Customer account login via email / magic link" },
  { path: "/portal/auth", name: "Customer Auth Callback", category: "portal", description: "OTP and secure link verification handler" },
  { path: "/portal", name: "Customer Dashboard", category: "portal", description: "Upcoming cleanings, quick re-booking, and balance overview", badge: "Portal" },
  { path: "/portal/bookings", name: "Customer Bookings", category: "portal", description: "Past cleaning reports, upcoming visits, and rescheduling" },
  { path: "/portal/invoices", name: "Customer Invoices", category: "portal", description: "Invoice history, PDF receipts, and balance summary" },
  { path: "/portal/payments", name: "Customer Payment Methods", category: "portal", description: "Manage saved credit cards and auto-billing preferences" },
  { path: "/portal/notifications", name: "Customer Notifications", category: "portal", description: "SMS/Email alert log and visit reminders" },
  { path: "/portal/profile", name: "Customer Profile", category: "portal", description: "Home address, pet instructions, lockbox codes, and contact info" },

  // Staff / Field App
  { path: "/staff/login", name: "Staff Sign In", category: "staff", description: "Field cleaner credential login" },
  { path: "/staff", name: "Staff Daily Route", category: "staff", description: "Cleaner today's schedule, assigned jobs, and status toggles", badge: "Field App" },
  { path: "/staff/jobs/demo-job", name: "Staff Job Execution", category: "staff", description: "Room checklist, clock-in/out, customer notes, photo uploads" },
  { path: "/staff/profile", name: "Staff Profile", category: "staff", description: "Cleaner personal ratings, total hours, and availability" },

  // Admin Command Center
  { path: "/admin/login", name: "Admin Sign In", category: "admin", description: "Administrator access portal" },
  { path: "/admin/forgot-password", name: "Admin Forgot Password", category: "admin", description: "Account password recovery" },
  { path: "/admin/reset-password", name: "Admin Reset Password", category: "admin", description: "Password reset form with security token" },
  { path: "/admin", name: "Admin KPI Dashboard", category: "admin", description: "Revenue graphs, active jobs, cleaner utilization, and quick actions", badge: "Command Center" },
  { path: "/admin/bookings", name: "Bookings Manager", category: "admin", description: "Master booking table, calendar view, and status updates" },
  { path: "/admin/bookings/manual", name: "Manual Phone Booking", category: "admin", description: "Create phone bookings directly into the dispatch schedule" },
  { path: "/admin/bookings/recovery", name: "Abandoned Booking Recovery", category: "admin", description: "Track incomplete booking carts and trigger recovery SMS" },
  { path: "/admin/dispatch", name: "Live Dispatch Board", category: "admin", description: "Real-time cleaner assignment map and route optimization" },
  { path: "/admin/jobs", name: "Jobs Pipeline", category: "admin", description: "Kanban board of pending, dispatched, in-progress, and completed jobs" },
  { path: "/admin/leads", name: "CRM Leads Pipeline", category: "admin", description: "Inbound quote requests and prospective client stage tracking" },
  { path: "/admin/leads/demo-lead", name: "Lead Profile View", category: "admin", description: "Client contact notes, quote history, and conversion actions" },
  { path: "/admin/leads/follow-ups", name: "Lead Follow-Up Tasks", category: "admin", description: "Automated & scheduled follow-up tasks for sales team" },
  { path: "/admin/customers", name: "Customer CRM Directory", category: "admin", description: "Searchable customer database with tags and lifetime spend" },
  { path: "/admin/customers/demo-customer", name: "Customer 360 Profile", category: "admin", description: "Detailed customer profile, service history, and notes" },
  { path: "/admin/quotes", name: "Quotes & Estimates", category: "admin", description: "Pending quotes management, convert to active booking" },
  { path: "/admin/invoices", name: "Invoices Management", category: "admin", description: "Generate invoices, track unpaid balances, and Stripe sync" },
  { path: "/admin/payments", name: "Payments & Payouts", category: "admin", description: "Stripe transactions, refunds, and cleaner payout reports" },
  { path: "/admin/services", name: "Services & Pricing Editor", category: "admin", description: "Configure base pricing, bedroom/bath tiers, and add-on rates" },
  { path: "/admin/team", name: "Cleaner Team Roster", category: "admin", description: "Manage cleaner staff profiles, pay rates, and certifications" },
  { path: "/admin/reviews", name: "Reviews Moderation", category: "admin", description: "Approve customer reviews for display on the public homepage" },
  { path: "/admin/messages", name: "Customer Messaging", category: "admin", description: "Two-way communication hub with clients" },
  { path: "/admin/communications", name: "SMS / Email Broadcasts", category: "admin", description: "Send automated or broadcast announcements to client lists" },
  { path: "/admin/contacts", name: "Contact Submissions", category: "admin", description: "Inbox of customer inquiries from the contact form" },
  { path: "/admin/automations", name: "Workflow Automations", category: "admin", description: "Triggered email/SMS rules on job complete or cancellation" },
  { path: "/admin/reports", name: "Business Analytics & Reports", category: "admin", description: "Revenue reports, customer churn, and operational metrics" },
  { path: "/admin/audit-logs", name: "Security Audit Logs", category: "admin", description: "Historical log of all user actions and system changes" },
  { path: "/admin/website", name: "Website CMS Builder", category: "admin", description: "Edit homepage hero, testimonials, service areas, and SEO copy" },
  { path: "/admin/settings", name: "Business Settings", category: "admin", description: "Company profile, phone, tax rates, and branding" },
  { path: "/admin/settings/scheduling", name: "Scheduling Rules & Buffer", category: "admin", description: "Business operating hours, travel buffers, and daily capacities" },
];

export function PageExplorerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "public" | "portal" | "staff" | "admin">("all");
  const [search, setSearch] = useState("");

  const filteredPages = useMemo(() => {
    return ALL_APPLICATION_PAGES.filter((page) => {
      const matchesTab = activeTab === "all" || page.category === activeTab;
      const matchesSearch =
        page.name.toLowerCase().includes(search.toLowerCase()) ||
        page.path.toLowerCase().includes(search.toLowerCase()) ||
        page.description.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/14 bg-brand-dark text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-lime text-brand-dark">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight">Application Page Directory</h3>
                <span className="rounded-full bg-brand-lime/20 px-2.5 py-0.5 text-xs font-bold text-brand-lime">
                  {ALL_APPLICATION_PAGES.length} Pages Available
                </span>
              </div>
              <p className="text-xs text-white/60">
                Select any page below to navigate directly and preview its design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close page directory"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="border-b border-white/10 bg-black/20 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by page name, route path, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/8 pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:border-brand-lime focus:outline-none focus:ring-1 focus:ring-brand-lime"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-0">
            {[
              { id: "all", label: `All (${ALL_APPLICATION_PAGES.length})` },
              { id: "public", label: "Public (27)", icon: Sparkles },
              { id: "portal", label: "Portal (8)", icon: Building2 },
              { id: "staff", label: "Staff (4)", icon: UserCheck },
              { id: "admin", label: "Admin (29)", icon: ShieldAlert },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    active
                      ? "bg-brand-lime text-brand-dark"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Page List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredPages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-brand-lime/40 hover:bg-white/10 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white group-hover:text-brand-lime transition-colors">
                      {page.name}
                    </div>
                    {page.badge ? (
                      <span className="shrink-0 rounded-md bg-brand-lime/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
                        {page.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 font-mono text-xs text-white/50 group-hover:text-white/70">
                    {page.path}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {page.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[11px] font-semibold text-brand-lime opacity-80 group-hover:opacity-100">
                  <span className="capitalize text-white/40">{page.category} section</span>
                  <span className="inline-flex items-center gap-1 group-hover:underline">
                    Open Page <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredPages.length === 0 ? (
            <div className="grid place-items-center py-16 text-center text-white/50">
              <LayoutGrid className="h-10 w-10 stroke-[1.5] mb-2 text-white/30" />
              <p className="text-sm font-semibold">No pages matching &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => { setSearch(""); setActiveTab("all"); }}
                className="mt-3 text-xs font-bold text-brand-lime underline"
              >
                Reset search filters
              </button>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-6 py-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-lime" />
            <span>Ready for styling: mention any page to update its layout</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-white hover:text-brand-lime transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
