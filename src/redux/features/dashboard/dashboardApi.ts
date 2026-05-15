import { baseApi } from "@/src/redux/baseApi/baseApi";
import { DashboardStats } from "./types";
import { Booking } from "../bookings/types";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getRecentBookings: builder.query<Booking[], void>({
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
