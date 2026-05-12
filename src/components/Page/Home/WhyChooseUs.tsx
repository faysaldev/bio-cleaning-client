import { BadgeCheck, Clock, Leaf, ShieldCheck } from "lucide-react";
import whyChoose from "@/src/assets/why-choose.jpeg";

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
        <div className="text-center mb-14">
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

        <div
          className="grid lg:grid-cols-5 gap-6 items-stretch"
          data-reveal-group
        >
          <div className="lg:col-span-2 rounded-3xl overflow-hidden">
            <img
              src={whyChoose}
              alt="Bright clean living room"
              loading="lazy"
              className="w-full h-full object-cover min-h-[380px]"
            />
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
      </div>
    </section>
  );
}
