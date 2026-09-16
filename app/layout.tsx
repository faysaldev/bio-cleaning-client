import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Urbanist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/src/Provider/ReduxProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://bio-cleaning-llc.vercel.app/"),
  title: {
    default: "BIO Cleaning LLC | Professional Eco-Friendly Cleaning Services",
    template: "%s | BIO Cleaning LLC",
  },
  description:
    "BIO Cleaning LLC provides professional, eco-friendly residential and commercial cleaning services. Book your deep clean, move-in/out, or recurring service today.",
  keywords: [
    "cleaning services",
    "eco-friendly cleaning",
    "residential cleaning",
    "commercial cleaning",
    "deep cleaning",
    "move-in cleaning",
    "professional cleaners",
  ],
  authors: [{ name: "BIO Cleaning Team" }],
  creator: "BIO Cleaning LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bio-cleaning-llc.vercel.app/",
    siteName: "BIO Cleaning LLC",
    title: "BIO Cleaning LLC | Expert Cleaning for Home & Office",
    description:
      "Premium, sustainable cleaning services tailored to your needs. Residential, Commercial, and specialized deep cleaning.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BIO Cleaning LLC Professional Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIO Cleaning LLC | Expert Cleaning for Home & Office",
    description: "Premium, sustainable cleaning services tailored to your needs.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
