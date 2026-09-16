export type BookingFrequency = "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
export type PaymentOption = "PAY_LATER" | "DEPOSIT";

export interface BookingProperty {
  propertyType: "HOME" | "OFFICE" | "OTHER";
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
}

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
  property?: BookingProperty;
  date: string;
  timeSlot: string;
  startAt?: string;
  endAt?: string;
  businessTimezone?: string;
  durationMinutes?: number;
  requiredStaffSnapshot?: number;
  frequency: BookingFrequency;
  recurrenceGroupId?: string;
  occurrenceIndex?: number;
  occurrenceCount?: number;
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
  extras?: Array<{ code: string; name: string; price: number; durationMinutes?: number }>;
  promoCode?: string;
  priceBreakdown?: BookingPriceBreakdown;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  cancellationPolicy?: {
    noticeHours: number;
    rescheduleNoticeHours: number;
    allowLateCancellation: boolean;
    lateCancellationFeePercent: number;
  };
  cancellationFee?: number;
  payment?: {
    option: PaymentOption;
    status: "NOT_REQUIRED" | "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    depositAmount: number;
    currency: string;
    checkoutSessionId?: string;
    checkoutUrl?: string;
    attempt?: number;
    paidAt?: string;
  };
  createdAt: string;
}

export interface BookingQuoteInput {
  serviceId: string;
  property: BookingProperty;
  propertySize?: string;
  frequency: BookingFrequency;
  extraCodes?: string[];
  promoCode?: string;
}

export interface BookingQuote {
  serviceId: string;
  serviceName: string;
  extras: Array<{ code: string; name: string; price: number; durationMinutes?: number }>;
  promoCode?: string;
  priceBreakdown: BookingPriceBreakdown;
  totalAmount: number;
  propertyLabel: string;
  durationMinutes: number;
  requiredStaff: number;
  preparationInstructions: string[];
  payment: {
    depositPolicy: "NONE" | "OPTIONAL" | "REQUIRED";
    depositAmount: number;
    currency: string;
  };
}

export interface AvailabilityInput extends BookingQuoteInput {
  date: string;
}

export interface AvailabilitySlot {
  time: string;
  label: string;
  startAt: string;
  endAt: string;
  remainingCapacity: number;
}

export interface AvailabilityResponse {
  date: string;
  timezone: string;
  durationMinutes: number;
  requiredStaff: number;
  slots: AvailabilitySlot[];
  closed: boolean;
}

export interface CreateBookingInput extends BookingQuoteInput {
  date: string;
  timeSlot: string;
  occurrenceCount?: number;
  customerDetails: Booking["customerDetails"];
  notes?: string;
  paymentOption?: PaymentOption;
  bookingSessionId?: string;
}

export interface CreateBookingResult {
  booking: Booking;
  occurrences: Booking[];
  manageToken: string;
  checkoutUrl?: string;
  paymentError?: string;
}

export interface BookingResponse {
  code: number;
  message: string;
  status: string;
  data: Booking[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface WaitlistInput {
  serviceId: string;
  requestedDate: string;
  preferredTime?: string;
  frequency: BookingFrequency;
  property: BookingProperty;
  extraCodes: string[];
  customer: { name: string; email: string; phone: string };
}

export interface AbandonmentInput {
  sessionId: string;
  state?: "ACTIVE" | "ABANDONED";
  stage: string;
  serviceId?: string;
  property?: BookingProperty;
  extraCodes?: string[];
  frequency?: BookingFrequency;
  requestedDate?: string;
  requestedTime?: string;
  customer?: { name?: string; email?: string; phone?: string };
}

export interface ManageBookingInput {
  reference: string;
  manageToken: string;
}

export interface AdminWaitlistEntry {
  _id: string;
  serviceId?: string | { _id: string; name: string };
  requestedDate: string;
  preferredTime?: string;
  frequency: BookingFrequency;
  customer: { name: string; email: string; phone: string };
  status: "WAITING" | "NOTIFIED" | "BOOKED" | "CANCELLED";
  createdAt: string;
}

export interface AdminAbandonedBooking {
  _id: string;
  sessionId: string;
  state: "ACTIVE" | "ABANDONED" | "CONVERTED";
  stage: string;
  serviceId?: string | { _id: string; name: string };
  frequency?: BookingFrequency;
  requestedDate?: string;
  requestedTime?: string;
  customer?: { name?: string; email?: string; phone?: string };
  lastActivityAt: string;
  createdAt: string;
}

export interface AdminRecoveryResponse<T> {
  code: number;
  message: string;
  status: string;
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
