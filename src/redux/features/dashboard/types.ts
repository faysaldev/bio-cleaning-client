export interface StatDetail {
  value: number;
  change: number;
}

export interface DashboardStats {
  revenue: StatDetail;
  bookings: StatDetail;
  completed: StatDetail;
  clients: StatDetail;
  clientList: any[];
  finance?: {
    outstandingInvoices: number;
    paidRevenue: number;
    averageBookingValue: number;
    invoiceCount: number;
    aging: Array<{ label: string; amount: number }>;
    paymentStatus: Array<{ status: string; count: number; amount: number }>;
  };
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}

export interface RecentBookingsResponse {
  data: any[];
}
