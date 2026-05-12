"use client";

import {
  Home,
  Building2,
  Sparkles,
  Truck,
  ArrowRight,
  Check,
  Calendar,
  Wrench,
  ShieldCheck,
  Star,
  Timer,
  BadgeCheck,
  SprayCan,
  ClipboardCheck,
} from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import residential from "@/src/assets/service-residential.jpeg";
import commercial from "@/src/assets/service-commercial.jpeg";
import deepImg from "@/src/assets/service-deep.jpeg";
import { SiteLayout } from "../Layouts/SiteLayout";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    icon: Home,
    name: "Residential Cleaning",
    img: residential,
    desc: "Regular home cleaning tailored to your schedule. Kitchen, bathrooms, bedrooms, living areas.",
    price: "$49",
    includes: [
      "Dusting & vacuuming",
      "Bathroom sanitizing",
      "Kitchen wipe-down",
      "Trash & linen change",
    ],
  },
  {
    icon: Building2,
    name: "Commercial Cleaning",
    img: commercial,
    desc: "Office and commercial space cleaning. After-hours scheduling available.",
    price: "$99",
    includes: [
      "Workstation sanitizing",
      "Restroom restock",
      "Floor care & vacuum",
      "Lobby & glass cleaning",
    ],
  },
  {
    icon: Sparkles,
    name: "Deep Cleaning",
    img: deepImg,
    desc: "A thorough top-to-bottom clean. Perfect for spring cleaning or first-time clients.",
    price: "$149",
    includes: [
      "Inside appliances",
      "Baseboards & vents",
      "Detailed grout work",
      "Window sills & tracks",
    ],
  },
  {
    icon: Truck,
    name: "Move-In / Move-Out",
    img: residential,
    desc: "Leave your old place spotless or start fresh in your new home.",
    price: "$129",
    includes: [
      "Cabinet interiors",
      "Full appliance clean",
      "Wall spot cleaning",
      "Deposit-back guarantee",
    ],
  },
];

const serviceStats = [
  ["24h", "Fast booking window"],
  ["4.9", "Average client rating"],
  ["100%", "Plant-based supplies"],
  ["5.1K+", "Spaces restored"],
];

const addons = [
  { name: "Window Cleaning", price: "+$25" },
  { name: "Carpet Shampooing", price: "+$45" },
  { name: "Oven Deep Clean", price: "+$30" },
  { name: "Fridge Clean", price: "+$25" },
  { name: "Laundry Folding", price: "+$20" },
  { name: "Pet-Hair Removal", price: "+$15" },
];

