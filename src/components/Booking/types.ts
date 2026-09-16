import type { BookingFrequency, BookingProperty, PaymentOption } from "@/src/redux/features/bookings/types";

export interface BookingDraft {
  serviceId: string;
  property: BookingProperty;
  extraCodes: string[];
  frequency: BookingFrequency;
  occurrenceCount: number;
  date: string;
  timeSlot: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: { line1: string; line2?: string; city: string; zip: string };
  };
  notes: string;
  promoCode?: string;
  paymentOption: PaymentOption;
}
