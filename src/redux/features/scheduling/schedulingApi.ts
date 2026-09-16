import { baseApi } from "@/src/redux/baseApi/baseApi";
import type {
  PublicSchedulingConfig,
  ScheduleBlock,
  SchedulingSettings,
  StaffSchedule,
  StaffScheduleInput,
  ScheduleBlockInput,
} from "./types";

type ApiResponse<T> = { code: number; status: string; message: string; data: T };

const schedulingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicSchedulingConfig: builder.query<PublicSchedulingConfig, void>({
      query: () => ({ url: "/scheduling/public", method: "GET" }),
      transformResponse: (response: ApiResponse<PublicSchedulingConfig>) => response.data,
      providesTags: ["Scheduling"],
    }),
    getSchedulingSettings: builder.query<SchedulingSettings, void>({
      query: () => ({ url: "/scheduling/settings", method: "GET" }),
      transformResponse: (response: ApiResponse<SchedulingSettings>) => response.data,
      providesTags: ["Scheduling"],
    }),
    updateSchedulingSettings: builder.mutation<SchedulingSettings, Partial<SchedulingSettings>>({
      query: (data) => ({ url: "/scheduling/settings", method: "PATCH", body: data }),
      transformResponse: (response: ApiResponse<SchedulingSettings>) => response.data,
      invalidatesTags: ["Scheduling", "Booking"],
    }),
    getStaffSchedules: builder.query<StaffSchedule[], void>({
      query: () => ({ url: "/scheduling/staff", method: "GET" }),
      transformResponse: (response: ApiResponse<StaffSchedule[]>) => response.data,
      providesTags: ["Scheduling"],
    }),
    createStaffSchedule: builder.mutation<StaffSchedule, StaffScheduleInput>({
      query: (data) => ({ url: "/scheduling/staff", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<StaffSchedule>) => response.data,
      invalidatesTags: ["Scheduling", "Booking"],
    }),
    updateStaffSchedule: builder.mutation<StaffSchedule, { id: string; data: StaffScheduleInput }>({
      query: ({ id, data }) => ({ url: `/scheduling/staff/${id}`, method: "PATCH", body: data }),
      transformResponse: (response: ApiResponse<StaffSchedule>) => response.data,
      invalidatesTags: ["Scheduling", "Booking"],
    }),
    deleteStaffSchedule: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/scheduling/staff/${id}`, method: "DELETE" }),
      invalidatesTags: ["Scheduling", "Booking"],
    }),
    getScheduleBlocks: builder.query<ScheduleBlock[], void>({
      query: () => ({ url: "/scheduling/blocks", method: "GET" }),
      transformResponse: (response: ApiResponse<ScheduleBlock[]>) => response.data,
      providesTags: ["Scheduling"],
    }),
    createScheduleBlock: builder.mutation<ScheduleBlock, ScheduleBlockInput>({
      query: (data) => ({ url: "/scheduling/blocks", method: "POST", body: data }),
      transformResponse: (response: ApiResponse<ScheduleBlock>) => response.data,
      invalidatesTags: ["Scheduling", "Booking"],
    }),
    deleteScheduleBlock: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/scheduling/blocks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Scheduling", "Booking"],
    }),
  }),
});

export const {
  useGetPublicSchedulingConfigQuery,
  useGetSchedulingSettingsQuery,
  useUpdateSchedulingSettingsMutation,
  useGetStaffSchedulesQuery,
  useCreateStaffScheduleMutation,
  useUpdateStaffScheduleMutation,
  useDeleteStaffScheduleMutation,
  useGetScheduleBlocksQuery,
  useCreateScheduleBlockMutation,
  useDeleteScheduleBlockMutation,
} = schedulingApi;
