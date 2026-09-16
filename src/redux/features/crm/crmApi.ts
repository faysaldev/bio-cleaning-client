import { baseApi } from "@/src/redux/baseApi/baseApi";
import type {
  Customer,
  Customer360,
  DataResponse,
  FollowUpQueue,
  Lead,
  LeadActivity,
  LeadBoard,
  LeadDetail,
  LeadTask,
  PaginatedResponse,
  PipelineSummary,
} from "./types";

export const crmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    capturePublicLead: builder.mutation<DataResponse<{ id: string }>, Record<string, unknown>>({
      query: (body) => ({ url: "/leads/public", method: "POST", body }),
    }),
    getLeads: builder.query<PaginatedResponse<Lead>, Record<string, any>>({
      query: (params) => ({ url: "/leads", params }),
      providesTags: ["Lead"],
    }),
    getPipeline: builder.query<DataResponse<PipelineSummary>, Record<string, any> | void>({
      query: (params) => ({ url: "/leads/pipeline", params: params || undefined }),
      providesTags: ["Lead"],
    }),
    getLeadBoard: builder.query<DataResponse<LeadBoard>, Record<string, any> | void>({
      query: (params) => ({ url: "/leads/board", params: params || undefined }),
      providesTags: ["Lead"],
    }),
    getFollowUps: builder.query<DataResponse<FollowUpQueue>, Record<string, any> | void>({
      query: (params) => ({ url: "/leads/follow-ups", params: params || undefined }),
      providesTags: ["Lead", "LeadTask"],
    }),
    getLeadOwners: builder.query<DataResponse<Array<{ _id: string; name: string; email: string; image?: string }>>, void>({
      query: () => ({ url: "/leads/owners" }),
      providesTags: ["User"],
    }),
    getLead: builder.query<DataResponse<LeadDetail>, string>({
      query: (id) => ({ url: `/leads/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Lead", id }, "LeadTask"],
    }),
    createLead: builder.mutation<DataResponse<Lead>, Record<string, unknown>>({
      query: (body) => ({ url: "/leads", method: "POST", body }),
      invalidatesTags: ["Lead", "LeadTask", "Dashboard"],
    }),
    updateLead: builder.mutation<DataResponse<Lead>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/leads/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead", "LeadTask", "Customer", "Dashboard"],
    }),
    convertLead: builder.mutation<DataResponse<{ lead: Lead; customer: Customer }>, { id: string; customer?: Record<string, unknown> }>({
      query: ({ id, customer }) => ({ url: `/leads/${id}/convert`, method: "POST", body: { customer } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead", "LeadTask", "Customer", "Dashboard"],
    }),
    addLeadActivity: builder.mutation<DataResponse<LeadActivity>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/leads/${id}/activities`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead"],
    }),
    createLeadTask: builder.mutation<DataResponse<LeadTask>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/leads/${id}/tasks`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead", "LeadTask"],
    }),
    updateLeadTask: builder.mutation<DataResponse<LeadTask>, { id: string; taskId: string; body: Record<string, unknown> }>({
      query: ({ id, taskId, body }) => ({ url: `/leads/${id}/tasks/${taskId}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }, "Lead", "LeadTask"],
    }),
    importLeads: builder.mutation<DataResponse<{ imported: number; merged: number; failed: number; errors: Array<{ row: number; message: string }> }>, { leads: Array<Record<string, unknown>> }>({
      query: (body) => ({ url: "/leads/import", method: "POST", body }),
      invalidatesTags: ["Lead", "LeadTask", "Dashboard"],
    }),
    getCustomers: builder.query<PaginatedResponse<Customer>, Record<string, any>>({
      query: (params) => ({ url: "/customers", params }),
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<DataResponse<Customer>, Record<string, unknown>>({
      query: (body) => ({ url: "/customers", method: "POST", body }),
      invalidatesTags: ["Customer", "Dashboard"],
    }),
    getCustomer: builder.query<DataResponse<Customer360>, string>({
      query: (id) => ({ url: `/customers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }, "Booking", "Lead"],
    }),
    updateCustomer: builder.mutation<DataResponse<Customer>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/customers/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Customer", id }, "Customer"],
    }),
    addCustomerNote: builder.mutation<DataResponse<Customer>, { id: string; body: string }>({
      query: ({ id, body }) => ({ url: `/customers/${id}/notes`, method: "POST", body: { body } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Customer", id }, "Customer"],
    }),
    addCustomerReview: builder.mutation<DataResponse<Customer>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/customers/${id}/reviews`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Customer", id }, "Customer"],
    }),
  }),
});

export const {
  useCapturePublicLeadMutation,
  useGetLeadsQuery,
  useGetPipelineQuery,
  useGetLeadBoardQuery,
  useGetFollowUpsQuery,
  useGetLeadOwnersQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useConvertLeadMutation,
  useAddLeadActivityMutation,
  useCreateLeadTaskMutation,
  useUpdateLeadTaskMutation,
  useImportLeadsMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useAddCustomerNoteMutation,
  useAddCustomerReviewMutation,
} = crmApi;
