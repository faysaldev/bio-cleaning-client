import type { ReactNode } from "react";
import type { WebsitePublicPayload } from "@/src/redux/features/website/types";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

export function SiteLayout({ children, transparentNav = false, website }: { children: ReactNode; transparentNav?: boolean; website?: WebsitePublicPayload }) {
  return <div className="flex min-h-screen flex-col bg-background"><Navbar website={website} /><main className={`flex-1 ${transparentNav ? "-mt-[76px]" : ""}`}>{children}</main><Footer website={website} /></div>;
}
