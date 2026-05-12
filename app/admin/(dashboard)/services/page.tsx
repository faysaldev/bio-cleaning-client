"use client";

import { AdminService, adminServices } from "@/src/utils/adminData";
import { Plus, Sparkles } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

export default function AdminServicesPage() {
  const [services, setServices] = useState(adminServices);
  const [form, setForm] = useState<AdminService>({
    name: "",
    category: "Home",
    price: "",
    duration: "",
    active: true,
  });

  const addService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.price) return;
    setServices((current) => [form, ...current]);
    setForm({
      name: "",
      category: "Home",
      price: "",
      duration: "",
      active: true,
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={addService}
        className="rounded-3xl border border-border bg-white p-6 shadow-card"
      >
        <span className="pill">
          <Sparkles className="w-3.5 h-3.5" /> Service builder
        </span>
        <h2 className="mt-4 text-3xl text-brand-dark">Add a service</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add service items that can later be connected to the public Services
          page or a backend API.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Service name">
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="admin-input"
              placeholder="Premium Kitchen Reset"
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="admin-input"
              >
                <option>Home</option>
                <option>Office</option>
                <option>Premium</option>
                <option>Add-on</option>
              </select>
            </Field>
            <Field label="Starting price">
              <input
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                className="admin-input"
                placeholder="$99"
              />
            </Field>
          </div>
          <Field label="Duration">
            <input
              value={form.duration}
              onChange={(event) =>
                setForm({ ...form, duration: event.target.value })
              }
              className="admin-input"
              placeholder="2-3 hrs"
            />
          </Field>
          <label className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 text-sm font-semibold text-brand-dark">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm({ ...form, active: event.target.checked })
              }
            />
            Active on admin list
          </label>
          <button className="btn-primary w-full">
            <Plus className="w-4 h-4" /> Add service
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <span className="pill">Services</span>
            <h2 className="mt-3 text-3xl text-brand-dark">Current services</h2>
          </div>
          <span className="rounded-full bg-brand-lime/50 px-3 py-1 text-xs font-bold text-brand-dark">
            {services.length} total
          </span>
        </div>
        <div className="mt-6 space-y-3">
          {services.map((service) => (
            <div
              key={`${service.name}-${service.price}`}
              className="rounded-2xl border border-border p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-brand-dark">
                    {service.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service.category} · {service.duration || "Flexible"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-brand-green">
                    {service.price}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      service.active
                        ? "bg-brand-lime text-brand-dark"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {service.active ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      <style>{`.admin-input{width:100%;border:1px solid var(--border);border-radius:1rem;background:white;padding:.85rem 1rem;outline:none}.admin-input:focus{border-color:var(--brand-green);box-shadow:0 0 0 3px color-mix(in oklab,var(--brand-green) 15%,transparent)}`}</style>
    </label>
  );
}
