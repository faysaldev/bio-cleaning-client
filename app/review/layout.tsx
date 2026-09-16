import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Service Review",
  robots: { index: false, follow: false, nocache: true },
};

export default function ReviewLayout({ children }: { children: ReactNode }) {
  return children;
}
