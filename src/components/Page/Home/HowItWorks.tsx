import { ArrowRight, CalendarCheck, ClipboardCheck, Home, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Free Quote",
      desc: "Tell us about your space — get a transparent estimate in minutes.",
      lime: true,
      icon: ClipboardCheck,
    },
    {
      n: "02",
      title: "Pick a Date",
      desc: "Book online or call. Same-day & weekend slots available.",
      lime: false,
      icon: CalendarCheck,
    },
    {
      n: "03",
      title: "Custom Plan",
      desc: "We tailor the checklist to your home or business needs.",
      lime: false,
      icon: ClipboardCheck,
    },
    {
      n: "04",
      title: "We Clean",
      desc: "A vetted team arrives with all eco supplies and equipment.",
      lime: false,
      icon: Sparkles,
    },
    {
      n: "05",
      title: "Walkthrough",
      desc: "Inspect with our lead cleaner before we leave.",
      lime: false,
      icon: ClipboardCheck,
    },
    {
      n: "06",
      title: "Enjoy",
      desc: "Relax in a spotless, fresh-smelling space. Re-clean on us if needed.",
      lime: true,
      icon: Home,
    },
  ];
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container-page">
        <div className="text-center mb-14">
          <span className="pill" data-reveal>
            — Our Process —
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl text-brand-dark font-display"
            data-reveal
          >
            How does it work?
          </h2>
          <p
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
            data-reveal
          >
            Six simple steps from first contact to a sparkling-clean space.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-group>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
            <div
              key={s.n}
              className={`group relative rounded-3xl p-7 min-h-72 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                ${s.lime ? "bg-brand-lime text-brand-dark" : "bg-white text-brand-dark border border-border"}`}
            >
              <div className="relative z-10">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-base font-bold bg-brand-dark text-brand-lime shadow-lg"
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="mt-8 text-xs uppercase tracking-[0.25em] opacity-60">
                  Step {s.n}
                </div>
                <h3 className="mt-5 text-2xl font-display">{s.title}</h3>
                <p className="text-sm mt-3 opacity-75 leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold">
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-brand-green/10 transition group-hover:scale-125" />
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
