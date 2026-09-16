export interface RetentionSettings {
  bookingRemindersEnabled: boolean;
  reminderHoursBefore: number[];
  reviewRequestsEnabled: boolean;
  reviewDelayMinutes: number;
  reviewLinkDays: number;
  publicReviewThreshold: number;
  publicReviewUrl?: string;
  rebookRemindersEnabled: boolean;
  rebookReminderDays: number;
  winBackEnabled: boolean;
  inactiveCustomerDays: number;
  smsEnabled: boolean;
}
export interface CommunicationSummary {
  settings: RetentionSettings;
  notificationCount: number;
  unreadCount: number;
  queue: { queued: number; failed: number; sent: number };
  reviews: { pending: number; submitted: number };
}
export interface DeliveryRecord { _id: string; channel: "EMAIL"|"SMS"; recipient: string; subject?: string; status: string; attempts: number; lastError?: string; createdAt: string; sentAt?: string }
export interface ReviewRecord { _id: string; status: string; rating?: number; comment?: string; publishConsent?: boolean; createdAt: string; submittedAt?: string; customerId?: any; bookingId?: any }
export interface PublicReview { status: string; rating?: number; comment?: string; booking?: { reference: string; serviceType: string; startAt?: string }; customerName: string }
