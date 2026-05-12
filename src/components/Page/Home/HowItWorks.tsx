import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Free Quote",
      desc: "Tell us about your space — get a transparent estimate in minutes.",
      lime: true,
    },
    {
      n: "02",
      title: "Pick a Date",
      desc: "Book online or call. Same-day & weekend slots available.",
      lime: false,
    },
    {
      n: "03",
      title: "Custom Plan",
      desc: "We tailor the checklist to your home or business needs.",
      lime: false,
    },
    {
      n: "04",
      title: "We Clean",
      desc: "A vetted team arrives with all eco supplies and equipment.",
      lime: false,
    },
    {
      n: "05",
      title: "Walkthrough",
      desc: "Inspect with our lead cleaner before we leave.",
      lime: false,
    },
    {
      n: "06",
      title: "Enjoy",
      desc: "Relax in a spotless, fresh-smelling space. Re-clean on us if needed.",
      lime: true,
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
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-reveal-group
        >
          {steps.map((s) => (
            <div
              key={s.n}
              className={`group relative rounded-3xl p-7 h-64 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                ${s.lime ? "bg-brand-lime text-brand-dark" : "bg-white text-brand-dark border border-border"}`}
            >
              {/* Default state */}
              <div className="relative z-10 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-3">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-base font-bold bg-brand-dark text-brand-lime shadow-lg`}
                >
                  {s.n}
                </div>
                <h3 className="mt-5 text-2xl font-display">{s.title}</h3>
                <p className="text-sm mt-2 opacity-70">Hover to learn more →</p>
              </div>

              {/* Hover popup */}
              <div className="absolute inset-0 p-7 flex flex-col justify-end opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out bg-brand-dark text-white">
                <div className="absolute top-6 right-6 text-7xl font-display font-bold text-brand-lime/20 leading-none">
                  {s.n}
                </div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-brand-lime mb-3">
                    <span className="w-6 h-px bg-brand-lime" /> Step {s.n}
                  </div>
                  <h3 className="text-2xl font-display mb-3">{s.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-brand-lime text-xs font-semibold">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-brand-lime/10 blur-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
