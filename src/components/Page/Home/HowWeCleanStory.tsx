import type { WebsiteHomepageSection } from "@/src/redux/features/website/types";
import fullService from "@/src/assets/full-services.jpeg";
import fullService2 from "@/src/assets/full-services-2.jpeg";
import serviceDeep from "@/src/assets/service-deep.jpeg";
import whyChoose from "@/src/assets/why-choose.jpeg";
import { ClipboardCheck, Droplets, ScanSearch, ShieldCheck } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

const steps: Array<{
  eyebrow: string;
  title: string;
  copy: string;
  detail: string;
  icon: typeof ScanSearch;
  image: StaticImageData;
}> = [
  {
    eyebrow: "01 · Assess",
    title: "We read the room before we touch it.",
    copy: "Entry points, delicate finishes, high-touch zones, pets, priorities, and access instructions become one clear cleaning plan.",
    detail: "Room-by-room scope · surface check · customer notes",
    icon: ScanSearch,
    image: fullService,
  },
  {
    eyebrow: "02 · Prepare",
    title: "The right chemistry and equipment, matched to the surface.",
    copy: "Color-coded microfiber, HEPA filtration, low-residue solutions, and targeted tools are staged before cleaning begins.",
    detail: "Cross-contamination control · eco-first products",
    icon: Droplets,
    image: fullService2,
  },
  {
    eyebrow: "03 · Detail",
    title: "Top-to-bottom cleaning with a deliberate path.",
    copy: "Dust falls once, edges are detailed, fixtures are polished, floors finish last, and every room follows the same quality rhythm.",
    detail: "High-to-low sequence · detail zones · finishing pass",
    icon: ClipboardCheck,
    image: serviceDeep,
  },
  {
    eyebrow: "04 · Verify",
    title: "A final walkthrough closes the loop.",
    copy: "The team lead checks the agreed scope, resets the space, documents exceptions, and makes sure the handoff feels complete.",
    detail: "Quality check · reset · satisfaction guarantee",
    icon: ShieldCheck,
    image: whyChoose,
  },
];

function StaticStory() {
  return (
    <div className="clean-story-static grid gap-5 lg:hidden">
      {steps.map(({ eyebrow, title, copy, detail, icon: Icon, image }) => (
        <article key={eyebrow} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={image} alt="BIO Cleaning process" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green"><Icon className="h-4 w-4" />{eyebrow}</div>
            <h3 className="mt-4 text-3xl text-brand-dark">{title}</h3>
            <p className="mt-3 text-muted-foreground">{copy}</p>
            <p className="mt-5 border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.12em] text-brand-dark/55">{detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HowWeCleanStory({ section }: { section?: WebsiteHomepageSection }) {
  return (
    <section data-clean-story className="relative overflow-clip bg-brand-dark py-24 text-white lg:py-0">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_70%_20%,rgba(181,236,86,.18),transparent_34%),radial-gradient(circle_at_16%_76%,rgba(94,184,130,.18),transparent_30%)]" />
      <div className="container-page relative">
        <div className="mb-12 max-w-3xl lg:hidden" data-cinema-reveal>
          <span className="editorial-kicker border-white/15 bg-white/7 text-brand-lime">{section?.eyebrow || "How we clean"}</span>
          <h2 className="mt-5 text-4xl md:text-5xl">{section?.title || "A repeatable method behind every spotless handoff."}</h2>
          <p className="mt-4 text-white/62">{section?.subtitle || "The process is designed to be thorough without feeling chaotic inside your home or workplace."}</p>
        </div>

        <StaticStory />

        <div data-story-motion className="clean-story-motion hidden min-h-[calc(100vh-84px)] grid-cols-[0.82fr_1.18fr] gap-12 py-16 lg:grid lg:items-center">
          <div className="relative pl-8">
            <div className="absolute bottom-1 left-0 top-1 w-px bg-white/12">
              <div data-story-progress className="h-full w-px origin-top bg-brand-lime" />
            </div>
            <span className="editorial-kicker border-white/15 bg-white/7 text-brand-lime">{section?.eyebrow || "How we clean"}</span>
            <h2 className="mt-5 max-w-xl text-5xl xl:text-6xl">{section?.title || "A repeatable method behind every spotless handoff."}</h2>
            <div className="mt-10 space-y-8">
              {steps.map(({ eyebrow, title, copy, icon: Icon }) => (
                <article data-story-step key={eyebrow} className="max-w-xl">
                  <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-lime"><Icon className="h-4 w-4" />{eyebrow}</div>
                  <h3 className="mt-3 text-3xl xl:text-4xl">{title}</h3>
                  <p className="mt-3 max-w-lg text-white/58">{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative h-[min(72vh,720px)] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_50px_120px_-70px_rgba(0,0,0,.8)]">
            {steps.map(({ eyebrow, image, detail }, index) => (
              <div data-story-scene key={eyebrow} className="absolute inset-0">
                <Image src={image} alt="BIO Cleaning process" fill priority={index === 0} sizes="55vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 border-t border-white/18 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/78">{detail}</div>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-4 rounded-xl border border-white/12" />
          </div>
        </div>
      </div>
    </section>
  );
}
