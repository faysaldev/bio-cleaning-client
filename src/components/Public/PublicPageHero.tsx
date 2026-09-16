import type { ReactNode } from "react";

export function PublicPageHero({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description?: string; actions?: ReactNode }) {
  return <section className="relative overflow-hidden bg-brand-dark py-20 text-white md:py-28"><div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_80%_10%,rgba(181,236,86,.20),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(94,184,130,.18),transparent_34%)]"/><div className="container-page relative max-w-5xl"><span className="editorial-kicker border-white/15 bg-white/5 text-brand-lime">{eyebrow}</span><h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-[-.055em] md:text-7xl">{title}</h1>{description ? <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">{description}</p> : null}{actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}</div></section>;
}
