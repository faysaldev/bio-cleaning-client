import type { WebsitePublicPayload } from "@/src/redux/features/website/types";

export async function getPublicWebsiteServer(): Promise<WebsitePublicPayload | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return null;
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/website/public`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://bio-cleaning-llc.vercel.app";
