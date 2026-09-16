export type BookingFrequency = "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";

export interface BookingPriceBreakdown {
  basePrice: number;
  propertyAdjustment: number;
  minimumPrice: number;
  serviceSubtotal: number;
  frequencyDiscountPercent: number;
  frequencyDiscountAmount: number;
  extrasTotal: number;
  subtotal: number;
  promotionDiscount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Booking {
  _id?: string;
  id?: string;
  reference: string;
  serviceId?: string;
  serviceType: string;
  propertySize: string;
  date: string;
  timeSlot: string;
  frequency: BookingFrequency;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      zip: string;
    };
  };
  extras?: Array<{ code: string; name: string; price: number }>;
  promoCode?: string;
  priceBreakdown?: BookingPriceBreakdown;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface BookingQuoteInput {
  serviceId: string;
  propertySize: string;
  frequency: BookingFrequency;
  extraCodes?: string[];
  promoCode?: string;
}

export interface BookingQuote {
  serviceId: string;
  serviceName: string;
  extras: Array<{ code: string; name: string; price: number }>;
  promoCode?: string;
  priceBreakdown: BookingPriceBreakdown;
  totalAmount: number;
}

export interface CreateBookingInput extends BookingQuoteInput {
  date: string;
  timeSlot: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      zip: string;
    };
  };
  notes?: string;
}

export type BookedSlot = string;

export interface BookingResponse {
  code: number;
  message: string;
  status: string;
  data: Booking[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
