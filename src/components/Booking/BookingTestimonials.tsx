import { Star } from "lucide-react";

export function BookingTestimonials() {
  const testimonials = [
    {
      n: "Lena P.",
      q: "Booking took less than a minute. Crew arrived early, place looked unreal.",
    },
    {
      n: "Marcus T.",
      q: "Friendliest team I've hired. The eco products smell amazing.",
    },
    {
      n: "Devi R.",
      q: "Move-out clean got me my full deposit back. Worth every cent.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container-page max-w-4xl">
        <div className="text-center mb-10">
          <span className="pill">— What Clients Say —</span>
          <h2 className="text-3xl md:text-4xl text-brand-dark mt-3">
            Booked Today, Loved Tomorrow
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.n} className="card-feature">
              <div className="flex gap-0.5 text-brand-yellow mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm italic text-foreground/80">
                &ldquo;{t.q}&rdquo;
              </p>
              <div className="mt-3 text-xs font-semibold text-brand-dark">
                — {t.n}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
