import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { FieldJob, FieldOverview, JobStatus } from "./types";

type ApiResponse<T> = { code: number; status: string; message: string; data: T };

const fieldOpsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDispatchJobs: builder.query<FieldJob[], Record<string, string> | void>({
      query: (params) => ({ url: "/field-ops/jobs", method: "GET", params: params || undefined }),
      transformResponse: (response: ApiResponse<FieldJob[]>) => response.data,
      providesTags: ["FieldOps"],
    }),
    getFieldJob: builder.query<FieldJob, string>({
      query: (id) => ({ url: `/field-ops/jobs/${id}`, method: "GET" }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      providesTags: ["FieldOps"],
    }),
    getMyFieldOverview: builder.query<FieldOverview, void>({
      query: () => ({ url: "/field-ops/me/overview", method: "GET" }),
      transformResponse: (response: ApiResponse<FieldOverview>) => response.data,
      providesTags: ["FieldOps"],
    }),
    getMyJobs: builder.query<FieldJob[], { date?: string } | void>({
      query: (params) => ({ url: "/field-ops/me/jobs", method: "GET", params: params || undefined }),
      transformResponse: (response: ApiResponse<FieldJob[]>) => response.data,
      providesTags: ["FieldOps"],
    }),
    assignJob: builder.mutation<FieldJob, { id: string; staffIds?: string[]; crewId?: string | null }>({
      query: ({ id, ...body }) => ({ url: `/field-ops/jobs/${id}/assignment`, method: "PATCH", body }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
    updateJobStatus: builder.mutation<FieldJob, { id: string; status: JobStatus }>({
      query: ({ id, status }) => ({ url: `/field-ops/jobs/${id}/status`, method: "PATCH", body: { status } }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps", "Booking", "Dashboard"],
    }),
    updateJobChecklist: builder.mutation<FieldJob, { id: string; key: string; completed: boolean }>({
      query: ({ id, ...body }) => ({ url: `/field-ops/jobs/${id}/checklist`, method: "PATCH", body }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
    addJobPhoto: builder.mutation<FieldJob, { id: string; type: "BEFORE" | "AFTER" | "ISSUE"; url: string; caption?: string }>({
      query: ({ id, ...body }) => ({ url: `/field-ops/jobs/${id}/photos`, method: "POST", body }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
    addJobNote: builder.mutation<FieldJob, { id: string; text: string }>({
      query: ({ id, text }) => ({ url: `/field-ops/jobs/${id}/notes`, method: "POST", body: { text } }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
    reportJobIssue: builder.mutation<FieldJob, { id: string; title: string; description: string; severity: "LOW" | "MEDIUM" | "HIGH" | "URGENT" }>({
      query: ({ id, ...body }) => ({ url: `/field-ops/jobs/${id}/issues`, method: "POST", body }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
    resolveJobIssue: builder.mutation<FieldJob, { id: string; issueKey: string; resolution: string }>({
      query: ({ id, issueKey, resolution }) => ({ url: `/field-ops/jobs/${id}/issues/${issueKey}`, method: "PATCH", body: { resolution } }),
      transformResponse: (response: ApiResponse<FieldJob>) => response.data,
      invalidatesTags: ["FieldOps"],
    }),
  }),
});

export const { useGetDispatchJobsQuery, useGetFieldJobQuery, useGetMyFieldOverviewQuery, useGetMyJobsQuery, useAssignJobMutation, useUpdateJobStatusMutation, useUpdateJobChecklistMutation, useAddJobPhotoMutation, useAddJobNoteMutation, useReportJobIssueMutation, useResolveJobIssueMutation } = fieldOpsApi;
