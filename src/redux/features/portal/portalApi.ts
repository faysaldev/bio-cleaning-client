import { baseApi } from "../../baseApi/baseApi";
import type { Booking } from "../bookings/types";
import type { InvoiceRecord, PaymentRecord } from "../finance/types";
import type { PortalCustomer, PortalNotifications, PortalOverview, PortalPaged, PortalSession, RebookDraft } from "./types";

type ApiResponse<T> = { code: number; message: string; status: string; data: T };

const portalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestPortalLink: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/portal/auth/request", method: "POST", body }),
    }),
    exchangePortalLink: builder.mutation<PortalSession, { token: string }>({
      query: (body) => ({ url: "/portal/auth/exchange", method: "POST", body }),
      transformResponse: (r: ApiResponse<PortalSession>) => r.data,
      invalidatesTags: ["Portal"],
    }),
    getPortalSession: builder.query<PortalSession, void>({
      query: () => "/portal/session",
      transformResponse: (r: ApiResponse<PortalSession>) => r.data,
      providesTags: ["Portal"],
    }),
    logoutPortal: builder.mutation<void, void>({
      query: () => ({ url: "/portal/logout", method: "POST" }),
      invalidatesTags: ["Portal"],
    }),
    getPortalOverview: builder.query<PortalOverview, void>({
      query: () => "/portal/overview",
      transformResponse: (r: ApiResponse<PortalOverview>) => r.data,
      providesTags: ["Portal", "Notification", "Invoice", "Payment", "Booking"],
    }),
    getPortalBookings: builder.query<PortalPaged<Booking>, Record<string, unknown> | void>({
      query: (params) => ({ url: "/portal/bookings", params: params || undefined }),
      transformResponse: (r: ApiResponse<PortalPaged<Booking>>) => r.data,
      providesTags: ["Portal", "Booking"],
    }),
    cancelPortalBooking: builder.mutation<Booking, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/portal/bookings/${id}/cancel`, method: "POST", body: { reason } }),
      transformResponse: (r: ApiResponse<Booking>) => r.data,
      invalidatesTags: ["Portal", "Booking", "Notification"],
    }),
    reschedulePortalBooking: builder.mutation<Booking, { id: string; date: string; timeSlot: string }>({
      query: ({ id, ...body }) => ({ url: `/portal/bookings/${id}/reschedule`, method: "POST", body }),
      transformResponse: (r: ApiResponse<Booking>) => r.data,
      invalidatesTags: ["Portal", "Booking", "Notification"],
    }),
    getRebookDraft: builder.query<RebookDraft, string>({
      query: (id) => `/portal/bookings/${id}/rebook`,
      transformResponse: (r: ApiResponse<RebookDraft>) => r.data,
    }),
    getPortalInvoices: builder.query<InvoiceRecord[], void>({
      query: () => "/portal/invoices",
      transformResponse: (r: ApiResponse<InvoiceRecord[]>) => r.data,
      providesTags: ["Invoice", "Portal"],
    }),
    payPortalInvoice: builder.mutation<{ alreadyPaid?: boolean; url?: string }, string>({
      query: (id) => ({ url: `/portal/invoices/${id}/pay`, method: "POST" }),
      transformResponse: (r: ApiResponse<any>) => r.data,
      invalidatesTags: ["Invoice", "Payment"],
    }),
    getPortalPayments: builder.query<PaymentRecord[], void>({
      query: () => "/portal/payments",
      transformResponse: (r: ApiResponse<PaymentRecord[]>) => r.data,
      providesTags: ["Payment", "Portal"],
    }),
    updatePortalProfile: builder.mutation<PortalCustomer, Partial<PortalCustomer>>({
      query: (body) => ({ url: "/portal/profile", method: "PATCH", body }),
      transformResponse: (r: ApiResponse<PortalCustomer>) => r.data,
      invalidatesTags: ["Portal"],
    }),
    getPortalNotifications: builder.query<PortalNotifications, Record<string, unknown> | void>({
      query: (params) => ({ url: "/portal/notifications", params: params || undefined }),
      transformResponse: (r: ApiResponse<PortalNotifications>) => r.data,
      providesTags: ["Notification"],
    }),
    markPortalNotificationRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/portal/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification", "Portal"],
    }),
    markAllPortalNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/portal/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notification", "Portal"],
    }),
  }),
});

export const {
  useRequestPortalLinkMutation,
  useExchangePortalLinkMutation,
  useGetPortalSessionQuery,
  useLogoutPortalMutation,
  useGetPortalOverviewQuery,
  useGetPortalBookingsQuery,
  useCancelPortalBookingMutation,
  useReschedulePortalBookingMutation,
  useLazyGetRebookDraftQuery,
  useGetPortalInvoicesQuery,
  usePayPortalInvoiceMutation,
  useGetPortalPaymentsQuery,
  useUpdatePortalProfileMutation,
  useGetPortalNotificationsQuery,
  useMarkPortalNotificationReadMutation,
  useMarkAllPortalNotificationsReadMutation,
} = portalApi;
