import { baseApi } from "../../baseApi/baseApi";
import type { CommunicationSummary, DeliveryRecord, PublicReview, RetentionSettings, ReviewRecord } from "./types";

type ApiResponse<T> = { code: number; message: string; status: string; data: T };
type Paged<T> = { items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } };

const api = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getCommunicationSummary: builder.query<CommunicationSummary, void>({ query: () => "/communications/summary", transformResponse: (r:ApiResponse<CommunicationSummary>)=>r.data, providesTags:["Retention","Review","Notification"] }),
  getRetentionSettings: builder.query<RetentionSettings, void>({ query: () => "/communications/settings", transformResponse:(r:ApiResponse<RetentionSettings>)=>r.data, providesTags:["Retention"] }),
  updateRetentionSettings: builder.mutation<RetentionSettings, Partial<RetentionSettings>>({ query:(body)=>({url:"/communications/settings",method:"PATCH",body}), transformResponse:(r:ApiResponse<RetentionSettings>)=>r.data, invalidatesTags:["Retention"] }),
  runCommunicationAutomation: builder.mutation<any, void>({ query:()=>({url:"/communications/run",method:"POST"}), transformResponse:(r:ApiResponse<any>)=>r.data, invalidatesTags:["Retention","Review","Notification"] }),
  getDeliveryQueue: builder.query<Paged<DeliveryRecord>, Record<string,unknown>|void>({ query:(params)=>({url:"/communications/deliveries",params:params||undefined}), transformResponse:(r:ApiResponse<Paged<DeliveryRecord>>)=>r.data, providesTags:["Notification"] }),
  retryDelivery: builder.mutation<DeliveryRecord,string>({ query:(id)=>({url:`/communications/deliveries/${id}/retry`,method:"POST"}), transformResponse:(r:ApiResponse<DeliveryRecord>)=>r.data, invalidatesTags:["Notification"] }),
  getAdminReviews: builder.query<Paged<ReviewRecord>, Record<string,unknown>|void>({ query:(params)=>({url:"/reviews",params:params||undefined}), transformResponse:(r:ApiResponse<Paged<ReviewRecord>>)=>r.data, providesTags:["Review"] }),
  resendReviewRequest: builder.mutation<any,string>({ query:(bookingId)=>({url:`/reviews/booking/${bookingId}/resend`,method:"POST"}), transformResponse:(r:ApiResponse<any>)=>r.data, invalidatesTags:["Review","Notification"] }),
  getPublicReview: builder.query<PublicReview,string>({ query:(token)=>`/reviews/public/${encodeURIComponent(token)}`, transformResponse:(r:ApiResponse<PublicReview>)=>r.data }),
  submitPublicReview: builder.mutation<{submitted:boolean;redirectUrl?:string},{token:string;rating:number;comment?:string;publishConsent?:boolean}>({ query:({token,...body})=>({url:`/reviews/public/${encodeURIComponent(token)}`,method:"POST",body}), transformResponse:(r:ApiResponse<any>)=>r.data }),
})});
export const { useGetCommunicationSummaryQuery,useGetRetentionSettingsQuery,useUpdateRetentionSettingsMutation,useRunCommunicationAutomationMutation,useGetDeliveryQueueQuery,useRetryDeliveryMutation,useGetAdminReviewsQuery,useResendReviewRequestMutation,useGetPublicReviewQuery,useSubmitPublicReviewMutation } = api;
