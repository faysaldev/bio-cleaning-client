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
      if (result.portalSession) {
        sessionStorage.setItem("bio_portal_session", result.portalSession);
      }
      window.history.replaceState({}, "", "/portal/auth");
      router.replace("/portal");
    }).catch((e:any)=>setError(e?.data?.message || "This portal link is invalid or expired."));
  }, [exchange, router]);
  return (
    <main className="min-h-screen bg-[#F7FAF8] px-4 py-20 flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg">
        {error ? (
          <div className="rounded-3xl border border-brand-green/15 bg-white p-8 sm:p-10 text-center shadow-xl">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
              <span className="text-xl font-black">!</span>
            </div>
            <h1 className="text-2xl font-extrabold text-brand-dark">Link Expired or Invalid</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{error}</p>
            <div className="mt-6">
              <Link href="/portal/login" className="btn-primary inline-flex rounded-full px-7">
                Request a new link
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-green/15 bg-white p-10 text-center shadow-lg">
            <LoadingState label="Verifying your secure portal link…" />
          </div>
        )}
      </div>
    </main>
  );
}
