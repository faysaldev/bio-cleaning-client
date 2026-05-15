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
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}

export interface RecentBookingsResponse {
  data: any[];
}
