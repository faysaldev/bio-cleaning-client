export interface ReportSummary {
  revenue: number; recurringRevenue: number; averageOrderValue: number; unpaidInvoices: number;
  leadConversionRate: number; quoteAcceptanceRate: number; bookingCompletionRate: number; cancellationRate: number;
  customerRetentionRate: number; cleanerUtilization: number; reviewScore: number; reviewCount: number;
}
export interface ReportData {
  range: { from: string; to: string; days: number };
  summary: ReportSummary;
  leadsBySource: Array<{ source: string; count: number; value: number }>;
  pipeline: Array<{ status: string; count: number; value: number }>;
  conversions: { leads: { total: number; won: number }; quotes: { sent: number; accepted: number }; bookings: { total: number; completed: number; cancelled: number } };
  revenueTrend: Array<{ date: string; revenue: number; gross: number; refunds: number }>;
  servicePerformance: Array<{ serviceId?: string; service: string; bookings: number; completed: number; cancelled: number; bookedValue: number; completionRate: number }>;
  cleaner: { activeStaff: number; capacityUnits: number; scheduledLaborHours: number; availableLaborHours: number; utilization: number; jobs: number; completedJobs: number };
  retention: { activeCustomers: number; repeatCustomers: number; rate: number; totalCustomers: number };
  invoices: { unpaidAmount: number; statuses: Array<{ status: string; count: number; amountDue: number; total: number }> };
  reviews: { average: number; count: number; satisfactionRate: number };
}
