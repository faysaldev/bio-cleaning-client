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
    setValue: (value: string) => void;
    options: string[];
  }[] = [
    { icon: MapPin, label: "Location", value: loc, setValue: setLoc, options: ["New York, NY", "Brooklyn, NY", "Jersey City, NJ", "Boston, MA", "Newark, NJ"] },
    { icon: HomeIcon, label: "Service", value: svc, setValue: setSvc, options: ["Residential", "Commercial", "Deep Cleaning", "Move-In / Out", "Post-Construction"] },
    { icon: Calendar, label: "When", value: when, setValue: setWhen, options: ["Today", "Tomorrow", "This Weekend", "Next Week", "Custom Date"] },
    { icon: DollarSign, label: "Budget", value: budget, setValue: setBudget, options: ["$50 – $100", "$100 – $300", "$300 – $600", "$600 – $1,000", "$1,000+"] },
  ];

  return (
    <div className="mx-auto mt-12 flex max-w-5xl flex-col items-stretch gap-2 rounded-2xl border border-white/15 bg-white/96 p-2.5 text-left shadow-[0_26px_70px_-36px_rgba(4,32,18,.72)] backdrop-blur md:flex-row" data-reveal>
      {fields.map((field, index) => (
        <Fragment key={field.label}>
          <SelectField {...field} />
          {index < fields.length - 1 ? <div className="my-2 hidden w-px bg-border md:block" /> : null}
        </Fragment>
      ))}
      <Link href="/book" className="btn-primary min-h-12 shrink-0 px-5 md:self-stretch">
        <Search className="h-4 w-4" /> Get quote
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
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-cream/65">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-cream text-brand-green">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
        <select value={value} onChange={(event) => setValue(event.target.value)} className="w-full cursor-pointer appearance-none truncate bg-transparent text-sm font-bold text-brand-dark outline-none">
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </label>
  );
}
