/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, DollarSign, HomeIcon, MapPin, Search } from "lucide-react";
import { Fragment, useState } from "react";
import Link from "next/link";

export default function QuoteBar() {
  const [loc, setLoc] = useState("New York, NY");
  const [svc, setSvc] = useState("Residential");
  const [when, setWhen] = useState("Tomorrow");
  const [budget, setBudget] = useState("$100 – $300");

  const fields: {
    icon: any;
    label: string;
    value: string;
    setValue: (v: string) => void;
    options: string[];
  }[] = [
    {
      icon: MapPin,
      label: "Location",
      value: loc,
      setValue: setLoc,
      options: [
        "New York, NY",
        "Brooklyn, NY",
        "Jersey City, NJ",
        "Boston, MA",
        "Newark, NJ",
      ],
    },
    {
      icon: HomeIcon,
      label: "Service",
      value: svc,
      setValue: setSvc,
      options: [
        "Residential",
        "Commercial",
        "Deep Cleaning",
        "Move-In / Out",
        "Post-Construction",
      ],
    },
    {
      icon: Calendar,
      label: "When",
      value: when,
      setValue: setWhen,
      options: [
        "Today",
        "Tomorrow",
        "This Weekend",
        "Next Week",
        "Custom Date",
      ],
    },
    {
      icon: DollarSign,
      label: "Budget",
      value: budget,
      setValue: setBudget,
      options: [
        "$50 – $100",
        "$100 – $300",
        "$300 – $600",
        "$600 – $1,000",
        "$1,000+",
      ],
    },
  ];

  return (
    <div
      className="mt-12 mx-auto max-w-5xl bg-white/95 backdrop-blur rounded-3xl md:rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-stretch gap-2"
      data-reveal
    >
      {fields.map((f, i) => (
        <Fragment key={f.label}>
          <SelectField {...f} />
          {i < fields.length - 1 && (
            <div className="hidden md:block w-px bg-border my-3" />
          )}
        </Fragment>
      ))}
      <Link
        href="/book"
        className="bg-brand-lime text-brand-dark font-bold px-6 py-3 rounded-full inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition shrink-0 shadow-lg shadow-brand-lime/40"
      >
        <Search className="w-4 h-4" /> Get Quote
      </Link>
    </div>
  );
}

function SelectField({
  icon: Icon,
  label,
  value,
  setValue,
  options,
}: {
  icon: any;
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-3 px-4 py-2 flex-1 text-left rounded-full hover:bg-brand-cream/60 transition cursor-pointer min-w-0">
      <div className="w-9 h-9 rounded-full bg-brand-cream grid place-items-center shrink-0">
        <Icon className="w-4 h-4 text-brand-green" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full text-sm font-semibold text-brand-dark bg-transparent outline-none cursor-pointer truncate appearance-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
