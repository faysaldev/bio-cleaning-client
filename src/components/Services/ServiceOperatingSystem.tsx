import { ClipboardCheck, SprayCan, Timer, BadgeCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ServiceOperatingSystem() {
  const steps = [
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
  ];

  return (
    <section className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="container-page">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div>
            <span className="pill bg-brand-lime text-brand-dark">
              <Sparkles className="w-3.5 h-3.5" /> Cleaner Operating System
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-display font-bold leading-tight">
              Every service runs on a tighter checklist
            </h2>
            <p className="mt-6 text-white/60 max-w-xl text-lg leading-relaxed">
              We combine trained crews, eco supplies, arrival windows, and a
              final room-by-room quality pass so your clean feels premium
              without feeling complicated.
            </p>
            <Link
              href="/book"
              className="mt-10 bg-brand-lime text-brand-dark font-black px-8 py-4 rounded-2xl inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-lime/10"
            >
              Build My Clean <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-[2rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-lime text-brand-dark grid place-items-center mb-6 shadow-lg shadow-brand-lime/20 group-hover:rotate-6 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold">{title}</h3>
                <p className="text-white/50 mt-3 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
