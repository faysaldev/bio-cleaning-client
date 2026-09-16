import HomePage from "@/src/Views/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Website draft preview", robots: { index: false, follow: false } };

export default async function WebsitePreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <HomePage previewToken={token} />;
}
