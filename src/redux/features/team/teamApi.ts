import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { Crew, CrewInput, StaffInput, StaffProfile } from "./types";

type ApiResponse<T> = { code: number; status: string; message: string; data: T };

const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<StaffProfile[], Record<string, string> | void>({
      query: (params) => ({ url: "/team/staff", method: "GET", params: params || undefined }),
      transformResponse: (response: ApiResponse<StaffProfile[]>) => response.data,
      providesTags: ["Team"],
    }),
    getStaffMember: builder.query<StaffProfile, string>({
      query: (id) => ({ url: `/team/staff/${id}`, method: "GET" }),
      transformResponse: (response: ApiResponse<StaffProfile>) => response.data,
      providesTags: ["Team"],
    }),
    getMyStaffProfile: builder.query<StaffProfile, void>({
      query: () => ({ url: "/team/me", method: "GET" }),
      transformResponse: (response: ApiResponse<StaffProfile>) => response.data,
      providesTags: ["Team"],
    }),
    createStaff: builder.mutation<{ staff: StaffProfile; temporaryPassword?: string }, StaffInput>({
      query: (body) => ({ url: "/team/staff", method: "POST", body }),
      transformResponse: (response: ApiResponse<{ staff: StaffProfile; temporaryPassword?: string }>) => response.data,
      invalidatesTags: ["Team", "Scheduling"],
    }),
    updateStaff: builder.mutation<StaffProfile, { id: string; data: StaffInput }>({
      query: ({ id, data }) => ({ url: `/team/staff/${id}`, method: "PATCH", body: data }),
      transformResponse: (response: ApiResponse<StaffProfile>) => response.data,
      invalidatesTags: ["Team", "Scheduling", "FieldOps"],
    }),
    deactivateStaff: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/team/staff/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team", "Scheduling", "FieldOps"],
    }),
    getCrews: builder.query<Crew[], void>({
      query: () => ({ url: "/team/crews", method: "GET" }),
      transformResponse: (response: ApiResponse<Crew[]>) => response.data,
      providesTags: ["Team"],
    }),
    createCrew: builder.mutation<Crew, CrewInput>({
      query: (body) => ({ url: "/team/crews", method: "POST", body }),
      transformResponse: (response: ApiResponse<Crew>) => response.data,
      invalidatesTags: ["Team", "FieldOps"],
    }),
    updateCrew: builder.mutation<Crew, { id: string; data: CrewInput }>({
      query: ({ id, data }) => ({ url: `/team/crews/${id}`, method: "PATCH", body: data }),
      transformResponse: (response: ApiResponse<Crew>) => response.data,
      invalidatesTags: ["Team", "FieldOps"],
    }),
    deactivateCrew: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/team/crews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team", "FieldOps"],
    }),
  }),
});

export const { useGetStaffQuery, useGetStaffMemberQuery, useGetMyStaffProfileQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeactivateStaffMutation, useGetCrewsQuery, useCreateCrewMutation, useUpdateCrewMutation, useDeactivateCrewMutation } = teamApi;
