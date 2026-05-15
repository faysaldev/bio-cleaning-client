import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Booking, BookingResponse, BookedSlot } from "./types";

const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, Partial<Booking>>({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking", "Dashboard"],
    }),
    getBookedSlots: builder.query<BookedSlot[], string>({
      query: (date) => ({
        url: `/bookings/booked-slots?date=${date}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getAllBookings: builder.query<BookingResponse, Record<string, any>>({
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
      invalidatesTags: ["Booking", "Dashboard"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookedSlotsQuery,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
