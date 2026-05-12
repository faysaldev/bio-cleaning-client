import { BadgeCheck, Clock, Leaf, ShieldCheck } from "lucide-react";
import whyChoose from "@/src/assets/why-choose.jpeg";
import Image from "next/image";

export default function WhyChooseUs() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Trusted Pros",
      desc: "Background-checked, insured, and trained to BIO standards.",
      lime: false,
    },
    {
      icon: Leaf,
      title: "Eco Products",
      desc: "Plant-based supplies safe for kids, pets, and the planet.",
      lime: true,
    },
    {
      icon: Clock,
      title: "Always on Time",
      desc: "We arrive in your scheduled window — guaranteed.",
      lime: false,
    },
    {
      icon: BadgeCheck,
      title: "Satisfaction First",
      desc: "Not happy? We re-clean for free, no questions asked.",
      lime: true,
    },
  ];
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-end mb-14">
          <div>
          <span className="pill" data-reveal>
            — Why Us —
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl text-brand-dark font-display"
            data-reveal
          >
            Why choose us as your cleaning partner?
          </h2>
          </div>
          <p className="text-muted-foreground lg:text-lg" data-reveal>
            We pair a hospitality-level client experience with trained cleaners,
            clear systems, and products that are tough on mess without being
            harsh on your home.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-5 gap-6 items-stretch"
          data-reveal-group
        >
          <div className="lg:col-span-2 rounded-3xl overflow-hidden relative min-h-[420px]">
            <Image
              src={whyChoose}
              alt="Bright clean living room"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/12 border border-white/10 p-5 text-white backdrop-blur-md">
              <div className="text-brand-lime text-sm font-semibold">
                BIO Promise
              </div>
              <div className="font-display text-2xl mt-1">
                Clean, calm, and completely handled.
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, desc, lime }) => (
              <div
                key={title}
                className={`rounded-3xl p-7 transition hover:-translate-y-1 ${lime ? "bg-brand-lime text-brand-dark" : "bg-brand-cream text-brand-dark"}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl grid place-items-center mb-5 ${lime ? "bg-brand-dark text-brand-lime" : "bg-brand-dark text-brand-lime"}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display">{title}</h3>
                <p className="text-sm mt-2 opacity-80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="mt-6 grid md:grid-cols-3 gap-4"
          data-reveal-group
        >
          {[
            ["01", "Transparent pricing before arrival"],
            ["02", "Eco-first products and equipment"],
            ["03", "Re-clean support within 24 hours"],
          ].map(([n, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-brand-dark text-white p-5 flex items-center gap-4"
            >
              <span className="font-display text-3xl text-brand-lime">
                {n}
              </span>
              <span className="text-sm text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
