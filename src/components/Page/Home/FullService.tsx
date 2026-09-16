import fullService2 from "@/src/assets/full-services-2.jpeg";
import fullService from "@/src/assets/full-services.jpeg";
import { ArrowRight, Check, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FullService() {
  const points = [
    "Residential & commercial cleaning crews on call",
    "Eco-certified, pet- and child-safe products",
    "Transparent pricing before the team arrives",
    "100% satisfaction guarantee or we re-clean",
  ];

  return (
    <section className="relative py-28 md:py-36">
      <div className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-brand-mint/20 blur-3xl" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-20">
        <div className="relative min-h-[520px] md:min-h-[640px]" data-cinema-mask>
          <div data-depth="12" className="absolute left-0 top-0 h-[72%] w-[70%] overflow-hidden rounded-2xl shadow-elevated">
            <Image src={fullService} alt="BIO cleaner preparing a room" fill sizes="(min-width: 1024px) 42vw, 70vw" className="object-cover" />
          </div>
          <div data-depth="-9" className="absolute bottom-0 right-0 h-[58%] w-[58%] overflow-hidden rounded-2xl border-[6px] border-background shadow-elevated">
            <Image src={fullService2} alt="Professional cleaner detailing a surface" fill sizes="(min-width: 1024px) 34vw, 58vw" className="object-cover" />
          </div>
          <div className="absolute bottom-8 left-6 z-10 w-[min(78%,360px)] rounded-xl border border-white/12 bg-brand-dark/92 p-5 text-white shadow-elevated backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["50+", "Team"], ["24h", "Support"], ["100%", "Eco-first"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold tracking-[-0.04em] text-brand-lime">{n}</div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-cinema-reveal>
          <span className="editorial-kicker"><Sparkles className="h-3.5 w-3.5" /> Full service</span>
          <h2 className="mt-5 text-4xl text-brand-dark md:text-6xl">Cleaning that feels considered from arrival to handoff.</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            Routine service, deep cleaning, moving-day resets, and commercial care all run through the same operating standard: clear scope, the right tools, a deliberate sequence, and a final quality check.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2" data-cinema-group>
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 border-t border-border pt-4 text-sm text-foreground/82">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-lime"><Check className="h-3 w-3 text-brand-dark" strokeWidth={3} /></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3 sm:grid-cols-2" data-cinema-group>
            {[
              { icon: ClipboardCheck, title: "50-point checklist", copy: "A repeatable room-by-room path keeps quality consistent." },
              { icon: ShieldCheck, title: "Trusted arrival", copy: "Vetted teams, clear timing, and careful customer handoff." },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="surface-subtle p-5">
                <Icon className="mb-3 h-6 w-6 text-brand-green" />
                <div className="font-bold text-brand-dark">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">Schedule a cleaning <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/services" className="btn-secondary">Explore services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
