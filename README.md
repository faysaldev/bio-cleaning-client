# BIO Cleaning LLC — Frontend Web Client & Enterprise Portals

![BIO Cleaning LLC Banner](https://bio-cleaning-llc.vercel.app/og-image.jpg)

This is the high-performance Next.js web application for **BIO Cleaning LLC**. It integrates a conversion-focused marketing website, an 8-step real-time booking engine, a customer self-service portal, a dedicated mobile field operations workspace for cleaning staff, and an administrative control center (ERP).

---

## 🚀 Live Ecosystem & Credentials

- **Frontend Application**: [https://bio-cleaning-llc.vercel.app/](https://bio-cleaning-llc.vercel.app/)
- **Backend API**: [https://bio-cleaning-backends.vercel.app/](https://bio-cleaning-backends.vercel.app/)
- **Admin Access**: `/admin/login` (`faysaladmin@gmail.com` / `Password123@`)
- **Staff Field Access**: `/staff/login`
- **Customer Self-Service**: `/portal/login` (Passwordless Magic Link)

---

## 🛠 Tech Stack & Architecture

- **Framework**: Next.js 16.2.6 (React 19.2.4) App Router
- **State Management**: Redux Toolkit 2.11 + RTK Query
  - Automatic silent session refresh on `401 Unauthorized`
  - Dual CSRF protection (`x-csrf-token` for admin/staff, `x-portal-csrf` for customer portal)
  - 24 Tag Types for fine-grained cache invalidation
- **Styling**: Tailwind CSS v4 with custom design tokens (`globals.css`, `local.css`)
- **Animations**: GSAP 3.15 + Custom Scroll Hooks (`useGsapReveal`, `useHomeCinematic`)
- **Icons & Primitives**: Lucide React, Radix UI headless primitives
- **SEO & Web Vitals**: Dynamic Metadata API, auto-generated `sitemap.ts` and `robots.ts`, OpenGraph previews

---

## 📱 Application Workspaces

### 1. Public Marketing & Conversion Engine
- **Homepage (`/`)**: Cinematic video hero, instant quote bar, interactive before-and-after slider, equipment showcase, verified reviews, and FAQ.
- **Booking Engine (`/book`)**: 8-step wizard:
  1. *Service Selection* (Standard, Deep Clean, Move-in/Move-out, Post-construction)
  2. *Property Dimensions* (Square footage, bedrooms, bathrooms, condition)
  3. *Addon Extras* (Inside fridge, inside oven, windows, eco sanitization)
  4. *Frequency* (One-time, weekly, bi-weekly, monthly discounts)
  5. *Schedule* (Real-time capacity slot availability calendar)
  6. *Contact & Address*
  7. *Payment Option* (Pay Later, Card Deposit, Full Prepay)
  8. *Confirmation & Abandonment Recovery*
- **Instant Quote Tool (`/quote`)**: Real-time pricing calculator for residential and commercial spaces.
- **Public Management (`/booking/manage`)**: Self-service appointment cancellation, rescheduling, and payment without logging in.
- **Public Token Views**:
  - `/estimate/[token]`: Customer interactive estimate approval / decline
  - `/invoice/[token]`: Secure customer invoice payment & PDF receipt
  - `/review/[token]`: Verified review collection form
  - `/preview/[token]`: CMS draft live preview

### 2. Customer Self-Service Portal (`/portal`)
- **Passwordless Auth**: Instant one-time magic links sent directly to customer email.
- **Appointments (`/portal/bookings`)**: Upcoming visit schedule, cleaner arrival status, 1-click rebooking.
- **Invoices & Receipts (`/portal/invoices`, `/portal/payments`)**: Statement downloads and card payments.
- **Profile & Notifications (`/portal/profile`, `/portal/notifications`)**: Address management, notifications inbox.

### 3. Cleaner Field Operations Portal (`/staff`)
- **Mobile-First Interface**: Designed for in-field smartphone use.
- **Daily Jobs (`/staff`)**: Assigned jobs, property addresses, access notes, and lockbox codes.
- **Digital Job Execution (`/staff/jobs/[id]`)**: Room-by-room digital checklist, before/after camera photo uploads, internal notes, and incident reporting.

### 4. Admin Enterprise Control Center (`/admin`)
- **Command Palette (`⌘K` / `Ctrl+K`)**: Rapid global navigation and search.
- **CRM Leads & Pipeline (`/admin/leads`)**: Kanban board, follow-up scheduler, CSV lead importer, 1-click customer/booking conversion.
- **Dispatch Calendar (`/admin/dispatch`, `/admin/jobs`)**: Real-time dispatching and crew assignment.
- **Invoicing & Payments (`/admin/invoices`, `/admin/payments`)**: Automated invoice generation (`INV-XXXXX`), Stripe payment links, manual cash/check logging, refund issuance.
- **Website CMS (`/admin/website`)**: Visual editor for landing page copy, FAQs, service areas, SEO meta tags, revision restore, and draft previews.
- **Security Audit Logs (`/admin/audit-logs`)**: Immutable log of administrative actions, actor IDs, IP hashes, and durations.
- **Business Intelligence (`/admin/reports`, `/admin/dashboard`)**: 30-day comparative revenue, booking volume, cleaner utilization, and customer retention metrics.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Full backend API root with /api/v1 prefix
NEXT_PUBLIC_BASE_URL=http://localhost:9500/api/v1

# Public canonical website origin for sitemaps and preview links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### 1. Installation
```bash
pnpm install
```

### 2. Type Checking & Verification
```bash
pnpm run typecheck
```

### 3. Running Locally
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
pnpm run build
pnpm run start
```

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
