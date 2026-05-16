import ContactPage from "@/src/Views/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with BIO Cleaning LLC for inquiries, quotes, or support. We are here to help you keep your space clean and healthy.",
  keywords: [
    "cleaning quote", "cleaning consultation", "customer support", 
    "contact cleaners", "cleaning inquiry", "hire professional cleaners",
    "cleaning service estimate"
  ],
};

export default function Home() {
  return <ContactPage />;
}
