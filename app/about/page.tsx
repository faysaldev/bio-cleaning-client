import AboutPage from "@/src/Views/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about BIO Cleaning LLC, our mission, our eco-friendly values, and our commitment to providing a spotless environment.",
  keywords: [
    "cleaning mission", "eco-friendly values", "trusted cleaning team", 
    "professional cleaning standards", "cleaning company history", "sustainable cleaning",
    "green cleaning experts"
  ],
};

export default function Home() {
  return <AboutPage />;
}