export default function ServicesPage() {
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <SiteLayout>
      <div ref={ref}>
        <PageHero
          title="Our Cleaning Services"
          crumb="Home / Services"
          subtitle="From a quick refresh to a full-property reset — pick the perfect plan."
        />

        <section className="py-20">
          <div className="container-page mb-10">
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
              data-reveal-group
            >
              {serviceStats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-white px-5 py-4 shadow-card"
                >
                  <div className="font-display text-3xl font-bold text-brand-dark">
                    {value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="container-page grid md:grid-cols-2 gap-6"
            data-reveal-group
          >
            {services.map(
              ({ icon: Icon, name, desc, price, includes, img }) => (
                <div
                  key={name}
                  className="group card-feature overflow-hidden p-0 border-l-0 hover:border-l-0"
                >
                  <div className="aspect-[16/8] overflow-hidden relative">
                    <Image
                      src={img}
                      alt={name}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/65 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 right-3 pill bg-brand-yellow/95">
                      from {price}
                    </div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-white/90 grid place-items-center">
                      <Icon className="w-6 h-6 text-brand-dark" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl text-brand-dark">{name}</h3>
                    </div>
                    <p className="mt-3 text-muted-foreground">{desc}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {includes.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-2 text-foreground/80"
                        >
                          <Check className="w-3.5 h-3.5 text-brand-green" />{" "}
                          {it}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/book"
                      className="mt-5 inline-flex items-center gap-1 text-brand-green font-semibold story-link"
                    >
                      Book this service <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="py-20 bg-brand-dark text-white overflow-hidden">
          <div className="container-page">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
              <div data-reveal>
                <span className="pill bg-brand-lime text-brand-dark">
                  <Sparkles className="w-3.5 h-3.5" /> Cleaner Operating System
                </span>
                <h2 className="mt-4 text-4xl md:text-5xl">
                  Every service runs on a tighter, calmer checklist
                </h2>
                <p className="mt-5 text-white/70 max-w-xl">
                  We combine trained crews, eco supplies, arrival windows, and a
                  final room-by-room quality pass so your clean feels premium
                  without feeling complicated.
                </p>
                <Link
                  href="/book"
                  className="mt-8 bg-brand-lime text-brand-dark font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:scale-[1.02] transition"
                >
                  Build My Clean <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div
                className="grid sm:grid-cols-2 gap-4"
                data-reveal-group
              >
                {[
                  {
                    icon: ClipboardCheck,
                    title: "Pre-clean brief",
                    copy: "Crew notes, access details, priorities, and supplies are confirmed before arrival.",
                  },
                  {
                    icon: SprayCan,
                    title: "Eco product match",
                    copy: "Surfaces get the right plant-based product for a polished finish without harsh residue.",
                  },
                  {
                    icon: Timer,
                    title: "Timed zones",
                    copy: "Kitchen, bath, living, and detail zones are sequenced for efficient coverage.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Final quality pass",
                    copy: "A closing checklist catches edges, fixtures, floors, and high-touch areas.",
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="text-sm text-white/65 mt-2">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-12">
              <span className="pill" data-reveal>
                — Compare Plans —
              </span>
              <h2 className="mt-3 text-4xl text-brand-dark" data-reveal>
                Find Your Perfect Fit
              </h2>
            </div>
            <div
              data-reveal
              className="overflow-x-auto rounded-2xl border border-border bg-white"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-dark text-white">
                    <th className="text-left p-4">Feature</th>
                    <th className="p-4">Standard</th>
                    <th className="p-4 bg-brand-green">Deep</th>
                    <th className="p-4">Move-In/Out</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Eco-friendly products", true, true, true],
                    ["Inside appliances", false, true, true],
                    ["Baseboards & vents", false, true, true],
                    ["Cabinet interiors", false, false, true],
                    ["Window cleaning", false, true, true],
                    ["Re-clean guarantee", true, true, true],
                  ].map(([label, ...vals], i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-4 font-medium text-brand-dark">
                        {label as string}
                      </td>
                      {(vals as boolean[]).map((v, j) => (
                        <td key={j} className="p-4 text-center">
                          {v ? (
                            <Check className="w-5 h-5 text-brand-green inline" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
              <div data-reveal>
                <span className="pill">— Signature Packages —</span>
                <h2 className="text-4xl text-brand-dark mt-3">
                  Cleaner bundles for real-life mess levels
                </h2>
                <p className="text-muted-foreground mt-4">
                  Choose a starting point, then add any extras. Each package can
                  be customized before checkout.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4" data-reveal-group>
                {[
                  ["Fresh Start", "$89", "Light reset for tidy homes"],
                  ["Deep Reset", "$149", "Detail-heavy clean for busy weeks"],
                  ["Move Ready", "$199", "Deposit-focused top-to-bottom clean"],
                ].map(([name, price, copy], i) => (
                  <div
                    key={name}
                    className={`rounded-3xl p-6 border ${
                      i === 1
                        ? "bg-brand-dark text-white border-brand-dark shadow-2xl"
                        : "bg-white border-border shadow-card"
                    }`}
                  >
                    <div
                      className={`text-xs uppercase tracking-wider ${
                        i === 1 ? "text-brand-lime" : "text-brand-green"
                      }`}
                    >
                      Package {i + 1}
                    </div>
                    <h3 className="text-2xl mt-2">{name}</h3>
                    <div className="font-display text-4xl font-bold mt-5">
                      {price}
                    </div>
                    <p
                      className={`text-sm mt-3 ${
                        i === 1 ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {copy}
                    </p>
                    <Link
                      href="/book"
                      className={`mt-6 inline-flex items-center gap-2 font-bold ${
                        i === 1 ? "text-brand-lime" : "text-brand-green"
                      }`}
                    >
                      Select <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page text-center">
            <span className="pill" data-reveal>
              — Add-ons —
            </span>
            <h2
              className="text-3xl md:text-4xl text-brand-dark mt-3"
              data-reveal
            >
              Customize Any Clean
            </h2>
            <p className="text-muted-foreground mt-2" data-reveal>
              Stack any add-on with your selected service.
            </p>
            <div
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-10 max-w-3xl mx-auto"
              data-reveal-group
            >
              {addons.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-border hover:border-brand-green hover:shadow-md transition cursor-pointer"
                >
                  <span className="font-medium text-brand-dark">{a.name}</span>
                  <span className="text-brand-green font-bold">{a.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-12">
              <span className="pill" data-reveal>
                — Why BIO —
              </span>
              <h2 className="mt-3 text-4xl text-brand-dark" data-reveal>
                What&apos;s Included With Every Service
              </h2>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-reveal-group
            >
              {[
                {
                  icon: ShieldCheck,
                  t: "Insured & Bonded",
                  d: "$2M coverage on every job.",
                },
                {
                  icon: Calendar,
                  t: "Flexible Scheduling",
                  d: "7 days a week, 7am–8pm.",
                },
                {
                  icon: Wrench,
                  t: "We Bring Supplies",
                  d: "Eco products and equipment.",
                },
                {
                  icon: Star,
                  t: "Happiness Guarantee",
                  d: "Free re-clean within 24h.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="card-feature">
                  <Icon className="w-9 h-9 text-brand-green mb-3" />
                  <h3 className="text-lg text-brand-dark">{t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page">
            <div
              className="rounded-3xl bg-brand-yellow p-12 text-center"
              data-reveal
            >
              <h2 className="text-3xl md:text-4xl text-brand-dark">
                Not sure which service is right for you?
              </h2>
              <p className="text-brand-dark/70 mt-3 max-w-lg mx-auto">
                Talk to a BIO specialist — we&apos;ll recommend the perfect
                package for your space.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                <Link
                  href="/contact"
                  className="bg-brand-dark text-white font-bold px-7 py-3.5 rounded-full hover:bg-brand-green transition inline-flex items-center gap-2"
                >
                  Talk to Us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/book" className="btn-secondary">
                  Book Online
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function PageHero({
  title,
  crumb,
  subtitle,
}: {
  title: string;
  crumb: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <Image
        src={deepImg}
        alt="Premium deep cleaning service"
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/80 to-brand-green/70" />
      <div className="absolute inset-0 leaf-bg opacity-50" />
      <div className="container-page relative py-24 md:py-28 text-white text-center">
        <div className="text-sm text-brand-mint mb-4" data-reveal>
          {crumb}
        </div>
        <h1
          className="text-5xl md:text-7xl font-display max-w-4xl mx-auto"
          data-reveal
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-white/80 max-w-2xl mx-auto" data-reveal>
            {subtitle}
          </p>
        )}
        <div
          className="mt-8 flex flex-wrap justify-center gap-3"
          data-reveal
        >
          <Link href="/book" className="btn-primary">
            Book a Clean <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn-ghost-light">
            Ask a Specialist
          </Link>
        </div>
      </div>
    </section>
  );
}
