import HomePage from "@/src/Views/HomePage";
import type { Metadata } from "next";
import Link from "next/link";
import { Eye, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Draft Preview | BIO Cleaning",
  robots: { index: false, follow: false },
};

export default async function WebsitePreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <div>
      {/* Draft CMS Live Preview Sticky Bar */}
      <aside className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-brand-lime/30 bg-[#0C3629] px-4 py-2.5 text-xs text-white shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-lime opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-lime" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-lime">
            <Eye className="h-3 w-3" /> Live CMS Draft
          </span>
          <span className="hidden sm:inline text-white/80 font-medium">
            Viewing unpublished staging content. Changes are not live for general public.
          </span>
        </div>

        <Link
          href="/"
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
        >
          Exit Preview
        </Link>
      </aside>

      <HomePage previewToken={token} />
    </div>
  );
}
