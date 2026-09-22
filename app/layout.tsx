import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Urbanist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/src/Provider/ReduxProvider";
import { getPublicWebsiteServer, siteUrl } from "@/src/lib/websiteServer";

export const viewport: Viewport = {
  themeColor: "#0C3629",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const website = await getPublicWebsiteServer();
  const seo = website?.content.seo;
  const branding = website?.content.branding;
  const base = siteUrl();
  const titleTemplate = seo?.titleTemplate?.includes("%s")
    ? seo.titleTemplate
    : `%s | ${seo?.siteTitle || branding?.siteName || "BIO Cleaning"}`;

  return {
    metadataBase: new URL(base),
    title: {
      default: seo?.siteTitle || branding?.siteName || "BIO Cleaning",
      template: titleTemplate,
    },
    description:
      seo?.defaultDescription ||
      "Professional residential and commercial cleaning with convenient online booking.",
    keywords: seo?.keywords || [
      "cleaning services",
      "residential cleaning",
      "commercial cleaning",
      "eco friendly cleaning",
      "plant based cleaning products",
    ],
    authors: [{ name: branding?.siteName || "BIO Cleaning" }],
    creator: branding?.siteName || "BIO Cleaning",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: base,
      siteName: branding?.siteName || "BIO Cleaning",
      title: seo?.siteTitle || branding?.siteName || "BIO Cleaning",
      description: seo?.defaultDescription,
      images: seo?.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.siteTitle || branding?.siteName || "BIO Cleaning",
      description: seo?.defaultDescription,
      images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
    },
    icons: branding?.faviconUrl
      ? { icon: branding.faviconUrl, apple: branding.faviconUrl }
      : undefined,
  };
}

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground antialiased selection:bg-brand-lime selection:text-brand-dark">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
