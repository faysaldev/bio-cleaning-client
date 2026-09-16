import type { UserRole } from "../auth/types";

export type StaffRole = Exclude<UserRole, "user">;

export interface StaffAvailabilityDay {
  dayOfWeek: number;
  isAvailable: boolean;
  start: string;
  end: string;
}
export type StaffTimeOff = { startAt: string; endAt: string; reason?: string } | { startLocal: string; endLocal: string; reason?: string };

export interface StaffProfile {
  _id: string;
  userId?: string;
  employeeCode?: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  role: StaffRole;
  jobTitle?: string;
  skills: string[];
  isActive: boolean;
  capacityUnits: number;
  serviceIds: Array<string | { _id: string; name: string }>;
  weeklyHours: StaffAvailabilityDay[];
  timeOff: Array<{ startAt: string; endAt: string; reason?: string }>;
  emergencyContact?: { name?: string; phone?: string; relationship?: string };
  notes?: string;
  crews?: Array<{ _id: string; name: string }>;
}

export interface StaffInput {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  role?: StaffRole;
  jobTitle?: string;
  skills?: string[];
  isActive?: boolean;
  capacityUnits?: number;
  serviceIds?: string[];
  weeklyHours?: StaffAvailabilityDay[];
  timeOff?: StaffTimeOff[];
  emergencyContact?: { name?: string; phone?: string; relationship?: string };
  notes?: string;
  password?: string;
}

export interface Crew {
  _id: string;
  name: string;
  description?: string;
  memberIds: Array<string | StaffProfile>;
  leadStaffId?: string | StaffProfile;
  serviceIds: Array<string | { _id: string; name: string }>;
  isActive: boolean;
}

export interface CrewInput {
  name?: string;
  description?: string;
  memberIds?: string[];
  leadStaffId?: string | null;
  serviceIds?: string[];
  isActive?: boolean;
}
