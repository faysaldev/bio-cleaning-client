import BookPage from "@/src/Views/BookPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Now",
  description: "Schedule your professional cleaning service with BIO Cleaning LLC. Quick and easy online booking for all your cleaning needs.",
  keywords: [
    "online cleaning booking", "schedule cleaning service", "instant cleaning quote", 
    "book house cleaning", "commercial cleaning appointment", "reserve cleaners",
    "easy cleaning schedule"
  ],
};

export default function Home() {
  return <BookPage />;
}
