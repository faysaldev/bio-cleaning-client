import { baseApi } from "@/src/redux/baseApi/baseApi";
import {
  Booking,
  BookingQuote,
  BookingQuoteInput,
  BookingResponse,
  BookedSlot,
  CreateBookingInput,
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
      query: (data) => ({
        url: "/bookings/quote",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<BookingQuote>) => response.data,
    }),
    createBooking: builder.mutation<Booking, CreateBookingInput>({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    getBookedSlots: builder.query<{ data: BookedSlot[] }, string>({
      query: (date) => ({
        url: `/bookings/booked-slots?date=${encodeURIComponent(date)}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getAllBookings: builder.query<BookingResponse, Record<string, unknown>>({
      query: (params) => ({
        url: "/bookings",
        method: "GET",
        params,
      }),
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation<
      Booking,
      { id: string; status: Booking["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ApiResponse<Booking>) => response.data,
      invalidatesTags: ["Booking", "Dashboard"],
    }),
  }),
});

export const {
  useGetBookingQuoteMutation,
  useCreateBookingMutation,
  useGetBookedSlotsQuery,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
