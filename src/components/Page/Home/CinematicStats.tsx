import { BadgeCheck, Clock3, Leaf, Star } from "lucide-react";

const stats = [
  { value: 5100, suffix: "+", label: "spaces restored", icon: BadgeCheck },
  { value: 4.9, decimals: 1, label: "average rating", icon: Star },
  { value: 98, suffix: "%", label: "on-time arrival", icon: Clock3 },
  { value: 100, suffix: "%", label: "eco-first supplies", icon: Leaf },
];

export default function CinematicStats() {
  return (
    <section className="relative z-20 -mt-10 px-3 sm:px-4" aria-label="BIO Cleaning highlights">
      <div className="container-page grid overflow-hidden rounded-2xl border border-brand-dark/10 bg-white/96 shadow-elevated backdrop-blur md:grid-cols-4" data-cinema-group>
        {stats.map(({ value, suffix = "", decimals = 0, label, icon: Icon }) => (
          <div key={label} className="relative px-6 py-6 md:px-7 md:py-8 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r">
            <Icon className="mb-5 h-5 w-5 text-brand-green" />
            <div
              className="text-4xl font-extrabold tracking-[-0.05em] text-brand-dark"
              data-counter={value}
              data-counter-decimals={decimals}
              data-counter-suffix={suffix}
              aria-label={`${value}${suffix} ${label}`}
            >
              {value.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}
            </div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
