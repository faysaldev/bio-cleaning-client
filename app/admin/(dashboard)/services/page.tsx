"use client";

import { AdminService, adminServices } from "@/src/utils/adminData";
import { Check, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

const emptyService: AdminService = {
  name: "",
  description: "",
  features: [],
  tags: [],
  price: "",
  duration: "",
  active: true,
};

type DrawerMode = "add" | "edit";

function serviceToForm(service: AdminService) {
  return {
    ...service,
    features: service.features.join("\n"),
    tags: service.tags.join(", "),
  };
}

type ServiceFormState = ReturnType<typeof serviceToForm>;

function formToService(form: ServiceFormState): AdminService {
  return {
    ...form,
    features: form.features
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    tags: form.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState(adminServices);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("add");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceFormState>(
    serviceToForm(emptyService),
  );

  const openAddDrawer = () => {
    setDrawerMode("add");
    setEditingIndex(null);
    setForm(serviceToForm(emptyService));
    setDrawerOpen(true);
  };

  const openEditDrawer = (index: number) => {
    setDrawerMode("edit");
    setEditingIndex(index);
    setForm(serviceToForm(services[index]));
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingIndex(null);
    setForm(serviceToForm(emptyService));
  };

  const submitService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.price) return;

    const nextService = formToService(form);
    if (drawerMode === "edit" && editingIndex !== null) {
      setServices((current) =>
        current.map((service, index) =>
          index === editingIndex ? nextService : service,
        ),
      );
    } else {
      setServices((current) => [nextService, ...current]);
    }
    closeDrawer();
  };

  const togglePublish = (index: number) => {
    setServices((current) =>
      current.map((service, itemIndex) =>
        itemIndex === index ? { ...service, active: !service.active } : service,
      ),
    );
  };

  const deleteService = (index: number) => {
    setServices((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="pill">Services</span>
            <h2 className="mt-3 text-3xl text-brand-dark">Current services</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage the services shown by the cleaning business.
            </p>
          </div>
          <span className="w-fit rounded-full bg-brand-lime/50 px-3 py-1 text-xs font-bold text-brand-dark">
            {services.length} total
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {services.map((service, index) => (
            <article
              key={`${service.name}-${service.price}-${index}`}
              className="rounded-3xl border border-border bg-white p-5 transition hover:border-brand-green/50 hover:shadow-card"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-brand-dark">
                      {service.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        service.active
                          ? "bg-brand-lime text-brand-dark"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {service.active ? "Published" : "Unpublished"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-green"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <div className="font-display text-3xl font-bold text-brand-green">
                    {service.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service.duration || "Flexible"}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-2xl bg-brand-cream px-4 py-2 text-sm text-brand-dark"
                  >
                    <Check className="w-4 h-4 text-brand-green" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditDrawer(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold text-brand-dark hover:border-brand-green"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => togglePublish(index)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white hover:bg-brand-green"
                >
                  {service.active ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteService(index)}
                  className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl bg-brand-dark p-6 text-white shadow-card">
          <span className="pill bg-brand-lime text-brand-dark">
            <Sparkles className="w-3.5 h-3.5" /> Service builder
          </span>
          <h2 className="mt-4 text-3xl">Add or edit services in a drawer</h2>
          <p className="mt-3 text-sm text-white/65">
            Keep the list clean on the left. Use the drawer for focused service
            creation and edits.
          </p>
          <button onClick={openAddDrawer} className="btn-primary mt-6 w-full">
            <Plus className="w-4 h-4" /> Add new service
          </button>
        </div>
        <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
          <h3 className="text-2xl text-brand-dark">Fields</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "Name of the cleaning",
              "Description",
              "Feature list",
              "Duration",
              "Price",
              "Tags such as office, home, premium",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-green" /> {item}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/45"
            onClick={closeDrawer}
          />
          <div className="absolute left-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl animate-[fade-in_.2s_ease-out]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="pill">
                  {drawerMode === "edit" ? "Edit service" : "New service"}
                </span>
                <h2 className="mt-3 text-3xl text-brand-dark">
                  {drawerMode === "edit" ? "Update cleaning" : "Add cleaning"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full border border-border p-2"
                aria-label="Close service drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitService} className="mt-8 space-y-5">
              <Field label="Name of the cleaning">
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="admin-input"
                  placeholder="Premium Kitchen Reset"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="admin-input min-h-28 resize-none"
                  placeholder="Short service description"
                />
              </Field>
              <Field label="Features list">
                <textarea
                  value={form.features}
                  onChange={(event) =>
                    setForm({ ...form, features: event.target.value })
                  }
                  className="admin-input min-h-32 resize-none"
                  placeholder={"Kitchen wipe-down\nBathroom sanitizing\nFloors"}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Add one feature per line.
                </p>
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
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
                <Field label="Price">
                  <input
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    className="admin-input"
                    placeholder="$149"
                  />
                </Field>
              </div>
              <Field label="Tags">
                <input
                  value={form.tags}
                  onChange={(event) =>
                    setForm({ ...form, tags: event.target.value })
                  }
                  className="admin-input"
                  placeholder="home, office, premium"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Separate tags with commas.
                </p>
              </Field>
              <label className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 text-sm font-semibold text-brand-dark">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm({ ...form, active: event.target.checked })
                  }
                />
                Publish this service
              </label>
              <button className="btn-primary w-full">
                {drawerMode === "edit" ? "Save changes" : "Add service"}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`.admin-input{width:100%;border:1px solid var(--border);border-radius:1rem;background:white;padding:.85rem 1rem;outline:none}.admin-input:focus{border-color:var(--brand-green);box-shadow:0 0 0 3px color-mix(in oklab,var(--brand-green) 15%,transparent)}`}</style>
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
    </label>
  );
}
