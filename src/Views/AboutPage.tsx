"use client";

import { Award, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import residential from "@/src/assets/service-residential.jpeg";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import { SiteLayout } from "@/src/Layouts/SiteLayout";
import { useGetPublicWebsiteQuery } from "@/src/redux/features/website/websiteApi";
import Image from "next/image";
import Link from "next/link";

const icons = [Leaf, ShieldCheck, HeartHandshake, Award];

export default function AboutPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  const { data } = useGetPublicWebsiteQuery();
  const website = data?.data;
  const content = website?.content;
  const about = content?.about;
  const team = content?.team.members?.filter((member) => member.visible).sort((a, b) => a.order - b.order) || [];
  const media = about?.mediaUrl || residential;

  return <SiteLayout website={website}><div ref={ref}>
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}><div className="absolute inset-0 leaf-bg opacity-50" /><div className="container-page relative py-24 text-center text-white"><span className="pill border border-white/10 bg-white/10 text-brand-mint" data-reveal><Leaf className="h-3.5 w-3.5" /> {about?.eyebrow || "About BIO Cleaning"}</span><h1 className="mt-5 text-5xl font-display md:text-6xl" data-reveal>{about?.title || "We Are BIO Cleaning"}</h1><p className="mx-auto mt-4 max-w-2xl text-white/80" data-reveal>{about?.intro || "Back In Order — restoring your space, restoring your peace of mind."}</p></div></section>

    <section className="py-20"><div className="container-page grid items-center gap-12 md:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl" data-reveal><Image src={media} alt="BIO Cleaning team at work" fill unoptimized={typeof media === "string" && media.startsWith("http")} className="object-cover" /></div><div><span className="pill" data-reveal>— Our Story —</span><h2 className="mt-3 text-4xl text-brand-dark" data-reveal>{about?.storyTitle || "A Simple Belief: Every Space Deserves to Be Spotless"}</h2><div className="mt-5 space-y-4 text-muted-foreground" data-reveal>{(about?.storyParagraphs?.length ? about.storyParagraphs : ["BIO Cleaning combines trained teams, clear systems, thoughtful products, and reliable communication."]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></div></section>

    <section className="bg-brand-cream py-20"><div className="container-page text-center"><span className="pill" data-reveal>— Mission & Vision —</span><h2 className="mb-12 mt-3 text-4xl text-brand-dark" data-reveal>What drives us forward</h2><div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" data-reveal-group><div className="card-feature text-left"><Leaf className="mb-3 h-10 w-10 text-brand-green" /><h3 className="text-2xl text-brand-dark">Mission</h3><p className="mt-2 text-muted-foreground">{about?.mission || "To make professional cleaning easier to book, easier to trust, and easier to manage."}</p></div><div className="card-feature text-left"><Award className="mb-3 h-10 w-10 text-brand-yellow" /><h3 className="text-2xl text-brand-dark">Vision</h3><p className="mt-2 text-muted-foreground">{about?.vision || "A cleaner service experience for homes, workplaces, people, pets, and the planet."}</p></div></div></div></section>

    <section className="py-20"><div className="container-page text-center"><span className="pill" data-reveal>— Our Values —</span><h2 className="mb-12 mt-3 text-4xl text-brand-dark" data-reveal>What we stand for</h2><div className="grid gap-6 md:grid-cols-3" data-reveal-group>{(about?.values || []).map((value, index) => { const Icon = icons[index % icons.length]; return <div key={value.id} className="card-feature text-left"><div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-mint/30"><Icon className="h-6 w-6 text-brand-dark" /></div><h3 className="text-xl text-brand-dark">{value.title}</h3><p className="mt-2 text-sm text-muted-foreground">{value.description}</p></div>; })}</div></div></section>

    <section className="bg-brand-dark py-20 text-white"><div className="container-page"><div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><span className="pill bg-brand-lime text-brand-dark" data-reveal>{content?.team.eyebrow || "Meet the team"}</span><h2 className="mt-4 text-4xl md:text-5xl" data-reveal>{content?.team.title || "The people behind the sparkle"}</h2><p className="mt-3 max-w-2xl text-white/65">{content?.team.intro}</p></div><Link href="/team" className="btn-primary w-fit">Meet the full team</Link></div>{team.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>{team.slice(0,4).map((member) => <article key={member.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"><div className="relative aspect-[4/3] bg-white/5">{member.imageUrl ? <Image src={member.imageUrl} alt={member.name} fill unoptimized className="object-cover" /> : null}</div><div className="p-5"><h3 className="text-xl font-bold">{member.name}</h3><div className="mt-1 text-sm font-semibold text-brand-lime">{member.role}</div><p className="mt-3 text-sm text-white/60">{member.bio}</p></div></article>)}</div> : <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/60">Team profiles can be published from the Website workspace.</div>}</div></section>
  </div></SiteLayout>;
}
