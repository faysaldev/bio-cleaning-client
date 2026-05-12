import {
  Leaf,
  ShieldCheck,
  HeartHandshake,
  Award,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import residential from "@/src/assets/service-residential.jpeg";
import commercial from "@/src/assets/service-commercial.jpeg";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { SiteLayout } from "../Layouts/SiteLayout";
import Link from "next/link";

export default function AboutPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <SiteLayout>
      <div ref={ref}>
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 leaf-bg opacity-50" />
          <div className="container-page relative py-24 text-white text-center">
            <span
              className="pill bg-white/10 text-brand-mint border border-white/10"
              data-reveal
            >
              <Leaf className="w-3.5 h-3.5" /> Eco-Certified Since 2017
            </span>
            <h1 className="text-5xl md:text-6xl font-display mt-5" data-reveal>
              We Are BIO Cleaning
            </h1>
            <p className="mt-4 text-white/80 max-w-xl mx-auto" data-reveal>
              Back In Order — restoring your space, restoring your peace of
              mind.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page grid md:grid-cols-2 gap-12 items-center">
            <img
              src={residential}
              alt="Our team at work"
              loading="lazy"
              width={800}
              height={600}
              className="rounded-2xl shadow-xl"
              data-reveal
            />
            <div>
              <span className="pill" data-reveal>
                — Our Story —
              </span>
              <h2 className="mt-3 text-4xl text-brand-dark" data-reveal>
                A Simple Belief: Every Space Deserves to Be Spotless
              </h2>
              <p className="mt-5 text-muted-foreground" data-reveal>
                Founded in 2017, BIO Cleaning started with two friends, a
                beat-up van, and a vow to never use a toxic cleaner again. Eight
                years later, we're a 50-person team serving thousands of homes
                and businesses — and the promise hasn't changed.
              </p>
              <p className="mt-3 text-muted-foreground" data-reveal>
                Every chemical we use is plant-based, every team member is
                background-checked, and every clean is backed by our happiness
                guarantee.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4" data-reveal-group>
                {[
                  ["8+", "Years"],
                  ["50+", "Team"],
                  ["5.1K+", "Clients"],
                ].map(([n, l]) => (
                  <div
                    key={l}
                    className="rounded-xl bg-brand-cream p-4 text-center"
                  >
                    <div className="text-2xl font-display font-bold text-brand-dark">
                      {n}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-page text-center">
            <span className="pill" data-reveal>
              — Mission & Vision —
            </span>
            <h2 className="text-4xl text-brand-dark mt-3 mb-12" data-reveal>
              What Drives Us Forward
            </h2>
            <div
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              data-reveal-group
            >
              <div className="card-feature text-left">
                <Sparkles className="w-10 h-10 text-brand-green mb-3" />
                <h3 className="text-2xl text-brand-dark">Mission</h3>
                <p className="mt-2 text-muted-foreground">
                  To deliver effortless, eco-conscious cleaning that gives every
                  household and business back the time and calm they deserve.
                </p>
              </div>
              <div className="card-feature text-left">
                <Award className="w-10 h-10 text-brand-yellow mb-3" />
                <h3 className="text-2xl text-brand-dark">Vision</h3>
                <p className="mt-2 text-muted-foreground">
                  A world where professional cleaning never compromises health —
                  for people, pets, or the planet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page text-center">
            <span className="pill" data-reveal>
              — Our Values —
            </span>
            <h2 className="text-4xl text-brand-dark mt-3 mb-12" data-reveal>
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-6" data-reveal-group>
              {[
                {
                  icon: Leaf,
                  title: "Eco-Friendly Commitment",
                  desc: "We use only biodegradable, plant-based products.",
                },
                {
                  icon: ShieldCheck,
                  title: "Reliability & Trust",
                  desc: "Vetted, insured staff who treat your space like their own.",
                },
                {
                  icon: HeartHandshake,
                  title: "Community First",
                  desc: "We hire locally and give back to the neighborhoods we serve.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-feature text-left">
                  <div className="w-12 h-12 rounded-full bg-brand-mint/30 grid place-items-center mb-4">
                    <Icon className="w-6 h-6 text-brand-dark" />
                  </div>
                  <h3 className="text-xl text-brand-dark">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-12">
              <span className="pill" data-reveal>
                — Meet The Team —
              </span>
              <h2 className="text-4xl text-brand-dark mt-3" data-reveal>
                The People Behind The Sparkle
              </h2>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-reveal-group
            >
              {[
                { name: "Maya Rivera", role: "Co-Founder & CEO", c: 1 },
                { name: "Daniel Cho", role: "Co-Founder & COO", c: 2 },
                { name: "Aisha Bennett", role: "Operations Lead", c: 3 },
                { name: "Marcus Lee", role: "Quality Manager", c: 4 },
              ].map((m) => (
                <div
                  key={m.name}
                  className="bg-white rounded-2xl overflow-hidden shadow-card group"
                >
                  <div
                    className="aspect-square"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.7 0.1 ${100 + m.c * 30}), oklch(0.5 0.13 ${140 + m.c * 30}))`,
                    }}
                  />
                  <div className="p-5 text-center">
                    <div className="font-bold text-brand-dark">{m.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {m.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page">
            <div
              className="rounded-3xl overflow-hidden grid md:grid-cols-2 bg-brand-dark text-white"
              data-reveal
            >
              <div className="p-10 md:p-14">
                <span className="pill bg-brand-mint/20 text-brand-mint border border-white/10">
                  — Our Timeline —
                </span>
                <h2 className="text-3xl md:text-4xl mt-3">
                  A Quick Look At Our Journey
                </h2>
                <div className="mt-8 space-y-5 border-l-2 border-brand-green/40 pl-5">
                  {[
                    { y: "2017", t: "Founded with one van and big dreams" },
                    { y: "2019", t: "Crossed 1,000 happy households" },
                    { y: "2021", t: "Expanded into commercial cleaning" },
                    { y: "2023", t: "Certified eco-friendly by Green Seal" },
                    { y: "2025", t: "5,100+ clients & 50+ team members" },
                  ].map((x) => (
                    <div key={x.y} className="relative">
                      <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-brand-yellow ring-4 ring-brand-dark mt-1.5" />
                      <div className="text-brand-yellow font-bold text-sm">
                        {x.y}
                      </div>
                      <div className="text-white/80">{x.t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <img
                src={commercial}
                alt="BIO team"
                className="w-full h-full object-cover min-h-[400px]"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-page text-center">
            <Users className="w-12 h-12 text-brand-green mx-auto" data-reveal />
            <h2
              className="text-3xl md:text-4xl text-brand-dark mt-4"
              data-reveal
            >
              Join the BIO Family
            </h2>
            <p
              className="text-muted-foreground mt-3 max-w-xl mx-auto"
              data-reveal
            >
              We're always growing. Whether you want to work with us or hire us,
              we'd love to hear from you.
            </p>
            <div className="flex justify-center gap-3 mt-7" data-reveal>
              <Link href="/book" className="btn-primary">
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                <Clock className="w-4 h-4" /> Contact Careers
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
