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

// Calude Design

// "use client";

// import {
//   useCreateServiceMutation,
//   useDeleteServiceMutation,
//   useGetAllServicesQuery,
//   useUpdateServiceMutation,
// } from "@/src/redux/features/services/servicesApi";
// import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
// import { CleaningService } from "@/src/redux/features/services/types";
// import {
//   Check,
//   Pencil,
//   Plus,
//   Sparkles,
//   Trash2,
//   X,
//   Loader2,
//   Image as ImageIcon,
//   Upload,
// } from "lucide-react";
// import { ChangeEvent, FormEvent, ReactNode, useState } from "react";

// const emptyService: Partial<CleaningService> = {
//   name: "",
//   description: "",
//   includes: [],
//   tags: [],
//   basePrice: 0,
//   duration: "",
//   isActive: true,
//   image: "",
// };

// type DrawerMode = "add" | "edit";

// function serviceToForm(service: Partial<CleaningService>) {
//   return {
//     ...service,
//     includes: service.includes?.join("\n") || "",
//     tags: service.tags?.join(", ") || "",
//     basePrice: service.basePrice?.toString() || "",
//   };
// }

// type ServiceFormState = ReturnType<typeof serviceToForm>;

// function formToService(form: ServiceFormState): Partial<CleaningService> {
//   return {
//     ...form,
//     basePrice: Number(form.basePrice.replace(/[^0-9.]/g, "")) || 0,
//     includes: form.includes
//       .split("\n")
//       .map((item: string) => item.trim())
//       .filter(Boolean),
//     tags: form.tags
//       .split(",")
//       .map((item: string) => item.trim())
//       .filter(Boolean),
//   };
// }

// export default function AdminServicesPage() {
//   const { data: servicesData, isLoading: isFetching } = useGetAllServicesQuery(
//     {},
//   );
//   const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
//   const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
//   const [deleteServiceMutation, { isLoading: isDeleting }] =
//     useDeleteServiceMutation();
//   const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

