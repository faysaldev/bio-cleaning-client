"use client";
import Image from "next/image";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import { UsersRound } from "lucide-react";

export default function TeamPage() {
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const team = website?.content.team;
  const members = team?.members?.filter((m) => m.visible).sort((a,b)=>a.order-b.order) || [];
  return <SiteLayout website={website}><section className="bg-brand-dark py-24 text-white"><div className="container-page text-center"><span className="pill bg-brand-lime text-brand-dark"><UsersRound className="h-4 w-4" /> {team?.eyebrow || "Our Team"}</span><h1 className="mt-5 text-5xl md:text-6xl">{team?.title || "The people behind the sparkle"}</h1><p className="mx-auto mt-4 max-w-2xl text-white/65">{team?.intro}</p></div></section><section className="py-20"><div className="container-page">{members.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{members.map((member) => <article key={member.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card"><div className="relative aspect-[4/3] bg-brand-cream">{member.imageUrl ? <Image src={member.imageUrl} alt={member.name} fill unoptimized className="object-cover" /> : <div className="grid h-full place-items-center text-4xl font-extrabold text-brand-green/40">{member.name.charAt(0)}</div>}</div><div className="p-6"><h2 className="text-xl font-bold text-brand-dark">{member.name}</h2><div className="mt-1 text-sm font-semibold text-brand-green">{member.role}</div><p className="mt-3 text-sm leading-6 text-muted-foreground">{member.bio}</p></div></article>)}</div> : <div className="surface-subtle p-12 text-center text-muted-foreground">Public team profiles are being prepared.</div>}</div></section></SiteLayout>;
}
