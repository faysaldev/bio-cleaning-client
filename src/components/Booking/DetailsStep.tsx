import { useImperativeHandle, forwardRef, useRef } from "react";

interface DetailsStepProps {
  initialData: any;
}

export const DetailsStep = forwardRef(({ initialData }: DetailsStepProps, ref) => {
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
    { key: "name", label: "Full Name", type: "text", ref: nameRef },
    { key: "email", label: "Email", type: "email", ref: emailRef },
    { key: "phone", label: "Phone", type: "tel", ref: phoneRef },
    { key: "addr1", label: "Address Line 1", type: "text", ref: addr1Ref },
    { key: "addr2", label: "Address Line 2 (optional)", type: "text", ref: addr2Ref },
    { key: "city", label: "City", type: "text", ref: cityRef },
    { key: "zip", label: "Zip Code", type: "text", ref: zipRef },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-brand-dark mb-2">Your details</h2>
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {f.label}
          </span>
          <input
            type={f.type}
            ref={f.ref as any}
            defaultValue={initialData[f.key] || ""}
            className="mt-1.5 w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-brand-green/20 outline-none transition"
          />
        </label>
      ))}
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Special instructions
        </span>
        <textarea
          rows={3}
          ref={notesRef}
          defaultValue={initialData.notes || ""}
          className="mt-1.5 w-full p-3 rounded-xl border border-border resize-none focus:ring-2 focus:ring-brand-green/20 outline-none transition"
        />
      </label>
    </div>
  );
});

DetailsStep.displayName = "DetailsStep";
