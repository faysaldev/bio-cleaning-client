import fullService2 from "@/src/assets/full-services-2.jpeg";
import serviceCommercial from "@/src/assets/service-commercial.jpeg";
import serviceDeep from "@/src/assets/service-deep.jpeg";
import whyChoose from "@/src/assets/why-choose.jpeg";
import { AirVent, Droplets, Leaf, Waves } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

const equipment: Array<{ index: string; title: string; copy: string; tag: string; icon: typeof AirVent; image: StaticImageData }> = [
  { index: "01", title: "HEPA filtration", copy: "Fine-particle capture for floors, rugs, edges, and upholstery without recirculating the mess.", tag: "Air + dust control", icon: AirVent, image: serviceCommercial },
  { index: "02", title: "Microfiber system", copy: "Color-coded cloths and mop heads keep kitchens, bathrooms, and general surfaces intentionally separated.", tag: "Cross-contamination control", icon: Waves, image: fullService2 },
  { index: "03", title: "Low-residue chemistry", copy: "Surface-appropriate products prioritize effective cleaning with a cleaner finish and a lighter footprint.", tag: "Eco-first products", icon: Leaf, image: whyChoose },
  { index: "04", title: "Detail tools", copy: "Steam, brushes, crevice tools, and targeted applicators reach the areas a quick wipe simply misses.", tag: "Precision work", icon: Droplets, image: serviceDeep },
];

export default function EquipmentShowcase() {
  return (
    <section data-horizontal-scene className="relative bg-brand-cream py-24 lg:py-0">
      <div data-horizontal-pin className="lg:flex lg:min-h-[calc(100vh-84px)] lg:items-center lg:overflow-hidden">
        <div className="container-page w-full">
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-end">
            <div data-cinema-reveal>
              <span className="editorial-kicker">Equipment + products</span>
              <h2 className="mt-5 text-4xl text-brand-dark md:text-5xl">Professional tools, selected for the job—not for show.</h2>
              <p className="mt-4 text-muted-foreground">Scroll through the system our crews bring into the space. On mobile, the same story stays swipeable and lightweight.</p>
            </div>
            <div className="hidden items-center justify-end gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-dark/45 lg:flex"><span>Scroll to explore</span><span className="h-px w-16 bg-brand-dark/20" /></div>
          </div>

          <div data-horizontal-viewport className="cinematic-horizontal-viewport mt-10 overflow-x-auto lg:overflow-hidden">
            <div data-horizontal-track className="cinematic-horizontal-track flex w-max gap-5 pb-3 pr-[10vw]">
              {equipment.map(({ index, title, copy, tag, icon: Icon, image }) => (
                <article key={title} className="group relative h-[520px] w-[82vw] max-w-[520px] shrink-0 overflow-hidden rounded-2xl border border-brand-dark/10 bg-brand-dark text-white shadow-elevated sm:w-[460px] lg:h-[560px] lg:w-[500px]">
                  <Image src={image} alt={title} fill sizes="(min-width: 1024px) 500px, 82vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/36 to-brand-dark/5" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-white/18 pb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-lime"><span>{index}</span><span className="flex items-center gap-2"><Icon className="h-4 w-4" />{tag}</span></div>
                    <h3 className="mt-5 text-3xl sm:text-4xl">{title}</h3>
                    <p className="mt-3 max-w-md text-white/68">{copy}</p>
                  </div>
                </article>
              ))}
              <div className="grid h-[520px] w-[72vw] max-w-[420px] shrink-0 place-items-center rounded-2xl border border-brand-dark/10 bg-brand-lime p-8 text-center text-brand-dark lg:h-[560px] lg:w-[390px]">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.14em]">The point</div>
                  <p className="mt-5 text-3xl font-extrabold tracking-[-0.045em]">Better tools make the clean more consistent—not more complicated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
