# BIO Cleaning LLC - Professional Eco-Friendly Cleaning Platform

![BIO Cleaning LLC Banner](https://bio-cleaning-llc.vercel.app/og-image.jpg)

BIO Cleaning LLC is a high-performance, full-stack cleaning service management platform. It solves the friction of traditional manual booking by providing a sophisticated, automated engine for both residential and commercial clients, paired with a robust administrative control center.

---

## 🚀 Live Ecosystem
- **Frontend (Live)**: [https://bio-cleaning-llc.vercel.app/](https://bio-cleaning-llc.vercel.app/)
- **Backend (Source)**: [https://github.com/faysaldev/bio-cleaning-backends](https://github.com/faysaldev/bio-cleaning-backends)

---

## 🔐 Administrative Access
To manage the operational side of the business, log in at `/admin/login`:

- **Admin Email**: `faysaladmin@gmail.com`
- **Admin Password**: `Password123@`

---

## 🛠 The Problem We Solve
Traditional cleaning businesses often rely on phone calls, delayed email quotes, and manual scheduling, leading to:
- **Inefficiency**: Long wait times for price estimates.
- **Scheduling Errors**: Double-bookings and manual calendar management.
- **Low Engagement**: Static websites that don't allow for immediate customer conversion.
- **Opaque Tracking**: Customers and admins lack a real-time view of service status.

**BIO Cleaning LLC** bridges this gap with an automated "Cleaning-as-a-Service" (CaaS) model, ensuring instant bookings and transparent operations.

---

## 📖 User Guide: How to Use

### For Customers (The Booking Engine)
1. **Discover Services**: Browse through eco-friendly cleaning packages (Deep Clean, Residential, etc.) with live pricing.
2. **Instant Booking**: Use the 4-step booking engine:
   - **Step 1**: Select Service & Property Size (Studio to 4BR+).
   - **Step 2**: Choose a Date & real-time available Time Slot.
   - **Step 3**: Provide contact and address details.
   - **Step 4**: Review the instant quote and confirm the reservation.
3. **Automated Tracking**: Receive a unique reference number (e.g., `BIO-10005`) for order tracking.

### For Administrators (The Management Desk)
1. **Operations Dashboard**: View real-time revenue stats, booking counts, and recent customer activity.
2. **Booking Orchestration**:
   - Navigate to **Bookings** to see all incoming requests.
   - **PENDING**: Review and "Confirm" or "Cancel" requests.
   - **CONFIRMED**: Mark as "Completed" once the cleaning is finished.
3. **Manual Bookings**: Create reservations directly in the system for customers who call in or walk in.
4. **Service Builder**: 
   - Dynamically add new cleaning types or adjust prices.
   - Toggle "Publish/Unpublish" to manage site visibility instantly.
5. **Contact Moderation**: 
   - View all customer inquiries in a centralized list.
   - Use the **Bottom Drawer Reply** system to provide professional feedback.

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Redux Toolkit & RTK Query (Real-time data fetching)
- **Animations**: GSAP (Smooth visual reveals and transitions)
- **Styling**: Vanilla CSS with modern Design Tokens & HSL color palettes
- **SEO**: Dynamic Metadata API, Sitemap.xml, and Robots.txt generation

### Backend Infrastructure
- **Language**: TypeScript / Node.js
- **Database**: MongoDB (Scalable document storage)
- **API**: Express.js with standardized RESTful patterns
- **Validation**: Zod (End-to-end type safety)

---

## 🛠 Local Setup & Installation

1. **Clone & Enter**:
   ```bash
   git clone https://github.com/faysaldev/bio-cleaning-client.git
   cd bio-cleaning-client
   ```

2. **Dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment**:
   Set `NEXT_PUBLIC_BASE_URL` in `.env.local` to point to your backend API.

4. **Dev Server**:
   ```bash
   pnpm dev
   ```

---

## 📈 SEO & Performance
- **Dynamic Meta Tags**: Services page metadata is generated dynamically from live API data.
- **Sitemap**: Automatically generated for all public routes.
- **Core Web Vitals**: Optimized for LCP (Largest Contentful Paint) using Next.js Image and font optimization.

---

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
