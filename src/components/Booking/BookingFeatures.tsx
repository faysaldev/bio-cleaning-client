import { ShieldCheck, Leaf, Clock, Star } from "lucide-react";

export function BookingFeatures() {
  const features = [
    {
      icon: ShieldCheck,
      t: "Insured & Bonded",
      d: "$2M coverage on every job.",
    },
    {
      icon: Leaf,
      t: "100% Eco Products",
      d: "Plant-based, kid & pet safe.",
    },
    {
      icon: Clock,
      t: "On-Time Promise",
      d: "We arrive in your booked window.",
    },
    {
      icon: Star,
      t: "Re-Clean Guarantee",
      d: "Free re-clean within 24 hours.",
    },
  ];

  return (
    <section className="py-16 bg-brand-cream">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="pill">— Why Book With BIO —</span>
          <h2 className="text-3xl md:text-4xl text-brand-dark mt-3">
            Booked. Insured. Guaranteed.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, t, d }) => (
            <div key={t} className="card-feature">
              <Icon className="w-9 h-9 text-brand-green mb-3" />
              <h3 className="text-lg text-brand-dark">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
