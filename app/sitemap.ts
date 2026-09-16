import { MetadataRoute } from "next";
import { getPublicWebsiteServer, siteUrl } from "@/src/lib/websiteServer";
import { cleaningResources } from "@/src/content/resources";
import { publicSlug } from "@/src/lib/publicSlug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = [
    ["", "weekly", 1], ["/about", "monthly", 0.8], ["/team", "monthly", 0.7], ["/services", "weekly", 0.9], ["/how-we-clean", "monthly", 0.8], ["/equipment", "monthly", 0.7], ["/before-after", "monthly", 0.75], ["/reviews", "weekly", 0.75], ["/service-areas", "monthly", 0.8], ["/faq", "monthly", 0.7], ["/careers", "monthly", 0.6], ["/resources", "weekly", 0.7], ["/contact", "monthly", 0.7], ["/book", "monthly", 0.8], ["/quote", "weekly", 0.85], ["/privacy-policy", "yearly", 0.3], ["/terms", "yearly", 0.3], ["/cancellation-policy", "yearly", 0.3], ["/accessibility", "yearly", 0.3],
  ] as const;
  const website = await getPublicWebsiteServer();
  const servicePages: MetadataRoute.Sitemap = (website?.services || []).filter((service)=>service.isActive !== false).map((service)=>({ url: `${base}/services/${service.slug || service._id}`, lastModified: new Date(service.updatedAt || Date.now()), changeFrequency: "weekly", priority: 0.85 }));
  const resourcePages: MetadataRoute.Sitemap = cleaningResources.map((item)=>({url:`${base}/resources/${item.slug}`,lastModified:new Date(),changeFrequency:"monthly",priority:0.55}));
  const areaPages: MetadataRoute.Sitemap = (website?.content.serviceAreas || []).filter((area)=>area.visible).map((area)=>({url:`${base}/service-areas/${publicSlug(area.name)}`,lastModified:new Date(),changeFrequency:"monthly",priority:0.65}));
  return [...pages.map(([path, changeFrequency, priority]) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency, priority })), ...servicePages, ...areaPages, ...resourcePages];
}
