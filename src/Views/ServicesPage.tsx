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
} from "lucide-react";
import { useGsapReveal } from "@/src/hooks/useGsapReveal";
import residential from "@/assets/service-residential.jpg";
import commercial from "@/assets/service-commercial.jpg";
import deepImg from "@/assets/service-deep.jpg";
import { SiteLayout } from "../Layouts/SiteLayout";
import Link from "next/link";

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
          <div
            className="container-page grid md:grid-cols-2 gap-6"
            data-reveal-group
          >
            {services.map(
              ({ icon: Icon, name, desc, price, includes, img }) => (
                <div key={name} className="card-feature overflow-hidden p-0">
                  <div className="aspect-[16/8] overflow-hidden relative">
                    <img
                      src={img}
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 pill bg-brand-yellow/95">
                      from {price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-brand-mint/30 grid place-items-center shrink-0">
                        <Icon className="w-6 h-6 text-brand-dark" />
                      </div>
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
                What's Included With Every Service
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
                Talk to a BIO specialist — we'll recommend the perfect package
                for your space.
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
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 leaf-bg opacity-50" />
      <div className="container-page relative py-20 text-white text-center">
        <div className="text-sm text-brand-mint mb-3" data-reveal>
          {crumb}
        </div>
        <h1 className="text-5xl md:text-6xl font-display" data-reveal>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/80 max-w-xl mx-auto" data-reveal>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
