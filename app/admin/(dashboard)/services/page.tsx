"use client";

import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetAllServicesQuery,
  useUpdateServiceMutation,
} from "@/src/redux/features/services/servicesApi";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import { CleaningService } from "@/src/redux/features/services/types";
import {
  Check,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
  Loader2,
  Upload,
  Eye,
  EyeOff,
  Tag,
  Clock,
  DollarSign,
} from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";

const emptyService: Partial<CleaningService> = {
  name: "",
  description: "",
  includes: [],
  tags: [],
  basePrice: 0,
  duration: "",
  isActive: true,
  image: "",
};

type DrawerMode = "add" | "edit";

function serviceToForm(service: Partial<CleaningService>) {
  return {
    ...service,
    includes: service.includes?.join("\n") || "",
    tags: service.tags?.join(", ") || "",
    basePrice: service.basePrice?.toString() || "",
  };
}

type ServiceFormState = ReturnType<typeof serviceToForm>;

function formToService(form: ServiceFormState): Partial<CleaningService> {
  return {
    ...form,
    basePrice: Number(form.basePrice.toString().replace(/[^0-9.]/g, "")) || 0,
    includes: (form.includes as any)
      .split("\n")
      .map((item: string) => item.trim())
      .filter(Boolean),
    tags: (form.tags as any)
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean),
  };
}

export default function AdminServicesPage() {
  const { data: servicesData, isLoading: isFetching } = useGetAllServicesQuery(
    {},
  );
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteServiceMutation, { isLoading: isDeleting }] =
    useDeleteServiceMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const services = servicesData?.data || [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormState>(
    serviceToForm(emptyService),
  );

  const openAddDrawer = () => {
    setDrawerMode("add");
    setEditingId(null);
    setForm(serviceToForm(emptyService));
    setDrawerOpen(true);
  };

  const openEditDrawer = (service: CleaningService) => {
    setDrawerMode("edit");
    setEditingId(service._id);
    setForm(serviceToForm(service));
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(serviceToForm(emptyService));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = (await uploadFile(formData).unwrap()) as any;
      const imageUrl = res?.data?.url || res?.url;
      if (imageUrl) setForm((prev) => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const submitService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.basePrice) return;
    const nextService = formToService(form);
    const payload = {
      name: nextService.name,
      description: nextService.description,
      basePrice: nextService.basePrice,
      includes: nextService.includes,
      image: nextService.image,
      duration: nextService.duration,
      tags: nextService.tags,
      isActive: nextService.isActive,
    };
    try {
      if (drawerMode === "edit") {
        await updateService({ id: editingId, data: payload }).unwrap();
      } else {
        await createService(payload).unwrap();
      }
      closeDrawer();
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  const togglePublish = async (service: CleaningService) => {
    try {
      await updateService({
        id: service._id,
        data: { isActive: !service.isActive },
      }).unwrap();
    } catch (err) {
      console.error("Failed to toggle:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteServiceMutation(id).unwrap();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Services</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {services.length} service{services.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <button
          onClick={openAddDrawer}
          className="inline-flex items-center gap-2 bg-brand-dark text-white text-xs font-bold rounded-xl px-4 py-2.5 hover:bg-brand-green transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Service
        </button>
      </div>

      {/* Services grid */}
      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-semibold text-brand-dark">
            No services yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your first cleaning service to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:border-brand-green/25 hover:shadow-sm transition-all duration-200 group"
            >
              {/* Image */}
              <div className="aspect-[16/9] bg-[#f0f4f1] overflow-hidden relative">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <Sparkles className="w-8 h-8 text-brand-green/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      service.isActive
                        ? "bg-brand-lime text-brand-dark"
                        : "bg-white/90 text-muted-foreground border border-border"
                    }`}
                  >
                    {service.isActive ? "Live" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-brand-dark text-sm leading-tight">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-dark">
                    <DollarSign className="w-3 h-3 text-brand-green" />
                    {service.basePrice}
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </div>
                  )}
                </div>

                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold uppercase tracking-wide bg-[#f0f4f1] text-muted-foreground px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => togglePublish(service)}
                    disabled={isUpdating}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold rounded-lg py-1.5 transition-colors ${
                      service.isActive
                        ? "bg-[#f0f4f1] text-muted-foreground hover:text-brand-dark"
                        : "bg-brand-lime/20 text-brand-dark hover:bg-brand-lime/40"
                    }`}
                  >
                    {service.isActive ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                    {service.isActive ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openEditDrawer(service)}
                    className="w-7 h-7 rounded-lg bg-[#f0f4f1] hover:bg-brand-green/10 grid place-items-center transition-colors"
                  >
                    <Pencil className="w-3 h-3 text-brand-green" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    disabled={isDeleting}
                    className="w-7 h-7 rounded-lg bg-[#f0f4f1] hover:bg-destructive/8 grid place-items-center transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between z-10">
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-brand-green mb-0.5">
                  {drawerMode === "edit" ? "Edit Service" : "New Service"}
                </div>
                <h2 className="text-base font-bold text-brand-dark">
                  {drawerMode === "edit"
                    ? "Update cleaning service"
                    : "Add cleaning service"}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-xl bg-[#f0f4f1] hover:bg-brand-cream grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitService} className="p-5 space-y-4">
              {/* Image upload */}
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Service Image
                </span>
                <div className="mt-1.5 rounded-xl border-2 border-dashed border-border hover:border-brand-green bg-[#f8faf9] overflow-hidden transition-colors group/img">
                  {form.image ? (
                    <div className="relative aspect-video">
                      <img
                        src={form.image as string}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                        <span className="bg-white text-brand-dark text-xs font-bold px-3 py-1.5 rounded-lg">
                          Change Image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5">
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
                      ) : (
                        <Upload className="h-5 w-5 text-brand-green/50" />
                      )}
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {isUploading ? "Uploading…" : "Click to upload"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Field label="Service Name">
                <input
                  required
                  value={form.name as string}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-field"
                  placeholder="Premium Kitchen Reset"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description as string}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="admin-field min-h-20 resize-none"
                  placeholder="Short service description"
                />
              </Field>

              <Field label="What's Included (one per line)">
                <textarea
                  value={form.includes as string}
                  onChange={(e) =>
                    setForm({ ...form, includes: e.target.value })
                  }
                  className="admin-field min-h-28 resize-none"
                  placeholder={"Kitchen wipe-down\nBathroom sanitizing\nFloors"}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration">
                  <input
                    value={form.duration as string}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="admin-field"
                    placeholder="2–3 hrs"
                  />
                </Field>
                <Field label="Base Price ($)">
                  <input
                    required
                    value={form.basePrice as string}
                    onChange={(e) =>
                      setForm({ ...form, basePrice: e.target.value })
                    }
                    className="admin-field"
                    placeholder="149"
                  />
                </Field>
              </div>

              <Field label="Tags (comma separated)">
                <input
                  value={form.tags as string}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="admin-field"
                  placeholder="home, office, premium"
                />
              </Field>

              <label className="flex items-center gap-3 rounded-xl bg-[#f0f4f1] px-4 py-3 cursor-pointer hover:bg-brand-lime/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.isActive as boolean}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="rounded border-border"
                />
                <span className="text-sm font-semibold text-brand-dark">
                  Publish this service
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-[#f0f4f1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-green transition-colors disabled:opacity-50"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {drawerMode === "edit" ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-field {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: #f8faf9;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-field:focus {
          border-color: var(--brand-green);
          background: white;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
