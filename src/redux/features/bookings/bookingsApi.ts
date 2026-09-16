import { baseApi } from "@/src/redux/baseApi/baseApi";
import {
  AbandonmentInput,
  AdminAbandonedBooking,
  AdminRecoveryResponse,
  AdminWaitlistEntry,
  AvailabilityInput,
  AvailabilityResponse,
  Booking,
  BookingQuote,
  BookingQuoteInput,
  BookingResponse,
  CreateBookingInput,
  CreateBookingResult,
  ManageBookingInput,
  WaitlistInput,
} from "./types";

type ApiResponse<T> = {
  code: number;
  message: string;
  status: string;
  data: T;
  meta?: unknown;
};

const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingQuote: builder.mutation<BookingQuote, BookingQuoteInput>({
      query: (data) => ({ url: "/bookings/quote", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<BookingQuote>) => response.data,
    }),
    getAvailability: builder.mutation<AvailabilityResponse, AvailabilityInput>({
      query: (data) => ({ url: "/bookings/availability", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<AvailabilityResponse>) => response.data,
    }),
    createBooking: builder.mutation<CreateBookingResult, CreateBookingInput>({
      query: (data) => ({ url: "/bookings", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<CreateBookingResult>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    createAdminBooking: builder.mutation<CreateBookingResult, CreateBookingInput>({
      query: (data) => ({ url: "/bookings/admin", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<CreateBookingResult>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    joinWaitlist: builder.mutation<unknown, WaitlistInput>({
      query: (data) => ({ url: "/bookings/waitlist", method: "POST", body: data }),
    }),
    captureAbandonment: builder.mutation<unknown, AbandonmentInput>({
      query: (data) => ({ url: "/bookings/abandonment", method: "POST", body: data }),
    }),
    lookupManagedBooking: builder.mutation<Booking, ManageBookingInput>({
      query: (data) => ({ url: "/bookings/manage/lookup", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
    }),
    cancelManagedBooking: builder.mutation<Booking, ManageBookingInput & { reason?: string }>({
      query: (data) => ({ url: "/bookings/manage/cancel", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    rescheduleManagedBooking: builder.mutation<Booking, ManageBookingInput & { date: string; timeSlot: string }>({
      query: (data) => ({ url: "/bookings/manage/reschedule", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    startManagedPayment: builder.mutation<{ alreadyPaid: boolean; checkoutUrl?: string }, ManageBookingInput>({
      query: (data) => ({ url: "/bookings/manage/payment", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<{ alreadyPaid: boolean; checkoutUrl?: string }>) => response.data,
    }),
    getAllBookings: builder.query<BookingResponse, Record<string, unknown>>({
      query: (params) => ({ url: "/bookings", method: "GET", params }),
      providesTags: ["Booking"],
    }),
    getAdminWaitlist: builder.query<AdminRecoveryResponse<AdminWaitlistEntry>, Record<string, unknown> | void>({
      query: (params) => ({ url: "/bookings/admin/waitlist", method: "GET", params: params || undefined }),
      providesTags: ["Booking"],
    }),
    getAdminAbandonedBookings: builder.query<AdminRecoveryResponse<AdminAbandonedBooking>, Record<string, unknown> | void>({
      query: (params) => ({ url: "/bookings/admin/abandoned", method: "GET", params: params || undefined }),
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation<Booking, { id: string; status: Booking["status"] }>({
      query: ({ id, status }) => ({ url: `/bookings/${id}/status`, method: "PATCH", body: { status } }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
  }),
});

export const {
  useGetBookingQuoteMutation,
  useGetAvailabilityMutation,
  useCreateBookingMutation,
  useCreateAdminBookingMutation,
  useJoinWaitlistMutation,
  useCaptureAbandonmentMutation,
  useLookupManagedBookingMutation,
  useCancelManagedBookingMutation,
  useRescheduleManagedBookingMutation,
  useStartManagedPaymentMutation,
  useGetAllBookingsQuery,
  useGetAdminWaitlistQuery,
  useGetAdminAbandonedBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
