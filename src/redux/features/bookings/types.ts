export interface Booking {
  id: string;
  reference: string;
  serviceType: string;
  propertySize: string;
  date: string;
  timeSlot: string;
  frequency: "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      zip: string;
    };
  };
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export type BookedSlot = string;

export interface BookingResponse {
  data: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
