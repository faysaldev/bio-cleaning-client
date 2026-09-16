import type { Crew, StaffProfile } from "../team/types";

export type JobStatus = "SCHEDULED" | "EN_ROUTE" | "IN_PROGRESS" | "PAUSED" | "ISSUE" | "COMPLETED" | "CANCELLED";

export interface FieldJob {
  _id: string;
  jobNumber: string;
  bookingId: string | { _id: string; reference: string; status: string; serviceType: string; totalAmount: number; requiredStaffSnapshot?: number; frequency?: string };
  customerId?: string | { _id: string; name: string; email?: string; phone?: string };
  serviceId?: string | { _id: string; name: string; image?: string };
  status: JobStatus;
  scheduledStart: string;
  scheduledEnd: string;
  businessTimezone?: string;
  assignedStaffIds: Array<string | StaffProfile>;
  crewId?: string | Crew;
  address: { line1: string; line2?: string; city: string; zip: string };
  customerName: string;
  customerPhone?: string;
  customerInstructions?: string;
  internalNotes: Array<{ text: string; createdAt: string; createdBy?: string }>;
  checklist: Array<{ key: string; label: string; completed: boolean; completedAt?: string; completedBy?: string }>;
  photos: Array<{ key: string; type: "BEFORE" | "AFTER" | "ISSUE"; url: string; caption?: string; uploadedAt: string; uploadedBy?: string }>;
  issues: Array<{ key: string; title: string; description: string; severity: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; status: "OPEN" | "RESOLVED"; reportedAt: string; resolution?: string; resolvedAt?: string }>;
  actualStartedAt?: string;
  actualCompletedAt?: string;
}

export interface FieldOverview {
  staff: StaffProfile;
  timezone: string;
  date: string;
  jobs: FieldJob[];
  summary: { total: number; scheduled: number; active: number; completed: number };
}
