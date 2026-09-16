import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { AuditLogPage } from "./types";
type Envelope<T> = { data: T; code: number; status: string; message: string };
const api = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getAuditLogs: builder.query<AuditLogPage, { page?: number; limit?: number; action?: string; entityType?: string } | void>({
    query: (params) => ({ url: "/audit-logs", params: params || undefined }),
    transformResponse: (response: Envelope<AuditLogPage>) => response.data,
    providesTags: ["AuditLog"],
  }),
}) });
export const { useGetAuditLogsQuery } = api;
