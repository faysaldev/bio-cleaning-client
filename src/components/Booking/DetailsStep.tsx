import { forwardRef, useImperativeHandle, useRef } from "react";

interface DetailsStepProps {
  initialData: Record<string, string | undefined>;
}

export const DetailsStep = forwardRef(function DetailsStep({ initialData }: DetailsStepProps, ref) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addr1Ref = useRef<HTMLInputElement>(null);
  const addr2Ref = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      phone: phoneRef.current?.value,
      addr1: addr1Ref.current?.value,
      addr2: addr2Ref.current?.value,
      city: cityRef.current?.value,
      zip: zipRef.current?.value,
      notes: notesRef.current?.value,
    }),
  }));

  const fields = [
    { key: "name", label: "Full name", type: "text", ref: nameRef, autoComplete: "name", required: true },
    { key: "email", label: "Email", type: "email", ref: emailRef, autoComplete: "email", required: true },
    { key: "phone", label: "Phone", type: "tel", ref: phoneRef, autoComplete: "tel", required: true },
    { key: "addr1", label: "Address line 1", type: "text", ref: addr1Ref, autoComplete: "address-line1", required: true },
    { key: "addr2", label: "Address line 2 (optional)", type: "text", ref: addr2Ref, autoComplete: "address-line2", required: false },
    { key: "city", label: "City", type: "text", ref: cityRef, autoComplete: "address-level2", required: true },
    { key: "zip", label: "ZIP code", type: "text", ref: zipRef, autoComplete: "postal-code", required: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-green">Step 3</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-dark">Your details</h2>
        <p className="mt-1 text-sm text-muted-foreground">We’ll use these details for your confirmation and service address.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === "addr1" || field.key === "addr2" ? "sm:col-span-2" : ""}>
            <label htmlFor={`booking-${field.key}`} className="field-label">{field.label}</label>
            <input
              id={`booking-${field.key}`}
              type={field.type}
              ref={field.ref}
              defaultValue={initialData[field.key] || ""}
              autoComplete={field.autoComplete}
              required={field.required}
              className="field-control"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="booking-notes" className="field-label">Special instructions</label>
        <textarea id="booking-notes" rows={4} ref={notesRef} defaultValue={initialData.notes || ""} className="field-control min-h-28 resize-y" placeholder="Access notes, pets, parking, priority areas…" />
      </div>
    </div>
  );
});
