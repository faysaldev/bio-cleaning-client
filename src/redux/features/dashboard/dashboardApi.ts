import { baseApi } from "@/src/redux/baseApi/baseApi";
import { DashboardStatsResponse, RecentBookingsResponse } from "./types";
import { Booking } from "../bookings/types";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getRecentBookings: builder.query<RecentBookingsResponse, void>({
      query: () => ({
        url: "/dashboard/recent-bookings",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentBookingsQuery } =
  dashboardApi;
