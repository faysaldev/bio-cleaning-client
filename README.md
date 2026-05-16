# BIO Cleaning LLC - Professional Eco-Friendly Cleaning Services

![BIO Cleaning LLC](https://bio-cleaning-llc.vercel.app/og-image.jpg)

BIO Cleaning LLC is a premium, professional cleaning service platform built with Next.js and high-performance backend architecture. This project provides a seamless booking experience for residential and commercial clients while offering a robust administrative dashboard for service moderation and order management.

## 🚀 Live Links
- **Frontend (Live)**: [https://bio-cleaning-llc.vercel.app/](https://bio-cleaning-llc.vercel.app/)
- **Backend (Source)**: [https://github.com/faysaldev/bio-cleaning-backends](https://github.com/faysaldev/bio-cleaning-backends)

---

## 🔐 Administrative Access
To manage services, view bookings, and respond to customer inquiries, use the following credentials on the `/admin/login` page:

- **Email**: `faysaladmin@gmail.com`
- **Password**: `Password123@`

---

## ✨ Features

### 🏠 Client Platform
- **Dynamic Booking Flow**: Intelligent multi-step booking system with real-time price estimation and slot availability checks.
- **Service Discovery**: Explore detailed cleaning packages including Deep Cleans, Move-In/Out, and Commercial services.
- **Eco-Friendly Focus**: Built with sustainability in mind, highlighting green cleaning values.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **SEO Optimized**: Advanced metadata, OpenGraph, and JSON-LD for maximum search engine visibility.

### 🛠 Administrative Dashboard
- **Operational Command Center**: Real-time stats on revenue, bookings, and customer growth.
- **Booking Management**: Review, confirm, or cancel reservations with automated status tracking.
- **Service Builder**: Create, edit, and publish new cleaning packages dynamically.
- **Inquiry Moderation**: A dedicated hub to view and reply to customer contact messages via a professional bottom-drawer interface.
- **Secure Authentication**: Protected routes with secure login and session management.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Vanilla CSS with modern Design Tokens
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React

### Backend (Infrastructure)
- **Language**: TypeScript / Node.js
- **Framework**: Express / NestJS
- **Database**: MongoDB / PostgreSQL
- **Security**: JWT & Role-Based Access Control

---

## 🛠 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/faysaldev/bio-cleaning-client.git
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your backend URL:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:9500/api/v1
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

---

## 📈 SEO Implementation
The project follows modern SEO best practices:
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<footer>`, and heading hierarchy.
- **Metadata API**: Dynamic titles and descriptions for every page.
- **OpenGraph**: Rich social sharing cards for platforms like Facebook and LinkedIn.
- **Performance**: Optimized images and code-splitting for near-instant load times.

---

## 📄 License
This project is licensed under the MIT License.
