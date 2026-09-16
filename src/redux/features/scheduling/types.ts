export interface WeeklyHours {
  dayOfWeek: number;
  isOpen: boolean;
  start: string;
  end: string;
}

export interface SchedulingSettings {
  _id?: string;
  timezone: string;
  slotIntervalMinutes: number;
  bookingLeadTimeHours: number;
  bookingHorizonDays: number;
  defaultTravelBufferMinutes: number;
  defaultCrewCapacity: number;
  cancellationNoticeHours: number;
  rescheduleNoticeHours: number;
  allowLateCancellation: boolean;
  lateCancellationFeePercent: number;
  depositPolicy: "NONE" | "OPTIONAL" | "REQUIRED";
  depositType: "PERCENT" | "FIXED";
  depositValue: number;
  currency: string;
  recurrenceMaxOccurrences: number;
  weeklyHours: WeeklyHours[];
  closedDates: Array<{ date: string; reason?: string }>;
}

export interface PublicSchedulingConfig {
  timezone: string;
  slotIntervalMinutes: number;
  bookingLeadTimeHours: number;
  bookingHorizonDays: number;
  weeklyHours: WeeklyHours[];
  closedDates: Array<{ date: string; reason?: string }>;
  cancellationPolicy: {
    noticeHours: number;
    rescheduleNoticeHours: number;
    allowLateCancellation: boolean;
    lateCancellationFeePercent: number;
  };
  payment: {
    depositPolicy: "NONE" | "OPTIONAL" | "REQUIRED";
    depositType: "PERCENT" | "FIXED";
    depositValue: number;
    currency: string;
  };
  recurrenceMaxOccurrences: number;
}

export type StaffTimeOffInput =
  | { startAt: string; endAt: string; reason?: string }
  | { startLocal: string; endLocal: string; reason?: string };

export interface StaffScheduleInput {
  name?: string;
  email?: string;
  isActive?: boolean;
  capacityUnits?: number;
  serviceIds?: string[];
  weeklyHours?: Array<{
    dayOfWeek: number;
    isAvailable: boolean;
    start: string;
    end: string;
  }>;
  timeOff?: StaffTimeOffInput[];
}

export interface StaffSchedule {
  _id: string;
  name: string;
  email?: string;
  isActive: boolean;
  capacityUnits: number;
  serviceIds: string[];
  weeklyHours: Array<{
    dayOfWeek: number;
    isAvailable: boolean;
    start: string;
    end: string;
  }>;
  timeOff: Array<{ startAt: string; endAt: string; reason?: string }>;
}

export interface ScheduleBlock {
  _id: string;
  title: string;
  startAt: string;
  endAt: string;
  capacityReduction: number;
  serviceId?: string;
}

export interface ScheduleBlockInput {
  title?: string;
  startAt?: string;
  endAt?: string;
  startLocal?: string;
  endLocal?: string;
  capacityReduction?: number;
  serviceId?: string | null;
}
