"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingState } from "@/src/components/ui/feedback";
import { useExchangePortalLinkMutation } from "@/src/redux/features/portal/portalApi";

export default function PortalAuthPage() {
  const router = useRouter();
  const [exchange] = useExchangePortalLinkMutation();
  const [error, setError] = useState("");
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setError("The secure sign-in token is missing."); return; }
    exchange({ token }).unwrap().then((result) => {
      sessionStorage.setItem("bio_portal_csrf", result.csrfToken);
      window.history.replaceState({}, "", "/portal/auth");
      router.replace("/portal");
    }).catch((e:any)=>setError(e?.data?.message || "This portal link is invalid or expired."));
  }, [exchange, router]);
  return <main className="min-h-screen bg-brand-cream px-4 py-20"><div className="mx-auto max-w-lg">{error ? <div className="surface p-8 text-center"><h1 className="text-2xl font-extrabold text-brand-dark">We couldn’t open that link</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><Link href="/portal/login" className="btn-primary mt-6">Request a new link</Link></div> : <LoadingState label="Verifying your secure portal link…" />}</div></main>;
}
