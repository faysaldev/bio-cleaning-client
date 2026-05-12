import {
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  DollarSign,
  Sparkles,
  Users,
} from "lucide-react";

export const adminStats = [
  {
    label: "Revenue",
    value: "$18.4K",
    change: "+12.8%",
    icon: DollarSign,
  },
  {
    label: "Bookings",
    value: "126",
    change: "+18 new",
    icon: CalendarClock,
  },
  {
    label: "Confirmed",
    value: "89",
    change: "71% rate",
    icon: BadgeCheck,
  },
  {
    label: "Clients",
    value: "5.1K",
    change: "+42 this month",
    icon: Users,
  },
];

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  location: string;
  total: string;
  status: BookingStatus;
};

export const recentBookings: Booking[] = [
  {
    id: "BIO-92741",
    customer: "Maya Peterson",
    service: "Residential Cleaning",
    date: "May 15, 2026",
    time: "Morning 8-12",
    location: "Brooklyn, NY",
    total: "$149",
    status: "Pending",
  },
  {
    id: "BIO-81620",
    customer: "Daniel Cho",
    service: "Deep Cleaning",
    date: "May 16, 2026",
    time: "Afternoon 12-5",
    location: "Jersey City, NJ",
    total: "$249",
    status: "Confirmed",
  },
  {
    id: "BIO-74318",
    customer: "Aisha Bennett",
    service: "Commercial Cleaning",
    date: "May 16, 2026",
    time: "Evening 5-8",
    location: "Manhattan, NY",
    total: "$229",
    status: "Pending",
  },
  {
    id: "BIO-63952",
    customer: "Marcus Lee",
    service: "Move-In / Move-Out",
    date: "May 17, 2026",
    time: "Morning 8-12",
    location: "Boston, MA",
    total: "$299",
    status: "Completed",
  },
  {
    id: "BIO-52891",
    customer: "Priya Shah",
    service: "Residential Cleaning",
    date: "May 18, 2026",
    time: "Afternoon 12-5",
    location: "Queens, NY",
    total: "$149",
    status: "Confirmed",
  },
  {
    id: "BIO-41970",
    customer: "Sarah Mitchell",
    service: "Deep Cleaning",
    date: "May 18, 2026",
    time: "Morning 8-12",
    location: "Brooklyn, NY",
    total: "$249",
    status: "Pending",
  },
  {
    id: "BIO-38264",
    customer: "Noah Williams",
    service: "Post-Construction",
    date: "May 19, 2026",
    time: "Evening 5-8",
    location: "Hoboken, NJ",
    total: "$399",
    status: "Cancelled",
  },
];

export type AdminService = {
  name: string;
  category: string;
  price: string;
  duration: string;
  active: boolean;
};

export const adminServices: AdminService[] = [
  {
    name: "Residential Cleaning",
    category: "Home",
    price: "$149",
    duration: "2-3 hrs",
    active: true,
  },
  {
    name: "Commercial Cleaning",
    category: "Office",
    price: "$229",
    duration: "3-5 hrs",
    active: true,
  },
  {
    name: "Deep Cleaning",
    category: "Premium",
    price: "$249",
    duration: "4-6 hrs",
    active: true,
  },
];

export const dashboardTasks = [
  {
    title: "Confirm pending bookings",
    detail: "3 bookings need a service-window confirmation.",
    icon: ClipboardList,
  },
  {
    title: "Update service add-ons",
    detail: "Review seasonal pricing for carpet and oven cleaning.",
    icon: Sparkles,
  },
];
