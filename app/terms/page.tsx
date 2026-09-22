import type { Metadata } from "next";
import { PolicyPage } from "@/src/components/Website/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | BIO Cleaning",
  description:
    "Review our service terms, customer agreement, payment policies, and satisfaction guarantee standards.",
};

export default function TermsPage() {
  return <PolicyPage policy="terms" title="Terms & Conditions" />;
}
