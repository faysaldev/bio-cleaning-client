import { MetadataRoute } from "next";
import { getPublicWebsiteServer, siteUrl } from "@/src/lib/websiteServer";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const website = await getPublicWebsiteServer();
  const seo = website?.content.seo;
  const allow = seo?.robotsIndex === false ? [] : ["/"];
  return { rules: { userAgent: "*", allow, disallow: ["/admin/", "/staff/", "/portal/", "/preview/"] }, sitemap: `${siteUrl()}/sitemap.xml` };
}
