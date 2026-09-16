export type LeadStatus =
  | "NEW"
  | "ATTEMPTED_CONTACT"
  | "CONTACTED"
  | "ESTIMATE_QUOTE_SENT"
  | "FOLLOW_UP"
  | "WON"
  | "LOST";

export type LeadSource =
  | "CONTACT"
  | "GET_QUOTE"
  | "PHONE"
  | "MANUAL"
  | "BOOKING_ABANDONMENT"
  | "REFERRAL"
  | "IMPORT"
  | "ONLINE_BOOKING";

export interface PersonRef {
  _id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  sourceHistory?: Array<{ source: LeadSource; referenceId?: string; capturedAt: string }>;
  status: LeadStatus;
  ownerId?: string | PersonRef;
  value: number;
  requestedServiceId?: string | { _id: string; name: string; basePrice?: number; image?: string };
  requestedServiceName?: string;
  message?: string;
  notes?: string;
  tags: string[];
  nextFollowUpAt?: string;
  lastContactAt?: string;
  lastActivityAt: string;
  customerId?: string | { _id: string; name: string; email?: string; phone?: string; addresses?: CustomerAddress[] };
  referral?: { referredBy?: string; details?: string };
  lostReason?: string;
  wonAt?: string;
  lostAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  _id: string;
  type: "SYSTEM" | "NOTE" | "CALL" | "EMAIL" | "SMS" | "STATUS_CHANGE" | "FOLLOW_UP" | "QUOTE" | "CUSTOMER_CREATED" | "BOOKING";
  title: string;
  body?: string;
  direction?: "INBOUND" | "OUTBOUND" | "INTERNAL";
  createdBy?: PersonRef;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

export interface LeadTask {
  _id: string;
  leadId: string | Pick<Lead, "_id" | "name" | "email" | "phone" | "status" | "requestedServiceName" | "value">;
  title: string;
  description?: string;
  dueAt: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedTo?: PersonRef;
  createdBy?: PersonRef;
  completedAt?: string;
  createdAt: string;
}

export interface LeadDetail {
  lead: Lead;
  activities: LeadActivity[];
  tasks: LeadTask[];
}

export interface PipelineStage {
  status: LeadStatus;
  count: number;
  value: number;
}

export interface PipelineSummary {
  stages: PipelineStage[];
  openLeads: number;
  openValue: number;
}

export interface LeadBoard {
  stages: Array<{ status: LeadStatus; total: number; items: Lead[] }>;
  limitPerStage: number;
}

export interface FollowUpQueue {
  timezone: string;
  date: string;
  overdue: LeadTask[];
  today: LeadTask[];
  upcoming: LeadTask[];
}

export interface CustomerAddress {
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

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "ACTIVE" | "ARCHIVED";
  addresses: CustomerAddress[];
  preferences?: {
    contactMethod?: "EMAIL" | "PHONE" | "SMS";
    preferredContactWindow?: string;
    serviceNotes?: string;
  };
  accessInstructions?: string;
  pets?: Array<{ _id?: string; name?: string; type: string; notes?: string }>;
  tags: string[];
  notes?: Array<{ _id?: string; body: string; createdBy?: string | PersonRef; createdAt: string }>;
  reviews?: Array<{ _id?: string; rating: number; comment?: string; source?: string; bookingReference?: string; createdAt: string }>;
  createdSource?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
  summary?: {
    bookings: number;
    completed: number;
    lifetimeValue: number;
    nextBookingAt?: string | null;
  };
}

export interface Customer360 {
  customer: Customer;
  bookings: Array<any>;
  upcomingWork: Array<any>;
  invoices: Array<{
    id: string;
    reference: string;
    source: string;
    amount: number;
    depositAmount: number;
    paymentStatus: string;
    service: string;
    date: string;
  }>;
  outstandingBalance: number;
  lifetimeValue: number;
  completedBookings: number;
  leads: Lead[];
  openTasks: LeadTask[];
  reviews: NonNullable<Customer["reviews"]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface DataResponse<T> {
  data: T;
  message?: string;
}

export const LEAD_STAGE_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  ATTEMPTED_CONTACT: "Attempted contact",
  CONTACTED: "Contacted",
  ESTIMATE_QUOTE_SENT: "Estimate / quote sent",
  FOLLOW_UP: "Follow-up",
  WON: "Won",
  LOST: "Lost",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  CONTACT: "Contact form",
  GET_QUOTE: "Get quote",
  PHONE: "Phone",
  MANUAL: "Manual",
  BOOKING_ABANDONMENT: "Booking abandonment",
  REFERRAL: "Referral",
  IMPORT: "Import",
  ONLINE_BOOKING: "Online booking",
};
