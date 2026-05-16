import HomePage from "@/src/Views/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Home & Office Cleaning",
  description: "Experience the best eco-friendly cleaning services with BIO Cleaning LLC. Expert care for homes and offices.",
  keywords: [
    "house cleaning", "office cleaning", "janitorial services", "maid service", 
    "disinfection services", "certified cleaners", "local cleaning company", 
    "best home cleaners", "commercial janitorial", "eco cleaning"
  ],
};

export default function Home() {
  return <HomePage />;
}
