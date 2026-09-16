import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { ReportData } from "./types";
type Envelope<T> = { data: T; code: number; status: string; message: string };
const api = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getReports: builder.query<ReportData, { from?: string; to?: string } | void>({
    query: (params) => ({ url: "/reports", params: params || undefined }),
    transformResponse: (response: Envelope<ReportData>) => response.data,
    providesTags: ["Reporting"],
  }),
}) });
export const { useGetReportsQuery } = api;
