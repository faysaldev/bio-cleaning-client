import { MetadataRoute } from "next";
import { siteUrl } from "@/src/lib/websiteServer";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = [
    ["", "weekly", 1], ["/about", "monthly", 0.8], ["/team", "monthly", 0.7], ["/services", "weekly", 0.9], ["/contact", "monthly", 0.7], ["/book", "monthly", 0.8], ["/quote", "weekly", 0.85], ["/privacy-policy", "yearly", 0.3], ["/terms", "yearly", 0.3], ["/cancellation-policy", "yearly", 0.3], ["/accessibility", "yearly", 0.3],
  ] as const;
  return pages.map(([path, changeFrequency, priority]) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency, priority }));
}
