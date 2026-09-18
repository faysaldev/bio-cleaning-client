import type { Booking } from "../bookings/types";
import type { InvoiceRecord, PaymentRecord } from "../finance/types";

export interface PortalAddress {
  _id?: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  zip: string;
  country?: string;
  propertyType?: "HOME" | "OFFICE" | "OTHER";
  isPrimary?: boolean;
}
export interface PortalCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  addresses: PortalAddress[];
  preferences?: { contactMethod?: "EMAIL" | "PHONE" | "SMS"; preferredContactWindow?: string; serviceNotes?: string };
  accessInstructions?: string;
  pets?: Array<{ _id?: string; name?: string; type: string; notes?: string }>;
}
export interface PortalSession { csrfToken: string; customer: PortalCustomer; portalSession?: string }
export interface PortalOverview {
  customer: PortalCustomer;
  upcoming: Booking[];
  recent: Booking[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  unreadNotifications: number;
}
export interface PortalPaged<T> { items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }
export interface PortalNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  readAt?: string;
  createdAt: string;
}
export interface PortalNotifications extends PortalPaged<PortalNotification> { unread: number }
export interface RebookDraft {
  serviceId?: string;
  property: any;
  extraCodes: string[];
  frequency: string;
  customerDetails: any;
  notes?: string;
}
