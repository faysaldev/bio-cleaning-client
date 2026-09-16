"use client";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";

type PolicyKey = "privacy" | "terms" | "cancellation" | "accessibility";
export function PolicyPage({ policy, title }: { policy: PolicyKey; title: string }) {
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const text = website?.content.policies[policy] || "This policy is being updated. Please contact BIO Cleaning if you need assistance.";
  return <SiteLayout website={website}><section className="bg-brand-dark py-20 text-white"><div className="container-page max-w-4xl"><div className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-lime">Policies</div><h1 className="mt-4 text-4xl md:text-6xl">{title}</h1></div></section><section className="py-16"><article className="container-page max-w-4xl whitespace-pre-wrap text-base leading-8 text-foreground/80">{text}</article></section></SiteLayout>;
}
