import type { ReactNode } from "react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

export function SiteLayout({
  children,
  transparentNav = false,
}: {
  children: ReactNode;
  transparentNav?: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={`flex-1 ${transparentNav ? "-mt-[76px]" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
