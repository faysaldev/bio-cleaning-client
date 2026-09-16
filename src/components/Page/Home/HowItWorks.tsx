import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import { CalendarCheck, ClipboardCheck, Home, Sparkles, UserCheck, WandSparkles } from "lucide-react";

const steps = [
  { n: "01", title: "Tell us about the space", desc: "Choose the service, property details, and priorities.", icon: ClipboardCheck },
  { n: "02", title: "Choose a real time", desc: "Pick an available day and arrival window online.", icon: CalendarCheck },
  { n: "03", title: "We prepare the plan", desc: "The scope, notes, and service requirements stay together.", icon: WandSparkles },
  { n: "04", title: "Your crew arrives", desc: "A vetted team brings the required products and equipment.", icon: UserCheck },
  { n: "05", title: "We clean + verify", desc: "The job follows the BIO path and closes with quality control.", icon: Sparkles },
  { n: "06", title: "You get the space back", desc: "Walk in to a reset home or workplace, ready to use.", icon: Home },
];

export default function HowItWorks({ section }: { section?: WebsiteHomepageSection }) {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 text-white md:py-32">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div data-cinema-reveal>
            <span className="editorial-kicker border-white/14 bg-white/7 text-brand-lime">{section?.eyebrow || "From booking to handoff"}</span>
            <h2 className="mt-5 text-4xl md:text-5xl">{section?.title || "One clear path. No cleaning-day guesswork."}</h2>
          </div>
          <p className="max-w-2xl text-white/58 lg:justify-self-end" data-cinema-reveal>
            {section?.subtitle || "The website, scheduling flow, and cleaning team all follow the same job information so what you requested online is what the crew sees on arrival."}
          </p>
        </div>

        <div className="relative mt-14" data-cinema-group>
          <div className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-white/14 lg:block" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map(({ n, title, desc, icon: Icon }) => (
              <article key={n} className="relative border-t border-white/12 pt-5 lg:border-t-0 lg:pt-12">
                <div className="relative z-10 grid h-10 w-10 place-items-center rounded-xl border border-brand-lime/32 bg-brand-dark text-brand-lime lg:absolute lg:left-0 lg:top-0"><Icon className="h-4 w-4" /></div>
                <div className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-lime lg:mt-0">Step {n}</div>
                <h3 className="mt-3 text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/52">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
