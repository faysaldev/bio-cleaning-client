import type { Metadata } from "next";
import QuotePage from "@/src/Views/QuotePage";

export const metadata: Metadata = {
  title: "Get a Cleaning Quote",
  description: "Build a server-calculated BIO Cleaning estimate and send the request directly to our team for follow-up.",
};

export default function Page() {
  return <QuotePage />;
}