//   const services = servicesData?.data || [];

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState<DrawerMode>("add");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState<ServiceFormState>(
//     serviceToForm(emptyService),
//   );

//   const openAddDrawer = () => {
//     setDrawerMode("add");
//     setEditingId(null);
//     setForm(serviceToForm(emptyService));
//     setDrawerOpen(true);
//   };

//   const openEditDrawer = (service: CleaningService) => {
//     setDrawerMode("edit");
//     setEditingId(service._id);
//     setForm(serviceToForm(service));
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//     setEditingId(null);
//     setForm(serviceToForm(emptyService));
//   };

//   const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = (await uploadFile(formData).unwrap()) as any;
//       const imageUrl = res?.data?.url || res?.url;
//       if (imageUrl) {
//         setForm((prev) => ({ ...prev, image: imageUrl }));
//       }
//     } catch (err) {
//       console.error("Image upload failed:", err);
//     }
//   };

//   const submitService = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!form.name || !form.basePrice) return;

//     const nextService = formToService(form);

//     // Clean payload for backend (stripping _id, createdAt, etc)
//     const payload = {
//       name: nextService.name,
//       description: nextService.description,
//       basePrice: nextService.basePrice,
//       includes: nextService.includes,
//       image: nextService.image,
//       duration: nextService.duration,
//       tags: nextService.tags,
//       isActive: nextService.isActive,
//     };

//     try {
//       if (drawerMode === "edit") {
//         await updateService({ id: editingId, data: payload }).unwrap();
//       } else {
//         await createService(payload).unwrap();
//       }
//       closeDrawer();
//     } catch (err) {
//       console.error("Failed to save service:", err);
//     }
//   };

//   const togglePublish = async (service: CleaningService) => {
//     try {
//       await updateService({
//         id: service._id,
//         data: { isActive: !service.isActive },
//       }).unwrap();
//     } catch (err) {
//       console.error("Failed to toggle publish status:", err);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this service?"))
//       return;
//     try {
//       await deleteServiceMutation(id).unwrap();
//     } catch (err) {
//       console.error("Failed to delete service:", err);
//     }
//   };

//   if (isFetching) {
//     return (
//       <div className="flex h-96 items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
//       <section className="rounded-3xl border border-border bg-white p-6 shadow-card">
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <span className="pill">Services</span>
//             <h2 className="mt-3 text-3xl text-brand-dark">Current services</h2>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Manage the services shown by the cleaning business.
//             </p>
//           </div>
//           <span className="w-fit rounded-full bg-brand-lime/50 px-3 py-1 text-xs font-bold text-brand-dark">
//             {services.length} total
//           </span>
//         </div>

//         <div className="mt-6 space-y-4">
//           {services.map((service) => (
//             <article
//               key={service._id}
//               className="rounded-3xl border border-border bg-white p-5 transition hover:border-brand-green/50 hover:shadow-card"
//             >
//               <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
//                 <div className="flex flex-col gap-4 sm:flex-row">
//                   {service.image && (
//                     <img
//                       src={service.image}
//                       alt={service.name}
//                       className="h-24 w-32 rounded-2xl object-cover shadow-sm ring-1 ring-border"
//                     />
//                   )}
//                   <div>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <h3 className="text-xl font-bold text-brand-dark">
//                         {service.name}
//                       </h3>
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-bold ${
//                           service.isActive
//                             ? "bg-brand-lime text-brand-dark"
//                             : "bg-muted text-muted-foreground"
//                         }`}
//                       >
//                         {service.isActive ? "Published" : "Unpublished"}
//                       </span>
//                     </div>
//                     <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
//                       {service.description}
//                     </p>
//                     <div className="mt-4 flex flex-wrap gap-2">
//                       {service.tags?.map((tag: string) => (
//                         <span
//                           key={tag}
//                           className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-green"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-left lg:text-right">
//                   <div className="font-display text-3xl font-bold text-brand-green">
//                     ${service.basePrice}
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     {service.duration || "Flexible"}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5 grid gap-2 sm:grid-cols-2">
//                 {service.includes.map((feature: string) => (
//                   <div
//                     key={feature}
//                     className="flex items-center gap-2 rounded-2xl bg-brand-cream px-4 py-2 text-sm text-brand-dark"
//                   >
//                     <Check className="w-4 h-4 text-brand-green" />
//                     {feature}
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-5 flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   onClick={() => openEditDrawer(service)}
//                   className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold text-brand-dark hover:border-brand-green"
//                 >
//                   <Pencil className="w-3.5 h-3.5" /> Edit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => togglePublish(service)}
//                   className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white hover:bg-brand-green"
//                 >
//                   {service.isActive ? "Unpublish" : "Publish"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleDelete(service._id)}
//                   className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-white"
//                 >
//                   <Trash2 className="w-3.5 h-3.5" /> Delete
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       <aside className="space-y-4">
//         <div className="rounded-3xl bg-brand-dark p-6 text-white shadow-card">
//           <span className="pill bg-brand-lime text-brand-dark">
//             <Sparkles className="w-3.5 h-3.5" /> Service builder
//           </span>
//           <h2 className="mt-4 text-3xl">Add or edit services in a drawer</h2>
//           <p className="mt-3 text-sm text-white/65">
//             Keep the list clean on the left. Use the drawer for focused service
//             creation and edits.
//           </p>
//           <button onClick={openAddDrawer} className="btn-primary mt-6 w-full">
//             <Plus className="w-4 h-4" /> Add new service
//           </button>
//         </div>
//         <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
//           <h3 className="text-2xl text-brand-dark">Fields</h3>
//           <div className="mt-4 space-y-3 text-sm text-muted-foreground">
//             {[
//               "Service Image (visual branding)",
//               "Name of the cleaning",
//               "Description",
//               "Includes list",
//               "Duration",
//               "Base Price",
//               "Tags such as office, home, premium",
//             ].map((item) => (
//               <div key={item} className="flex items-center gap-2">
//                 <Check className="w-4 h-4 text-brand-green" /> {item}
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {drawerOpen && (
//         <div className="fixed inset-0 z-[100]">
//           <button
//             aria-label="Close drawer"
//             className="absolute inset-0 bg-black/45"
//             onClick={closeDrawer}
//           />
//           <div className="absolute left-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl animate-[fade-in_.2s_ease-out]">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <span className="pill">
//                   {drawerMode === "edit" ? "Edit service" : "New service"}
//                 </span>
//                 <h2 className="mt-3 text-3xl text-brand-dark">
//                   {drawerMode === "edit" ? "Update cleaning" : "Add cleaning"}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeDrawer}
//                 className="rounded-full border border-border p-2"
//                 aria-label="Close service drawer"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={submitService} className="mt-8 space-y-5">
//               <Field label="Service Image">
//                 <div className="relative group overflow-hidden rounded-3xl border border-dashed border-border bg-brand-cream p-1 transition hover:border-brand-green">
//                   {form.image ? (
//                     <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
//                       <img
//                         src={form.image}
//                         alt="Preview"
//                         className="h-full w-full object-cover transition group-hover:scale-105"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
//                         <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-dark shadow-xl hover:bg-brand-lime transition">
//                           Change Image
//                           <input
//                             type="file"
//                             className="hidden"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                           />
//                         </label>
//                       </div>
//                     </div>
//                   ) : (
//                     <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2">
//                       {isUploading ? (
//                         <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
//                       ) : (
//                         <Upload className="h-6 w-6 text-brand-green" />
//                       )}
//                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
//                         {isUploading ? "Uploading..." : "Click to upload image"}
//                       </span>
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                       />
//                     </label>
//                   )}
//                 </div>
//               </Field>

//               <Field label="Name of the cleaning">
//                 <input
//                   required
//                   value={form.name}
//                   onChange={(event) =>
//                     setForm({ ...form, name: event.target.value })
//                   }
//                   className="admin-input"
//                   placeholder="Premium Kitchen Reset"
//                 />
//               </Field>
//               <Field label="Description">
//                 <textarea
//                   value={form.description}
//                   onChange={(event) =>
//                     setForm({ ...form, description: event.target.value })
//                   }
//                   className="admin-input min-h-28 resize-none"
//                   placeholder="Short service description"
//                 />
//               </Field>
//               <Field label="Includes list">
//                 <textarea
//                   value={form.includes}
//                   onChange={(event) =>
//                     setForm({ ...form, includes: event.target.value })
//                   }
//                   className="admin-input min-h-32 resize-none"
//                   placeholder={"Kitchen wipe-down\nBathroom sanitizing\nFloors"}
//                 />
//                 <p className="mt-2 text-xs text-muted-foreground">
//                   Add one item per line.
//                 </p>
//               </Field>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <Field label="Duration">
//                   <input
//                     value={form.duration}
//                     onChange={(event) =>
//                       setForm({ ...form, duration: event.target.value })
//                     }
//                     className="admin-input"
//                     placeholder="2-3 hrs"
//                   />
//                 </Field>
//                 <Field label="Base Price">
//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                       $
//                     </span>
//                     <input
//                       required
//                       value={form.basePrice}
//                       onChange={(event) =>
//                         setForm({ ...form, basePrice: event.target.value })
//                       }
//                       className="admin-input pl-8"
//                       placeholder="149"
//                     />
//                   </div>
//                 </Field>
//               </div>
//               <Field label="Tags">
//                 <input
//                   value={form.tags}
//                   onChange={(event) =>
//                     setForm({ ...form, tags: event.target.value })
//                   }
//                   className="admin-input"
//                   placeholder="home, office, premium"
//                 />
//                 <p className="mt-2 text-xs text-muted-foreground">
//                   Separate tags with commas.
//                 </p>
//               </Field>
//               <label className="flex items-center gap-3 rounded-2xl bg-brand-cream p-4 text-sm font-semibold text-brand-dark cursor-pointer transition hover:bg-brand-lime/10">
//                 <input
//                   type="checkbox"
//                   checked={form.isActive}
//                   onChange={(event) =>
//                     setForm({ ...form, isActive: event.target.checked })
//                   }
//                   className="rounded border-border text-brand-green focus:ring-brand-green"
//                 />
//                 Publish this service
//               </label>
//               <button
//                 type="submit"
//                 disabled={isCreating || isUpdating}
//                 className="btn-primary w-full disabled:opacity-70 flex items-center justify-center gap-2"
//               >
//                 {(isCreating || isUpdating) && (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 )}
//                 {drawerMode === "edit" ? "Save changes" : "Add service"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//       <style>{`.admin-input{width:100%;border:1px solid var(--border);border-radius:1rem;background:white;padding:.85rem 1rem;outline:none}.admin-input:focus{border-color:var(--brand-green);box-shadow:0 0 0 3px color-mix(in oklab,var(--brand-green) 15%,transparent)}`}</style>
//     </div>
//   );
// }

// function Field({ label, children }: { label: string; children: ReactNode }) {
//   return (
//     <label className="block">
//       <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//         {label}
//       </span>
//       <div className="mt-2">{children}</div>
//     </label>
//   );
// }
