"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Leaf,
  Star,
} from "lucide-react";
import Link from "next/link";
import { SiteLayout } from "../Layouts/SiteLayout";
import { useGsapReveal } from "../hooks/useGsapReveal";

const STEPS = ["Service", "Date & Time", "Your Details", "Confirm"];

function createBookingReference() {
  return `BIO-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({
    service: "Residential",
    size: "1BR",
    time: "Morning 8-12",
    frequency: "One-time",
  });
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState("");
  const ref = useGsapReveal<HTMLDivElement>();

  if (done) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="container-page max-w-xl text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-green/10 grid place-items-center">
              <Check className="w-10 h-10 text-brand-green" />
            </div>
            <h1 className="text-4xl mt-6 text-brand-dark">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground mt-3">
              Reference{" "}
              <span className="font-mono font-bold text-brand-dark">
                {reference}
              </span>
              . We&apos;ve sent a confirmation to your email.
            </p>
            <Link href="/" className="btn-primary mt-8 inline-flex">
              Back to Home
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div ref={ref}>
        <section className="py-12 bg-brand-cream">
          <div className="container-page max-w-3xl">
            <h1 className="text-4xl text-brand-dark text-center" data-reveal>
              Book Your Cleaning
            </h1>
            <p className="text-center text-muted-foreground mt-2" data-reveal>
              Get a sparkling clean home in 60 seconds — no commitments.
            </p>
            <div className="mt-8 flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex items-center">
                  <div
                    className={`flex items-center gap-2 ${i <= step ? "text-brand-green" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${i <= step ? "bg-brand-green text-white" : "bg-white border border-border"}`}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 ${i < step ? "bg-brand-green" : "bg-border"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container-page max-w-3xl">
            <div className="card-feature">
              {step === 0 && (
                <div>
                  <h2 className="text-2xl text-brand-dark mb-6">
                    Select your service
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Residential",
                      "Commercial",
                      "Deep Clean",
                      "Move-In/Out",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => setData({ ...data, service: s })}
                        className={`p-4 rounded-xl border-2 text-left transition ${data.service === s ? "border-brand-green bg-brand-green/5" : "border-border hover:border-brand-green/50"}`}
                      >
                        <div className="font-semibold text-brand-dark">{s}</div>
                      </button>
                    ))}
                  </div>
                  <label className="block mt-6">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Property Size
                    </span>
                    <select
                      className="mt-2 w-full p-3 rounded-lg border border-border"
                      value={data.size}
                      onChange={(e) =>
                        setData({ ...data, size: e.target.value })
                      }
                    >
                      {["Studio", "1BR", "2BR", "3BR", "4BR+", "Office"].map(
                        (o) => (
                          <option key={o}>{o}</option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-2xl text-brand-dark mb-2">
                    Choose date & time
                  </h2>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Date
                    </span>
                    <input
                      type="date"
                      className="mt-2 w-full p-3 rounded-lg border border-border"
                      onChange={(e) =>
                        setData({ ...data, date: e.target.value })
                      }
                    />
                  </label>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Time slot
                    </span>
                    <div className="grid sm:grid-cols-3 gap-2 mt-2">
                      {["Morning 8-12", "Afternoon 12-5", "Evening 5-8"].map(
                        (t) => (
                          <button
                            key={t}
                            onClick={() => setData({ ...data, time: t })}
                            className={`p-3 rounded-lg border-2 text-sm ${data.time === t ? "border-brand-green bg-brand-green/5" : "border-border"}`}
                          >
                            {t}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Frequency
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {["One-time", "Weekly", "Bi-weekly", "Monthly"].map(
                        (f) => (
                          <button
                            key={f}
                            onClick={() => setData({ ...data, frequency: f })}
                            className={`p-3 rounded-lg border-2 text-sm ${data.frequency === f ? "border-brand-green bg-brand-green/5" : "border-border"}`}
                          >
                            {f}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl text-brand-dark mb-2">
                    Your details
                  </h2>
                  {[
                    ["name", "Full Name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                    ["addr1", "Address Line 1", "text"],
                    ["addr2", "Address Line 2 (optional)", "text"],
                    ["city", "City", "text"],
                    ["zip", "Zip Code", "text"],
                  ].map(([k, l, t]) => (
                    <label key={k} className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {l}
                      </span>
                      <input
                        type={t}
                        className="mt-1.5 w-full p-3 rounded-lg border border-border"
                        value={data[k] || ""}
                        onChange={(e) =>
                          setData({ ...data, [k]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Special instructions
                    </span>
                    <textarea
                      rows={3}
                      className="mt-1.5 w-full p-3 rounded-lg border border-border resize-none"
                    />
                  </label>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl text-brand-dark mb-6">
                    Confirm your booking
                  </h2>
                  <div className="rounded-xl bg-brand-cream p-6 space-y-3">
                    {[
                      ["Service", data.service],
                      ["Property", data.size],
                      ["Date", data.date || "—"],
                      ["Time", data.time],
                      ["Frequency", data.frequency],
                      ["Name", data.name || "—"],
                      [
                        "Address",
                        `${data.addr1 || "—"}, ${data.city || ""} ${data.zip || ""}`,
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between text-sm border-b border-border/50 pb-2"
                      >
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold text-brand-dark">
                          {v}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-muted-foreground">
                        Estimated total
                      </span>
                      <span className="text-3xl font-display font-bold text-brand-green">
                        $149
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-brand-yellow/20 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-dark" /> 20% off
                    your first cleaning has been applied!
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="btn-primary"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setReference(createBookingReference());
                      setDone(true);
                    }}
                    className="btn-primary"
                  >
                    Confirm Booking <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-brand-cream">
          <div className="container-page">
            <div className="text-center mb-10">
              <span className="pill" data-reveal>
                — Why Book With BIO —
              </span>
              <h2
                className="text-3xl md:text-4xl text-brand-dark mt-3"
                data-reveal
              >
                Booked. Insured. Guaranteed.
              </h2>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-reveal-group
            >
              {[
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
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="card-feature">
                  <Icon className="w-9 h-9 text-brand-green mb-3" />
                  <h3 className="text-lg text-brand-dark">{t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-page max-w-4xl">
            <div className="text-center mb-10">
              <span className="pill" data-reveal>
                — What Clients Say —
              </span>
              <h2
                className="text-3xl md:text-4xl text-brand-dark mt-3"
                data-reveal
              >
                Booked Today, Loved Tomorrow
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5" data-reveal-group>
              {[
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
              ].map((t) => (
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

        <section className="pb-20">
          <div className="container-page">
            <div
              className="rounded-3xl bg-brand-yellow p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between"
              data-reveal
            >
              <div>
                <h3 className="text-2xl md:text-3xl text-brand-dark font-display">
                  Prefer to talk to a human?
                </h3>
                <p className="text-brand-dark/70 mt-2">
                  Call us 7 days a week, 7am – 8pm.
                </p>
              </div>
              <Link
                href="/contact"
                className="bg-brand-dark text-white font-bold px-8 py-4 rounded-full hover:bg-brand-green transition inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
